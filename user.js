/**
 * Brgy360 - Resident Portal Script (user.js)
 * Single-Page Architecture (SPA) Tab Routing, State Management,
 * Form Validation, and Local Storage Persistence.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ==========================================================
  // 1. DATA INITIALIZATION & LOCALSTORAGE MANAGEMENT
  // ==========================================================

  const DEFAULT_USER = {
    name: 'Juan Dela Cruz',
    email: 'juan@gmail.com',
    mobile: '0917 123 4567',
    dob: '1992-06-15',
    civilStatus: 'Single',
    address: '142 Pallocan Blvd, Barangay Pallocan West',
    sitio: 'Sitio Ibaba',
    city: 'Batangas City, Batangas',
    residentId: 'PW-2026-08492',
    verified: true,
    verificationTier: 'Level 2: Fully Verified Resident',
    idOnRecord: 'Philippine National ID (PhilID) • ****-****-8492',
    avatarInitial: 'J',
    password: 'UserPassword360!'
  };

  const DEFAULT_SERVICES = [
    {
      id: 'clearance',
      name: 'Barangay Clearance',
      fee: '₱50.00',
      isFree: false,
      turnaround: '1–2 Working Days',
      desc: 'Official clearance certifying good moral character and no pending derogatory record in Barangay Pallocan West.',
      requirements: 'Valid Govt ID, Cedula / Community Tax Certificate'
    },
    {
      id: 'residency',
      name: 'Certificate of Residency',
      fee: '₱50.00',
      isFree: false,
      turnaround: '1–2 Working Days',
      desc: 'Attestation that the applicant is a bonafide resident living at their declared address in the barangay.',
      requirements: 'Proof of Address / Utility bill, 1 Valid ID'
    },
    {
      id: 'indigency',
      name: 'Certificate of Indigency',
      fee: 'FREE',
      isFree: true,
      turnaround: 'Same Day / 1 Day',
      desc: 'Issued to low-income residents for medical, financial, burial, educational, or legal assistance.',
      requirements: 'Case study referral or Purok Leader certification'
    },
    {
      id: 'business',
      name: 'Barangay Business Clearance',
      fee: '₱200.00',
      isFree: false,
      turnaround: '2–3 Working Days',
      desc: 'Prerequisite clearance for commercial establishments, sari-sari stores, and enterprises operating in Pallocan West.',
      requirements: 'DTI / SEC Registration, Contract of Lease / Land Title'
    },
    {
      id: 'jobseeker',
      name: 'First-Time Jobseeker (RA 11261)',
      fee: 'FREE',
      isFree: true,
      turnaround: '1 Working Day',
      desc: 'Issued free of charge under RA 11261 to first-time jobseekers applying for government credentials.',
      requirements: 'Oath of Undertaking signed before Punong Barangay'
    },
    {
      id: 'mediation',
      name: 'Katarungang Pambarangay Mediation',
      fee: 'FREE',
      isFree: true,
      turnaround: '3–5 Working Days',
      desc: 'Formal filing for amicable community dispute conciliation before the Lupon Tagapamayapa.',
      requirements: 'Complete narrative of complaint and parties involved'
    }
  ];

  const DEFAULT_REQUESTS = [
    {
      ref: 'BRGY-84291',
      docType: 'Barangay Clearance',
      purpose: 'Local Employment (SM Batangas City application)',
      dateFiled: '2026-10-02',
      claimMethod: 'Physical Pickup at Barangay Hall',
      claimTarget: 'October 5, 2026 (Window 2)',
      status: 'Ready for Pickup',
      notes: 'Cleared by Lupong Tagapamayapa. Document printed and sealed. Ready for collection.'
    },
    {
      ref: 'BRGY-81409',
      docType: 'First-Time Jobseeker (RA 11261)',
      purpose: 'Pre-Employment NBI Clearance requirement',
      dateFiled: '2026-10-03',
      claimMethod: 'Physical Pickup at Barangay Hall',
      claimTarget: 'October 6, 2026 (Window 2)',
      status: 'In Review',
      notes: 'Under review by Barangay Secretary for RA 11261 qualification check.'
    },
    {
      ref: 'BRGY-79104',
      docType: 'Certificate of Residency',
      purpose: 'Bank Account Opening (BDO Batangas)',
      dateFiled: '2026-09-15',
      claimMethod: 'Physical Pickup at Barangay Hall',
      claimTarget: 'September 16, 2026',
      status: 'Completed',
      notes: 'Claimed by resident on September 16, 2026. Official Receipt #84920.'
    }
  ];

  const DEFAULT_CONCERNS = [
    {
      ref: 'TCK-4021',
      id: 'TCK-4021',
      title: 'Flickering Streetlight Creating Nighttime Blind Spot',
      category: 'Infrastructure',
      urgency: 'Standard',
      sitio: 'Sitio Ibaba',
      landmark: 'Main Road Pedestrian Walkway',
      location: 'Sitio Ibaba — Main Road Pedestrian Walkway',
      dateFiled: '2026-10-14',
      status: 'In Progress',
      currentStage: 2,
      desc: 'Streetlight has been flickering and completely goes dark after 8:00 PM. Creates a blind spot for pedestrians and students walking home at night.',
      reporter: 'Juan Dela Cruz',
      userEmail: 'juan.delacruz@example.com',
      userMobile: '0917 123 4567',
      userAddress: '142 Pallocan Blvd, Barangay Pallocan West',
      residentId: 'PW-2026-08492',
      resolutionNote: 'Inspected by BPSO Night Patrol on Oct 15. Coordinated with City Engineering Public Lighting Office for LED fixture replacement.'
    },
    {
      ref: 'TCK-4018',
      id: 'TCK-4018',
      title: 'Heavy Siltation and Plastic Clog Blocking Culvert Outflow',
      category: 'Infrastructure',
      urgency: 'Urgent',
      sitio: 'Sitio Ibaba',
      landmark: 'Culvert Outflow Channel',
      location: 'Sitio Ibaba — Culvert Outflow Channel',
      dateFiled: '2026-10-15',
      status: 'Pending',
      currentStage: 1,
      desc: 'Drainage culvert outflow is heavily clogged with silt and plastic debris, causing rapid street ponding whenever heavy rain falls.',
      reporter: 'Clarisse Anne Villanueva',
      userEmail: 'clarisse.villanueva@gmail.com',
      userMobile: '0917 554 8219',
      userAddress: '082 Sitio Ibaba Road, Barangay Pallocan West',
      residentId: 'PW-2026-08510',
      resolutionNote: ''
    },
    {
      ref: 'TCK-4015',
      id: 'TCK-4015',
      title: 'Low-Hanging Power Cable Across Basketball Court Access Road',
      category: 'Public Utility',
      urgency: 'Urgent',
      sitio: 'Tierra Verde',
      landmark: 'Near Covered Court Gate',
      location: 'Tierra Verde — Near Covered Court Gate',
      dateFiled: '2026-10-13',
      status: 'In Progress',
      currentStage: 2,
      desc: 'Secondary utility line sagging approximately 2.1 meters above the road, posing a hazard to delivery vans and pedestrians.',
      reporter: 'Eduardo Castillo Jr.',
      userEmail: 'eddie.castillo.ph@yahoo.com',
      userMobile: '0920 891 2345',
      userAddress: 'Block 14 Lot 6, Tierra Verde, Barangay Pallocan West',
      residentId: 'PW-2026-08514',
      resolutionNote: 'Cordoned off by BPSO Tanod Patrol. Utility emergency crew dispatched for cable re-tensioning.'
    },
    {
      ref: 'TCK-4009',
      id: 'TCK-4009',
      title: 'Uncollected Domestic Waste Bags Along Interior Easement',
      category: 'Sanitation',
      urgency: 'Standard',
      sitio: 'Sitio Santolan',
      landmark: 'Villa Celina Corner',
      location: 'Sitio Santolan — Villa Celina Corner',
      dateFiled: '2026-10-11',
      status: 'Pending',
      currentStage: 1,
      desc: 'Several sacks of household waste missed during Tuesday collection are attracting stray animals along the corner walkway.',
      reporter: 'Maria Santos Alcantara',
      userEmail: 'maria.alcantara@gmail.com',
      userMobile: '0918 345 6789',
      userAddress: 'Block 3 Lot 8, Villa Celina, Barangay Pallocan West',
      residentId: 'PW-2026-08502',
      resolutionNote: ''
    },
    {
      ref: 'TCK-3994',
      id: 'TCK-3994',
      title: 'Late-Night Karaoke Exceeding 10:00 PM Quiet Hours Ordinance',
      category: 'Noise Disturbance',
      urgency: 'Standard',
      sitio: 'Sitio Ilaya',
      landmark: 'Crossing Ilaya Interior',
      location: 'Sitio Ilaya — Crossing Ilaya Interior',
      dateFiled: '2026-10-08',
      status: 'Resolved',
      currentStage: 3,
      desc: 'Loud outdoor amplifier operating past midnight on weeknights, disturbing elderly residents and students.',
      reporter: 'Mark Anthony Balmes',
      userEmail: 'mark.balmes@outlook.com',
      userMobile: '0927 348 9120',
      userAddress: '105 Crossing Ilaya Road, Barangay Pallocan West',
      residentId: 'PW-2026-08521',
      resolutionNote: 'BPSO Night Patrol visited the household and reminded the owner of Barangay Curfew & Quiet Hours Ordinance. Full compliance achieved.'
    },
    {
      ref: 'TCK-3890',
      id: 'TCK-3890',
      title: 'Garden Waste and Branch Trimmings Obstructing Sidewalk',
      category: 'Sanitation',
      urgency: 'Standard',
      sitio: 'Sitio Santolan',
      landmark: 'Main Sidewalk Strip',
      location: 'Sitio Santolan — Main Sidewalk Strip',
      dateFiled: '2026-09-22',
      status: 'Resolved',
      currentStage: 3,
      desc: 'Piles of branch trimmings and garden waste left on sidewalk obstructing pedestrian pathway.',
      reporter: 'Juan Dela Cruz',
      userEmail: 'juan.delacruz@example.com',
      userMobile: '0917 123 4567',
      userAddress: '142 Pallocan Blvd, Barangay Pallocan West',
      residentId: 'PW-2026-08492',
      resolutionNote: 'Barangay Green Waste collection truck dispatched on Sep 23, 10:30 AM. Area cleared and sidewalk swept.'
    },
    {
      ref: 'TCK-3412',
      id: 'TCK-3412',
      title: 'Unleashed Stray Dogs Near Elementary School Walkway',
      category: 'Public Safety',
      urgency: 'Urgent',
      sitio: 'Sitio Ilaya',
      landmark: 'Near Pallocan West Elementary Gate',
      location: 'Sitio Ilaya — Near Pallocan West Elementary Gate',
      dateFiled: '2026-09-08',
      status: 'Resolved',
      currentStage: 3,
      desc: 'Unleashed aggressive dogs barking and chasing students walking to Pallocan West Elementary.',
      reporter: 'Juan Dela Cruz',
      userEmail: 'juan.delacruz@example.com',
      userMobile: '0917 123 4567',
      userAddress: '142 Pallocan Blvd, Barangay Pallocan West',
      residentId: 'PW-2026-08492',
      resolutionNote: 'Joint operation by Barangay Tanod and City Veterinary Office on Sep 9. Dog owners notified and safety patrol stationed during school hours.'
    }
  ];

  const DEFAULT_PROPOSALS = [
    {
      ref: 'PROP-8421',
      title: 'Installation of Solar LED Streetlights along Sitio Ibaba Riverbank Walkway',
      category: 'Infrastructure',
      location: 'Sitio Ibaba',
      budget: 150000,
      timeline: 'Q1 2027 (3 months implementation)',
      dateFiled: '2026-09-28',
      status: 'Under BDC Review',
      rationale: 'The riverbank pathway is heavily traversed by over 300 residents daily but lacks grid electricity. Standalone solar lights provide clean, zero-grid-cost illumination to prevent accidents and deter nighttime criminality.',
      councilNote: 'Endorsed for technical site survey by the Committee on Infrastructure. Calendar for prioritization during the Barangay Assembly Deliberation.'
    }
  ];

  const DEFAULT_NOTIFS = [
    {
      id: 1,
      title: 'Request Ready for Pickup',
      desc: 'Your Barangay Clearance (BRGY-84291) is approved and signed. Claim at Window 2.',
      time: '2 hours ago',
      unread: true,
      type: 'blue'
    },
    {
      id: 2,
      title: 'Concern Site Inspection Completed',
      desc: 'BPSO Team completed site validation on concern TCK-4021 (Streetlight repair).',
      time: '1 day ago',
      unread: true,
      type: 'amber'
    },
    {
      id: 3,
      title: 'Typhoon Advisory Level 1',
      desc: 'Barangay Disaster Risk Council issues alert for heavy rains. Hotline: 0917-888-BRGY.',
      time: '2 days ago',
      unread: true,
      type: 'green'
    }
  ];

  // Helper to load or initialize localStorage
  function loadData(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading data for key ' + key, e);
      return fallback;
    }
  }

  function saveData(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Error saving data for key ' + key, e);
    }
  }

  const CANONICAL_SITIOS = [
    'Sitio Ibaba',
    'Sitio Santolan',
    'Sitio Ilaya',
    'Sitio Gitna',
    'Tierra Verde',
    'Potenciana Village',
    'G.C Berberabe'
  ];

  function normalizeSitioName(val) {
    if (!val || typeof val !== 'string') return 'Sitio Ibaba';
    const trimmed = val.trim();
    if (CANONICAL_SITIOS.includes(trimmed)) return trimmed;
    const lower = trimmed.toLowerCase();
    if (lower.includes('santolan')) return 'Sitio Santolan';
    if (lower.includes('ilaya')) return 'Sitio Ilaya';
    if (lower.includes('gitna')) return 'Sitio Gitna';
    if (lower.includes('potenciana')) return 'Potenciana Village';
    if (lower.includes('tierra verde')) return 'Tierra Verde';
    if (lower.includes('berberabe')) return 'G.C Berberabe';
    return 'Sitio Ibaba';
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeConcernUrgency(val) {
    const s = String(val || '').trim().toLowerCase();
    if (s.includes('urgent') || s.includes('critical') || s.includes('high')) {
      return 'Urgent';
    }
    return 'Standard';
  }

  function normalizeConcernStatus(val) {
    const s = String(val || '').trim().toLowerCase();
    if (s === 'resolved' || s === 'completed' || s === 'closed') {
      return 'Resolved';
    }
    if (s === 'in progress' || s === 'in review' || s === 'inspection scheduled' || s === 'under review') {
      return 'In Progress';
    }
    return 'Pending';
  }

  function normalizeConcernCategory(val) {
    const s = String(val || '').trim();
    if (!s) return 'Infrastructure';
    if (s === 'Noise') return 'Noise Disturbance';
    if (s === 'Utilities') return 'Public Utility';
    return s;
  }

  function normalizeConcernRecord(raw) {
    const item = raw && typeof raw === 'object' ? raw : {};
    const ref = item.ref || item.id || ('TCK-' + Math.floor(1000 + Math.random() * 9000));
    const category = normalizeConcernCategory(item.category);
    const status = normalizeConcernStatus(item.status);
    const urgency = normalizeConcernUrgency(item.urgency || item.severity);
    const sitio = normalizeSitioName(item.sitio || item.location);
    const landmark = item.landmark || '';
    const location = item.location || (landmark ? `${sitio} — ${landmark}` : sitio);
    const desc = item.desc || item.submittedDetails || item.notes || item.summary || '';
    const title = item.title || item.summary || (desc ? (desc.length > 64 ? desc.slice(0, 61) + '...' : desc) : `${category} Concern`);
    const isJuanLegacy = ['TCK-4021', 'TCK-3890', 'TCK-3412'].includes(ref);

    return {
      ref: ref,
      id: ref,
      title: title,
      desc: desc,
      category: category,
      urgency: urgency,
      status: status,
      currentStage: status === 'Resolved' ? 3 : (status === 'In Progress' ? 2 : 1),
      dateFiled: item.dateFiled || item.dateLogged || new Date().toISOString().split('T')[0],
      sitio: sitio,
      landmark: landmark,
      location: location,
      reporter: item.reporter || (isJuanLegacy ? DEFAULT_USER.name : 'Verified Resident'),
      userEmail: item.userEmail || (isJuanLegacy ? DEFAULT_USER.email : ''),
      userMobile: item.userMobile || (isJuanLegacy ? DEFAULT_USER.mobile : ''),
      userAddress: item.userAddress || (isJuanLegacy ? DEFAULT_USER.address : sitio + ', Barangay Pallocan West'),
      residentId: item.residentId || (isJuanLegacy ? DEFAULT_USER.residentId : ''),
      photoName: item.photoName || null,
      photoData: item.photoData || null,
      resolutionNote: item.resolutionNote !== undefined ? item.resolutionNote : (item.actionTaken || ''),
      updatedAt: item.updatedAt || null
    };
  }

  function isConcernOwnedByUser(concern, user) {
    if (!concern || !user) return false;
    const uId = String(user.residentId || '').trim().toLowerCase();
    const cId = String(concern.residentId || '').trim().toLowerCase();
    if (uId && cId && uId === cId) return true;

    const uEmail = String(user.email || '').trim().toLowerCase();
    const cEmail = String(concern.userEmail || '').trim().toLowerCase();
    if (uEmail && cEmail && uEmail === cEmail) return true;

    const uName = String(user.name || '').trim().toLowerCase();
    const cName = String(concern.reporter || '').trim().toLowerCase();
    if (uName && cName && uName === cName) return true;

    // Match pre-configured Juan Dela Cruz across both login emails
    if ((uEmail === 'juan@gmail.com' || uEmail === 'juan.delacruz@example.com') &&
        (cEmail === 'juan@gmail.com' || cEmail === 'juan.delacruz@example.com' || cName.includes('juan dela cruz') || cName.includes('juan m. dela cruz'))) {
      return true;
    }
    return false;
  }

  // Load app state
  let currentUser = loadData('brgy360_user', DEFAULT_USER);
  if (currentUser && typeof currentUser === 'object') {
    currentUser.sitio = normalizeSitioName(currentUser.sitio);
    if (!currentUser.password) {
      try {
        const residentsDb = JSON.parse(localStorage.getItem('brgy360_residents_db') || '[]');
        const userEmail = (currentUser.email || '').trim().toLowerCase();
        const foundInDb = residentsDb.find(u => u.email && u.email.trim().toLowerCase() === userEmail);
        if (foundInDb && foundInDb.password) {
          currentUser.password = foundInDb.password;
        } else {
          currentUser.password = DEFAULT_USER.password;
        }
      } catch (e) {
        currentUser.password = DEFAULT_USER.password;
      }
    }
  }
  let userRequests = loadData('brgy360_requests', DEFAULT_REQUESTS);

  function loadAndSyncAllConcerns() {
    let rawList = loadData('brgy360_concerns', DEFAULT_CONCERNS);
    if (!Array.isArray(rawList)) rawList = [...DEFAULT_CONCERNS];
    let normalized = rawList.map(normalizeConcernRecord);

    // Seed shared multi-resident concerns once if upgrading from legacy store
    if (!localStorage.getItem('brgy360_concerns_connected_v3')) {
      const existingRefs = new Set(normalized.map(c => c.ref));
      DEFAULT_CONCERNS.forEach(seed => {
        if (!existingRefs.has(seed.ref)) {
          normalized.push(normalizeConcernRecord(seed));
        } else {
          // Enrich legacy seeded record with title & reporter metadata while keeping status/notes
          const idx = normalized.findIndex(c => c.ref === seed.ref);
          if (idx !== -1) {
            if (!rawList[idx].title) normalized[idx].title = seed.title;
            if (!rawList[idx].reporter) normalized[idx].reporter = seed.reporter;
            if (!rawList[idx].userEmail) normalized[idx].userEmail = seed.userEmail;
            if (!rawList[idx].userMobile) normalized[idx].userMobile = seed.userMobile;
            if (!rawList[idx].residentId) normalized[idx].residentId = seed.residentId;
          }
        }
      });
      localStorage.setItem('brgy360_concerns_connected_v3', 'true');
    }

    saveData('brgy360_concerns', normalized);
    return normalized;
  }

  let allConcerns = loadAndSyncAllConcerns();
  let userConcerns = allConcerns.filter(c => isConcernOwnedByUser(c, currentUser));
  function refreshUserConcernsState() {
    allConcerns = loadAndSyncAllConcerns();
    userConcerns = allConcerns.filter(c => isConcernOwnedByUser(c, currentUser));
  }
  let userProposals = loadData('brgy360_proposals', DEFAULT_PROPOSALS);
  if (Array.isArray(userProposals)) {
    userProposals.forEach((p) => {
      if (p) p.location = normalizeSitioName(p.location);
    });
  }
  let userNotifications = loadData('brgy360_notifs', DEFAULT_NOTIFS);

  // Set active session
  localStorage.setItem('brgy360_session', 'active');

  // ==========================================================
  // 2. DOM ELEMENT SELECTORS
  // ==========================================================

  // Tab buttons and panels
  const sidebarNavLinks = document.querySelectorAll('.sidebar-nav-link');
  const userTabPanels = document.querySelectorAll('.user-tab-panel');
  const breadcrumbTitle = document.getElementById('breadcrumbTitle');

  // Topbar dropdowns
  const notifBellBtn = document.getElementById('notifBellBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const notifList = document.getElementById('notifList');
  const notifCountBadge = document.getElementById('notifCountBadge');
  const notifUnreadCount = document.getElementById('notifUnreadCount');
  const markAllReadBtn = document.getElementById('markAllReadBtn');

  const userProfileBtn = document.getElementById('userProfileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const topbarLogoutBtn = document.getElementById('topbarLogoutBtn');
  const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');

  // Mobile sidebar
  const sidebarToggle = document.getElementById('sidebarToggle');
  const userSidebar = document.getElementById('userSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  // Toast
  const portalToast = document.getElementById('portalToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');
  let toastTimer = null;

  // Modals
  const docRequestModal = document.getElementById('docRequestModal');
  const closeDocModalBtn = document.getElementById('closeDocModalBtn');
  const btnCancelDocModal = document.getElementById('btnCancelDocModal');
  const btnOpenNewDocModal = document.getElementById('btnOpenNewDocModal');
  const docApplicationForm = document.getElementById('docApplicationForm');
  const modalDocType = document.getElementById('modalDocType');

  const concernModal = document.getElementById('concernModal');
  const closeConcernModalBtn = document.getElementById('closeConcernModalBtn');
  const btnCancelConcernModal = document.getElementById('btnCancelConcernModal');
  const btnOpenNewConcernModal = document.getElementById('btnOpenNewConcernModal');
  const concernReportForm = document.getElementById('concernReportForm');

  const proposalModal = document.getElementById('proposalModal');
  const closeProposalModalBtn = document.getElementById('closeProposalModalBtn');
  const btnCancelPropModal = document.getElementById('btnCancelPropModal');
  const btnOpenNewProposalModal = document.getElementById('btnOpenNewProposalModal');
  const proposalSubmitForm = document.getElementById('proposalSubmitForm');

  const detailViewerModal = document.getElementById('detailViewerModal');
  const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
  const detailModalTitle = document.getElementById('detailModalTitle');
  const detailModalKicker = document.getElementById('detailModalKicker');
  const detailModalBody = document.getElementById('detailModalBody');

  // Confirmation Modal Elements
  const actionConfirmModal = document.getElementById('actionConfirmModal');
  const closeConfirmModalBtn = document.getElementById('closeConfirmModalBtn');
  const btnCancelConfirmModal = document.getElementById('btnCancelConfirmModal');
  const btnExecuteConfirmAction = document.getElementById('btnExecuteConfirmAction');
  const confirmModalKicker = document.getElementById('confirmModalKicker');
  const confirmModalTitle = document.getElementById('confirmModalTitle');
  const confirmModalIconBox = document.getElementById('confirmModalIconBox');
  const confirmModalMessage = document.getElementById('confirmModalMessage');
  const confirmModalDetailsBox = document.getElementById('confirmModalDetailsBox');

  let pendingActionCallback = null;

  // Quick Action triggers on dashboard
  const btnDashNewRequest = document.getElementById('btnDashNewRequest');
  const btnDashNewConcern = document.getElementById('btnDashNewConcern');
  const scRequestDoc = document.getElementById('scRequestDoc');
  const scFileConcern = document.getElementById('scFileConcern');
  const scProposeProj = document.getElementById('scProposeProj');

  // Account forms
  const updateProfileForm = document.getElementById('updateProfileForm');
  const changePasswordForm = document.getElementById('changePasswordForm');
  const idUploadForm = document.getElementById('idUploadForm');

  // File input labels
  const modalDocAttachment = document.getElementById('modalDocAttachment');
  const modalDocAttachmentName = document.getElementById('modalDocAttachmentName');
  const modalConcernPhoto = document.getElementById('modalConcernPhoto');
  const modalConcernPhotoName = document.getElementById('modalConcernPhotoName');
  const newIdFile = document.getElementById('newIdFile');
  const newIdFileName = document.getElementById('newIdFileName');

  // ==========================================================
  // 3. TOAST NOTIFICATION UTILITY
  // ==========================================================

  function showToast(title, desc, isError = false) {
    if (!portalToast) return;
    if (toastTimer) clearTimeout(toastTimer);

    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;

    portalToast.style.display = 'flex';
    portalToast.style.borderColor = isError ? '#fecaca' : '#bbf7d0';

    const iconWrap = document.getElementById('toastIcon');
    if (iconWrap) {
      iconWrap.style.background = isError ? '#dc2626' : '#16a34a';
    }

    toastTimer = setTimeout(function () {
      portalToast.style.display = 'none';
    }, 4000);
  }

  // ==========================================================
  // 4. TAB ROUTING (SPA NAVIGATION)
  // ==========================================================

  const TAB_NAMES = {
    dashboard: 'Dashboard Home',
    services: 'My Service Requests',
    reports: 'My Concerns & Complaints',
    proposals: 'Propose a Project',
    account: 'My Account & Verification'
  };

  function switchTab(tabId) {
    if (!tabId || !TAB_NAMES[tabId]) tabId = 'dashboard';

    // Update active nav links
    sidebarNavLinks.forEach(function (link) {
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update active panels
    userTabPanels.forEach(function (panel) {
      if (panel.id === 'user-' + tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update breadcrumb
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = TAB_NAMES[tabId];
    }

    // Update URL hash without full reload
    window.location.hash = tabId;

    // Close mobile drawer if open
    closeMobileSidebar();

    // Scroll to top of main viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.getElementById('userMain');
    if (mainEl) mainEl.scrollTop = 0;
  }

  // Attach click listeners to sidebar tabs
  sidebarNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      const tab = this.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Attach click listeners to any element with data-goto-tab
  document.querySelectorAll('[data-goto-tab]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const targetTab = this.getAttribute('data-goto-tab');
      switchTab(targetTab);
      // Close profile dropdown if open
      if (profileDropdown) profileDropdown.classList.remove('active');
    });
  });

  // Handle URL hash on page load
  function handleInitialHash() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && TAB_NAMES[hash]) {
      switchTab(hash);
    } else {
      switchTab('dashboard');
    }
  }

  window.addEventListener('hashchange', function () {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && TAB_NAMES[hash]) {
      switchTab(hash);
    }
  });

  // ==========================================================
  // 5. MOBILE DRAWER NAVIGATION
  // ==========================================================

  function openMobileSidebar() {
    if (userSidebar) userSidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    if (userSidebar) userSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function () {
      if (userSidebar && userSidebar.classList.contains('open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // ==========================================================
  // 6. TOPBAR DROPDOWNS (NOTIFICATIONS & PROFILE)
  // ==========================================================

  function toggleDropdown(menu) {
    const isOpen = menu.classList.contains('active');
    // Close other dropdowns first
    if (notifDropdown) notifDropdown.classList.remove('active');
    if (profileDropdown) profileDropdown.classList.remove('active');

    if (!isOpen) {
      menu.classList.add('active');
    }
  }

  if (notifBellBtn && notifDropdown) {
    notifBellBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDropdown(notifDropdown);
    });
  }

  if (userProfileBtn && profileDropdown) {
    userProfileBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDropdown(profileDropdown);
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', function (e) {
    if (notifDropdown && !notifDropdown.contains(e.target) && e.target !== notifBellBtn) {
      notifDropdown.classList.remove('active');
    }
    if (profileDropdown && !profileDropdown.contains(e.target) && e.target !== userProfileBtn) {
      profileDropdown.classList.remove('active');
    }
  });

  // Render notifications
  function renderNotifications() {
    if (!notifList) return;
    const unreadCount = userNotifications.filter(n => n.unread).length;

    if (notifCountBadge) {
      notifCountBadge.textContent = unreadCount;
      notifCountBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

    if (notifUnreadCount) {
      notifUnreadCount.textContent = unreadCount + ' unread notice' + (unreadCount === 1 ? '' : 's');
    }

    if (userNotifications.length === 0) {
      notifList.innerHTML = '<div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 13px;">No notifications.</div>';
      return;
    }

    let html = '';
    userNotifications.forEach(function (n) {
      html += `
        <div class="notif-item ${n.unread ? 'unread' : ''}" data-notif-id="${n.id}">
          <div class="notif-item-icon ${n.type}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <div class="notif-item-text">
            <h5 class="notif-item-title">${n.title}</h5>
            <p class="notif-item-desc">${n.desc}</p>
            <span class="notif-item-time">${n.time}</span>
          </div>
        </div>
      `;
    });
    notifList.innerHTML = html;

    // Attach click handler to mark individual as read
    notifList.querySelectorAll('.notif-item').forEach(function (item) {
      item.addEventListener('click', function () {
        const id = parseInt(this.getAttribute('data-notif-id'), 10);
        const itemObj = userNotifications.find(n => n.id === id);
        if (itemObj) {
          itemObj.unread = false;
          saveData('brgy360_notifs', userNotifications);
          renderNotifications();
        }
      });
    });
  }

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', function () {
      userNotifications.forEach(n => { n.unread = false; });
      saveData('brgy360_notifs', userNotifications);
      renderNotifications();
      showToast('Notifications Updated', 'All notices marked as read.');
    });
  }

  // ==========================================================
  // 7. USER PROFILE SYNCHRONIZATION
  // ==========================================================

  function syncUserDisplays() {
    const name = currentUser.name || 'Juan Dela Cruz';
    const initial = currentUser.avatarInitial || name.charAt(0).toUpperCase();
    const sitio = normalizeSitioName(currentUser.sitio);
    const email = currentUser.email || 'juan.delacruz@example.com';
    const mobile = currentUser.mobile || '0917 123 4567';
    const address = currentUser.address || 'Barangay Pallocan West';

    // Topbar
    const topbarAvatar = document.getElementById('topbarAvatar');
    const topbarUserName = document.getElementById('topbarUserName');
    if (topbarAvatar) topbarAvatar.textContent = initial;
    if (topbarUserName) topbarUserName.textContent = name;

    // Dropdown
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    const dropdownUserTier = document.getElementById('dropdownUserTier');
    if (dropdownAvatar) dropdownAvatar.textContent = initial;
    if (dropdownUserName) dropdownUserName.textContent = name;
    if (dropdownUserEmail) dropdownUserEmail.textContent = email;
    if (dropdownUserTier) dropdownUserTier.textContent = sitio + ' • Resident ID: ' + (currentUser.residentId || 'PW-2026-08492');

    // Sidebar
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserStatus = document.getElementById('sidebarUserStatus');
    if (sidebarAvatar) sidebarAvatar.textContent = initial;
    if (sidebarUserName) sidebarUserName.textContent = name;
    if (sidebarUserStatus) sidebarUserStatus.textContent = 'Verified Resident • ' + sitio;

    // Dashboard Welcome
    const welcomeUserName = document.getElementById('welcomeUserName');
    const welcomeVerificationBadge = document.getElementById('welcomeVerificationBadge');
    if (welcomeUserName) welcomeUserName.textContent = name;
    if (welcomeVerificationBadge) welcomeVerificationBadge.textContent = 'Verified Resident • ' + sitio;

    // Account tab
    const accountAvatar = document.getElementById('accountAvatar');
    const accountFullName = document.getElementById('accountFullName');
    const accountSitio = document.getElementById('accountSitio');
    const accountDob = document.getElementById('accountDob');
    const accountGender = document.getElementById('accountGender');
    const accountCivilStatus = document.getElementById('accountCivilStatus');
    if (accountAvatar) accountAvatar.textContent = initial;
    if (accountFullName) accountFullName.textContent = name;
    if (accountSitio) accountSitio.textContent = sitio;
    if (accountDob) accountDob.textContent = currentUser.dob || 'June 15, 1992';
    if (accountGender) accountGender.textContent = currentUser.gender || 'Male';
    if (accountCivilStatus) accountCivilStatus.textContent = currentUser.civilStatus || 'Single';

    // Edit form inputs
    const profileMobile = document.getElementById('profileMobile');
    const profileEmail = document.getElementById('profileEmail');
    const profileAddress = document.getElementById('profileAddress');
    const profileSitio = document.getElementById('profileSitio');
    if (profileMobile) profileMobile.value = mobile;
    if (profileEmail) profileEmail.value = email;
    if (profileAddress) profileAddress.value = address;
    if (profileSitio) profileSitio.value = sitio;

    // Request Modal Prefills
    const modalDocFullName = document.getElementById('modalDocFullName');
    const modalDocMobile = document.getElementById('modalDocMobile');
    const modalDocSitio = document.getElementById('modalDocSitio');
    const modalDocAddress = document.getElementById('modalDocAddress');
    if (modalDocFullName) modalDocFullName.value = name;
    if (modalDocMobile) modalDocMobile.value = mobile;
    if (modalDocSitio) modalDocSitio.value = sitio;
    if (modalDocAddress) modalDocAddress.value = address;

    // Concern Modal Prefills
    const modalConcernReporter = document.getElementById('modalConcernReporter');
    const modalConcernContact = document.getElementById('modalConcernContact');
    const modalConcernSitio = document.getElementById('modalConcernSitio');
    const modalConcernDate = document.getElementById('modalConcernDate');
    if (modalConcernReporter) modalConcernReporter.value = name;
    if (modalConcernContact) modalConcernContact.value = mobile + ' • ' + email;
    if (modalConcernSitio && !modalConcernSitio.value) modalConcernSitio.value = sitio;
    if (modalConcernDate && !modalConcernDate.value) modalConcernDate.value = new Date().toISOString().split('T')[0];
  }

  // Date banner update
  function updateDateBanner() {
    const dateEl = document.getElementById('welcomeCurrentDate');
    if (!dateEl) return;
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-PH', options);
  }

  // ==========================================================
  // 8. RENDER DASHBOARD KPIS & ACTIVITY FEED
  // ==========================================================

  function renderDashboardKPIs() {
    // 1. Service requests
    const activeReqs = userRequests.filter(r => r.status !== 'Completed' && r.status !== 'Rejected' && r.status !== 'Cancelled');
    const kpiActiveRequests = document.getElementById('kpiActiveRequests');
    if (kpiActiveRequests) kpiActiveRequests.textContent = activeReqs.length;

    // Sidebar counter
    const sidebarServicesCount = document.getElementById('sidebarServicesCount');
    if (sidebarServicesCount) sidebarServicesCount.textContent = activeReqs.length;

    // 2. Concerns
    const kpiTotalConcerns = document.getElementById('kpiTotalConcerns');
    if (kpiTotalConcerns) kpiTotalConcerns.textContent = userConcerns.length;

    const pendingConcernsCount = userConcerns.filter(c => c.status === 'Pending').length;
    const inProgressConcernsCount = userConcerns.filter(c => c.status === 'In Progress').length;
    const resolvedConcernsCount = userConcerns.filter(c => c.status === 'Resolved').length;
    const openConcernsCount = pendingConcernsCount + inProgressConcernsCount;

    const sidebarReportsCount = document.getElementById('sidebarReportsCount');
    if (sidebarReportsCount) sidebarReportsCount.textContent = openConcernsCount;

    const kpiConcernsStatusSub = document.getElementById('kpiConcernsStatusSub');
    if (kpiConcernsStatusSub) {
      const pills = [];
      if (pendingConcernsCount > 0) {
        pills.push(`<span class="status-pill status-pending">${pendingConcernsCount} Pending</span>`);
      }
      if (inProgressConcernsCount > 0) {
        pills.push(`<span class="status-pill status-in-review">${inProgressConcernsCount} In Progress</span>`);
      }
      if (resolvedConcernsCount > 0 || pills.length === 0) {
        pills.push(`<span class="status-pill status-resolved">${resolvedConcernsCount} Resolved</span>`);
      }
      kpiConcernsStatusSub.innerHTML = pills.join('');
    }

    // 3. Proposals
    const kpiTotalProposals = document.getElementById('kpiTotalProposals');
    if (kpiTotalProposals) kpiTotalProposals.textContent = userProposals.length;
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Ready for Pickup': return 'status-ready';
      case 'In Progress':
      case 'In Review': return 'status-in-review';
      case 'Pending':
      case 'New': return 'status-pending';
      case 'Completed': return 'status-completed';
      case 'Resolved': return 'status-resolved';
      case 'Cancelled': return 'status-cancelled';
      case 'Standard': return 'status-standard';
      case 'Rejected':
      case 'Urgent': return 'status-urgent';
      default: return 'status-pending';
    }
  }

  function renderDashboardActivityTable() {
    const tbody = document.getElementById('dashActivityTableBody');
    if (!tbody) return;

    // Combine recent items
    const combined = [];

    userRequests.forEach(function (r) {
      combined.push({
        ref: r.ref,
        subject: r.docType,
        subtext: r.purpose,
        date: r.dateFiled,
        status: r.status,
        type: 'Service Request',
        raw: r
      });
    });

    userConcerns.forEach(function (c) {
      combined.push({
        ref: c.ref,
        subject: c.title || (c.category + ' Concern'),
        subtext: c.category + ' • ' + c.location,
        date: c.dateFiled,
        status: c.status,
        type: 'Citizen Concern',
        raw: c
      });
    });

    userProposals.forEach(function (p) {
      combined.push({
        ref: p.ref,
        subject: p.title,
        subtext: 'Budget: ₱' + Number(p.budget).toLocaleString(),
        date: p.dateFiled,
        status: p.status,
        type: 'Project Proposal',
        raw: p
      });
    });

    // Sort by date descending
    combined.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (combined.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 24px;">No recent transactions on record.</td></tr>';
      return;
    }

    let rowsHtml = '';
    combined.slice(0, 5).forEach(function (item) {
      const badgeClass = getStatusBadgeClass(item.status);
      rowsHtml += `
        <tr>
          <td style="vertical-align: middle;"><span class="table-ref-code">${item.ref}</span></td>
          <td style="vertical-align: middle;">
            <div class="table-subject-meta">
              <span class="table-subject-title">${item.subject}</span>
              <span class="table-subject-sub">${item.subtext}</span>
            </div>
          </td>
          <td style="white-space: nowrap; vertical-align: middle;">${item.date}</td>
          <td style="white-space: nowrap; vertical-align: middle;"><span class="status-pill ${badgeClass}">${item.status}</span></td>
          <td style="white-space: nowrap; vertical-align: middle;">
            <button type="button" class="btn-table-action" data-view-ref="${item.ref}">View</button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = rowsHtml;

    // Attach listeners to View buttons
    tbody.querySelectorAll('[data-view-ref]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-view-ref');
        openDetailViewer(ref);
      });
    });
  }

  // ==========================================================
  // 9. TAB 2: SERVICES CATALOG & REQUEST TRACKER
  // ==========================================================

  function renderServicesCatalog() {
    const grid = document.getElementById('servicesCatalogGrid');
    if (!grid) return;

    let html = '';
    DEFAULT_SERVICES.forEach(function (s) {
      html += `
        <div class="service-card-apply">
          <div class="service-apply-header">
            <h4 class="service-apply-title">${s.name}</h4>
            <span class="service-fee-tag ${s.isFree ? 'free' : ''}">${s.fee}</span>
          </div>
          <p class="service-apply-desc">${s.desc}</p>
          <div class="service-apply-meta">
            <span class="service-turnaround">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${s.turnaround}</span>
            </span>
            <button type="button" class="btn-service-start" data-request-doc="${s.name}">Apply Now</button>
          </div>
        </div>
      `;
    });
    grid.innerHTML = html;

    // Attach click to "Apply Now"
    grid.querySelectorAll('[data-request-doc]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const docName = this.getAttribute('data-request-doc');
        openDocModalWithPreset(docName);
      });
    });
  }

  // ==========================================================
  // ACTION CONFIRMATION & DIALOG UTILITIES
  // ==========================================================

  function showActionConfirmModal({
    kicker = 'APPLICATION ACTION',
    title = 'Confirm Action',
    type = 'default',
    message = '',
    detailsHtml = '',
    confirmText = 'Confirm',
    cancelText = 'Go Back',
    isAlertOnly = false,
    onConfirm = null
  }) {
    if (!actionConfirmModal) return;

    if (confirmModalKicker) confirmModalKicker.textContent = kicker;
    if (confirmModalTitle) confirmModalTitle.textContent = title;
    if (confirmModalMessage) confirmModalMessage.innerHTML = message;

    if (confirmModalDetailsBox) {
      if (detailsHtml) {
        confirmModalDetailsBox.innerHTML = detailsHtml;
        confirmModalDetailsBox.style.display = 'block';
      } else {
        confirmModalDetailsBox.innerHTML = '';
        confirmModalDetailsBox.style.display = 'none';
      }
    }

    if (confirmModalIconBox) {
      if (type === 'delete') {
        confirmModalIconBox.innerHTML = `
          <div style="width: 44px; height: 44px; border-radius: 10px; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #0f172a; font-weight: 700;">Permanent Deletion</h4>
            <p style="margin: 0; font-size: 12.5px; color: #64748b;">This completed application will be permanently removed from your history.</p>
          </div>
        `;
      } else if (type === 'cancel') {
        confirmModalIconBox.innerHTML = `
          <div style="width: 44px; height: 44px; border-radius: 10px; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #0f172a; font-weight: 700;">Cancel Document Application</h4>
            <p style="margin: 0; font-size: 12.5px; color: #64748b;">Processing will be halted immediately.</p>
          </div>
        `;
      } else {
        confirmModalIconBox.innerHTML = `
          <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #0f172a; font-weight: 700;">Notice</h4>
            <p style="margin: 0; font-size: 12.5px; color: #64748b;">Barangay service processing rule</p>
          </div>
        `;
      }
    }

    if (btnExecuteConfirmAction) {
      btnExecuteConfirmAction.textContent = confirmText;
      btnExecuteConfirmAction.className = type === 'delete' ? 'btn-dash-danger' : (type === 'cancel' ? 'btn-dash-warning' : 'btn-dash-primary');
      if (isAlertOnly) {
        btnExecuteConfirmAction.style.display = 'none';
      } else {
        btnExecuteConfirmAction.style.display = 'inline-flex';
      }
    }

    if (btnCancelConfirmModal) {
      btnCancelConfirmModal.textContent = isAlertOnly ? 'Close' : cancelText;
    }

    pendingActionCallback = onConfirm;
    openModal(actionConfirmModal);
  }

  function handleCancelRequest(ref) {
    const req = userRequests.find(r => r.ref === ref);
    if (!req) return;

    if (req.status === 'Ready for Pickup') {
      showActionConfirmModal({
        kicker: 'CANCELLATION NOT ALLOWED',
        title: 'Document Already Ready for Pickup',
        type: 'warning',
        isAlertOnly: true,
        message: `Application <strong>${req.ref}</strong> for <strong>${req.docType}</strong> cannot be cancelled because it is already marked <strong>Ready for Pickup</strong> at Barangay Hall (Window 2). The official document has already been verified, printed, and dry-sealed. If you no longer need this certificate, please inform the staff at Window 2.`,
        detailsHtml: `
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Reference No.:</span>
            <strong class="table-ref-code">${req.ref}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Document:</span>
            <strong>${req.docType}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Status:</span>
            <span class="status-pill status-ready">${req.status}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Claiming Mode:</span>
            <span>${req.claimMethod}</span>
          </div>
        `,
        cancelText: 'Understood'
      });
      return;
    }

    if (req.status === 'Completed') {
      showToast('Cannot Cancel', 'This request is already completed and claimed.', true);
      return;
    }

    if (req.status === 'Cancelled') {
      showToast('Already Cancelled', 'This application was already cancelled.', true);
      return;
    }

    // Eligible for cancellation (e.g. 'In Review', 'Pending')
    showActionConfirmModal({
      kicker: 'CANCEL APPLICATION REQUEST',
      title: 'Cancel Document Request?',
      type: 'cancel',
      message: `Are you sure you want to cancel your application for <strong>${req.docType}</strong>? This will stop further review and processing by barangay staff.`,
      detailsHtml: `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Reference No.:</span>
          <strong class="table-ref-code">${req.ref}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Document:</span>
          <strong>${req.docType}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Current Status:</span>
          <span class="status-pill ${getStatusBadgeClass(req.status)}">${req.status}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #64748b;">Date Submitted:</span>
          <span>${req.dateFiled}</span>
        </div>
      `,
      confirmText: 'Yes, Cancel Request',
      cancelText: 'Keep Request',
      onConfirm: function () {
        req.status = 'Cancelled';
        const todayStr = new Date().toISOString().split('T')[0];
        req.notes = (req.notes ? req.notes + ' ' : '') + `Cancelled by resident on ${todayStr}.`;
        saveData('brgy360_user_requests', userRequests);

        userNotifications.unshift({
          id: 'notif-' + Date.now(),
          title: 'Request Cancelled',
          desc: `Application ${req.ref} for ${req.docType} has been cancelled.`,
          time: 'Just now',
          unread: true,
          type: 'amber'
        });
        saveData('brgy360_notifs', userNotifications);

        renderRequestsTable();
        renderDashboardKPIs();
        renderDashboardActivityTable();
        renderNotifications();
        showToast('Request Cancelled', `Application ${req.ref} has been cancelled.`);
      }
    });
  }

  function handleDeleteRequest(ref) {
    const req = userRequests.find(r => r.ref === ref);
    if (!req) return;

    if (req.status !== 'Completed') {
      showActionConfirmModal({
        kicker: 'DELETION NOT ALLOWED',
        title: 'Only Completed Applications Can Be Deleted',
        type: 'warning',
        isAlertOnly: true,
        message: `Application <strong>${req.ref}</strong> currently has status <strong>${req.status}</strong>. Per barangay auditing policy, applications can only be deleted from your history once they are marked <strong>Completed</strong>. Active, in-review, and ready-for-pickup requests must remain on record to track issuance.`,
        detailsHtml: `
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Reference No.:</span>
            <strong class="table-ref-code">${req.ref}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Document:</span>
            <strong>${req.docType}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Current Status:</span>
            <span class="status-pill ${getStatusBadgeClass(req.status)}">${req.status}</span>
          </div>
        `,
        cancelText: 'Understood'
      });
      return;
    }

    // Eligible for deletion (status === 'Completed')
    showActionConfirmModal({
      kicker: 'PERMANENT DELETION',
      title: 'Delete Completed Application?',
      type: 'delete',
      message: `Are you sure you want to permanently remove completed application <strong>${req.ref}</strong> (<strong>${req.docType}</strong>) from your application history?`,
      detailsHtml: `
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Reference No.:</span>
          <strong class="table-ref-code">${req.ref}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Document:</span>
          <strong>${req.docType}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Status:</span>
          <span class="status-pill status-completed">${req.status}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #64748b;">Date Claimed:</span>
          <span>${req.claimTarget || req.dateFiled}</span>
        </div>
      `,
      confirmText: 'Yes, Delete Record',
      cancelText: 'Keep Record',
      onConfirm: function () {
        userRequests = userRequests.filter(r => r.ref !== ref);
        saveData('brgy360_user_requests', userRequests);

        userNotifications.unshift({
          id: 'notif-' + Date.now(),
          title: 'Record Deleted',
          desc: `Completed application record ${req.ref} (${req.docType}) was removed from your history.`,
          time: 'Just now',
          unread: false,
          type: 'blue'
        });
        saveData('brgy360_notifs', userNotifications);

        renderRequestsTable();
        renderDashboardKPIs();
        renderDashboardActivityTable();
        renderNotifications();
        showToast('Record Deleted', `Application ${req.ref} has been removed from your history.`);
      }
    });
  }

  function renderRequestsTable() {
    const tbody = document.getElementById('servicesRequestsTableBody');
    if (!tbody) return;

    const searchVal = (document.getElementById('requestsSearchInput')?.value || '').toLowerCase().trim();
    const activeFilterBtn = document.querySelector('#requestsFilterPills .filter-pill-btn.active');
    const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'All';

    // Update filter counts
    const countAll = userRequests.length;
    const countReady = userRequests.filter(r => r.status === 'Ready for Pickup').length;
    const countReview = userRequests.filter(r => r.status === 'In Review').length;
    const countDone = userRequests.filter(r => r.status === 'Completed').length;
    const countCancel = userRequests.filter(r => r.status === 'Cancelled').length;

    const countAllEl = document.getElementById('countAllReq');
    const countReadyEl = document.getElementById('countReadyReq');
    const countReviewEl = document.getElementById('countReviewReq');
    const countDoneEl = document.getElementById('countDoneReq');
    const countCancelEl = document.getElementById('countCancelReq');
    if (countAllEl) countAllEl.textContent = countAll;
    if (countReadyEl) countReadyEl.textContent = countReady;
    if (countReviewEl) countReviewEl.textContent = countReview;
    if (countDoneEl) countDoneEl.textContent = countDone;
    if (countCancelEl) countCancelEl.textContent = countCancel;

    // Filter requests
    const filtered = userRequests.filter(function (r) {
      const matchFilter = filter === 'All' || r.status === filter;
      const matchSearch = !searchVal || 
        r.ref.toLowerCase().includes(searchVal) ||
        r.docType.toLowerCase().includes(searchVal) ||
        r.purpose.toLowerCase().includes(searchVal) ||
        r.status.toLowerCase().includes(searchVal);
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 32px;">No requests found matching your filter criteria.</td></tr>';
      return;
    }

    let rowsHtml = '';
    filtered.forEach(function (r) {
      const badgeClass = getStatusBadgeClass(r.status);
      const isPickup = r.status === 'Ready for Pickup';
      const isCompleted = r.status === 'Completed';
      const isCancelled = r.status === 'Cancelled';
      const canCancel = !isPickup && !isCompleted && !isCancelled;
      const canDelete = isCompleted;

      // Cancel button rendering
      let cancelBtnHtml = '';
      if (canCancel) {
        cancelBtnHtml = `<button type="button" class="btn-table-action btn-table-cancel" data-cancel-ref="${r.ref}" title="Cancel this application">Cancel</button>`;
      } else if (isPickup) {
        cancelBtnHtml = `<button type="button" class="btn-table-action btn-table-cancel disabled" data-cancel-ref="${r.ref}" title="Cannot be cancelled: document is already ready for pickup at Barangay Hall">Cancel</button>`;
      } else if (isCancelled) {
        cancelBtnHtml = `<button type="button" class="btn-table-action btn-table-cancel disabled" data-cancel-ref="${r.ref}" title="This request has already been cancelled" disabled>Cancelled</button>`;
      } else {
        cancelBtnHtml = `<button type="button" class="btn-table-action btn-table-cancel disabled" data-cancel-ref="${r.ref}" title="Completed request cannot be cancelled" disabled>Cancel</button>`;
      }

      // Delete button rendering
      let deleteBtnHtml = '';
      if (canDelete) {
        deleteBtnHtml = `<button type="button" class="btn-table-action btn-table-delete" data-delete-ref="${r.ref}" title="Delete completed application from history">Delete</button>`;
      } else {
        deleteBtnHtml = `<button type="button" class="btn-table-action btn-table-delete disabled" data-delete-ref="${r.ref}" title="Can only be deleted once marked Completed (current status: ${r.status})">Delete</button>`;
      }

      rowsHtml += `
        <tr>
          <td style="vertical-align: middle;"><span class="table-ref-code">${r.ref}</span></td>
          <td style="vertical-align: middle;"><strong>${r.docType}</strong></td>
          <td style="vertical-align: middle;"><span style="font-size: 12.5px; color: #475569;">${r.purpose}</span></td>
          <td style="white-space: nowrap; vertical-align: middle;">${r.dateFiled}</td>
          <td style="vertical-align: middle;"><span style="font-size: 12px; color: #334155;">${r.claimMethod}</span></td>
          <td style="white-space: nowrap; vertical-align: middle;"><span class="status-pill ${badgeClass}">${r.status}</span></td>
          <td style="white-space: nowrap; vertical-align: middle;">
            <div class="table-actions-group">
              <button type="button" class="btn-table-action" data-view-ref="${r.ref}" title="View Details">Details</button>
              ${cancelBtnHtml}
              ${deleteBtnHtml}
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = rowsHtml;

    tbody.querySelectorAll('[data-view-ref]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-view-ref');
        openDetailViewer(ref);
      });
    });

    tbody.querySelectorAll('[data-cancel-ref]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-cancel-ref');
        handleCancelRequest(ref);
      });
    });

    tbody.querySelectorAll('[data-delete-ref]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-delete-ref');
        handleDeleteRequest(ref);
      });
    });
  }

  // Filter pills events for requests
  const reqFilterPills = document.querySelectorAll('#requestsFilterPills .filter-pill-btn');
  reqFilterPills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      reqFilterPills.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderRequestsTable();
    });
  });

  const requestsSearchInput = document.getElementById('requestsSearchInput');
  if (requestsSearchInput) {
    requestsSearchInput.addEventListener('input', renderRequestsTable);
  }

  // ==========================================================
  // 10. TAB 3: CONCERNS FEED & TRACKER
  // ==========================================================

  function renderConcernsFeed() {
    const container = document.getElementById('concernsFeedContainer');
    if (!container) return;

    const searchVal = (document.getElementById('concernsSearchInput')?.value || '').toLowerCase().trim();
    const activeFilterBtn = document.querySelector('#concernsFilterPills .filter-pill-btn.active');
    const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'All';

    // Update counts (Pending, In Progress, Resolved)
    const countAll = userConcerns.length;
    const countPending = userConcerns.filter(c => c.status === 'Pending').length;
    const countProgress = userConcerns.filter(c => c.status === 'In Progress').length;
    const countResolved = userConcerns.filter(c => c.status === 'Resolved').length;

    const countAllEl = document.getElementById('countAllConcerns');
    const countPendingEl = document.getElementById('countPendingConcerns');
    const countProgressEl = document.getElementById('countProgressConcerns');
    const countResolvedEl = document.getElementById('countResolvedConcerns');
    if (countAllEl) countAllEl.textContent = countAll;
    if (countPendingEl) countPendingEl.textContent = countPending;
    if (countProgressEl) countProgressEl.textContent = countProgress;
    if (countResolvedEl) countResolvedEl.textContent = countResolved;

    const filtered = userConcerns.filter(function (c) {
      const matchFilter = filter === 'All' || c.status === filter;
      const matchSearch = !searchVal ||
        c.ref.toLowerCase().includes(searchVal) ||
        (c.title || '').toLowerCase().includes(searchVal) ||
        c.category.toLowerCase().includes(searchVal) ||
        c.desc.toLowerCase().includes(searchVal) ||
        c.location.toLowerCase().includes(searchVal) ||
        c.urgency.toLowerCase().includes(searchVal) ||
        c.status.toLowerCase().includes(searchVal);
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 40px; background: #ffffff; border-radius: 12px; border: 1px dashed var(--border);">No concerns found matching your selected filter.</div>';
      return;
    }

    let cardsHtml = '';
    filtered.forEach(function (c) {
      const urgencyLevel = normalizeConcernUrgency(c.urgency);
      const isUrgent = urgencyLevel === 'Urgent';
      const statusBadgeClass = getStatusBadgeClass(c.status);
      const stage = c.status === 'Resolved' ? 3 : (c.status === 'In Progress' ? 2 : 1);

      cardsHtml += `
        <div class="concern-item-card">
          <div class="concern-item-header">
            <div class="concern-ref-wrap">
              <span class="concern-ticket-id">${escapeHtml(c.ref)}</span>
              <span class="concern-cat-tag">${escapeHtml(c.category)}</span>
              <span class="status-pill ${isUrgent ? 'status-urgent' : 'status-standard'}">${escapeHtml(urgencyLevel)}</span>
              <span class="status-pill ${statusBadgeClass}">${escapeHtml(c.status)}</span>
              <span class="concern-date">Submitted on ${escapeHtml(c.dateFiled)}</span>
            </div>
            <button type="button" class="btn-table-action" data-view-ref="${escapeHtml(c.ref)}">View Details</button>
          </div>

          <h4 class="concern-title-heading">${escapeHtml(c.title || (c.category + ' Concern'))}</h4>

          <div class="concern-location-row">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${escapeHtml(c.location)}</span>
          </div>

          <p class="concern-desc-text">${escapeHtml(c.desc)}</p>

          <!-- 3-Step Visual Progress Stepper -->
          <div class="concern-progress-stepper">
            <div class="stepper-stage ${stage >= 1 ? (stage === 1 ? 'active' : 'completed') : ''}">
              <div class="stage-bullet">${stage > 1 ? '✓' : '1'}</div>
              <span>Pending</span>
            </div>
            <div class="stepper-line ${stage >= 2 ? 'filled' : ''}"></div>
            <div class="stepper-stage ${stage >= 2 ? (stage === 2 ? 'active' : 'completed') : ''}">
              <div class="stage-bullet">${stage > 2 ? '✓' : '2'}</div>
              <span>In Progress</span>
            </div>
            <div class="stepper-line ${stage >= 3 ? 'filled' : ''}"></div>
            <div class="stepper-stage ${stage >= 3 ? 'completed' : ''}">
              <div class="stage-bullet">${stage === 3 ? '✓' : '3'}</div>
              <span>Resolved</span>
            </div>
          </div>

          ${c.resolutionNote ? `
            <div class="concern-resolution-box">
              <div class="resolution-header">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Barangay Admin Status &amp; Action Notes:</span>
              </div>
              <p class="resolution-text">${escapeHtml(c.resolutionNote)}</p>
            </div>
          ` : ''}
        </div>
      `;
    });

    container.innerHTML = cardsHtml;

    container.querySelectorAll('[data-view-ref]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-view-ref');
        openDetailViewer(ref);
      });
    });
  }

  const concernFilterPills = document.querySelectorAll('#concernsFilterPills .filter-pill-btn');
  concernFilterPills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      concernFilterPills.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderConcernsFeed();
    });
  });

  const concernsSearchInput = document.getElementById('concernsSearchInput');
  if (concernsSearchInput) {
    concernsSearchInput.addEventListener('input', renderConcernsFeed);
  }

  // ==========================================================
  // 11. TAB 4: PROJECT PROPOSALS FEED
  // ==========================================================

  function renderProposalsFeed() {
    const container = document.getElementById('proposalsFeedContainer');
    if (!container) return;

    if (userProposals.length === 0) {
      container.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 40px; background: #ffffff; border-radius: 12px; border: 1px dashed var(--border);">No proposals submitted yet. Click "Submit Proposal" above to pitch an initiative.</div>';
      return;
    }

    let html = '';
    userProposals.forEach(function (p) {
      html += `
        <div class="proposal-item-card">
          <div class="proposal-item-top">
            <div>
              <h4 class="proposal-title">${p.title}</h4>
              <div class="proposal-meta-tags">
                <span class="proposal-id-tag">${p.ref}</span>
                <span class="proposal-cat-tag">${p.category}</span>
                <span class="proposal-budget-tag">₱${Number(p.budget).toLocaleString()}</span>
                <span class="status-pill status-pending">${p.status}</span>
                <span style="font-size: 11.5px; color: #94a3b8;">Submitted ${p.dateFiled}</span>
              </div>
            </div>
            <button type="button" class="btn-table-action" data-view-ref="${p.ref}">Full Proposal</button>
          </div>

          <div style="font-size: 12.5px; color: #475569; margin-bottom: 8px;">
            <strong>Target Location:</strong> ${p.location} ${p.timeline ? `&bull; <strong>Timeline:</strong> ${p.timeline}` : ''}
          </div>

          <p class="proposal-rationale">${p.rationale}</p>

          ${p.councilNote ? `
            <div class="proposal-council-note">
              <div class="council-note-title">Barangay Development Council (BDC) Review Note:</div>
              <p class="council-note-text">${p.councilNote}</p>
            </div>
          ` : ''}
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('[data-view-ref]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ref = this.getAttribute('data-view-ref');
        openDetailViewer(ref);
      });
    });
  }

  // ==========================================================
  // 12. MODAL CONTROLS & SUBMISSION HANDLERS
  // ==========================================================

  function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // File picker labels
  if (modalDocAttachment && modalDocAttachmentName) {
    modalDocAttachment.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        modalDocAttachmentName.textContent = 'Attached: ' + this.files[0].name;
      }
    });
  }
  if (modalConcernPhoto && modalConcernPhotoName) {
    modalConcernPhoto.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        modalConcernPhotoName.textContent = 'Attached: ' + this.files[0].name;
      }
    });
  }
  if (newIdFile && newIdFileName) {
    newIdFile.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        newIdFileName.textContent = 'Selected: ' + this.files[0].name;
      }
    });
  }

  // A. Document Request Modal
  function openDocModalWithPreset(docName) {
    if (modalDocType && docName) {
      modalDocType.value = docName;
    }
    syncUserDisplays();
    openModal(docRequestModal);
  }

  if (btnOpenNewDocModal) {
    btnOpenNewDocModal.addEventListener('click', () => openDocModalWithPreset('Barangay Clearance'));
  }
  if (btnDashNewRequest) {
    btnDashNewRequest.addEventListener('click', () => openDocModalWithPreset('Barangay Clearance'));
  }
  if (scRequestDoc) {
    scRequestDoc.addEventListener('click', () => openDocModalWithPreset('Barangay Clearance'));
  }
  if (closeDocModalBtn) closeDocModalBtn.addEventListener('click', () => closeModal(docRequestModal));
  if (btnCancelDocModal) btnCancelDocModal.addEventListener('click', () => closeModal(docRequestModal));

  if (docApplicationForm) {
    const specificInput = document.getElementById('modalDocPurposeSpecific');
    const specificErr = document.getElementById('modalDocPurposeSpecificError');

    if (specificInput) {
      specificInput.addEventListener('input', function () {
        if (this.value.trim().length >= 3) {
          this.classList.remove('input-error');
          if (specificErr) {
            specificErr.textContent = '';
            specificErr.style.display = 'none';
          }
        }
      });
    }

    docApplicationForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const docType = modalDocType ? modalDocType.value : 'Barangay Clearance';
      const cat = document.getElementById('modalDocPurposeCategory')?.value || 'General';
      const specific = (specificInput?.value || '').trim();

      if (!specific || specific.length < 3) {
        if (specificInput) {
          specificInput.classList.add('input-error');
          specificInput.focus();
        }
        if (specificErr) {
          specificErr.textContent = 'Please enter specific purpose details (at least 3 characters).';
          specificErr.style.display = 'block';
        }
        return;
      }

      const claimMethod = 'Physical Pickup at Barangay Hall';
      const refCode = 'BRGY-' + Math.floor(100000 + Math.random() * 900000);
      const today = new Date().toISOString().split('T')[0];

      const newRequest = {
        ref: refCode,
        docType: docType,
        purpose: cat + ` (${specific})`,
        dateFiled: today,
        claimMethod: claimMethod,
        claimTarget: 'Estimated within 1–2 business days',
        status: 'In Review',
        notes: 'Application received online. Document being prepared for validation by Barangay Secretary.'
      };

      userRequests.unshift(newRequest);
      saveData('brgy360_requests', userRequests);

      // Add notification
      userNotifications.unshift({
        id: Date.now(),
        title: 'New Document Request Filed',
        desc: `Application for ${docType} has been submitted. Reference: ${refCode}.`,
        time: 'Just now',
        unread: true,
        type: 'blue'
      });
      saveData('brgy360_notifs', userNotifications);

      // Refresh UI
      renderDashboardKPIs();
      renderDashboardActivityTable();
      renderRequestsTable();
      renderNotifications();

      closeModal(docRequestModal);
      docApplicationForm.reset();

      showToast('Application Submitted!', `Reference: ${refCode}. You will receive status updates.`);
      switchTab('services');
    });
  }

  // B. Concern Modal
  const concernSuccessBanner = document.getElementById('concernSuccessBanner');
  const concernSuccessTitle = document.getElementById('concernSuccessTitle');
  const concernSuccessDesc = document.getElementById('concernSuccessDesc');
  const closeConcernSuccessBanner = document.getElementById('closeConcernSuccessBanner');

  if (closeConcernSuccessBanner && concernSuccessBanner) {
    closeConcernSuccessBanner.addEventListener('click', function () {
      concernSuccessBanner.style.display = 'none';
    });
  }

  function setConcernModalUrgency(level) {
    const normalized = normalizeConcernUrgency(level);
    const hiddenUrgency = document.getElementById('modalConcernUrgency');
    if (hiddenUrgency) hiddenUrgency.value = normalized;

    document.querySelectorAll('#concernUrgencyCards .urgency-card').forEach(function (card) {
      const cardVal = card.getAttribute('data-urgency-card');
      const radio = card.querySelector('input[type="radio"]');
      const isMatch = cardVal === normalized;
      card.classList.toggle('is-selected', isMatch);
      if (radio) radio.checked = isMatch;
    });
  }

  document.querySelectorAll('#concernUrgencyCards input[name="concernUrgencyRadio"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (this.checked) {
        setConcernModalUrgency(this.value);
      }
    });
  });

  function openConcernModalPrepared() {
    syncUserDisplays();
    const dateInput = document.getElementById('modalConcernDate');
    const sitioSelect = document.getElementById('modalConcernSitio');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    if (sitioSelect && currentUser?.sitio) sitioSelect.value = normalizeSitioName(currentUser.sitio);
    setConcernModalUrgency('Standard');
    openModal(concernModal);
  }

  if (btnOpenNewConcernModal) {
    btnOpenNewConcernModal.addEventListener('click', openConcernModalPrepared);
  }
  if (btnDashNewConcern) {
    btnDashNewConcern.addEventListener('click', openConcernModalPrepared);
  }
  if (scFileConcern) {
    scFileConcern.addEventListener('click', openConcernModalPrepared);
  }
  if (closeConcernModalBtn) closeConcernModalBtn.addEventListener('click', () => closeModal(concernModal));
  if (btnCancelConcernModal) btnCancelConcernModal.addEventListener('click', () => closeModal(concernModal));

  if (concernReportForm) {
    const concernTitleInput = document.getElementById('modalConcernTitle');
    const concernCategoryInput = document.getElementById('modalConcernCategory');
    const concernDateInput = document.getElementById('modalConcernDate');
    const concernSitioInput = document.getElementById('modalConcernSitio');
    const concernLocationInput = document.getElementById('modalConcernLocation');
    const concernDescInput = document.getElementById('modalConcernDesc');

    const concernTitleErr = document.getElementById('modalConcernTitleError');
    const concernCategoryErr = document.getElementById('modalConcernCategoryError');
    const concernDateErr = document.getElementById('modalConcernDateError');
    const concernSitioErr = document.getElementById('modalConcernSitioError');
    const concernLocationErr = document.getElementById('modalConcernLocationError');
    const concernDescErr = document.getElementById('modalConcernDescError');

    // Real-time clearing
    [
      [concernTitleInput, concernTitleErr, 3],
      [concernLocationInput, concernLocationErr, 3],
      [concernDescInput, concernDescErr, 10]
    ].forEach(item => {
      const el = item[0];
      const err = item[1];
      const min = item[2];
      if (el) {
        el.addEventListener('input', function () {
          if (this.value.trim().length >= min) {
            this.classList.remove('input-error');
            if (err) { err.textContent = ''; err.style.display = 'none'; }
          }
        });
      }
    });

    [
      [concernCategoryInput, concernCategoryErr],
      [concernDateInput, concernDateErr],
      [concernSitioInput, concernSitioErr]
    ].forEach(item => {
      const el = item[0];
      const err = item[1];
      if (el) {
        el.addEventListener('change', function () {
          if (this.value) {
            this.classList.remove('input-error');
            if (err) { err.textContent = ''; err.style.display = 'none'; }
          }
        });
      }
    });

    concernReportForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;
      let firstInvalid = null;

      function markInvalid(inputEl, errorEl, message) {
        if (inputEl) inputEl.classList.add('input-error');
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.style.display = 'block';
        }
        if (!firstInvalid && inputEl) firstInvalid = inputEl;
        isValid = false;
      }

      function markValid(inputEl, errorEl) {
        if (inputEl) inputEl.classList.remove('input-error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.style.display = 'none';
        }
      }

      const title = (concernTitleInput?.value || '').trim();
      const category = normalizeConcernCategory(concernCategoryInput?.value || '');
      const checkedRadio = document.querySelector('#concernUrgencyCards input[name="concernUrgencyRadio"]:checked');
      const urgency = normalizeConcernUrgency(checkedRadio?.value || document.getElementById('modalConcernUrgency')?.value || 'Standard');
      const dateFiled = concernDateInput?.value || '';
      const sitio = normalizeSitioName(concernSitioInput?.value || '');
      const landmark = (concernLocationInput?.value || '').trim();
      const location = landmark ? `${sitio} — ${landmark}` : sitio;
      const desc = (concernDescInput?.value || '').trim();

      if (!title || title.length < 3) {
        markInvalid(concernTitleInput, concernTitleErr, 'Please enter a concern title (at least 3 characters).');
      } else {
        markValid(concernTitleInput, concernTitleErr);
      }

      if (!concernCategoryInput?.value) {
        markInvalid(concernCategoryInput, concernCategoryErr, 'Please select an incident category.');
      } else {
        markValid(concernCategoryInput, concernCategoryErr);
      }

      if (!dateFiled) {
        markInvalid(concernDateInput, concernDateErr, 'Please select the date of occurrence.');
      } else {
        markValid(concernDateInput, concernDateErr);
      }

      if (!sitio) {
        markInvalid(concernSitioInput, concernSitioErr, 'Please select the Sitio or Purok.');
      } else {
        markValid(concernSitioInput, concernSitioErr);
      }

      if (!landmark || landmark.length < 3) {
        markInvalid(concernLocationInput, concernLocationErr, 'Please enter exact landmark or location (at least 3 characters).');
      } else {
        markValid(concernLocationInput, concernLocationErr);
      }

      if (!desc || desc.length < 10) {
        markInvalid(concernDescInput, concernDescErr, 'Please provide a detailed description (at least 10 characters).');
      } else {
        markValid(concernDescInput, concernDescErr);
      }

      if (!isValid) {
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const ticketRef = 'TCK-' + Math.floor(1000 + Math.random() * 9000);
      const photoFile = modalConcernPhoto && modalConcernPhoto.files && modalConcernPhoto.files[0]
        ? modalConcernPhoto.files[0]
        : null;

      function finalizeConcernSubmission(photoDataUrl) {
        const newConcern = normalizeConcernRecord({
          ref: ticketRef,
          id: ticketRef,
          title: title,
          category: category,
          urgency: urgency,
          sitio: sitio,
          landmark: landmark,
          location: location,
          dateFiled: dateFiled,
          status: 'Pending',
          currentStage: 1,
          desc: desc,
          reporter: currentUser.name || 'Juan Dela Cruz',
          userEmail: currentUser.email || '',
          userMobile: currentUser.mobile || '',
          userAddress: currentUser.address || (sitio + ', Barangay Pallocan West'),
          residentId: currentUser.residentId || 'PW-2026-08492',
          photoName: photoFile ? photoFile.name : null,
          photoData: photoDataUrl || null,
          resolutionNote: ''
        });

        // Reload latest shared concerns from localStorage before prepending
        let latestAll = loadData('brgy360_concerns', DEFAULT_CONCERNS);
        if (!Array.isArray(latestAll)) latestAll = [];
        latestAll = latestAll.map(normalizeConcernRecord);
        latestAll.unshift(newConcern);
        saveData('brgy360_concerns', latestAll);

        allConcerns = latestAll;
        userConcerns = allConcerns.filter(c => isConcernOwnedByUser(c, currentUser));

        userNotifications.unshift({
          id: Date.now(),
          title: 'Concern Submitted Successfully',
          desc: `Ticket ${ticketRef} ("${title}") has been submitted (${urgency}) and forwarded to the Admin Concern Desk.`,
          time: 'Just now',
          unread: true,
          type: 'amber'
        });
        saveData('brgy360_notifs', userNotifications);

        // Reset filter pill to "All" so user immediately sees their newly submitted concern
        const allFilterBtn = document.querySelector('#concernsFilterPills .filter-pill-btn[data-filter="All"]');
        if (allFilterBtn) {
          document.querySelectorAll('#concernsFilterPills .filter-pill-btn').forEach(b => b.classList.remove('active'));
          allFilterBtn.classList.add('active');
        }

        renderDashboardKPIs();
        renderDashboardActivityTable();
        renderConcernsFeed();
        renderNotifications();

        closeModal(concernModal);
        concernReportForm.reset();
        setConcernModalUrgency('Standard');
        if (modalConcernPhotoName) {
          modalConcernPhotoName.textContent = 'Upload photo of the issue (JPG, PNG)';
        }

        switchTab('reports');

        if (concernSuccessBanner) {
          if (concernSuccessTitle) {
            concernSuccessTitle.textContent = `Concern Submitted Successfully — Ticket #${ticketRef}`;
          }
          if (concernSuccessDesc) {
            concernSuccessDesc.textContent = `"${title}" (${category} • ${urgency} • Submitted ${dateFiled}) has been sent to Barangay Admin for review.`;
          }
          concernSuccessBanner.style.display = 'flex';
        }

        showToast('Concern Submitted Successfully!', `Ticket #${ticketRef} (${urgency}) sent to Barangay Admin.`);
      }

      if (photoFile && photoFile.size <= 1500000) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          finalizeConcernSubmission(ev.target?.result || null);
        };
        reader.onerror = function () {
          finalizeConcernSubmission(null);
        };
        reader.readAsDataURL(photoFile);
      } else {
        finalizeConcernSubmission(null);
      }
    });
  }

  // C. Proposal Modal
  if (btnOpenNewProposalModal) {
    btnOpenNewProposalModal.addEventListener('click', () => openModal(proposalModal));
  }
  if (scProposeProj) {
    scProposeProj.addEventListener('click', () => openModal(proposalModal));
  }
  if (closeProposalModalBtn) closeProposalModalBtn.addEventListener('click', () => closeModal(proposalModal));
  if (btnCancelPropModal) btnCancelPropModal.addEventListener('click', () => closeModal(proposalModal));

  if (proposalSubmitForm) {
    const propTitleInput = document.getElementById('modalPropTitle');
    const propCatInput = document.getElementById('modalPropCategory');
    const propLocInput = document.getElementById('modalPropLocation');
    const propBudgetInput = document.getElementById('modalPropBudget');
    const propRationaleInput = document.getElementById('modalPropRationale');

    const propTitleErr = document.getElementById('modalPropTitleError');
    const propCatErr = document.getElementById('modalPropCategoryError');
    const propLocErr = document.getElementById('modalPropLocationError');
    const propBudgetErr = document.getElementById('modalPropBudgetError');
    const propRationaleErr = document.getElementById('modalPropRationaleError');

    // Real-time restriction: Budget (Numeric digits only)
    if (propBudgetInput) {
      propBudgetInput.addEventListener('input', function () {
        const original = this.value;
        const sanitized = original.replace(/\D/g, '');
        if (original !== sanitized) {
          this.value = sanitized;
          if (propBudgetErr) {
            propBudgetErr.textContent = 'Estimated budget must contain numeric digits only. Letters and special characters are not allowed.';
            propBudgetErr.style.display = 'block';
          }
          this.classList.add('input-error');
          return;
        }
        if (Number(sanitized) > 0) {
          this.classList.remove('input-error');
          if (propBudgetErr) {
            propBudgetErr.textContent = '';
            propBudgetErr.style.display = 'none';
          }
        }
      });
    }

    // Real-time clearing
    if (propTitleInput) {
      propTitleInput.addEventListener('input', function () {
        if (this.value.trim().length >= 3) {
          this.classList.remove('input-error');
          if (propTitleErr) { propTitleErr.textContent = ''; propTitleErr.style.display = 'none'; }
        }
      });
    }
    if (propRationaleInput) {
      propRationaleInput.addEventListener('input', function () {
        if (this.value.trim().length >= 10) {
          this.classList.remove('input-error');
          if (propRationaleErr) { propRationaleErr.textContent = ''; propRationaleErr.style.display = 'none'; }
        }
      });
    }
    if (propLocInput) {
      propLocInput.addEventListener('change', function () {
        if (this.value) {
          this.classList.remove('input-error');
          if (propLocErr) { propLocErr.textContent = ''; propLocErr.style.display = 'none'; }
        }
      });
    }

    proposalSubmitForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;
      let firstInvalid = null;

      function markInvalid(inputEl, errorEl, message) {
        if (inputEl) inputEl.classList.add('input-error');
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.style.display = 'block';
        }
        if (!firstInvalid && inputEl) firstInvalid = inputEl;
        isValid = false;
      }

      function markValid(inputEl, errorEl) {
        if (inputEl) inputEl.classList.remove('input-error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.style.display = 'none';
        }
      }

      const title = (propTitleInput?.value || '').trim();
      const category = propCatInput?.value || '';
      const location = propLocInput?.value || '';
      const rawBudget = (propBudgetInput?.value || '').trim();
      const budget = parseFloat(rawBudget || 0);
      const timeline = (document.getElementById('modalPropTimeline')?.value || '').trim();
      const rationale = (propRationaleInput?.value || '').trim();

      if (!title || title.length < 3) {
        markInvalid(propTitleInput, propTitleErr, 'Please enter a project title (at least 3 characters).');
      } else {
        markValid(propTitleInput, propTitleErr);
      }

      if (!category) {
        markInvalid(propCatInput, propCatErr, 'Please select a sector category.');
      } else {
        markValid(propCatInput, propCatErr);
      }

      if (!location) {
        markInvalid(propLocInput, propLocErr, 'Please select a target location or sitio.');
      } else {
        markValid(propLocInput, propLocErr);
      }

      if (!rawBudget || !/^\d+$/.test(rawBudget) || budget <= 0) {
        markInvalid(propBudgetInput, propBudgetErr, 'Estimated budget must contain numeric digits only and be greater than ₱0.');
      } else {
        markValid(propBudgetInput, propBudgetErr);
      }

      if (!rationale || rationale.length < 10) {
        markInvalid(propRationaleInput, propRationaleErr, 'Please explain the rationale and community impact (at least 10 characters).');
      } else {
        markValid(propRationaleInput, propRationaleErr);
      }

      if (!isValid) {
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const propRef = 'PROP-' + Math.floor(1000 + Math.random() * 9000);
      const today = new Date().toISOString().split('T')[0];

      const newProposal = {
        ref: propRef,
        title: title,
        category: category,
        location: location,
        budget: budget,
        timeline: timeline,
        dateFiled: today,
        status: 'Under BDC Review',
        rationale: rationale,
        councilNote: 'Received by Barangay Development Council Secretariat. Queued for technical feasibility review.'
      };

      userProposals.unshift(newProposal);
      saveData('brgy360_proposals', userProposals);

      userNotifications.unshift({
        id: Date.now(),
        title: 'Project Proposal Received',
        desc: `Proposal "${title}" (${propRef}) submitted to the Development Council.`,
        time: 'Just now',
        unread: true,
        type: 'green'
      });
      saveData('brgy360_notifs', userNotifications);

      renderDashboardKPIs();
      renderDashboardActivityTable();
      renderProposalsFeed();
      renderNotifications();

      closeModal(proposalModal);
      proposalSubmitForm.reset();

      showToast('Proposal Submitted!', `Reference ID: ${propRef}. Thank you for your civic initiative!`);
      switchTab('proposals');
    });
  }

  // D. Detail Viewer Modal
  function openDetailViewer(refCode) {
    if (!detailViewerModal || !detailModalBody) return;

    let item = userRequests.find(r => r.ref === refCode);
    let itemType = 'request';

    if (!item) {
      item = userConcerns.find(c => c.ref === refCode);
      itemType = 'concern';
    }
    if (!item) {
      item = userProposals.find(p => p.ref === refCode);
      itemType = 'proposal';
    }

    if (!item) return;

    if (itemType === 'request') {
      const isPickup = item.status === 'Ready for Pickup';
      if (detailModalKicker) detailModalKicker.textContent = 'SERVICE APPLICATION SLIP';
      if (detailModalTitle) detailModalTitle.textContent = item.docType;

      detailModalBody.innerHTML = `
        <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 10px; padding: 18px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Official Reference Code</span>
            <span class="table-ref-code" style="font-size: 14px;">${item.ref}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12.5px; color: #475569;">Application Status:</span>
            <span class="status-pill ${getStatusBadgeClass(item.status)}">${item.status}</span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px; margin-bottom: 18px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
            <span style="color: #64748b;">Applicant Name:</span>
            <strong>${currentUser.name}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
            <span style="color: #64748b;">Purpose of Application:</span>
            <span>${item.purpose}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
            <span style="color: #64748b;">Date Submitted:</span>
            <span>${item.dateFiled}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
            <span style="color: #64748b;">Claiming Mode:</span>
            <span>${item.claimMethod}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Target Release:</span>
            <strong>${item.claimTarget || '1-2 Working Days'}</strong>
          </div>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; font-size: 12.5px; color: #14532d;">
          <strong>Official Processing Note:</strong>
          <p style="margin: 4px 0 0 0; line-height: 1.45;">${item.notes || 'Document verified and logged in the Barangay Database.'}</p>
        </div>

        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
          ${!isPickup && item.status !== 'Completed' && item.status !== 'Cancelled' ? `
            <button type="button" class="btn-table-action btn-table-cancel" id="btnModalCancelReq" data-modal-cancel="${item.ref}">Cancel Request</button>
          ` : ''}
          ${isPickup ? `
            <button type="button" class="btn-table-action btn-table-cancel disabled" id="btnModalCancelReq" data-modal-cancel="${item.ref}" title="Cannot be cancelled: document is already ready for pickup at Barangay Hall">Cancel (Locked for Pickup)</button>
          ` : ''}
          ${item.status === 'Completed' ? `
            <button type="button" class="btn-table-action btn-table-delete" id="btnModalDeleteReq" data-modal-delete="${item.ref}">Delete Record</button>
          ` : `
            <button type="button" class="btn-table-action btn-table-delete disabled" id="btnModalDeleteReq" data-modal-delete="${item.ref}" title="Can only be deleted once Completed">Delete (Completed Only)</button>
          `}
        </div>
      `;

      setTimeout(() => {
        const modalCancelBtn = document.getElementById('btnModalCancelReq');
        if (modalCancelBtn) {
          modalCancelBtn.addEventListener('click', function () {
            const refToCancel = this.getAttribute('data-modal-cancel');
            closeModal(detailViewerModal);
            handleCancelRequest(refToCancel);
          });
        }
        const modalDeleteBtn = document.getElementById('btnModalDeleteReq');
        if (modalDeleteBtn) {
          modalDeleteBtn.addEventListener('click', function () {
            const refToDelete = this.getAttribute('data-modal-delete');
            closeModal(detailViewerModal);
            handleDeleteRequest(refToDelete);
          });
        }
      }, 0);
    } else if (itemType === 'concern') {
      const urgencyLevel = normalizeConcernUrgency(item.urgency);
      if (detailModalKicker) detailModalKicker.textContent = 'CITIZEN CONCERN RECORD';
      if (detailModalTitle) detailModalTitle.textContent = item.title || (item.category + ' Concern');

      detailModalBody.innerHTML = `
        <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 10px; padding: 18px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Ticket Number</span>
            <span class="table-ref-code" style="font-size: 14px;">${escapeHtml(item.ref)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 12.5px; color: #475569;">Current Status:</span>
            <span class="status-pill ${getStatusBadgeClass(item.status)}">${escapeHtml(item.status)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12.5px; color: #475569;">Urgency Level:</span>
            <span class="status-pill ${urgencyLevel === 'Urgent' ? 'status-urgent' : 'status-standard'}">${escapeHtml(urgencyLevel)}</span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; gap: 12px;">
            <span style="color: #64748b;">Category:</span>
            <strong>${escapeHtml(item.category)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; gap: 12px;">
            <span style="color: #64748b;">Date Submitted:</span>
            <span>${escapeHtml(item.dateFiled)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; gap: 12px;">
            <span style="color: #64748b;">Submitted By:</span>
            <strong>${escapeHtml(item.reporter || currentUser.name)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; gap: 12px;">
            <span style="color: #64748b;">Location / Sitio:</span>
            <span>${escapeHtml(item.location)}</span>
          </div>
        </div>

        <div style="font-size: 13px; margin-bottom: 16px;">
          <strong style="color: #0f172a; display: block; margin-bottom: 6px;">Detailed Description:</strong>
          <p style="color: #475569; margin: 0; line-height: 1.55; background: #ffffff; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px;">${escapeHtml(item.desc)}</p>
        </div>

        ${item.photoData ? `
          <div style="margin-bottom: 16px;">
            <strong style="font-size: 12.5px; color: #0f172a; display: block; margin-bottom: 6px;">Attached Photo Evidence:</strong>
            <img src="${item.photoData}" alt="Attached concern photo" style="max-width: 100%; max-height: 220px; border-radius: 8px; border: 1px solid var(--border); object-fit: cover;">
          </div>
        ` : (item.photoName ? `
          <div style="font-size: 12px; color: #64748b; margin-bottom: 16px;">
            <strong>Attached File:</strong> ${escapeHtml(item.photoName)}
          </div>
        ` : '')}

        ${item.resolutionNote ? `
          <div class="concern-resolution-box">
            <div class="resolution-header">Barangay Admin Response &amp; Action Notes:</div>
            <p class="resolution-text">${escapeHtml(item.resolutionNote)}</p>
          </div>
        ` : `
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; font-size: 12.5px; color: #92400e;">
            <strong>Status Note:</strong> Your concern is currently marked <strong>${escapeHtml(item.status)}</strong>. Updates from Barangay Admin will appear here automatically.
          </div>
        `}
      `;
    } else {
      if (detailModalKicker) detailModalKicker.textContent = 'DEVELOPMENT PROPOSAL';
      if (detailModalTitle) detailModalTitle.textContent = item.title;

      detailModalBody.innerHTML = `
        <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 10px; padding: 18px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Proposal ID</span>
            <span class="table-ref-code" style="font-size: 14px;">${item.ref}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12.5px; color: #475569;">Council Status:</span>
            <span class="status-pill status-pending">${item.status}</span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; margin-bottom: 16px;">
          <div><strong style="color: #64748b;">Sector:</strong> ${item.category}</div>
          <div><strong style="color: #64748b;">Target Location:</strong> ${item.location}</div>
          <div><strong style="color: #64748b;">Estimated Budget:</strong> ₱${Number(item.budget).toLocaleString()}</div>
          <div><strong style="color: #64748b;">Proposed Timeline:</strong> ${item.timeline || 'Not specified'}</div>
        </div>

        <div style="font-size: 13px; margin-bottom: 16px;">
          <strong style="color: #0f172a; display: block; margin-bottom: 4px;">Rationale & Community Impact:</strong>
          <p style="color: #475569; margin: 0; line-height: 1.55;">${item.rationale}</p>
        </div>

        ${item.councilNote ? `
          <div class="proposal-council-note">
            <div class="council-note-title">Barangay Development Council Evaluation:</div>
            <p class="council-note-text">${item.councilNote}</p>
          </div>
        ` : ''}
      `;
    }

    openModal(detailViewerModal);
  }

  if (closeDetailModalBtn) closeDetailModalBtn.addEventListener('click', () => closeModal(detailViewerModal));

  // Action Confirmation Modal event handlers
  if (closeConfirmModalBtn) closeConfirmModalBtn.addEventListener('click', () => closeModal(actionConfirmModal));
  if (btnCancelConfirmModal) btnCancelConfirmModal.addEventListener('click', () => closeModal(actionConfirmModal));
  if (btnExecuteConfirmAction) {
    btnExecuteConfirmAction.addEventListener('click', function () {
      if (typeof pendingActionCallback === 'function') {
        const cb = pendingActionCallback;
        pendingActionCallback = null;
        closeModal(actionConfirmModal);
        cb();
      } else {
        closeModal(actionConfirmModal);
      }
    });
  }

  // Close modals on clicking overlay backdrop
  [docRequestModal, concernModal, proposalModal, detailViewerModal, actionConfirmModal].forEach(function (modal) {
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // ESC key closes modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal(docRequestModal);
      closeModal(concernModal);
      closeModal(proposalModal);
      closeModal(detailViewerModal);
      closeModal(actionConfirmModal);
      if (notifDropdown) notifDropdown.classList.remove('active');
      if (profileDropdown) profileDropdown.classList.remove('active');
    }
  });

  // ==========================================================
  // 13. ACCOUNT TAB: FORMS HANDLING
  // ==========================================================

  // A. Contact info form
  // A. Contact info form
  if (updateProfileForm) {
    const profileMobileInput = document.getElementById('profileMobile');
    const profileEmailInput = document.getElementById('profileEmail');
    const profileAgeInput = document.getElementById('profileAge');
    const profileAddressInput = document.getElementById('profileAddress');
    const profileSitioInput = document.getElementById('profileSitio');

    const profileMobileErr = document.getElementById('profileMobileError');
    const profileEmailErr = document.getElementById('profileEmailError');
    const profileAgeErr = document.getElementById('profileAgeError');
    const profileAddressErr = document.getElementById('profileAddressError');
    const profileSitioErr = document.getElementById('profileSitioError');

    // Populate initial age if present in currentUser
    if (profileAgeInput && currentUser) {
      if (currentUser.age) {
        profileAgeInput.value = currentUser.age;
      } else if (currentUser.dob) {
        const birth = new Date(currentUser.dob);
        const now = new Date();
        let a = now.getFullYear() - birth.getFullYear();
        profileAgeInput.value = (a > 0 && a < 120) ? a : '28';
      }
    }

    // Real-time restriction: Contact Number (Numeric digits only)
    if (profileMobileInput) {
      profileMobileInput.addEventListener('input', function () {
        const original = this.value;
        const sanitized = original.replace(/\D/g, '');
        if (original !== sanitized) {
          this.value = sanitized;
          if (profileMobileErr) {
            profileMobileErr.textContent = 'Contact number must contain numeric digits only. Letters and special characters are not allowed.';
            profileMobileErr.style.display = 'block';
          }
          this.classList.add('input-error');
          return;
        }
        if (sanitized.length >= 7 && sanitized.length <= 11) {
          this.classList.remove('input-error');
          if (profileMobileErr) {
            profileMobileErr.textContent = '';
            profileMobileErr.style.display = 'none';
          }
        }
      });
    }

    // Real-time restriction: Age (Numeric digits only)
    if (profileAgeInput) {
      profileAgeInput.addEventListener('input', function () {
        const original = this.value;
        const sanitized = original.replace(/\D/g, '');
        if (original !== sanitized) {
          this.value = sanitized;
          if (profileAgeErr) {
            profileAgeErr.textContent = 'Age must contain numeric digits only. Letters and special characters are not allowed.';
            profileAgeErr.style.display = 'block';
          }
          this.classList.add('input-error');
          return;
        }
        const num = parseInt(sanitized, 10);
        if (!isNaN(num) && num >= 1 && num <= 120) {
          this.classList.remove('input-error');
          if (profileAgeErr) {
            profileAgeErr.textContent = '';
            profileAgeErr.style.display = 'none';
          }
        }
      });
    }

    // Real-time validation: Email Address
    if (profileEmailInput) {
      profileEmailInput.addEventListener('input', function () {
        const val = this.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(val)) {
          this.classList.remove('input-error');
          if (profileEmailErr) {
            profileEmailErr.textContent = '';
            profileEmailErr.style.display = 'none';
          }
        }
      });
    }

    // Real-time clear on address & sitio
    if (profileAddressInput) {
      profileAddressInput.addEventListener('input', function () {
        if (this.value.trim().length >= 5) {
          this.classList.remove('input-error');
          if (profileAddressErr) {
            profileAddressErr.textContent = '';
            profileAddressErr.style.display = 'none';
          }
        }
      });
    }
    if (profileSitioInput) {
      profileSitioInput.addEventListener('change', function () {
        if (this.value) {
          this.classList.remove('input-error');
          if (profileSitioErr) {
            profileSitioErr.textContent = '';
            profileSitioErr.style.display = 'none';
          }
        }
      });
    }

    updateProfileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;
      let firstInvalidInput = null;

      function markProfileInvalid(inputEl, errorEl, message) {
        if (inputEl) inputEl.classList.add('input-error');
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.style.display = 'block';
        }
        if (!firstInvalidInput && inputEl) {
          firstInvalidInput = inputEl;
        }
        isValid = false;
      }

      function clearProfileValid(inputEl, errorEl) {
        if (inputEl) inputEl.classList.remove('input-error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.style.display = 'none';
        }
      }

      // 1. Mobile Number: numeric digits only, 7-11 digits
      const mobileVal = profileMobileInput ? profileMobileInput.value.trim() : '';
      if (!mobileVal) {
        markProfileInvalid(profileMobileInput, profileMobileErr, 'Contact number is required.');
      } else if (!/^\d+$/.test(mobileVal)) {
        markProfileInvalid(profileMobileInput, profileMobileErr, 'Contact number must contain numeric digits only. Letters and special characters are not allowed.');
      } else if (mobileVal.length < 7 || mobileVal.length > 11) {
        markProfileInvalid(profileMobileInput, profileMobileErr, 'Contact number must be between 7 and 11 numeric digits (e.g. 09171234567).');
      } else {
        clearProfileValid(profileMobileInput, profileMobileErr);
      }

      // 2. Email Address: valid format
      const emailVal = profileEmailInput ? profileEmailInput.value.trim() : '';
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailVal) {
        markProfileInvalid(profileEmailInput, profileEmailErr, 'Email address is required.');
      } else if (!emailRegex.test(emailVal)) {
        markProfileInvalid(profileEmailInput, profileEmailErr, 'Please enter a valid email address (e.g. resident@example.com).');
      } else {
        clearProfileValid(profileEmailInput, profileEmailErr);
      }

      // 3. Age: numeric digits only, 1-120
      const ageVal = profileAgeInput ? profileAgeInput.value.trim() : '';
      if (!ageVal) {
        markProfileInvalid(profileAgeInput, profileAgeErr, 'Age is required.');
      } else if (!/^\d+$/.test(ageVal)) {
        markProfileInvalid(profileAgeInput, profileAgeErr, 'Age must contain numeric digits only. Letters and special characters are not allowed.');
      } else {
        const aNum = parseInt(ageVal, 10);
        if (isNaN(aNum) || aNum < 1 || aNum > 120) {
          markProfileInvalid(profileAgeInput, profileAgeErr, 'Please enter a valid age between 1 and 120.');
        } else {
          clearProfileValid(profileAgeInput, profileAgeErr);
        }
      }

      // 4. Address: min 5 chars
      const addressVal = profileAddressInput ? profileAddressInput.value.trim() : '';
      if (!addressVal) {
        markProfileInvalid(profileAddressInput, profileAddressErr, 'Residential address is required.');
      } else if (addressVal.length < 5) {
        markProfileInvalid(profileAddressInput, profileAddressErr, 'Address must be at least 5 characters long.');
      } else {
        clearProfileValid(profileAddressInput, profileAddressErr);
      }

      // 5. Sitio / Purok
      const sitioVal = profileSitioInput ? profileSitioInput.value : '';
      if (!sitioVal) {
        markProfileInvalid(profileSitioInput, profileSitioErr, 'Please select your Sitio or Purok.');
      } else {
        clearProfileValid(profileSitioInput, profileSitioErr);
      }

      if (!isValid) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
          firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      currentUser.mobile = mobileVal;
      currentUser.email = emailVal;
      currentUser.age = parseInt(ageVal, 10);
      currentUser.address = addressVal;
      currentUser.sitio = sitioVal;

      saveData('brgy360_user', currentUser);
      syncUserDisplays();
      showToast('Profile Updated', 'Contact information saved successfully.');
    });
  }

  // B. Change Password Form
  if (changePasswordForm) {
    const curInput = document.getElementById('currentPassword');
    const newPwdInput = document.getElementById('newPassword');
    const confirmPwdInput = document.getElementById('confirmNewPassword');
    const curErr = document.getElementById('currentPasswordError');
    const newPwdErr = document.getElementById('newPasswordError');
    const confirmPwdErr = document.getElementById('confirmNewPasswordError');
    const bannerErr = document.getElementById('passwordErrorMsg');

    function getActiveUserPassword() {
      // 1. In-memory currentUser password
      if (currentUser && currentUser.password) {
        return currentUser.password;
      }

      // 2. Stored user object in localStorage 'brgy360_user'
      try {
        const stored = JSON.parse(localStorage.getItem('brgy360_user') || '{}');
        if (stored && stored.password) {
          return stored.password;
        }
      } catch (e) {}

      // 3. User account created in registration database ('brgy360_residents_db')
      try {
        const email = (currentUser?.email || '').trim().toLowerCase();
        const residentsDb = JSON.parse(localStorage.getItem('brgy360_residents_db') || '[]');
        if (email && Array.isArray(residentsDb)) {
          const found = residentsDb.find(u => u.email && u.email.trim().toLowerCase() === email);
          if (found && found.password) {
            return found.password;
          }
        }
      } catch (e) {}

      // 4. Session info check against resident database
      try {
        const session = JSON.parse(localStorage.getItem('brgy360_session') || '{}');
        const sessionEmail = (session?.email || '').trim().toLowerCase();
        if (sessionEmail) {
          const residentsDb = JSON.parse(localStorage.getItem('brgy360_residents_db') || '[]');
          const found = residentsDb.find(u => u.email && u.email.trim().toLowerCase() === sessionEmail);
          if (found && found.password) {
            return found.password;
          }
        }
      } catch (e) {}

      // 5. Default preconfigured password fallback
      return DEFAULT_USER.password || 'UserPassword360!';
    }

    function setFieldError(inputEl, errorEl, message) {
      if (inputEl) inputEl.classList.add('input-error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
    }

    function clearFieldError(inputEl, errorEl) {
      if (inputEl) inputEl.classList.remove('input-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }

    function clearAllPasswordErrors() {
      clearFieldError(curInput, curErr);
      clearFieldError(newPwdInput, newPwdErr);
      clearFieldError(confirmPwdInput, confirmPwdErr);
      if (bannerErr) {
        bannerErr.textContent = '';
        bannerErr.style.display = 'none';
      }
    }

    // Dynamic error clearing as user types
    if (curInput) {
      curInput.addEventListener('input', function () {
        if (curInput.value.trim()) {
          clearFieldError(curInput, curErr);
          if (bannerErr) {
            bannerErr.textContent = '';
            bannerErr.style.display = 'none';
          }
        }
      });
    }

    if (newPwdInput) {
      newPwdInput.addEventListener('input', function () {
        const val = newPwdInput.value;
        if (val.length >= 8 && /[a-zA-Z]/.test(val) && /[0-9]/.test(val)) {
          clearFieldError(newPwdInput, newPwdErr);
        }
        if (confirmPwdInput && confirmPwdInput.value && confirmPwdInput.value === val) {
          clearFieldError(confirmPwdInput, confirmPwdErr);
        }
      });
    }

    if (confirmPwdInput) {
      confirmPwdInput.addEventListener('input', function () {
        if (confirmPwdInput.value && confirmPwdInput.value === (newPwdInput ? newPwdInput.value : '')) {
          clearFieldError(confirmPwdInput, confirmPwdErr);
        }
      });
    }

    changePasswordForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllPasswordErrors();

      const cur = (curInput?.value || '').trim();
      const p1 = newPwdInput?.value || '';
      const p2 = confirmPwdInput?.value || '';

      let hasError = false;
      let firstInvalidInput = null;

      // 1. Verify that Current Password is entered and EXACTLY MATCHES the password set during creation/registration
      const expectedPassword = getActiveUserPassword();
      if (!cur) {
        setFieldError(curInput, curErr, 'Please enter your current password.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = curInput;
      } else if (cur !== expectedPassword) {
        setFieldError(curInput, curErr, 'The current password entered is incorrect. It must match the password set when your account was created.');
        if (bannerErr) {
          bannerErr.textContent = 'Current password verification failed. Please enter the password you created your account with.';
          bannerErr.style.display = 'block';
        }
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = curInput;
      }

      // 2. Verify that New Password meets security requirements
      if (!p1) {
        setFieldError(newPwdInput, newPwdErr, 'Please enter a new password.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = newPwdInput;
      } else if (p1.length < 8) {
        setFieldError(newPwdInput, newPwdErr, 'New password must be at least 8 characters long.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = newPwdInput;
      } else if (!/[a-zA-Z]/.test(p1) || !/[0-9]/.test(p1)) {
        setFieldError(newPwdInput, newPwdErr, 'New password must contain both letters and numbers.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = newPwdInput;
      } else if (p1 === cur) {
        setFieldError(newPwdInput, newPwdErr, 'New password cannot be the same as your current password.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = newPwdInput;
      }

      // 3. Verify that Confirm New Password matches
      if (!p2) {
        setFieldError(confirmPwdInput, confirmPwdErr, 'Please confirm your new password.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = confirmPwdInput;
      } else if (p1 !== p2) {
        setFieldError(confirmPwdInput, confirmPwdErr, 'Passwords do not match. Please re-enter.');
        hasError = true;
        if (!firstInvalidInput) firstInvalidInput = confirmPwdInput;
      }

      if (hasError) {
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      // 4. Update and persist the new password across localStorage & residents database
      currentUser.password = p1;
      saveData('brgy360_user', currentUser);

      // Synchronize updated password in brgy360_residents_db so future logins require the updated password
      try {
        const userEmail = (currentUser.email || '').trim().toLowerCase();
        const residentsDb = JSON.parse(localStorage.getItem('brgy360_residents_db') || '[]');
        let updated = false;

        const isJuan = userEmail === 'juan@gmail.com' || userEmail === 'juan.delacruz@example.com';

        residentsDb.forEach(u => {
          const uEmail = (u.email || '').trim().toLowerCase();
          if (uEmail === userEmail || (isJuan && (uEmail === 'juan@gmail.com' || uEmail === 'juan.delacruz@example.com'))) {
            u.password = p1;
            updated = true;
          }
        });

        if (!updated && userEmail) {
          residentsDb.push({
            ...currentUser,
            email: userEmail,
            password: p1,
            status: 'Verified',
            verified: true
          });
        }

        if (isJuan) {
          // Ensure both aliases are recorded with the new password
          const hasJuanGmail = residentsDb.some(u => (u.email || '').toLowerCase() === 'juan@gmail.com');
          if (!hasJuanGmail) {
            residentsDb.push({
              ...currentUser,
              name: 'Juan Dela Cruz',
              fullName: 'Juan Dela Cruz',
              email: 'juan@gmail.com',
              password: p1,
              status: 'Verified',
              verified: true
            });
          }
        }

        localStorage.setItem('brgy360_residents_db', JSON.stringify(residentsDb));
        if (userEmail) {
          localStorage.setItem('brgy360_pwd_' + userEmail, p1);
        }
        if (isJuan) {
          localStorage.setItem('brgy360_pwd_juan@gmail.com', p1);
          localStorage.setItem('brgy360_pwd_juan.delacruz@example.com', p1);
        }
      } catch (err) {
        console.warn('Could not sync updated password to residents db:', err);
      }

      changePasswordForm.reset();
      clearAllPasswordErrors();
      changePasswordForm.querySelectorAll('.password-toggle-btn').forEach(btn => {
        const targetId = btn.getAttribute('data-target');
        const input = targetId ? document.getElementById(targetId) : null;
        if (input && input.type === 'text') {
          input.type = 'password';
          const showIcon = btn.querySelector('.eye-show');
          const hideIcon = btn.querySelector('.eye-hide');
          if (showIcon) showIcon.style.display = 'block';
          if (hideIcon) hideIcon.style.display = 'none';
          btn.setAttribute('aria-label', 'Show password');
          btn.setAttribute('title', 'Show password');
        }
      });
      showToast('Password Updated', 'Your account credentials have been changed successfully.');
    });
  }

  // C. ID Re-Verification Form
  if (idUploadForm) {
    idUploadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const idType = document.getElementById('newIdType')?.value || 'Cedula';
      const fileInput = document.getElementById('newIdFile');

      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showToast('Document Required', 'Please select a photo or scan of your document.', true);
        return;
      }

      idUploadForm.reset();
      if (newIdFileName) newIdFileName.textContent = 'Click to select photo or scan (PNG, JPG, PDF)';

      showToast('ID Uploaded for Verification', `Your ${idType} has been submitted for secretary validation.`);
    });
  }

  // ==========================================================
  // 14. LOGOUT SESSION MANAGEMENT
  // ==========================================================

  function handleLogout() {
    localStorage.removeItem('brgy360_session');
    localStorage.removeItem('currentUserRole');
    showToast('Signed Out', 'Redirecting to public portal...');
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 600);
  }

  if (topbarLogoutBtn) topbarLogoutBtn.addEventListener('click', handleLogout);
  if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', handleLogout);

  // ==========================================================
  // 15. INITIAL RENDER CALLS
  // ==========================================================

  // Listen for live Admin updates in another browser tab
  window.addEventListener('storage', function (e) {
    if (e.key === 'brgy360_concerns') {
      refreshUserConcernsState();
      renderDashboardKPIs();
      renderDashboardActivityTable();
      renderConcernsFeed();
    } else if (e.key === 'brgy360_notifs') {
      userNotifications = loadData('brgy360_notifs', DEFAULT_NOTIFS);
      renderNotifications();
    }
  });

  syncUserDisplays();
  updateDateBanner();
  renderNotifications();
  renderDashboardKPIs();
  renderDashboardActivityTable();
  renderServicesCatalog();
  renderRequestsTable();
  renderConcernsFeed();
  renderProposalsFeed();
  handleInitialHash();

});
