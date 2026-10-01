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
import { LoginPage } from './pages/LoginPage';

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
import { TrendsScreen } from './components/TrendsScreen';
import { PartnersFinder } from './components/PartnersFinder';
import { ProfileScreen } from './components/ProfileScreen';
import { ExportFormScreen } from './components/ExportFormScreen';
import { ShortlistScreen } from './components/ShortlistScreen';
import { MatchDetailScreen } from './components/MatchDetailScreen';
import { PipelineScreen } from './components/PipelineScreen';
import { AssumptionModal } from './components/AssumptionModal';
import { IntroductionModal } from './components/IntroductionModal';
import { TradeChat } from './components/TradeChat';
import { ArrowLeft, ExternalLink, Globe } from 'lucide-react';
import { AccountCreationType } from './components/CreateAccountDropdown';
import {
  auth,
  onAuthStateChanged,
  User as FirebaseUser,
  FirestoreUserProfile,
  subscribeToUserProfile,
  saveUserProfileToFirestore,
  updateSavedPartnersInFirestore,
  signOutFirebaseUser,
  firestoreProfileToRwandanSME
} from './services/firebase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedAccountType, setSelectedAccountType] = useState<AccountCreationType>('business');
  const [currentLang, setCurrentLang] = useState<PublicLanguage>(() => backgroundSiteTranslator.getCurrentLanguage());
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [portalMode, setPortalMode] = useState<boolean>(false);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Real Firebase Authentication & Firestore Profile State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [firestoreProfile, setFirestoreProfile] = useState<FirestoreUserProfile | null>(null);

  useEffect(() => {
    const handleQuota = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthReady(true);
      if (!user) {
        setFirestoreProfile(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Attach real-time Firestore listener ONLY when auth is ready and user is authenticated
  useEffect(() => {
    if (!authReady || !firebaseUser) return;

    const unsubscribeProfile = subscribeToUserProfile(firebaseUser.uid, (profile) => {
      if (profile) {
        setFirestoreProfile(profile);
        const mappedSme = firestoreProfileToRwandanSME(profile, firebaseUser.photoURL);
        setSmes((prev) => {
          const filtered = prev.filter((s) => s.id !== mappedSme.id);
          return [mappedSme, ...filtered];
        });
        setActiveSmeId(mappedSme.id);
        setSavedPartnerIds(
          profile.savedPartnerIds && profile.savedPartnerIds.length > 0
            ? profile.savedPartnerIds
            : ['kp-1', 'kp-8']
        );
        const prod =
          HS_PRODUCTS.find((p) => p.hsCode === mappedSme.selectedHsCode) || HS_PRODUCTS[0];
        setOpportunity({
          productHs: prod.hsCode,
          capacityKgMonth: mappedSme.monthlyCapacityKg,
          exWorksPriceRwf: mappedSme.exWorksPriceRwf,
          targetCountry: 'Kenya',
          partnerType: 'All',
          requiredCertifications:
            mappedSme.certifications.length > 0
              ? [mappedSme.certifications[0]]
              : ['RSB S-Mark']
        });
      } else {
        // Provision initial Firestore profile for newly authenticated real user
        saveUserProfileToFirestore(firebaseUser).then((created) => {
          setFirestoreProfile(created);
        });
      }
    });

    return () => unsubscribeProfile();
  }, [authReady, firebaseUser]);

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
  const [weights] = useState<ScoringWeights>(INITIAL_WEIGHTS);
  const [isAssumptionsModalOpen, setIsAssumptionsModalOpen] = useState<boolean>(false);
  const [savedPartnerIds, setSavedPartnerIds] = useState<string[]>(['kp-1', 'kp-8']);
  const [pipelineItems, setPipelineItems] = useState<PipelineItem[]>(INITIAL_PIPELINE_ITEMS);
  const [introRequests, setIntroRequests] = useState<IntroductionRequest[]>(INITIAL_INTRO_REQUESTS);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState<boolean>(false);
  const [targetIntroPartner, setTargetIntroPartner] = useState<KenyanPartner | null>(null);

  const activeSme =
    firebaseUser && firestoreProfile
      ? firestoreProfileToRwandanSME(firestoreProfile, firebaseUser.photoURL)
      : smes.find((s) => s.id === activeSmeId) || smes[0];

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
        'contact',
        'login'
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

  const handleNavigate = (page: PageId, accountType?: AccountCreationType) => {
    startTransition(() => {
      if (accountType) {
        setSelectedAccountType(accountType);
      }
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

  const handleToggleSavePartner = (partnerId: string) => {
    setSavedPartnerIds((prev) => {
      const next = prev.includes(partnerId)
        ? prev.filter((id) => id !== partnerId)
        : [...prev, partnerId];
      if (firebaseUser) {
        updateSavedPartnersInFirestore(firebaseUser.uid, next);
      }
      return next;
    });
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

  if (portalMode && (!authReady || firebaseUser)) {
    return (
      <>
        {gmpQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}
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
            if (firebaseUser) {
              saveUserProfileToFirestore(
                firebaseUser,
                {
                  businessName: updated.businessName,
                  rdbNumber: updated.rdbNumber,
                  tin: updated.tin,
                  district: updated.district,
                  contactPerson: updated.contactPerson,
                  phone: updated.phone,
                  email: updated.email,
                  selectedHsCode: updated.selectedHsCode,
                  products: updated.products,
                  certifications: updated.certifications,
                  monthlyCapacityKg: updated.monthlyCapacityKg,
                  exWorksPriceRwf: updated.exWorksPriceRwf
                },
                firestoreProfile
              );
            }
          }}
          shortlistCount={scoredPartners.length}
          pendingIntroCount={introRequests.filter((r) => r.status === 'Pending review').length}
          searchQuery={dashboardSearchQuery}
          onSearchChange={setDashboardSearchQuery}
          onOpenAssumptions={() => setIsAssumptionsModalOpen(true)}
          onExitPortal={async () => {
            if (firebaseUser) {
              await signOutFirebaseUser();
            }
            handleNavigate('login');
          }}
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
              partners={partners}
              assumptions={assumptions}
              scoredPartners={scoredPartners}
              savedPartnerIds={savedPartnerIds}
              pipelineItems={pipelineItems}
              introRequests={introRequests}
              searchQuery={dashboardSearchQuery}
              onToggleSavePartner={handleToggleSavePartner}
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

          {portalScreen === 'trends' && (
            <TrendsScreen
              sme={activeSme}
              opportunity={opportunity}
              partners={partners}
              assumptions={assumptions}
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
              onToggleSavePartner={handleToggleSavePartner}
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
              onUpdateSme={(updated) => {
                setSmes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
                if (firebaseUser) {
                  saveUserProfileToFirestore(
                    firebaseUser,
                    {
                      businessName: updated.businessName,
                      rdbNumber: updated.rdbNumber,
                      tin: updated.tin,
                      district: updated.district,
                      contactPerson: updated.contactPerson,
                      phone: updated.phone,
                      email: updated.email,
                      selectedHsCode: updated.selectedHsCode,
                      products: updated.products,
                      certifications: updated.certifications,
                      monthlyCapacityKg: updated.monthlyCapacityKg,
                      exWorksPriceRwf: updated.exWorksPriceRwf
                    },
                    firestoreProfile
                  );
                }
              }}
              onProceedToExportForm={() => setPortalScreen('export-form')}
            />
          )}

          {portalScreen === 'export-form' && (
            <ExportFormScreen
              currentOpportunity={opportunity}
              sme={activeSme}
              partners={partners}
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
              onToggleSavePartner={handleToggleSavePartner}
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
              onToggleSavePartner={handleToggleSavePartner}
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
        onOpenSignIn={() => handleNavigate('login')}
      />

      {/* Main Content Area with Skip Target */}
      <main
        id="main-content"
        className={`flex-1 w-full outline-none ${
          currentPage === 'home' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 py-8'
        }`}
      >
        {/* Public Website Pages */}
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenSignIn={() => handleNavigate('login')}
            currentLang={currentLang}
          />
        )}

        {currentPage === 'how-it-works' && (
          <HowItWorksPage
            onNavigate={handleNavigate}
            onOpenSignIn={() => handleNavigate('login')}
          />
        )}

        {currentPage === 'for-smes' && (
          <ForSmesPage
            onNavigate={handleNavigate}
            onOpenSignIn={() => handleNavigate('login')}
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

        {currentPage === 'contact' && (
          <ContactPage
            initialAccountType={selectedAccountType}
            firebaseUser={firebaseUser}
            firestoreProfile={firestoreProfile}
            onLaunchPortal={handleLaunchPortal}
          />
        )}

        {(currentPage === 'login' || (portalMode && authReady && !firebaseUser)) && (
          <LoginPage
            onLaunchInteractivePortal={handleLaunchPortal}
            onNavigate={handleNavigate}
            firebaseUser={firebaseUser}
            firestoreProfile={firestoreProfile}
          />
        )}
      </main>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onLaunchInteractivePortal={handleLaunchPortal}
        onCreateAccount={(type) => handleNavigate('contact', type)}
      />

      {/* Trade Square AI Chatbot on Homepage */}
      {currentPage === 'home' && (
        <TradeChat
          sme={activeSme}
          opportunity={opportunity}
          scoredPartners={scoredPartners}
          onSelectPartnerDetail={(partner) => {
            setActivePartnerDetailId(partner.id);
            setPortalMode(true);
            setPortalScreen('match-detail');
            window.location.hash = '#portal';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onRequestIntroduction={(partner) => {
            setTargetIntroPartner(partner);
            setPortalMode(true);
            setIsIntroModalOpen(true);
            window.location.hash = '#portal';
          }}
        />
      )}

      {/* Official Government MINICOM Footer */}
      <PublicFooter onNavigate={handleNavigate} currentLang={currentLang} />
    </div>
  );
}
