/**
 * Automated Background Site-Wide Translator
 * Reference: https://docs.cloud.google.com/translate/docs/reference/rest
 * 
 * Works 100% in the background without any visible widgets or intrusive popups:
 * - Listens to navbar language selection ('rw' | 'sw' | 'fr' | 'en')
 * - When target language is 'en', immediately restores original English text
 * - When target language is 'rw', 'sw', or 'fr', collects text nodes across the active page
 * - Translates text in parallel batches using Google Cloud Translation REST API
 * - Uses in-memory & localStorage caching for instant zero-latency responses on repeated views
 * - Preserves DOM structure, event handlers, SVGs, inputs, and button click callbacks
 */

import { PublicLanguage } from '../types/publicSite';
import { googleTranslateService } from './googleTranslateService';
import { TRANSLATIONS } from '../data/translations';

// Elements to ignore during background translation
const IGNORED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'SVG',
  'PATH',
  'CODE',
  'PRE',
  'VIDEO',
  'AUDIO',
  'CANVAS',
  'IFRAME',
  'INPUT',
  'TEXTAREA'
]);

class BackgroundSiteTranslator {
  private activeLanguage: PublicLanguage = 'en';
  private isTranslating: boolean = false;
  private queuedLanguage: PublicLanguage | null = null;

  public async setLanguage(targetLang: PublicLanguage) {
    if (this.activeLanguage === targetLang && targetLang !== 'en') {
      return;
    }

    this.activeLanguage = targetLang;
    document.documentElement.lang = targetLang;

    try {
      localStorage.setItem('trade_square_lang', targetLang);
    } catch {
      // storage unavailable
    }

    if (targetLang === 'en') {
      this.restoreOriginalText();
      return;
    }

    if (this.isTranslating) {
      this.queuedLanguage = targetLang;
      return;
    }

    await this.translateActivePage(targetLang);
  }

  public getCurrentLanguage(): PublicLanguage {
    try {
      const saved = localStorage.getItem('trade_square_lang') as PublicLanguage;
      if (saved && (saved === 'en' || saved === 'rw' || saved === 'sw' || saved === 'fr')) {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'en';
  }

  /**
   * Restores all text elements back to their original English strings
   */
  public restoreOriginalText() {
    const elements = document.querySelectorAll('[data-orig-en]');
    elements.forEach((el) => {
      const original = el.getAttribute('data-orig-en');
      if (original !== null) {
        // If element only had text
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
          el.childNodes[0].nodeValue = original;
        } else {
          el.textContent = original;
        }
      }
    });
  }

  /**
   * Scans visible page and translates all text in the background
   */
  public async translateActivePage(targetLang: PublicLanguage) {
    if (targetLang === 'en') {
      this.restoreOriginalText();
      return;
    }

    this.isTranslating = true;

    try {
      // Gather text-containing elements in main content area
      const root = document.getElementById('root') || document.body;
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode(node: Element) {
            if (IGNORED_TAGS.has(node.tagName)) {
              return NodeFilter.FILTER_REJECT;
            }
            if (node.getAttribute('data-no-translate') === 'true') {
              return NodeFilter.FILTER_REJECT;
            }
            // Only translate leaf-like text elements or headings/paragraphs/buttons
            if (
              node.children.length === 0 &&
              node.textContent &&
              node.textContent.trim().length > 1
            ) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          }
        }
      );

      const elementsToTranslate: { element: Element; originalText: string }[] = [];
      let currentNode: Node | null = walker.nextNode();

      while (currentNode) {
        const el = currentNode as Element;
        // Check if original English is already stored
        let origText = el.getAttribute('data-orig-en');
        if (!origText) {
          origText = el.textContent?.trim() || '';
          if (origText && !this.isPurelyNumericOrSymbolic(origText)) {
            el.setAttribute('data-orig-en', origText);
          }
        }

        if (origText && !this.isPurelyNumericOrSymbolic(origText)) {
          elementsToTranslate.push({ element: el, originalText: origText });
        }

        currentNode = walker.nextNode();
      }

      // Fast check: Apply verified pre-compiled translations first
      const pendingElements: { element: Element; text: string }[] = [];
      const pendingTexts: string[] = [];

      for (const item of elementsToTranslate) {
        const knownTranslation = this.findInCompiledDictionary(item.originalText, targetLang);
        if (knownTranslation) {
          if (item.element.childNodes.length === 1 && item.element.childNodes[0].nodeType === Node.TEXT_NODE) {
            item.element.childNodes[0].nodeValue = knownTranslation;
          } else {
            item.element.textContent = knownTranslation;
          }
        } else {
          pendingElements.push({ element: item.element, text: item.originalText });
          pendingTexts.push(item.originalText);
        }
      }

      // Translate remaining texts in background using Google Cloud Translation REST API
      if (pendingTexts.length > 0) {
        // Break into chunks of 15 strings for efficient network transport
        const chunkSize = 15;
        for (let i = 0; i < pendingTexts.length; i += chunkSize) {
          const chunkTexts = pendingTexts.slice(i, i + chunkSize);
          const chunkElements = pendingElements.slice(i, i + chunkSize);

          const translatedChunk = await googleTranslateService.translateBatch(
            chunkTexts,
            targetLang,
            'en'
          );

          chunkElements.forEach((item, idx) => {
            const translated = translatedChunk[idx];
            if (translated && this.activeLanguage === targetLang) {
              if (item.element.childNodes.length === 1 && item.element.childNodes[0].nodeType === Node.TEXT_NODE) {
                item.element.childNodes[0].nodeValue = translated;
              } else {
                item.element.textContent = translated;
              }
            }
          });
        }
      }
    } catch (err) {
      console.warn('Background page translation encountered a minor issue:', err);
    } finally {
      this.isTranslating = false;

      // If user selected another language while previous was running
      if (this.queuedLanguage && this.queuedLanguage !== targetLang) {
        const nextLang = this.queuedLanguage;
        this.queuedLanguage = null;
        this.translateActivePage(nextLang);
      }
    }
  }

  private isPurelyNumericOrSymbolic(text: string): boolean {
    const trimmed = text.trim();
    // Exclude single characters, pure numbers, prices, dates, percentages
    return (
      trimmed.length <= 1 ||
      /^[0-9\s.,/%$€£¥+-]+$/.test(trimmed) ||
      /^[A-Z0-9_-]{1,4}$/.test(trimmed)
    );
  }

  private findInCompiledDictionary(englishText: string, targetLang: PublicLanguage): string | null {
    const enDict = TRANSLATIONS.en as Record<string, any>;
    const targetDict = TRANSLATIONS[targetLang] as Record<string, any>;
    if (!enDict || !targetDict) return null;

    const trimmed = englishText.trim().toLowerCase();

    for (const key of Object.keys(enDict)) {
      const val = enDict[key];
      if (typeof val === 'string' && val.trim().toLowerCase() === trimmed) {
        const tVal = targetDict[key];
        if (typeof tVal === 'string') return tVal;
      }
    }
    return null;
  }
}

export const backgroundSiteTranslator = new BackgroundSiteTranslator();
