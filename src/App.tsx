/**
 * Trade Square — Public Website for MINICOM Rwandan Government Pilot
 * Primary Entry Point with client-side routing between all 8 public pages:
 * 1. Home
 * 2. How it works
 * 3. For SMEs
 * 4. For regional partners
 * 5. Trust and data
 * 6. Pilot
 * 7. FAQ
 * 8. Contact and request access
 *
 * Strict compliance with Government of Rwanda Web Guidelines and MINICOM Design System.
 */

import React, { useState, useEffect, useTransition } from 'react';
import { PageId, PublicLanguage } from './types/publicSite';
import { PAGES_META } from './data/publicSiteData';
import { PublicHeader } from './components/PublicHeader';
import { PublicFooter } from './components/PublicFooter';
import { SignInModal } from './components/SignInModal';
import { backgroundSiteTranslator } from './services/siteTranslator';

// Pages
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ForSmesPage } from './pages/ForSmesPage';
import { ForRegionalPartnersPage } from './pages/ForRegionalPartnersPage';
import { TrustAndDataPage } from './pages/TrustAndDataPage';
import { PilotPage } from './pages/PilotPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';

// Optional SME Pilot Portal Preview
import {
  ActiveScreen,
  RwandanSME,
  KenyanPartner,
  ExportOpportunity,
  ScoringWeights,
  CorridorAssumptions,
  PipelineItem,
  IntroductionRequest,
  PipelineStage
} from './types';
import {
  SEED_SMES,
  SEED_KENYAN_PARTNERS,
  INITIAL_ASSUMPTIONS,
  INITIAL_WEIGHTS,
  INITIAL_PIPELINE_ITEMS,
  INITIAL_INTRO_REQUESTS,
  HS_PRODUCTS
} from './data/seedData';
import { calculateMatchScore, sortAndFilterShortlist } from './utils/scoring';
import { Navigation } from './components/Navigation';
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardHome } from './components/DashboardHome';
import { PartnersFinder } from './components/PartnersFinder';
import { ProfileScreen } from './components/ProfileScreen';
import { ExportFormScreen } from './components/ExportFormScreen';
import { ShortlistScreen } from './components/ShortlistScreen';
import { MatchDetailScreen } from './components/MatchDetailScreen';
import { PipelineScreen } from './components/PipelineScreen';
import { OfficerScreen } from './components/OfficerScreen';
import { AssumptionModal } from './components/AssumptionModal';
import { IntroductionModal } from './components/IntroductionModal';
import { ArrowLeft, ExternalLink, Globe } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [currentLang, setCurrentLang] = useState<PublicLanguage>(() => backgroundSiteTranslator.getCurrentLanguage());
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [portalMode, setPortalMode] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Automatic Background Translation when language changes or route changes
  useEffect(() => {
    backgroundSiteTranslator.setLanguage(currentLang);
  }, [currentLang, currentPage, portalMode]);

  // Internal pilot portal preview mode (accessed via sign in)
  const [portalScreen, setPortalScreen] = useState<ActiveScreen>('dashboard-home');
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState<string>('');
  const [smes, setSmes] = useState<RwandanSME[]>(SEED_SMES);
  const [activeSmeId, setActiveSmeId] = useState<string>('sme-1');
  const [partners] = useState<KenyanPartner[]>(SEED_KENYAN_PARTNERS);
  const [activePartnerDetailId, setActivePartnerDetailId] = useState<string>('kp-1');
  const [assumptions, setAssumptions] = useState<CorridorAssumptions>(INITIAL_ASSUMPTIONS);
  const [weights, setWeights] = useState<ScoringWeights>(INITIAL_WEIGHTS);
  const [isAssumptionsModalOpen, setIsAssumptionsModalOpen] = useState<boolean>(false);
  const [savedPartnerIds, setSavedPartnerIds] = useState<string[]>(['kp-1', 'kp-8']);
  const [pipelineItems, setPipelineItems] = useState<PipelineItem[]>(INITIAL_PIPELINE_ITEMS);
  const [introRequests, setIntroRequests] = useState<IntroductionRequest[]>(INITIAL_INTRO_REQUESTS);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState<boolean>(false);
  const [targetIntroPartner, setTargetIntroPartner] = useState<KenyanPartner | null>(null);

  const activeSme = smes.find((s) => s.id === activeSmeId) || smes[0];

  const [opportunity, setOpportunity] = useState<ExportOpportunity>({
    productHs: activeSme.selectedHsCode || '0713',
    capacityKgMonth: activeSme.monthlyCapacityKg,
    exWorksPriceRwf: activeSme.exWorksPriceRwf,
    targetCountry: 'Kenya',
    partnerType: 'All',
    requiredCertifications: ['RSB S-Mark']
  });

  // Client-side hash routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash === 'portal') {
        setPortalMode(true);
        return;
      }
      setPortalMode(false);
      const validPages: PageId[] = [
        'home',
        'how-it-works',
        'for-smes',
        'for-regional-partners',
        'trust-and-data',
        'pilot',
        'faq',
        'contact'
      ];
      if (validPages.includes(hash as PageId)) {
        setCurrentPage(hash as PageId);
      } else if (!hash) {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update Page Title and Meta Description dynamically on page change
  useEffect(() => {
    if (portalMode) {
      document.title = 'SME Pilot Application Portal — Trade Square | MINICOM';
      return;
    }

    const meta = PAGES_META[currentPage];
    if (meta) {
      document.title = meta.title;

      // Update meta description tag
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.setAttribute('name', 'description');
        document.head.appendChild(descTag);
      }
      descTag.setAttribute('content', meta.description);

      // Update og:title and og:description
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', meta.title);
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', meta.description);
    }
  }, [currentPage, portalMode]);

  const handleNavigate = (page: PageId) => {
    startTransition(() => {
      setPortalMode(false);
      setCurrentPage(page);
      window.location.hash = `#${page}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleLaunchPortal = () => {
    setPortalMode(true);
    setPortalScreen('dashboard-home');
    window.location.hash = '#portal';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scored shortlist calculation for portal preview
  const scoredPartners = sortAndFilterShortlist(
    partners,
    opportunity,
    activeSme,
    weights,
    assumptions
  );
  const selectedPartner = partners.find((p) => p.id === activePartnerDetailId) || partners[0];
  const selectedPartnerScore = calculateMatchScore(
    selectedPartner,
    opportunity,
    activeSme,
    weights,
    assumptions
  );

  if (portalMode) {
    return (
      <>
        <DashboardLayout
          activeScreen={portalScreen}
          onSelectScreen={setPortalScreen}
          sme={activeSme}
          allSmes={smes}
          onSelectSme={(sme) => {
            setActiveSmeId(sme.id);
            const prod = HS_PRODUCTS.find((p) => p.hsCode === sme.selectedHsCode) || HS_PRODUCTS[0];
            setOpportunity({
              productHs: prod.hsCode,
              capacityKgMonth: sme.monthlyCapacityKg,
              exWorksPriceRwf: sme.exWorksPriceRwf,
              targetCountry: 'Kenya',
              partnerType: 'All',
              requiredCertifications:
                sme.certifications.length > 0 ? [sme.certifications[0]] : ['RSB S-Mark']
            });
          }}
          onUpdateSme={(updated) => {
            setSmes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
            const prod = HS_PRODUCTS.find((p) => p.hsCode === updated.selectedHsCode) || HS_PRODUCTS[0];
            setOpportunity((prevOpp) => ({
              ...prevOpp,
              productHs: prod.hsCode,
              capacityKgMonth: updated.monthlyCapacityKg,
              exWorksPriceRwf: updated.exWorksPriceRwf,
              requiredCertifications:
                updated.certifications.length > 0 ? [updated.certifications[0]] : ['RSB S-Mark']
            }));
          }}
          shortlistCount={scoredPartners.length}
          pendingIntroCount={introRequests.filter((r) => r.status === 'Pending review').length}
          searchQuery={dashboardSearchQuery}
          onSearchChange={setDashboardSearchQuery}
          onOpenAssumptions={() => setIsAssumptionsModalOpen(true)}
          onExitPortal={() => handleNavigate('home')}
          opportunity={opportunity}
          scoredPartners={scoredPartners}
          onSelectPartnerDetail={(partner) => {
            setActivePartnerDetailId(partner.id);
            setPortalScreen('match-detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onRequestIntroduction={(partner) => {
            setTargetIntroPartner(partner);
            setIsIntroModalOpen(true);
          }}
        >
          {portalScreen === 'dashboard-home' && (
            <DashboardHome
              sme={activeSme}
              opportunity={opportunity}
              scoredPartners={scoredPartners}
              savedPartnerIds={savedPartnerIds}
              pipelineItems={pipelineItems}
              introRequests={introRequests}
              searchQuery={dashboardSearchQuery}
              onToggleSavePartner={(partnerId) => {
                setSavedPartnerIds((prev) =>
                  prev.includes(partnerId)
                    ? prev.filter((id) => id !== partnerId)
                    : [...prev, partnerId]
                );
              }}
              onSelectPartnerDetail={(partner) => {
                setActivePartnerDetailId(partner.id);
                setPortalScreen('match-detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onRequestIntroduction={(partner) => {
                setTargetIntroPartner(partner);
                setIsIntroModalOpen(true);
              }}
              onNavigateScreen={setPortalScreen}
              onOpenAssumptions={() => setIsAssumptionsModalOpen(true)}
            />
          )}

          {portalScreen === 'partners-finder' && (
            <PartnersFinder
              sme={activeSme}
              partners={partners}
              opportunity={opportunity}
              assumptions={assumptions}
              savedPartnerIds={savedPartnerIds}
              onToggleSavePartner={(partnerId) => {
                setSavedPartnerIds((prev) =>
                  prev.includes(partnerId)
                    ? prev.filter((id) => id !== partnerId)
                    : [...prev, partnerId]
                );
              }}
              onSelectPartnerDetail={(partner) => {
                setActivePartnerDetailId(partner.id);
                setPortalScreen('match-detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onRequestIntroduction={(partner) => {
                setTargetIntroPartner(partner);
                setIsIntroModalOpen(true);
              }}
              onSaveOpportunity={setOpportunity}
              onBackToDashboard={() => setPortalScreen('dashboard-home')}
            />
          )}

          {portalScreen === 'profile' && (
            <ProfileScreen
              currentSme={activeSme}
              allSmes={smes}
              onSelectSme={(sme) => {
                setActiveSmeId(sme.id);
                const prod = HS_PRODUCTS.find((p) => p.hsCode === sme.selectedHsCode) || HS_PRODUCTS[0];
                setOpportunity({
                  productHs: prod.hsCode,
                  capacityKgMonth: sme.monthlyCapacityKg,
                  exWorksPriceRwf: sme.exWorksPriceRwf,
                  targetCountry: 'Kenya',
                  partnerType: 'All',
                  requiredCertifications:
                    sme.certifications.length > 0 ? [sme.certifications[0]] : ['RSB S-Mark']
                });
              }}
              onUpdateSme={(updated) =>
                setSmes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
              }
              onProceedToExportForm={() => setPortalScreen('export-form')}
            />
          )}

          {portalScreen === 'export-form' && (
            <ExportFormScreen
              currentOpportunity={opportunity}
              sme={activeSme}
              assumptions={assumptions}
              onSaveOpportunity={setOpportunity}
              onViewShortlist={() => setPortalScreen('shortlist')}
              onOpenAssumptions={() => setIsAssumptionsModalOpen(true)}
            />
          )}

          {portalScreen === 'shortlist' && (
            <ShortlistScreen
              scoredPartners={scoredPartners}
              sme={activeSme}
              opportunity={opportunity}
              savedPartnerIds={savedPartnerIds}
              onToggleSavePartner={(partnerId) => {
                setSavedPartnerIds((prev) =>
                  prev.includes(partnerId)
                    ? prev.filter((id) => id !== partnerId)
                    : [...prev, partnerId]
                );
              }}
              onRequestIntroduction={(partner) => {
                setTargetIntroPartner(partner);
                setIsIntroModalOpen(true);
              }}
              onSelectPartnerDetail={(partner) => {
                setActivePartnerDetailId(partner.id);
                setPortalScreen('match-detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {portalScreen === 'match-detail' && (
            <MatchDetailScreen
              partner={selectedPartner}
              scoreBreakdown={selectedPartnerScore}
              sme={activeSme}
              opportunity={opportunity}
              assumptions={assumptions}
              onBackToShortlist={() => setPortalScreen('dashboard-home')}
              onRequestIntroduction={(partner) => {
                setTargetIntroPartner(partner);
                setIsIntroModalOpen(true);
              }}
              isSaved={savedPartnerIds.includes(selectedPartner.id)}
              onToggleSavePartner={(partnerId) => {
                setSavedPartnerIds((prev) =>
                  prev.includes(partnerId)
                    ? prev.filter((id) => id !== partnerId)
                    : [...prev, partnerId]
                );
              }}
            />
          )}

          {portalScreen === 'pipeline' && (
            <PipelineScreen
              pipelineItems={pipelineItems}
              allPartners={partners}
              currentSme={activeSme}
              onUpdateStage={(itemId, newStage) => {
                const dateStr = new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                });
                setPipelineItems((items) =>
                  items.map((i) =>
                    i.id === itemId
                      ? {
                          ...i,
                          stage: newStage,
                          lastActivityDate: dateStr,
                          notes: [...i.notes, `${dateStr}: Stage updated to ${newStage}`]
                        }
                      : i
                  )
                );
              }}
              onAddNote={(itemId, noteText) => {
                setPipelineItems((items) =>
                  items.map((i) =>
                    i.id === itemId ? { ...i, notes: [...i.notes, noteText] } : i
                  )
                );
              }}
              onSelectPartnerDetail={(partner) => {
                setActivePartnerDetailId(partner.id);
                setPortalScreen('match-detail');
              }}
            />
          )}

          {portalScreen === 'officer-view' && (
            <OfficerScreen
              requests={introRequests}
              allSmes={smes}
              allPartners={partners}
              weights={weights}
              onUpdateWeights={setWeights}
              onApproveRequest={(requestId, notes) => {
                const refCode = `MINICOM-FAC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
                setIntroRequests((prev) =>
                  prev.map((r) =>
                    r.id === requestId
                      ? {
                          ...r,
                          status: 'Facilitation approved',
                          officerNotes: notes,
                          facilitationLetterRef: refCode
                        }
                      : r
                  )
                );
              }}
              onRequestMoreInfo={(requestId, notes) => {
                setIntroRequests((prev) =>
                  prev.map((r) =>
                    r.id === requestId
                      ? { ...r, status: 'More information requested', officerNotes: notes }
                      : r
                  )
                );
              }}
            />
          )}
        </DashboardLayout>

        <AssumptionModal
          isOpen={isAssumptionsModalOpen}
          onClose={() => setIsAssumptionsModalOpen(false)}
          assumptions={assumptions}
          onSaveAssumptions={setAssumptions}
        />

        <IntroductionModal
          isOpen={isIntroModalOpen}
          onClose={() => setIsIntroModalOpen(false)}
          partner={targetIntroPartner}
          sme={activeSme}
          opportunity={opportunity}
          assumptions={assumptions}
          onConfirm={(partner, customMessage) => {
            const dateStr = new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });
            const prod =
              HS_PRODUCTS.find((p) => p.hsCode === opportunity.productHs) || HS_PRODUCTS[0];
            const newReq: IntroductionRequest = {
              id: `req-${Date.now().toString().slice(-4)}`,
              smeId: activeSme.id,
              smeName: activeSme.businessName,
              partnerId: partner.id,
              partnerName: partner.name,
              productHs: prod.hsCode,
              productName: `${prod.name} (HS ${prod.hsCode})`,
              requestedDate: dateStr,
              status: 'Pending review',
              officerNotes:
                customMessage || 'SME requested official bilateral facilitation.'
            };
            setIntroRequests((prev) => [newReq, ...prev]);
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--white)] text-[var(--text-body)] flex flex-col antialiased selection:bg-[var(--brand-light)] selection:text-[var(--brand)]">
      {/* Official Government MINICOM Header */}
      <PublicHeader
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenSignIn={() => setIsSignInModalOpen(true)}
      />

      {/* Main Content Area with Skip Target */}
      <main
        id="main-content"
        className={`flex-1 w-full outline-none ${
          currentPage === 'home' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 py-8'
        }`}
      >
        {/* Public Website Pages (8 working screens) */}
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenSignIn={() => setIsSignInModalOpen(true)}
            currentLang={currentLang}
          />
        )}

        {currentPage === 'how-it-works' && (
          <HowItWorksPage
            onNavigate={handleNavigate}
            onOpenSignIn={() => setIsSignInModalOpen(true)}
          />
        )}

        {currentPage === 'for-smes' && (
          <ForSmesPage
            onNavigate={handleNavigate}
            onOpenSignIn={() => setIsSignInModalOpen(true)}
          />
        )}

        {currentPage === 'for-regional-partners' && (
          <ForRegionalPartnersPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'trust-and-data' && (
          <TrustAndDataPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'pilot' && <PilotPage onNavigate={handleNavigate} />}

        {currentPage === 'faq' && <FaqPage onNavigate={handleNavigate} />}

        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onLaunchInteractivePortal={handleLaunchPortal}
      />

      {/* Official Government MINICOM Footer */}
      <PublicFooter onNavigate={handleNavigate} currentLang={currentLang} />
    </div>
  );
}
