const roleToggle = document.getElementById('roleToggle');
const roleMenu = document.getElementById('roleMenu');
const currentRole = document.getElementById('currentRole');
const roleOptions = document.querySelectorAll('.role-option');
const languagePicker = document.getElementById('languagePicker');
const languageMenu = document.getElementById('languageMenu');
const languageOptions = document.querySelectorAll('.language-option');
const currentLanguage = document.getElementById('currentLanguage');
const languageFlag = document.getElementById('languageFlag');
const ownerLoginForm = document.getElementById('ownerLoginForm');
const loginFeedback = document.getElementById('loginFeedback');
const passwordToggle = document.getElementById('passwordToggle');
const passwordInput = document.getElementById('password');

if (passwordToggle && passwordInput) {
  passwordToggle.addEventListener('click', () => {
    const showPassword = passwordInput.type === 'password';
    passwordInput.type = showPassword ? 'text' : 'password';
    passwordToggle.setAttribute('aria-pressed', String(showPassword));
    passwordToggle.setAttribute('aria-label', showPassword ? 'Hide password' : 'Show password');
    passwordToggle.title = showPassword ? 'Hide password' : 'Show password';
  });
}

const ethiopianFlagSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" aria-label="Ethiopian flag" role="img" class="flag-svg">
    <path fill="#feca00" fill-rule="evenodd" d="M0 4v24h32V4H0Z" clip-rule="evenodd"></path>
    <mask id="ethFlagMask" width="32" height="24" x="0" y="4" maskUnits="userSpaceOnUse" style="mask-type:luminance">
      <path fill="#ffffff" fill-rule="evenodd" d="M0 4v24h32V4H0Z" clip-rule="evenodd"></path>
    </mask>
    <g mask="url(#ethFlagMask)">
      <path fill="#5eaa22" fill-rule="evenodd" d="M0 4v8h32V4H0Z" clip-rule="evenodd"></path>
      <path fill="#e31d1c" fill-rule="evenodd" d="M0 20v8h32v-8H0Z" clip-rule="evenodd"></path>
      <path fill="#2B77B8" fill-rule="evenodd" d="M16 22a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" clip-rule="evenodd"></path>
      <path stroke="#feca00" stroke-width="1.5" d="m16 18-2.762.927.86-2.309-1.874-2.236h2.6L16 12l1.175 2.382h2.658l-1.931 2.236.685 2.309L16 18Z" clip-rule="evenodd"></path>
      <path stroke="#2B77B8" d="m15.696 16.035-2.085 4.36m1.757-4.915h-4m4.754 1.357 3.909 1.805m-3.064-2.768 2.83-3.098"></path>
    </g>
  </svg>
`;

const englishFlagImage = '<img src="../log%20in%20page/...icons/Flag%20icon.png" alt="English flag" class="flag-image" />';

function updateLanguageFlag(lang) {
  if (!languageFlag) return;

  if (lang === 'am') {
    languageFlag.innerHTML = ethiopianFlagSvg;
  } else {
    languageFlag.innerHTML = englishFlagImage;
  }
}

const resources = {
  en: {
    translation: {
      welcome: {
        line1: 'Welcome to',
        line2: 'Administration Dashboard',
        line3: 'of',
        line4: 'near me'
      },
      login: {
        title: 'Sign in',
        phoneLabel: 'Phone number',
        passwordLabel: 'Password',
        forgot: 'Forgot password ?',
        button: 'Sign in',
        signupIntro: "don't have an account ?",
        signupLink: 'Sign up',
        signupMiddle: 'By Requesting',
        signupOwner: 'The Owner .'
      },
      nav: {
        terms: 'Terms',
        plans: 'Plans'
      }
    }
  },
  am: {
    translation: {
      welcome: {
        line1: 'እንኳን ደህና መጣህ',
        line2: 'የአስተዳደር ዳሽቦርድ',
        line3: 'ከ',
        line4: 'አቅራቢያዬ'
      },
      login: {
        title: 'ግባ',
        phoneLabel: 'ስልክ ቁጥር',
        passwordLabel: 'የይለፍ ቃል',
        forgot: 'የይለፍ ቃል ረስተዋል ?',
        button: 'ግባ',
        signupIntro: 'መለያ የለዎትም ?',
        signupLink: 'ይመዝገቡ',
        signupMiddle: 'በማቅረብ',
        signupOwner: 'ባለቤቱ .'
      },
      nav: {
        terms: 'ውሎች',
        plans: 'እቅዶች'
      }
    }
  }
};

const CEO_ACCOUNTS = [
  { id: 'yared', phone: '900000001', password: 'CEOy@42' },
  { id: 'mehari', phone: '900000002', password: 'CEOy@42' },
  { id: 'muse', phone: '900000003', password: 'CEOy@42' }
];
const ADMIN_ACCOUNTS = [
  { id: 'yared', phone: '900000001', password: 'ADMy@42' },
  { id: 'mehari', phone: '900000002', password: 'ADMy@42' },
  { id: 'muse', phone: '900000003', password: 'ADMy@42' }
];
const SUPPORT_ACCOUNTS = [
  { id: 'yared', phone: '900000001', password: 'CUSy@42' },
  { id: 'mehari', phone: '900000002', password: 'CUSy@42' },
  { id: 'muse', phone: '900000003', password: 'CUSy@42' }
];

if (ownerLoginForm) {
  ownerLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let phone = document.getElementById('phone').value.replace(/\D/g, '');
    const password = document.getElementById('password').value;
    if (phone.startsWith('251')) {
      phone = phone.slice(3);
    }

    const selectedRole = currentRole?.textContent.trim() || 'Owner';
    const isOwnerLogin = selectedRole === 'Owner' && phone === '970922144' && password === 'Yo@424242';
    const ceoAccount = selectedRole === 'CEO'
      ? CEO_ACCOUNTS.find((account) => account.phone === phone && account.password === password)
      : null;
    const adminAccount = selectedRole === 'Admin'
      ? ADMIN_ACCOUNTS.find((account) => account.phone === phone && account.password === password)
      : null;
    const supportAccount = ['C. service', 'Cus.supports', 'Customer supports'].includes(selectedRole)
      ? SUPPORT_ACCOUNTS.find((account) => account.phone === phone && account.password === password)
      : null;

    if (!isOwnerLogin && !ceoAccount && !adminAccount && !supportAccount) {
      loginFeedback.textContent = 'Phone number, password, or account type is incorrect.';
      return;
    }

    loginFeedback.textContent = '';
    window.location.href = supportAccount
      ? `../Cstum%20suport%20DashBoard/Real-pages/Support.html?support=${supportAccount.id}`
      : adminAccount
        ? `../Admin%20DashBoard/Real-pages/Admin.html?admin=${adminAccount.id}`
      : ceoAccount
        ? `../CEO%20DashBoard/Real-pages/CEO.html?ceo=${ceoAccount.id}`
        : '../Owner%20DashBoard/HTML-file/Owner.html';
  });
}

function updateI18nText() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.dataset.i18n;
    const value = i18next.t(key);
    if (value) {
      el.textContent = value;
    }
  });

  if (currentLanguage) {
    const langLabel = i18next.language === 'am' ? 'አማርኛ' : 'English';
    currentLanguage.textContent = langLabel;
  }

  updateLanguageFlag(i18next.language);
}

if (window.i18next) {
  i18next
    .init({
      lng: 'en',
      resources,
      fallbackLng: 'en',
      interpolation: { escapeValue: false }
    })
    .then(() => {
      updateI18nText();
    });
}

if (languagePicker && languageMenu) {
  languagePicker.addEventListener('click', () => {
    const isOpen = languageMenu.classList.toggle('open');
    languagePicker.setAttribute('aria-expanded', String(isOpen));
  });

  languageOptions.forEach((option) => {
    option.addEventListener('click', () => {
      languageOptions.forEach((item) => item.classList.remove('active'));
      option.classList.add('active');
      const selectedLang = option.dataset.lang || 'en';
      if (window.i18next) {
        i18next.changeLanguage(selectedLang).then(() => {
          updateI18nText();
        });
      }
      languageMenu.classList.remove('open');
      languagePicker.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    if (!languagePicker.contains(event.target) && !languageMenu.contains(event.target)) {
      languageMenu.classList.remove('open');
      languagePicker.setAttribute('aria-expanded', 'false');
    }
  });
}

if (roleToggle && roleMenu) {
  roleToggle.addEventListener('click', () => {
    const isOpen = roleMenu.classList.toggle('open');
    roleToggle.setAttribute('aria-expanded', String(isOpen));
  });

  roleOptions.forEach((option) => {
    option.addEventListener('click', () => {
      roleOptions.forEach((item) => item.classList.remove('active'));
      option.classList.add('active');
      const selectedRole = option.dataset.role || 'Owner';
      currentRole.textContent = selectedRole;
      roleMenu.classList.remove('open');
      roleToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    if (!roleToggle.contains(event.target) && !roleMenu.contains(event.target)) {
      roleMenu.classList.remove('open');
      roleToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
