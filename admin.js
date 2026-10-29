import './admin.css';

/**
 * Brgy360 - Admin Analytics & Governance Console
 * Barangay Pallocan West, Batangas City
 * Full-Spectrum Descriptive, Predictive, and Prescriptive Analytics Logic
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ==============================================================
  // 0. AUTHENTICATION & ROUTE PROTECTION
  // ==============================================================
  const currentRole = localStorage.getItem('currentUserRole');
  if (currentRole === 'resident') {
    // Unauthorized resident attempting to enter Admin Console
    window.location.href = 'index.html?auth=denied';
    return;
  }

  // Logout Handlers
  function handleAdminLogout() {
    localStorage.removeItem('currentUserRole');
    localStorage.removeItem('brgy360_session');
    showAdminToast('Signed Out', 'Redirecting to login portal...', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 500);
  }

  const btnAdminLogout = document.getElementById('btnAdminLogout');
  if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', handleAdminLogout);
  }

  const sidebarAdminLogout = document.getElementById('sidebarAdminLogout');
  if (sidebarAdminLogout) {
    sidebarAdminLogout.addEventListener('click', handleAdminLogout);
  }

  // ==============================================================
  // 1. DATA STATE & REGISTRIES
  // ==============================================================

  // Initial Service Requests Dataset (Enriched with full Barangay Pallocan Kanluran fields)
  const INITIAL_SERVICE_REQUESTS = [
    {
      id: 'REQ-2026-08492',
      resident: 'Juan M. Dela Cruz',
      fullName: 'Juan M. Dela Cruz',
      age: '34',
      address: '042 Sitio Ibaba Main Road',
      sitio: 'Sitio Ibaba',
      purokSitio: 'Sitio Ibaba',
      docType: 'Barangay Clearance',
      documentType: 'Barangay Clearance',
      purpose: 'Local Employment Application with Pilipinas Shell Batangas',
      dateFiled: '2026-10-11',
      date: 'October 11, 2026',
      status: 'Ready for Pickup',
      residencySince: 'March 2012',
      businessName: 'Dela Cruz Enterprises',
      businessAddress: '042 Sitio Ibaba Main Road, Barangay Pallocan Kanluran',
      natureOfBusiness: 'Retail of Consumer Goods',
      businessType: 'Sole Proprietorship',
      numberOfEmployees: '2',
      contact: '0917 123 4567',
      idOnRecord: 'PhilID ****-****-8492'
    },
    {
      id: 'REQ-2026-08491',
      resident: 'Maria Santos Alcantara',
      fullName: 'Maria Santos Alcantara',
      age: '28',
      address: 'Block 3 Lot 8, Villa Celina',
      sitio: 'Sitio Santolan',
      purokSitio: 'Sitio Santolan',
      docType: 'Certificate of Indigency',
      documentType: 'Certificate of Indigency',
      purpose: 'CHED Tertiary Education Subsidy & Tuition Waiver',
      dateFiled: '2026-10-11',
      date: 'October 11, 2026',
      status: 'In Review',
      residencySince: 'August 2015',
      businessName: 'Alcantara Handicrafts',
      businessAddress: 'Block 3 Lot 8, Sitio Santolan, Barangay Pallocan Kanluran',
      natureOfBusiness: 'Home Crafts & Sewing',
      businessType: 'Sole Proprietorship',
      numberOfEmployees: '1',
      contact: '0918 345 6789',
      idOnRecord: 'COMELEC Voter Cert 0142B'
    },
    {
      id: 'REQ-2026-08490',
      resident: 'Rogelio B. Mendoza',
      fullName: 'Rogelio B. Mendoza',
      age: '45',
      address: '088 Crossing Ilaya',
      sitio: 'Sitio Ilaya',
      purokSitio: 'Sitio Ilaya',
      docType: 'Certificate of Residency',
      documentType: 'Certificate of Residency',
      purpose: 'Pag-IBIG Housing Loan Prerequisite & Title Verification',
      dateFiled: '2026-10-11',
      date: 'October 11, 2026',
      status: 'In Review',
      residencySince: 'June 2008',
      businessName: 'Mendoza Vulcanizing Services',
      businessAddress: '088 Crossing Ilaya, Barangay Pallocan Kanluran',
      natureOfBusiness: 'Automotive Tire Care',
      businessType: 'Sole Proprietorship',
      numberOfEmployees: '3',
      contact: '0920 876 5432',
      idOnRecord: 'Barangay ID #PK-2024-118'
    },
    {
      id: 'REQ-2026-08489',
      resident: 'Carmela D. Hernandez',
      fullName: 'Carmela D. Hernandez',
      age: '41',
      address: '15 Riverside Drive',
      sitio: 'Tierra Verde',
      purokSitio: 'Tierra Verde',
      docType: 'Barangay Business Clearance',
      documentType: 'Barangay Business Clearance',
      purpose: 'Barangay Business Clearance Renewal for 2026',
      dateFiled: '2026-10-10',
      date: 'October 10, 2026',
      status: 'Ready for Pickup',
      residencySince: 'January 2010',
      businessName: 'Hernandez Sari-Sari Store & Carinderia',
      businessAddress: '15 Riverside Drive, Tierra Verde, Barangay Pallocan Kanluran',
      natureOfBusiness: 'Retail Food Commodities & Eatery',
      businessType: 'Sole Proprietorship',
      numberOfEmployees: '3',
      contact: '0915 222 3344',
      idOnRecord: 'Cedula CTC #0849102'
    },
    {
      id: 'REQ-2026-08488',
      resident: 'Jayson Mark Reyes',
      fullName: 'Jayson Mark Reyes',
      age: '21',
      address: '023 Alley 4, Sitio Gitna',
      sitio: 'Sitio Gitna',
      purokSitio: 'Sitio Gitna',
      docType: 'Certification for First-Time Job Seeker',
      documentType: 'Certification for First-Time Job Seeker',
      purpose: 'BPO Customer Support Trainee (RA 11261 First-Time Jobseekers Assistance Act)',
      dateFiled: '2026-10-10',
      date: 'October 10, 2026',
      status: 'In Review',
      residencySince: 'May 2005',
      businessName: 'N/A (Jobseeker)',
      businessAddress: '023 Alley 4, Sitio Gitna, Barangay Pallocan Kanluran',
      natureOfBusiness: 'N/A',
      businessType: 'N/A',
      numberOfEmployees: '0',
      contact: '0927 444 8899',
      idOnRecord: 'PhilID ****-****-3310'
    },
    {
      id: 'REQ-2026-08487',
      resident: 'Lourdes P. Castillo',
      fullName: 'Lourdes P. Castillo',
      age: '52',
      address: 'Lot 14 Block 7, Tierra Verde',
      sitio: 'Tierra Verde',
      purokSitio: 'Tierra Verde',
      docType: 'Barangay Clearance',
      documentType: 'Barangay Clearance',
      purpose: 'Philippine Postal ID Renewal & DFA Authentication',
      dateFiled: '2026-10-10',
      date: 'October 10, 2026',
      status: 'Ready for Pickup',
      residencySince: 'November 2003',
      businessName: 'Castillo General Services',
      businessAddress: 'Lot 14 Block 7, Tierra Verde, Barangay Pallocan Kanluran',
      natureOfBusiness: 'Logistics Consultation',
      businessType: 'Sole Proprietorship',
      numberOfEmployees: '2',
      contact: '0919 777 1212',
      idOnRecord: 'Driver\'s License N02-18-9901'
    },
    {
      id: 'REQ-2026-08486',
      resident: 'Arnel G. Dimaculangan',
      fullName: 'Arnel G. Dimaculangan',
      age: '66',
      address: '071 San Isidro St.',
      sitio: 'Sitio Ibaba',
      purokSitio: 'Sitio Ibaba',
      docType: 'Certificate of Indigency',
      documentType: 'Certificate of Indigency',
      purpose: 'Batangas Medical Center Dialysis Assistance & Financial Aid',
      dateFiled: '2026-10-09',
      date: 'October 09, 2026',
      status: 'In Review',
      residencySince: 'April 1980',
      businessName: 'N/A',
      businessAddress: '071 San Isidro St., Sitio Ibaba, Barangay Pallocan Kanluran',
      natureOfBusiness: 'N/A',
      businessType: 'N/A',
      numberOfEmployees: '0',
      contact: '0908 555 4321',
      idOnRecord: 'Senior Citizen ID #PK-SR-042'
    },
    {
      id: 'REQ-2026-08485',
      resident: 'Bernadette V. Gomez',
      fullName: 'Bernadette V. Gomez',
      age: '38',
      address: '112 Sampaguita Alley',
      sitio: 'Sitio Santolan',
      purokSitio: 'Sitio Santolan',
      docType: 'Certificate of Indigency',
      documentType: 'Certificate of Indigency',
      purpose: 'DSWD AICS Educational Grant Assistance',
      dateFiled: '2026-10-09',
      date: 'October 09, 2026',
      status: 'In Review',
      residencySince: 'February 2014',
      businessName: 'N/A',
      businessAddress: '112 Sampaguita Alley, Sitio Santolan, Barangay Pallocan Kanluran',
      natureOfBusiness: 'N/A',
      businessType: 'N/A',
      numberOfEmployees: '0',
      contact: '0917 888 9012',
      idOnRecord: 'Voter\'s ID 0144A'
    },
    {
      id: 'REQ-2026-08484',
      resident: 'Danilo E. Perez',
      fullName: 'Danilo E. Perez',
      age: '49',
      address: 'Phase 2 Block 5, Potenciana Village',
      sitio: 'Potenciana Village',
      purokSitio: 'Potenciana Village',
      docType: 'Barangay Clearance',
      documentType: 'Barangay Clearance',
      purpose: 'Bank Account Opening (OFW Allottee Savings Account)',
      dateFiled: '2026-10-09',
      date: 'October 09, 2026',
      status: 'Ready for Pickup',
      residencySince: 'September 2006',
      businessName: 'Perez Transport Services',
      businessAddress: 'Phase 2 Block 5, Potenciana Village, Barangay Pallocan Kanluran',
      natureOfBusiness: 'Passenger Transport',
      businessType: 'Sole Proprietorship',
      numberOfEmployees: '4',
      contact: '0922 111 6543',
      idOnRecord: 'UMID SSS ID 03-889102-1'
    },
    {
      id: 'REQ-2026-08483',
      resident: 'Corazon T. Marasigan',
      fullName: 'Corazon T. Marasigan',
      age: '58',
      address: '28 Embankment Way',
      sitio: 'Sitio Ibaba',
      purokSitio: 'Sitio Ibaba',
      docType: 'Certificate of Residency',
      documentType: 'Certificate of Residency',
      purpose: 'Meralco Electric Service Connection & Meter Relocation',
      dateFiled: '2026-10-08',
      date: 'October 08, 2026',
      status: 'In Review',
      residencySince: 'July 1999',
      businessName: 'Marasigan Rice Supply',
      businessAddress: '28 Embankment Way, Sitio Ibaba, Barangay Pallocan Kanluran',
      natureOfBusiness: 'Grain & Rice Trading',
      businessType: 'Sole Proprietorship',
      numberOfEmployees: '2',
      contact: '0916 333 7890',
      idOnRecord: 'Barangay ID #PK-2025-442'
    },
    {
      id: 'REQ-2026-08482',
      resident: 'Kevin Paul Ramos',
      fullName: 'Kevin Paul Ramos',
      age: '33',
      address: '019 Commercial Strip, G.C Berberabe',
      sitio: 'G.C Berberabe',
      purokSitio: 'G.C Berberabe',
      docType: 'Barangay Business Clearance',
      documentType: 'Barangay Business Clearance',
      purpose: 'Barangay Business Clearance Application for Auto Repair Shop',
      dateFiled: '2026-10-08',
      date: 'October 08, 2026',
      status: 'In Review',
      residencySince: 'September 2017',
      businessName: 'Apex Motor Works & Vulcanizing Shop',
      businessAddress: '019 Commercial Strip, G.C Berberabe, Barangay Pallocan Kanluran',
      natureOfBusiness: 'Automotive Mechanical & Electrical Repair',
      businessType: 'Sole Proprietorship',
      numberOfEmployees: '5',
      contact: '0929 444 0987',
      idOnRecord: 'DTI Registration 2026-092'
    },
    {
      id: 'REQ-2026-08481',
      resident: 'Elena S. Villanueva',
      fullName: 'Elena S. Villanueva',
      age: '61',
      address: '055 Creekview Path',
      sitio: 'Sitio Santolan',
      purokSitio: 'Sitio Santolan',
      docType: 'Certificate of Indigency',
      documentType: 'Certificate of Indigency',
      purpose: 'Hospitalization Guarantee Letter with City Health Office',
      dateFiled: '2026-10-08',
      date: 'October 08, 2026',
      status: 'In Review',
      residencySince: 'October 1995',
      businessName: 'N/A',
      businessAddress: '055 Creekview Path, Sitio Santolan, Barangay Pallocan Kanluran',
      natureOfBusiness: 'N/A',
      businessType: 'N/A',
      numberOfEmployees: '0',
      contact: '0918 666 5432',
      idOnRecord: 'PhilID ****-****-7104'
    },
    {
      id: 'REQ-2026-08480',
      resident: 'Nestor C. Macalalad',
      fullName: 'Nestor C. Macalalad',
      age: '47',
      address: '034 Calicanto Road',
      sitio: 'Sitio Ilaya',
      purokSitio: 'Sitio Ilaya',
      docType: 'Barangay Clearance',
      documentType: 'Barangay Clearance',
      purpose: 'Tricycle Operator Permit & TODA Franchise Renewal',
      dateFiled: '2026-10-07',
      date: 'October 07, 2026',
      status: 'Ready for Pickup',
      residencySince: 'December 2004',
      businessName: 'Macalalad TODA Fleet Unit',
      businessAddress: '034 Calicanto Road, Sitio Ilaya, Barangay Pallocan Kanluran',
      natureOfBusiness: 'Transport Public Utility',
      businessType: 'Sole Proprietorship',
      numberOfEmployees: '1',
      contact: '0920 333 8811',
      idOnRecord: 'Driver\'s License Professional'
    },
    {
      id: 'REQ-2026-08479',
      resident: 'Rosario M. Javier',
      fullName: 'Rosario M. Javier',
      age: '30',
      address: '018 Sitio Gitna Center',
      sitio: 'Sitio Gitna',
      purokSitio: 'Sitio Gitna',
      docType: 'Barangay Clearance',
      documentType: 'Barangay Clearance',
      purpose: 'Passport Application at DFA Consular Office Lipa',
      dateFiled: '2026-10-07',
      date: 'October 07, 2026',
      status: 'In Review',
      residencySince: 'May 2016',
      businessName: 'Javier Online Boutique',
      businessAddress: '018 Sitio Gitna Center, Barangay Pallocan Kanluran',
      natureOfBusiness: 'E-commerce Apparel',
      businessType: 'Sole Proprietorship',
      numberOfEmployees: '2',
      contact: '0917 555 7722',
      idOnRecord: 'PhilID ****-****-9011'
    },
    {
      id: 'REQ-2026-08478',
      resident: 'Gilbert R. Tolentino',
      fullName: 'Gilbert R. Tolentino',
      age: '20',
      address: '099 San Juan St.',
      sitio: 'Sitio Ibaba',
      purokSitio: 'Sitio Ibaba',
      docType: 'Certification for First-Time Job Seeker',
      documentType: 'Certification for First-Time Job Seeker',
      purpose: 'Supermarket Inventory Assistant Application (RA 11261)',
      dateFiled: '2026-10-07',
      date: 'October 07, 2026',
      status: 'In Review',
      residencySince: 'March 2006',
      businessName: 'N/A (Jobseeker)',
      businessAddress: '099 San Juan St., Sitio Ibaba, Barangay Pallocan Kanluran',
      natureOfBusiness: 'N/A',
      businessType: 'N/A',
      numberOfEmployees: '0',
      contact: '0928 999 1234',
      idOnRecord: 'School ID BSU 2026'
    },
    {
      id: 'REQ-2026-08477',
      resident: 'Patricia A. Dimaano',
      fullName: 'Patricia A. Dimaano',
      age: '24',
      address: 'Block 2 Lot 15, Tierra Verde',
      sitio: 'Tierra Verde',
      purokSitio: 'Tierra Verde',
      docType: 'Certificate of Residency',
      documentType: 'Certificate of Residency',
      purpose: 'School Transfer Credentials & Scholarship Application',
      dateFiled: '2026-10-06',
      date: 'October 06, 2026',
      status: 'Ready for Pickup',
      residencySince: 'August 2011',
      businessName: 'Dimaano Tutoring Services',
      businessAddress: 'Block 2 Lot 15, Tierra Verde, Barangay Pallocan Kanluran',
      natureOfBusiness: 'Educational Services',
      businessType: 'Sole Proprietorship',
      numberOfEmployees: '1',
      contact: '0915 777 4321',
      idOnRecord: 'Voter\'s Certificate'
    },
    {
      id: 'REQ-2026-08476',
      resident: 'Eduardo F. Cueto',
      fullName: 'Eduardo F. Cueto',
      age: '54',
      address: '081 Riverside Bridge',
      sitio: 'Sitio Santolan',
      purokSitio: 'Sitio Santolan',
      docType: 'Certificate of Indigency',
      documentType: 'Certificate of Indigency',
      purpose: 'DSWD 4Ps Re-Certification & Household Profiling',
      dateFiled: '2026-10-06',
      date: 'October 06, 2026',
      status: 'In Review',
      residencySince: 'January 1993',
      businessName: 'N/A',
      businessAddress: '081 Riverside Bridge, Sitio Santolan, Barangay Pallocan Kanluran',
      natureOfBusiness: 'N/A',
      businessType: 'N/A',
      numberOfEmployees: '0',
      contact: '0921 444 6578',
      idOnRecord: '4Ps Card Household 0842'
    },
    {
      id: 'REQ-2026-08475',
      resident: 'Kristine Joy Montalbo',
      fullName: 'Kristine Joy Montalbo',
      age: '26',
      address: '045 Crossing Ilaya',
      sitio: 'Sitio Ilaya',
      purokSitio: 'Sitio Ilaya',
      docType: 'Barangay Clearance',
      documentType: 'Barangay Clearance',
      purpose: 'Call Center Agent Job Placement & NBI Clearance Requirement',
      dateFiled: '2026-10-06',
      date: 'October 06, 2026',
      status: 'In Review',
      residencySince: 'February 2013',
      businessName: 'Montalbo Baked Treats',
      businessAddress: '045 Crossing Ilaya, Barangay Pallocan Kanluran',
      natureOfBusiness: 'Pastry Production & Retail',
      businessType: 'Sole Proprietorship',
      numberOfEmployees: '2',
      contact: '0919 222 9988',
      idOnRecord: 'PhilID ****-****-4215'
    }
  ];

  function normalizeServiceRequest(r) {
    if (!r) return null;
    const id = r.id || r.ref || ('REQ-2026-' + Math.floor(10000 + Math.random() * 90000));
    const ref = r.ref || r.id || id;
    const fullName = r.fullName || r.resident || 'Juan M. Dela Cruz';
    const resident = r.resident || fullName;
    const docType = r.docType || r.documentType || 'Barangay Clearance';
    const documentType = r.documentType || docType;
    const sitio = r.sitio || r.purokSitio || 'Sitio Ibaba';
    const purokSitio = r.purokSitio || sitio;
    const address = r.address || (sitio + ', Barangay Pallocan West');
    const purpose = r.purpose || 'Barangay Certification';
    const dateFiled = r.dateFiled || (r.date ? r.date : new Date().toISOString().slice(0, 10));
    const date = r.date || dateFiled;
    const status = r.status || 'In Review';
    const age = r.age || '34';
    const contact = r.contact || r.mobile || r.phone || '0917 123 4567';
    const idOnRecord = r.idOnRecord || (r.attachmentName ? `Attached: ${r.attachmentName}` : 'PhilID ****-****-8492');
    const userEmail = r.userEmail || r.email || '';
    const residentId = r.residentId || 'PW-2026-08492';
    const residencySince = r.residencySince || 'March 2012';
    const claimMethod = r.claimMethod || 'Physical Pickup at Barangay Hall';
    const claimTarget = r.claimTarget || 'Estimated within 1–2 business days';
    const notes = r.notes || (status === 'Ready for Pickup' ? 'Cleared by Lupong Tagapamayapa. Document printed and sealed. Ready for collection.' : 'Application received online. Document being prepared for validation by Barangay Secretary.');

    return {
      ...r,
      id,
      ref,
      fullName,
      resident,
      docType,
      documentType,
      sitio,
      purokSitio,
      address,
      purpose,
      dateFiled,
      date,
      status,
      age,
      contact,
      idOnRecord,
      userEmail,
      residentId,
      residencySince,
      claimMethod,
      claimTarget,
      notes,
      businessName: r.businessName || 'N/A',
      businessAddress: r.businessAddress || (address + ', Barangay Pallocan West'),
      natureOfBusiness: r.natureOfBusiness || 'N/A',
      businessType: r.businessType || 'N/A',
      numberOfEmployees: r.numberOfEmployees || '0'
    };
  }

  function persistServiceRequests() {
    try {
      const json = JSON.stringify(serviceRequests);
      localStorage.setItem('brgy360_service_requests', json);
      localStorage.setItem('brgy360_requests', json);
      localStorage.setItem('brgy360_user_requests', json);
      window.dispatchEvent(new CustomEvent('brgy360_requests_changed', { detail: serviceRequests }));
    } catch (e) {
      console.warn('Error saving serviceRequests to localStorage:', e);
    }
  }

  function loadServiceRequests() {
    try {
      const raw = localStorage.getItem('brgy360_service_requests') || localStorage.getItem('brgy360_requests');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const list = parsed.map(normalizeServiceRequest);
          const existingIds = new Set(list.map(r => r.id || r.ref));
          INITIAL_SERVICE_REQUESTS.forEach(seed => {
            if (!existingIds.has(seed.id) && !existingIds.has(seed.ref)) {
              list.push(normalizeServiceRequest(seed));
            }
          });
          return list;
        }
      }
    } catch (e) {
      console.warn('Error reading brgy360_service_requests:', e);
    }
    const initial = INITIAL_SERVICE_REQUESTS.map(normalizeServiceRequest);
    try {
      const json = JSON.stringify(initial);
      localStorage.setItem('brgy360_service_requests', json);
      localStorage.setItem('brgy360_requests', json);
    } catch (e) {}
    return initial;
  }

  let serviceRequests = loadServiceRequests();

  const SHARED_DEFAULT_CONCERNS = [
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

  function normalizeSitioName(val) {
    const canonical = [
      'Sitio Ibaba',
      'Sitio Santolan',
      'Sitio Ilaya',
      'Sitio Gitna',
      'Tierra Verde',
      'Potenciana Village',
      'G.C Berberabe'
    ];
    if (!val || typeof val !== 'string') return 'Sitio Ibaba';
    const trimmed = val.trim();
    if (canonical.includes(trimmed)) return trimmed;
    const lower = trimmed.toLowerCase();
    if (lower.includes('santolan')) return 'Sitio Santolan';
    if (lower.includes('ilaya')) return 'Sitio Ilaya';
    if (lower.includes('gitna')) return 'Sitio Gitna';
    if (lower.includes('potenciana')) return 'Potenciana Village';
    if (lower.includes('tierra verde')) return 'Tierra Verde';
    if (lower.includes('berberabe')) return 'G.C Berberabe';
    return 'Sitio Ibaba';
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

  function normalizeAdminConcern(raw) {
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
    const dateFiled = item.dateFiled || item.dateLogged || new Date().toISOString().slice(0, 10);
    const resolutionNote = item.resolutionNote !== undefined ? item.resolutionNote : (item.actionTaken || '');

    return {
      ref: ref,
      id: ref,
      title: title,
      summary: title,
      desc: desc,
      submittedDetails: desc,
      category: category,
      urgency: urgency,
      severity: urgency,
      status: status,
      currentStage: status === 'Resolved' ? 3 : (status === 'In Progress' ? 2 : 1),
      dateFiled: dateFiled,
      dateLogged: dateFiled,
      sitio: sitio,
      landmark: landmark,
      location: location,
      reporter: item.reporter || (isJuanLegacy ? 'Juan Dela Cruz' : 'Verified Resident'),
      userEmail: item.userEmail || (isJuanLegacy ? 'juan.delacruz@example.com' : ''),
      userMobile: item.userMobile || (isJuanLegacy ? '0917 123 4567' : ''),
      userAddress: item.userAddress || (isJuanLegacy ? '142 Pallocan Blvd, Barangay Pallocan West' : (sitio + ', Barangay Pallocan West')),
      residentId: item.residentId || (isJuanLegacy ? 'PW-2026-08492' : ''),
      photoName: item.photoName || null,
      photoData: item.photoData || null,
      resolutionNote: resolutionNote,
      actionTaken: resolutionNote,
      notes: resolutionNote || desc,
      updatedAt: item.updatedAt || null
    };
  }

  let incidentTickets = [];

  function persistConcernsToStorage() {
    try {
      const normalized = incidentTickets.map(normalizeAdminConcern);
      incidentTickets = normalized;
      localStorage.setItem('brgy360_concerns', JSON.stringify(normalized));
    } catch (err) {
      console.warn('Error saving concerns to storage:', err);
    }
  }

  function syncResidentConcernsFromStorage() {
    try {
      const rawStr = localStorage.getItem('brgy360_concerns');
      let list = [];
      if (!rawStr) {
        list = SHARED_DEFAULT_CONCERNS.map(normalizeAdminConcern);
        localStorage.setItem('brgy360_concerns', JSON.stringify(list));
        localStorage.setItem('brgy360_concerns_connected_v3', 'true');
      } else {
        const parsed = JSON.parse(rawStr);
        const rawList = Array.isArray(parsed) ? parsed : SHARED_DEFAULT_CONCERNS;
        list = rawList.map(normalizeAdminConcern);

        if (!localStorage.getItem('brgy360_concerns_connected_v3')) {
          const existingRefs = new Set(list.map(c => c.ref));
          SHARED_DEFAULT_CONCERNS.forEach(seed => {
            if (!existingRefs.has(seed.ref)) {
              list.push(normalizeAdminConcern(seed));
            } else {
              const idx = list.findIndex(c => c.ref === seed.ref);
              if (idx !== -1) {
                if (!rawList[idx].title) {
                  list[idx].title = seed.title;
                  list[idx].summary = seed.title;
                }
                if (!rawList[idx].reporter) list[idx].reporter = seed.reporter;
                if (!rawList[idx].userEmail) list[idx].userEmail = seed.userEmail;
                if (!rawList[idx].userMobile) list[idx].userMobile = seed.userMobile;
                if (!rawList[idx].residentId) list[idx].residentId = seed.residentId;
              }
            }
          });
          localStorage.setItem('brgy360_concerns_connected_v3', 'true');
        }
        localStorage.setItem('brgy360_concerns', JSON.stringify(list));
      }
      incidentTickets = list;
    } catch (err) {
      console.warn('Error syncing resident concerns:', err);
      incidentTickets = SHARED_DEFAULT_CONCERNS.map(normalizeAdminConcern);
    }
  }
  syncResidentConcernsFromStorage();

  // Prescriptive Directive Execution State
  let directiveState = {
    action1Executed: false,
    action2Executed: false,
    action3Executed: false
  };

  // Proposals Dataset (Citizen Community Initiatives - 12 Total across 4 Statuses)
  const DEFAULT_CITIZEN_PROPOSALS = [
    // 1. PENDING (4 items)
    {
      id: 'PROP-2026-001',
      title: 'Solar Streetlight Installation - Sitio Gitna',
      category: 'Infrastructure',
      year: '2026',
      location: 'Sitio Gitna',
      sitio: 'Sitio Gitna',
      proponent: 'Juan Dela Cruz',
      date: 'Oct 12, 2026',
      budget: '₱150,000.00',
      status: 'Pending',
      description: 'Installation of 12 standalone high-efficiency solar LED pole lights along the dark road curves of Sitio Gitna to curb nighttime road hazards and vehicle accidents.'
    },
    {
      id: 'PROP-2026-002',
      title: 'Community Garden Development & Urban Farming Hub',
      category: 'Environment',
      year: '2026',
      location: 'Sitio Ibaba',
      sitio: 'Sitio Ibaba',
      proponent: 'Maria Santos · Women’s Club',
      date: 'Oct 13, 2026',
      budget: '₱95,000.00',
      status: 'Pending',
      description: 'Establishment of communal raised garden beds, organic composting sheds, and a drip irrigation system to supply low-income families with fresh vegetables and herbs.'
    },
    {
      id: 'PROP-2026-003',
      title: 'Elderly Community Wellness & Blood Pressure Kiosk',
      category: 'Health',
      year: '2026',
      location: 'Tierra Verde',
      sitio: 'Tierra Verde',
      proponent: 'Senior Citizens Association',
      date: 'Oct 10, 2026',
      budget: '₱70,000.00',
      status: 'Pending',
      description: 'Dedicated automated digital blood pressure checking station, glucose monitoring strips, and resting lounge with shaded benches for senior citizens.'
    },
    {
      id: 'PROP-2026-004',
      title: 'Pedestrian Speed Bump & Zebra Crossing at Elementary School',
      category: 'Public Safety',
      year: '2026',
      location: 'Sitio Ilaya',
      sitio: 'Sitio Ilaya',
      proponent: 'PTA Pres. Ricardo Ramos',
      date: 'Oct 14, 2026',
      budget: '₱45,000.00',
      status: 'Pending',
      description: 'Installation of two heavy-duty rubber speed tables, high-visibility thermal plastic pedestrian crossings, and school-zone LED warning flashing beacons.'
    },

    // 2. UNDER REVIEW (2 items)
    {
      id: 'PROP-2026-005',
      title: 'Barangay Materials Recovery Facility (MRF) Expansion',
      category: 'Environment',
      year: '2026',
      location: 'Sitio Ibaba',
      sitio: 'Sitio Ibaba',
      proponent: 'Ibaba Homeowners Civic Action',
      date: 'Oct 08, 2026',
      budget: '₱85,000.00',
      status: 'Under Review',
      description: 'Construction of dedicated segregation bays and high-capacity shredder for organic household waste to support barangay urban gardening compost operations.'
    },
    {
      id: 'PROP-2026-006',
      title: 'Youth Sports Center Covered Court Roof Restoration',
      category: 'Sports & Youth',
      year: '2026',
      location: 'Sitio Santolan',
      sitio: 'Sitio Santolan',
      proponent: 'SK Council Pallocan West',
      date: 'Oct 04, 2026',
      budget: '₱110,000.00',
      status: 'Under Review',
      description: 'Repair and replacement of corrugated metal roofing sheets damaged by monsoon winds, alongside water-resistant sports floor sealant.'
    },

    // 3. APPROVED (5 items)
    {
      id: 'PROP-2026-007',
      title: 'Solar LED Lighting Installation along River Embankment',
      category: 'Infrastructure',
      year: '2026',
      location: 'Tierra Verde',
      sitio: 'Tierra Verde',
      proponent: 'Engr. Marco Villanueva',
      date: 'Sep 28, 2026',
      budget: '₱120,000.00',
      status: 'Approved',
      description: 'Installation of 18 high-lumen solar streetlights along the 650-meter unlit pathway beside the creek to deter nighttime illegal dumping and enhance pedestrian safety.'
    },
    {
      id: 'PROP-2026-008',
      title: 'CCTV Surveillance Expansion for Crime Prevention',
      category: 'Public Safety',
      year: '2026',
      location: 'Potenciana Village',
      sitio: 'Potenciana Village',
      proponent: 'BPSO Tanod Executive Committee',
      date: 'Sep 15, 2026',
      budget: '₱180,000.00',
      status: 'Approved',
      description: 'Deploying 8 weather-sealed 4K optical zoom IP cameras interconnected to the Barangay Hall Command Center for real-time traffic and perimeter monitoring.'
    },
    {
      id: 'PROP-2026-009',
      title: 'Drainage Desilting & Reinforced Concrete Cover Replacement',
      category: 'Infrastructure',
      year: '2026',
      location: 'G.C Berberabe',
      sitio: 'G.C Berberabe',
      proponent: 'Pallocan Merchants Guild',
      date: 'Sep 20, 2026',
      budget: '₱135,000.00',
      status: 'Approved',
      description: 'Deep mechanical desilting of 400 meters of clogged subterranean canals and replacing fractured curb covers with heavy-duty steel-reinforced grates.'
    },
    {
      id: 'PROP-2026-010',
      title: 'Community Disaster Siren & Early Flood Alert Station',
      category: 'Public Safety',
      year: '2026',
      location: 'Sitio Santolan',
      sitio: 'Sitio Santolan',
      proponent: 'BDRRMC Volunteer Corps',
      date: 'Sep 10, 2026',
      budget: '₱90,000.00',
      status: 'Approved',
      description: 'Automated acoustic early warning siren linked to ultrasonic water level sensors with SMS broadcasting alerts during flash flood risks.'
    },
    {
      id: 'PROP-2026-011',
      title: 'Portable Emergency First-Aid & Oxygen Outreach Kit',
      category: 'Health',
      year: '2026',
      location: 'Sitio Ilaya',
      sitio: 'Sitio Ilaya',
      proponent: 'Dr. Angela Perez & BHWs',
      date: 'Sep 05, 2026',
      budget: '₱65,000.00',
      status: 'Approved',
      description: 'Procurement of 3 mobile emergency responder trauma backpacks equipped with portable O2 tanks, pulse oximeters, and automated external defibrillator (AED).'
    },

    // 4. REJECTED (1 item)
    {
      id: 'PROP-2026-012',
      title: 'Commercial Billboard Structure at Public Plaza Entrance',
      category: 'Infrastructure',
      year: '2026',
      location: 'G.C Berberabe',
      sitio: 'G.C Berberabe',
      proponent: 'PrimeAds Media Group',
      date: 'Sep 02, 2026',
      budget: '₱250,000.00',
      status: 'Rejected',
      description: 'Proposed 20-foot commercial billboard framework along the plaza frontage; rejected by Barangay Council due to zoning ordinance and public sightline restrictions.'
    }
  ];

  function normalizeProposalRecord(p) {
    if (!p) return null;
    const id = p.id || p.ref || ('PROP-2026-' + Math.floor(100 + Math.random() * 900));
    const ref = p.ref || p.id || id;
    const title = p.title || 'Community Project Proposal';
    const category = p.category || 'Infrastructure';
    const location = p.location || p.sitio || 'Barangay Pallocan West';
    const sitio = p.sitio || p.location || location;
    const proponent = p.proponent || (p.user ? (p.user.name || p.user.fullName) : '') || 'Juan Dela Cruz';
    const email = p.email || p.userEmail || '';
    const residentId = p.residentId || '';
    const dateFiled = p.dateFiled || (p.date ? p.date : new Date().toISOString().split('T')[0]);
    const date = p.date || dateFiled;
    const year = p.year || (p.dateFiled ? String(p.dateFiled).slice(0, 4) : '2026');

    let rawBudgetNum = 0;
    if (typeof p.rawBudget === 'number' && !isNaN(p.rawBudget)) {
      rawBudgetNum = p.rawBudget;
    } else if (typeof p.budget === 'number' && !isNaN(p.budget)) {
      rawBudgetNum = p.budget;
    } else if (typeof p.budget === 'string') {
      const cleaned = p.budget.replace(/[^0-9.]/g, '');
      rawBudgetNum = parseFloat(cleaned) || 0;
    }
    const formattedBudget = '₱' + rawBudgetNum.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const timeline = p.timeline || 'Q1 2027 (3 months implementation)';
    const description = p.description || p.rationale || 'Citizen community project proposal submitted for Barangay Development Council review.';
    const rationale = p.rationale || p.description || description;

    let status = p.status || 'Pending';
    const sLow = String(status).toLowerCase();
    if (sLow.includes('review')) {
      status = 'Under Review';
    } else if (sLow.includes('approve')) {
      status = 'Approved';
    } else if (sLow.includes('reject')) {
      status = 'Rejected';
    } else {
      status = 'Pending';
    }

    const councilNotes = p.councilNotes || p.councilNote || '';
    const councilNote = p.councilNote || p.councilNotes || councilNotes;

    const norm = {
      ...p,
      id,
      ref,
      title,
      category,
      year,
      location,
      sitio,
      proponent,
      email,
      residentId,
      date,
      dateFiled,
      budget: formattedBudget,
      rawBudget: rawBudgetNum,
      timeline,
      status,
      description,
      rationale,
      councilNotes,
      councilNote
    };
    delete norm.votes;
    delete norm.targetVotes;
    return norm;
  }

  function loadCitizenProposals() {
    try {
      const stored = localStorage.getItem('brgy360_proposals');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeProposalRecord);
        }
      }
    } catch (e) {
      console.warn('Error reading brgy360_proposals:', e);
    }

    // Default seed including Juan Dela Cruz initial proposal
    const defaultJuan = {
      id: 'PROP-8421',
      ref: 'PROP-8421',
      title: 'Installation of Solar LED Streetlights along Sitio Ibaba Riverbank Walkway',
      category: 'Infrastructure',
      year: '2026',
      location: 'Sitio Ibaba',
      sitio: 'Sitio Ibaba',
      proponent: 'Juan Dela Cruz',
      email: 'juan@gmail.com',
      residentId: 'PW-2026-08492',
      date: 'Sep 28, 2026',
      dateFiled: '2026-09-28',
      budget: 150000,
      timeline: 'Q1 2027 (3 months implementation)',
      status: 'Under Review',
      description: 'The riverbank pathway is heavily traversed by over 300 residents daily but lacks grid electricity. Standalone solar lights provide clean, zero-grid-cost illumination to prevent accidents and deter nighttime criminality.',
      rationale: 'The riverbank pathway is heavily traversed by over 300 residents daily but lacks grid electricity. Standalone solar lights provide clean, zero-grid-cost illumination to prevent accidents and deter nighttime criminality.',
      councilNotes: 'Endorsed for technical site survey by the Committee on Infrastructure. Calendar for prioritization during the Barangay Assembly Deliberation.',
      councilNote: 'Endorsed for technical site survey by the Committee on Infrastructure. Calendar for prioritization during the Barangay Assembly Deliberation.'
    };

    const combinedSeed = [defaultJuan, ...DEFAULT_CITIZEN_PROPOSALS].map(normalizeProposalRecord);
    saveCitizenProposals(combinedSeed);
    return combinedSeed;
  }

  function saveCitizenProposals(data) {
    const listToSave = data || citizenProposals;
    try {
      localStorage.setItem('brgy360_proposals', JSON.stringify(listToSave));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('brgy360_proposals_changed', { detail: listToSave }));
    } catch (e) {
      console.warn('Error saving brgy360_proposals:', e);
    }
  }

  let citizenProposals = loadCitizenProposals();
  function clampProjectProgress(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return 0;
    return Math.max(0, Math.min(100, Math.round(num)));
  }

  function calculateProjectStatusFromProgress(progress) {
    const pct = clampProjectProgress(progress);
    if (pct === 100) return 'completed';
    if (pct >= 25) return 'ongoing';
    return 'planning';
  }

  const DEFAULT_CAPITAL_PROJECTS = [
    {
      code: 'PRJ-2026-01',
      title: 'E-Library & Free WiFi Tech Hub Refurbishment',
      description: 'Refurbishment of the Barangay Hall 2nd Floor into a high-speed digital study center with computer terminals and free internet for students.',
      location: 'Sitio Gitna',
      timeline: '2025-01-10 – 2025-08-15',
      year: '2025',
      budget: '₱420,000.00',
      progress: 100,
      status: 'completed',
      contractor: 'Batangas IT Systems Corp'
    },
    {
      code: 'PRJ-2026-02',
      title: 'Drainage Culvert Modernization Phase 1',
      description: 'Reinforcement and modernization of the main drainage culvert along Sitio Ibaba to prevent street flooding and storm runoff bottlenecks.',
      location: 'Sitio Ibaba',
      timeline: '2025-06-01 – 2025-11-30',
      year: '2025',
      budget: '₱350,000.00',
      progress: 100,
      status: 'completed',
      contractor: 'Solid Ground Infra Builders'
    },
    {
      code: 'PRJ-2026-03',
      title: 'Solar Powered Public Streetlighting (Phase 2)',
      description: 'Installation of standalone solar-powered LED streetlights across dark zones in Sitio Ilaya to bolster nighttime pedestrian and road safety.',
      location: 'Sitio Ilaya',
      timeline: '2026-02-15 – 2026-11-20',
      year: '2026',
      budget: '₱285,000.00',
      progress: 68,
      status: 'ongoing',
      contractor: 'SunPower Philippines Co'
    },
    {
      code: 'PRJ-2026-04',
      title: 'Barangay Disaster Operations Command Center (BDRRMC)',
      description: 'Establishment of an all-weather emergency operations and dispatch command center equipped with early-warning monitoring systems.',
      location: 'Potenciana Village',
      timeline: '2026-04-01 – 2026-12-15',
      year: '2026',
      budget: '₱410,000.00',
      progress: 42,
      status: 'ongoing',
      contractor: 'Metropolitan Tech Infrastructure'
    },
    {
      code: 'PRJ-2026-05',
      title: 'Sitio Santolan Pedestrian Footbridge Elevation',
      description: 'Structural elevation and steel handrail reinforcement of the Sitio Santolan pedestrian footbridge for safe all-season creek crossing.',
      location: 'Sitio Santolan',
      timeline: '2026-11-01 – 2027-02-28',
      year: '2026',
      budget: '₱180,000.00',
      progress: 10,
      status: 'planning',
      contractor: 'DPWH Batangas 1st District DEO'
    },
    {
      code: 'PRJ-2026-06',
      title: 'CCTV High-Definition Security Grid Expansion (16 Cams)',
      description: 'Deployment of 16 high-definition security cameras across major intersections, commercial strips, and barangay entry checkpoints.',
      location: 'G.C Berberabe',
      timeline: '2026-03-01 – 2026-10-31',
      year: '2026',
      budget: '₱170,000.00',
      progress: 35,
      status: 'delayed',
      contractor: 'FiberNet Security Solutions'
    }
  ];

  function normalizeProjectRecord(project) {
    const matchedDefault = DEFAULT_CAPITAL_PROJECTS.find(d => d.code === project?.code);
    const progress = clampProjectProgress(project?.progress ?? 0);
    const rawStatus = String(project?.status || '').toLowerCase().trim();
    const status = (rawStatus === 'delayed' && progress < 100)
      ? 'delayed'
      : calculateProjectStatusFromProgress(progress);
    const timeline = project?.timeline || matchedDefault?.timeline || '2026-10-15 – 2027-04-30';
    const yearMatch = String(timeline).match(/\b(20\d{2})\b/);
    const year = String(project?.year || matchedDefault?.year || (yearMatch ? yearMatch[1] : '2026'));
    const description = String(
      project?.description ||
      matchedDefault?.description ||
      project?.contractor ||
      'Barangay Annual Investment Plan (AIP) community infrastructure project.'
    ).trim();

    return {
      ...matchedDefault,
      ...project,
      timeline,
      year,
      description,
      progress,
      status
    };
  }

  function loadCapitalProjects() {
    try {
      const saved = localStorage.getItem('brgy360_capital_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeProjectRecord);
        }
      }
    } catch (e) {
      console.warn('Error loading brgy360_capital_projects:', e);
    }
    const defaults = DEFAULT_CAPITAL_PROJECTS.map(normalizeProjectRecord);
    try {
      localStorage.setItem('brgy360_capital_projects', JSON.stringify(defaults));
    } catch (e) {}
    return defaults;
  }

  function saveCapitalProjects(data) {
    const listToSave = (data || capitalProjects).map(normalizeProjectRecord);
    try {
      localStorage.setItem('brgy360_capital_projects', JSON.stringify(listToSave));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('brgy360_projects_changed', { detail: listToSave }));
    } catch (e) {
      console.warn('Error saving brgy360_capital_projects:', e);
    }
  }

  let capitalProjects = loadCapitalProjects();

  // Announcements Dataset (Public Bulletins)
  const defaultAnnouncements = [
    {
      id: 'ANN-2026-08',
      title: 'Dengue Vector Surveillance & Larvicide Fogging Schedule',
      category: 'Health',
      audience: 'Sitio Ibaba',
      date: '2026-10-10',
      status: 'Active',
      isCritical: false,
      content: 'In coordination with City Health Office, fogging and larvicide distribution will occur Thursday from 6:00 AM to 9:00 AM. Please cover water containers.'
    },
    {
      id: 'ANN-2026-07',
      title: 'Pre-Monsoon Flood Preparedness Advisory: Tierra Verde',
      category: 'Emergency',
      audience: 'Tierra Verde',
      date: '2026-10-09',
      status: 'Active',
      isCritical: true,
      content: 'Residents along the creek embankment are alerted to monitor water level warnings. Evacuation standby point established at Tierra Verde Multi-Purpose Gym.'
    },
    {
      id: 'ANN-2026-06',
      title: 'General Assembly & Sangguniang Barangay Public Consultation',
      category: 'General',
      audience: 'All Residents',
      date: '2026-10-05',
      status: 'Archived',
      isCritical: false,
      content: 'Quarterly Barangay Assembly convened to present 2026 YTD Budget Execution and discuss AIP 2027 project submissions.'
    }
  ];

  let announcementsList = defaultAnnouncements;
  try {
    const savedAnn = localStorage.getItem('brgy360_announcements');
    if (savedAnn) {
      announcementsList = JSON.parse(savedAnn);
      if (Array.isArray(announcementsList)) {
        announcementsList.forEach((a) => {
          if (!a) return;
          if (a.audience && a.audience !== 'All Residents') {
            a.audience = normalizeSitioName(a.audience);
          }
          if (typeof a.title === 'string') {
            a.title = a.title.replace(/Purok\s*2/gi, 'Tierra Verde');
          }
        });
      }
    }
  } catch (e) {
    console.warn('Error reading saved announcements', e);
  }

  // Budget Allocation & Expense Records Dataset (Admin Portal)
  const DEFAULT_ADMIN_BUDGET_RECORDS = [
    // 2026 Fiscal Year
    {
      id: 'BGT-2026-001',
      year: '2026',
      quarter: 'Q1',
      category: 'Infrastructure',
      description: 'Drainage Desiltation & Street Repair Sitio Ibaba',
      budget: 320000,
      actual: 310000
    },
    {
      id: 'BGT-2026-002',
      year: '2026',
      quarter: 'Q1',
      category: 'Health',
      description: 'Q1 Medical Mission & Senior Vaccine Procurement',
      budget: 150000,
      actual: 145000
    },
    {
      id: 'BGT-2026-003',
      year: '2026',
      quarter: 'Q1',
      category: 'Administration',
      description: 'Barangay Hall Office Supplies & IT Equipment',
      budget: 120000,
      actual: 115000
    },
    {
      id: 'BGT-2026-004',
      year: '2026',
      quarter: 'Q1',
      category: 'Social Services',
      description: 'First Quarter Youth Leadership & Sports Camp',
      budget: 95000,
      actual: 90000
    },
    {
      id: 'BGT-2026-005',
      year: '2026',
      quarter: 'Q2',
      category: 'Infrastructure',
      description: 'Smart Solar Streetlights Installation Phase 1',
      budget: 380000,
      actual: 325000
    },
    {
      id: 'BGT-2026-006',
      year: '2026',
      quarter: 'Q2',
      category: 'Health',
      description: 'Child Nutrition & Deworming Outreach Program',
      budget: 110000,
      actual: 95000
    },
    {
      id: 'BGT-2026-007',
      year: '2026',
      quarter: 'Q2',
      category: 'Administration',
      description: 'Staff Capacity Training & Semi-Annual Audit',
      budget: 80000,
      actual: 72000
    },
    {
      id: 'BGT-2026-008',
      year: '2026',
      quarter: 'Q2',
      category: 'Social Services',
      description: 'Community Day Care Center Educational Materials',
      budget: 70000,
      actual: 56000
    },
    {
      id: 'BGT-2026-009',
      year: '2026',
      quarter: 'Q3',
      category: 'Infrastructure',
      description: 'Flood Retaining Wall Reinforcement Tierra Verde',
      budget: 300000,
      actual: 150000
    },
    {
      id: 'BGT-2026-010',
      year: '2026',
      quarter: 'Q3',
      category: 'Health',
      description: 'Dengue Prevention & Clean Water Testing Kits',
      budget: 90000,
      actual: 60000
    },
    {
      id: 'BGT-2026-011',
      year: '2026',
      quarter: 'Q4',
      category: 'Infrastructure',
      description: 'CCTVs & Operations Center Equipment Setup',
      budget: 260000,
      actual: 0
    },
    {
      id: 'BGT-2026-012',
      year: '2026',
      quarter: 'Q4',
      category: 'Health',
      description: 'Year-End First Aid & Disaster Emergency Resupply',
      budget: 70000,
      actual: 0
    },
    {
      id: 'BGT-2026-013',
      year: '2026',
      quarter: 'Q4',
      category: 'Administration',
      description: 'Fiscal Year-End Reporting & Accounting System',
      budget: 60000,
      actual: 0
    },
    {
      id: 'BGT-2026-014',
      year: '2026',
      quarter: 'Q4',
      category: 'Social Services',
      description: 'PWD & Senior Citizens Year-End Support Package',
      budget: 80000,
      actual: 0
    },
    // 2025 Fiscal Year
    {
      id: 'BGT-2025-001',
      year: '2025',
      quarter: 'Q1',
      category: 'Infrastructure',
      description: 'Barangay Hall E-Library & Tech Hub Refurbishment',
      budget: 420000,
      actual: 420000
    },
    {
      id: 'BGT-2025-002',
      year: '2025',
      quarter: 'Q1',
      category: 'Health',
      description: 'Health Station Modernization & Diagnostic Kits',
      budget: 290000,
      actual: 290000
    },
    {
      id: 'BGT-2025-003',
      year: '2025',
      quarter: 'Q2',
      category: 'Infrastructure',
      description: 'Sitio Gitna Central Covered Court Concrete Paving',
      budget: 350000,
      actual: 345000
    },
    {
      id: 'BGT-2025-004',
      year: '2025',
      quarter: 'Q2',
      category: 'Administration',
      description: 'Barangay Records Digitization & Computer Terminals',
      budget: 140000,
      actual: 138000
    },
    {
      id: 'BGT-2025-005',
      year: '2025',
      quarter: 'Q3',
      category: 'Health',
      description: 'Anti-Dengue Fogging & Clean Water Safety Project',
      budget: 180000,
      actual: 175000
    },
    {
      id: 'BGT-2025-006',
      year: '2025',
      quarter: 'Q3',
      category: 'Social Services',
      description: 'Annual Youth Summer Sports Camp & Tournaments',
      budget: 120000,
      actual: 118000
    },
    {
      id: 'BGT-2025-007',
      year: '2025',
      quarter: 'Q4',
      category: 'Infrastructure',
      description: 'Sitio Santolan Slope Stabilization & Pathway',
      budget: 310000,
      actual: 300000
    },
    {
      id: 'BGT-2025-008',
      year: '2025',
      quarter: 'Q4',
      category: 'Social Services',
      description: 'Senior Citizens & PWD Year-End Livelihood Aid',
      budget: 170000,
      actual: 164000
    }
  ];

  let adminBudgetRecords = [];
  try {
    const stored = localStorage.getItem('brgy360_budget_records');
    if (stored) {
      adminBudgetRecords = JSON.parse(stored);
      if (Array.isArray(adminBudgetRecords)) {
        adminBudgetRecords.forEach((rec) => {
          if (rec && typeof rec.description === 'string') {
            rec.description = rec.description
              .replace(/Purok\s*1-3/gi, 'Sitio Ibaba')
              .replace(/Purok\s*2/gi, 'Tierra Verde')
              .replace(/Purok\s*4/gi, 'Sitio Gitna')
              .replace(/Sitio\s+Riverside/gi, 'Sitio Santolan');
          }
        });
      }
    } else {
      adminBudgetRecords = [...DEFAULT_ADMIN_BUDGET_RECORDS];
      localStorage.setItem('brgy360_budget_records', JSON.stringify(adminBudgetRecords));
    }
  } catch (e) {
    adminBudgetRecords = [...DEFAULT_ADMIN_BUDGET_RECORDS];
  }

  function saveAdminBudgetRecords() {
    try {
      localStorage.setItem('brgy360_budget_records', JSON.stringify(adminBudgetRecords));
    } catch (e) {
      console.warn('Failed saving budget records to localStorage', e);
    }
  }

  const REPORTS_ANALYTICS_DATA = {
    '2026': {
      budgetCategory: {
        labels: ['Administration', 'Health', 'Social Services', 'Infrastructure'],
        budget: [260000, 420000, 245000, 1260000],
        actual: [187000, 300000, 146000, 785000]
      },
      quarterly: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        budget: [685000, 650000, 390000, 470000],
        actual: [660000, 548000, 210000, 0]
      },
      projectStatus: {
        labels: ['Ongoing', 'Completed', 'Delayed', 'Planning'],
        data: [2, 2, 1, 1],
        colors: ['#2563eb', '#10b981', '#e11d48', '#94a3b8']
      },
      requestType: {
        labels: ['Barangay Clearance', 'Certificate of Indigency', 'Certificate of Residency', 'Business Clearance', 'First-Time Jobseeker'],
        data: [6, 5, 3, 2, 2],
        colors: ['#0b1e36', '#2563eb', '#0284c7', '#d97706', '#10b981']
      },
      concerns: {
        labels: ['Infrastructure', 'Sanitation', 'Safety', 'Noise', 'Utilities'],
        data: [4, 4, 3, 2, 1],
        color: '#e11d48'
      }
    },
    '2025': {
      budgetCategory: {
        labels: ['Administration', 'Health', 'Social Services', 'Infrastructure'],
        budget: [220000, 380000, 210000, 1150000],
        actual: [218000, 375000, 205000, 1120000]
      },
      quarterly: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        budget: [490000, 490000, 490000, 490000],
        actual: [485000, 480000, 482000, 471000]
      },
      projectStatus: {
        labels: ['Ongoing', 'Completed', 'Delayed', 'Planning'],
        data: [0, 4, 0, 0],
        colors: ['#2563eb', '#10b981', '#e11d48', '#94a3b8']
      },
      requestType: {
        labels: ['Barangay Clearance', 'Certificate of Indigency', 'Certificate of Residency', 'Business Clearance', 'First-Time Jobseeker'],
        data: [5, 4, 3, 2, 1],
        colors: ['#0b1e36', '#2563eb', '#0284c7', '#d97706', '#10b981']
      },
      concerns: {
        labels: ['Infrastructure', 'Sanitation', 'Safety', 'Noise', 'Utilities'],
        data: [4, 3, 2, 1, 1],
        color: '#e11d48'
      }
    }
  };

  // Active UI filter & selection states (declared early to prevent TDZ errors on initial view render)
  let currentProposalFilter = 'all';
  let currentProjectFilter = 'all';
  let currentAnnouncementFilter = 'all';
  let currentReqStatusFilter = 'all';
  let currentReqCategoryFilter = 'all';
  let currentReqSearch = '';
  let currentIncStatusFilter = 'all';
  let currentIncCategoryFilter = 'all';
  let currentIncUrgencyFilter = 'all';
  let currentIncSearch = '';
  let currentInspectingReqId = null;
  let currentInspectingIncId = null;
  let currentResolvingIncidentId = null;

  // Resident Verification & Pre-Registration State
  let currentResStatusFilter = 'all';
  let currentResSearch = '';
  let currentResSitioFilter = 'all';
  let currentReviewingResId = null;
  let currentRejectingResId = null;
  let currentLightboxZoom = 1;
  let currentLightboxRotation = 0;

  const DEFAULT_RESIDENT_APPLICATIONS = [
    {
      id: 'VER-2026-001',
      fullName: 'Clarisse Anne Villanueva',
      email: 'clarisse.villanueva@gmail.com',
      mobile: '0917 554 8219',
      dob: '1995-04-18',
      age: 31,
      gender: 'Female',
      civilStatus: 'Single',
      address: '082 Sitio Ibaba Road, Barangay Pallocan West, Batangas City',
      sitio: 'Sitio Ibaba',
      registeredDate: 'Oct 16, 2026',
      status: 'Pending',
      voterStatus: 'Registered Voter (Precinct 0142B)',
      channel: 'Resident Portal Self-Registration',
      idType: 'Philippine National ID (PhilID)',
      idNumber: '4829-9182-3918-0912',
      proofType: 'PrimeWater Utility Bill',
      proofNumber: 'PW-BAT-90281-26',
      proofIssuer: 'PrimeWater Batangas City',
      rejectionReason: null,
      rejectionNotes: null,
      reviewedAt: null,
      activationToken: null
    },
    {
      id: 'VER-2026-002',
      fullName: 'Eduardo Castillo Jr.',
      email: 'eddie.castillo.ph@yahoo.com',
      mobile: '0920 891 2345',
      dob: '1988-11-04',
      age: 37,
      gender: 'Male',
      civilStatus: 'Married',
      address: 'Block 14 Lot 6, Tierra Verde, Barangay Pallocan West, Batangas City',
      sitio: 'Tierra Verde',
      registeredDate: 'Oct 15, 2026',
      status: 'Pending',
      voterStatus: 'Registered Voter (Precinct 0142A)',
      channel: 'Resident Portal Self-Registration',
      idType: "Driver's License (LTO)",
      idNumber: 'D02-18-092819',
      proofType: 'Meralco Electric Bill',
      proofNumber: 'MR-0982716291',
      proofIssuer: 'Meralco Batangas Sector',
      rejectionReason: null,
      rejectionNotes: null,
      reviewedAt: null,
      activationToken: null
    },
    {
      id: 'VER-2026-003',
      fullName: 'Rhea Santos Dimaculangan',
      email: 'rhea.dimaculangan@gmail.com',
      mobile: '0998 712 3490',
      dob: '1992-08-30',
      age: 34,
      gender: 'Female',
      civilStatus: 'Married',
      address: '019 Sitio Santolan Interior, Barangay Pallocan West, Batangas City',
      sitio: 'Sitio Santolan',
      registeredDate: 'Oct 14, 2026',
      status: 'Pending',
      voterStatus: 'Registered Voter (Precinct 0142B)',
      channel: 'Walk-in Intake Form',
      idType: 'UMID / SSS ID',
      idNumber: 'CRN-0111-8291029-4',
      proofType: 'Barangay Certification of Residence',
      proofNumber: 'BRGY-CERT-2026-140',
      proofIssuer: 'Barangay Pallocan West',
      rejectionReason: null,
      rejectionNotes: null,
      reviewedAt: null,
      activationToken: null
    },
    {
      id: 'VER-2026-004',
      fullName: 'Mark Anthony Balmes',
      email: 'mark.balmes@outlook.com',
      mobile: '0927 348 9120',
      dob: '2001-02-14',
      age: 25,
      gender: 'Male',
      civilStatus: 'Single',
      address: '105 Crossing Ilaya Road, Barangay Pallocan West, Batangas City',
      sitio: 'Sitio Ilaya',
      registeredDate: 'Oct 12, 2026',
      status: 'Pending',
      voterStatus: 'Not Registered / Transferee',
      channel: 'Resident Portal Self-Registration',
      idType: "COMELEC Voter's ID",
      idNumber: 'VIN-40281928019A',
      proofType: 'PLDT / Telecom Billing Statement',
      proofNumber: 'PLDT-98201928',
      proofIssuer: 'PLDT Home Batangas',
      rejectionReason: null,
      rejectionNotes: null,
      reviewedAt: null,
      activationToken: null
    },
    {
      id: 'VER-2026-005',
      fullName: 'Juan M. Dela Cruz',
      email: 'juan.delacruz@gmail.com',
      mobile: '0917 123 4567',
      dob: '1992-06-15',
      age: 34,
      gender: 'Male',
      civilStatus: 'Married',
      address: '042 Sitio Ibaba Main Road, Barangay Pallocan West, Batangas City',
      sitio: 'Sitio Ibaba',
      registeredDate: 'Oct 1, 2026',
      status: 'Verified',
      voterStatus: 'Registered Voter (Precinct 0142A)',
      channel: 'Resident Portal Self-Registration',
      idType: 'Philippine National ID (PhilID)',
      idNumber: '4829-1029-9182-8492',
      proofType: 'Meralco Electric Bill',
      proofNumber: 'MR-0182749102',
      proofIssuer: 'Meralco Batangas Sector',
      rejectionReason: null,
      rejectionNotes: null,
      reviewedAt: '2026-10-02T10:15:00Z',
      activationToken: 'ACT-91028'
    },
    {
      id: 'VER-2026-006',
      fullName: 'Maria Santos Alcantara',
      email: 'maria.alcantara@gmail.com',
      mobile: '0918 345 6789',
      dob: '1998-03-21',
      age: 28,
      gender: 'Female',
      civilStatus: 'Single',
      address: 'Block 3 Lot 8, Villa Celina, Barangay Pallocan West, Batangas City',
      sitio: 'Sitio Santolan',
      registeredDate: 'Oct 2, 2026',
      status: 'Verified',
      voterStatus: 'Registered Voter (Precinct 0142B)',
      channel: 'Resident Portal Self-Registration',
      idType: "COMELEC Voter's ID",
      idNumber: 'VIN-40192837482B',
      proofType: 'Lease Agreement Contract',
      proofNumber: 'LEASE-VC-2026-08',
      proofIssuer: 'Villa Celina Property Administration',
      rejectionReason: null,
      rejectionNotes: null,
      reviewedAt: '2026-10-03T14:20:00Z',
      activationToken: 'ACT-34901'
    },
    {
      id: 'VER-2026-007',
      fullName: 'Rogelio B. Mendoza',
      email: 'rogelio.mendoza@yahoo.com',
      mobile: '0922 456 7890',
      dob: '1981-12-09',
      age: 45,
      gender: 'Male',
      civilStatus: 'Married',
      address: '088 Crossing Ilaya, Barangay Pallocan West, Batangas City',
      sitio: 'Sitio Ilaya',
      registeredDate: 'Oct 3, 2026',
      status: 'Verified',
      voterStatus: 'Registered Voter (Precinct 0142A)',
      channel: 'Walk-in Intake Form',
      idType: 'Senior Citizen ID / UMID',
      idNumber: 'OSCA-BAT-90182',
      proofType: 'Barangay Certification of Residence',
      proofNumber: 'BRGY-CERT-2026-092',
      proofIssuer: 'Barangay Pallocan West',
      rejectionReason: null,
      rejectionNotes: null,
      reviewedAt: '2026-10-04T09:30:00Z',
      activationToken: 'ACT-78192'
    },
    {
      id: 'VER-2026-008',
      fullName: 'Kenneth Paul Reyes',
      email: 'kpreyes99@gmail.com',
      mobile: '0915 678 1234',
      dob: '1999-09-17',
      age: 27,
      gender: 'Male',
      civilStatus: 'Single',
      address: '24 Commercial Arcade, G.C Berberabe, Barangay Pallocan West, Batangas City',
      sitio: 'G.C Berberabe',
      registeredDate: 'Oct 8, 2026',
      status: 'Rejected',
      voterStatus: 'Not Registered / Transferee',
      channel: 'Resident Portal Self-Registration',
      idType: 'Postal ID',
      idNumber: 'PR-829102-1928',
      proofType: 'Electric Bill (Old Address)',
      proofNumber: 'MR-OLD-829102',
      proofIssuer: 'Meralco - Calicanto Branch',
      rejectionReason: 'Address Mismatch',
      rejectionNotes: 'Submitted utility bill lists an address in Barangay Calicanto, which does not match residence in Barangay Pallocan West.',
      reviewedAt: '2026-10-09T16:45:00Z',
      activationToken: null
    }
  ];

  let residentApplications = [];
  try {
    const storedRes = localStorage.getItem('brgy360_resident_applications');
    if (storedRes) {
      residentApplications = JSON.parse(storedRes);
      if (Array.isArray(residentApplications)) {
        residentApplications.forEach((app) => {
          if (!app) return;
          app.sitio = normalizeSitioName(app.sitio);
          if (typeof app.address === 'string') {
            app.address = app.address
              .replace(/Purok\s*2\s*Embankment/gi, 'Sitio Ibaba')
              .replace(/G\.C\.\s*Berberabe/gi, 'G.C Berberabe');
          }
        });
      }
    } else {
      residentApplications = [...DEFAULT_RESIDENT_APPLICATIONS];
      localStorage.setItem('brgy360_resident_applications', JSON.stringify(residentApplications));
    }
  } catch (e) {
    residentApplications = [...DEFAULT_RESIDENT_APPLICATIONS];
  }

  function saveResidentApplications() {
    try {
      localStorage.setItem('brgy360_resident_applications', JSON.stringify(residentApplications));
    } catch (e) {
      console.warn('Failed saving resident applications to localStorage', e);
    }
  }

  // ==============================================================
  // 2. LIVE CLOCK & TELEMETRY
  // ==============================================================
  function updateLiveClock() {
    const clockEl = document.getElementById('liveClockDisplay');
    if (!clockEl) return;
    const now = new Date();
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    clockEl.textContent = now.toLocaleDateString('en-US', options);
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // ==============================================================
  // 3. NAVIGATION & VIEW SWITCHING
  // ==============================================================
  const navButtons = document.querySelectorAll('.nav-link[data-view]');
  const viewPanels = document.querySelectorAll('.admin-view-panel');
  const viewHeading = document.getElementById('currentViewTitle');
  const sidebar = document.getElementById('adminSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  const viewTitles = {
    overview: 'Barangay Dashboard',
    requests: 'Service Requests Desk',
    incidents: 'Citizen Concerns Desk',
    proposals: 'Project Proposals Desk',
    projects: 'Projects Portfolio',
    announcements: 'Announcements & Advisories',
    budget: 'Budget & Fiscal Allocation',
    demographics: 'Resident Verification'
  };

  function switchView(viewId) {
    if (viewId === 'predictive' || viewId === 'officials' || viewId === 'settings') {
      switchView('overview');
      return;
    }

    if (!viewTitles[viewId]) return;

    // Update active nav links
    navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
    });

    // Update active view panel
    viewPanels.forEach(panel => {
      const panelId = panel.id.replace('view', '').toLowerCase();
      panel.classList.toggle('active', panelId === viewId);
    });

    // Update header heading
    if (viewHeading) {
      viewHeading.textContent = viewTitles[viewId];
    }

    // Call dynamic renderers when switching tabs
    if (viewId === 'overview') {
      const yr = document.getElementById('dashboardFiscalYearSelect')?.value || '2026';
      initOrUpdateReportsCharts(yr);
    }
    if (viewId === 'proposals') renderProposalsTable();
    if (viewId === 'projects') renderProjectsTable();
    if (viewId === 'announcements') renderAnnouncementsTable();
    if (viewId === 'budget') renderAdminBudgetTable();
    if (viewId === 'demographics') renderResidentVerificationTable();

    // Close mobile drawer if open
    closeMobileSidebar();

    // Trigger chart resize if charts are inside this view
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 150);

    // Update URL hash without scroll jump
    history.replaceState(null, '', '#' + viewId);
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetView = this.getAttribute('data-view');
      switchView(targetView);
    });
  });


  // Cross-view quick jump triggers
  const btnViewAllPrescriptive = document.getElementById('btnViewAllPrescriptive');
  if (btnViewAllPrescriptive) {
    btnViewAllPrescriptive.addEventListener('click', () => switchView('overview'));
  }
  const btnJumpToEngine = document.getElementById('btnJumpToEngine');
  if (btnJumpToEngine) {
    btnJumpToEngine.addEventListener('click', () => {
      closeAllPopovers();
      switchView('overview');
    });
  }
  const btnQuickForecast = document.getElementById('btnQuickForecast');
  if (btnQuickForecast) {
    btnQuickForecast.addEventListener('click', () => switchView('overview'));
  }
  const btnViewAllRequests = document.getElementById('btnViewAllRequests');
  if (btnViewAllRequests) {
    btnViewAllRequests.addEventListener('click', () => switchView('requests'));
  }

  // Mobile Sidebar Drawer
  function openMobileSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
  }

  if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', openMobileSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // ==============================================================
  // 4. TOPBAR DROPDOWNS & NOTIFICATION POPOVER
  // ==============================================================
  const btnQuickActions = document.getElementById('btnQuickActions');
  const quickActionMenu = document.getElementById('quickActionMenu');
  const btnNotifCenter = document.getElementById('btnNotifCenter');
  const notifPopover = document.getElementById('notifPopover');

  function closeAllPopovers() {
    if (quickActionMenu) quickActionMenu.classList.remove('active');
    if (notifPopover) notifPopover.classList.remove('active');
  }

  if (btnQuickActions && quickActionMenu) {
    btnQuickActions.addEventListener('click', function (e) {
      e.stopPropagation();
      const isActive = quickActionMenu.classList.contains('active');
      closeAllPopovers();
      if (!isActive) quickActionMenu.classList.add('active');
    });
  }

  if (btnNotifCenter && notifPopover) {
    btnNotifCenter.addEventListener('click', function (e) {
      e.stopPropagation();
      const isActive = notifPopover.classList.contains('active');
      closeAllPopovers();
      if (!isActive) notifPopover.classList.add('active');
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.topbar-dropdown-wrap')) {
      closeAllPopovers();
    }
  });

  const btnDismissAllAlerts = document.getElementById('btnDismissAllAlerts');
  if (btnDismissAllAlerts) {
    btnDismissAllAlerts.addEventListener('click', function () {
      const badge = document.querySelector('.icon-badge');
      if (badge) badge.style.display = 'none';
      showAdminToast('Alerts Acknowledged', 'All 3 early warning telemetry notices have been acknowledged.', 'info');
      closeAllPopovers();
    });
  }

  // Quick Action menu triggers
  const qaLogIncident = document.getElementById('qaLogIncident');
  if (qaLogIncident) {
    qaLogIncident.addEventListener('click', () => {
      closeAllPopovers();
      openNewIncidentModal();
    });
  }
  const qaDeployDesk = document.getElementById('qaDeployDesk');
  if (qaDeployDesk) {
    qaDeployDesk.addEventListener('click', () => {
      closeAllPopovers();
      switchView('overview');
      triggerPrescriptiveAction(1);
    });
  }
  const qaExportDossier = document.getElementById('qaExportDossier');
  if (qaExportDossier) {
    qaExportDossier.addEventListener('click', () => {
      closeAllPopovers();
      exportRequestsCSV();
    });
  }

  // ==============================================================
  // 5. CHART.JS VISUALIZATIONS INITIALIZATION
  // ==============================================================
  let docVolumeChart = null;
  let incidentCategoryChart = null;
  let repBudgetCatChart = null;
  let repQuarterlyChart = null;
  let repProjectStatusChart = null;
  let repRequestTypeChart = null;
  let repConcernsChart = null;
  let budgetBurnChart = null;

  // Global Chart.js typography defaults
  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif";
    Chart.defaults.color = '#64748b';
  }

  // Chart 1: Document Request Volume Bar Chart (Descriptive)
  function initDocVolumeChart() {
    const ctx = document.getElementById('docVolumeChart');
    if (!ctx || typeof Chart === 'undefined') return;

    const dataYTD = [142, 98, 115, 64, 45];
    const categories = ['Barangay Clearance', 'Cert of Residency', 'Cert of Indigency', 'Business Permit', 'Jobseeker Waiver'];

    docVolumeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Applications Processed',
          data: dataYTD,
          backgroundColor: [
            '#0d47a1',
            '#1565c0',
            '#0284c7',
            '#d97706',
            '#16a34a'
          ],
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 42
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0a2540',
            titleFont: { size: 12, weight: '700' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (context) => ` Applications: ${context.raw} records`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 10.5, weight: '600' },
              color: '#475569'
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: {
              stepSize: 30,
              font: { size: 10.5 },
              color: '#64748b'
            }
          }
        }
      }
    });

    // Segmented period buttons filter
    const filterBtns = document.querySelectorAll('#docChartFilter .seg-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const period = this.getAttribute('data-period');
        let newData = [142, 98, 115, 64, 45];
        if (period === 'q3') newData = [48, 31, 39, 18, 16];
        if (period === 'q4') newData = [24, 16, 22, 11, 8];
        docVolumeChart.data.datasets[0].data = newData;
        docVolumeChart.update();
      });
    });
  }

  // Chart 2: Citizen Incident Breakdown Doughnut Chart (Descriptive)
  function initIncidentCategoryChart() {
    const ctx = document.getElementById('incidentCategoryChart');
    if (!ctx || typeof Chart === 'undefined') return;

    incidentCategoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Infrastructure', 'Sanitation', 'Public Safety', 'Noise', 'Utilities'],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: [
            '#dc2626', // Infrastructure (35%)
            '#d97706', // Sanitation (25%)
            '#0d47a1', // Public Safety (20%)
            '#7c3aed', // Noise (12%)
            '#0284c7'  // Utilities (8%)
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '66%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0a2540',
            titleFont: { size: 12, weight: '700' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (context) => ` Proportion: ${context.raw}% (${context.label})`
            }
          }
        }
      }
    });
  }

  // ==============================================================
  // 5.B UNIFIED DASHBOARD STATS & ANALYTICS CHARTS INITIALIZATION
  // ==============================================================
  function updateDashboardStatsCards(year = '2026') {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    const setSub = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };

    if (year === '2026') {
      const totalReq = typeof serviceRequests !== 'undefined' ? serviceRequests.length : 18;
      const completedReq = typeof serviceRequests !== 'undefined'
        ? serviceRequests.filter(r => r.status === 'Ready for Pickup' || r.status === 'Completed').length
        : 6;
      const pendingReq = typeof serviceRequests !== 'undefined'
        ? serviceRequests.filter(r => r.status === 'In Review' || r.status === 'Pending').length
        : 12;

      const totalInc = typeof incidentTickets !== 'undefined' ? incidentTickets.length : 14;
      const openInc = typeof incidentTickets !== 'undefined'
        ? incidentTickets.filter(i => i.status !== 'Resolved').length
        : 5;

      const ongoingProj = typeof capitalProjects !== 'undefined'
        ? capitalProjects.filter(p => p.status === 'ongoing').length
        : 2;
      const completedProj = typeof capitalProjects !== 'undefined'
        ? capitalProjects.filter(p => p.status === 'completed').length
        : 2;

      let totalBudget = 2185000;
      let totalSpent = 1418000;
      if (adminBudgetRecords && adminBudgetRecords.length) {
        const y26 = adminBudgetRecords.filter(b => String(b.year) === '2026');
        if (y26.length) {
          totalBudget = y26.reduce((acc, b) => acc + (Number(b.budget) || 0), 0);
          totalSpent = y26.reduce((acc, b) => acc + (Number(b.actual) || 0), 0);
        }
      }
      const utilRate = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 65;

      setVal('cardValResidents', '4,892');
      setSub('cardSubResidents', '4,120 verified (84.2%)');

      setVal('cardValPendingVerif', '772');
      setSub('cardSubPendingVerif', 'Awaiting citizen validation');

      setVal('cardValTotalBudget', '₱' + totalBudget.toLocaleString());
      setSub('cardSubTotalBudget', `₱${totalSpent.toLocaleString()} spent · ${utilRate}% utilized`);

      setVal('cardValTotalRequests', totalReq.toString());
      setSub('cardSubTotalRequests', 'All document filings');

      setVal('cardValCompletedRequests', completedReq.toString());
      setSub('cardSubCompletedRequests', 'Ready for pickup / released');

      setVal('cardValPendingRequests', pendingReq.toString());
      setSub('cardSubPendingRequests', 'In review &amp; verification');

      setVal('cardValReportedConcerns', totalInc.toString());
      setSub('cardSubReportedConcerns', `<span class="brgy-open-badge"><span class="badge-dot-alert"></span> <strong>${openInc} open concern${openInc !== 1 ? 's' : ''}</strong></span>`);

      setVal('cardValOngoingProjects', ongoingProj.toString());
      setSub('cardSubOngoingProjects', 'Active civic &amp; infra works');

      setVal('cardValCompletedProjects', completedProj.toString());
      setSub('cardSubCompletedProjects', 'Delivered infrastructure');
    } else {
      // 2025 Historical Data
      setVal('cardValResidents', '4,650');
      setSub('cardSubResidents', '4,020 verified (86.4%)');

      setVal('cardValPendingVerif', '630');
      setSub('cardSubPendingVerif', 'Awaiting citizen validation');

      setVal('cardValTotalBudget', '₱1,980,000');
      setSub('cardSubTotalBudget', '₱1,950,000 spent · 98% utilized');

      setVal('cardValTotalRequests', '15');
      setSub('cardSubTotalRequests', 'All document filings');

      setVal('cardValCompletedRequests', '15');
      setSub('cardSubCompletedRequests', '100% completed');

      setVal('cardValPendingRequests', '0');
      setSub('cardSubPendingRequests', 'All processed');

      setVal('cardValReportedConcerns', '11');
      setSub('cardSubReportedConcerns', `<span class="brgy-open-badge resolved"><span class="badge-dot-alert"></span> <strong>0 open concerns</strong></span>`);

      setVal('cardValOngoingProjects', '0');
      setSub('cardSubOngoingProjects', 'All closed for FY');

      setVal('cardValCompletedProjects', '4');
      setSub('cardSubCompletedProjects', '4 projects delivered');
    }
  }

  function initOrUpdateReportsCharts(year = '2026') {
    if (typeof Chart === 'undefined') return;
    const data = REPORTS_ANALYTICS_DATA[year] || REPORTS_ANALYTICS_DATA['2026'];
    updateDashboardStatsCards(year);

    // Keep year selectors synced if both exist
    const dashSelect = document.getElementById('dashboardFiscalYearSelect');
    if (dashSelect && dashSelect.value !== year) dashSelect.value = year;
    const repSelect = document.getElementById('reportsFiscalYearSelect');
    if (repSelect && repSelect.value !== year) repSelect.value = year;

    // 1. Budget vs Actual by Category (Dual Grouped Vertical Bar Chart)
    const ctxBudgetCat = document.getElementById('repBudgetCatChart');
    if (ctxBudgetCat) {
      if (repBudgetCatChart) {
        repBudgetCatChart.data.labels = data.budgetCategory.labels;
        repBudgetCatChart.data.datasets[0].data = data.budgetCategory.budget;
        repBudgetCatChart.data.datasets[1].data = data.budgetCategory.actual;
        repBudgetCatChart.update();
      } else {
        repBudgetCatChart = new Chart(ctxBudgetCat, {
          type: 'bar',
          data: {
            labels: data.budgetCategory.labels,
            datasets: [
              {
                label: 'Budget',
                data: data.budgetCategory.budget,
                backgroundColor: '#0b1e36',
                borderRadius: 4,
                barPercentage: 0.7,
                categoryPercentage: 0.65
              },
              {
                label: 'Actual',
                data: data.budgetCategory.actual,
                backgroundColor: '#f59e0b',
                borderRadius: 4,
                barPercentage: 0.7,
                categoryPercentage: 0.65
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                  boxWidth: 12,
                  font: { size: 11, weight: '600' },
                  color: '#475569'
                }
              },
              tooltip: {
                backgroundColor: '#0a2540',
                callbacks: {
                  label: (ctx) => ` ${ctx.dataset.label}: ₱${Number(ctx.raw).toLocaleString()}`
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 11, weight: '600' }, color: '#334155' }
              },
              y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' },
                ticks: {
                  stepSize: 300000,
                  callback: (val) => (val / 1000) + 'k',
                  font: { size: 11 },
                  color: '#64748b'
                }
              }
            }
          }
        });
      }
    }

    // 2. Quarterly Budget Utilization (Multi-line / Area Chart)
    const ctxQuarterly = document.getElementById('repQuarterlyChart');
    if (ctxQuarterly) {
      if (repQuarterlyChart) {
        repQuarterlyChart.data.labels = data.quarterly.labels;
        repQuarterlyChart.data.datasets[0].data = data.quarterly.budget;
        repQuarterlyChart.data.datasets[1].data = data.quarterly.actual;
        repQuarterlyChart.update();
      } else {
        repQuarterlyChart = new Chart(ctxQuarterly, {
          type: 'line',
          data: {
            labels: data.quarterly.labels,
            datasets: [
              {
                label: 'Budget',
                data: data.quarterly.budget,
                borderColor: '#0b1e36',
                backgroundColor: 'rgba(11, 30, 54, 0.05)',
                borderWidth: 2.5,
                pointBackgroundColor: '#0b1e36',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                fill: true,
                tension: 0.3
              },
              {
                label: 'Actual',
                data: data.quarterly.actual,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                borderWidth: 2.5,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                fill: true,
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                  boxWidth: 12,
                  font: { size: 11, weight: '600' },
                  color: '#475569'
                }
              },
              tooltip: {
                backgroundColor: '#0a2540',
                callbacks: {
                  label: (ctx) => ` ${ctx.dataset.label}: ₱${Number(ctx.raw).toLocaleString()}`
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 11, weight: '600' }, color: '#334155' }
              },
              y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' },
                ticks: {
                  stepSize: 150000,
                  callback: (val) => (val / 1000) + 'k',
                  font: { size: 11 },
                  color: '#64748b'
                }
              }
            }
          }
        });
      }
    }

    // 3. Project Status Distribution (Donut Chart)
    if (year === '2026' && Array.isArray(capitalProjects)) {
      data.projectStatus.data = [
        capitalProjects.filter(p => p.status === 'ongoing').length,
        capitalProjects.filter(p => p.status === 'completed').length,
        capitalProjects.filter(p => p.status === 'delayed').length,
        capitalProjects.filter(p => p.status === 'planning').length
      ];
    }
    const repProjLegend = document.getElementById('repProjectLegend');
    if (repProjLegend && data.projectStatus) {
      const [cOngoing, cCompleted, cDelayed, cPlanning] = data.projectStatus.data;
      repProjLegend.innerHTML = `
        <span class="legend-chip"><span class="legend-dot" style="background:#2563eb;"></span> Ongoing: <strong>${cOngoing}</strong></span>
        <span class="legend-chip"><span class="legend-dot" style="background:#10b981;"></span> Completed: <strong>${cCompleted}</strong></span>
        <span class="legend-chip"><span class="legend-dot" style="background:#e11d48;"></span> Delayed: <strong>${cDelayed}</strong></span>
        <span class="legend-chip"><span class="legend-dot" style="background:#94a3b8;"></span> Planning: <strong>${cPlanning}</strong></span>
      `;
    }
    const ctxProjStatus = document.getElementById('repProjectStatusChart');
    if (ctxProjStatus) {
      if (repProjectStatusChart) {
        repProjectStatusChart.data.labels = data.projectStatus.labels;
        repProjectStatusChart.data.datasets[0].data = data.projectStatus.data;
        repProjectStatusChart.data.datasets[0].backgroundColor = data.projectStatus.colors;
        repProjectStatusChart.update();
      } else {
        repProjectStatusChart = new Chart(ctxProjStatus, {
          type: 'doughnut',
          data: {
            labels: data.projectStatus.labels,
            datasets: [
              {
                data: data.projectStatus.data,
                backgroundColor: data.projectStatus.colors,
                borderWidth: 2,
                borderColor: '#ffffff'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#0a2540',
                callbacks: {
                  label: (ctx) => ` ${ctx.label}: ${ctx.raw} project${ctx.raw !== 1 ? 's' : ''}`
                }
              }
            }
          }
        });
      }
    }

    // 4. Service Requests by Type (Donut Chart)
    const ctxReqType = document.getElementById('repRequestTypeChart');
    if (ctxReqType) {
      if (repRequestTypeChart) {
        repRequestTypeChart.data.labels = data.requestType.labels;
        repRequestTypeChart.data.datasets[0].data = data.requestType.data;
        repRequestTypeChart.data.datasets[0].backgroundColor = data.requestType.colors;
        repRequestTypeChart.update();
      } else {
        repRequestTypeChart = new Chart(ctxReqType, {
          type: 'doughnut',
          data: {
            labels: data.requestType.labels,
            datasets: [
              {
                data: data.requestType.data,
                backgroundColor: data.requestType.colors,
                borderWidth: 2,
                borderColor: '#ffffff'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#0a2540',
                callbacks: {
                  label: (ctx) => ` ${ctx.label}: ${ctx.raw} request${ctx.raw !== 1 ? 's' : ''}`
                }
              }
            }
          }
        });
      }
    }

    // 5. Concerns by Category (Horizontal Bar Chart)
    const ctxConcerns = document.getElementById('repConcernsChart');
    if (ctxConcerns) {
      if (repConcernsChart) {
        repConcernsChart.data.labels = data.concerns.labels;
        repConcernsChart.data.datasets[0].data = data.concerns.data;
        repConcernsChart.update();
      } else {
        repConcernsChart = new Chart(ctxConcerns, {
          type: 'bar',
          data: {
            labels: data.concerns.labels,
            datasets: [
              {
                label: 'Reported Concerns',
                data: data.concerns.data,
                backgroundColor: data.concerns.color,
                borderRadius: 4,
                barPercentage: 0.65
              }
            ]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#0a2540',
                callbacks: {
                  label: (ctx) => ` ${ctx.raw} recorded incident${ctx.raw !== 1 ? 's' : ''}`
                }
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' },
                ticks: {
                  stepSize: 1,
                  precision: 0,
                  font: { size: 11 },
                  color: '#64748b'
                }
              },
              y: {
                grid: { display: false },
                ticks: { font: { size: 11.5, weight: '600' }, color: '#334155' }
              }
            }
          }
        });
      }
    }
  }

  function initReportsFiscalYearListener() {
    const dashYearSelect = document.getElementById('dashboardFiscalYearSelect');
    if (dashYearSelect) {
      dashYearSelect.addEventListener('change', function () {
        const yr = this.value;
        initOrUpdateReportsCharts(yr);
        showAdminToast('Dashboard Updated', `Displaying consolidated analytics for FY ${yr}.`, 'info');
      });
    }

    const yearSelect = document.getElementById('reportsFiscalYearSelect');
    if (yearSelect) {
      yearSelect.addEventListener('change', function () {
        const yr = this.value;
        initOrUpdateReportsCharts(yr);
        showAdminToast('Reports Updated', `Displaying consolidated analytics for FY ${yr}.`, 'info');
      });
    }

    const btnGoToDashboard = document.getElementById('btnGoToDashboard');
    if (btnGoToDashboard) {
      btnGoToDashboard.addEventListener('click', () => {
        switchView('overview');
        setTimeout(() => {
          const el = document.getElementById('dashboardAnalyticsSection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
    }
  }

  // Chart 4: Budget Disbursement Burn Rate Chart (Fiscal)
  function initBudgetBurnChart() {
    const ctx = document.getElementById('budgetBurnChart');
    if (!ctx || typeof Chart === 'undefined') return;

    budgetBurnChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (YTD)'],
        datasets: [
          {
            label: 'Monthly Actual Disbursement (₱)',
            data: [120000, 135000, 142000, 150000, 138000, 145000, 158000, 148000, 142000, 140000],
            borderColor: '#0d47a1',
            backgroundColor: 'rgba(13, 71, 161, 0.08)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.3,
            pointRadius: 3
          },
          {
            label: 'Sustainable Monthly Benchmark (₱182k)',
            data: [182000, 182000, 182000, 182000, 182000, 182000, 182000, 182000, 182000, 182000],
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { font: { size: 10.5 }, boxWidth: 12 }
          },
          tooltip: {
            backgroundColor: '#0a2540',
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ₱${Number(context.raw).toLocaleString()}`
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: false,
            min: 80000,
            ticks: {
              callback: (val) => '₱' + (val / 1000) + 'k'
            }
          }
        }
      }
    });
  }

  // Initialize all charts
  initDocVolumeChart();
  initIncidentCategoryChart();
  initBudgetBurnChart();
  initOrUpdateReportsCharts('2026');
  initReportsFiscalYearListener();

  // ==============================================================
  // 6. OVERVIEW ACTIVE OPERATIONAL QUEUE PREVIEW
  // ==============================================================
  function renderOverviewQueue() {
    const listEl = document.getElementById('overviewQueueList');
    if (!listEl) return;

    // Show top 5 urgent / review items
    const pendingItems = serviceRequests
      .filter(r => r.status === 'In Review' || r.status === 'Ready for Pickup')
      .slice(0, 5);

    listEl.innerHTML = '';
    pendingItems.forEach(item => {
      const isReady = item.status === 'Ready for Pickup';
      const statusBadge = isReady
        ? '<span class="badge-status green">Ready for Pickup</span>'
        : '<span class="badge-status yellow">In Review</span>';

      const row = document.createElement('div');
      row.className = 'queue-row-item';
      row.innerHTML = `
        <div class="queue-item-left">
          <span class="queue-doc-name">${escapeHtml(item.docType)}</span>
          <span class="queue-applicant">${escapeHtml(item.resident)} · ${escapeHtml(item.sitio)} (${escapeHtml(item.id)})</span>
        </div>
        <div class="queue-item-right">
          ${statusBadge}
          <button type="button" class="btn-table-action primary btn-quick-inspect" data-id="${item.id}">Inspect</button>
        </div>
      `;
      listEl.appendChild(row);
    });

    // Bind inspect button in overview
    listEl.querySelectorAll('.btn-quick-inspect').forEach(btn => {
      btn.addEventListener('click', function () {
        const reqId = this.getAttribute('data-id');
        openRequestDetailModal(reqId);
      });
    });
  }
  renderOverviewQueue();

  // ==============================================================
  // 7. SERVICE REQUESTS DESK TABLE & MANAGEMENT
  function renderRequestsTable() {
    const tbody = document.getElementById('requestsTableBody');
    if (!tbody) return;

    const filtered = serviceRequests.filter(req => {
      const matchesStatus = currentReqStatusFilter === 'all' || req.status === currentReqStatusFilter;
      const matchesCat = currentReqCategoryFilter === 'all' || req.docType === currentReqCategoryFilter || req.documentType === currentReqCategoryFilter;
      const searchLower = currentReqSearch.toLowerCase();
      const matchesSearch = !currentReqSearch ||
        req.id.toLowerCase().includes(searchLower) ||
        (req.fullName && req.fullName.toLowerCase().includes(searchLower)) ||
        (req.resident && req.resident.toLowerCase().includes(searchLower)) ||
        (req.sitio && req.sitio.toLowerCase().includes(searchLower)) ||
        (req.docType && req.docType.toLowerCase().includes(searchLower)) ||
        (req.documentType && req.documentType.toLowerCase().includes(searchLower)) ||
        (req.purpose && req.purpose.toLowerCase().includes(searchLower));

      return matchesStatus && matchesCat && matchesSearch;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 36px 20px; color: #64748b;">
            <div style="font-size: 15px; font-weight: 600; color: #1e293b; margin-bottom: 4px;">No service requests found</div>
            <div style="font-size: 12px; color: #94a3b8;">Try adjusting your status filter or search keywords.</div>
          </td>
        </tr>
      `;
      updateRequestsCounter(0);
      return;
    }

    filtered.forEach(item => {
      const tr = document.createElement('tr');

      let statusBadge = '';
      if (item.status === 'Ready for Pickup') {
        statusBadge = '<span class="badge-status green">Ready for Pickup</span>';
      } else if (item.status === 'In Review' || item.status === 'Pending') {
        statusBadge = '<span class="badge-status yellow">In Review</span>';
      } else if (item.status === 'Completed' || item.status === 'Approved') {
        statusBadge = '<span class="badge-status blue">Completed</span>';
      } else if (item.status === 'Rejected') {
        statusBadge = '<span class="badge-status red">Rejected</span>';
      } else {
        statusBadge = `<span class="badge-status gray">${escapeHtml(item.status)}</span>`;
      }

      // Action buttons: Icon-only Print Certificate button and Inspect
      let actionButtons = `
        <div class="table-actions">
          <button type="button" class="btn-table-action btn-print-cert icon-only" data-id="${item.id}" title="Print Certificate (Ctrl+P)" aria-label="Print Certificate">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
          </button>
          <button type="button" class="btn-table-action btn-inspect-req" data-id="${item.id}" title="Inspect full application">Inspect</button>
      `;

      if (item.status === 'In Review') {
        actionButtons += `
          <button type="button" class="btn-table-action success-fill btn-approve-req" data-id="${item.id}" title="Approve & Set Ready">Ready &rarr;</button>
          <button type="button" class="btn-table-action danger-text btn-reject-req" data-id="${item.id}" title="Reject application">Reject</button>
        `;
      } else if (item.status === 'Ready for Pickup') {
        actionButtons += `
          <button type="button" class="btn-table-action primary btn-claim-req" data-id="${item.id}" title="Mark as Claimed / Completed">Claimed</button>
        `;
      }

      actionButtons += `</div>`;

      // 6 Strict Columns: Request ID, Resident Name, Certificate Type, Status, Date Requested, Actions
      tr.innerHTML = `
        <td><strong><code>${escapeHtml(item.id)}</code></strong></td>
        <td>
          <div style="font-weight: 600; color: #0f172a;">${escapeHtml(item.fullName || item.resident)}</div>
          <div style="font-size: 11px; color: #64748b;">${escapeHtml(item.purokSitio || item.sitio)} &bull; ${escapeHtml(item.contact || '')}</div>
        </td>
        <td>
          <strong style="color: #0f172a;">${escapeHtml(item.documentType || item.docType)}</strong>
          <div style="font-size: 11px; color: #64748b;" title="${escapeHtml(item.purpose)}">${truncate(item.purpose, 36)}</div>
        </td>
        <td>${statusBadge}</td>
        <td><span style="font-size: 11.5px; color: #334155; font-weight: 500;">${escapeHtml(item.dateFiled || item.date)}</span></td>
        <td class="text-right">${actionButtons}</td>
      `;

      tbody.appendChild(tr);
    });

    updateRequestsCounter(filtered.length);
    bindRequestRowEvents();
  }

  function updateRequestsCounter(count) {
    const info = document.getElementById('requestsPaginationInfo');
    if (info) info.textContent = `Showing ${count} application records`;

    // Update KPI and filter pills
    const allCount = serviceRequests.length;
    const reviewCount = serviceRequests.filter(r => r.status === 'In Review').length;
    const readyCount = serviceRequests.filter(r => r.status === 'Ready for Pickup').length;
    const doneCount = serviceRequests.filter(r => r.status === 'Completed').length;
    const rejectCount = serviceRequests.filter(r => r.status === 'Rejected').length;

    const cntAll = document.getElementById('cntReqAll');
    const cntReview = document.getElementById('cntReqReview');
    const cntReady = document.getElementById('cntReqReady');
    const cntDone = document.getElementById('cntReqDone');
    const cntReject = document.getElementById('cntReqRejected');
    const navCounter = document.getElementById('navCounterRequests');

    if (cntAll) cntAll.textContent = allCount;
    if (cntReview) cntReview.textContent = reviewCount;
    if (cntReady) cntReady.textContent = readyCount;
    if (cntDone) cntDone.textContent = doneCount;
    if (cntReject) cntReject.textContent = rejectCount;
    if (navCounter) navCounter.textContent = reviewCount + readyCount;

    if (typeof updateDashboardStatsCards === 'function') {
      updateDashboardStatsCards(document.getElementById('dashboardFiscalYearSelect')?.value || '2026');
    }
  }

  function bindRequestRowEvents() {
    // Print Certificate button (Icon-only, opens print dialog directly like Ctrl+P)
    document.querySelectorAll('.btn-print-cert').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const id = this.getAttribute('data-id');
        const item = serviceRequests.find(r => r.id === id);
        if (item) {
          openPrintModal(item, true); // Triggers print dialog like Ctrl+P!
        }
      });
    });

    // Inspect button
    document.querySelectorAll('.btn-inspect-req').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        openRequestDetailModal(id);
      });
    });

    // Direct approve / Ready for Pickup button
    document.querySelectorAll('.btn-approve-req').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        setRequestStatus(id, 'Ready for Pickup');
      });
    });

    // Reject button
    document.querySelectorAll('.btn-reject-req').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        setRequestStatus(id, 'Rejected');
      });
    });

    // Claimed / Completed button
    document.querySelectorAll('.btn-claim-req').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        setRequestStatus(id, 'Completed');
      });
    });
  }

  // ==============================================================
  // OFFICIAL DOCUMENT CERTIFICATION TEMPLATES & DYNAMIC PRINT ENGINE
  // Barangay Pallocan Kanluran, Batangas City
  // ==============================================================
  const CERTIFICATE_TEMPLATES = {
    CLEARANCE: {
      title: 'BARANGAY CLEARANCE',
      render: (d) => `
        <div class="salutation-block">TO WHOM IT MAY CONCERN:</div>
        <p class="cert-paragraph">
          This is to certify that <strong class="doc-field-text font-bold" data-field="fullName">${escapeHtml(d.fullName)}</strong>, <span class="doc-field-text" data-field="age">${escapeHtml(d.age)}</span> years old, and a bona fide resident of <span class="doc-field-text" data-field="address">${escapeHtml(d.address)}</span>, Purok/Sitio <strong class="doc-field-text font-bold" data-field="purokSitio">${escapeHtml(d.purokSitio)}</strong>, Barangay Pallocan Kanluran, Batangas City, Batangas Province, is known to this office as a resident of this barangay.
        </p>
        <p class="cert-paragraph">
          This certification is issued upon the request of the above-named person for <strong class="doc-field-text font-bold" data-field="purpose">${escapeHtml(d.purpose)}</strong>.
        </p>
        <p class="cert-paragraph">
          Issued this <strong class="doc-field-text font-bold" data-field="date">${escapeHtml(d.date)}</strong> at Barangay Pallocan Kanluran, Batangas City, Batangas Province.
        </p>
      `
    },
    RESIDENCY: {
      title: 'CERTIFICATE OF RESIDENCY',
      render: (d) => `
        <div class="salutation-block">TO WHOM IT MAY CONCERN:</div>
        <p class="cert-paragraph">
          This is to certify that <strong class="doc-field-text font-bold" data-field="fullName">${escapeHtml(d.fullName)}</strong>, <span class="doc-field-text" data-field="age">${escapeHtml(d.age)}</span> years old, is a resident of <span class="doc-field-text" data-field="address">${escapeHtml(d.address)}</span>, Purok/Sitio <strong class="doc-field-text font-bold" data-field="purokSitio">${escapeHtml(d.purokSitio)}</strong>, Barangay Pallocan Kanluran, Batangas City, Batangas Province.
        </p>
        <p class="cert-paragraph">
          According to the records available to this office, the above-named person has been residing in this barangay since <strong class="doc-field-text font-bold" data-field="residencySince">${escapeHtml(d.residencySince)}</strong>.
        </p>
        <p class="cert-paragraph">
          This certification is issued upon request for <strong class="doc-field-text font-bold" data-field="purpose">${escapeHtml(d.purpose)}</strong>.
        </p>
        <p class="cert-paragraph">
          Issued this <strong class="doc-field-text font-bold" data-field="date">${escapeHtml(d.date)}</strong> at Barangay Pallocan Kanluran, Batangas City, Batangas Province.
        </p>
      `
    },
    INDIGENCY: {
      title: 'CERTIFICATE OF INDIGENCY',
      render: (d) => `
        <div class="salutation-block">TO WHOM IT MAY CONCERN:</div>
        <p class="cert-paragraph">
          This is to certify that <strong class="doc-field-text font-bold" data-field="fullName">${escapeHtml(d.fullName)}</strong>, <span class="doc-field-text" data-field="age">${escapeHtml(d.age)}</span> years old, is a resident of <span class="doc-field-text" data-field="address">${escapeHtml(d.address)}</span>, Purok/Sitio <strong class="doc-field-text font-bold" data-field="purokSitio">${escapeHtml(d.purokSitio)}</strong>, Barangay Pallocan Kanluran, Batangas City, Batangas Province.
        </p>
        <p class="cert-paragraph">
          This certification is issued upon the request of the above-named person for <strong class="doc-field-text font-bold" data-field="purpose">${escapeHtml(d.purpose)}</strong>.
        </p>
        <p class="cert-paragraph">
          Issued this <strong class="doc-field-text font-bold" data-field="date">${escapeHtml(d.date)}</strong> at Barangay Pallocan Kanluran, Batangas City, Batangas Province.
        </p>
      `
    },
    JOBSEEKER: {
      title: 'CERTIFICATION FOR FIRST-TIME JOB SEEKER',
      render: (d) => `
        <div class="salutation-block">TO WHOM IT MAY CONCERN:</div>
        <p class="cert-paragraph">
          This is to certify that <strong class="doc-field-text font-bold" data-field="fullName">${escapeHtml(d.fullName)}</strong>, <span class="doc-field-text" data-field="age">${escapeHtml(d.age)}</span> years old, a resident of <span class="doc-field-text" data-field="address">${escapeHtml(d.address)}</span>, Purok/Sitio <strong class="doc-field-text font-bold" data-field="purokSitio">${escapeHtml(d.purokSitio)}</strong>, Barangay Pallocan Kanluran, Batangas City, Batangas Province, has requested this certification in connection with their application for employment.
        </p>
        <p class="cert-paragraph">
          The certification is issued for the purpose of <strong class="doc-field-text font-bold" data-field="purpose">${escapeHtml(d.purpose)}</strong>.
        </p>
        <p class="cert-paragraph">
          Issued this <strong class="doc-field-text font-bold" data-field="date">${escapeHtml(d.date)}</strong> at Barangay Pallocan Kanluran, Batangas City, Batangas Province.
        </p>
      `
    },
    BUSINESS: {
      title: 'BARANGAY BUSINESS CLEARANCE',
      render: (d) => `
        <div class="salutation-block">TO WHOM IT MAY CONCERN:</div>
        <p class="cert-paragraph">
          This is to certify that <strong class="doc-field-text font-bold" data-field="businessName">${escapeHtml(d.businessName)}</strong>, owned/operated by <strong class="doc-field-text font-bold" data-field="fullName">${escapeHtml(d.fullName)}</strong>, <span class="doc-field-text" data-field="age">${escapeHtml(d.age)}</span> years old, with business address at <span class="doc-field-text" data-field="businessAddress">${escapeHtml(d.businessAddress)}</span>, Barangay Pallocan Kanluran, Batangas City, Batangas Province, has applied for a Barangay Business Clearance.
        </p>
        <div class="cert-business-specs">
          <div class="business-spec-line">
            <span class="spec-label">Nature of Business:</span>
            <span class="doc-field-text font-bold" data-field="natureOfBusiness">${escapeHtml(d.natureOfBusiness)}</span>
          </div>
          <div class="business-spec-line">
            <span class="spec-label">Business Type:</span>
            <span class="doc-field-text font-bold" data-field="businessType">${escapeHtml(d.businessType)}</span>
          </div>
          <div class="business-spec-line">
            <span class="spec-label">Number of Employees:</span>
            <span class="doc-field-text font-bold" data-field="numberOfEmployees">${escapeHtml(d.numberOfEmployees)}</span>
          </div>
        </div>
        <p class="cert-paragraph" style="margin-top: 18px;">
          This clearance is issued subject to applicable barangay requirements and regulations.
        </p>
        <p class="cert-paragraph">
          Issued this <strong class="doc-field-text font-bold" data-field="date">${escapeHtml(d.date)}</strong> at Barangay Pallocan Kanluran, Batangas City, Batangas Province.
        </p>
      `
    }
  };

  function formatDateForCert(dateStr) {
    if (!dateStr) return 'October 11, 2026';
    const clean = String(dateStr).trim();
    if (/^[A-Za-z]+\s+\d{1,2},\s+\d{4}$/.test(clean)) {
      return clean;
    }
    try {
      const d = new Date(clean);
      if (isNaN(d.getTime())) return clean;
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    } catch {
      return clean;
    }
  }

  function openPrintModal(data, triggerPrint = false) {
    if (!data) return;
    const modal = document.getElementById('printModal');
    if (!modal) return;

    // Match data.documentType to select the right template block
    const docTypeStr = (data.documentType || data.docType || '').toLowerCase();
    let templateKey = 'CLEARANCE';

    if (docTypeStr.includes('business') || docTypeStr.includes('permit')) {
      templateKey = 'BUSINESS';
    } else if (docTypeStr.includes('job') || docTypeStr.includes('seeker') || docTypeStr.includes('first-time')) {
      templateKey = 'JOBSEEKER';
    } else if (docTypeStr.includes('indigency')) {
      templateKey = 'INDIGENCY';
    } else if (docTypeStr.includes('residency')) {
      templateKey = 'RESIDENCY';
    } else {
      templateKey = 'CLEARANCE';
    }

    const tpl = CERTIFICATE_TEMPLATES[templateKey];

    // Automatically populate all specific fields
    const fullName = data.fullName || data.resident || 'Juan M. Dela Cruz';
    const age = data.age || '32';
    const purokSitio = data.purokSitio || data.sitio || 'Sitio Ibaba';
    const address = data.address || (data.sitio ? `${data.sitio}` : '042 Main Street');
    const purpose = data.purpose || 'Official employment application and clearance';
    const rawDate = data.date || data.dateFiled || 'October 14, 2026';
    const date = formatDateForCert(rawDate);
    const residencySince = data.residencySince || 'January 2018';
    const businessName = data.businessName || `${fullName.split(' ')[0]}'s Commercial Enterprise`;
    const businessAddress = data.businessAddress || `${address}, Barangay Pallocan Kanluran`;
    const natureOfBusiness = data.natureOfBusiness || 'Retail of Consumer Goods & Groceries';
    const businessType = data.businessType || 'Sole Proprietorship';
    const numberOfEmployees = data.numberOfEmployees || '4';

    const viewModel = {
      fullName,
      age,
      address,
      purokSitio,
      purpose,
      date,
      residencySince,
      businessName,
      businessAddress,
      natureOfBusiness,
      businessType,
      numberOfEmployees,
      id: data.id || 'REQ-2026-08492'
    };

    // Update document titles and control metadata
    const certDocTitle = document.getElementById('certDocumentTitle');
    if (certDocTitle) certDocTitle.textContent = tpl.title;

    const printModalTitle = document.getElementById('printModalTitle');
    if (printModalTitle) printModalTitle.textContent = `${tpl.title} · ${fullName}`;

    const certControlNo = document.getElementById('certControlNo');
    if (certControlNo) certControlNo.textContent = (data.id || 'REQ-000').replace('REQ-', 'PK-CERT-');

    const certDateFiled = document.getElementById('certDateFiled');
    if (certDateFiled) certDateFiled.textContent = rawDate;

    const certIssuedDate = document.getElementById('certIssuedDate');
    if (certIssuedDate) certIssuedDate.textContent = date;

    // Dynamically render body
    const bodyContainer = document.getElementById('certBodyContainer');
    if (bodyContainer) {
      bodyContainer.innerHTML = tpl.render(viewModel);
    }

    // Show modal overlay
    modal.removeAttribute('hidden');
    modal.classList.add('active');
    document.body.classList.add('print-modal-open');

    // Accessibility focus on print button
    const btnPrint = document.getElementById('btnPrintDocument');
    if (btnPrint) btnPrint.focus();

    // Trigger browser print dialog directly like Ctrl+P
    if (triggerPrint) {
      setTimeout(() => {
        window.print();
      }, 100);
    }
  }

  function closePrintModal() {
    const modal = document.getElementById('printModal');
    if (!modal) return;
    modal.setAttribute('hidden', '');
    modal.classList.remove('active');
    document.body.classList.remove('print-modal-open');
  }

  // Bind close buttons and escape key
  const btnClosePrintModal = document.getElementById('btnClosePrintModal');
  if (btnClosePrintModal) {
    btnClosePrintModal.addEventListener('click', closePrintModal);
  }

  const printModalOverlay = document.getElementById('printModal');
  if (printModalOverlay) {
    printModalOverlay.addEventListener('click', function (e) {
      if (e.target === printModalOverlay) {
        closePrintModal();
      }
    });
  }

  const btnPrintDocument = document.getElementById('btnPrintDocument');
  if (btnPrintDocument) {
    btnPrintDocument.addEventListener('click', function () {
      window.print();
    });
  }

  // Global Escape & Ctrl+P Key Listener for Modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      const pModal = document.getElementById('printModal');
      if (pModal && (!pModal.hasAttribute('hidden') || pModal.classList.contains('active'))) {
        closePrintModal();
      }
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
      const pModal = document.getElementById('printModal');
      if (pModal && (!pModal.hasAttribute('hidden') || pModal.classList.contains('active'))) {
        e.preventDefault();
        window.print();
      }
    }
  });

  // Expose globally for testing & external module triggers
  window.openPrintModal = openPrintModal;
  window.closePrintModal = closePrintModal;

  function setRequestStatus(id, newStatus) {
    const req = serviceRequests.find(r => r.id === id || r.ref === id);
    if (!req) return;

    req.status = newStatus;
    if (newStatus === 'Ready for Pickup') {
      req.notes = 'Document prepared and sealed. Ready for physical collection at Barangay Hall Window 2.';
      req.claimTarget = 'Available for pickup today';
    } else if (newStatus === 'Completed') {
      req.notes = 'Document officially issued and claimed by resident.';
      req.claimTarget = 'Claimed';
    } else if (newStatus === 'Rejected') {
      req.notes = 'Application rejected by Barangay Secretary. Please contact the barangay hall for details.';
    }

    persistServiceRequests();
    renderRequestsTable();
    renderOverviewQueue();
    updateRequestsCounter(serviceRequests.length);

    if (newStatus === 'Ready for Pickup') {
      showAdminToast('Request Ready for Claim', `${req.docType || req.documentType} for ${req.resident || req.fullName} marked ready. Status updated on resident portal.`, 'success');
    } else if (newStatus === 'Rejected') {
      showAdminToast('Application Rejected', `Notice of rejection logged for ${req.resident || req.fullName} (${req.id || req.ref}). Status updated on resident portal.`, 'danger');
    } else if (newStatus === 'Completed') {
      showAdminToast('Document Claimed', `${req.docType || req.documentType} officially issued and marked completed.`, 'success');
    }
  }

  // Request Search and Filter bindings
  const requestsSearchInput = document.getElementById('requestsSearchInput');
  if (requestsSearchInput) {
    requestsSearchInput.addEventListener('input', function () {
      currentReqSearch = this.value.trim();
      renderRequestsTable();
    });
  }

  const reqStatusPills = document.querySelectorAll('#requestsStatusFilterGroup .filter-pill');
  reqStatusPills.forEach(pill => {
    pill.addEventListener('click', function () {
      reqStatusPills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      currentReqStatusFilter = this.getAttribute('data-status');
      renderRequestsTable();
    });
  });

  const reqDocTypeSelect = document.getElementById('reqDocTypeSelect');
  if (reqDocTypeSelect) {
    reqDocTypeSelect.addEventListener('change', function () {
      currentReqCategoryFilter = this.value;
      renderRequestsTable();
    });
  }

  // Initial table render
  renderRequestsTable();

  // Export CSV
  const btnExportRequests = document.getElementById('btnExportRequests');
  if (btnExportRequests) {
    btnExportRequests.addEventListener('click', exportRequestsCSV);
  }

  function exportRequestsCSV() {
    const headers = ['Reference ID', 'Resident Applicant', 'Sitio/Purok', 'Document Type', 'Purpose', 'Date Filed', 'Status', 'Contact Number'];
    const rows = serviceRequests.map(r => [
      r.id,
      `"${r.resident}"`,
      `"${r.sitio}"`,
      `"${r.docType}"`,
      `"${r.purpose}"`,
      r.dateFiled,
      r.status,
      r.contact
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Brgy360_Document_Requests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAdminToast('CSV Export Generated', 'Official Document Processing log has been downloaded.', 'info');
  }

  // ==============================================================
  // 8. RESIDENT CONCERNS DESK MANAGEMENT
  // ==============================================================
  function pushResidentStatusNotification(ticket, newStatus, adminNote) {
    try {
      const rawNotifs = localStorage.getItem('brgy360_notifs');
      const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
      if (!Array.isArray(notifs)) return;

      const noteSnippet = adminNote ? ` Note: ${adminNote}` : '';
      notifs.unshift({
        id: Date.now(),
        title: `Concern Status Updated: ${newStatus}`,
        desc: `Ticket ${ticket.id} ("${ticket.title}") was updated to ${newStatus} by Barangay Admin.${noteSnippet}`,
        time: 'Just now',
        unread: true,
        type: newStatus === 'Resolved' ? 'green' : (newStatus === 'In Progress' ? 'blue' : 'amber')
      });
      localStorage.setItem('brgy360_notifs', JSON.stringify(notifs));
    } catch (err) {
      console.warn('Notification sync warning:', err);
    }
  }

  function getConcernUrgencyBadgeHtml(rawUrgency) {
    const urgencyNorm = normalizeConcernUrgency(rawUrgency);
    if (urgencyNorm === 'Urgent') {
      return '<span class="badge-status badge-urgent-pill"><span class="status-dot dot-red"></span>Urgent</span>';
    }
    return '<span class="badge-status badge-standard-pill"><span class="dot-gray"></span>Standard</span>';
  }

  function updateConcernStatus(id, rawStatus, customNote) {
    const ticket = incidentTickets.find(t => t.id === id || t.ref === id);
    if (!ticket) return;

    const newStatus = normalizeConcernStatus(rawStatus);
    ticket.status = newStatus;
    ticket.currentStage = newStatus === 'Resolved' ? 3 : (newStatus === 'In Progress' ? 2 : 1);
    ticket.updatedAt = new Date().toISOString().slice(0, 10);

    if (typeof customNote === 'string') {
      const trimmed = customNote.trim();
      ticket.resolutionNote = trimmed;
      ticket.actionTaken = trimmed;
      ticket.notes = trimmed || ticket.desc;
    } else if (!ticket.resolutionNote) {
      if (newStatus === 'In Progress') {
        ticket.resolutionNote = 'Concern reviewed by Barangay Admin. Inspection and field action currently in progress.';
        ticket.actionTaken = ticket.resolutionNote;
      } else if (newStatus === 'Resolved') {
        ticket.resolutionNote = 'Concern addressed and marked Resolved by Barangay Admin.';
        ticket.actionTaken = ticket.resolutionNote;
      }
    }

    persistConcernsToStorage();
    pushResidentStatusNotification(ticket, newStatus, ticket.resolutionNote);
    renderIncidentsTable();

    const toastTone = newStatus === 'Resolved' ? 'success' : (newStatus === 'In Progress' ? 'info' : 'warning');
    showAdminToast(
      `Status Updated: ${newStatus}`,
      `Ticket ${ticket.id} ("${ticket.title}") is now ${newStatus} (${ticket.urgency}).`,
      toastTone
    );
  }

  function renderIncidentsTable() {
    const tbody = document.getElementById('incidentsTableBody');
    if (!tbody) return;

    const filtered = incidentTickets.filter(item => {
      const statusNorm = normalizeConcernStatus(item.status);
      const urgencyNorm = normalizeConcernUrgency(item.urgency);
      const matchesStatus = currentIncStatusFilter === 'all' || statusNorm === currentIncStatusFilter;
      const matchesCat = currentIncCategoryFilter === 'all' || item.category === currentIncCategoryFilter;
      const matchesUrgency = currentIncUrgencyFilter === 'all' || urgencyNorm === currentIncUrgencyFilter;
      const searchLower = currentIncSearch.toLowerCase();
      const matchesSearch = !currentIncSearch ||
        item.id.toLowerCase().includes(searchLower) ||
        (item.title || '').toLowerCase().includes(searchLower) ||
        (item.desc || '').toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower) ||
        item.reporter.toLowerCase().includes(searchLower) ||
        (item.userEmail || '').toLowerCase().includes(searchLower) ||
        (item.userMobile || '').toLowerCase().includes(searchLower) ||
        (item.residentId || '').toLowerCase().includes(searchLower);

      return matchesStatus && matchesCat && matchesUrgency && matchesSearch;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding: 28px; color: #94a3b8;">
            No submitted concerns match the selected filters.
          </td>
        </tr>
      `;
      updateIncidentsCounter(0);
      return;
    }

    filtered.forEach(item => {
      const tr = document.createElement('tr');
      const statusNorm = normalizeConcernStatus(item.status);
      const urgencyNorm = normalizeConcernUrgency(item.urgency);

      let statusBadge = '<span class="badge-status yellow">Pending</span>';
      if (statusNorm === 'In Progress') {
        statusBadge = '<span class="badge-status blue">In Progress</span>';
      } else if (statusNorm === 'Resolved') {
        statusBadge = '<span class="badge-status green">Resolved</span>';
      }

      const urgencyBadge = getConcernUrgencyBadgeHtml(urgencyNorm);

      const contactParts = [];
      if (item.userMobile) contactParts.push(escapeHtml(item.userMobile));
      else if (item.userEmail) contactParts.push(escapeHtml(item.userEmail));
      if (item.sitio) contactParts.push(escapeHtml(item.sitio));
      const residentSubHtml = contactParts.length > 0
        ? `<div class="resident-meta-sub">${contactParts.join(' &bull; ')}</div>`
        : '';

      const descPreview = truncate(item.desc || '', 72);

      const actions = `
        <div class="table-actions">
          <select class="concern-status-select" data-id="${escapeHtml(item.id)}" aria-label="Update status for ${escapeHtml(item.id)}" title="Update concern status">
            <option value="Pending" ${statusNorm === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="In Progress" ${statusNorm === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${statusNorm === 'Resolved' ? 'selected' : ''}>Resolved</option>
          </select>
          <button type="button" class="btn-table-action primary btn-view-inc" data-id="${escapeHtml(item.id)}" title="View full details and update concern">View Details</button>
        </div>
      `;

      tr.innerHTML = `
        <td><strong><code>${escapeHtml(item.id)}</code></strong></td>
        <td>
          <div style="font-weight: 600; color: #0f172a;">${escapeHtml(item.reporter)}</div>
          ${residentSubHtml}
        </td>
        <td style="max-width: 290px;">
          <div style="font-weight: 600; color: #0f172a; margin-bottom: 2px;">${escapeHtml(item.title)}</div>
          <div style="font-size: 11.5px; color: #475569; line-height: 1.4;">${escapeHtml(descPreview)}</div>
          <div style="font-size: 10.5px; color: #64748b; margin-top: 2px;">📍 ${escapeHtml(item.location)}</div>
        </td>
        <td><span class="badge-neutral">${escapeHtml(item.category)}</span></td>
        <td>${urgencyBadge}</td>
        <td><span style="font-size: 11.5px; color: #334155; font-weight: 500; white-space: nowrap;">${escapeHtml(item.dateFiled)}</span></td>
        <td>${statusBadge}</td>
        <td class="text-right">${actions}</td>
      `;

      tbody.appendChild(tr);
    });

    updateIncidentsCounter(filtered.length);
    bindIncidentRowEvents();
  }

  function updateIncidentsCounter(count) {
    const total = incidentTickets.length;
    const pendingCount = incidentTickets.filter(i => normalizeConcernStatus(i.status) === 'Pending').length;
    const progressCount = incidentTickets.filter(i => normalizeConcernStatus(i.status) === 'In Progress').length;
    const resolvedCount = incidentTickets.filter(i => normalizeConcernStatus(i.status) === 'Resolved').length;

    const info = document.getElementById('incidentsPaginationInfo');
    if (info) info.textContent = `Showing ${count} of ${total} submitted concern records`;

    const elTotal = document.getElementById('incTotalCount');
    const elActive = document.getElementById('incActiveCount');
    const elInspect = document.getElementById('incInspectCount');
    const elResolved = document.getElementById('incResolvedCount');
    const navIncCount = document.getElementById('navCounterIncidents');

    if (elTotal) elTotal.textContent = `${total} Submitted`;
    if (elActive) elActive.textContent = `${pendingCount} Pending`;
    if (elInspect) elInspect.textContent = `${progressCount} In Progress`;
    const pct = total > 0 ? ((resolvedCount / total) * 100).toFixed(0) : 0;
    if (elResolved) elResolved.textContent = `${resolvedCount} Resolved (${pct}%)`;
    if (navIncCount) navIncCount.textContent = pendingCount + progressCount;

    const pAll = document.getElementById('pillCountIncAll');
    const pPending = document.getElementById('pillCountIncPending');
    const pProgress = document.getElementById('pillCountIncProgress');
    const pResolved = document.getElementById('pillCountIncResolved');
    if (pAll) pAll.textContent = total;
    if (pPending) pPending.textContent = pendingCount;
    if (pProgress) pProgress.textContent = progressCount;
    if (pResolved) pResolved.textContent = resolvedCount;

    if (typeof updateDashboardStatsCards === 'function') {
      updateDashboardStatsCards(document.getElementById('dashboardFiscalYearSelect')?.value || '2026');
    }
  }

  function bindIncidentRowEvents() {
    document.querySelectorAll('.btn-view-inc').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        openConcernViewModal(id);
      });
    });

    document.querySelectorAll('.concern-status-select').forEach(sel => {
      sel.addEventListener('change', function () {
        const id = this.getAttribute('data-id');
        const newStatus = this.value;
        updateConcernStatus(id, newStatus);
      });
    });

    document.querySelectorAll('.btn-resolve-inc').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        openResolveCaseModal(id, false);
      });
    });

    document.querySelectorAll('.btn-view-inc-action').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        openResolveCaseModal(id, true);
      });
    });
  }

  // Concern Search and Filters
  const incidentsSearchInput = document.getElementById('incidentsSearchInput');
  if (incidentsSearchInput) {
    incidentsSearchInput.addEventListener('input', function () {
      currentIncSearch = this.value.trim();
      renderIncidentsTable();
    });
  }

  const incStatusPills = document.querySelectorAll('#incidentsStatusFilterGroup .filter-pill');
  incStatusPills.forEach(pill => {
    pill.addEventListener('click', function () {
      incStatusPills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      currentIncStatusFilter = this.getAttribute('data-status');
      renderIncidentsTable();
    });
  });

  const incidentCategorySelect = document.getElementById('incidentCategorySelect');
  if (incidentCategorySelect) {
    incidentCategorySelect.addEventListener('change', function () {
      currentIncCategoryFilter = this.value;
      renderIncidentsTable();
    });
  }

  const incidentUrgencySelect = document.getElementById('incidentUrgencySelect');
  if (incidentUrgencySelect) {
    incidentUrgencySelect.addEventListener('change', function () {
      currentIncUrgencyFilter = this.value;
      renderIncidentsTable();
    });
  }

  renderIncidentsTable();
  window.addEventListener('storage', function (e) {
    if (e.key === 'brgy360_concerns') {
      syncResidentConcernsFromStorage();
      renderIncidentsTable();
    } else if (e.key === 'brgy360_service_requests' || e.key === 'brgy360_requests' || e.key === 'brgy360_user_requests' || !e.key) {
      serviceRequests = loadServiceRequests();
      renderRequestsTable();
      renderOverviewQueue();
      updateRequestsCounter(serviceRequests.length);
    }
  });

  window.addEventListener('brgy360_requests_changed', function () {
    serviceRequests = loadServiceRequests();
    renderRequestsTable();
    renderOverviewQueue();
    updateRequestsCounter(serviceRequests.length);
  });

  // ==============================================================
  // 9. OVERVIEW OPERATIONAL ACTIONS
  // ==============================================================
  document.querySelectorAll('.btn-advisory-act').forEach(btn => {
    btn.addEventListener('click', function () {
      const act = this.getAttribute('data-action');
      if (act === 'deploy-desk') {
        showAdminToast('Action Logged', 'Satellite verification desk directive noted in dispatch records.', 'success');
      } else {
        showAdminToast('Action Logged', 'Preventive dredging directive confirmed and noted.', 'success');
      }
    });
  });

  // ==============================================================
  // 11. DETAIL & INSPECTION MODALS
  // ==============================================================

  // Modal: Request Detail
  const requestDetailModal = document.getElementById('requestDetailModal');
  const btnCloseReqModal = document.getElementById('btnCloseReqModal');
  const modalReqDocType = document.getElementById('modalReqDocType');
  const modalReqRef = document.getElementById('modalReqRef');
  const modalReqBody = document.getElementById('modalReqBody');
  const btnReadyInModal = document.getElementById('btnReadyInModal');
  const btnRejectInModal = document.getElementById('btnRejectInModal');

  function openRequestDetailModal(id) {
    const item = serviceRequests.find(r => r.id === id || r.ref === id);
    if (!item || !requestDetailModal) return;

    currentInspectingReqId = id;
    if (modalReqDocType) modalReqDocType.textContent = item.docType || item.documentType;
    if (modalReqRef) modalReqRef.textContent = `Application Ref: ${item.id || item.ref}`;

    let statusPillClass = 'badge-status yellow';
    if (item.status === 'Ready for Pickup') statusPillClass = 'badge-status green';
    else if (item.status === 'Completed' || item.status === 'Approved') statusPillClass = 'badge-status blue';
    else if (item.status === 'Rejected') statusPillClass = 'badge-status red';

    if (modalReqBody) {
      modalReqBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:14px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
            <div><span style="font-size:11px; color:#64748b;">Resident Applicant:</span><br><strong>${escapeHtml(item.resident || item.fullName)}</strong></div>
            <div><span style="font-size:11px; color:#64748b;">Sitio / Purok:</span><br><strong>${escapeHtml(item.sitio || item.purokSitio)}</strong></div>
            <div><span style="font-size:11px; color:#64748b;">Contact Mobile:</span><br><strong>${escapeHtml(item.contact || 'N/A')}</strong></div>
            <div><span style="font-size:11px; color:#64748b;">ID on Record:</span><br><strong>${escapeHtml(item.idOnRecord || 'PhilID on file')}</strong></div>
          </div>
          <div>
            <span style="font-size:11px; color:#64748b;">Declared Purpose:</span>
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:10px; margin-top:4px; font-weight:500;">
              ${escapeHtml(item.purpose)}
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12px; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
            <div><span style="color:#64748b;">Claim Method:</span><br><strong>${escapeHtml(item.claimMethod || 'Physical Pickup at Barangay Hall')}</strong></div>
            <div><span style="color:#64748b;">Target Timeline:</span><br><strong>${escapeHtml(item.claimTarget || '1–2 Working Days')}</strong></div>
            <div><span style="color:#64748b;">Registered Address:</span><br><strong>${escapeHtml(item.address || (item.sitio + ', Barangay Pallocan West'))}</strong></div>
            <div><span style="color:#64748b;">Resident Email:</span><br><strong>${escapeHtml(item.userEmail || item.email || 'N/A')}</strong></div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e2e8f0; padding-top:10px;">
            <span style="font-size:11px; color:#64748b;">Date Filed: ${escapeHtml(item.dateFiled || item.date)}</span>
            <span style="font-size:11px; font-weight:700;">Status: <span class="${statusPillClass}">${escapeHtml(item.status)}</span></span>
          </div>
        </div>
      `;
    }

    const modalFooter = document.getElementById('modalReqFooter');
    if (modalFooter) {
      if (item.status === 'Ready for Pickup') {
        modalFooter.innerHTML = `
          <button type="button" class="btn-modal-outline" id="btnRejectInModal">Reject Application</button>
          <button type="button" class="btn-modal-primary" id="btnClaimInModal" style="background:#2563eb;">Mark as Claimed / Completed</button>
        `;
        document.getElementById('btnClaimInModal')?.addEventListener('click', function () {
          setRequestStatus(currentInspectingReqId, 'Completed');
          closeRequestDetailModal();
        });
        document.getElementById('btnRejectInModal')?.addEventListener('click', function () {
          setRequestStatus(currentInspectingReqId, 'Rejected');
          closeRequestDetailModal();
        });
      } else if (item.status === 'Completed') {
        modalFooter.innerHTML = `
          <button type="button" class="btn-modal-outline" id="btnCloseCompletedInModal">Close</button>
          <button type="button" class="btn-modal-primary" style="background:#16a34a; cursor:default;" disabled>&check; Document Completed &amp; Released</button>
        `;
        document.getElementById('btnCloseCompletedInModal')?.addEventListener('click', closeRequestDetailModal);
      } else if (item.status === 'Rejected') {
        modalFooter.innerHTML = `
          <button type="button" class="btn-modal-outline" id="btnCloseRejectedInModal">Close</button>
          <button type="button" class="btn-modal-primary" id="btnReopenInModal" style="background:#f59e0b;">Re-evaluate Application</button>
        `;
        document.getElementById('btnCloseRejectedInModal')?.addEventListener('click', closeRequestDetailModal);
        document.getElementById('btnReopenInModal')?.addEventListener('click', function () {
          setRequestStatus(currentInspectingReqId, 'In Review');
          closeRequestDetailModal();
        });
      } else {
        modalFooter.innerHTML = `
          <button type="button" class="btn-modal-outline" id="btnRejectInModal">Reject Application</button>
          <button type="button" class="btn-modal-primary" id="btnReadyInModal">Mark Ready for Pickup</button>
        `;
        document.getElementById('btnReadyInModal')?.addEventListener('click', function () {
          setRequestStatus(currentInspectingReqId, 'Ready for Pickup');
          closeRequestDetailModal();
        });
        document.getElementById('btnRejectInModal')?.addEventListener('click', function () {
          setRequestStatus(currentInspectingReqId, 'Rejected');
          closeRequestDetailModal();
        });
      }
    }

    requestDetailModal.classList.add('active');
  }

  function closeRequestDetailModal() {
    if (requestDetailModal) requestDetailModal.classList.remove('active');
    currentInspectingReqId = null;
  }

  if (btnCloseReqModal) btnCloseReqModal.addEventListener('click', closeRequestDetailModal);

  // Modal: View & Update Submitted Resident Concern
  const concernViewModal = document.getElementById('concernViewModal');
  const btnCloseIncModal = document.getElementById('btnCloseIncModal');
  const btnCloseIncFooter = document.getElementById('btnCloseIncFooter');
  const btnSaveConcernModalStatus = document.getElementById('btnSaveConcernModalStatus');
  const modalIncTitle = document.getElementById('modalIncTitle');
  const modalIncId = document.getElementById('modalIncId');
  const modalIncViewBody = document.getElementById('modalIncViewBody');

  function openConcernViewModal(id) {
    const item = incidentTickets.find(t => t.id === id || t.ref === id);
    if (!item || !concernViewModal) return;

    currentInspectingIncId = item.id;
    const statusNorm = normalizeConcernStatus(item.status);
    const urgencyNorm = normalizeConcernUrgency(item.urgency);

    if (modalIncTitle) modalIncTitle.textContent = item.title || `${item.category} Concern`;
    if (modalIncId) modalIncId.textContent = `Ticket #${item.id} · Submitted on ${item.dateFiled}`;

    const urgencyBadgeHtml = getConcernUrgencyBadgeHtml(urgencyNorm);
    let statusBadgeHtml = '<span class="badge-status yellow">Pending</span>';
    if (statusNorm === 'In Progress') {
      statusBadgeHtml = '<span class="badge-status blue">In Progress</span>';
    } else if (statusNorm === 'Resolved') {
      statusBadgeHtml = '<span class="badge-status green">Resolved</span>';
    }

    if (modalIncViewBody) {
      modalIncViewBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:14px;">
          <!-- Top Metadata Strip -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span class="resolve-ticket-badge">${escapeHtml(item.id)}</span>
              <span class="badge-neutral">${escapeHtml(item.category)}</span>
              ${urgencyBadgeHtml}
            </div>
            <div>${statusBadgeHtml}</div>
          </div>

          <!-- Submitted Resident / User Information -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px;">
            <div style="font-size:11px; font-weight:700; color:#0d47a1; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:10px;">
              Resident Information
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px 14px;">
              <div>
                <span style="font-size:10.5px; font-weight:600; color:#64748b; display:block;">Full Name</span>
                <strong style="font-size:13px; color:#0f172a;">${escapeHtml(item.reporter)}</strong>
              </div>
              <div>
                <span style="font-size:10.5px; font-weight:600; color:#64748b; display:block;">Resident ID</span>
                <strong style="font-size:12.5px; color:#0f172a;">${escapeHtml(item.residentId || 'Verified Resident')}</strong>
              </div>
              <div>
                <span style="font-size:10.5px; font-weight:600; color:#64748b; display:block;">Mobile Number</span>
                <span style="font-size:12.5px; color:#334155;">${escapeHtml(item.userMobile || 'Not provided')}</span>
              </div>
              <div>
                <span style="font-size:10.5px; font-weight:600; color:#64748b; display:block;">Email Address</span>
                <span style="font-size:12.5px; color:#334155;">${escapeHtml(item.userEmail || 'Not provided')}</span>
              </div>
              <div style="grid-column: 1 / -1;">
                <span style="font-size:10.5px; font-weight:600; color:#64748b; display:block;">Residential Address</span>
                <span style="font-size:12.5px; color:#334155;">${escapeHtml(item.userAddress || item.sitio)}</span>
              </div>
            </div>
          </div>

          <!-- Concern Full Details -->
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:14px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid #f1f5f9;">
              <div>
                <span style="font-size:10.5px; font-weight:600; color:#64748b; display:block;">Date Submitted</span>
                <strong style="font-size:12.5px; color:#0f172a;">${escapeHtml(item.dateFiled)}</strong>
              </div>
              <div>
                <span style="font-size:10.5px; font-weight:600; color:#64748b; display:block;">Incident Location / Sitio</span>
                <strong style="font-size:12.5px; color:#0f172a;">${escapeHtml(item.location)}</strong>
              </div>
            </div>
            <div style="margin-bottom:8px;">
              <span style="font-size:10.5px; font-weight:700; color:#64748b; text-transform:uppercase; display:block; margin-bottom:3px;">Concern Title</span>
              <div style="font-size:14px; font-weight:700; color:#0f172a;">${escapeHtml(item.title)}</div>
            </div>
            <div>
              <span style="font-size:10.5px; font-weight:700; color:#64748b; text-transform:uppercase; display:block; margin-bottom:4px;">Full Description</span>
              <p style="margin:0; font-size:13px; color:#334155; line-height:1.55; white-space:pre-wrap;">${escapeHtml(item.desc)}</p>
            </div>
            ${item.photoData ? `
              <div style="margin-top:12px; padding-top:12px; border-top:1px solid #f1f5f9;">
                <span style="font-size:10.5px; font-weight:700; color:#64748b; text-transform:uppercase; display:block; margin-bottom:6px;">Attached Photo Evidence</span>
                <img src="${item.photoData}" alt="Resident submitted concern evidence" style="max-width:100%; max-height:220px; border-radius:8px; border:1px solid #e2e8f0; object-fit:cover;">
              </div>
            ` : (item.photoName ? `
              <div style="margin-top:10px; font-size:12px; color:#64748b;">
                <strong>Attached File:</strong> ${escapeHtml(item.photoName)}
              </div>
            ` : '')}
          </div>

          <!-- Admin Status & Action Update Controls -->
          <div style="background:#f0f7ff; border:1px solid #bfdbfe; border-radius:8px; padding:14px;">
            <div style="font-size:11px; font-weight:700; color:#0d47a1; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:10px;">
              Update Concern Status &amp; Admin Remarks
            </div>
            <div class="form-grid-2" style="margin-bottom:10px;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="modalConcernStatusSelect">Concern Status</label>
                <select id="modalConcernStatusSelect" class="form-select">
                  <option value="Pending" ${statusNorm === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="In Progress" ${statusNorm === 'In Progress' ? 'selected' : ''}>In Progress</option>
                  <option value="Resolved" ${statusNorm === 'Resolved' ? 'selected' : ''}>Resolved</option>
                </select>
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label">Urgency Level (Set by Resident)</label>
                <div style="display:flex; align-items:center; justify-content:space-between; height:38px; padding:0 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; cursor:not-allowed;" title="Urgency level is set by the resident upon submission and cannot be modified by Admin">
                  ${urgencyBadgeHtml}
                  <span style="font-size:11px; color:#64748b; font-weight:500;">Read-only</span>
                </div>
              </div>
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label" for="modalConcernAdminNote">Barangay Response / Action Notes (Visible to Resident)</label>
              <textarea id="modalConcernAdminNote" class="form-textarea" rows="3" placeholder="Enter inspection findings, assigned team, or resolution details...">${escapeHtml(item.resolutionNote || '')}</textarea>
            </div>
          </div>
        </div>
      `;
    }

    concernViewModal.classList.add('active');
  }

  function closeConcernViewModal() {
    if (concernViewModal) concernViewModal.classList.remove('active');
    currentInspectingIncId = null;
  }

  if (btnCloseIncModal) btnCloseIncModal.addEventListener('click', closeConcernViewModal);
  if (btnCloseIncFooter) btnCloseIncFooter.addEventListener('click', closeConcernViewModal);
  if (btnSaveConcernModalStatus) {
    btnSaveConcernModalStatus.addEventListener('click', function () {
      if (!currentInspectingIncId) return;
      const newStatus = document.getElementById('modalConcernStatusSelect')?.value || 'Pending';
      const adminNote = document.getElementById('modalConcernAdminNote')?.value || '';
      updateConcernStatus(currentInspectingIncId, newStatus, adminNote);
      closeConcernViewModal();
    });
  }

  // ==============================================================
  // RESOLVE CASE / CONCERN MODAL: RESPONSE & ACTION RECORDER
  // ==============================================================
  const resolveCaseModal = document.getElementById('resolveCaseModal');
  const btnCloseResolveModal = document.getElementById('btnCloseResolveModal');
  const btnCancelResolveCase = document.getElementById('btnCancelResolveCase');
  const btnSubmitResolveCase = document.getElementById('btnSubmitResolveCase');
  const resolveActionInput = document.getElementById('resolveActionInput');
  const quickChipsGroup = document.getElementById('resolveQuickChips')?.closest('.form-group');

  function openResolveCaseModal(id, isViewOnly = false) {
    const ticket = incidentTickets.find(t => t.id === id || t.ref === id);
    if (!ticket || !resolveCaseModal) return;

    currentResolvingIncidentId = ticket.id;
    const urgencyNorm = normalizeConcernUrgency(ticket.urgency);

    const elId = document.getElementById('resCaseTicketId');
    const elCat = document.getElementById('resCaseCategory');
    const elSev = document.getElementById('resCaseSeverity');
    const elDate = document.getElementById('resCaseDateLogged');
    const elSum = document.getElementById('resCaseSummary');
    const elLoc = document.getElementById('resCaseLocation');
    const elRep = document.getElementById('resCaseReporter');
    const elNotes = document.getElementById('resCasePrevNotes');
    const modalTitle = document.getElementById('resolveModalTitle');
    const modalSub = resolveCaseModal.querySelector('.modal-sub');

    if (elId) elId.textContent = ticket.id;
    if (elCat) elCat.textContent = ticket.category;
    if (elSev) {
      if (urgencyNorm === 'Urgent') {
        elSev.className = 'badge-status badge-urgent-pill';
        elSev.innerHTML = '<span class="status-dot dot-red"></span>Urgent';
      } else {
        elSev.className = 'badge-status badge-standard-pill';
        elSev.innerHTML = '<span class="dot-gray"></span>Standard';
      }
    }
    if (elDate) elDate.textContent = `Submitted: ${ticket.dateFiled}`;
    if (elSum) elSum.textContent = ticket.title;
    if (elLoc) elLoc.textContent = ticket.location;
    if (elRep) elRep.textContent = ticket.reporter;
    if (elNotes) elNotes.textContent = ticket.desc || 'No additional description.';

    const isResolved = normalizeConcernStatus(ticket.status) === 'Resolved';

    if (isViewOnly || isResolved) {
      if (modalTitle) modalTitle.textContent = `View Action: ${ticket.id}`;
      if (modalSub) modalSub.textContent = `Recorded response and action made to resolve this concern case.`;
      if (resolveActionInput) {
        resolveActionInput.value = ticket.resolutionNote || ticket.actionTaken || 'No action recorded.';
      }
      if (quickChipsGroup) quickChipsGroup.style.display = 'none';
      if (btnSubmitResolveCase) {
        btnSubmitResolveCase.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Update Action Record</span>
        `;
      }
    } else {
      if (modalTitle) modalTitle.textContent = `Resolve Case in Concern: ${ticket.id}`;
      if (modalSub) modalSub.textContent = `Log the response or action made before marking this case as resolved.`;
      if (resolveActionInput) {
        resolveActionInput.value = '';
      }
      if (quickChipsGroup) quickChipsGroup.style.display = 'block';
      if (btnSubmitResolveCase) {
        btnSubmitResolveCase.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Confirm &amp; Mark as Resolved</span>
        `;
      }
    }

    resolveCaseModal.classList.add('active');
    setTimeout(() => {
      if (resolveActionInput && (!isViewOnly && !isResolved)) resolveActionInput.focus();
    }, 100);
  }

  function closeResolveCaseModal() {
    if (resolveCaseModal) resolveCaseModal.classList.remove('active');
    currentResolvingIncidentId = null;
  }

  if (btnCloseResolveModal) btnCloseResolveModal.addEventListener('click', closeResolveCaseModal);
  if (btnCancelResolveCase) btnCancelResolveCase.addEventListener('click', closeResolveCaseModal);

  document.querySelectorAll('#resolveQuickChips .quick-chip-btn').forEach(chip => {
    chip.addEventListener('click', function () {
      const text = this.getAttribute('data-text');
      if (resolveActionInput && text) {
        resolveActionInput.value = text;
        resolveActionInput.focus();
      }
    });
  });

  if (btnSubmitResolveCase) {
    btnSubmitResolveCase.addEventListener('click', function () {
      const ticket = incidentTickets.find(t => t.id === currentResolvingIncidentId || t.ref === currentResolvingIncidentId);
      if (!ticket) {
        closeResolveCaseModal();
        return;
      }

      const actionMade = (resolveActionInput?.value || '').trim();
      if (!actionMade) {
        if (resolveActionInput) {
          resolveActionInput.focus();
          resolveActionInput.style.borderColor = '#ef4444';
          setTimeout(() => { resolveActionInput.style.borderColor = ''; }, 2000);
        }
        showAdminToast('Action Required', 'Please enter the response or action made to resolve the case.', 'danger');
        return;
      }

      updateConcernStatus(ticket.id, 'Resolved', actionMade);
      closeResolveCaseModal();
    });
  }

  // Modal: Log Walk-in Concern
  const newIncidentModal = document.getElementById('newIncidentModal');
  const btnOpenNewIncidentModal = document.getElementById('btnOpenNewIncidentModal');
  const btnCloseNewIncModal = document.getElementById('btnCloseNewIncModal');
  const btnCancelNewInc = document.getElementById('btnCancelNewInc');
  const btnSubmitNewIncident = document.getElementById('btnSubmitNewIncident');

  const btnToggleConcernUrgency = document.getElementById('btnToggleConcernUrgency');
  const newIncUrgencyInput = document.getElementById('newIncUrgency');
  const newIncUrgencyBadge = document.getElementById('newIncUrgencyBadge');
  const newIncUrgencyTitle = document.getElementById('newIncUrgencyTitle');
  const newIncUrgencySub = document.getElementById('newIncUrgencySub');

  function setWalkInConcernUrgencyState(isUrgent) {
    if (!btnToggleConcernUrgency || !newIncUrgencyInput || !newIncUrgencyBadge) return;
    if (isUrgent) {
      btnToggleConcernUrgency.classList.add('is-critical');
      newIncUrgencyInput.value = 'Urgent';
      newIncUrgencyBadge.innerHTML = '<span class="status-dot dot-red"></span><span class="badge-text">Urgent</span>';
      if (newIncUrgencyTitle) newIncUrgencyTitle.textContent = 'Urgent Concern Level';
      if (newIncUrgencySub) newIncUrgencySub.textContent = 'Flagged as Urgent for immediate Barangay response and field inspection';
    } else {
      btnToggleConcernUrgency.classList.remove('is-critical');
      newIncUrgencyInput.value = 'Standard';
      newIncUrgencyBadge.innerHTML = '<span class="dot-gray"></span><span class="badge-text">Standard</span>';
      if (newIncUrgencyTitle) newIncUrgencyTitle.textContent = 'Standard Concern Level';
      if (newIncUrgencySub) newIncUrgencySub.textContent = 'Click to mark as Urgent if this concern poses an immediate safety or infrastructure hazard';
    }
  }

  if (btnToggleConcernUrgency) {
    btnToggleConcernUrgency.addEventListener('click', function () {
      const currentlyUrgent = newIncUrgencyInput?.value === 'Urgent';
      setWalkInConcernUrgencyState(!currentlyUrgent);
    });
  }

  function openNewIncidentModal() {
    setWalkInConcernUrgencyState(false);
    if (newIncidentModal) newIncidentModal.classList.add('active');
  }

  function closeNewIncidentModal() {
    setWalkInConcernUrgencyState(false);
    if (newIncidentModal) newIncidentModal.classList.remove('active');
  }

  if (btnOpenNewIncidentModal) btnOpenNewIncidentModal.addEventListener('click', openNewIncidentModal);
  if (btnCloseNewIncModal) btnCloseNewIncModal.addEventListener('click', closeNewIncidentModal);
  if (btnCancelNewInc) btnCancelNewInc.addEventListener('click', closeNewIncidentModal);

  // Real-time input restrictions and error clearing for Walk-in Incident form
  const incTitleInput = document.getElementById('newIncTitle');
  const incReporterInput = document.getElementById('newIncReporter');
  const incContactInput = document.getElementById('newIncContact');
  const incDescInput = document.getElementById('newIncDesc');

  if (incReporterInput) {
    incReporterInput.addEventListener('input', function () {
      this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('newIncReporterError');
      if (err) err.textContent = '';
    });
  }

  if (incContactInput) {
    incContactInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '');
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('newIncContactError');
      if (err) err.textContent = '';
    });
  }

  if (incTitleInput) {
    incTitleInput.addEventListener('input', function () {
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('newIncTitleError');
      if (err) err.textContent = '';
    });
  }

  if (incDescInput) {
    incDescInput.addEventListener('input', function () {
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('newIncDescError');
      if (err) err.textContent = '';
    });
  }

  if (btnSubmitNewIncident) {
    btnSubmitNewIncident.addEventListener('click', function () {
      const titleEl = document.getElementById('newIncTitle');
      const catEl = document.getElementById('newIncCategory');
      const urgencyEl = document.getElementById('newIncUrgency');
      const locEl = document.getElementById('newIncLocation');
      const repEl = document.getElementById('newIncReporter');
      const contactEl = document.getElementById('newIncContact');
      const descEl = document.getElementById('newIncDesc');

      const title = (titleEl?.value || '').trim();
      const cat = normalizeConcernCategory(catEl?.value || 'Infrastructure');
      const urgency = normalizeConcernUrgency(urgencyEl?.value || 'Standard');
      const loc = normalizeSitioName(locEl?.value || 'Sitio Ibaba');
      const reporterName = (repEl?.value || '').trim();
      const reporterContact = (contactEl?.value || '').trim();
      const desc = (descEl?.value || '').trim();

      // Reset prior errors
      const titleErr = document.getElementById('newIncTitleError');
      const repErr = document.getElementById('newIncReporterError');
      const contactErr = document.getElementById('newIncContactError');
      const descErr = document.getElementById('newIncDescError');

      [titleErr, repErr, contactErr, descErr].forEach(e => { if (e) e.textContent = ''; });
      [titleEl, repEl, contactEl, descEl].forEach(e => { if (e) e.classList.remove('is-invalid', 'input-error'); });

      let isValid = true;
      let firstInvalid = null;

      if (!title || title.length < 3) {
        if (titleErr) titleErr.textContent = 'Please enter a concern title (at least 3 characters).';
        if (titleEl) titleEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = titleEl;
      }

      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!reporterName) {
        if (repErr) repErr.textContent = 'Resident full name is required.';
        if (repEl) repEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = repEl;
      } else if (!nameRegex.test(reporterName)) {
        if (repErr) repErr.textContent = 'Resident name must contain letters and spaces only. No numbers or special characters.';
        if (repEl) repEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = repEl;
      }

      const digitsRegex = /^\d+$/;
      if (!reporterContact) {
        if (contactErr) contactErr.textContent = 'Contact number is required.';
        if (contactEl) contactEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = contactEl;
      } else if (!digitsRegex.test(reporterContact)) {
        if (contactErr) contactErr.textContent = 'Contact number must contain numeric digits only. No letters or special characters.';
        if (contactEl) contactEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = contactEl;
      } else if (reporterContact.length < 7 || reporterContact.length > 11) {
        if (contactErr) contactErr.textContent = 'Contact number must be between 7 and 11 digits.';
        if (contactEl) contactEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = contactEl;
      }

      if (!desc || desc.length < 10) {
        if (descErr) descErr.textContent = 'Please provide a detailed description (at least 10 characters).';
        if (descEl) descEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = descEl;
      }

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        showAdminToast('Validation Error', 'Please correct the highlighted fields with valid information.', 'danger');
        return;
      }

      const newId = 'TCK-' + Math.floor(1000 + Math.random() * 9000);
      const newTicket = normalizeAdminConcern({
        ref: newId,
        id: newId,
        title: title,
        desc: desc,
        category: cat,
        urgency: urgency,
        sitio: loc,
        location: loc,
        reporter: reporterName,
        userMobile: reporterContact,
        userAddress: loc + ', Barangay Pallocan West',
        dateFiled: new Date().toISOString().slice(0, 10),
        status: 'Pending',
        resolutionNote: ''
      });

      syncResidentConcernsFromStorage();
      incidentTickets.unshift(newTicket);
      persistConcernsToStorage();
      renderIncidentsTable();
      closeNewIncidentModal();

      const form = document.getElementById('newIncidentForm');
      if (form) form.reset();
      setWalkInConcernUrgencyState(false);

      showAdminToast('Concern Recorded', `Ticket ${newId} ("${title}") logged under ${cat} (${urgency}).`, 'success');
    });
  }

  // Close modals on clicking overlay backdrop
  document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // ESC key closes any open admin modal
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.admin-modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
      });
      if (typeof closePrintModal === 'function') {
        closePrintModal();
      }
    }
  });

  // ==============================================================
  // 14. PROPOSALS, PROJECTS, ANNOUNCEMENTS & SETTINGS MANAGERS
  // ==============================================================

  // ==============================================================
  // 14. PROPOSALS, PROJECTS, ANNOUNCEMENTS & SETTINGS MANAGERS
  // ==============================================================

  // A. Community Project Proposals Card Grid Engine
  function renderProposalsGrid() {
    const grid = document.getElementById('proposalsGrid');
    const emptyState = document.getElementById('proposalsEmptyState');
    if (!grid) return;

    // 1. Calculate live counts for Metric Summary Cards Top Bar
    const countPending = citizenProposals.filter(p => p.status === 'Pending').length;
    const countReview = citizenProposals.filter(p => p.status === 'Under Review').length;
    const countApproved = citizenProposals.filter(p => p.status === 'Approved').length;
    const countRejected = citizenProposals.filter(p => p.status === 'Rejected').length;
    const countAll = citizenProposals.length;

    // Update 4 Metric Top Cards
    const elPending = document.getElementById('metricCountPending');
    const elReview = document.getElementById('metricCountReview');
    const elApproved = document.getElementById('metricCountApproved');
    const elRejected = document.getElementById('metricCountRejected');
    if (elPending) elPending.textContent = countPending;
    if (elReview) elReview.textContent = countReview;
    if (elApproved) elApproved.textContent = countApproved;
    if (elRejected) elRejected.textContent = countRejected;

    // Update Filter Pill Counts
    const pAll = document.getElementById('pillCountAll');
    const pPending = document.getElementById('pillCountPending');
    const pReview = document.getElementById('pillCountReview');
    const pApproved = document.getElementById('pillCountApproved');
    const pRejected = document.getElementById('pillCountRejected');
    if (pAll) pAll.textContent = countAll;
    if (pPending) pPending.textContent = countPending;
    if (pReview) pReview.textContent = countReview;
    if (pApproved) pApproved.textContent = countApproved;
    if (pRejected) pRejected.textContent = countRejected;

    // Update Sidebar Counter (Pending Proposals)
    const navCounter = document.getElementById('navCounterProposals');
    if (navCounter) navCounter.textContent = countPending;

    // 2. Filter proposals based on active filter pill and search input
    const searchInput = document.getElementById('proposalsSearchInput');
    const searchTerm = (searchInput ? searchInput.value : '').toLowerCase().trim();

    const filtered = citizenProposals.filter(p => {
      let matchFilter = true;
      if (currentProposalFilter !== 'all') {
        matchFilter = p.status.toLowerCase() === currentProposalFilter.toLowerCase();
      }

      let matchSearch = true;
      if (searchTerm) {
        matchSearch = (
          (p.title && p.title.toLowerCase().includes(searchTerm)) ||
          (p.proponent && p.proponent.toLowerCase().includes(searchTerm)) ||
          (p.location && p.location.toLowerCase().includes(searchTerm)) ||
          (p.sitio && p.sitio.toLowerCase().includes(searchTerm)) ||
          (p.category && p.category.toLowerCase().includes(searchTerm)) ||
          (p.description && p.description.toLowerCase().includes(searchTerm)) ||
          (p.id && p.id.toLowerCase().includes(searchTerm))
        );
      }

      return matchFilter && matchSearch;
    });

    // 3. Handle Empty State Fallback
    if (filtered.length === 0) {
      grid.innerHTML = '';
      grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = 'grid';

    // 4. Render 2-Column Responsive Card Grid
    grid.innerHTML = filtered.map(p => {
      // Map status class for badge pill
      let statusClass = 'pending';
      let statusBulletColor = '#f59e0b';
      if (p.status === 'Under Review') {
        statusClass = 'under-review';
        statusBulletColor = '#0284c7';
      } else if (p.status === 'Approved') {
        statusClass = 'approved';
        statusBulletColor = '#16a34a';
      } else if (p.status === 'Rejected') {
        statusClass = 'rejected';
        statusBulletColor = '#e11d48';
      }

      const categoryTag = `${escapeHtml(p.category || 'Community')} · ${escapeHtml(p.year || '2026')}`;
      const locationText = escapeHtml(p.location || p.sitio || 'Barangay Pallocan Kanluran');
      const proponentText = `Submitted by: <strong>${escapeHtml(p.proponent || 'Citizen')}</strong> · ${escapeHtml(p.date || 'Oct 12, 2026')}`;

      // Quick action buttons in footer
      let footerActions = '';
      if (p.status === 'Pending') {
        footerActions = `
          <button type="button" class="btn-prop-action btn-prop-approve" data-id="${p.id || p.ref}" title="Approve proposal">Approve</button>
          <button type="button" class="btn-prop-action btn-prop-under-review" data-id="${p.id || p.ref}" title="Mark Under Review">Under Review</button>
          <button type="button" class="btn-prop-action btn-prop-reject" data-id="${p.id || p.ref}" title="Reject proposal">Reject</button>
          <button type="button" class="btn-prop-action btn-prop-review" data-id="${p.id || p.ref}">Review Details</button>
        `;
      } else if (p.status === 'Under Review') {
        footerActions = `
          <button type="button" class="btn-prop-action btn-prop-approve" data-id="${p.id || p.ref}" title="Approve proposal">Approve</button>
          <button type="button" class="btn-prop-action btn-prop-reject" data-id="${p.id || p.ref}" title="Reject proposal">Reject</button>
          <button type="button" class="btn-prop-action btn-prop-review" data-id="${p.id || p.ref}">Review Details</button>
        `;
      } else if (p.status === 'Approved') {
        footerActions = `
          <span style="font-size: 11.5px; font-weight: 600; color: #16a34a; margin-right: 4px;">✓ Approved</span>
          <button type="button" class="btn-prop-action btn-prop-under-review" data-id="${p.id || p.ref}" title="Mark Under Review">Under Review</button>
          <button type="button" class="btn-prop-action btn-prop-reject" data-id="${p.id || p.ref}" title="Reject proposal">Reject</button>
          <button type="button" class="btn-prop-action btn-prop-review" data-id="${p.id || p.ref}">Review Details</button>
        `;
      } else {
        // Rejected
        footerActions = `
          <span style="font-size: 11.5px; font-weight: 600; color: #e11d48; margin-right: 4px;">✕ Rejected</span>
          <button type="button" class="btn-prop-action btn-prop-approve" data-id="${p.id || p.ref}" title="Reconsider and approve">Approve</button>
          <button type="button" class="btn-prop-action btn-prop-under-review" data-id="${p.id || p.ref}" title="Mark Under Review">Under Review</button>
          <button type="button" class="btn-prop-action btn-prop-review" data-id="${p.id || p.ref}">Review Details</button>
        `;
      }

      return `
        <div class="proposal-card" data-id="${escapeHtml(p.id || p.ref)}">
          <!-- Card Top Metadata Bar -->
          <div class="proposal-card-top">
            <div class="proposal-card-meta-left">
              <span class="proposal-status-pill status-${statusClass}">
                <span class="status-bullet" style="color: ${statusBulletColor};">●</span> ${escapeHtml(p.status)}
              </span>
              <span class="proposal-category-tag">${categoryTag}</span>
            </div>
            <div class="proposal-card-quick-actions">
              <button type="button" class="btn-icon-action btn-edit-proposal" data-id="${p.id || p.ref}" title="Edit / Review Proposal" aria-label="Edit or review proposal">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button type="button" class="btn-icon-action btn-delete-proposal" data-id="${p.id || p.ref}" title="Delete Proposal" aria-label="Delete proposal">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- Card Title -->
          <h3 class="proposal-card-title">${escapeHtml(p.title)}</h3>

          <!-- Location Line -->
          <div class="proposal-card-line proposal-location-line">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${locationText}</span>
          </div>

          <!-- Proponent / Resident Line -->
          <div class="proposal-card-line proposal-proponent-line">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>${proponentText}</span>
          </div>

          ${p.timeline ? `
          <div class="proposal-card-line proposal-timeline-line" style="font-size: 12px; color: #64748b; margin-top: 2px;">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Timeline: <strong>${escapeHtml(p.timeline)}</strong></span>
          </div>
          ` : ''}

          <!-- Description (2-3 lines truncated) -->
          <p class="proposal-card-description">${escapeHtml(p.description || p.rationale || '')}</p>

          <!-- Card Footer Bar -->
          <div class="proposal-card-footer">
            <div class="proposal-footer-budget">
              <span class="budget-label">Est. Budget:</span>
              <span class="budget-value">${escapeHtml(p.budget || '₱0.00')}</span>
            </div>
            <div class="proposal-footer-actions">
              ${footerActions}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // 5. Bind Card Action Events
    bindProposalCardEvents();
  }

  // Centralized status updater that guarantees in-place update (no duplicate) and persistence
  function updateProposalStatus(id, newStatus, notes) {
    const propIndex = citizenProposals.findIndex(p => p.id === id || p.ref === id);
    if (propIndex === -1) return;

    const prop = citizenProposals[propIndex];
    prop.status = newStatus;
    if (notes !== undefined && notes !== null && notes !== '') {
      prop.councilNotes = notes;
      prop.councilNote = notes;
    }

    // Persist immediately to localStorage
    saveCitizenProposals();

    // Re-render immediate frontend state
    renderProposalsGrid();

    // Display appropriate success feedback
    const displayRef = prop.id || prop.ref;
    if (newStatus === 'Approved') {
      showAdminToast('Proposal Approved', `"${prop.title}" (${displayRef}) has been changed to Approved.`, 'success');
    } else if (newStatus === 'Under Review') {
      showAdminToast('Proposal Under Review', `"${prop.title}" (${displayRef}) has been changed to Under Review.`, 'info');
    } else if (newStatus === 'Rejected') {
      showAdminToast('Proposal Rejected', `"${prop.title}" (${displayRef}) has been changed to Rejected.`, 'warning');
    }
  }

  // Alias for backward compatibility
  function renderProposalsTable() {
    renderProposalsGrid();
  }
  window.renderProposalsTable = renderProposalsGrid;
  window.renderProposalsGrid = renderProposalsGrid;

  function bindProposalCardEvents() {
    // Quick Approve button
    document.querySelectorAll('.btn-prop-approve').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.getAttribute('data-id');
        updateProposalStatus(id, 'Approved');
      });
    });

    // Quick Under Review button
    document.querySelectorAll('.btn-prop-under-review').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.getAttribute('data-id');
        updateProposalStatus(id, 'Under Review');
      });
    });

    // Quick Reject button
    document.querySelectorAll('.btn-prop-reject').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.getAttribute('data-id');
        updateProposalStatus(id, 'Rejected');
      });
    });

    // Quick Review Details button & Edit Pencil
    document.querySelectorAll('.btn-prop-review, .btn-edit-proposal').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.getAttribute('data-id');
        openReviewProposalModal(id);
      });
    });

    // Delete Trash Icon
    document.querySelectorAll('.btn-delete-proposal').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.getAttribute('data-id');
        const prop = citizenProposals.find(p => p.id === id || p.ref === id);
        if (!prop) return;

        if (confirm(`Are you sure you want to delete proposal "${prop.title}" (${prop.id || prop.ref})?`)) {
          citizenProposals = citizenProposals.filter(p => p.id !== id && p.ref !== id);
          saveCitizenProposals();
          renderProposalsGrid();
          showAdminToast('Proposal Deleted', `Proposal record ${id} has been permanently removed.`, 'warning');
        }
      });
    });
  }

  // Review & Decision Modal Logic
  window.openReviewProposalModal = function(id) {
    const prop = citizenProposals.find(p => p.id === id || p.ref === id);
    if (!prop) return;

    const modal = document.getElementById('proposalReviewModal');
    const titleEl = document.getElementById('modalPropTitle');
    const idEl = document.getElementById('modalPropId');
    const bodyEl = document.getElementById('modalPropBody');

    if (titleEl) titleEl.textContent = prop.title;
    if (idEl) idEl.textContent = prop.id || prop.ref;

    let statusBadgeClass = 'yellow';
    if (prop.status === 'Approved') statusBadgeClass = 'green';
    if (prop.status === 'Rejected') statusBadgeClass = 'red';
    if (prop.status === 'Under Review') statusBadgeClass = 'blue';

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div>
              <span class="badge-neutral" style="font-weight: 700; margin-right: 6px;">${escapeHtml(prop.category || 'General')}</span>
              <span style="color: #64748b; font-size: 12px;">Fiscal Year ${escapeHtml(prop.year || '2026')}</span>
            </div>
            <div>
              <span class="badge-status ${statusBadgeClass}">● ${escapeHtml(prop.status)}</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
            <div>
              <span style="font-size: 11px; text-transform: uppercase; color: #64748b; display: block; font-weight: 700;">Location / Sitio</span>
              <strong style="color: #0f172a;">${escapeHtml(prop.location || prop.sitio || 'Barangay Pallocan West')}</strong>
            </div>
            <div>
              <span style="font-size: 11px; text-transform: uppercase; color: #64748b; display: block; font-weight: 700;">Proponent / Submitter</span>
              <strong style="color: #0f172a;">${escapeHtml(prop.proponent || 'Citizen')}</strong>
            </div>
            <div>
              <span style="font-size: 11px; text-transform: uppercase; color: #64748b; display: block; font-weight: 700;">Estimated Budget</span>
              <strong style="font-size: 15px; color: #0d47a1;">${escapeHtml(prop.budget)}</strong>
            </div>
            <div>
              <span style="font-size: 11px; text-transform: uppercase; color: #64748b; display: block; font-weight: 700;">Proposed Timeline</span>
              <strong style="color: #0f172a;">${escapeHtml(prop.timeline || 'Not specified')}</strong>
            </div>
          </div>

          <div>
            <strong style="display: block; margin-bottom: 6px; color: #0f172a;">Rationale & Community Impact:</strong>
            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; color: #334155; line-height: 1.55;">
              ${escapeHtml(prop.description || prop.rationale || '')}
            </div>
          </div>

          <div class="form-group" style="margin: 0;">
            <label class="form-label" for="modalCouncilDecisionNotes">Barangay Council Review Notes &amp; Disposition:</label>
            <textarea id="modalCouncilDecisionNotes" class="form-textarea" rows="3" placeholder="Enter council deliberations, committee assignment, or justification for approval/rejection...">${escapeHtml(prop.councilNotes || prop.councilNote || '')}</textarea>
          </div>
        </div>
      `;
    }

    if (modal) modal.classList.add('active');

    // Button: Approve
    const btnApprove = document.getElementById('btnApprovePropInModal');
    if (btnApprove) {
      btnApprove.onclick = function() {
        const notes = document.getElementById('modalCouncilDecisionNotes')?.value.trim();
        updateProposalStatus(id, 'Approved', notes);
        if (modal) modal.classList.remove('active');
      };
    }

    // Button: Mark Under Review
    const btnUnderReview = document.getElementById('btnUnderReviewPropInModal');
    if (btnUnderReview) {
      btnUnderReview.onclick = function() {
        const notes = document.getElementById('modalCouncilDecisionNotes')?.value.trim();
        updateProposalStatus(id, 'Under Review', notes);
        if (modal) modal.classList.remove('active');
      };
    }

    // Button: Reject
    const btnReject = document.getElementById('btnRejectPropInModal');
    if (btnReject) {
      btnReject.onclick = function() {
        const notes = document.getElementById('modalCouncilDecisionNotes')?.value.trim();
        updateProposalStatus(id, 'Rejected', notes);
        if (modal) modal.classList.remove('active');
      };
    }
  };

  const btnClosePropModal = document.getElementById('btnClosePropModal');
  if (btnClosePropModal) {
    btnClosePropModal.addEventListener('click', () => {
      document.getElementById('proposalReviewModal')?.classList.remove('active');
    });
  }

  // Cross-page storage synchronization for proposals & capital projects
  window.addEventListener('storage', function(e) {
    if (e.key === 'brgy360_proposals' || !e.key) {
      citizenProposals = loadCitizenProposals();
      renderProposalsGrid();
    }
    if (e.key === 'brgy360_capital_projects') {
      capitalProjects = loadCapitalProjects();
      renderProjectsTable();
    }
  });

  window.addEventListener('brgy360_proposals_changed', function() {
    citizenProposals = loadCitizenProposals();
    renderProposalsGrid();
  });

  // Submit New Proposal Modal Triggers & Form Submission
  const btnOpenSubmitProp = document.getElementById('btnOpenSubmitProposalModal');
  const modalSubmitProp = document.getElementById('submitProposalModal');
  const btnCloseSubmitProp = document.getElementById('btnCloseSubmitPropModal');
  const btnCancelSubmitProp = document.getElementById('btnCancelSubmitProp');
  const btnSaveSubmitProp = document.getElementById('btnSaveSubmitProp');

  if (btnOpenSubmitProp) {
    btnOpenSubmitProp.addEventListener('click', () => {
      if (modalSubmitProp) modalSubmitProp.classList.add('active');
      const titleInput = document.getElementById('newPropTitle');
      if (titleInput) titleInput.focus();
    });
  }

  if (btnCloseSubmitProp) {
    btnCloseSubmitProp.addEventListener('click', () => {
      if (modalSubmitProp) modalSubmitProp.classList.remove('active');
    });
  }

  if (btnCancelSubmitProp) {
    btnCancelSubmitProp.addEventListener('click', () => {
      if (modalSubmitProp) modalSubmitProp.classList.remove('active');
    });
  }

  // Real-time input restrictions and error clearing for Community Proposal modal
  const propTitleInput = document.getElementById('newPropTitle');
  const propProponentInput = document.getElementById('newPropProponent');
  const propBudgetInput = document.getElementById('newPropBudget');
  const propDescInput = document.getElementById('newPropDescription');

  if (propProponentInput) {
    propProponentInput.addEventListener('input', function () {
      this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('newPropProponentError');
      if (err) err.textContent = '';
    });
  }

  if (propBudgetInput) {
    propBudgetInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '');
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('newPropBudgetError');
      if (err) err.textContent = '';
    });
  }

  if (propTitleInput) {
    propTitleInput.addEventListener('input', function () {
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('newPropTitleError');
      if (err) err.textContent = '';
    });
  }

  if (propDescInput) {
    propDescInput.addEventListener('input', function () {
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('newPropDescriptionError');
      if (err) err.textContent = '';
    });
  }

  if (btnSaveSubmitProp) {
    btnSaveSubmitProp.addEventListener('click', () => {
      const titleEl = document.getElementById('newPropTitle');
      const propEl = document.getElementById('newPropProponent');
      const budgetEl = document.getElementById('newPropBudget');
      const descEl = document.getElementById('newPropDescription');
      const locEl = document.getElementById('newPropLocation');

      const title = (titleEl?.value || '').trim();
      const category = document.getElementById('newPropCategory')?.value || 'Infrastructure';
      const year = document.getElementById('newPropYear')?.value.trim() || '2026';
      const location = (locEl?.value || '').trim();
      const proponent = (propEl?.value || '').trim();
      const budget = (budgetEl?.value || '').trim();
      const status = document.getElementById('newPropStatus')?.value || 'Pending';
      const description = (descEl?.value || '').trim();

      // Reset prior errors
      const titleErr = document.getElementById('newPropTitleError');
      const propErr = document.getElementById('newPropProponentError');
      const budgetErr = document.getElementById('newPropBudgetError');
      const descErr = document.getElementById('newPropDescriptionError');

      [titleErr, propErr, budgetErr, descErr].forEach(e => { if (e) e.textContent = ''; });
      [titleEl, propEl, budgetEl, descEl].forEach(e => { if (e) e.classList.remove('is-invalid', 'input-error'); });

      let isValid = true;
      let firstInvalid = null;

      if (!title || title.length < 3) {
        if (titleErr) titleErr.textContent = 'Proposal title must be at least 3 characters.';
        if (titleEl) titleEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = titleEl;
      }

      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!proponent) {
        if (propErr) propErr.textContent = 'Proponent / resident name is required.';
        if (propEl) propEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = propEl;
      } else if (!nameRegex.test(proponent)) {
        if (propErr) propErr.textContent = 'Proponent name must contain letters and spaces only. No numbers or special characters.';
        if (propEl) propEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = propEl;
      }

      const budgetNum = parseFloat(budget.replace(/[^\d.]/g, ''));
      if (!budget || isNaN(budgetNum) || budgetNum <= 0) {
        if (budgetErr) budgetErr.textContent = 'Estimated budget must be a positive numeric amount greater than 0.';
        if (budgetEl) budgetEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = budgetEl;
      }

      if (!description || description.length < 10) {
        if (descErr) descErr.textContent = 'Please provide a descriptive scope (at least 10 characters).';
        if (descEl) descEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = descEl;
      }

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        showAdminToast('Validation Error', 'Please correct the highlighted proposal fields.', 'danger');
        return;
      }

      const formattedBudget = `₱${budgetNum.toLocaleString()}`;
      const nextNum = citizenProposals.length + 1;
      const newId = `PROP-2026-${String(nextNum).padStart(3, '0')}`;

      const newProposal = normalizeProposalRecord({
        id: newId,
        ref: newId,
        title: title,
        category: category,
        year: year,
        location: location,
        sitio: location,
        proponent: proponent,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        dateFiled: new Date().toISOString().split('T')[0],
        budget: formattedBudget,
        rawBudget: budgetNum,
        status: status,
        description: description,
        rationale: description
      });

      citizenProposals.unshift(newProposal);
      saveCitizenProposals();
      renderProposalsGrid();

      if (modalSubmitProp) {
        modalSubmitProp.classList.remove('active');
        document.getElementById('submitProposalForm')?.reset();
      }

      showAdminToast('Proposal Submitted', `"${title}" successfully recorded as ${newId}.`, 'success');
    });
  }

  // B. Projects Table Renderer & Dynamic Metrics Engine
  function renderProjectsTable() {
    // 1. Calculate project portfolio metrics dynamically
    const totalProjects = capitalProjects.length;
    const projSectionSub = document.querySelector('#viewProjects .section-sub');
    if (projSectionSub) {
      projSectionSub.textContent = `Comprehensive tracking of all ${totalProjects} infrastructure, technology, and public works project${totalProjects === 1 ? '' : 's'} in Barangay Pallocan West`;
    }
    const ongoingList = capitalProjects.filter(p => p.status === 'ongoing');
    const completedList = capitalProjects.filter(p => p.status === 'completed');
    const planningList = capitalProjects.filter(p => p.status === 'planning');
    const delayedList = capitalProjects.filter(p => p.status === 'delayed');

    const parseBudget = (bStr) => {
      if (!bStr) return 0;
      const clean = String(bStr).replace(/[^0-9.]/g, '');
      return parseFloat(clean) || 0;
    };

    const formatCurrency = (val) => {
      return '₱' + Number(val).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const ongoingBudget = ongoingList.reduce((acc, p) => acc + parseBudget(p.budget), 0);
    const completedBudget = completedList.reduce((acc, p) => acc + parseBudget(p.budget), 0);
    const planningBudget = planningList.reduce((acc, p) => acc + parseBudget(p.budget), 0);
    const delayedBudget = delayedList.reduce((acc, p) => acc + parseBudget(p.budget), 0);
    const totalBudget = capitalProjects.reduce((acc, p) => acc + parseBudget(p.budget), 0);

    // Update Project Metric Summary Cards
    const elOngoing = document.getElementById('projMetricCountOngoing');
    if (elOngoing) elOngoing.textContent = ongoingList.length;
    const elOngoingSub = document.getElementById('projMetricSubOngoing');
    if (elOngoingSub) elOngoingSub.textContent = `${formatCurrency(ongoingBudget)} · Active in execution`;

    const elCompleted = document.getElementById('projMetricCountCompleted');
    if (elCompleted) elCompleted.textContent = completedList.length;
    const elCompletedSub = document.getElementById('projMetricSubCompleted');
    if (elCompletedSub) elCompletedSub.textContent = `${formatCurrency(completedBudget)} · Turned over & in service`;

    const elPlanning = document.getElementById('projMetricCountPlanning');
    if (elPlanning) elPlanning.textContent = planningList.length;
    const elPlanningSub = document.getElementById('projMetricSubPlanning');
    if (elPlanningSub) elPlanningSub.textContent = `${formatCurrency(planningBudget)} · Pre-procurement`;

    const elDelayed = document.getElementById('projMetricCountDelayed');
    if (elDelayed) elDelayed.textContent = delayedList.length;
    const elDelayedSub = document.getElementById('projMetricSubDelayed');
    if (elDelayedSub) elDelayedSub.textContent = `${formatCurrency(delayedBudget)} · Pending clearance`;

    const elTotalBudgetValue = document.getElementById('projectTotalBudgetValue');
    if (elTotalBudgetValue) elTotalBudgetValue.textContent = formatCurrency(totalBudget);

    // Update Filter Pill Counters
    const elPillAll = document.getElementById('projPillAll');
    if (elPillAll) elPillAll.textContent = totalProjects;
    const elPillOngoing = document.getElementById('projPillOngoing');
    if (elPillOngoing) elPillOngoing.textContent = ongoingList.length;
    const elPillCompleted = document.getElementById('projPillCompleted');
    if (elPillCompleted) elPillCompleted.textContent = completedList.length;
    const elPillPlanning = document.getElementById('projPillPlanning');
    if (elPillPlanning) elPillPlanning.textContent = planningList.length;
    const elPillDelayed = document.getElementById('projPillDelayed');
    if (elPillDelayed) elPillDelayed.textContent = delayedList.length;

    const elNavCounterProjects = document.getElementById('navCounterProjects');
    if (elNavCounterProjects) elNavCounterProjects.textContent = totalProjects;

    const selectedYear = document.getElementById('dashboardFiscalYearSelect')?.value || '2026';
    if (REPORTS_ANALYTICS_DATA['2026']?.projectStatus) {
      REPORTS_ANALYTICS_DATA['2026'].projectStatus.data = [
        ongoingList.length,
        completedList.length,
        delayedList.length,
        planningList.length
      ];
    }
    if (selectedYear === '2026') {
      if (repProjectStatusChart) {
        repProjectStatusChart.data.datasets[0].data = [
          ongoingList.length,
          completedList.length,
          delayedList.length,
          planningList.length
        ];
        repProjectStatusChart.update();
      }
      const repProjLegend = document.getElementById('repProjectLegend');
      if (repProjLegend) {
        repProjLegend.innerHTML = `
          <span class="legend-chip"><span class="legend-dot" style="background:#2563eb;"></span> Ongoing: <strong>${ongoingList.length}</strong></span>
          <span class="legend-chip"><span class="legend-dot" style="background:#10b981;"></span> Completed: <strong>${completedList.length}</strong></span>
          <span class="legend-chip"><span class="legend-dot" style="background:#e11d48;"></span> Delayed: <strong>${delayedList.length}</strong></span>
          <span class="legend-chip"><span class="legend-dot" style="background:#94a3b8;"></span> Planning: <strong>${planningList.length}</strong></span>
        `;
      }
    }

    if (typeof updateDashboardStatsCards === 'function') {
      updateDashboardStatsCards(selectedYear);
    }

    // 2. Render Projects Table Body
    const tbody = document.getElementById('projectsTableBody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('projectsSearchInput')?.value || '').toLowerCase().trim();
    const filtered = capitalProjects.filter(p => {
      const matchFilter = currentProjectFilter === 'all' || p.status === currentProjectFilter;
      const matchSearch = !searchTerm ||
        p.code.toLowerCase().includes(searchTerm) ||
        p.title.toLowerCase().includes(searchTerm) ||
        p.location.toLowerCase().includes(searchTerm) ||
        p.contractor.toLowerCase().includes(searchTerm);
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #94a3b8; padding: 24px;">No capital projects found.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(p => {
      const pct = clampProjectProgress(p.progress);
      const statusKey = (p.status === 'delayed' && pct < 100)
        ? 'delayed'
        : calculateProjectStatusFromProgress(pct);
      p.progress = pct;
      p.status = statusKey;

      let badgeClass = 'blue';
      let barColor = '#0d47a1';
      if (statusKey === 'completed') {
        badgeClass = 'green';
        barColor = '#16a34a';
      } else if (statusKey === 'delayed') {
        badgeClass = 'red';
        barColor = '#dc2626';
      } else if (statusKey === 'planning') {
        badgeClass = 'yellow';
        barColor = '#d97706';
      }

      const canMarkDelayed = pct < 100 && statusKey !== 'delayed';

      return `
        <tr>
          <td><code>${escapeHtml(p.code)}</code></td>
          <td><strong>${escapeHtml(p.title)}</strong><br><small style="color: #64748b;">${escapeHtml(p.contractor)}</small></td>
          <td>${escapeHtml(p.location)}</td>
          <td><small>${escapeHtml(p.timeline)}</small></td>
          <td><strong>${escapeHtml(p.budget)}</strong></td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="flex: 1; height: 6px; background: #e2e8f0; border-radius: 4px; overflow: hidden; min-width: 50px;" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
                <div style="width: ${pct}%; height: 100%; background: ${barColor}; transition: width 0.25s ease, background-color 0.25s ease;"></div>
              </div>
              <span style="font-weight: 700; font-size: 11px; min-width: 30px; text-align: right;">${pct}%</span>
            </div>
          </td>
          <td><span class="badge-status ${badgeClass}">${escapeHtml(statusKey.toUpperCase())}</span></td>
          <td class="text-right">
            <div class="table-actions">
              ${canMarkDelayed ? `<button type="button" class="btn-table-action danger-text" onclick="window.markProjectDelayed('${p.code}')" title="Mark project as behind schedule">Delayed</button>` : ''}
              <button type="button" class="btn-table-action${pct < 100 ? ' primary' : ''}" onclick="window.advanceProjectProgress('${p.code}')">+ Progress</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.advanceProjectProgress = function(code) {
    const proj = capitalProjects.find(p => p.code === code);
    if (!proj) return;
    const currentPct = clampProjectProgress(proj.progress);
    if (currentPct < 100) {
      const previousStatus = proj.status;
      const updatedPct = clampProjectProgress(currentPct + 15);
      const updatedStatus = calculateProjectStatusFromProgress(updatedPct);

      proj.progress = updatedPct;
      proj.status = updatedStatus;
      saveCapitalProjects();
      renderProjectsTable();

      const statusNote = previousStatus !== updatedStatus
        ? ` Status updated from ${previousStatus.toUpperCase()} to ${updatedStatus.toUpperCase()}.`
        : ` Status: ${updatedStatus.toUpperCase()}.`;
      showAdminToast('Project Updated', `${proj.title} advanced to ${updatedPct}%.${statusNote}`, 'success');
    } else {
      proj.progress = 100;
      proj.status = 'completed';
      saveCapitalProjects();
      renderProjectsTable();
      showAdminToast('Project Finished', `${proj.title} is already 100% completed.`, 'info');
    }
  };

  window.markProjectDelayed = function(code) {
    const proj = capitalProjects.find(p => p.code === code);
    if (!proj) return;
    const currentPct = clampProjectProgress(proj.progress);
    if (currentPct >= 100) {
      showAdminToast('Project Finished', `${proj.title} is already 100% completed and cannot be marked delayed.`, 'info');
      return;
    }
    proj.status = 'delayed';
    saveCapitalProjects();
    renderProjectsTable();
    showAdminToast('Marked Delayed', `${proj.title} marked as DELAYED (${currentPct}%). Advancing progress will recalculate its status.`, 'warning');
  };

  // C. Announcements Table Renderer & Dynamic Metrics Engine
  function renderAnnouncementsTable() {
    const tbody = document.getElementById('announcementsTableBody');
    if (!tbody) return;

    // 1. Calculate announcement metrics dynamically
    const totalCount = announcementsList.length;
    const criticalCount = announcementsList.filter(a => !!a.isCritical).length;
    const activeCount = announcementsList.filter(a => a.status === 'Active').length;
    const archivedCount = announcementsList.filter(a => a.status === 'Archived').length;

    const elTotal = document.getElementById('annMetricTotalCount');
    const elCrit = document.getElementById('annMetricCriticalCount');
    const elActive = document.getElementById('annMetricActiveCount');
    const elArch = document.getElementById('annMetricArchivedCount');
    if (elTotal) elTotal.textContent = totalCount;
    if (elCrit) elCrit.textContent = criticalCount;
    if (elActive) elActive.textContent = activeCount;
    if (elArch) elArch.textContent = archivedCount;

    // 2. Filter logic
    const searchTerm = (document.getElementById('announcementsSearchInput')?.value || '').toLowerCase().trim();
    const filtered = announcementsList.filter(a => {
      let matchFilter = true;
      if (currentAnnouncementFilter === 'all') {
        matchFilter = true;
      } else if (currentAnnouncementFilter === 'Critical') {
        matchFilter = !!a.isCritical;
      } else if (currentAnnouncementFilter === 'active') {
        matchFilter = a.status === 'Active';
      } else if (currentAnnouncementFilter === 'archived') {
        matchFilter = a.status === 'Archived';
      } else {
        matchFilter = a.category === currentAnnouncementFilter;
      }

      const matchSearch = !searchTerm ||
        a.id.toLowerCase().includes(searchTerm) ||
        a.title.toLowerCase().includes(searchTerm) ||
        a.audience.toLowerCase().includes(searchTerm);
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #94a3b8; padding: 28px; font-weight: 500;">No announcements or advisories matching criteria.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(a => {
      let badgeClass = 'blue';
      if (a.category === 'Emergency') badgeClass = 'red';
      if (a.category === 'Health') badgeClass = 'yellow';

      return `
        <tr style="${a.isCritical ? 'background: #fff8f8;' : ''}">
          <td><code>${escapeHtml(a.id)}</code></td>
          <td>
            ${a.isCritical ? '<div style="margin-bottom: 3px;"><span class="badge-critical-mini">🚨 CRITICAL ADVISORY</span></div>' : ''}
            <strong>${escapeHtml(a.title)}</strong><br>
            <small style="color: #64748b;">${escapeHtml(truncate(a.content, 75))}</small>
          </td>
          <td>
            ${a.isCritical ?
              `<span class="badge-status badge-critical-pill"><span class="status-dot dot-red"></span>Critical Advisory</span>` :
              `<span class="badge-status badge-standard-pill"><span class="dot-gray"></span>Standard</span>`
            }
          </td>
          <td><span class="badge-status ${badgeClass}">${escapeHtml(a.category)}</span></td>
          <td>${escapeHtml(a.audience)}</td>
          <td>${escapeHtml(a.date)}</td>
          <td><span class="badge-status ${a.status === 'Active' ? 'green' : 'yellow'}">${escapeHtml(a.status)}</span></td>
          <td class="text-right">
            <div style="display: inline-flex; align-items: center; gap: 6px; justify-content: flex-end;">
              <button type="button" class="btn-table-action ${a.isCritical ? 'btn-priority-labeled' : 'btn-priority-label'}" onclick="window.toggleAnnouncementPriority('${a.id}')" title="${a.isCritical ? 'Click to remove Critical Priority label' : 'Click to label as Critical Priority / Emergency Advisory'}">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: -1px; margin-right: 3px;">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                ${a.isCritical ? 'Remove Critical' : 'Mark Critical'}
              </button>
              <button type="button" class="btn-table-action" onclick="window.toggleAnnouncementStatus('${a.id}')">${a.status === 'Active' ? 'Archive' : 'Activate'}</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.toggleAnnouncementPriority = function(id) {
    const ann = announcementsList.find(a => a.id === id);
    if (!ann) return;
    ann.isCritical = !ann.isCritical;
    try {
      localStorage.setItem('brgy360_announcements', JSON.stringify(announcementsList));
    } catch (e) {
      console.warn('Failed saving to localStorage', e);
    }
    renderAnnouncementsTable();
    if (ann.isCritical) {
      showAdminToast('Critical Priority Labeled', `"${ann.title}" is now labeled as Critical Priority / Emergency Advisory.`, 'warning');
    } else {
      showAdminToast('Standard Priority', `"${ann.title}" priority reverted to Standard Advisory.`, 'info');
    }
  };

  window.toggleAnnouncementStatus = function(id) {
    const ann = announcementsList.find(a => a.id === id);
    if (!ann) return;
    ann.status = ann.status === 'Active' ? 'Archived' : 'Active';
    try {
      localStorage.setItem('brgy360_announcements', JSON.stringify(announcementsList));
    } catch (e) {
      console.warn('Failed saving to localStorage', e);
    }
    renderAnnouncementsTable();
    showAdminToast('Announcement Status', `"${ann.title}" set to ${ann.status}.`, 'info');
  };

  // Event Listeners for Proposals Filters
  document.querySelectorAll('#proposalsFilterGroup .filter-pill').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#proposalsFilterGroup .filter-pill').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentProposalFilter = this.getAttribute('data-status');
      renderProposalsTable();
    });
  });

  // Click on any of the 4 Proposals Metric Cards to filter directly
  const metricCardStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected'];
  document.querySelectorAll('#proposalMetricsBar .proposal-metric-card').forEach((card, idx) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const targetStatus = metricCardStatuses[idx];
      const targetPill = document.querySelector(`#proposalsFilterGroup .filter-pill[data-status="${targetStatus}"]`);
      if (targetPill) targetPill.click();
    });
  });

  const propSearch = document.getElementById('proposalsSearchInput');
  if (propSearch) propSearch.addEventListener('input', renderProposalsTable);

  // Projects Filters
  document.querySelectorAll('#projectsStatusFilterGroup .filter-pill').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#projectsStatusFilterGroup .filter-pill').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentProjectFilter = this.getAttribute('data-status');
      renderProjectsTable();
    });
  });

  document.querySelectorAll('#projectMetricsBar .proposal-metric-card').forEach(card => {
    card.addEventListener('click', function() {
      const status = this.getAttribute('data-status');
      if (!status) return;
      const targetPill = document.querySelector(`#projectsStatusFilterGroup .filter-pill[data-status="${status}"]`);
      if (targetPill) targetPill.click();
    });
  });

  const projSearch = document.getElementById('projectsSearchInput');
  if (projSearch) projSearch.addEventListener('input', renderProjectsTable);

  // Announcements Filters
  document.querySelectorAll('#announcementsFilterGroup .filter-pill').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#announcementsFilterGroup .filter-pill').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentAnnouncementFilter = this.getAttribute('data-category');
      renderAnnouncementsTable();
    });
  });

  // Announcements Metric Cards Click Handlers
  document.querySelectorAll('#announcementMetricsBar .proposal-metric-card').forEach(card => {
    card.addEventListener('click', function() {
      const cat = this.getAttribute('data-category');
      if (!cat) return;
      const targetPill = document.querySelector(`#announcementsFilterGroup .filter-pill[data-category="${cat}"]`);
      if (targetPill) {
        targetPill.click();
      } else {
        document.querySelectorAll('#announcementsFilterGroup .filter-pill').forEach(b => b.classList.remove('active'));
        currentAnnouncementFilter = cat;
        renderAnnouncementsTable();
      }
    });
  });

  const annSearch = document.getElementById('announcementsSearchInput');
  if (annSearch) annSearch.addEventListener('input', renderAnnouncementsTable);

  // New Announcement Modal Triggers & Priority Toggle Card
  const btnOpenNewAnnModal = document.getElementById('btnOpenNewAnnouncementModal');
  const modalNewAnn = document.getElementById('newAnnouncementModal');
  const btnCloseNewAnnModal = document.getElementById('btnCloseNewAnnModal');
  const btnCancelNewAnn = document.getElementById('btnCancelNewAnn');
  const btnSubmitNewAnn = document.getElementById('btnSubmitNewAnn');
  const btnToggleCriticalPriority = document.getElementById('btnToggleCriticalPriority');
  const annIsCriticalInput = document.getElementById('annIsCritical');
  const criticalToggleBadge = document.getElementById('criticalToggleBadge');

  function setModalPriorityState(isCritical) {
    if (!btnToggleCriticalPriority || !annIsCriticalInput || !criticalToggleBadge) return;
    if (isCritical) {
      btnToggleCriticalPriority.classList.add('is-critical');
      annIsCriticalInput.value = 'true';
      criticalToggleBadge.innerHTML = '<span class="status-dot dot-red"></span><span class="badge-text">🚨 Critical Priority</span>';
      const catSelect = document.getElementById('annCategory');
      if (catSelect && catSelect.value === 'Health') {
        catSelect.value = 'Emergency';
      }
    } else {
      btnToggleCriticalPriority.classList.remove('is-critical');
      annIsCriticalInput.value = 'false';
      criticalToggleBadge.innerHTML = '<span class="dot-gray"></span><span class="badge-text">Standard</span>';
    }
  }

  if (btnToggleCriticalPriority) {
    btnToggleCriticalPriority.addEventListener('click', () => {
      const currentlyCritical = annIsCriticalInput?.value === 'true';
      setModalPriorityState(!currentlyCritical);
    });
  }

  if (btnOpenNewAnnModal) {
    btnOpenNewAnnModal.addEventListener('click', () => {
      setModalPriorityState(false);
      modalNewAnn?.classList.add('active');
    });
  }
  if (btnCloseNewAnnModal) {
    btnCloseNewAnnModal.addEventListener('click', () => {
      setModalPriorityState(false);
      modalNewAnn?.classList.remove('active');
    });
  }
  if (btnCancelNewAnn) {
    btnCancelNewAnn.addEventListener('click', () => {
      setModalPriorityState(false);
      modalNewAnn?.classList.remove('active');
    });
  }

  // Real-time input clearing for Announcement Form
  const annTitleInput = document.getElementById('annTitle');
  const annContentInput = document.getElementById('annContent');

  if (annTitleInput) {
    annTitleInput.addEventListener('input', function () {
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('annTitleError');
      if (err) err.textContent = '';
    });
  }

  if (annContentInput) {
    annContentInput.addEventListener('input', function () {
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('annContentError');
      if (err) err.textContent = '';
    });
  }

  if (btnSubmitNewAnn) {
    btnSubmitNewAnn.addEventListener('click', () => {
      const titleEl = document.getElementById('annTitle');
      const catEl = document.getElementById('annCategory');
      const audEl = document.getElementById('annAudience');
      const contentEl = document.getElementById('annContent');

      const title = (titleEl?.value || '').trim();
      const cat = catEl?.value || 'General';
      const aud = audEl?.value || 'All Residents';
      const content = (contentEl?.value || '').trim();
      const isCritical = annIsCriticalInput?.value === 'true';

      const titleErr = document.getElementById('annTitleError');
      const contentErr = document.getElementById('annContentError');

      [titleErr, contentErr].forEach(e => { if (e) e.textContent = ''; });
      [titleEl, contentEl].forEach(e => { if (e) e.classList.remove('is-invalid', 'input-error'); });

      let isValid = true;
      let firstInvalid = null;

      if (!title || title.length < 3) {
        if (titleErr) titleErr.textContent = 'Please enter an announcement headline (at least 3 characters).';
        if (titleEl) titleEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = titleEl;
      }

      if (!content || content.length < 10) {
        if (contentErr) contentErr.textContent = 'Please provide detailed announcement content (at least 10 characters).';
        if (contentEl) contentEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = contentEl;
      }

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        showAdminToast('Validation Error', 'Please complete all required fields.', 'danger');
        return;
      }

      const newId = `ANN-2026-${String(announcementsList.length + 9).padStart(2, '0')}`;
      announcementsList.unshift({
        id: newId,
        title: title,
        category: cat,
        audience: aud,
        date: new Date().toISOString().slice(0, 10),
        status: 'Active',
        isCritical: isCritical,
        content: content
      });

      try {
        localStorage.setItem('brgy360_announcements', JSON.stringify(announcementsList));
      } catch (e) {
        console.warn('Failed saving to localStorage', e);
      }

      renderAnnouncementsTable();
      modalNewAnn?.classList.remove('active');
      document.getElementById('newAnnouncementForm')?.reset();
      setModalPriorityState(false);

      if (isCritical) {
        showAdminToast('🚨 Critical Emergency Broadcast', `Advisory ${newId} marked with Critical Priority & published to resident alerts.`, 'warning');
      } else {
        showAdminToast('Broadcast Published', `Notice ${newId} published to resident portals.`, 'success');
      }
    });
  }

  // New Project Modal Triggers
  const btnNewProjectModal = document.getElementById('btnNewProjectModal');
  const modalNewProj = document.getElementById('newProjectModal');
  const btnCloseNewProjModal = document.getElementById('btnCloseNewProjModal');
  const btnCancelNewProj = document.getElementById('btnCancelNewProj');
  const btnSubmitNewProj = document.getElementById('btnSubmitNewProj');
  const projStatusSelect = document.getElementById('projStatus');
  const projProgressInput = document.getElementById('projProgress');

  function syncNewProjectModalStatusFromProgress() {
    if (!projProgressInput || !projStatusSelect) return;
    const rawVal = projProgressInput.value;
    const pct = rawVal === '' ? 0 : clampProjectProgress(rawVal);
    projStatusSelect.value = calculateProjectStatusFromProgress(pct);
  }

  if (projProgressInput) {
    projProgressInput.addEventListener('input', syncNewProjectModalStatusFromProgress);
    projProgressInput.addEventListener('change', function () {
      const pct = this.value === '' ? 0 : clampProjectProgress(this.value);
      this.value = String(pct);
      syncNewProjectModalStatusFromProgress();
    });
  }

  if (projStatusSelect && projProgressInput) {
    projStatusSelect.addEventListener('change', function () {
      const selected = this.value;
      const pct = projProgressInput.value === '' ? 0 : clampProjectProgress(projProgressInput.value);
      if (selected === 'completed') {
        projProgressInput.value = '100';
      } else if (selected === 'ongoing' && (pct < 25 || pct === 100)) {
        projProgressInput.value = '25';
      } else if (selected === 'planning' && pct >= 25) {
        projProgressInput.value = '0';
      } else if (selected === 'delayed' && pct === 100) {
        projProgressInput.value = '85';
      }
    });
  }

  if (btnNewProjectModal) {
    btnNewProjectModal.addEventListener('click', () => {
      syncNewProjectModalStatusFromProgress();
      modalNewProj?.classList.add('active');
    });
  }
  if (btnCloseNewProjModal) btnCloseNewProjModal.addEventListener('click', () => modalNewProj?.classList.remove('active'));
  if (btnCancelNewProj) btnCancelNewProj.addEventListener('click', () => modalNewProj?.classList.remove('active'));

  // Real-time restrictions and clearing for Project Form
  const projBudgetInput = document.getElementById('projBudget');
  const projTitleInput = document.getElementById('projTitle');
  const projDescInput = document.getElementById('projDesc');

  if (projBudgetInput) {
    projBudgetInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '');
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('projBudgetError');
      if (err) err.textContent = '';
    });
  }

  if (projTitleInput) {
    projTitleInput.addEventListener('input', function () {
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('projTitleError');
      if (err) err.textContent = '';
    });
  }

  if (projDescInput) {
    projDescInput.addEventListener('input', function () {
      this.classList.remove('is-invalid', 'input-error');
      const err = document.getElementById('projDescError');
      if (err) err.textContent = '';
    });
  }

  if (btnSubmitNewProj) {
    btnSubmitNewProj.addEventListener('click', () => {
      const titleEl = document.getElementById('projTitle');
      const locEl = document.getElementById('projLocation');
      const budgetEl = document.getElementById('projBudget');
      const statusEl = document.getElementById('projStatus');
      const progressEl = document.getElementById('projProgress');
      const descEl = document.getElementById('projDesc');

      const title = (titleEl?.value || '').trim();
      const loc = (locEl?.value || '').trim();
      const budget = (budgetEl?.value || '').trim();
      const rawProgress = progressEl && progressEl.value !== '' ? progressEl.value : '0';
      const progress = clampProjectProgress(rawProgress);
      const requestedStatus = (statusEl?.value || '').toLowerCase();
      const status = (requestedStatus === 'delayed' && progress < 100)
        ? 'delayed'
        : calculateProjectStatusFromProgress(progress);
      const desc = (descEl?.value || '').trim();

      const titleErr = document.getElementById('projTitleError');
      const budgetErr = document.getElementById('projBudgetError');
      const descErr = document.getElementById('projDescError');

      [titleErr, budgetErr, descErr].forEach(e => { if (e) e.textContent = ''; });
      [titleEl, budgetEl, descEl].forEach(e => { if (e) e.classList.remove('is-invalid', 'input-error'); });

      let isValid = true;
      let firstInvalid = null;

      if (!title || title.length < 3) {
        if (titleErr) titleErr.textContent = 'Project title must be at least 3 characters.';
        if (titleEl) titleEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = titleEl;
      }

      const budgetNum = parseFloat(budget.replace(/[^\d.]/g, ''));
      if (!budget || isNaN(budgetNum) || budgetNum <= 0) {
        if (budgetErr) budgetErr.textContent = 'Budget must be numeric and greater than 0.';
        if (budgetEl) budgetEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = budgetEl;
      }

      if (!desc || desc.length < 10) {
        if (descErr) descErr.textContent = 'Project scope must be at least 10 characters.';
        if (descEl) descEl.classList.add('is-invalid');
        isValid = false;
        if (!firstInvalid) firstInvalid = descEl;
      }

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        showAdminToast('Validation Error', 'Please correct the highlighted project fields.', 'danger');
        return;
      }

      const newCode = `PRJ-2026-${String(capitalProjects.length + 1).padStart(2, '0')}`;
      const formattedBudget = '₱' + budgetNum.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      capitalProjects.push({
        code: newCode,
        title: title,
        description: desc,
        location: loc,
        timeline: '2026-10-15 – 2027-04-30',
        year: '2026',
        budget: formattedBudget,
        progress: progress,
        status: status,
        contractor: desc
      });

      saveCapitalProjects();
      renderProjectsTable();
      modalNewProj?.classList.remove('active');
      document.getElementById('newProjectForm')?.reset();
      syncNewProjectModalStatusFromProgress();
      showAdminToast('Project Added', `Project ${newCode} recorded under AIP (${progress}% · ${status.toUpperCase()}).`, 'success');
    });
  }

  // Settings Save Trigger
  const btnSaveAdminSettings = document.getElementById('btnSaveAdminSettings');
  if (btnSaveAdminSettings) {
    btnSaveAdminSettings.addEventListener('click', () => {
      showAdminToast('Settings Preserved', 'Governance Console preferences saved successfully.', 'success');
    });
  }

  // ==============================================================
  // 11. BUDGET ALLOCATION & EXPENSE RECORDS (ADMIN PORTAL)
  // ==============================================================
  function formatPHP(amount) {
    return '₱' + Number(amount || 0).toLocaleString('en-PH');
  }

  function updateBudgetMetricCards(selectedYear, filtered) {
    const elTotal = document.getElementById('bgtMetricTotal');
    const elSpent = document.getElementById('bgtMetricSpent');
    const elRemaining = document.getElementById('bgtMetricRemaining');
    const elUtil = document.getElementById('bgtMetricUtil');
    const elBadge = document.getElementById('bgtMetricUtilBadge');
    const elYearBadge = document.getElementById('bgtMetricYearBadge');

    if (!elTotal) return;

    if (elYearBadge) {
      elYearBadge.innerHTML = `<span class="status-dot dot-blue"></span> ${selectedYear === 'all' ? 'All Fiscal Years' : 'FY ' + selectedYear}`;
    }

    const recordsToSum = (filtered && filtered.length > 0) ? filtered : adminBudgetRecords;
    const totalBudget = recordsToSum.reduce((sum, r) => sum + (Number(r.budget) || 0), 0);
    const totalSpent = recordsToSum.reduce((sum, r) => sum + (Number(r.actual) || 0), 0);
    const remaining = Math.max(0, totalBudget - totalSpent);
    const utilRate = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    elTotal.textContent = formatPHP(totalBudget);
    elSpent.textContent = formatPHP(totalSpent);
    elRemaining.textContent = formatPHP(remaining);
    elUtil.textContent = utilRate + '%';

    if (elBadge) {
      if (utilRate >= 80) {
        elBadge.className = 'metric-badge badge-green';
        elBadge.style.background = '';
        elBadge.style.color = '';
        elBadge.innerHTML = `<span class="status-dot dot-green"></span> ${utilRate}% Rate`;
      } else if (utilRate >= 50) {
        elBadge.className = 'metric-badge badge-amber';
        elBadge.style.background = '';
        elBadge.style.color = '';
        elBadge.innerHTML = `<span class="status-dot dot-amber"></span> ${utilRate}% Rate`;
      } else {
        elBadge.className = 'metric-badge';
        elBadge.style.background = '#f1f5f9';
        elBadge.style.color = '#64748b';
        elBadge.innerHTML = `<span class="status-dot" style="background:#94a3b8;"></span> ${utilRate}% Rate`;
      }
    }

    // Dynamically update the 4 sectoral summary cards
    updateSectoralCards(selectedYear);
  }

  function updateSectoralCards(yearVal) {
    const records = adminBudgetRecords.filter(r => yearVal === 'all' || r.year === yearVal);
    const currentCatFilter = document.getElementById('adminBudgetCategoryFilter')?.value || 'all';

    const sectors = [
      { key: 'Infra', cat: 'Infrastructure', spentId: 'secSpentInfra', totalId: 'secTotalInfra', burnId: 'secBurnInfra', fillId: 'secFillInfra', cardId: 'secCardInfra' },
      { key: 'Health', cat: 'Health', spentId: 'secSpentHealth', totalId: 'secTotalHealth', burnId: 'secBurnHealth', fillId: 'secFillHealth', cardId: 'secCardHealth' },
      { key: 'Social', cat: 'Social Services', spentId: 'secSpentSocial', totalId: 'secTotalSocial', burnId: 'secBurnSocial', fillId: 'secFillSocial', cardId: 'secCardSocial' },
      { key: 'Admin', cat: 'Administration', spentId: 'secSpentAdmin', totalId: 'secTotalAdmin', burnId: 'secBurnAdmin', fillId: 'secFillAdmin', cardId: 'secCardAdmin' }
    ];

    sectors.forEach(s => {
      const sRecords = records.filter(r => r.category === s.cat);
      const bgt = sRecords.reduce((sum, r) => sum + (Number(r.budget) || 0), 0);
      const spent = sRecords.reduce((sum, r) => sum + (Number(r.actual) || 0), 0);
      const pct = bgt > 0 ? (spent / bgt) * 100 : 0;
      const pctFormatted = pct.toFixed(1) + '%';

      const elSpent = document.getElementById(s.spentId);
      const elTotal = document.getElementById(s.totalId);
      const elBurn = document.getElementById(s.burnId);
      const elFill = document.getElementById(s.fillId);
      const elCard = document.getElementById(s.cardId);

      if (elSpent) elSpent.textContent = formatPHP(spent);
      if (elTotal) elTotal.textContent = `/ ${formatPHP(bgt)} Cap`;
      if (elFill) {
        elFill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
        elFill.className = 'sec-fill ' + (pct >= 85 ? 'danger' : pct >= 50 ? 'normal' : 'success');
      }
      if (elBurn) {
        if (pct >= 85) {
          elBurn.textContent = `${pctFormatted} (Cap Risk)`;
          elBurn.className = 'sec-burn-tag danger';
          if (elCard) {
            elCard.classList.remove('surplus-accent');
            elCard.classList.add('warning-accent');
          }
        } else if (pct >= 50) {
          elBurn.textContent = `${pctFormatted} Spent`;
          elBurn.className = 'sec-burn-tag';
          if (elCard) {
            elCard.classList.remove('surplus-accent', 'warning-accent');
          }
        } else {
          elBurn.textContent = `${pctFormatted} (Surplus)`;
          elBurn.className = 'sec-burn-tag success';
          if (elCard) {
            elCard.classList.remove('warning-accent');
            elCard.classList.add('surplus-accent');
          }
        }
      }

      if (elCard) {
        if (currentCatFilter === s.cat) {
          elCard.classList.add('active-sector-filter');
        } else {
          elCard.classList.remove('active-sector-filter');
        }
      }
    });
  }

  function renderAdminBudgetTable() {
    const tbody = document.getElementById('adminBudgetTbody');
    if (!tbody) return;

    const searchInput = document.getElementById('adminBudgetSearchInput');
    const yearFilter = document.getElementById('adminBudgetYearFilter');
    const quarterFilter = document.getElementById('adminBudgetQuarterFilter');
    const categoryFilter = document.getElementById('adminBudgetCategoryFilter');
    const counterText = document.getElementById('adminBudgetCounterText');

    const searchVal = (searchInput?.value || '').toLowerCase().trim();
    const yearVal = yearFilter?.value || '2026';
    const quarterVal = quarterFilter?.value || 'all';
    const catVal = categoryFilter?.value || 'all';

    const filtered = adminBudgetRecords.filter(item => {
      const matchYear = (yearVal === 'all' || item.year === yearVal);
      const matchQuarter = (quarterVal === 'all' || item.quarter === quarterVal);
      const matchCategory = (catVal === 'all' || item.category === catVal);
      const matchSearch = !searchVal ||
        (item.category && item.category.toLowerCase().includes(searchVal)) ||
        (item.description && item.description.toLowerCase().includes(searchVal)) ||
        (item.year && item.year.toString().includes(searchVal)) ||
        (item.quarter && item.quarter.toLowerCase().includes(searchVal));

      return matchYear && matchQuarter && matchCategory && matchSearch;
    });

    if (counterText) {
      counterText.textContent = `Showing ${filtered.length} of ${adminBudgetRecords.length} budget allocation line items`;
    }

    updateBudgetMetricCards(yearVal, filtered);
    if (typeof updateDashboardStatsCards === 'function') {
      updateDashboardStatsCards(document.getElementById('dashboardFiscalYearSelect')?.value || '2026');
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="budget-empty-state-row">
            <div class="budget-empty-state-inner">
              <div class="budget-empty-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <strong style="color: #1e293b; font-size: 14px;">No budget records found</strong>
              <span style="font-size: 12.5px; color: #64748b;">No allocations matched your search or filter selection. Try resetting filters or add a new record.</span>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(item => {
      const budgetNum = Number(item.budget) || 0;
      const actualNum = Number(item.actual) || 0;
      const utilPct = budgetNum > 0 ? Math.round((actualNum / budgetNum) * 100) : 0;

      let utilClass = 'util-low';
      if (utilPct >= 80) {
        utilClass = 'util-high';
      } else if (utilPct >= 50) {
        utilClass = 'util-mid';
      } else if (utilPct === 0) {
        utilClass = 'util-low';
      }

      return `
        <tr data-record-id="${escapeHtml(item.id)}">
          <td class="col-year">${escapeHtml(item.year)}</td>
          <td><span class="quarter-pill">${escapeHtml(item.quarter)}</span></td>
          <td class="col-category">${escapeHtml(item.category)}</td>
          <td class="col-description">${escapeHtml(item.description)}</td>
          <td class="col-currency col-budget-val">${formatPHP(budgetNum)}</td>
          <td class="col-currency col-actual-val">${formatPHP(actualNum)}</td>
          <td class="col-util-val ${utilClass}">${utilPct}%</td>
          <td class="col-actions-center">
            <button type="button" class="btn-budget-action action-edit" data-id="${escapeHtml(item.id)}" title="Edit Record" aria-label="Edit Record">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button type="button" class="btn-budget-action action-delete" data-id="${escapeHtml(item.id)}" title="Delete Record" aria-label="Delete Record">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    attachBudgetRowActions();
  }

  function openAddBudgetModal() {
    const modal = document.getElementById('adminBudgetModal');
    const form = document.getElementById('adminBudgetForm');
    const title = document.getElementById('budgetModalTitle');
    const recordIdInput = document.getElementById('budgetRecordId');
    const yearInput = document.getElementById('budgetInputYear');
    const quarterInput = document.getElementById('budgetInputQuarter');
    const catInput = document.getElementById('budgetInputCategory');
    const descInput = document.getElementById('budgetInputDesc');
    const amountInput = document.getElementById('budgetInputAmount');
    const actualInput = document.getElementById('budgetInputActual');

    if (!modal) return;
    if (form) form.reset();

    // Reset errors
    ['budgetInputYearError', 'budgetInputDescError', 'budgetInputAmountError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    ['budgetInputYear', 'budgetInputDesc', 'budgetInputAmount'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('is-invalid', 'input-error');
    });

    if (title) title.textContent = 'Add Budget Record';
    if (recordIdInput) recordIdInput.value = '';
    if (yearInput) yearInput.value = '2026';
    if (quarterInput) quarterInput.value = 'Q1';
    if (catInput) catInput.value = 'Administration';
    if (actualInput) actualInput.value = '0';

    modal.classList.add('active');
    setTimeout(() => descInput?.focus(), 100);
  }

  function openEditBudgetModal(recordId) {
    const record = adminBudgetRecords.find(r => r.id === recordId);
    if (!record) return;

    const modal = document.getElementById('adminBudgetModal');
    const title = document.getElementById('budgetModalTitle');
    const recordIdInput = document.getElementById('budgetRecordId');
    const yearInput = document.getElementById('budgetInputYear');
    const quarterInput = document.getElementById('budgetInputQuarter');
    const catInput = document.getElementById('budgetInputCategory');
    const descInput = document.getElementById('budgetInputDesc');
    const amountInput = document.getElementById('budgetInputAmount');
    const actualInput = document.getElementById('budgetInputActual');

    if (!modal) return;

    // Reset errors
    ['budgetInputYearError', 'budgetInputDescError', 'budgetInputAmountError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    ['budgetInputYear', 'budgetInputDesc', 'budgetInputAmount'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('is-invalid', 'input-error');
    });

    if (title) title.textContent = 'Edit Budget Record';
    if (recordIdInput) recordIdInput.value = record.id;
    if (yearInput) yearInput.value = record.year || '2026';
    if (quarterInput) quarterInput.value = record.quarter || 'Q1';
    if (catInput) catInput.value = record.category || 'Administration';
    if (descInput) descInput.value = record.description || '';
    if (amountInput) amountInput.value = record.budget || 0;
    if (actualInput) actualInput.value = record.actual || 0;

    modal.classList.add('active');
    setTimeout(() => descInput?.focus(), 100);
  }

  function closeBudgetModal() {
    const modal = document.getElementById('adminBudgetModal');
    if (modal) modal.classList.remove('active');
    const form = document.getElementById('adminBudgetForm');
    if (form) form.reset();
    ['budgetInputYearError', 'budgetInputDescError', 'budgetInputAmountError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    ['budgetInputYear', 'budgetInputDesc', 'budgetInputAmount'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('is-invalid', 'input-error');
    });
  }

  function saveBudgetRecord() {
    const recordId = document.getElementById('budgetRecordId')?.value.trim();
    const yearEl = document.getElementById('budgetInputYear');
    const quarterEl = document.getElementById('budgetInputQuarter');
    const catEl = document.getElementById('budgetInputCategory');
    const descEl = document.getElementById('budgetInputDesc');
    const amountEl = document.getElementById('budgetInputAmount');
    const actualEl = document.getElementById('budgetInputActual');

    const year = (yearEl?.value || '').trim();
    const quarter = quarterEl?.value || 'Q1';
    const category = catEl?.value || 'Administration';
    const description = (descEl?.value || '').trim();
    const budgetRaw = (amountEl?.value || '').trim();
    const budget = parseFloat(budgetRaw) || 0;
    const actual = parseFloat(actualEl?.value || '0') || 0;

    const yearErr = document.getElementById('budgetInputYearError');
    const descErr = document.getElementById('budgetInputDescError');
    const amountErr = document.getElementById('budgetInputAmountError');

    [yearErr, descErr, amountErr].forEach(e => { if (e) e.textContent = ''; });
    [yearEl, descEl, amountEl].forEach(e => { if (e) e.classList.remove('is-invalid', 'input-error'); });

    let isValid = true;
    let firstInvalid = null;

    const yearNum = parseInt(year, 10);
    if (!year || isNaN(yearNum) || yearNum < 2020 || yearNum > 2035) {
      if (yearErr) yearErr.textContent = 'Please enter a valid 4-digit fiscal year between 2020 and 2035.';
      if (yearEl) yearEl.classList.add('is-invalid');
      isValid = false;
      if (!firstInvalid) firstInvalid = yearEl;
    }

    if (!description || description.length < 5) {
      if (descErr) descErr.textContent = 'Description must be at least 5 characters.';
      if (descEl) descEl.classList.add('is-invalid');
      isValid = false;
      if (!firstInvalid) firstInvalid = descEl;
    }

    if (!budgetRaw || isNaN(budget) || budget <= 0) {
      if (amountErr) amountErr.textContent = 'Budget amount must be a positive number greater than 0.';
      if (amountEl) amountEl.classList.add('is-invalid');
      isValid = false;
      if (!firstInvalid) firstInvalid = amountEl;
    }

    if (!isValid) {
      if (firstInvalid) firstInvalid.focus();
      showAdminToast('Validation Error', 'Please correct the highlighted budget fields.', 'danger');
      return;
    }

    if (recordId) {
      const index = adminBudgetRecords.findIndex(r => r.id === recordId);
      if (index !== -1) {
        adminBudgetRecords[index] = {
          ...adminBudgetRecords[index],
          year,
          quarter,
          category,
          description,
          budget,
          actual
        };
        showAdminToast('Budget Record Updated', `Line item ${recordId} updated successfully.`, 'success');
      }
    } else {
      const newId = `BGT-${year}-${String(adminBudgetRecords.length + 1).padStart(3, '0')}`;
      const newRecord = {
        id: newId,
        year,
        quarter,
        category,
        description,
        budget,
        actual
      };
      adminBudgetRecords.unshift(newRecord);
      showAdminToast('Budget Record Saved', `New allocation item ${newId} logged under ${category}.`, 'success');
    }

    saveAdminBudgetRecords();
    closeBudgetModal();
    renderAdminBudgetTable();
  }

  function deleteBudgetRecord(recordId) {
    const record = adminBudgetRecords.find(r => r.id === recordId);
    if (!record) return;

    if (confirm(`Are you sure you want to delete this budget record?\n\n"${record.description}" (${record.quarter} ${record.year} - ${formatPHP(record.budget)})`)) {
      adminBudgetRecords = adminBudgetRecords.filter(r => r.id !== recordId);
      saveAdminBudgetRecords();
      renderAdminBudgetTable();
      showAdminToast('Budget Record Removed', `Line item ${recordId} has been deleted.`, 'info');
    }
  }

  function exportBudgetCSV() {
    const searchInput = document.getElementById('adminBudgetSearchInput');
    const yearFilter = document.getElementById('adminBudgetYearFilter');
    const quarterFilter = document.getElementById('adminBudgetQuarterFilter');
    const categoryFilter = document.getElementById('adminBudgetCategoryFilter');

    const searchVal = (searchInput?.value || '').toLowerCase().trim();
    const yearVal = yearFilter?.value || '2026';
    const quarterVal = quarterFilter?.value || 'all';
    const catVal = categoryFilter?.value || 'all';

    const records = adminBudgetRecords.filter(item => {
      const matchYear = (yearVal === 'all' || item.year === yearVal);
      const matchQuarter = (quarterVal === 'all' || item.quarter === quarterVal);
      const matchCategory = (catVal === 'all' || item.category === catVal);
      const matchSearch = !searchVal ||
        (item.category && item.category.toLowerCase().includes(searchVal)) ||
        (item.description && item.description.toLowerCase().includes(searchVal));
      return matchYear && matchQuarter && matchCategory && matchSearch;
    });

    if (records.length === 0) {
      showAdminToast('No Records', 'No budget records available to export for the selected filter.', 'warning');
      return;
    }

    const headers = ['Record ID', 'Fiscal Year', 'Quarter', 'Sectoral Category', 'Description / Purpose', 'Budget (PHP)', 'Actual Spent (PHP)', 'Utilization Rate (%)'];
    const rows = records.map(r => {
      const b = Number(r.budget) || 0;
      const a = Number(r.actual) || 0;
      const u = b > 0 ? Math.round((a / b) * 100) : 0;
      return [
        r.id,
        r.year,
        r.quarter,
        `"${(r.category || '').replace(/"/g, '""')}"`,
        `"${(r.description || '').replace(/"/g, '""')}"`,
        b,
        a,
        `${u}%`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Barangay_Budget_Allocation_${yearVal}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAdminToast('Export Completed', `Exported ${records.length} budget allocation records to CSV.`, 'success');
  }

  function attachBudgetRowActions() {
    document.querySelectorAll('.btn-budget-action.action-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (id) openEditBudgetModal(id);
      });
    });

    document.querySelectorAll('.btn-budget-action.action-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (id) deleteBudgetRecord(id);
      });
    });
  }

  function initAdminBudgetModule() {
    const searchInput = document.getElementById('adminBudgetSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => renderAdminBudgetTable());
    }

    const yearFilter = document.getElementById('adminBudgetYearFilter');
    if (yearFilter) {
      yearFilter.addEventListener('change', () => renderAdminBudgetTable());
    }

    const quarterFilter = document.getElementById('adminBudgetQuarterFilter');
    if (quarterFilter) {
      quarterFilter.addEventListener('change', () => renderAdminBudgetTable());
    }

    const categoryFilter = document.getElementById('adminBudgetCategoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => renderAdminBudgetTable());
    }

    const resetBtn = document.getElementById('adminBudgetResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (yearFilter) yearFilter.value = '2026';
        if (quarterFilter) quarterFilter.value = 'all';
        if (categoryFilter) categoryFilter.value = 'all';
        renderAdminBudgetTable();
        showAdminToast('Filters Reset', 'Showing all Fiscal Year 2026 budget allocations.', 'info');
      });
    }

    const btnOpenAdd = document.getElementById('btnOpenAddBudgetModal');
    if (btnOpenAdd) {
      btnOpenAdd.addEventListener('click', openAddBudgetModal);
    }

    const btnExport = document.getElementById('btnExportBudgetReport');
    if (btnExport) {
      btnExport.addEventListener('click', exportBudgetCSV);
    }

    const btnCloseModal = document.getElementById('btnCloseBudgetModal');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', closeBudgetModal);
    }

    const btnCancelModal = document.getElementById('btnCancelBudgetModal');
    if (btnCancelModal) {
      btnCancelModal.addEventListener('click', closeBudgetModal);
    }

    const modal = document.getElementById('adminBudgetModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeBudgetModal();
      });
    }

    const btnSave = document.getElementById('btnSaveBudgetRecord');
    if (btnSave) {
      btnSave.addEventListener('click', (e) => {
        e.preventDefault();
        saveBudgetRecord();
      });
    }

    const form = document.getElementById('adminBudgetForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveBudgetRecord();
      });
    }

    // Real-time input clearing and restrictions for budget form
    const bgtAmtInput = document.getElementById('budgetInputAmount');
    const bgtYearInput = document.getElementById('budgetInputYear');
    const bgtDescInput = document.getElementById('budgetInputDesc');

    if (bgtAmtInput) {
      bgtAmtInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '');
        this.classList.remove('is-invalid', 'input-error');
        const err = document.getElementById('budgetInputAmountError');
        if (err) err.textContent = '';
      });
    }

    if (bgtYearInput) {
      bgtYearInput.addEventListener('input', function () {
        this.classList.remove('is-invalid', 'input-error');
        const err = document.getElementById('budgetInputYearError');
        if (err) err.textContent = '';
      });
    }

    if (bgtDescInput) {
      bgtDescInput.addEventListener('input', function () {
        this.classList.remove('is-invalid', 'input-error');
        const err = document.getElementById('budgetInputDescError');
        if (err) err.textContent = '';
      });
    }

    // Sector cards quick click-to-filter
    const sectorCards = [
      { id: 'secCardInfra', cat: 'Infrastructure' },
      { id: 'secCardHealth', cat: 'Health' },
      { id: 'secCardSocial', cat: 'Social Services' },
      { id: 'secCardAdmin', cat: 'Administration' }
    ];

    sectorCards.forEach(s => {
      const cardEl = document.getElementById(s.id);
      if (cardEl) {
        cardEl.addEventListener('click', () => {
          const categoryFilter = document.getElementById('adminBudgetCategoryFilter');
          if (!categoryFilter) return;

          if (categoryFilter.value === s.cat) {
            categoryFilter.value = 'all';
            showAdminToast('Filter Reset', 'Showing all sectoral categories in quarterly budget list.', 'info');
          } else {
            categoryFilter.value = s.cat;
            showAdminToast('Sector Filter', `Filtered quarterly budget ledger for ${s.cat}.`, 'info');
          }
          renderAdminBudgetTable();

          const tableCard = document.getElementById('adminQuarterlyBudgetListCard');
          if (tableCard) {
            tableCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    });

    renderAdminBudgetTable();
  }

  // ==============================================================
  // 11.B RESIDENT VERIFICATION & PRE-REGISTRATION WORKFLOW MODULE
  // ==============================================================

  function getInitials(name) {
    if (!name) return 'R';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function formatDobAndAge(dobStr, fallbackAge) {
    if (!dobStr) return `${fallbackAge || 30} yrs old`;
    try {
      const d = new Date(dobStr);
      if (isNaN(d.getTime())) return `${fallbackAge || 30} yrs old`;
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const formatted = d.toLocaleDateString('en-US', options);
      const diffMs = Date.now() - d.getTime();
      const ageDate = new Date(diffMs);
      const computedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      return `${formatted} (${computedAge} yrs old)`;
    } catch (e) {
      return `${fallbackAge || 30} yrs old`;
    }
  }

  function renderResidentVerificationTable() {
    const tableBody = document.getElementById('resVerificationTableBody');
    const table = document.getElementById('resVerificationTable');
    const emptyState = document.getElementById('resTableEmptyState');
    const countIndicator = document.getElementById('resTotalCountIndicator');

    if (!tableBody) return;

    const total = residentApplications.length;
    const pendingCount = residentApplications.filter(a => a.status === 'Pending').length;
    const verifiedCount = residentApplications.filter(a => a.status === 'Verified').length;
    const rejectedCount = residentApplications.filter(a => a.status === 'Rejected').length;

    // Update Top KPI Counters
    const kpiTotal = document.getElementById('kpiValTotalApps');
    const kpiPending = document.getElementById('kpiValPendingApps');
    const kpiVerified = document.getElementById('kpiValVerifiedApps');
    const kpiRejected = document.getElementById('kpiValRejectedApps');
    if (kpiTotal) kpiTotal.textContent = total.toString();
    if (kpiPending) kpiPending.textContent = pendingCount.toString();
    if (kpiVerified) kpiVerified.textContent = verifiedCount.toString();
    if (kpiRejected) kpiRejected.textContent = rejectedCount.toString();

    // Update Filter Pills Badges
    const countAll = document.getElementById('resCountAll');
    const countPending = document.getElementById('resCountPending');
    const countVerified = document.getElementById('resCountVerified');
    const countRejected = document.getElementById('resCountRejected');
    if (countAll) countAll.textContent = total.toString();
    if (countPending) countPending.textContent = pendingCount.toString();
    if (countVerified) countVerified.textContent = verifiedCount.toString();
    if (countRejected) countRejected.textContent = rejectedCount.toString();

    // Update Sidebar Navigation Badge
    const sidebarBadge = document.getElementById('sidebarPendingVerifBadge');
    if (sidebarBadge) {
      sidebarBadge.textContent = pendingCount.toString();
      sidebarBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }

    // Filter applications
    const searchLower = (currentResSearch || '').trim().toLowerCase();
    const filtered = residentApplications.filter(app => {
      // Status filter
      if (currentResStatusFilter !== 'all' && app.status.toLowerCase() !== currentResStatusFilter.toLowerCase()) {
        return false;
      }
      // Sitio filter
      if (currentResSitioFilter !== 'all' && app.sitio !== currentResSitioFilter) {
        return false;
      }
      // Search term
      if (searchLower) {
        const matchName = (app.fullName || '').toLowerCase().includes(searchLower);
        const matchEmail = (app.email || '').toLowerCase().includes(searchLower);
        const matchSitio = (app.sitio || '').toLowerCase().includes(searchLower);
        const matchAddress = (app.address || '').toLowerCase().includes(searchLower);
        const matchMobile = (app.mobile || '').includes(searchLower);
        const matchId = (app.id || '').toLowerCase().includes(searchLower);
        if (!matchName && !matchEmail && !matchSitio && !matchAddress && !matchMobile && !matchId) {
          return false;
        }
      }
      return true;
    });

    // Update Count Indicator
    if (countIndicator) {
      countIndicator.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${total}</strong> applications`;
    }

    // Render Table Content
    if (filtered.length === 0) {
      tableBody.innerHTML = '';
      if (table) table.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (table) table.style.display = 'table';
    if (emptyState) emptyState.style.display = 'none';

    tableBody.innerHTML = filtered.map(app => {
      const initials = getInitials(app.fullName);
      
      let statusClass = 'status-pending';
      let statusLabel = 'Pending';
      if (app.status === 'Verified') {
        statusClass = 'status-verified';
        statusLabel = 'Verified';
      } else if (app.status === 'Rejected') {
        statusClass = 'status-rejected';
        statusLabel = 'Rejected';
      }

      return `
        <tr data-app-id="${escapeHtml(app.id)}">
          <td>
            <div class="res-name-wrapper">
              <div class="res-avatar" aria-hidden="true">${initials}</div>
              <div class="res-name-info">
                <span class="res-name-title">${escapeHtml(app.fullName)}</span>
                <span class="res-email-sub">${escapeHtml(app.email)}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="res-address-cell">${escapeHtml(app.address)}</div>
          </td>
          <td>
            <span class="res-sitio-tag">${escapeHtml(app.sitio)}</span>
          </td>
          <td>
            <span class="res-mobile-cell">${escapeHtml(app.mobile)}</span>
          </td>
          <td>
            <span class="res-registered-cell">${escapeHtml(app.registeredDate)}</span>
          </td>
          <td>
            <span class="res-status-pill ${statusClass}">
              <span class="status-pill-dot"></span> ${statusLabel}
            </span>
          </td>
          <td style="text-align: center;">
            <button type="button" class="btn-res-view btn-view-res-modal" data-res-id="${escapeHtml(app.id)}" aria-label="View application details for ${escapeHtml(app.fullName)}">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>View</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function openResidentReviewModal(appId) {
    const app = residentApplications.find(a => a.id === appId);
    if (!app) return;

    currentReviewingResId = appId;

    // Helper: Split name handling suffixes (Jr., Sr., II, III, etc.)
    function parseNameWithSuffix(fullName) {
      const suffixes = ['JR.', 'JR', 'SR.', 'SR', 'II', 'III', 'IV', 'V'];
      const clean = (fullName || '').trim();
      const parts = clean.split(/\s+/);
      if (parts.length <= 1) {
        return { lastName: clean.toUpperCase(), givenName: clean.toUpperCase() };
      }
      let suffix = '';
      if (parts.length > 2 && suffixes.includes(parts[parts.length - 1].toUpperCase())) {
        suffix = parts.pop().toUpperCase();
      }
      const lastName = parts.pop().toUpperCase() + (suffix ? ' ' + suffix : '');
      const givenName = parts.join(' ').toUpperCase();
      return { lastName, givenName };
    }

    const gender = app.gender || (app.fullName.toLowerCase().includes('clarisse') || app.fullName.toLowerCase().includes('maria') || app.fullName.toLowerCase().includes('rhea') || app.fullName.toLowerCase().includes('lourdes') || app.fullName.toLowerCase().includes('carmela') ? 'Female' : 'Male');

    // Header & Meta
    const modalSub = document.getElementById('resReviewModalSub');
    if (modalSub) {
      modalSub.innerHTML = `Application ID: <strong id="resReviewAppId">${escapeHtml(app.id)}</strong> · Submitted on <span id="resReviewAppDate">${escapeHtml(app.registeredDate)}</span>`;
    }

    const statusBadge = document.getElementById('resReviewStatusBadge');
    if (statusBadge) {
      statusBadge.className = `res-status-pill status-${app.status.toLowerCase()}`;
      statusBadge.innerHTML = `<span class="status-pill-dot"></span> ${escapeHtml(app.status)} Application`;
    }

    // Basic Profile Details
    const avatarEl = document.getElementById('resReviewAvatar');
    if (avatarEl) avatarEl.textContent = getInitials(app.fullName);

    const nameLg = document.getElementById('resReviewFullName');
    if (nameLg) nameLg.textContent = app.fullName;

    const subChannel = document.getElementById('resReviewSubchannel');
    if (subChannel) subChannel.textContent = `${app.channel || 'Online Resident Portal'} · Submitted`;

    const dName = document.getElementById('resReviewDetailName');
    if (dName) dName.textContent = app.fullName;

    const dDob = document.getElementById('resReviewDetailDob');
    if (dDob) dDob.textContent = formatDobAndAge(app.dob, app.age);

    const dGender = document.getElementById('resReviewDetailGender');
    if (dGender) dGender.textContent = gender;

    const dCivil = document.getElementById('resReviewDetailCivil');
    if (dCivil) dCivil.textContent = app.civilStatus || 'Single';

    const dMobile = document.getElementById('resReviewDetailMobile');
    if (dMobile) dMobile.textContent = app.mobile;

    const dEmail = document.getElementById('resReviewDetailEmail');
    if (dEmail) dEmail.textContent = app.email;

    const dAddress = document.getElementById('resReviewDetailAddress');
    if (dAddress) dAddress.textContent = app.address;

    const dSitio = document.getElementById('resReviewDetailSitio');
    if (dSitio) dSitio.textContent = app.sitio;

    // Prior Rejection History Banner
    const rejBanner = document.getElementById('resReviewRejectionBanner');
    const rejReasonText = document.getElementById('resReviewRejectionReasonText');
    const rejNotesText = document.getElementById('resReviewRejectionNotesText');
    if (rejBanner) {
      if (app.status === 'Rejected') {
        rejBanner.style.display = 'block';
        if (rejReasonText) rejReasonText.textContent = app.rejectionReason || 'Criteria Unmet';
        if (rejNotesText) rejNotesText.textContent = app.rejectionNotes ? `Remarks: ${app.rejectionNotes}` : 'Application declined by civil registry administration.';
      } else {
        rejBanner.style.display = 'none';
      }
    }

    // Uploaded Documents Rendering
    const idTypeTag = document.getElementById('resReviewIdTypeTag');
    if (idTypeTag) idTypeTag.textContent = app.idType || 'Philippine National ID (PhilID)';

    const proofTypeTag = document.getElementById('resReviewProofTypeTag');
    if (proofTypeTag) {
      proofTypeTag.textContent = app.proofType && !app.proofType.includes('None')
        ? app.proofType
        : 'Optional Proof (Not Attached)';
    }

    // Populate Dynamic Graphic Text / Image in Document 1: Government ID
    const nameInfo = parseNameWithSuffix(app.fullName);
    const idPreviewBox = document.getElementById('resReviewIdPreviewBox');
    
    if (idPreviewBox) {
      if (app.idAttachmentData) {
        idPreviewBox.innerHTML = `
          <div class="res-uploaded-id-preview" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; background: #0f172a; border-radius: 8px; width: 100%;">
            <img src="${app.idAttachmentData}" alt="Submitted Government ID" style="max-height: 190px; max-width: 100%; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 14px rgba(0,0,0,0.5);">
            <div style="margin-top: 10px; font-size: 11.5px; color: #94a3b8; display: flex; align-items: center; justify-content: space-between; width: 100%;">
              <span style="font-weight: 600; color: #f8fafc;">📎 ${escapeHtml(app.idAttachmentName || 'Government ID Attachment')}</span>
              <span style="background: rgba(255,255,255,0.12); padding: 2px 8px; border-radius: 4px; font-size: 10.5px; color: #38bdf8;">Submitted ID File</span>
            </div>
          </div>
        `;
      } else {
        idPreviewBox.innerHTML = `
          <div class="res-id-graphic">
            <div class="res-id-graphic-header">
              <div>
                <div class="res-id-rep-title">Republika ng Pilipinas</div>
                <div class="res-id-doc-title" id="resGraphicIdTitle">${escapeHtml(app.idType.toUpperCase())}</div>
              </div>
              <div class="res-id-flag">🇵🇭</div>
            </div>
            <div class="res-id-graphic-body">
              <div class="res-id-photo-box" id="resGraphicPhotoBox">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>PHOTO ID</span>
              </div>
              <div class="res-id-fields-grid">
                <div class="res-id-field">
                  <span class="res-id-lbl">Apelyido / Last Name</span>
                  <strong class="res-id-val" id="resGraphicLastName">${escapeHtml(nameInfo.lastName)}</strong>
                </div>
                <div class="res-id-field">
                  <span class="res-id-lbl">Mga Pangalan / Given Names</span>
                  <strong class="res-id-val" id="resGraphicGivenName">${escapeHtml(nameInfo.givenName)}</strong>
                </div>
                <div class="res-id-field-inline">
                  <div>
                    <span class="res-id-lbl">Kapanganakan / DOB</span>
                    <span class="res-id-val" id="resGraphicDob">${escapeHtml(app.dob || '1995/04/18')}</span>
                  </div>
                  <div>
                    <span class="res-id-lbl">Kasarian / Sex</span>
                    <span class="res-id-val" id="resGraphicSex">${escapeHtml(gender.toUpperCase())}</span>
                  </div>
                </div>
                <div class="res-id-field">
                  <span class="res-id-lbl">Tirahan / Address</span>
                  <span class="res-id-val" id="resGraphicAddress">${escapeHtml((app.address || 'Pallocan West, Batangas City').toUpperCase())}</span>
                </div>
              </div>
            </div>
            <div class="res-id-barcode-row">
              <span id="resGraphicCardNo">${escapeHtml(app.idType.split(' ')[0])} Card No: ${escapeHtml(app.idNumber || '4829-9182-3918-0912')}</span>
              <span class="res-id-barcode-bars">||||||| | ||||| || |||| |||</span>
            </div>
          </div>
        `;
      }
    }

    // Populate Dynamic Graphic Text in Document 2: Proof of Residency
    const proofPreviewBox = document.getElementById('resReviewProofPreviewBox');
    if (proofPreviewBox) {
      if (app.proofAttachmentData) {
        proofPreviewBox.innerHTML = `
          <div class="res-uploaded-proof-preview" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; width: 100%;">
            <img src="${app.proofAttachmentData}" alt="Uploaded Proof of Residency" style="max-height: 190px; max-width: 100%; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="margin-top: 10px; font-size: 11.5px; color: #475569; display: flex; align-items: center; justify-content: space-between; width: 100%;">
              <span style="font-weight: 600; color: #0f172a;">📎 ${escapeHtml(app.proofAttachmentName || 'Proof of Residency Attachment')}</span>
              <span style="background: #e0f2fe; padding: 2px 8px; border-radius: 4px; font-size: 10.5px; color: #0369a1; font-weight: 600;">${escapeHtml(app.proofType || 'Proof Document')}</span>
            </div>
          </div>
        `;
      } else if (!app.proofType || app.proofType.includes('None') || app.proofType.includes('Not Provided')) {
        proofPreviewBox.innerHTML = `
          <div style="padding: 24px 18px; text-align: center; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px;">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#94a3b8" stroke-width="1.8" style="margin-bottom: 8px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <div style="font-weight: 600; color: #334155; font-size: 13px;">Optional Proof Document Not Attached</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">The applicant completed registration submitting Government ID only. Additional utility bill or contract is optional.</div>
          </div>
        `;
      } else {
        const issuerName = app.proofType.includes('PrimeWater') ? 'PrimeWater Batangas City' :
          app.proofType.includes('Meralco') ? 'Meralco Batangas Sector' :
          app.proofType.includes('Barangay') ? 'Barangay Pallocan West' :
          app.proofType.includes('Lease') ? 'Notarized Lease Agreement' :
          app.proofType.includes('PLDT') ? 'PLDT / Telecom Billing' : (app.proofIssuer || 'Utility Billing');

        proofPreviewBox.innerHTML = `
          <div class="res-proof-graphic">
            <div class="res-proof-header">
              <span class="res-proof-logo-text">${escapeHtml(issuerName)}</span>
              <span class="res-proof-badge">${escapeHtml(app.proofType)}</span>
            </div>
            <div class="res-proof-info-grid">
              <div class="res-proof-row">
                <span class="res-proof-lbl">Account / Doc Number</span>
                <strong class="res-proof-val font-mono">${escapeHtml(app.proofNumber || 'PW-BAT-90281-26')}</strong>
              </div>
              <div class="res-proof-row">
                <span class="res-proof-lbl">Account Holder</span>
                <strong class="res-proof-val">${escapeHtml(app.fullName.toUpperCase())}</strong>
              </div>
              <div class="res-proof-row">
                <span class="res-proof-lbl">Service Address</span>
                <span class="res-proof-val">${escapeHtml(app.address)}</span>
              </div>
              <div class="res-proof-row">
                <span class="res-proof-lbl">Billing Status</span>
                <span class="res-proof-val" style="color: #16a34a; font-weight: 600;">✓ Verified Address Match</span>
              </div>
            </div>
            <div class="res-proof-address-match">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Residence verified in ${escapeHtml(app.sitio)}</span>
            </div>
          </div>
        `;
      }
    }

    // Workflow Action Controls Configuration
    const auditStatus = document.getElementById('resReviewAuditStatus');
    const btnApprove = document.getElementById('btnApproveResident');
    const btnReject = document.getElementById('btnTriggerRejectModal');

    if (auditStatus) {
      if (app.status === 'Verified') {
        auditStatus.innerHTML = `<span style="color: #16a34a;">✓ Verified by Admin (${app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString() : 'Active'})</span>`;
      } else if (app.status === 'Rejected') {
        auditStatus.innerHTML = `<span style="color: #dc2626;">✕ Declined (${app.rejectionReason || 'Criteria Unmet'})</span>`;
      } else {
        auditStatus.innerHTML = `<span style="color: #d97706;">⚡ Awaiting Initial Verification Review</span>`;
      }
    }

    if (btnApprove) {
      if (app.status === 'Verified') {
        btnApprove.innerHTML = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Re-send Activation Link</span>`;
      } else if (app.status === 'Rejected') {
        btnApprove.innerHTML = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Reconsider &amp; Approve</span>`;
      } else {
        btnApprove.innerHTML = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Approve Account</span>`;
      }
    }

    if (btnReject) {
      btnReject.style.display = app.status === 'Rejected' ? 'none' : 'inline-flex';
    }

    // Open Modal
    const modal = document.getElementById('resReviewModal');
    if (modal) modal.classList.add('active');
  }

  function approveResidentAccount(appId) {
    const app = residentApplications.find(a => a.id === appId);
    if (!app) return;

    const token = app.activationToken || `ACT-${Math.floor(10000 + Math.random() * 90000)}`;
    app.status = 'Verified';
    app.activationToken = token;
    app.reviewedAt = new Date().toISOString();
    app.reviewedBy = 'Civil Registry Admin (Secretary)';
    app.rejectionReason = null;
    app.rejectionNotes = null;

    saveResidentApplications();

    // CRITICAL: Synchronize with brgy360_residents_db so the resident can now successfully log in!
    try {
      const residentsDb = JSON.parse(localStorage.getItem('brgy360_residents_db') || '[]');
      let userUpdated = false;
      residentsDb.forEach(u => {
        if ((u.email && u.email.toLowerCase() === app.email.toLowerCase()) || u.residentId === app.id) {
          u.verified = true;
          u.status = 'Verified';
          u.verificationTier = 'Level 2: Fully Verified Resident';
          u.idOnRecord = `${app.idType} • Verified by Admin`;
          if (app.gender) u.gender = app.gender;
          if (app.civilStatus) u.civilStatus = app.civilStatus;
          userUpdated = true;
        }
      });

      if (!userUpdated && app.email) {
        residentsDb.push({
          name: app.fullName,
          fullName: app.fullName,
          email: app.email,
          password: 'UserPassword360!',
          mobile: app.mobile,
          dob: app.dob,
          gender: app.gender || 'Not Specified',
          civilStatus: app.civilStatus || 'Single',
          address: app.address,
          sitio: app.sitio,
          city: 'Batangas City, Batangas',
          residentId: app.id,
          verified: true,
          status: 'Verified',
          verificationTier: 'Level 2: Fully Verified Resident',
          idType: app.idType,
          idNumber: app.idNumber,
          proofType: app.proofType,
          avatarInitial: app.fullName ? app.fullName.charAt(0).toUpperCase() : 'R'
        });
      }
      localStorage.setItem('brgy360_residents_db', JSON.stringify(residentsDb));

      // Also update currently active session if user was logged in
      const curUser = JSON.parse(localStorage.getItem('brgy360_user') || '{}');
      if (curUser && curUser.email && curUser.email.toLowerCase() === app.email.toLowerCase()) {
        curUser.verified = true;
        curUser.status = 'Verified';
        curUser.verificationTier = 'Level 2: Fully Verified Resident';
        localStorage.setItem('brgy360_user', JSON.stringify(curUser));
      }
    } catch (e) {
      console.warn('Failed to update residents db on approval:', e);
    }

    // Close review modal
    const reviewModal = document.getElementById('resReviewModal');
    if (reviewModal) reviewModal.classList.remove('active');

    // Populate & open activation notice modal
    const emailNotice = document.getElementById('resActivationNoticeEmail');
    if (emailNotice) emailNotice.textContent = app.email;

    const urlText = document.getElementById('resActivationUrlText');
    if (urlText) urlText.textContent = `https://pallocanwest.brgy360.gov.ph/activate?token=${token}`;

    const actModal = document.getElementById('resActivationNoticeModal');
    if (actModal) actModal.classList.add('active');

    showAdminToast('Account Verified', `Resident ${app.fullName} is now verified and active. The resident can now log in to the resident portal.`, 'success');

    // Refresh views
    renderResidentVerificationTable();
    updateDashboardStatsCards(document.getElementById('dashboardFiscalYearSelect')?.value || '2026');
  }

  function openResidentRejectModal(appId) {
    const app = residentApplications.find(a => a.id === appId);
    if (!app) return;

    currentRejectingResId = appId;

    const summaryEl = document.getElementById('resRejectApplicantSummary');
    if (summaryEl) {
      summaryEl.textContent = `${app.fullName} (${app.id}) · ${app.sitio}`;
    }

    // Reset radio selection
    const reasonInvalid = document.getElementById('reasonInvalidId');
    if (reasonInvalid) reasonInvalid.checked = true;

    const reasonCards = document.querySelectorAll('.res-reason-card');
    reasonCards.forEach(c => c.classList.remove('selected'));
    const firstCard = document.querySelector('.res-reason-card[for="reasonInvalidId"]');
    if (firstCard) firstCard.classList.add('selected');

    // Clear notes
    const notesInput = document.getElementById('resRejectNotesInput');
    if (notesInput) notesInput.value = '';

    const rejectModal = document.getElementById('resRejectModal');
    if (rejectModal) rejectModal.classList.add('active');
  }

  function confirmResidentRejection() {
    if (!currentRejectingResId) return;

    const app = residentApplications.find(a => a.id === currentRejectingResId);
    if (!app) return;

    // Get selected reason
    const selectedRadio = document.querySelector('input[name="resRejectReason"]:checked');
    const reasonVal = selectedRadio ? selectedRadio.value : 'Invalid ID';

    const notesInput = document.getElementById('resRejectNotesInput');
    const notesVal = notesInput ? notesInput.value.trim() : '';

    app.status = 'Rejected';
    app.rejectionReason = reasonVal;
    app.rejectionNotes = notesVal;
    app.reviewedAt = new Date().toISOString();
    app.reviewedBy = 'Civil Registry Admin';

    saveResidentApplications();

    // Sync with brgy360_residents_db
    try {
      const residentsDb = JSON.parse(localStorage.getItem('brgy360_residents_db') || '[]');
      residentsDb.forEach(u => {
        if ((u.email && u.email.toLowerCase() === app.email.toLowerCase()) || u.residentId === app.id) {
          u.verified = false;
          u.status = 'Rejected';
          u.rejectionReason = reasonVal;
          u.rejectionNotes = notesVal;
          u.verificationTier = 'Registration Declined';
        }
      });
      localStorage.setItem('brgy360_residents_db', JSON.stringify(residentsDb));
    } catch (e) {}

    // Close rejection & review modals
    const rejectModal = document.getElementById('resRejectModal');
    if (rejectModal) rejectModal.classList.remove('active');

    const reviewModal = document.getElementById('resReviewModal');
    if (reviewModal) reviewModal.classList.remove('active');

    showAdminToast('Application Declined', `Application for ${app.fullName} set to Rejected (${reasonVal}). Notification queued.`, 'danger');

    renderResidentVerificationTable();
    updateDashboardStatsCards(document.getElementById('dashboardFiscalYearSelect')?.value || '2026');
  }

  // Lightbox Zoom & Preview Engine
  function applyLightboxTransform() {
    const viewport = document.getElementById('resLightboxViewport');
    if (viewport) {
      viewport.style.transform = `scale(${currentLightboxZoom}) rotate(${currentLightboxRotation}deg)`;
    }
  }

  function openDocumentLightbox(type) {
    const lightbox = document.getElementById('resDocLightboxModal');
    const viewport = document.getElementById('resLightboxViewport');
    const titleEl = document.getElementById('resLightboxTitle');

    if (!lightbox || !viewport) return;

    viewport.innerHTML = '';
    currentLightboxZoom = 1;
    currentLightboxRotation = 0;
    applyLightboxTransform();

    if (type === 'id') {
      if (titleEl) titleEl.textContent = 'Government Identification Preview & Inspection';
      const uploadedImg = document.querySelector('#resReviewIdPreviewBox img');
      if (uploadedImg) {
        const cloned = uploadedImg.cloneNode(true);
        cloned.style.maxHeight = '70vh';
        cloned.style.maxWidth = '90vw';
        viewport.appendChild(cloned);
      } else {
        const source = document.querySelector('#resReviewIdPreviewBox .res-id-graphic');
        if (source) viewport.appendChild(source.cloneNode(true));
      }
    } else {
      if (titleEl) titleEl.textContent = 'Proof of Residency Document Inspection';
      const uploadedImg = document.querySelector('#resReviewProofPreviewBox img');
      if (uploadedImg) {
        const cloned = uploadedImg.cloneNode(true);
        cloned.style.maxHeight = '70vh';
        cloned.style.maxWidth = '90vw';
        viewport.appendChild(cloned);
      } else {
        const source = document.querySelector('#resReviewProofPreviewBox .res-proof-graphic') || document.querySelector('#resReviewProofPreviewBox > div');
        if (source) viewport.appendChild(source.cloneNode(true));
      }
    }

    lightbox.classList.add('active');
  }

  // Export Registry CSV
  function exportResidentRegistryCsv() {
    if (!residentApplications || residentApplications.length === 0) {
      showAdminToast('Export Warning', 'No resident records available to export.', 'warning');
      return;
    }

    const headers = [
      'Application ID',
      'Full Name',
      'Email Address',
      'Mobile Number',
      'Date of Birth',
      'Civil Status',
      'Full Address',
      'Sitio / Purok',
      'Registered Date',
      'Verification Status',
      'ID Type',
      'ID Number',
      'Proof Document',
      'Rejection Reason'
    ];

    const rows = residentApplications.map(app => [
      `"${app.id || ''}"`,
      `"${(app.fullName || '').replace(/"/g, '""')}"`,
      `"${app.email || ''}"`,
      `"${app.mobile || ''}"`,
      `"${app.dob || ''}"`,
      `"${app.civilStatus || ''}"`,
      `"${(app.address || '').replace(/"/g, '""')}"`,
      `"${app.sitio || ''}"`,
      `"${app.registeredDate || ''}"`,
      `"${app.status || ''}"`,
      `"${app.idType || ''}"`,
      `"${app.idNumber || ''}"`,
      `"${app.proofType || ''}"`,
      `"${app.rejectionReason || 'None'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Barangay_Pallocan_West_Resident_Verification_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showAdminToast('Export Completed', 'Resident verification registry downloaded as CSV.', 'success');
  }

  // Pre-Registration Submission Handler
  function handlePreRegistrationSubmit() {
    const fullNameInput = document.getElementById('preRegFullName');
    const dobInput = document.getElementById('preRegDob');
    const ageInput = document.getElementById('preRegAge');
    const mobileInput = document.getElementById('preRegMobile');
    const emailInput = document.getElementById('preRegEmail');
    const addressInput = document.getElementById('preRegAddress');
    const sitioInput = document.getElementById('preRegSitio');

    const fullNameErr = document.getElementById('preRegFullNameError');
    const dobErr = document.getElementById('preRegDobError');
    const ageErr = document.getElementById('preRegAgeError');
    const mobileErr = document.getElementById('preRegMobileError');
    const emailErr = document.getElementById('preRegEmailError');
    const addressErr = document.getElementById('preRegAddressError');
    const sitioErr = document.getElementById('preRegSitioError');

    let isValid = true;
    let firstInvalid = null;

    function markInvalid(inputEl, errorEl, message) {
      if (inputEl) inputEl.classList.add('is-invalid');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
      if (!firstInvalid && inputEl) firstInvalid = inputEl;
      isValid = false;
    }

    function markValid(inputEl, errorEl) {
      if (inputEl) inputEl.classList.remove('is-invalid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }

    const fullName = (fullNameInput?.value || '').trim();
    const dob = dobInput?.value || '';
    const ageVal = (ageInput?.value || '').trim();
    const mobile = (mobileInput?.value || '').trim();
    const email = (emailInput?.value || '').trim();
    const address = (addressInput?.value || '').trim();
    const sitio = sitioInput?.value || '';
    const gender = document.getElementById('preRegGender')?.value || 'Female';
    const civil = document.getElementById('preRegCivilStatus')?.value || 'Single';
    const idType = document.getElementById('preRegIdType')?.value;
    const idNumber = document.getElementById('preRegIdNumber')?.value?.trim() || `4829-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const proofType = document.getElementById('preRegProofType')?.value;

    // 1. Name: Letters and spaces only. No numbers or special characters.
    if (!fullName) {
      markInvalid(fullNameInput, fullNameErr, 'Full legal name is required.');
    } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      markInvalid(fullNameInput, fullNameErr, 'Name must contain letters and spaces only. Numbers and special characters are not allowed.');
    } else if (fullName.length < 2) {
      markInvalid(fullNameInput, fullNameErr, 'Name must be at least 2 characters long.');
    } else {
      markValid(fullNameInput, fullNameErr);
    }

    // 2. Date of Birth
    if (!dob) {
      markInvalid(dobInput, dobErr, 'Date of birth is required.');
    } else {
      const d = new Date(dob);
      const today = new Date();
      if (isNaN(d.getTime()) || d > today || d.getFullYear() < 1900) {
        markInvalid(dobInput, dobErr, 'Please select a valid past date of birth.');
      } else {
        markValid(dobInput, dobErr);
      }
    }

    // 3. Age: Numeric digits only. No letters or special characters.
    if (!ageVal) {
      markInvalid(ageInput, ageErr, 'Age is required.');
    } else if (!/^\d+$/.test(ageVal)) {
      markInvalid(ageInput, ageErr, 'Age must contain numeric digits only. Letters and special characters are not allowed.');
    } else {
      const a = parseInt(ageVal, 10);
      if (isNaN(a) || a < 1 || a > 120) {
        markInvalid(ageInput, ageErr, 'Please enter a valid age between 1 and 120.');
      } else {
        markValid(ageInput, ageErr);
      }
    }

    // 4. Contact Number: Numeric digits only. No letters or special characters.
    if (!mobile) {
      markInvalid(mobileInput, mobileErr, 'Contact number is required.');
    } else if (!/^\d+$/.test(mobile)) {
      markInvalid(mobileInput, mobileErr, 'Contact number must contain numeric digits only. Letters and special characters are not allowed.');
    } else if (mobile.length < 7 || mobile.length > 11) {
      markInvalid(mobileInput, mobileErr, 'Contact number must be between 7 and 11 numeric digits (e.g. 09171234567).');
    } else {
      markValid(mobileInput, mobileErr);
    }

    // 5. Email Address: Valid format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      markInvalid(emailInput, emailErr, 'Email address is required.');
    } else if (!emailRegex.test(email)) {
      markInvalid(emailInput, emailErr, 'Please enter a valid email address (e.g. resident@example.com).');
    } else {
      markValid(emailInput, emailErr);
    }

    // 6. Address
    if (!address || address.length < 5) {
      markInvalid(addressInput, addressErr, 'Street address is required (at least 5 characters).');
    } else {
      markValid(addressInput, addressErr);
    }

    // 7. Sitio
    if (!sitio) {
      markInvalid(sitioInput, sitioErr, 'Please select Sitio / Purok.');
    } else {
      markValid(sitioInput, sitioErr);
    }

    if (!isValid) {
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const nextNum = residentApplications.length + 1;
    const newId = `VER-2026-${String(nextNum).padStart(3, '0')}`;
    const today = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const dateFormatted = today.toLocaleDateString('en-US', options);

    const newApp = {
      id: newId,
      fullName: fullName,
      email: email,
      mobile: mobile,
      dob: dob,
      age: parseInt(ageVal, 10) || 28,
      gender: gender,
      civilStatus: civil || 'Single',
      address: address,
      sitio: sitio,
      registeredDate: dateFormatted,
      status: 'Pending',
      channel: 'Walk-in Intake Form',
      idType: idType || 'Philippine National ID (PhilID)',
      idNumber: idNumber,
      proofType: proofType || 'Barangay Certification of Residence',
      proofNumber: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
      proofIssuer: 'Barangay Pallocan West',
      rejectionReason: null,
      rejectionNotes: null,
      reviewedAt: null,
      activationToken: null
    };

    residentApplications.unshift(newApp);
    saveResidentApplications();

    // Close Modal & Reset
    const modal = document.getElementById('resPreRegisterModal');
    if (modal) modal.classList.remove('active');
    document.getElementById('preRegisterForm')?.reset();

    showAdminToast('Pre-Registration Enrolled', `Applicant ${fullName} queued for verification under ${sitio}.`, 'success');

    renderResidentVerificationTable();
    updateDashboardStatsCards(document.getElementById('dashboardFiscalYearSelect')?.value || '2026');
  }

  // Initialize Resident Verification Module Event Handlers
  function initResidentVerificationModule() {
    // 1. Status Filter Pills
    const filterPills = document.querySelectorAll('.res-filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', function () {
        filterPills.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        currentResStatusFilter = this.getAttribute('data-res-status') || 'all';
        renderResidentVerificationTable();
      });
    });

    // 2. Search Input
    const searchInput = document.getElementById('resSearchInput');
    const clearSearchBtn = document.getElementById('btnClearResSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentResSearch = this.value;
        if (clearSearchBtn) {
          clearSearchBtn.style.display = this.value.length > 0 ? 'block' : 'none';
        }
        renderResidentVerificationTable();
      });
    }

    if (clearSearchBtn && searchInput) {
      clearSearchBtn.addEventListener('click', function () {
        searchInput.value = '';
        currentResSearch = '';
        this.style.display = 'none';
        renderResidentVerificationTable();
        searchInput.focus();
      });
    }

    // 3. Sitio Dropdown Filter
    const sitioFilter = document.getElementById('resSitioFilter');
    if (sitioFilter) {
      sitioFilter.addEventListener('change', function () {
        currentResSitioFilter = this.value;
        renderResidentVerificationTable();
      });
    }

    // 4. Reset Filters Button in Empty State
    const btnResetFilters = document.getElementById('btnResetResFilters');
    if (btnResetFilters) {
      btnResetFilters.addEventListener('click', () => {
        currentResStatusFilter = 'all';
        currentResSearch = '';
        currentResSitioFilter = 'all';
        if (searchInput) searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        if (sitioFilter) sitioFilter.value = 'all';

        filterPills.forEach(p => {
          const isAll = p.getAttribute('data-res-status') === 'all';
          p.classList.toggle('active', isAll);
          p.setAttribute('aria-selected', isAll ? 'true' : 'false');
        });

        renderResidentVerificationTable();
      });
    }

    // 5. Table "View" Button Click Delegation
    const tableBody = document.getElementById('resVerificationTableBody');
    if (tableBody) {
      tableBody.addEventListener('click', function (e) {
        const btn = e.target.closest('.btn-view-res-modal');
        if (btn) {
          const appId = btn.getAttribute('data-res-id');
          if (appId) openResidentReviewModal(appId);
        }
      });
    }

    // 6. Detailed Review Modal Controls
    const btnCloseReview = document.getElementById('btnCloseResReviewModal');
    const btnFooterClose = document.getElementById('btnFooterCloseReview');
    const reviewModal = document.getElementById('resReviewModal');

    const closeReviewModal = () => {
      if (reviewModal) reviewModal.classList.remove('active');
    };

    if (btnCloseReview) btnCloseReview.addEventListener('click', closeReviewModal);
    if (btnFooterClose) btnFooterClose.addEventListener('click', closeReviewModal);

    // Approve Button in Review Modal
    const btnApprove = document.getElementById('btnApproveResident');
    if (btnApprove) {
      btnApprove.addEventListener('click', () => {
        if (currentReviewingResId) approveResidentAccount(currentReviewingResId);
      });
    }

    // Reject Button in Review Modal
    const btnTriggerReject = document.getElementById('btnTriggerRejectModal');
    if (btnTriggerReject) {
      btnTriggerReject.addEventListener('click', () => {
        if (currentReviewingResId) openResidentRejectModal(currentReviewingResId);
      });
    }

    // Document Zoom Buttons in Review Modal
    const btnZoomId = document.getElementById('btnZoomInspectId');
    if (btnZoomId) {
      btnZoomId.addEventListener('click', () => openDocumentLightbox('id'));
    }

    const btnZoomProof = document.getElementById('btnZoomInspectProof');
    if (btnZoomProof) {
      btnZoomProof.addEventListener('click', () => openDocumentLightbox('proof'));
    }

    // 7. Rejection Modal Controls
    const rejectModal = document.getElementById('resRejectModal');
    const btnCloseReject = document.getElementById('btnCloseResRejectModal');
    const btnCancelReject = document.getElementById('btnCancelResReject');
    const btnConfirmReject = document.getElementById('btnConfirmResReject');

    const closeRejectModal = () => {
      if (rejectModal) rejectModal.classList.remove('active');
    };

    if (btnCloseReject) btnCloseReject.addEventListener('click', closeRejectModal);
    if (btnCancelReject) btnCancelReject.addEventListener('click', closeRejectModal);
    if (btnConfirmReject) btnConfirmReject.addEventListener('click', confirmResidentRejection);

    // Rejection reason card selector interactive styling
    const reasonCards = document.querySelectorAll('.res-reason-card');
    reasonCards.forEach(card => {
      card.addEventListener('click', function () {
        reasonCards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        const radio = this.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    // 8. Document Lightbox Controls
    const lightboxModal = document.getElementById('resDocLightboxModal');
    const btnCloseLightbox = document.getElementById('btnCloseLightbox');
    if (btnCloseLightbox && lightboxModal) {
      btnCloseLightbox.addEventListener('click', () => lightboxModal.classList.remove('active'));
    }

    const btnZoomIn = document.getElementById('btnLightboxZoomIn');
    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        currentLightboxZoom = Math.min(2.5, currentLightboxZoom + 0.25);
        applyLightboxTransform();
      });
    }

    const btnZoomOut = document.getElementById('btnLightboxZoomOut');
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        currentLightboxZoom = Math.max(0.5, currentLightboxZoom - 0.25);
        applyLightboxTransform();
      });
    }

    const btnResetZoom = document.getElementById('btnLightboxReset');
    if (btnResetZoom) {
      btnResetZoom.addEventListener('click', () => {
        currentLightboxZoom = 1;
        currentLightboxRotation = 0;
        applyLightboxTransform();
      });
    }

    const btnRotate = document.getElementById('btnLightboxRotate');
    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        currentLightboxRotation = (currentLightboxRotation + 90) % 360;
        applyLightboxTransform();
      });
    }

    // 9. Pre-Registration Intake Modal Controls
    const preRegModal = document.getElementById('resPreRegisterModal');
    const btnOpenPreReg = document.getElementById('btnOpenPreRegisterModal');
    const btnClosePreReg = document.getElementById('btnClosePreRegisterModal');
    const btnCancelPreReg = document.getElementById('btnCancelPreRegister');
    const btnSubmitPreReg = document.getElementById('btnSubmitPreRegister');

    if (btnOpenPreReg && preRegModal) {
      btnOpenPreReg.addEventListener('click', () => preRegModal.classList.add('active'));
    }

    const closePreRegModal = () => {
      if (preRegModal) preRegModal.classList.remove('active');
    };

    if (btnClosePreReg) btnClosePreReg.addEventListener('click', closePreRegModal);
    if (btnCancelPreReg) btnCancelPreReg.addEventListener('click', closePreRegModal);
    if (btnSubmitPreReg) btnSubmitPreReg.addEventListener('click', handlePreRegistrationSubmit);

    // Real-time input restrictions and error clearing for Pre-Registration Intake Form
    const preRegNameEl = document.getElementById('preRegFullName');
    const preRegMobileEl = document.getElementById('preRegMobile');
    const preRegAgeEl = document.getElementById('preRegAge');
    const preRegDobEl = document.getElementById('preRegDob');
    const preRegEmailEl = document.getElementById('preRegEmail');
    const preRegAddrEl = document.getElementById('preRegAddress');
    const preRegSitioEl = document.getElementById('preRegSitio');

    if (preRegNameEl) {
      preRegNameEl.addEventListener('input', function () {
        this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
        this.classList.remove('is-invalid', 'input-error');
        const err = document.getElementById('preRegFullNameError');
        if (err) err.textContent = '';
      });
    }

    if (preRegMobileEl) {
      preRegMobileEl.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '');
        this.classList.remove('is-invalid', 'input-error');
        const err = document.getElementById('preRegMobileError');
        if (err) err.textContent = '';
      });
    }

    if (preRegAgeEl) {
      preRegAgeEl.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '');
        this.classList.remove('is-invalid', 'input-error');
        const err = document.getElementById('preRegAgeError');
        if (err) err.textContent = '';
      });
    }

    if (preRegDobEl) {
      preRegDobEl.max = new Date().toISOString().split('T')[0];
      preRegDobEl.addEventListener('change', function () {
        this.classList.remove('is-invalid', 'input-error');
        const err = document.getElementById('preRegDobError');
        if (err) err.textContent = '';
        if (this.value) {
          const birthDate = new Date(this.value);
          const today = new Date();
          let calculatedAge = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
          }
          if (calculatedAge >= 0 && preRegAgeEl) {
            preRegAgeEl.value = calculatedAge;
            preRegAgeEl.classList.remove('is-invalid', 'input-error');
            const aErr = document.getElementById('preRegAgeError');
            if (aErr) aErr.textContent = '';
          }
        }
      });
    }

    if (preRegEmailEl) {
      preRegEmailEl.addEventListener('input', function () {
        this.classList.remove('is-invalid', 'input-error');
        const err = document.getElementById('preRegEmailError');
        if (err) err.textContent = '';
      });
    }

    if (preRegAddrEl) {
      preRegAddrEl.addEventListener('input', function () {
        this.classList.remove('is-invalid', 'input-error');
        const err = document.getElementById('preRegAddressError');
        if (err) err.textContent = '';
      });
    }

    if (preRegSitioEl) {
      preRegSitioEl.addEventListener('change', function () {
        this.classList.remove('is-invalid', 'input-error');
        const err = document.getElementById('preRegSitioError');
        if (err) err.textContent = '';
      });
    }

    // 10. Activation Notice Modal Controls
    const actNoticeModal = document.getElementById('resActivationNoticeModal');
    const btnCloseActNotice = document.getElementById('btnCloseActivationNotice');
    if (btnCloseActNotice && actNoticeModal) {
      btnCloseActNotice.addEventListener('click', () => actNoticeModal.classList.remove('active'));
    }

    const btnCopyLink = document.getElementById('btnCopyActivationLink');
    if (btnCopyLink) {
      btnCopyLink.addEventListener('click', function () {
        const urlText = document.getElementById('resActivationUrlText')?.textContent || '';
        navigator.clipboard?.writeText(urlText).then(() => {
          this.textContent = 'Copied!';
          setTimeout(() => { this.textContent = 'Copy'; }, 2000);
        }).catch(() => {
          this.textContent = 'Copied!';
          setTimeout(() => { this.textContent = 'Copy'; }, 2000);
        });
      });
    }

    // 11. Export Registry Button
    const btnExport = document.getElementById('btnExportResidentRegistry');
    if (btnExport) btnExport.addEventListener('click', exportResidentRegistryCsv);
  }

  // Initial render of all sub-tables
  renderProposalsTable();
  renderProjectsTable();
  renderAnnouncementsTable();
  initAdminBudgetModule();
  initResidentVerificationModule();
  renderResidentVerificationTable();
  updateDashboardStatsCards('2026');

  // Activate view from URL hash on load (once all datasets and modules are ready)
  const initialHash = window.location.hash.replace('#', '').toLowerCase();
  if (initialHash && viewTitles[initialHash]) {
    switchView(initialHash);
  }

  // ==============================================================
  // 12. TOAST NOTIFICATION ENGINE
  // ==============================================================
  function showAdminToast(title, message, type = 'info') {
    const container = document.getElementById('adminToastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'danger') icon = '⚠️';
    if (type === 'warning') icon = '⚡';
    if (type === 'purple') icon = '🔮';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-body">
        <span class="toast-title">${escapeHtml(title)}</span>
        <span class="toast-msg">${escapeHtml(message)}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 4200);
  }

  window.showAdminToast = showAdminToast;
  window.residentApplications = residentApplications;
  window.renderResidentVerificationTable = renderResidentVerificationTable;
  window.openResidentReviewModal = openResidentReviewModal;
  window.approveResidentAccount = approveResidentAccount;
  window.openResidentRejectModal = openResidentRejectModal;

  // ==============================================================
  // 13. UTILITY HELPERS
  // ==============================================================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function truncate(str, maxLen = 30) {
    if (!str) return '';
    return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
  }

});
