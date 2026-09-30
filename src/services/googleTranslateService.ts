/**
 * Google Cloud Translation REST API Service
 * Reference: https://docs.cloud.google.com/translate/docs/reference/rest
 * 
 * Implements translation to:
 * - Kinyarwanda ('rw')
 * - Kiswahili ('sw')
 * - Français ('fr')
 * - English ('en')
 * 
 * Features:
 * - REST API v2 POST https://translation.googleapis.com/language/translate/v2
 * - LocalStorage & In-Memory caching to minimize API calls
 * - Fallback to deterministic pre-compiled dictionary when offline or key not provided
 */

import { PublicLanguage } from '../types/publicSite';
import { TRANSLATIONS } from '../data/translations';

// Google Cloud Translation REST API endpoint (v2)
const CLOUD_TRANSLATE_REST_URL = 'https://translation.googleapis.com/language/translate/v2';

export interface TranslationResult {
  translatedText: string;
  sourceLanguage?: string;
  isFallback?: boolean;
}

export interface TranslationStatus {
  hasApiKey: boolean;
  activeProvider: 'Google Cloud Translation REST API' | 'Pre-compiled Verified Dictionary';
  supportedLanguages: {
    code: PublicLanguage;
    name: string;
    flag: string;
  }[];
}

class GoogleCloudTranslateService {
  private cache: Map<string, string> = new Map();
  private apiKey: string = '';

  constructor() {
    // Check environment variables for Google Cloud Translation key
    const envKey =
      (import.meta as any).env?.VITE_GOOGLE_TRANSLATE_API_KEY ||
      (import.meta as any).env?.VITE_GEMINI_API_KEY ||
      '';
    this.apiKey = envKey;
    this.loadPersistedCache();
  }

  private loadPersistedCache() {
    try {
      const saved = localStorage.getItem('trade_square_translation_cache_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([key, val]) => {
          this.cache.set(key, val as string);
        });
      }
    } catch {
      // Storage unavailable or disabled
    }
  }

  private persistCache() {
    try {
      const obj: Record<string, string> = {};
      this.cache.forEach((val, key) => {
        obj[key] = val;
      });
      localStorage.setItem('trade_square_translation_cache_v1', JSON.stringify(obj));
    } catch {
      // Ignore storage write errors
    }
  }

  public getStatus(): TranslationStatus {
    return {
      hasApiKey: Boolean(this.apiKey),
      activeProvider: this.apiKey
        ? 'Google Cloud Translation REST API'
        : 'Pre-compiled Verified Dictionary',
      supportedLanguages: [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'rw', name: 'Ikinyarwanda', flag: '🇷🇼' },
        { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' }
      ]
    };
  }

  /**
   * Translate text using Google Cloud Translation REST API
   * POST https://translation.googleapis.com/language/translate/v2
   */
  public async translateText(
    text: string,
    targetLanguage: PublicLanguage,
    sourceLanguage: string = 'en'
  ): Promise<TranslationResult> {
    if (!text || text.trim() === '') {
      return { translatedText: text, sourceLanguage };
    }

    if (targetLanguage === sourceLanguage) {
      return { translatedText: text, sourceLanguage };
    }

    const cacheKey = `${sourceLanguage}_${targetLanguage}_${text.trim()}`;
    if (this.cache.has(cacheKey)) {
      return {
        translatedText: this.cache.get(cacheKey)!,
        sourceLanguage,
        isFallback: false
      };
    }

    // Try Google Cloud Translation REST API if API Key is available
    if (this.apiKey) {
      try {
        const url = `${CLOUD_TRANSLATE_REST_URL}?key=${encodeURIComponent(this.apiKey)}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            q: [text],
            target: targetLanguage,
            source: sourceLanguage,
            format: 'text'
          })
        });

        if (response.ok) {
          const data = await response.json();
          const translated = data?.data?.translations?.[0]?.translatedText;
          if (translated) {
            // Unescape HTML entities that Google Cloud Translate may return
            const cleanText = this.decodeHtmlEntities(translated);
            this.cache.set(cacheKey, cleanText);
            this.persistCache();
            return {
              translatedText: cleanText,
              sourceLanguage,
              isFallback: false
            };
          }
        }
      } catch (err) {
        console.warn('Google Cloud Translation API request failed, falling back to local dictionary:', err);
      }
    }

    // Fallback: Check if text matches known UI string in pre-compiled dictionary
    const fallbackText = this.lookupInDictionary(text, targetLanguage, sourceLanguage);
    if (fallbackText) {
      this.cache.set(cacheKey, fallbackText);
      return {
        translatedText: fallbackText,
        sourceLanguage,
        isFallback: true
      };
    }

    // Return original text if no translation found
    return {
      translatedText: text,
      sourceLanguage,
      isFallback: true
    };
  }

  /**
   * Batch translate multiple strings using Google Cloud Translation REST API
   */
  public async translateBatch(
    texts: string[],
    targetLanguage: PublicLanguage,
    sourceLanguage: string = 'en'
  ): Promise<string[]> {
    if (targetLanguage === sourceLanguage) return texts;

    if (this.apiKey && texts.length > 0) {
      try {
        const url = `${CLOUD_TRANSLATE_REST_URL}?key=${encodeURIComponent(this.apiKey)}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            q: texts,
            target: targetLanguage,
            source: sourceLanguage,
            format: 'text'
          })
        });

        if (response.ok) {
          const data = await response.json();
          const translations: any[] = data?.data?.translations || [];
          return translations.map((t, idx) => {
            const clean = this.decodeHtmlEntities(t.translatedText || texts[idx]);
            const cacheKey = `${sourceLanguage}_${targetLanguage}_${texts[idx].trim()}`;
            this.cache.set(cacheKey, clean);
            return clean;
          });
        }
      } catch (err) {
        console.warn('Google Cloud Translation Batch request failed:', err);
      }
    }

    // Fallback item by item
    const results: string[] = [];
    for (const text of texts) {
      const res = await this.translateText(text, targetLanguage, sourceLanguage);
      results.push(res.translatedText);
    }
    return results;
  }

  private lookupInDictionary(
    text: string,
    targetLanguage: PublicLanguage,
    sourceLanguage: string = 'en'
  ): string | null {
    const srcDict = TRANSLATIONS[sourceLanguage as PublicLanguage];
    const tgtDict = TRANSLATIONS[targetLanguage];
    if (!srcDict || !tgtDict) return null;

    const trimmed = text.trim();

    // Look for matching value in source dictionary
    for (const [key, val] of Object.entries(srcDict)) {
      if (typeof val === 'string' && val.trim().toLowerCase() === trimmed.toLowerCase()) {
        const targetVal = (tgtDict as any)[key];
        if (typeof targetVal === 'string') {
          return targetVal;
        }
      }
    }

    return null;
  }

  private decodeHtmlEntities(str: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }
}

export const googleTranslateService = new GoogleCloudTranslateService();
