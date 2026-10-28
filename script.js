// JavaScript for Brgy360: Navigation, Mobile Menu, Forms & Auth Modal
document.addEventListener('DOMContentLoaded', function () {
  // Navigation & Mobile Menu
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  // Modal & Auth Elements
  const authModal = document.getElementById('authModal');
  const openLoginBtn = document.getElementById('openLoginBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const loginView = document.getElementById('login-view');
  const registerView = document.getElementById('register-view');
  const switchToRegisterBtn = document.getElementById('switchToRegisterBtn');
  const switchToLoginBtn = document.getElementById('switchToLoginBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Interactive Forms
  const docServiceForm = document.getElementById('docServiceForm');
  const complaintReportForm = document.getElementById('complaintReportForm');
  const projectProposalForm = document.getElementById('projectProposalForm');

  // 1. Mobile Menu Toggle & Navigation Active Highlighting
  const navAnchorLinks = navLinks ? navLinks.querySelectorAll('a:not(.nav-btn-auth)') : [];

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
    });
  }

  // Handle immediate highlighting when clicking or tapping any nav link
  navAnchorLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navAnchorLinks.forEach(function (l) {
        l.classList.remove('active');
      });
      link.classList.add('active');

      // Close mobile drawer if open
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
  });

  // Scroll Spy to highlight navigation link based on current section in view
  const sectionIds = ['home', 'about', 'projects', 'services', 'budget', 'reports', 'announcements'];
  const trackedSections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(function (sec) { return sec !== null; });

  let isScrollDebounced = false;
  function updateNavHighlightOnScroll() {
    if (isScrollDebounced) return;
    isScrollDebounced = true;

    requestAnimationFrame(function () {
      const scrollPos = window.scrollY + 140; // 80px navbar height + offset
      let currentSectionId = '';

      // Check bottom of page edge case: if at the bottom, highlight announcements
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
        currentSectionId = 'announcements';
      } else {
        trackedSections.forEach(function (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            currentSectionId = section.getAttribute('id');
          }
        });

        // Fallback for top of page
        if (!currentSectionId && window.scrollY < 300) {
          currentSectionId = 'home';
        }
      }

      if (currentSectionId) {
        navAnchorLinks.forEach(function (link) {
          const href = link.getAttribute('href');
          if (href === '#' + currentSectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }

      isScrollDebounced = false;
    });
  }

  window.addEventListener('scroll', updateNavHighlightOnScroll, { passive: true });
  // Initial check on page load
  updateNavHighlightOnScroll();

  // 2. Authentication Modal & View Toggling
  function clearAuthFeedback() {
    if (!authModal) return;
    const errorSpans = authModal.querySelectorAll('.auth-error-text');
    errorSpans.forEach(function (span) {
      span.textContent = '';
      span.classList.remove('show');
    });
    const invalidInputs = authModal.querySelectorAll('.is-invalid');
    invalidInputs.forEach(function (inp) {
      inp.classList.remove('is-invalid');
    });
    const banners = authModal.querySelectorAll('.auth-feedback-banner');
    banners.forEach(function (b) {
      b.style.display = 'none';
      b.textContent = '';
      b.className = 'auth-feedback-banner';
    });
  }

  function resetPasswordVisibility(scope = document) {
    if (!scope) return;
    scope.querySelectorAll('.password-toggle-btn').forEach(btn => {
      const targetId = btn.getAttribute('data-target');
      const input = targetId ? document.getElementById(targetId) : btn.parentElement.querySelector('input');
      if (input && input.type === 'text') {
        input.type = 'password';
        const showIcon = btn.querySelector('.eye-show');
        const hideIcon = btn.querySelector('.eye-hide');
        if (showIcon) showIcon.style.display = 'block';
        if (hideIcon) hideIcon.style.display = 'none';
        btn.setAttribute('aria-label', 'Show password');
        btn.setAttribute('title', 'Show password');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  function showLoginView() {
    if (loginView) loginView.style.display = 'block';
    if (registerView) registerView.style.display = 'none';
    clearAuthFeedback();
    resetPasswordVisibility(authModal);
  }

  function showRegisterView() {
    if (loginView) loginView.style.display = 'none';
    if (registerView) registerView.style.display = 'block';
    clearAuthFeedback();
    resetPasswordVisibility(authModal);
  }

  function openAuthModal(view) {
    if (localStorage.getItem('brgy360_session') === 'active') {
      window.location.href = 'user.html';
      return;
    }
    if (!authModal) return;
    authModal.classList.add('active');
    authModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (view === 'register') {
      showRegisterView();
    } else {
      showLoginView();
    }
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.remove('active');
    authModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearAuthFeedback();
    resetPasswordVisibility(authModal);
  }

  // ==========================================================
  // LOGGED-IN SESSION STATE SYNCHRONIZATION ON PUBLIC VIEW
  // ==========================================================
  function updatePublicViewStateForSession() {
    const isSessionActive = localStorage.getItem('brgy360_session') === 'active';
    let currentUser = null;
    if (isSessionActive) {
      try {
        currentUser = JSON.parse(localStorage.getItem('brgy360_user'));
      } catch (e) {}
      if (!currentUser) {
        currentUser = {
          name: 'Juan Dela Cruz',
          email: 'juan.delacruz@example.com',
          sitio: 'Sitio Ibaba',
          avatarInitial: 'J'
        };
      }
    }

    const userName = currentUser ? (currentUser.name || 'Juan Dela Cruz') : '';
    const userInitial = currentUser ? (currentUser.avatarInitial || userName.charAt(0).toUpperCase()) : 'J';
    const VALID_PUBLIC_SITIOS = ['Sitio Ibaba', 'Sitio Santolan', 'Sitio Ilaya', 'Sitio Gitna', 'Tierra Verde', 'Potenciana Village', 'G.C Berberabe'];
    const rawSitio = currentUser ? (currentUser.sitio || 'Sitio Ibaba') : 'Sitio Ibaba';
    const userSitio = VALID_PUBLIC_SITIOS.includes(rawSitio) ? rawSitio : (rawSitio === 'G.C. Berberabe' ? 'G.C Berberabe' : 'Sitio Ibaba');

    // 1. Update Navbar Auth Slot (no user name, no sign out button)
    const navAuthSlot = document.getElementById('navAuthSlot');
    if (navAuthSlot) {
      if (isSessionActive) {
        navAuthSlot.innerHTML = `<a href="user.html" class="nav-btn-auth" id="navResidentPortalBtn" title="Access your Resident Portal">Resident Portal &rarr;</a>`;
      } else {
        navAuthSlot.innerHTML = `<a href="#login" class="nav-btn-auth" id="openLoginBtn">Login / Register</a>`;
        const newLoginBtn = document.getElementById('openLoginBtn');
        if (newLoginBtn) {
          newLoginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openAuthModal('login');
          });
        }
      }
    }

    // 2. Update Services Section Banner Subtext
    const servicesBannerSubtext = document.getElementById('servicesBannerSubtext');
    if (servicesBannerSubtext) {
      if (isSessionActive) {
        servicesBannerSubtext.innerHTML = `Welcome back, <strong>${userName}</strong> (Verified Resident • ${userSitio}). Select any document below to view official requirements and submit an application directly via your resident portal.`;
      } else {
        servicesBannerSubtext.textContent = 'Browse the services available at the barangay. Log in or create a verified resident account to submit a request.';
      }
    }

    // 3. Update Report a Concern Section (Step 1 & CTA Banner)
    const workflowStep1Text = document.getElementById('workflowStep1Text');
    if (workflowStep1Text) {
      if (isSessionActive) {
        workflowStep1Text.innerHTML = `<strong>Already signed in:</strong> Logged in as ${userName} (${userSitio} • Verified).`;
      } else {
        workflowStep1Text.textContent = 'Create a resident account or sign in to the portal.';
      }
    }

    const concernCtaTitle = document.getElementById('concernCtaTitle');
    const concernCtaDescription = document.getElementById('concernCtaDescription');
    const concernCtaActions = document.getElementById('concernCtaActions');

    if (concernCtaTitle && concernCtaDescription && concernCtaActions) {
      if (isSessionActive) {
        concernCtaTitle.innerHTML = `Ready to report a concern, ${userName}?`;
        concernCtaDescription.textContent = `You are logged in with your verified resident account (${userSitio}). You do not need to sign in again — submit your concern directly with an automated tracking number and monitor site inspection status in real-time.`;
        concernCtaActions.innerHTML = `
          <a href="user.html#reports" class="btn-concern-login" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
            <span>Report Concern in Portal &rarr;</span>
          </a>
          <a href="user.html#reports" class="btn-concern-register" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
            <span>View My Active Tickets</span>
          </a>
        `;
      } else {
        concernCtaTitle.textContent = 'Ready to report a concern?';
        concernCtaDescription.textContent = "Sign in to your resident account to file a concern and track the barangay's response, or create an account if you are not registered yet.";
        concernCtaActions.innerHTML = `
          <button type="button" class="btn-concern-login" id="btnConcernLogin">Log in</button>
          <button type="button" class="btn-concern-register" id="btnConcernRegister">Create an Account</button>
        `;
        const loginBtn = document.getElementById('btnConcernLogin');
        const regBtn = document.getElementById('btnConcernRegister');
        if (loginBtn) {
          loginBtn.addEventListener('click', function () { openAuthModal('login'); });
        }
        if (regBtn) {
          regBtn.addEventListener('click', function () { openAuthModal('register'); });
        }
      }
    }
  }

  // Initial call to sync public view with login status
  updatePublicViewStateForSession();
  window.addEventListener('storage', updatePublicViewStateForSession);

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeAuthModal);
  }

  if (authModal) {
    authModal.addEventListener('click', function (e) {
      if (e.target === authModal) {
        closeAuthModal();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && authModal && authModal.classList.contains('active')) {
      closeAuthModal();
    }
  });

  // Switch Links between Login & Registration
  if (switchToRegisterBtn) {
    switchToRegisterBtn.addEventListener('click', function (e) {
      e.preventDefault();
      showRegisterView();
    });
  }

  if (switchToLoginBtn) {
    switchToLoginBtn.addEventListener('click', function (e) {
      e.preventDefault();
      showLoginView();
    });
  }

  // Report a Concern CTA Auth Triggers
  const btnConcernLogin = document.getElementById('btnConcernLogin');
  if (btnConcernLogin) {
    btnConcernLogin.addEventListener('click', function () {
      openAuthModal('login');
    });
  }

  const btnConcernRegister = document.getElementById('btnConcernRegister');
  if (btnConcernRegister) {
    btnConcernRegister.addEventListener('click', function () {
      openAuthModal('register');
    });
  }

  // Inline Validation Helpers
  function setFieldError(inputEl, errorEl, message) {
    if (inputEl) inputEl.classList.add('is-invalid');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  }

  function clearFieldError(inputEl, errorEl) {
    if (inputEl) inputEl.classList.remove('is-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('show');
    }
  }

  // 3. Client-Side Validation: Login Form
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginEmailError = document.getElementById('loginEmailError');
  const loginPasswordError = document.getElementById('loginPasswordError');
  const loginFeedback = document.getElementById('loginFeedback');

  if (loginEmail) {
    loginEmail.addEventListener('input', function () {
      clearFieldError(loginEmail, loginEmailError);
    });
  }
  if (loginPassword) {
    loginPassword.addEventListener('input', function () {
      clearFieldError(loginPassword, loginPasswordError);
    });
  }

  const footerAdminLink = document.getElementById('footerAdminLink');
  if (footerAdminLink) {
    footerAdminLink.addEventListener('click', function () {
      localStorage.setItem('currentUserRole', 'admin');
      localStorage.setItem('brgy360_session', 'active');
    });
  }

  // Handle direct unauthorized access redirect
  const authUrlParams = new URLSearchParams(window.location.search);
  if (authUrlParams.get('auth') === 'denied') {
    setTimeout(function () {
      openAuthModal('login');
      if (loginFeedback) {
        loginFeedback.className = 'auth-feedback-banner error';
        loginFeedback.textContent = 'Access Denied: Admin Privileges Required. Please log in with your administrator credentials.';
        loginFeedback.style.display = 'block';
      }
    }, 200);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;
      const emailVal = loginEmail ? loginEmail.value.trim() : '';
      const passVal = loginPassword ? loginPassword.value : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailVal) {
        setFieldError(loginEmail, loginEmailError, 'Email address is required.');
        isValid = false;
      } else if (!emailRegex.test(emailVal)) {
        setFieldError(loginEmail, loginEmailError, 'Please enter a valid email format (e.g. you@example.com).');
        isValid = false;
      }

      if (!passVal) {
        setFieldError(loginPassword, loginPasswordError, 'Password is required.');
        isValid = false;
      }

      if (!isValid) return;

      const emailLower = emailVal.toLowerCase();

      // Dual-Role Account 1: Administrator
      if (emailLower === 'admin@brgy360.gov.ph') {
        if (passVal !== 'AdminPassword360!') {
          setFieldError(loginPassword, loginPasswordError, 'Invalid administrator password.');
          return;
        }
        localStorage.setItem('currentUserRole', 'admin');
        localStorage.setItem('brgy360_session', 'active');
        if (loginFeedback) {
          loginFeedback.className = 'auth-feedback-banner success';
          loginFeedback.textContent = 'Administrator authenticated! Loading Executive Console...';
          loginFeedback.style.display = 'block';
        }
        setTimeout(function () {
          closeAuthModal();
          loginForm.reset();
          clearAuthFeedback();
          window.location.href = 'admin.html';
        }, 600);
        return;
      }

      // Dual-Role Account 2 & Dynamic Registered Residents:
      let residentDb = [];
      try {
        residentDb = JSON.parse(localStorage.getItem('brgy360_residents_db') || '[]');
      } catch (err) {}

      const isDefaultJuan = (emailLower === 'juan@gmail.com' || emailLower === 'juan.delacruz@example.com');

      // Locate user by email in residentDb (or Juan alias)
      let customUser = residentDb.find(u => u.email && u.email.trim().toLowerCase() === emailLower);
      if (!customUser && isDefaultJuan) {
        customUser = residentDb.find(u => u.email && (u.email.trim().toLowerCase() === 'juan@gmail.com' || u.email.trim().toLowerCase() === 'juan.delacruz@example.com'));
      }

      // If Juan Dela Cruz and not yet stored in residentDb, initialize the record
      if (!customUser && isDefaultJuan) {
        let storedJuan = null;
        try {
          storedJuan = JSON.parse(localStorage.getItem('brgy360_user') || 'null');
        } catch (e) {}
        const juanPwd = localStorage.getItem('brgy360_pwd_juan@gmail.com') ||
                        localStorage.getItem('brgy360_pwd_juan.delacruz@example.com') ||
                        (storedJuan && storedJuan.password) ||
                        'UserPassword360!';
        customUser = {
          name: 'Juan Dela Cruz',
          fullName: 'Juan Dela Cruz',
          email: 'juan@gmail.com',
          password: juanPwd,
          mobile: '0917 123 4567',
          dob: '1992-06-15',
          civilStatus: 'Single',
          address: '142 Pallocan Blvd, Barangay Pallocan West',
          sitio: 'Sitio Ibaba',
          city: 'Batangas City, Batangas',
          residentId: 'PW-2026-08492',
          verified: true,
          status: 'Verified',
          verificationTier: 'Level 2: Fully Verified Resident',
          idOnRecord: 'Philippine National ID (PhilID) • ****-****-8492',
          avatarInitial: 'J'
        };
        residentDb.push(customUser);
        localStorage.setItem('brgy360_residents_db', JSON.stringify(residentDb));
      }

      if (customUser) {
        // Find expected password: check direct override key first, then customUser.password, then brgy360_user
        let expectedPassword = localStorage.getItem('brgy360_pwd_' + emailLower) || customUser.password;
        if (!expectedPassword && isDefaultJuan) {
          expectedPassword = localStorage.getItem('brgy360_pwd_juan@gmail.com') || localStorage.getItem('brgy360_pwd_juan.delacruz@example.com');
        }
        if (!expectedPassword) {
          try {
            const stUser = JSON.parse(localStorage.getItem('brgy360_user') || '{}');
            if (stUser && stUser.password && (stUser.email?.toLowerCase() === emailLower || (isDefaultJuan && (stUser.email?.toLowerCase() === 'juan@gmail.com' || stUser.email?.toLowerCase() === 'juan.delacruz@example.com')))) {
              expectedPassword = stUser.password;
            }
          } catch (e) {}
        }
        if (!expectedPassword && isDefaultJuan) {
          expectedPassword = 'UserPassword360!';
        }

        if (passVal !== expectedPassword) {
          setFieldError(loginPassword, loginPasswordError, 'Invalid resident password.');
          if (loginFeedback) {
            loginFeedback.className = 'auth-feedback-banner error';
            loginFeedback.textContent = 'Invalid credentials. Please verify your email and password.';
            loginFeedback.style.display = 'block';
          }
          return;
        }

        // ENFORCE ADMIN VERIFICATION REQUIREMENT:
        // When creating account, it must be verified first by admin before successfully creating an account / logging in
        if (customUser.status === 'Pending' || customUser.verified === false) {
          if (loginFeedback) {
            loginFeedback.className = 'auth-feedback-banner warning';
            loginFeedback.innerHTML = `
              <strong>⏳ Account Pending Admin Verification</strong><br>
              Your resident registration for <em>${escapeHtml(customUser.email)}</em> has been recorded and is currently awaiting administrator review and approval.<br>
              <span style="font-size: 12px; color: #78350f; display: block; margin-top: 4px;">
                An authorized barangay official must verify your submitted government ID and documents before your account is activated.
              </span>
              <div style="margin-top: 8px;">
                <a href="admin.html#demographics" style="display: inline-flex; align-items: center; gap: 4px; font-weight: 700; color: #0d47a1; text-decoration: underline; font-size: 12.5px;">
                  Open Admin Verification Desk to inspect &amp; approve &rarr;
                </a>
              </div>
            `;
            loginFeedback.style.display = 'block';
          }
          return;
        }

        if (customUser.status === 'Rejected') {
          if (loginFeedback) {
            loginFeedback.className = 'auth-feedback-banner error';
            loginFeedback.innerHTML = `
              <strong>✕ Account Application Declined</strong><br>
              Your registration was declined during administrative verification: <em>${escapeHtml(customUser.rejectionReason || 'Requirements not met')}</em>.<br>
              ${customUser.rejectionNotes ? `<small style="display:block; margin-top:4px;">Notes: ${escapeHtml(customUser.rejectionNotes)}</small>` : ''}
              Please visit Barangay Pallocan West Hall or submit a new registration with valid documents.
            `;
            loginFeedback.style.display = 'block';
          }
          return;
        }

        // If verified by admin, allow resident portal access
        localStorage.setItem('currentUserRole', 'resident');
        localStorage.setItem('brgy360_session', 'active');
        localStorage.setItem('brgy360_user', JSON.stringify({
          ...customUser,
          password: passVal
        }));

        if (loginFeedback) {
          loginFeedback.className = 'auth-feedback-banner success';
          loginFeedback.textContent = `Welcome back, ${customUser.name || customUser.fullName}! Logging you in to the resident portal...`;
          loginFeedback.style.display = 'block';
        }
        setTimeout(function () {
          closeAuthModal();
          loginForm.reset();
          clearAuthFeedback();
          window.location.href = 'user.html';
        }, 600);
        return;
      }

      // Invalid credentials
      setFieldError(loginEmail, loginEmailError, 'Account not found with this email.');
      setFieldError(loginPassword, loginPasswordError, 'Invalid email or password.');
      if (loginFeedback) {
        loginFeedback.className = 'auth-feedback-banner error';
        loginFeedback.textContent = 'Invalid credentials. Please verify your email and password.';
        loginFeedback.style.display = 'block';
      }
    });
  }

  // 4. Client-Side Validation & File Management: Registration Form
  const regFullName = document.getElementById('regFullName');
  const regGender = document.getElementById('regGender');
  const regCivilStatus = document.getElementById('regCivilStatus');
  const regMobile = document.getElementById('regMobile');
  const regDob = document.getElementById('regDob');
  const regAge = document.getElementById('regAge');
  const regEmail = document.getElementById('regEmail');
  const regAddress = document.getElementById('regAddress');
  const regSitio = document.getElementById('regSitio');
  const regIdType = document.getElementById('regIdType');
  const regProofType = document.getElementById('regProofType');
  const regPassword = document.getElementById('regPassword');
  const regConfirmPassword = document.getElementById('regConfirmPassword');

  const regFullNameError = document.getElementById('regFullNameError');
  const regGenderError = document.getElementById('regGenderError');
  const regCivilStatusError = document.getElementById('regCivilStatusError');
  const regMobileError = document.getElementById('regMobileError');
  const regDobError = document.getElementById('regDobError');
  const regAgeError = document.getElementById('regAgeError');
  const regEmailError = document.getElementById('regEmailError');
  const regAddressError = document.getElementById('regAddressError');
  const regSitioError = document.getElementById('regSitioError');
  const regIdFileError = document.getElementById('regIdFileError');
  const regProofFileError = document.getElementById('regProofFileError');
  const regPasswordError = document.getElementById('regPasswordError');
  const regConfirmPasswordError = document.getElementById('regConfirmPasswordError');
  const registerFeedback = document.getElementById('registerFeedback');

  // File Upload Elements
  const regIdFile = document.getElementById('regIdFile');
  const regIdDropzone = document.getElementById('regIdDropzone');
  const regIdPreviewCard = document.getElementById('regIdPreviewCard');
  const regIdPreviewThumb = document.getElementById('regIdPreviewThumb');
  const regIdPreviewIcon = document.getElementById('regIdPreviewIcon');
  const regIdFileName = document.getElementById('regIdFileName');
  const regIdFileSize = document.getElementById('regIdFileSize');
  const btnRemoveRegIdFile = document.getElementById('btnRemoveRegIdFile');

  const regProofFile = document.getElementById('regProofFile');
  const regProofDropzone = document.getElementById('regProofDropzone');
  const regProofPreviewCard = document.getElementById('regProofPreviewCard');
  const regProofPreviewThumb = document.getElementById('regProofPreviewThumb');
  const regProofPreviewIcon = document.getElementById('regProofPreviewIcon');
  const regProofFileName = document.getElementById('regProofFileName');
  const regProofFileSize = document.getElementById('regProofFileSize');
  const btnRemoveRegProofFile = document.getElementById('btnRemoveRegProofFile');

  // In-memory attachment records
  let currentRegIdAttachment = null;
  let currentRegProofAttachment = null;

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function computeAge(dobString) {
    if (!dobString) return 28;
    const birth = new Date(dobString);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return isNaN(age) || age < 1 ? 28 : age;
  }

  // Handle ID File Selection
  function processIdFile(file) {
    if (!file) return;
    clearFieldError(null, regIdFileError);

    const isImage = file.type.startsWith('image/');
    const reader = new FileReader();

    reader.onload = function (e) {
      const dataUrl = e.target.result;
      currentRegIdAttachment = {
        name: file.name,
        size: formatBytes(file.size),
        type: file.type,
        isImage: isImage,
        dataUrl: dataUrl
      };

      if (regIdFileName) regIdFileName.textContent = file.name;
      if (regIdFileSize) regIdFileSize.textContent = formatBytes(file.size);

      if (isImage && regIdPreviewThumb) {
        regIdPreviewThumb.src = dataUrl;
        regIdPreviewThumb.style.display = 'block';
        if (regIdPreviewIcon) regIdPreviewIcon.style.display = 'none';
      } else {
        if (regIdPreviewThumb) regIdPreviewThumb.style.display = 'none';
        if (regIdPreviewIcon) regIdPreviewIcon.style.display = 'flex';
      }

      if (regIdPreviewCard) regIdPreviewCard.style.display = 'flex';
      if (regIdDropzone) regIdDropzone.style.display = 'none';
    };

    reader.readAsDataURL(file);
  }

  if (regIdDropzone && regIdFile) {
    regIdDropzone.addEventListener('click', () => regIdFile.click());
    regIdDropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        regIdFile.click();
      }
    });

    regIdDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      regIdDropzone.classList.add('dragover');
    });

    regIdDropzone.addEventListener('dragleave', () => {
      regIdDropzone.classList.remove('dragover');
    });

    regIdDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      regIdDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processIdFile(e.dataTransfer.files[0]);
      }
    });

    regIdFile.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        processIdFile(this.files[0]);
      }
    });
  }

  if (btnRemoveRegIdFile) {
    btnRemoveRegIdFile.addEventListener('click', function () {
      currentRegIdAttachment = null;
      if (regIdFile) regIdFile.value = '';
      if (regIdPreviewCard) regIdPreviewCard.style.display = 'none';
      if (regIdDropzone) regIdDropzone.style.display = 'flex';
    });
  }

  // Handle Proof of Residency File Selection (Optional)
  function processProofFile(file) {
    if (!file) return;
    clearFieldError(null, regProofFileError);

    const isImage = file.type.startsWith('image/');
    const reader = new FileReader();

    reader.onload = function (e) {
      const dataUrl = e.target.result;
      currentRegProofAttachment = {
        name: file.name,
        size: formatBytes(file.size),
        type: file.type,
        isImage: isImage,
        dataUrl: dataUrl
      };

      if (regProofFileName) regProofFileName.textContent = file.name;
      if (regProofFileSize) regProofFileSize.textContent = formatBytes(file.size);

      if (isImage && regProofPreviewThumb) {
        regProofPreviewThumb.src = dataUrl;
        regProofPreviewThumb.style.display = 'block';
        if (regProofPreviewIcon) regProofPreviewIcon.style.display = 'none';
      } else {
        if (regProofPreviewThumb) regProofPreviewThumb.style.display = 'none';
        if (regProofPreviewIcon) regProofPreviewIcon.style.display = 'flex';
      }

      if (regProofPreviewCard) regProofPreviewCard.style.display = 'flex';
      if (regProofDropzone) regProofDropzone.style.display = 'none';
    };

    reader.readAsDataURL(file);
  }

  if (regProofDropzone && regProofFile) {
    regProofDropzone.addEventListener('click', () => regProofFile.click());
    regProofDropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        regProofFile.click();
      }
    });

    regProofDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      regProofDropzone.classList.add('dragover');
    });

    regProofDropzone.addEventListener('dragleave', () => {
      regProofDropzone.classList.remove('dragover');
    });

    regProofDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      regProofDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processProofFile(e.dataTransfer.files[0]);
      }
    });

    regProofFile.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        processProofFile(this.files[0]);
      }
    });
  }

  if (btnRemoveRegProofFile) {
    btnRemoveRegProofFile.addEventListener('click', function () {
      currentRegProofAttachment = null;
      if (regProofFile) regProofFile.value = '';
      if (regProofPreviewCard) regProofPreviewCard.style.display = 'none';
      if (regProofDropzone) regProofDropzone.style.display = 'flex';
    });
  }

  // Immediate inline feedback for confirm password matching
  function validatePasswordConfirmation() {
    if (!regConfirmPassword || !regPassword) return true;
    const p1 = regPassword.value;
    const p2 = regConfirmPassword.value;
    if (p2.length > 0 && p1 !== p2) {
      setFieldError(regConfirmPassword, regConfirmPasswordError, 'Passwords do not match.');
      return false;
    } else {
      clearFieldError(regConfirmPassword, regConfirmPasswordError);
      return true;
    }
  }

  if (regConfirmPassword) {
    regConfirmPassword.addEventListener('input', validatePasswordConfirmation);
  }
  if (regPassword) {
    regPassword.addEventListener('input', function () {
      clearFieldError(regPassword, regPasswordError);
      if (regConfirmPassword && regConfirmPassword.value.length > 0) {
        validatePasswordConfirmation();
      }
    });
  }

  // Date of Birth & Age synchronization
  if (regDob) {
    // Set max date for birthdate to today
    const todayStr = new Date().toISOString().split('T')[0];
    regDob.setAttribute('max', todayStr);

    regDob.addEventListener('change', function () {
      if (regDob.value) {
        const calculatedAge = computeAge(regDob.value);
        if (regAge) {
          regAge.value = calculatedAge;
          clearFieldError(regAge, regAgeError);
        }
        clearFieldError(regDob, regDobError);
      }
    });
  }

  // Real-time restriction: Name (Letters and spaces only)
  if (regFullName) {
    regFullName.addEventListener('input', function () {
      const original = this.value;
      const sanitized = original.replace(/[^a-zA-Z\s]/g, '');
      if (original !== sanitized) {
        this.value = sanitized;
        setFieldError(this, regFullNameError, 'Name must contain letters and spaces only. Numbers and special characters are not allowed.');
        return;
      }
      if (sanitized.trim().length >= 2) {
        clearFieldError(this, regFullNameError);
      }
    });
  }

  // Real-time restriction: Contact Number (Numeric digits only)
  if (regMobile) {
    regMobile.addEventListener('input', function () {
      const original = this.value;
      const sanitized = original.replace(/\D/g, '');
      if (original !== sanitized) {
        this.value = sanitized;
        setFieldError(this, regMobileError, 'Contact number must contain numeric digits only. Letters and special characters are not allowed.');
        return;
      }
      if (sanitized.length >= 7 && sanitized.length <= 11) {
        clearFieldError(this, regMobileError);
      }
    });
  }

  // Real-time restriction: Age (Numeric digits only)
  if (regAge) {
    regAge.addEventListener('input', function () {
      const original = this.value;
      const sanitized = original.replace(/\D/g, '');
      if (original !== sanitized) {
        this.value = sanitized;
        setFieldError(this, regAgeError, 'Age must contain numeric digits only. Letters and special characters are not allowed.');
        return;
      }
      const num = parseInt(sanitized, 10);
      if (!isNaN(num) && num >= 1 && num <= 120) {
        clearFieldError(this, regAgeError);
      }
    });
  }

  // Real-time validation: Email Address
  if (regEmail) {
    regEmail.addEventListener('input', function () {
      const val = this.value.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (emailRegex.test(val)) {
        clearFieldError(this, regEmailError);
      }
    });
  }

  // Clear errors on input for all other registration fields
  [
    [regGender, regGenderError],
    [regCivilStatus, regCivilStatusError],
    [regAddress, regAddressError],
    [regSitio, regSitioError]
  ].forEach(function (pair) {
    const el = pair[0];
    const err = pair[1];
    if (el) {
      el.addEventListener('input', function () {
        clearFieldError(el, err);
      });
      el.addEventListener('change', function () {
        clearFieldError(el, err);
      });
    }
  });

  // Post-Registration Pending Verification Modal Handlers
  const regPendingModal = document.getElementById('regPendingModal');
  const btnClosePendingModal = document.getElementById('btnClosePendingModal');
  const btnPendingToLogin = document.getElementById('btnPendingToLogin');
  const btnPendingToAdmin = document.getElementById('btnPendingToAdmin');

  function closePendingModal() {
    if (regPendingModal) regPendingModal.classList.remove('active');
  }

  if (btnClosePendingModal) btnClosePendingModal.addEventListener('click', closePendingModal);
  if (btnPendingToLogin) {
    btnPendingToLogin.addEventListener('click', function () {
      closePendingModal();
      openAuthModal();
      showLoginView();
    });
  }
  if (btnPendingToAdmin) {
    btnPendingToAdmin.addEventListener('click', function () {
      closePendingModal();
      localStorage.setItem('currentUserRole', 'admin');
      localStorage.setItem('brgy360_session', JSON.stringify({
        role: 'admin',
        email: 'admin@brgy360.gov.ph',
        name: 'Hon. Danilo M. Ramos',
        loginTime: new Date().toISOString()
      }));
      window.location.href = 'admin.html#demographics';
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;
      let firstInvalidField = null;

      function markInvalid(inputEl, errorEl, message) {
        setFieldError(inputEl, errorEl, message);
        if (!firstInvalidField && inputEl) {
          firstInvalidField = inputEl;
        }
        isValid = false;
      }

      // Full Name: Letters and spaces only. No numbers or special characters.
      const nameVal = regFullName ? regFullName.value.trim() : '';
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameVal) {
        markInvalid(regFullName, regFullNameError, 'Full legal name is required.');
      } else if (!nameRegex.test(nameVal)) {
        markInvalid(regFullName, regFullNameError, 'Name must contain letters and spaces only. Numbers and special characters are not allowed.');
      } else if (nameVal.length < 2) {
        markInvalid(regFullName, regFullNameError, 'Name must be at least 2 characters long.');
      } else {
        clearFieldError(regFullName, regFullNameError);
      }

      // Gender (Kasarian)
      const genderVal = regGender ? regGender.value : '';
      if (!genderVal) {
        markInvalid(regGender, regGenderError, 'Please select your gender.');
      } else {
        clearFieldError(regGender, regGenderError);
      }

      // Civil Status
      const civilVal = regCivilStatus ? regCivilStatus.value : '';
      if (!civilVal) {
        markInvalid(regCivilStatus, regCivilStatusError, 'Please select your civil status.');
      } else {
        clearFieldError(regCivilStatus, regCivilStatusError);
      }

      // Date of Birth
      const dobVal = regDob ? regDob.value : '';
      if (!dobVal) {
        markInvalid(regDob, regDobError, 'Date of birth is required.');
      } else {
        const d = new Date(dobVal);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (isNaN(d.getTime()) || d > today || d.getFullYear() < 1900) {
          markInvalid(regDob, regDobError, 'Please enter a valid date of birth in the past.');
        } else {
          clearFieldError(regDob, regDobError);
        }
      }

      // Age: Numeric digits only. No letters or special characters.
      const ageVal = regAge ? regAge.value.trim() : '';
      const digitsRegex = /^\d+$/;
      if (!ageVal) {
        markInvalid(regAge, regAgeError, 'Age is required.');
      } else if (!digitsRegex.test(ageVal)) {
        markInvalid(regAge, regAgeError, 'Age must contain numeric digits only. Letters and special characters are not allowed.');
      } else {
        const ageNum = parseInt(ageVal, 10);
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          markInvalid(regAge, regAgeError, 'Please enter a valid age between 1 and 120.');
        } else {
          clearFieldError(regAge, regAgeError);
        }
      }

      // Mobile Number: Numeric digits only. No letters or special characters.
      const mobileVal = regMobile ? regMobile.value.trim() : '';
      if (!mobileVal) {
        markInvalid(regMobile, regMobileError, 'Contact number is required.');
      } else if (!digitsRegex.test(mobileVal)) {
        markInvalid(regMobile, regMobileError, 'Contact number must contain numeric digits only. Letters and special characters are not allowed.');
      } else if (mobileVal.length < 7 || mobileVal.length > 11) {
        markInvalid(regMobile, regMobileError, 'Contact number must be between 7 and 11 numeric digits (e.g. 09171234567).');
      } else {
        clearFieldError(regMobile, regMobileError);
      }

      // Email Address: Validate format
      const emailVal = regEmail ? regEmail.value.trim() : '';
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailVal) {
        markInvalid(regEmail, regEmailError, 'Email address is required.');
      } else if (!emailRegex.test(emailVal)) {
        markInvalid(regEmail, regEmailError, 'Please enter a valid email address (e.g. resident@example.com).');
      } else {
        clearFieldError(regEmail, regEmailError);
      }

      // Address
      const addressVal = regAddress ? regAddress.value.trim() : '';
      if (!addressVal) {
        markInvalid(regAddress, regAddressError, 'Address is required.');
      } else if (addressVal.length < 5) {
        markInvalid(regAddress, regAddressError, 'Address must be at least 5 characters long.');
      } else {
        clearFieldError(regAddress, regAddressError);
      }

      // Sitio / Purok
      const sitioVal = regSitio ? regSitio.value : '';
      if (!sitioVal) {
        markInvalid(regSitio, regSitioError, 'Sitio / Purok is required.');
      } else {
        clearFieldError(regSitio, regSitioError);
      }

      // ID Type & Submit ID (picture / attachment)
      const idTypeVal = regIdType ? regIdType.value : 'Philippine National ID (PhilID)';
      if (!currentRegIdAttachment) {
        setFieldError(null, regIdFileError, 'Please submit your government ID photo or scanned attachment.');
        if (regIdDropzone) {
          regIdDropzone.style.borderColor = '#ef4444';
          if (!firstInvalidField) firstInvalidField = regIdDropzone;
        }
        isValid = false;
      } else {
        clearFieldError(null, regIdFileError);
        if (regIdDropzone) regIdDropzone.style.borderColor = '';
      }

      // Proof of Residency (Optional)
      const proofTypeVal = regProofType ? regProofType.value : '';

      // Password
      const passVal = regPassword ? regPassword.value : '';
      if (!passVal) {
        markInvalid(regPassword, regPasswordError, 'Password is required.');
      } else if (passVal.length < 8) {
        markInvalid(regPassword, regPasswordError, 'Password must be at least 8 characters long.');
      } else {
        clearFieldError(regPassword, regPasswordError);
      }

      // Confirm Password
      const confirmVal = regConfirmPassword ? regConfirmPassword.value : '';
      if (!confirmVal) {
        markInvalid(regConfirmPassword, regConfirmPasswordError, 'Please confirm your password.');
      } else if (passVal !== confirmVal) {
        markInvalid(regConfirmPassword, regConfirmPasswordError, 'Passwords do not match.');
      } else {
        clearFieldError(regConfirmPassword, regConfirmPasswordError);
      }

      if (!isValid) {
        if (firstInvalidField) {
          firstInvalidField.focus();
          firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const applicantAge = parseInt(ageVal, 10) || computeAge(dobVal);
      const generatedResidentId = 'PW-2026-' + Math.floor(10000 + Math.random() * 90000);
      const generatedIdNumber = '4829-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
      const generatedProofNumber = proofTypeVal ? ('DOC-PW-' + Math.floor(1000000 + Math.random() * 9000000)) : null;

      // Note: MUST BE VERIFIED FIRST BY ADMIN BEFORE SUCCESSFULLY CREATING AN ACTIVE ACCOUNT
      const newUserData = {
        name: nameVal,
        fullName: nameVal,
        email: emailVal,
        mobile: mobileVal,
        dob: dobVal,
        age: applicantAge,
        gender: genderVal,
        civilStatus: civilVal,
        address: addressVal,
        sitio: sitioVal,
        city: 'Batangas City, Batangas',
        residentId: generatedResidentId,
        verified: false,
        status: 'Pending',
        verificationTier: 'Pending Administrative Verification',
        idType: idTypeVal,
        idNumber: generatedIdNumber,
        idAttachmentName: currentRegIdAttachment ? currentRegIdAttachment.name : null,
        idAttachmentData: currentRegIdAttachment ? currentRegIdAttachment.dataUrl : null,
        idOnRecord: `${idTypeVal} • Pending Admin Verification`,
        proofType: proofTypeVal || 'Not Provided (Optional)',
        proofNumber: generatedProofNumber,
        proofIssuer: proofTypeVal || 'None',
        proofAttachmentName: currentRegProofAttachment ? currentRegProofAttachment.name : null,
        proofAttachmentData: currentRegProofAttachment ? currentRegProofAttachment.dataUrl : null,
        avatarInitial: nameVal.charAt(0).toUpperCase(),
        password: passVal,
        submittedAt: new Date().toISOString()
      };

      // 1. Persist into registered residents database (marked as Pending)
      try {
        const residentsDb = JSON.parse(localStorage.getItem('brgy360_residents_db') || '[]');
        // Remove prior pending with same email if re-submitting
        const filteredDb = residentsDb.filter(u => !u.email || u.email.toLowerCase() !== emailVal.toLowerCase());
        filteredDb.push(newUserData);
        localStorage.setItem('brgy360_residents_db', JSON.stringify(filteredDb));
      } catch (err) {
        console.warn('Error saving to residents db:', err);
      }

      // 2. Queue into admin Resident Verification desk
      try {
        const stored = localStorage.getItem('brgy360_resident_applications');
        let apps = stored ? JSON.parse(stored) : [];
        const nextId = 'VER-2026-' + String(apps.length + 1).padStart(3, '0');
        const today = new Date();
        const dateFormatted = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        // Remove prior duplicate application if re-submitting
        apps = apps.filter(a => !a.email || a.email.toLowerCase() !== emailVal.toLowerCase());

        apps.unshift({
          id: nextId,
          fullName: nameVal,
          email: emailVal,
          mobile: mobileVal,
          dob: dobVal,
          age: applicantAge,
          gender: genderVal,
          civilStatus: civilVal,
          address: addressVal,
          sitio: sitioVal,
          registeredDate: dateFormatted,
          status: 'Pending',
          channel: 'Resident Portal Self-Registration',
          idType: idTypeVal,
          idNumber: generatedIdNumber,
          idAttachmentName: currentRegIdAttachment ? currentRegIdAttachment.name : null,
          idAttachmentData: currentRegIdAttachment ? currentRegIdAttachment.dataUrl : null,
          proofType: proofTypeVal || 'None Provided (Optional)',
          proofNumber: generatedProofNumber || 'N/A',
          proofIssuer: proofTypeVal || 'None',
          proofAttachmentName: currentRegProofAttachment ? currentRegProofAttachment.name : null,
          proofAttachmentData: currentRegProofAttachment ? currentRegProofAttachment.dataUrl : null,
          rejectionReason: null,
          rejectionNotes: null,
          reviewedAt: null,
          activationToken: null
        });
        localStorage.setItem('brgy360_resident_applications', JSON.stringify(apps));
      } catch (err) {
        console.warn('Could not update resident applications list:', err);
      }

      // 3. Populate and show Post-Registration Pending Modal
      const summaryPendingName = document.getElementById('summaryPendingName');
      const summaryPendingEmail = document.getElementById('summaryPendingEmail');
      const summaryPendingGenderCivil = document.getElementById('summaryPendingGenderCivil');
      const summaryPendingIdType = document.getElementById('summaryPendingIdType');
      const summaryPendingProofType = document.getElementById('summaryPendingProofType');

      if (summaryPendingName) summaryPendingName.textContent = nameVal;
      if (summaryPendingEmail) summaryPendingEmail.textContent = emailVal;
      if (summaryPendingGenderCivil) summaryPendingGenderCivil.textContent = `${genderVal} · ${civilVal}`;
      if (summaryPendingIdType) {
        summaryPendingIdType.textContent = `${idTypeVal} ${currentRegIdAttachment ? `(${currentRegIdAttachment.name})` : ''}`;
      }
      if (summaryPendingProofType) {
        summaryPendingProofType.textContent = proofTypeVal
          ? `${proofTypeVal} ${currentRegProofAttachment ? `(${currentRegProofAttachment.name})` : ''}`
          : 'None attached (Optional)';
      }

      // Close auth modal and show pending modal
      closeAuthModal();
      if (regPendingModal) regPendingModal.classList.add('active');

      // Reset registration form & attachments
      registerForm.reset();
      currentRegIdAttachment = null;
      currentRegProofAttachment = null;
      if (regIdPreviewCard) regIdPreviewCard.style.display = 'none';
      if (regIdDropzone) {
        regIdDropzone.style.display = 'flex';
        regIdDropzone.style.borderColor = '#cbd5e1';
      }
      if (regProofPreviewCard) regProofPreviewCard.style.display = 'none';
      if (regProofDropzone) regProofDropzone.style.display = 'flex';
      clearAuthFeedback();

      // Pre-fill login email for quick check
      if (loginEmail) loginEmail.value = emailVal;
    });
  }

  // In-app Toast Notification Engine (Avoids window.alert)
  function showPublicToast(title, message, type = 'success') {
    let toastContainer = document.getElementById('publicToastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'publicToastContainer';
      toastContainer.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 10000; display: flex; flex-direction: column; gap: 10px; max-width: 400px; pointer-events: none;';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.style.cssText = 'background: #ffffff; color: #0f172a; padding: 14px 18px; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1); border-left: 4px solid #0d47a1; font-family: "Poppins", sans-serif; pointer-events: auto; display: flex; flex-direction: column; gap: 4px; animation: slideInToast 0.3s ease;';
    if (type === 'success') toast.style.borderLeftColor = '#16a34a';
    if (type === 'warning') toast.style.borderLeftColor = '#d97706';

    toast.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
        <strong style="font-size: 14px; font-weight: 700; color: #0f172a;">${title}</strong>
        <button type="button" style="background: none; border: none; font-size: 18px; line-height: 1; cursor: pointer; color: #94a3b8;">&times;</button>
      </div>
      <p style="margin: 0; font-size: 12.5px; color: #475569; line-height: 1.5; white-space: pre-line;">${message}</p>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => toast.remove());

    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 6000);
  }

  // 5. Document Request Form Handler
  if (docServiceForm) {
    docServiceForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const docType = document.getElementById('docType').value;
      const refNumber = 'BRGY-' + Math.floor(100000 + Math.random() * 900000);
      showPublicToast(
        'Request Submitted Successfully',
        'Salamat! Your request for ' + docType + ' has been submitted.\nReference Number: ' + refNumber + '\nPlease claim it at the Barangay Hall within 1-2 business days.',
        'success'
      );
      docServiceForm.reset();
    });
  }

  // 6. Reports and Complaints Form Handler
  if (complaintReportForm) {
    complaintReportForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const reportType = document.getElementById('reportCategory').value;
      const ticketId = 'TCK-' + Math.floor(1000 + Math.random() * 9000);
      showPublicToast(
        'Report Logged Securely',
        'Your report has been securely recorded.\nIncident Ticket ID: ' + ticketId + '\nCategory: ' + reportType + '\nThe Barangay Council and Tanods have been notified.',
        'success'
      );
      complaintReportForm.reset();
    });
  }

  // 7. Citizen Project Proposal Form Handler
  if (projectProposalForm) {
    projectProposalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const title = (document.getElementById('proposalTitle')?.value || '').trim() || 'Citizen Community Proposal';
      const proposalCode = 'PROP-2026-' + Math.floor(100 + Math.random() * 900);

      try {
        const stored = JSON.parse(localStorage.getItem('brgy360_proposals') || '[]');
        stored.unshift({
          id: proposalCode,
          ref: proposalCode,
          title: title,
          category: 'Infrastructure',
          location: 'Barangay Pallocan West',
          sitio: 'Sitio Ibaba',
          budget: '₱100,000.00',
          rawBudget: 100000,
          timeline: 'Q1 2027 (3 months implementation)',
          dateFiled: new Date().toISOString().split('T')[0],
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          year: '2026',
          status: 'Pending',
          proponent: 'Citizen Submitter',
          email: '',
          description: 'Grassroots community proposal submitted through the public portal.',
          rationale: 'Grassroots community proposal submitted through the public portal.',
          councilNote: 'Received by Barangay Development Council Secretariat. Queued for technical review.',
          councilNotes: 'Received by Barangay Development Council Secretariat. Queued for technical review.'
        });
        localStorage.setItem('brgy360_proposals', JSON.stringify(stored));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('brgy360_proposals_changed', { detail: stored }));
      } catch (err) {}

      showPublicToast(
        'Project Proposal Received',
        'Thank you! Your project proposal for "' + title + '" has been received.\nTracking ID: ' + proposalCode + '\nIt will be reviewed during the Barangay Development Council planning session.',
        'success'
      );
      projectProposalForm.reset();
    });
  }
    // 8. Hero Background Slideshow
// Hero Background Slideshow
const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

if (heroSlides.length > 1) {
  setInterval(function () {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
  }, 3000); // 3 seconds per photo
}

  // 9. Projects Filter, Search, and Live Counter
  const projectSearchInput = document.getElementById('projectSearchInput');
  const projectStatusFilter = document.getElementById('projectStatusFilter');
  const projectYearFilter = document.getElementById('projectYearFilter');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const emptyStateResetBtn = document.getElementById('emptyStateResetBtn');
  const projectsGrid = document.getElementById('projectsGrid');
  const emptyState = document.getElementById('projectsEmptyState');
  const visibleProjectsCount = document.getElementById('visibleProjectsCount');

  if (projectsGrid) {
    const projectCards = Array.from(projectsGrid.querySelectorAll('.project-card'));

    function applyProjectFilters() {
      const searchQuery = (projectSearchInput ? projectSearchInput.value : '').trim().toLowerCase();
      const statusFilter = projectStatusFilter ? projectStatusFilter.value.toLowerCase() : 'all';
      const yearFilter = projectYearFilter ? projectYearFilter.value.toLowerCase() : 'all';

      // Show/hide clear search button
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchQuery.length > 0 ? 'flex' : 'none';
      }

      // Check if any non-default filter is active
      const hasActiveFilters = searchQuery.length > 0 || statusFilter !== 'all' || yearFilter !== 'all';
      if (resetFiltersBtn) {
        resetFiltersBtn.style.display = hasActiveFilters ? 'inline-block' : 'none';
      }

      let visibleCount = 0;

      projectCards.forEach(function (card) {
        const cardStatus = (card.getAttribute('data-status') || '').toLowerCase();
        const cardYear = (card.getAttribute('data-year') || '').toLowerCase();
        const cardText = card.textContent.toLowerCase();

        const matchesStatus = statusFilter === 'all' || cardStatus === statusFilter;
        const matchesYear = yearFilter === 'all' || cardYear === yearFilter;
        const matchesSearch = searchQuery === '' || cardText.includes(searchQuery);

        if (matchesStatus && matchesYear && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (visibleProjectsCount) {
        visibleProjectsCount.textContent = visibleCount;
      }

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    if (projectSearchInput) {
      projectSearchInput.addEventListener('input', applyProjectFilters);
    }

    if (projectStatusFilter) {
      projectStatusFilter.addEventListener('change', applyProjectFilters);
    }

    if (projectYearFilter) {
      projectYearFilter.addEventListener('change', applyProjectFilters);
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', function () {
        projectSearchInput.value = '';
        projectSearchInput.focus();
        applyProjectFilters();
      });
    }

    function resetAllFilters() {
      if (projectSearchInput) projectSearchInput.value = '';
      if (projectStatusFilter) projectStatusFilter.value = 'all';
      if (projectYearFilter) projectYearFilter.value = 'all';
      applyProjectFilters();
    }

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', resetAllFilters);
    }

    if (emptyStateResetBtn) {
      emptyStateResetBtn.addEventListener('click', resetAllFilters);
    }
  }

  // 10. Propose a Project Modal Logic
  const proposeModal = document.getElementById('proposeProjectModal');
  const openProposeModalBtn = document.getElementById('openProposeModalBtn');
  const closeProposeModalBtn = document.getElementById('closeProposeModalBtn');
  const cancelProposeModalBtn = document.getElementById('cancelProposeModalBtn');
  const dismissSuccessModalBtn = document.getElementById('dismissSuccessModalBtn');
  const modalProposeForm = document.getElementById('modalProposeForm');
  const modalSuccessState = document.getElementById('modalSuccessState');
  const successTrackingId = document.getElementById('successTrackingId');

  function openProposeModal() {
    if (!proposeModal) return;
    proposeModal.style.display = 'flex';
    // Allow display:flex to register before transition class
    requestAnimationFrame(function () {
      proposeModal.classList.add('active', 'is-open');
      proposeModal.setAttribute('aria-hidden', 'false');
    });
    // Focus first input
    const firstInput = document.getElementById('modalProjectName');
    if (firstInput) {
      setTimeout(function () { firstInput.focus(); }, 100);
    }
  }

  function closeProposeModal() {
    if (!proposeModal) return;
    proposeModal.classList.remove('active', 'is-open');
    proposeModal.setAttribute('aria-hidden', 'true');
    setTimeout(function () {
      proposeModal.style.display = 'none';
      // Reset view to form if it was in success state
      if (modalProposeForm) modalProposeForm.style.display = 'block';
      if (modalSuccessState) modalSuccessState.style.display = 'none';
    }, 250);
  }

  if (openProposeModalBtn) {
    openProposeModalBtn.addEventListener('click', openProposeModal);
  }

  if (closeProposeModalBtn) {
    closeProposeModalBtn.addEventListener('click', closeProposeModal);
  }

  if (cancelProposeModalBtn) {
    cancelProposeModalBtn.addEventListener('click', closeProposeModal);
  }

  if (dismissSuccessModalBtn) {
    dismissSuccessModalBtn.addEventListener('click', function () {
      closeProposeModal();
      if (modalProposeForm) modalProposeForm.reset();
    });
  }

  // Close on backdrop click
  if (proposeModal) {
    proposeModal.addEventListener('click', function (e) {
      if (e.target === proposeModal) {
        closeProposeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && proposeModal && (proposeModal.classList.contains('active') || proposeModal.classList.contains('is-open'))) {
      closeProposeModal();
    }
  });

  // Modal Form Validation & Submission
  if (modalProposeForm) {
    const propNameEl = document.getElementById('modalProponentName');
    const propPhoneEl = document.getElementById('modalProponentPhone');
    const propEmailEl = document.getElementById('modalProponentEmail');
    const propBudgetEl = document.getElementById('modalProjectBudget');

    // Real-time restriction: Name (Letters and spaces only)
    if (propNameEl) {
      propNameEl.addEventListener('input', function () {
        const original = this.value;
        const sanitized = original.replace(/[^a-zA-Z\s]/g, '');
        if (original !== sanitized) {
          this.value = sanitized;
          const errEl = document.getElementById('errorProponentName');
          if (errEl) {
            errEl.textContent = 'Name must contain letters and spaces only. Numbers and special characters are not allowed.';
            errEl.classList.add('is-visible');
          }
          this.classList.add('has-error');
          return;
        }
        if (sanitized.trim().length >= 2) {
          this.classList.remove('has-error');
          const errEl = document.getElementById('errorProponentName');
          if (errEl) errEl.classList.remove('is-visible');
        }
      });
    }

    // Real-time restriction: Phone / Mobile (Numeric digits only)
    if (propPhoneEl) {
      propPhoneEl.addEventListener('input', function () {
        const original = this.value;
        const sanitized = original.replace(/\D/g, '');
        if (original !== sanitized) {
          this.value = sanitized;
          const errEl = document.getElementById('errorProponentPhone');
          if (errEl) {
            errEl.textContent = 'Contact number must contain numeric digits only. Letters and special characters are not allowed.';
            errEl.classList.add('is-visible');
          }
          this.classList.add('has-error');
          return;
        }
        if (sanitized.length >= 7 && sanitized.length <= 11) {
          this.classList.remove('has-error');
          const errEl = document.getElementById('errorProponentPhone');
          if (errEl) errEl.classList.remove('is-visible');
        }
      });
    }

    // Real-time restriction: Budget (Numeric digits only)
    if (propBudgetEl) {
      propBudgetEl.addEventListener('input', function () {
        const original = this.value;
        const sanitized = original.replace(/\D/g, '');
        if (original !== sanitized) {
          this.value = sanitized;
        }
        if (Number(sanitized) > 0) {
          this.classList.remove('has-error');
          const errEl = document.getElementById('errorProjectBudget');
          if (errEl) errEl.classList.remove('is-visible');
        }
      });
    }

    const fieldValidators = [
      {
        inputId: 'modalProjectName',
        errorId: 'errorProjectName',
        validate: (val) => val.trim().length >= 3,
        message: 'Please provide a descriptive project name (at least 3 characters).'
      },
      {
        inputId: 'modalProjectCategory',
        errorId: 'errorProjectCategory',
        validate: (val) => Boolean(val && val.trim() !== ''),
        message: 'Please select a project category from the list.'
      },
      {
        inputId: 'modalProjectLocation',
        errorId: 'errorProjectLocation',
        validate: (val) => Boolean(val && val.trim() !== ''),
        message: 'Please specify the project location or sitio.'
      },
      {
        inputId: 'modalProjectBudget',
        errorId: 'errorProjectBudget',
        validate: (val) => /^\d+$/.test(val.trim()) && Number(val) > 0,
        message: 'Budget must contain numeric digits only and be greater than ₱0.'
      },
      {
        inputId: 'modalProjectStartDate',
        errorId: 'errorProjectStartDate',
        validate: (val) => Boolean(val && val.trim() !== ''),
        message: 'Please choose a target start date.'
      },
      {
        inputId: 'modalProjectDescription',
        errorId: 'errorProjectDescription',
        validate: (val) => val.trim().length >= 10,
        message: 'Please provide a brief justification and community benefit (at least 10 characters).'
      },
      {
        inputId: 'modalProponentName',
        errorId: 'errorProponentName',
        validate: (val) => {
          const trimmed = val.trim();
          return trimmed.length >= 2 && /^[a-zA-Z\s]+$/.test(trimmed);
        },
        message: 'Name must contain letters and spaces only. Numbers and special characters are not allowed.'
      },
      {
        inputId: 'modalProponentEmail',
        errorId: 'errorProponentEmail',
        validate: (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim()),
        message: 'Please enter a valid email address (e.g., juan@example.com).'
      },
      {
        inputId: 'modalProponentPhone',
        errorId: 'errorProponentPhone',
        validate: (val) => {
          const trimmed = val.trim();
          return /^\d+$/.test(trimmed) && trimmed.length >= 7 && trimmed.length <= 11;
        },
        message: 'Contact number must contain numeric digits only (7-11 digits).'
      }
    ];

    // Clear individual errors on input/change
    fieldValidators.forEach(function (field) {
      const el = document.getElementById(field.inputId);
      const errEl = document.getElementById(field.errorId);
      if (el) {
        el.addEventListener('input', function () {
          el.classList.remove('has-error');
          if (errEl) errEl.classList.remove('is-visible');
        });
        el.addEventListener('change', function () {
          el.classList.remove('has-error');
          if (errEl) errEl.classList.remove('is-visible');
        });
      }
    });

    modalProposeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;
      let firstInvalidEl = null;

      fieldValidators.forEach(function (field) {
        const el = document.getElementById(field.inputId);
        const errEl = document.getElementById(field.errorId);
        if (el) {
          const valid = field.validate(el.value);
          if (!valid) {
            isValid = false;
            el.classList.add('has-error');
            if (errEl) {
              errEl.textContent = field.message;
              errEl.classList.add('is-visible');
            }
            if (!firstInvalidEl) firstInvalidEl = el;
          } else {
            el.classList.remove('has-error');
            if (errEl) errEl.classList.remove('is-visible');
          }
        }
      });

      if (!isValid) {
        if (firstInvalidEl) {
          firstInvalidEl.focus();
          firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Success State
      const trackingCode = 'PROP-' + Math.floor(1000 + Math.random() * 9000);
      if (successTrackingId) {
        successTrackingId.textContent = trackingCode;
      }

      modalProposeForm.style.display = 'none';
      if (modalSuccessState) {
        modalSuccessState.style.display = 'block';
      }
      modalProposeForm.reset();
    });
  }

  // 11. Chart.js Trend Line Chart (Section 1)
  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = "'Poppins', sans-serif";
  }
  const chartCanvas = document.getElementById('projectTrendChart');
  if (chartCanvas && typeof Chart !== 'undefined') {
    new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: ['FY 2025', 'FY 2026 (Active Cycle)'],
        datasets: [{
          label: 'Completion Rate',
          data: [100, 23],
          borderColor: '#0d47a1',
          backgroundColor: 'rgba(13, 71, 161, 0.12)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#0d47a1',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return ' ' + context.dataset.label + ': ' + context.parsed.y + '%';
              }
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 25,
              callback: function (val) { return val + '%'; }
            },
            grid: {
              color: '#e2e8f0'
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // 12. SECTION 2: BARANGAY SERVICES DATA & DYNAMIC RENDERING
  const services = [
    {
      id: 'barangay-clearance',
      title: 'Barangay Clearance',
      category: 'CLEARANCE',
      description: 'Official clearance certifying residency, good moral standing, and no pending derogatory record in the barangay. Essential for employment, business licensing, and official transactions.',
      processingTime: '1 business day',
      fee: '₱50.00 (Free for First-Time Jobseekers)',
      requirements: [
        'Valid Government-issued ID (National ID, UMID, Postal ID, Driver’s License)',
        'Recent 1x1 or 2x2 ID Photo with white background',
        'Current year Community Tax Certificate (Cedula)',
        'Purok Leader endorsement or proof of billing under applicant’s name',
        'Duly signed Oath of Undertaking (if applying under RA 11261 First-Time Jobseekers Act)'
      ],
      processingInfo: [
        'Submission: Apply online or present required documents at the Barangay Hall Window 1.',
        'Record Verification: Records officer verifies residency against the Registry of Barangay Inhabitants (RBI) and Lupon blotter archives.',
        'Endorsement & Approval: Barangay Secretary certifies the document and forwards it to the Punong Barangay for executive signature.',
        'Release: Affixed with the official dry seal and tamper-evident QR verification code. Available for claiming during official hours.'
      ]
    },
    {
      id: 'certificate-of-residency',
      title: 'Certificate of Residency',
      category: 'CERTIFICATION',
      description: 'Authenticates continuous, active residency of a citizen within their designated purok. Frequently required for bank account opening, utility line connection, and court affidavits.',
      processingTime: 'Same day (within 4 hours)',
      fee: '₱50.00',
      requirements: [
        'Any valid ID bearing current local address',
        'Minimum of six (6) months continuous residence in the barangay',
        'Purok Leader Certification or recommendation note',
        'Community Tax Certificate (Cedula)'
      ],
      processingInfo: [
        'Identity & Purok check cross-referenced with Purok census databases.',
        'Preparation of certified document signed by authorized Barangay Officer.',
        'Immediate release upon presentation of claiming slip and valid ID.'
      ]
    },
    {
      id: 'certificate-of-indigency',
      title: 'Certificate of Indigency',
      category: 'ASSISTANCE',
      description: 'Issued to bonafide low-income and indigent residents seeking medical, financial, hospitalization, educational scholarship, or PAO legal assistance.',
      processingTime: 'Same day (Priority Desk)',
      fee: 'Free of Charge (Exempted by Law)',
      requirements: [
        'Valid Government ID, Student ID, or Senior Citizen / PWD Card',
        'Endorsement from Purok President confirming indigent family status',
        'Supporting proof of need (Medical abstract, hospital statement of account, tuition notice, or PAO referral)'
      ],
      processingInfo: [
        'Interview and assessment by the Barangay Social Services Officer.',
        'Expedited verification to accommodate urgent medical or financial emergencies.',
        'Dry sealed and endorsed by the Punong Barangay free of any charge.'
      ]
    },
    {
      id: 'barangay-business-clearance',
      title: 'Barangay Business Clearance',
      category: 'BUSINESS PERMIT',
      description: 'Prerequisite clearance for new commercial enterprises, sari-sari stores, or annual renewal of business operations within the jurisdiction of the barangay.',
      processingTime: '2 business days',
      fee: '₱150.00 – ₱500.00 (Graduated scale per Revenue Code)',
      requirements: [
        'DTI Business Name Registration or SEC Articles of Incorporation',
        'Lease Agreement or Proof of Real Property Ownership of business location',
        'Barangay Sanitary and Health Clearance for food handling establishments',
        'Previous year Barangay Business Clearance (if applying for renewal)',
        'Barangay Zoning Locational Endorsement'
      ],
      processingInfo: [
        'Ocular site inspection by the Barangay Committee on Commerce & Public Order.',
        'Tax assessment based on capitalization and local municipal revenue schedules.',
        'Issuance of official business clearance plaque and inspection sticker.'
      ]
    },
    {
      id: 'first-time-jobseeker',
      title: 'First-Time Jobseeker Assistance (RA 11261)',
      category: 'YOUTH & EMPLOYMENT',
      description: 'Statutory certification exempting first-time jobseekers from paying government fees for barangay clearances, police clearances, medical certificates, and NBI clearances.',
      processingTime: '1 business day',
      fee: 'Free of Charge (RA 11261)',
      requirements: [
        'Duly notarized or administered Oath of Undertaking',
        'Barangay First-Time Jobseeker Application Form',
        'Diploma, Certificate of Graduation, or School Certification of completion',
        'One (1) valid ID or validated Student ID'
      ],
      processingInfo: [
        'Validation of first-time worker status in DOLE / NYC youth registry.',
        'Issuance of official multi-agency certification valid for one (1) year from date of issue.',
        'Endorsement copy provided for filing with the municipal Public Employment Service Office (PESO).'
      ]
    },
    {
      id: 'katarungang-pambarangay',
      title: 'Katarungang Pambarangay Conciliation',
      category: 'LEGAL & CONCILIATION',
      description: 'Barangay peace-building mediation and dispute conciliation handled by the Lupong Tagapamayapa prior to judicial court litigation.',
      processingTime: '1–3 sessions (within 15 calendar days)',
      fee: 'Free of Charge',
      requirements: [
        'Formal written complaint or blotter incident statement',
        'Valid IDs of complainant and respondent',
        'Relevant supporting evidence (contracts, photographs, or witness sworn statements)'
      ],
      processingInfo: [
        'Issuance of summons by Punong Barangay to both parties within 3 business days.',
        'Mediation conference presided over by Lupon members in the Barangay Session Hall.',
        'Issuance of Amicable Settlement Agreement or Certificate to File Action (KP Form 7).'
      ]
    }
  ];

  const servicesGridView = document.getElementById('services-grid-view');
  const serviceDetailView = document.getElementById('service-detail-view');
  const servicesGridContainer = document.getElementById('servicesGridContainer');

  function renderServicesGrid() {
    if (!servicesGridContainer) return;
    servicesGridContainer.innerHTML = services.map(function (s) {
      return `
        <article class="service-card" data-service-id="${s.id}">
          <div>
            <div class="service-card-header">
              <div class="service-icon-box" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div class="service-title-group">
                <span class="service-category-tag">${s.category}</span>
                <h3 class="service-card-title">${s.title}</h3>
              </div>
            </div>
            <p class="service-card-desc">${s.description}</p>
          </div>

          <div>
            <div class="service-meta-row">
              <div class="service-meta-item">
                <svg class="service-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>${s.processingTime}</span>
              </div>
              <span class="service-meta-divider">•</span>
              <div class="service-meta-item">
                <svg class="service-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
                <span>${s.fee}</span>
              </div>
            </div>

            <button type="button" class="service-view-btn" data-id="${s.id}" aria-label="View details for ${s.title}">
              <span>View details</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Attach click listeners to view detail buttons & cards
    const viewButtons = servicesGridContainer.querySelectorAll('.service-view-btn');
    viewButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const serviceId = btn.getAttribute('data-id');
        showServiceDetail(serviceId);
      });
    });

    const cards = servicesGridContainer.querySelectorAll('.service-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        const serviceId = card.getAttribute('data-service-id');
        showServiceDetail(serviceId);
      });
    });
  }

  function showServiceDetail(serviceId) {
    const service = services.find(function (s) { return s.id === serviceId; });
    if (!service || !serviceDetailView || !servicesGridView) return;

    const requirementsListHtml = service.requirements.map(function (req) {
      return `
        <li class="detail-list-item">
          <span class="check-bullet" aria-hidden="true">✓</span>
          <span>${req}</span>
        </li>
      `;
    }).join('');

    const processingStepsHtml = service.processingInfo.map(function (step, index) {
      return `
        <li class="detail-list-item">
          <span class="step-bullet" aria-hidden="true">${index + 1}</span>
          <span>${step}</span>
        </li>
      `;
    }).join('');

    const isSessionActive = localStorage.getItem('brgy360_session') === 'active';
    let currentUserName = 'Juan Dela Cruz';
    let currentUserSitio = 'Sitio Ibaba';
    if (isSessionActive) {
      try {
        const u = JSON.parse(localStorage.getItem('brgy360_user'));
        if (u) {
          if (u.name) currentUserName = u.name;
          if (u.sitio) currentUserSitio = u.sitio;
        }
      } catch (e) {}
    }

    const actionBannerHtml = isSessionActive ? `
      <!-- Action Callout Banner (Logged In) -->
      <div class="detail-action-banner" style="background: #f0fdf4; border: 1px solid #bbf7d0;">
        <div class="action-banner-left">
          <svg class="action-alert-icon" style="color: #16a34a;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 11 14 15 10"></polyline>
          </svg>
          <p class="action-banner-text" style="color: #14532d;">
            You are signed in as <strong>${currentUserName}</strong> (${currentUserSitio} • Verified Resident). Apply online with 1 click.
          </p>
        </div>
        <div class="action-banner-buttons">
          <a href="user.html#services" class="btn-action-primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
            <span>Apply for ${service.title} in Portal &rarr;</span>
          </a>
        </div>
      </div>
    ` : `
      <!-- Action Callout Banner (Guest) -->
      <div class="detail-action-banner">
        <div class="action-banner-left">
          <svg class="action-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p class="action-banner-text">Please log in or create a resident account to request this service.</p>
        </div>
        <div class="action-banner-buttons">
          <button type="button" class="btn-action-primary" id="detailLoginBtn">Log In to Request</button>
          <button type="button" class="btn-action-secondary" id="detailRegisterBtn">Create Account</button>
        </div>
      </div>
    `;

    serviceDetailView.innerHTML = `
      <!-- Back Navigation -->
      <div class="detail-nav-bar">
        <button type="button" class="btn-back-services" id="btnBackToServices" aria-label="Return to all services">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to services</span>
        </button>
      </div>

      <!-- Dark Header Block -->
      <div class="detail-dark-header">
        <span class="detail-category-tag">${service.category}</span>
        <h2 class="detail-main-title">${service.title}</h2>
        <p class="detail-main-desc">${service.description}</p>
      </div>

      <!-- 3-Column Metric Badges Row -->
      <div class="detail-metrics-row">
        <div class="metric-card">
          <div class="metric-icon-box" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="metric-content">
            <span class="metric-label">Processing Time</span>
            <span class="metric-value">${service.processingTime}</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon-box" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          </div>
          <div class="metric-content">
            <span class="metric-label">Fee</span>
            <span class="metric-value">${service.fee}</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon-box" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <div class="metric-content">
            <span class="metric-label">Category</span>
            <span class="metric-value">${service.category}</span>
          </div>
        </div>
      </div>

      <!-- Requirements & Processing Info Cards -->
      <div class="detail-content-grid">
        <div class="detail-card">
          <h3 class="detail-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            <span>Requirements</span>
          </h3>
          <ul class="detail-items-list">
            ${requirementsListHtml}
          </ul>
        </div>

        <div class="detail-card">
          <h3 class="detail-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>Processing Information</span>
          </h3>
          <ul class="detail-items-list">
            ${processingStepsHtml}
          </ul>
        </div>
      </div>

      ${actionBannerHtml}
    `;

    // Toggle views
    servicesGridView.style.display = 'none';
    serviceDetailView.style.display = 'block';

    // Hook back button
    const backBtn = document.getElementById('btnBackToServices');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        serviceDetailView.style.display = 'none';
        servicesGridView.style.display = 'block';
      });
    }

    // Hook Auth buttons to auth modal
    const detailLoginBtn = document.getElementById('detailLoginBtn');
    if (detailLoginBtn) {
      detailLoginBtn.addEventListener('click', function () {
        openAuthModal('login');
      });
    }

    const detailRegisterBtn = document.getElementById('detailRegisterBtn');
    if (detailRegisterBtn) {
      detailRegisterBtn.addEventListener('click', function () {
        openAuthModal('register');
      });
    }

    // Scroll into view smoothly
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Initial render of services
  renderServicesGrid();

  // ==========================================================
  // 12. BUDGET & SPENDING TRANSPARENCY DASHBOARD
  // ==========================================================
  let budgetRecordsData = [
    // 2026 Fiscal Year Data
    {
      year: '2026',
      quarter: 'Q1',
      category: 'Infrastructure',
      description: 'Drainage Desiltation & Street Repair — Sitio Ibaba & Sitio Santolan',
      budget: 320000,
      actual: 310000
    },
    {
      year: '2026',
      quarter: 'Q1',
      category: 'Health',
      description: 'Q1 Medical Mission & Senior Vaccine Procurement',
      budget: 150000,
      actual: 145000
    },
    {
      year: '2026',
      quarter: 'Q1',
      category: 'Administration',
      description: 'Barangay Hall Office Supplies & IT Equipment',
      budget: 120000,
      actual: 115000
    },
    {
      year: '2026',
      quarter: 'Q1',
      category: 'Social Services',
      description: 'First Quarter Youth Leadership & Sports Camp',
      budget: 95000,
      actual: 90000
    },
    {
      year: '2026',
      quarter: 'Q2',
      category: 'Infrastructure',
      description: 'Smart Solar Streetlights Installation Phase 1',
      budget: 380000,
      actual: 325000
    },
    {
      year: '2026',
      quarter: 'Q2',
      category: 'Health',
      description: 'Child Nutrition & Deworming Outreach Program',
      budget: 110000,
      actual: 95000
    },
    {
      year: '2026',
      quarter: 'Q2',
      category: 'Administration',
      description: 'Staff Capacity Training & Semi-Annual Audit',
      budget: 80000,
      actual: 72000
    },
    {
      year: '2026',
      quarter: 'Q2',
      category: 'Social Services',
      description: 'Community Day Care Center Educational Materials',
      budget: 70000,
      actual: 56000
    },
    {
      year: '2026',
      quarter: 'Q3',
      category: 'Infrastructure',
      description: 'Flood Retaining Wall Reinforcement — Sitio Ibaba',
      budget: 300000,
      actual: 150000
    },
    {
      year: '2026',
      quarter: 'Q3',
      category: 'Health',
      description: 'Dengue Prevention & Clean Water Testing Kits',
      budget: 90000,
      actual: 60000
    },
    {
      year: '2026',
      quarter: 'Q4',
      category: 'Infrastructure',
      description: 'CCTVs & Operations Center Equipment Setup',
      budget: 260000,
      actual: 0
    },
    {
      year: '2026',
      quarter: 'Q4',
      category: 'Health',
      description: 'Year-End First Aid & Disaster Emergency Resupply',
      budget: 70000,
      actual: 0
    },
    {
      year: '2026',
      quarter: 'Q4',
      category: 'Administration',
      description: 'Fiscal Year-End Reporting & Accounting System',
      budget: 60000,
      actual: 0
    },
    {
      year: '2026',
      quarter: 'Q4',
      category: 'Social Services',
      description: 'PWD & Senior Citizens Year-End Support Package',
      budget: 80000,
      actual: 0
    },

    // 2025 Fiscal Year Data
    {
      year: '2025',
      quarter: 'Q1',
      category: 'Infrastructure',
      description: 'Barangay Hall E-Library & Tech Hub Refurbishment',
      budget: 420000,
      actual: 420000
    },
    {
      year: '2025',
      quarter: 'Q1',
      category: 'Health',
      description: 'Health Station Modernization & Diagnostic Kits',
      budget: 290000,
      actual: 290000
    },
    {
      year: '2025',
      quarter: 'Q2',
      category: 'Infrastructure',
      description: 'Sitio Gitna Central Covered Court Concrete Paving',
      budget: 350000,
      actual: 345000
    },
    {
      year: '2025',
      quarter: 'Q2',
      category: 'Administration',
      description: 'Barangay Records Digitization & Computer Terminals',
      budget: 140000,
      actual: 138000
    },
    {
      year: '2025',
      quarter: 'Q3',
      category: 'Health',
      description: 'Anti-Dengue Fogging & Clean Water Safety Project',
      budget: 180000,
      actual: 175000
    },
    {
      year: '2025',
      quarter: 'Q3',
      category: 'Social Services',
      description: 'Annual Youth Summer Sports Camp & Tournaments',
      budget: 120000,
      actual: 118000
    },
    {
      year: '2025',
      quarter: 'Q4',
      category: 'Infrastructure',
      description: 'Sitio Santolan Slope Stabilization & Pathway',
      budget: 310000,
      actual: 300000
    },
    {
      year: '2025',
      quarter: 'Q4',
      category: 'Social Services',
      description: 'Senior Citizens & PWD Year-End Livelihood Aid',
      budget: 170000,
      actual: 164000
    }
  ];

  try {
    const savedBudget = localStorage.getItem('brgy360_budget_records');
    if (savedBudget) {
      const parsed = JSON.parse(savedBudget);
      if (Array.isArray(parsed) && parsed.length > 0) {
        budgetRecordsData = parsed;
      }
    }
  } catch (e) {}

  // DOM Elements for Budget Dashboard
  const budgetYearFilter = document.getElementById('budgetYearFilter');
  const budgetQuarterFilter = document.getElementById('budgetQuarterFilter');
  const budgetCategoryFilter = document.getElementById('budgetCategoryFilter');
  const budgetResetFiltersBtn = document.getElementById('budgetResetFiltersBtn');

  // KPI elements
  const kpiTotalBudget = document.getElementById('kpiTotalBudget');
  const kpiTotalSpending = document.getElementById('kpiTotalSpending');
  const kpiRemainingBudget = document.getElementById('kpiRemainingBudget');
  const kpiUtilizationRate = document.getElementById('kpiUtilizationRate');

  // Progress Bar elements
  const utilizationBadge = document.getElementById('utilizationBadge');
  const utilSpentBar = document.getElementById('utilSpentBar');
  const utilRemainingBar = document.getElementById('utilRemainingBar');
  const utilSubtextLabel = document.getElementById('utilSubtextLabel');
  const utilProgressBar = document.getElementById('utilProgressBar');

  // Table elements
  const btnToggleBudgetRecords = document.getElementById('btnToggleBudgetRecords');
  const budgetRecordsTableContainer = document.getElementById('budgetRecordsTableContainer');
  const budgetRecordsTbody = document.getElementById('budgetRecordsTbody');
  const budgetTableItemCount = document.getElementById('budgetTableItemCount');
  const toggleRecordsText = document.getElementById('toggleRecordsText');

  // Currency Formatter
  function formatCurrencyPHP(amount) {
    return '₱' + Number(amount).toLocaleString('en-PH');
  }

  // Chart instances
  let quarterBarChart = null;
  let categoryPieChart = null;

  function initBudgetCharts() {
    if (typeof Chart === 'undefined') return;

    // 1. Dual Bar Chart (Budget vs Actual per Quarter)
    const quarterCanvas = document.getElementById('budgetQuarterBarChart');
    if (quarterCanvas) {
      const ctx1 = quarterCanvas.getContext('2d');
      quarterBarChart = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [
            {
              label: 'Budget',
              data: [685000, 640000, 390000, 470000],
              backgroundColor: '#0d47a1',
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.6
            },
            {
              label: 'Actual',
              data: [660000, 548000, 210000, 0],
              backgroundColor: '#f59e0b',
              borderRadius: 6,
              barPercentage: 0.65,
              categoryPercentage: 0.6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              align: 'end',
              labels: {
                boxWidth: 12,
                boxHeight: 12,
                useBorderRadius: true,
                borderRadius: 3,
                font: { family: 'Poppins', size: 12, weight: 600 },
                color: '#334155',
                padding: 12
              }
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleFont: { family: 'Poppins', size: 13, weight: 700 },
              bodyFont: { family: 'Poppins', size: 12 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: function (context) {
                  return context.dataset.label + ': ' + formatCurrencyPHP(context.raw);
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { family: 'Poppins', size: 12, weight: 600 },
                color: '#475569'
              }
            },
            y: {
              beginAtZero: true,
              grid: { color: '#f1f5f9' },
              ticks: {
                font: { family: 'Poppins', size: 11 },
                color: '#64748b',
                callback: function (value) {
                  return '₱' + (value / 1000).toLocaleString() + 'k';
                }
              }
            }
          }
        }
      });
    }

    // 2. Doughnut / Pie Chart (Spending by Category)
    const categoryCanvas = document.getElementById('budgetCategoryPieChart');
    if (categoryCanvas) {
      const ctx2 = categoryCanvas.getContext('2d');
      categoryPieChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Infrastructure', 'Health', 'Administration', 'Social Services'],
          datasets: [
            {
              data: [785000, 300000, 187000, 146000],
              backgroundColor: ['#0d47a1', '#16a34a', '#f59e0b', '#7c3aed'],
              borderWidth: 2,
              borderColor: '#ffffff',
              hoverOffset: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '62%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                boxHeight: 10,
                useBorderRadius: true,
                borderRadius: 5,
                font: { family: 'Poppins', size: 11.5, weight: 500 },
                color: '#334155',
                padding: 14
              }
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleFont: { family: 'Poppins', size: 13, weight: 700 },
              bodyFont: { family: 'Poppins', size: 12 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: function (context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? Math.round((context.raw / total) * 100) : 0;
                  return ' ' + context.label + ': ' + formatCurrencyPHP(context.raw) + ' (' + pct + '%)';
                }
              }
            }
          }
        }
      });
    }
  }

  // Update Dashboard and Charts based on current filters
  function updateBudgetDashboard() {
    const selectedYear = budgetYearFilter ? budgetYearFilter.value : '2026';
    const selectedQuarter = budgetQuarterFilter ? budgetQuarterFilter.value : 'all';
    const selectedCategory = budgetCategoryFilter ? budgetCategoryFilter.value : 'all';

    // Show or hide Reset Filters button
    if (budgetResetFiltersBtn) {
      const isFiltered = (selectedYear !== '2026' || selectedQuarter !== 'all' || selectedCategory !== 'all');
      budgetResetFiltersBtn.style.display = isFiltered ? 'inline-flex' : 'none';
    }

    // Filter line items
    const filteredRecords = budgetRecordsData.filter(function (item) {
      const matchesYear = (item.year === selectedYear);
      const matchesQuarter = (selectedQuarter === 'all' || item.quarter === selectedQuarter);
      const matchesCategory = (selectedCategory === 'all' || item.category === selectedCategory);
      return matchesYear && matchesQuarter && matchesCategory;
    });

    // Calculate aggregated metrics
    const totalBudget = filteredRecords.reduce(function (sum, item) { return sum + item.budget; }, 0);
    const totalSpending = filteredRecords.reduce(function (sum, item) { return sum + item.actual; }, 0);
    const remainingBudget = Math.max(0, totalBudget - totalSpending);
    const utilizationRate = totalBudget > 0 ? Math.round((totalSpending / totalBudget) * 100) : 0;

    // Update KPI Metric Values
    if (kpiTotalBudget) kpiTotalBudget.textContent = formatCurrencyPHP(totalBudget);
    if (kpiTotalSpending) kpiTotalSpending.textContent = formatCurrencyPHP(totalSpending);
    if (kpiRemainingBudget) kpiRemainingBudget.textContent = formatCurrencyPHP(remainingBudget);
    if (kpiUtilizationRate) kpiUtilizationRate.textContent = utilizationRate + '%';

    // Update Progress Bar
    if (utilizationBadge) {
      utilizationBadge.textContent = utilizationRate + '% spent';
    }
    if (utilSpentBar) {
      utilSpentBar.style.width = Math.min(utilizationRate, 100) + '%';
    }
    if (utilRemainingBar) {
      utilRemainingBar.style.width = Math.max(0, 100 - utilizationRate) + '%';
    }
    if (utilProgressBar) {
      utilProgressBar.setAttribute('aria-valuenow', utilizationRate);
    }
    if (utilSubtextLabel) {
      utilSubtextLabel.innerHTML = '<strong>' + formatCurrencyPHP(totalSpending) + '</strong> of <strong>' + formatCurrencyPHP(totalBudget) + '</strong> used · <strong>' + formatCurrencyPHP(remainingBudget) + '</strong> remaining';
    }

    // Update Records Table
    renderBudgetRecordsTable(filteredRecords);

    // Update Chart 1: Bar Chart (Budget vs Actual per Quarter)
    if (quarterBarChart) {
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const activeQuarters = (selectedQuarter === 'all') ? quarters : [selectedQuarter];

      const budgetPerQ = activeQuarters.map(function (q) {
        return budgetRecordsData
          .filter(function (it) {
            const matchCat = (selectedCategory === 'all' || it.category === selectedCategory);
            return it.year === selectedYear && it.quarter === q && matchCat;
          })
          .reduce(function (sum, it) { return sum + it.budget; }, 0);
      });

      const actualPerQ = activeQuarters.map(function (q) {
        return budgetRecordsData
          .filter(function (it) {
            const matchCat = (selectedCategory === 'all' || it.category === selectedCategory);
            return it.year === selectedYear && it.quarter === q && matchCat;
          })
          .reduce(function (sum, it) { return sum + it.actual; }, 0);
      });

      quarterBarChart.data.labels = activeQuarters;
      quarterBarChart.data.datasets[0].data = budgetPerQ;
      quarterBarChart.data.datasets[1].data = actualPerQ;
      quarterBarChart.update();
    }

    // Update Chart 2: Doughnut / Pie Chart (Spending by Category)
    if (categoryPieChart) {
      const categories = ['Infrastructure', 'Health', 'Administration', 'Social Services'];
      const activeCategories = (selectedCategory === 'all') ? categories : [selectedCategory];
      const categoryColors = {
        'Infrastructure': '#0d47a1',
        'Health': '#16a34a',
        'Administration': '#f59e0b',
        'Social Services': '#7c3aed'
      };

      const spendingPerCat = activeCategories.map(function (cat) {
        return budgetRecordsData
          .filter(function (it) {
            const matchQ = (selectedQuarter === 'all' || it.quarter === selectedQuarter);
            return it.year === selectedYear && it.category === cat && matchQ;
          })
          .reduce(function (sum, it) { return sum + it.actual; }, 0);
      });

      categoryPieChart.data.labels = activeCategories;
      categoryPieChart.data.datasets[0].data = spendingPerCat;
      categoryPieChart.data.datasets[0].backgroundColor = activeCategories.map(function (c) {
        return categoryColors[c] || '#64748b';
      });
      categoryPieChart.update();
    }
  }

  // Render Table Rows
  function renderBudgetRecordsTable(records) {
    if (!budgetRecordsTbody) return;

    if (budgetTableItemCount) {
      budgetTableItemCount.textContent = 'Showing ' + records.length + (records.length === 1 ? ' line item' : ' allocation line items');
    }

    if (records.length === 0) {
      budgetRecordsTbody.innerHTML = '<tr><td colspan="6" class="records-empty-state">No budget records found matching the selected filters.</td></tr>';
      return;
    }

    const rowsHtml = records.map(function (item) {
      const itemUtil = item.budget > 0 ? Math.round((item.actual / item.budget) * 100) : 0;

      // Status Color Coding for Utilization Column:
      // High (90%+): Pink/Red text
      // Moderate (50%-89%): Orange/Gold text
      // Unspent/Low (0%-49%): Green or Gray text
      let utilClass = 'util-text-unspent';
      if (itemUtil >= 90) {
        utilClass = 'util-text-high';
      } else if (itemUtil >= 50) {
        utilClass = 'util-text-moderate';
      } else if (itemUtil > 0) {
        utilClass = 'util-text-low';
      }

      // Category colored dot
      let catDotClass = 'cat-dot-infrastructure';
      if (item.category === 'Health') catDotClass = 'cat-dot-health';
      else if (item.category === 'Administration') catDotClass = 'cat-dot-administration';
      else if (item.category === 'Social Services') catDotClass = 'cat-dot-social';

      return '<tr>' +
        '<td class="col-quarter">' + item.quarter + ' ' + item.year + '</td>' +
        '<td class="col-category">' +
          '<span class="category-tag">' +
            '<span class="category-dot ' + catDotClass + '"></span>' +
            item.category +
          '</span>' +
        '</td>' +
        '<td class="col-desc">' + item.description + '</td>' +
        '<td class="col-budget">' + formatCurrencyPHP(item.budget) + '</td>' +
        '<td class="col-actual">' + formatCurrencyPHP(item.actual) + '</td>' +
        '<td class="col-utilization"><span class="' + utilClass + '">' + itemUtil + '%</span></td>' +
      '</tr>';
    }).join('');

    budgetRecordsTbody.innerHTML = rowsHtml;
  }

  // Toggle Table Visibility
  if (btnToggleBudgetRecords && budgetRecordsTableContainer) {
    btnToggleBudgetRecords.addEventListener('click', function () {
      const isHidden = (budgetRecordsTableContainer.style.display === 'none' || budgetRecordsTableContainer.style.display === '');
      if (isHidden) {
        budgetRecordsTableContainer.style.display = 'block';
        btnToggleBudgetRecords.classList.add('is-open');
        btnToggleBudgetRecords.setAttribute('aria-expanded', 'true');
        if (toggleRecordsText) toggleRecordsText.textContent = 'Hide Budget Allocation Records';
        budgetRecordsTableContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        budgetRecordsTableContainer.style.display = 'none';
        btnToggleBudgetRecords.classList.remove('is-open');
        btnToggleBudgetRecords.setAttribute('aria-expanded', 'false');
        if (toggleRecordsText) toggleRecordsText.textContent = 'View Budget Allocation Records';
      }
    });
  }

  // Filter Listeners
  if (budgetYearFilter) {
    budgetYearFilter.addEventListener('change', updateBudgetDashboard);
  }
  if (budgetQuarterFilter) {
    budgetQuarterFilter.addEventListener('change', updateBudgetDashboard);
  }
  if (budgetCategoryFilter) {
    budgetCategoryFilter.addEventListener('change', updateBudgetDashboard);
  }

  // Reset Filters Listener
  if (budgetResetFiltersBtn) {
    budgetResetFiltersBtn.addEventListener('click', function () {
      if (budgetYearFilter) budgetYearFilter.value = '2026';
      if (budgetQuarterFilter) budgetQuarterFilter.value = 'all';
      if (budgetCategoryFilter) budgetCategoryFilter.value = 'all';
      updateBudgetDashboard();
    });
  }

  // Initialize Budget Module
  initBudgetCharts();
  updateBudgetDashboard();

  // ==========================================================
  // 13. ANNOUNCEMENTS: CLEAN VERTICAL STACKED CARDS & FILTER
  // ==========================================================
  const announcements = [
    {
      id: 1,
      title: "Typhoon Preparedness Advisory",
      category: "Emergency",
      isEmergency: true,
      date: "2026-09-26",
      department: "Barangay Disaster Risk Reduction & Management Council (BDRRMC)",
      summary: "Residents in riverside sitios and flood-prone lowlands are advised to prepare emergency go-bags, secure roofing, and heed mandatory flood protocols. The announcement will be held on September 26, 2026, with preemptive evacuation starting promptly at 1:00 PM before typhoon landfall. Free barangay emergency shuttles are staged at Sitio Ibaba and Sitio Santolan Chapels to transport families to the Multi-Purpose Covered Court 24/7 evacuation center.",
      content: `
        <p><strong>SITUATION & STORM WARNING:</strong> The Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA) has raised Wind Signal No. 3 over our province due to Severe Tropical Storm 'Julian'. Critical riverbank telemetry sensors in Sitio Ibaba and Sitio Santolan have reached orange alert level. Torrential rainfall, high-velocity gale winds, and river overflows are anticipated within the next 18 to 24 hours.</p>
        <p><strong>MANDATORY EVACUATION SCHEDULE:</strong> The announcement will be held on September 26, 2026, with mandatory preemptive evacuation commencing at 1:00 PM and continuing until 5:00 PM for all residents living within 50 meters of the riverbank, low-lying waterways, and landslide-vulnerable hillsides. The Barangay Multi-Purpose Covered Court on Central Grounds serves as the primary designated 24/7 evacuation center with standby food packs, potable water stations, and medical officers.</p>
        <p><strong>CRITICAL HOUSEHOLD ACTION PROTOCOLS:</strong></p>
        <ul>
          <li><strong>Emergency Go-Bags:</strong> Prepare waterproof bags containing non-perishable canned food, 3-day bottled water supply, first-aid kits, essential prescription medicines, flashlights, power banks, battery-powered radios, and government IDs sealed in ziplock pouches.</li>
          <li><strong>Utility Precautions:</strong> Switch off the main electrical breaker and securely disconnect LPG gas regulator hoses before locking and vacating homes.</li>
          <li><strong>Free Emergency Transportation:</strong> Barangay emergency rescue trucks and transport shuttles will make continuous pickup loops at Sitio Ibaba and Sitio Santolan Chapels starting at 1:00 PM.</li>
          <li><strong>Livestock & Pets:</strong> Domestic animals must not be left tied or locked indoors; safe temporary holding corrals are set up behind the evacuation center.</li>
        </ul>
        <p><strong>24/7 COMMAND DISPATCH HOTLINES:</strong></p>
        <p>📞 BDRRMC Operations: <strong>0917-512-8843</strong> | 🚨 Tanod Emergency Rescue: <strong>0936-221-8847</strong> | 🏥 Health Station Medic: <strong>0920-445-9128</strong></p>
      `,
      attachment: {
        name: "Official_Typhoon_Preparedness_Advisory_2026.pdf",
        size: "1.4 MB"
      }
    },
    {
      id: 2,
      title: "Free Community Medical Mission & Flu Vaccination Drive",
      category: "Health",
      isEmergency: false,
      date: "2026-10-05",
      department: "Barangay Health Station & City Health Office",
      summary: "The Barangay Health Committee, in coordination with the City Health Office and volunteer physicians, is providing free comprehensive medical checkups, essential medicines, and pediatric vitamins. The announcement will be held on October 22, 2026 (Thursday, 8:00 AM – 4:00 PM) at the Sitio Ilaya Main Health Station. Free annual influenza vaccinations will also be administered for senior citizens, persons with disabilities, and young children.",
      content: `
        <p>The Barangay Health Station, in partnership with visiting volunteer doctors from the City Health Office and Philippine Medical Association, will hold its annual Community Health and Preventive Wellness Outreach for all registered barangay families.</p>
        <p><strong>OUTREACH DATE & VENUE:</strong> The announcement will be held on October 22, 2026 (Thursday, 8:00 AM – 4:00 PM) at the Sitio Ilaya Main Health Station. Numbered priority queue numbers will be released starting at 7:30 AM at the triage admission desk. Express lanes will be maintained for senior citizens, pregnant women, and persons with disabilities.</p>
        <p><strong>FREE HEALTHCARE SERVICES AVAILABLE:</strong></p>
        <ul>
          <li><strong>General Consultations:</strong> Adult internal medicine and pediatric consultations conducted by licensed physicians.</li>
          <li><strong>Annual Influenza (Flu) Vaccinations:</strong> Priority shots provided for senior citizens aged 60 and above, PWDs, and children aged 6 months to 5 years.</li>
          <li><strong>Diagnostic Screening:</strong> Free blood pressure monitoring, random blood sugar (RBS) fingerstick screening, and uric acid checks.</li>
          <li><strong>Free Pharmacy Dispensation:</strong> Full-course doctor-prescribed maintenance medicines (for hypertension and diabetes), antibiotics, and pediatric vitamin syrups.</li>
        </ul>
        <p><strong>REMINDERS FOR ATTENDEES:</strong> Please present your valid government ID, Barangay Resident Card, and Barangay Health Record Booklet (if issued previously). Fasting is recommended for patients requesting blood sugar diagnostic tests.</p>
      `,
      attachment: {
        name: "Medical_Mission_Guidelines_Oct2026.pdf",
        size: "1.1 MB"
      }
    },
    {
      id: 3,
      title: "Sitio Gitna Water Main Pipeline Rehabilitation & Road Re-blocking",
      category: "Infrastructure",
      isEmergency: false,
      date: "2026-10-12",
      department: "Barangay Engineering & Public Works Committee",
      summary: "Extensive civil engineering rehabilitation, culinary pipeline upgrade, and concrete asphalt re-blocking will be executed along Mabini Extension to resolve chronic low water pressure and roadway surface wear. The announcement will be held on October 13 to October 17, 2026 (Daily 8:00 AM – 5:00 PM). One-lane traffic flow will be enforced by barangay tanods, and two dedicated potable water tankers will be stationed at Sitio Gitna Chapel for affected households.",
      content: `
        <p>In collaborative partnership with the Municipal Water District and the City Engineering Department, major infrastructure renewal will be undertaken along Mabini Extension (spanning from corner Rizal Street to corner Luna Avenue) to replace aging galvanized water mains with high-density polyethylene pipelines and repair road pavement.</p>
        <p><strong>CONSTRUCTION SCHEDULE & WORKING HOURS:</strong> The announcement will be held on October 13 to October 17, 2026 (Daily 8:00 AM – 5:00 PM). Heavy equipment mobilization will occur between 7:00 AM and 8:00 AM daily, with excavation and trench re-blocking concluded before evening rush hours.</p>
        <p><strong>TRAFFIC SCHEME & WATER SUPPLY CONTINGENCY:</strong></p>
        <ul>
          <li><strong>One-Lane Alternate Traffic:</strong> Barangay Tanod traffic marshals will oversee stop-and-go passage along Mabini Extension. Motorists are advised to utilize secondary access routes via Bonifacio Road.</li>
          <li><strong>Potable Water Tanker Relief:</strong> During scheduled water pressure drop periods (10:00 AM to 3:00 PM daily), two 10,000-liter barangay potable water tankers will be stationed at the Sitio Gitna Chapel courtyard to supply clean household water free of charge.</li>
          <li><strong>Domestic Storage:</strong> Residents in Sitio Gitna are advised to store adequate clean drinking and cooking water in covered storage containers prior to 8:00 AM each morning.</li>
        </ul>
        <p>For urgent traffic inquiries or emergency water delivery requests, please contact the Barangay Engineering Desk at <strong>0919-482-1130</strong>.</p>
      `,
      attachment: {
        name: "Infrastructure_Advisory_SitioGitna.pdf",
        size: "750 KB"
      }
    },
    {
      id: 4,
      title: "2nd Semester Barangay General Assembly & Town Hall Forum",
      category: "Event",
      isEmergency: false,
      date: "2026-10-20",
      department: "Office of the Punong Barangay",
      summary: "Pursuant to Section 397 of the Local Government Code, all barangay residents aged 15 and above are invited to convene for the semi-annual civic assembly. The announcement will be held on October 25, 2026 (Sunday, 8:30 AM – 12:00 PM) at the Barangay Multi-Purpose Covered Court. The assembly features the State of the Barangay Address, 2026 budget utilization disclosures, project turn-overs, and an open citizen town hall.",
      content: `
        <p>Pursuant to Republic Act No. 7160 (The Local Government Code of 1991), the Sangguniang Barangay formally invites all registered residents, youth leaders, and civil society organizations to participate in the 2nd Semester Barangay General Assembly.</p>
        <p><strong>ASSEMBLY SCHEDULE & LOCATION:</strong> The announcement will be held on October 25, 2026 (Sunday, 8:30 AM – 12:00 PM) at the Barangay Multi-Purpose Covered Court on Central Grounds. Resident registration and voter profiling verification begin at 8:00 AM sharp, accompanied by complimentary civic snacks and refreshments.</p>
        <p><strong>OFFICIAL ASSEMBLY AGENDA:</strong></p>
        <ul>
          <li><strong>State of the Barangay Address (SOBA):</strong> Punong Barangay Romy D. Catilo will deliver the executive report covering executive accomplishments, peace and order indexes, and disaster readiness milestones.</li>
          <li><strong>Comprehensive Financial Transparency Report:</strong> Barangay Treasurer Mennen M. Bolos will present the itemized financial accountability statement of the 20% Barangay Development Fund, 10% SK Youth Development Fund, and General Administrative expenditures.</li>
          <li><strong>Project Turn-over & Blessing:</strong> Formal turnover and community handover of completed solar-powered LED streetlights across Sitio Ibaba, Sitio Santolan, Sitio Ilaya, Sitio Gitna, and Tierra Verde and the newly dredged drainage outfall canal.</li>
          <li><strong>Open Public Forum:</strong> An open floor where any resident can voice neighborhood petitions, public safety suggestions, and community inquiries directly to the barangay council.</li>
        </ul>
        <p>Your active voice and presence ensure honest, participatory, and transparent local governance. All attendees will receive verified attendance certificates for barangay profiling records.</p>
      `,
      attachment: {
        name: "Barangay_Assembly_2026_Notice.pdf",
        size: "820 KB"
      }
    },
    {
      id: 5,
      title: "Senior Citizens & PWD Social Pension Distribution (Q4 2026)",
      category: "Social Services",
      isEmergency: false,
      date: "2026-10-28",
      department: "Barangay Social Welfare & Development (BSWD)",
      summary: "The Barangay Social Welfare Committee, in coordination with the Department of Social Welfare and Development (DSWD), will release the 4th Quarter social pension stipend and medical assistance subsidy for registered indigent senior citizens and persons with disabilities. The announcement will be held on November 3, 2026 (Tuesday, 8:00 AM – 3:00 PM) at the Barangay Session Hall.",
      content: `
        <p>The Barangay Social Welfare and Development Office, alongside regional disbursement officers from the Department of Social Welfare and Development (DSWD), announces the schedule for the 4th Quarter Social Pension and indigent medical assistance payout.</p>
        <p><strong>PAYOUT SCHEDULE & LOCATION:</strong> The announcement will be held on November 3, 2026 (Tuesday, 8:00 AM – 3:00 PM) at the Barangay Session Hall. Numbered disbursement vouchers will be processed according to designated purok time clusters to ensure short wait times and comfortable seating.</p>
        <p><strong>MANDATORY CLAIM REQUIREMENTS:</strong></p>
        <ul>
          <li><strong>Personal Claimants:</strong> Original OSCA Senior Citizen ID card or National Council on Disability Affairs (NCDA) PWD ID card, plus one (1) photocopy of any valid government ID.</li>
          <li><strong>Free Indigency Certificate:</strong> Valid Barangay Certificate of Indigency (issued at no cost at the special social services desk).</li>
          <li><strong>Authorized Representative Claims:</strong> For bedridden, hospitalized, or frail beneficiaries, representatives must present: (1) an authorized Special Power of Attorney (SPA) or Barangay Representative Form; (2) current attending physician's medical certificate; and (3) original and photocopies of both the beneficiary's and representative's valid IDs.</li>
        </ul>
        <p>Air-conditioned rest areas, wheelchair ramps, priority seating, and standby medical blood pressure monitoring will be fully manned by volunteer Barangay Health Workers throughout the payout.</p>
      `,
      attachment: {
        name: "Pension_Payout_Schedule_Q4.pdf",
        size: "640 KB"
      }
    },
    {
      id: 6,
      title: "SK Youth Digital Literacy & Web Development Bootcamp 2026",
      category: "Event",
      isEmergency: false,
      date: "2026-11-04",
      department: "Sangguniang Kabataan (SK) Council",
      summary: "The Sangguniang Kabataan Council is launching a free intensive two-day tech skills workshop designed for out-of-school youth, high school students, and aspiring creatives aged 15 to 30. The announcement will be held on November 14 to November 15, 2026 (Saturday & Sunday, 9:00 AM – 5:00 PM) at the 2nd Floor E-Library Tech Hub. Participants will learn hands-on web design, digital graphics, and online freelance portfolio building.",
      content: `
        <p>The Sangguniang Kabataan Council proudly presents the 2026 Youth Digital Empowerment and Literacy Bootcamp, a flagship hands-on weekend program created to bridge digital skills gaps and train barangay youth for remote employment opportunities.</p>
        <p><strong>BOOTCAMP SCHEDULE & VENUE:</strong> The announcement will be held on November 14 to November 15, 2026 (Saturday & Sunday, 9:00 AM – 5:00 PM) at the 2nd Floor E-Library Tech Hub. Thirty (30) fully equipped computer workstations with high-speed fiber internet connection, software suites, and free training modules are reserved for accepted attendees.</p>
        <p><strong>CURRICULUM BREAKDOWN:</strong></p>
        <ul>
          <li><strong>Day 1 (Saturday): Modern Web Architecture:</strong> Practical semantic HTML5 structuring, modern CSS3 layout and design principles, and standard JavaScript programming for interactive web applications.</li>
          <li><strong>Day 2 Morning (Sunday): Graphic Design & Canva Pro:</strong> Creating impactful community posters, social media banners, brand kits, and digital graphic assets.</li>
          <li><strong>Day 2 Afternoon (Sunday): Freelance Career Mastery:</strong> Setting up remote freelance profiles, building developer portfolios, and client presentation practices.</li>
        </ul>
        <p><strong>BENEFITS:</strong> Complimentary meals and afternoon snacks are provided across both workshop days. Registered attendees who complete all workshop exercises will receive an official Sangguniang Kabataan Certificate of Competency.</p>
      `,
      attachment: {
        name: "SK_Tech_Bootcamp_Curriculum.pdf",
        size: "580 KB"
      }
    }
  ];

  // DOM Elements for Announcements
  const announcementsCardsFeed = document.getElementById('announcementsCardsFeed');
  const announcementsSearchInput = document.getElementById('announcementsSearchInput');
  const announcementsSearchClear = document.getElementById('announcementsSearchClear');
  const announcementsCategoryFilter = document.getElementById('announcementsCategoryFilter');
  const announcementsFeedCount = document.getElementById('announcementsFeedCount');
  const announcementDetailModal = document.getElementById('announcementDetailModal');
  const announcementModalContent = document.getElementById('announcementModalContent');
  const closeAnnouncementModalBtn = document.getElementById('closeAnnouncementModalBtn');

  // Filter & Pinned Sorting Logic
  function getFilteredAndSortedAnnouncements() {
    const q = (announcementsSearchInput ? announcementsSearchInput.value : '').trim().toLowerCase();
    const cat = (announcementsCategoryFilter ? announcementsCategoryFilter.value : 'All');

    // 1. Filter dataset dynamically using standard .filter()
    const filtered = announcements.filter(function (item) {
      const matchesCategory = (cat === 'All' || item.category.toLowerCase() === cat.toLowerCase());
      const matchesSearch = (q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q)
      );
      return matchesCategory && matchesSearch;
    });

    // 2. Pinned Priority: Active Emergency (isEmergency: true) pinned at the top of the list
    filtered.sort(function (a, b) {
      if (a.isEmergency && !b.isEmergency) return -1;
      if (!a.isEmergency && b.isEmergency) return 1;
      return b.date.localeCompare(a.date);
    });

    return filtered;
  }

  // Render Announcement Cards in Single-Column Full-Width Stack
  function renderAnnouncementsFeed() {
    if (!announcementsCardsFeed) return;

    const list = getFilteredAndSortedAnnouncements();

    // Update count display
    if (announcementsFeedCount) {
      announcementsFeedCount.textContent = list.length + (list.length === 1 ? ' Announcement' : ' Announcements');
    }

    // Toggle clear search button
    if (announcementsSearchClear && announcementsSearchInput) {
      announcementsSearchClear.style.display = (announcementsSearchInput.value.trim() !== '') ? 'block' : 'none';
    }

    if (list.length === 0) {
      announcementsCardsFeed.innerHTML = `
        <div class="announcements-empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h4 class="empty-state-title">No announcements found</h4>
          <p class="empty-state-subtitle">No notices match your current search query or category filter.</p>
          <button type="button" class="btn-reset-filters" id="btnResetAnnouncementFilters">Reset All Filters</button>
        </div>
      `;

      const resetBtn = document.getElementById('btnResetAnnouncementFilters');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          if (announcementsSearchInput) announcementsSearchInput.value = '';
          if (announcementsCategoryFilter) announcementsCategoryFilter.value = 'All';
          renderAnnouncementsFeed();
        });
      }
      return;
    }

    const html = list.map(function (item) {
      if (item.isEmergency) {
        // A. EMERGENCY ANNOUNCEMENT CARD (CRITICAL STYLING)
        return `
          <article class="announcement-card emergency-card" data-id="${item.id}" tabindex="0" role="article" aria-label="${item.title}">
            <!-- Red Top Banner Bar -->
            <div class="emergency-top-banner">
              <div class="emergency-banner-left">
                <span class="emergency-banner-icon" aria-hidden="true">⚠️</span>
                <span class="emergency-banner-text">EMERGENCY ADVISORY</span>
              </div>
              <span class="emergency-banner-tag">CRITICAL PRIORITY</span>
            </div>

            <div class="announcement-card-inner">
              <!-- Meta Information Row: Light gray category pill + Date string (no icon, no view notice) -->
              <div class="announcement-meta-row">
                <div class="meta-left-group">
                  <span class="meta-category-pill pill-emergency">Emergency</span>
                  <span class="meta-date-item">
                    <time datetime="${item.date}">${item.date}</time>
                  </span>
                  <span class="meta-department-text">${item.department}</span>
                </div>
              </div>

              <!-- Content: Bold title + Descriptive summary with embedded schedule information -->
              <h3 class="announcement-card-title">${item.title}</h3>
              <p class="announcement-card-summary">${item.summary}</p>
            </div>
          </article>
        `;
      } else {
        // B. STANDARD ANNOUNCEMENT CARDS
        const pillClass = 'pill-' + item.category.toLowerCase().replace(/\s+/g, '-');
        return `
          <article class="announcement-card standard-card" data-id="${item.id}" tabindex="0" role="article" aria-label="${item.title}">
            <div class="announcement-card-inner">
              <!-- Meta Information Row: Light gray category pill + Date string (no icon, no view notice) -->
              <div class="announcement-meta-row">
                <div class="meta-left-group">
                  <span class="meta-category-pill ${pillClass}">${item.category}</span>
                  <span class="meta-date-item">
                    <time datetime="${item.date}">${item.date}</time>
                  </span>
                  <span class="meta-department-text">${item.department}</span>
                </div>
              </div>

              <!-- Content: Bold headline title + Summary text paragraph with embedded schedule information -->
              <h3 class="announcement-card-title">${item.title}</h3>
              <p class="announcement-card-summary">${item.summary}</p>
            </div>
          </article>
        `;
      }
    }).join('');

    announcementsCardsFeed.innerHTML = html;

    // Attach click listeners to cards
    const cards = announcementsCardsFeed.querySelectorAll('.announcement-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        const id = Number(card.getAttribute('data-id'));
        openAnnouncementModal(id);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = Number(card.getAttribute('data-id'));
          openAnnouncementModal(id);
        }
      });
    });
  }

  // Open Detail Modal
  function openAnnouncementModal(id) {
    const item = announcements.find(function (a) { return a.id === id; });
    if (!item || !announcementDetailModal || !announcementModalContent) return;

    let headerBannerHtml = '';
    if (item.isEmergency) {
      headerBannerHtml = `
        <div class="announcement-modal-header-banner">
          <span>⚠️ EMERGENCY ADVISORY — MANDATORY ACTION PROTOCOL</span>
        </div>
      `;
    }

    let attachmentHtml = '';
    if (item.attachment) {
      attachmentHtml = `
        <div class="modal-attachment-card">
          <div class="modal-attachment-left">
            <div class="modal-attachment-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <div>
              <div class="modal-attachment-name">${item.attachment.name}</div>
              <div class="modal-attachment-meta">Certified Official Memorandum · ${item.attachment.size}</div>
            </div>
          </div>
          <a href="#announcements" class="modal-download-btn js-btn-download-notice" download="${item.attachment.name}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download PDF</span>
          </a>
        </div>
      `;
    }

    const pillClass = item.isEmergency ? 'pill-emergency' : ('pill-' + item.category.toLowerCase().replace(/\s+/g, '-'));

    announcementModalContent.innerHTML = `
      ${headerBannerHtml}
      <div class="announcement-modal-scrollable">
        <div class="modal-meta-bar">
          <div class="meta-left-group">
            <span class="meta-category-pill ${pillClass}">${item.category}</span>
            <span class="meta-date-item">
              <span>${item.date}</span>
            </span>
          </div>
          <span style="font-size: 12px; color: #94a3b8; font-weight: 600;">Ref: #${item.id}</span>
        </div>

        <h2 class="modal-announcement-title">${item.title}</h2>

        <div class="modal-department-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line><line x1="9" y1="6" x2="9" y2="6.01"></line><line x1="15" y1="6" x2="15" y2="6.01"></line><line x1="9" y1="10" x2="9" y2="10.01"></line><line x1="15" y1="10" x2="15" y2="10.01"></line></svg>
          <span>Issued by: <strong>${item.department}</strong></span>
        </div>

        <div class="modal-announcement-body">
          ${item.content}
        </div>

        ${attachmentHtml}

        <div class="modal-actions-bar">
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn-modal-action" id="btnModalPrint">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              <span>Print Notice</span>
            </button>
          </div>
          <button type="button" class="btn-modal-action btn-modal-close-action" id="btnModalClose">Close</button>
        </div>
      </div>
    `;

    const printBtn = announcementModalContent.querySelector('#btnModalPrint');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }

    const modalCloseActionBtn = announcementModalContent.querySelector('#btnModalClose');
    if (modalCloseActionBtn) {
      modalCloseActionBtn.addEventListener('click', closeAnnouncementModal);
    }

    announcementDetailModal.style.display = 'flex';
    announcementDetailModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeAnnouncementModal() {
    if (!announcementDetailModal) return;
    announcementDetailModal.style.display = 'none';
    announcementDetailModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeAnnouncementModalBtn) {
    closeAnnouncementModalBtn.addEventListener('click', closeAnnouncementModal);
  }

  if (announcementDetailModal) {
    announcementDetailModal.addEventListener('click', function (e) {
      if (e.target === announcementDetailModal) {
        closeAnnouncementModal();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && announcementDetailModal && announcementDetailModal.style.display === 'flex') {
      closeAnnouncementModal();
    }
  });

  // Event Listeners for Search and Category Filter
  if (announcementsSearchInput) {
    announcementsSearchInput.addEventListener('input', function () {
      renderAnnouncementsFeed();
    });
  }

  if (announcementsSearchClear) {
    announcementsSearchClear.addEventListener('click', function () {
      if (announcementsSearchInput) {
        announcementsSearchInput.value = '';
        announcementsSearchInput.focus();
        renderAnnouncementsFeed();
      }
    });
  }

  if (announcementsCategoryFilter) {
    announcementsCategoryFilter.addEventListener('change', function () {
      renderAnnouncementsFeed();
    });
  }

  // Initial render of announcements feed
  renderAnnouncementsFeed();
});


