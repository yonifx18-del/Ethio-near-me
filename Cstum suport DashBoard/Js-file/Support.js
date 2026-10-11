const supportAccounts = {
  yared: {
    name: 'Yared Desta',
    phone: '+251900000001',
    profile: '../../Owner%20DashBoard/...icons/Owner%20D.Board/p%201%20icon.png'
  },
  mehari: {
    name: 'Mehari Gidey',
    phone: '+251900000002',
    profile: '../../Owner%20DashBoard/...icons/Owner%20D.Board/p%202%20icon.png'
  },
  muse: {
    name: 'Muse Gere',
    phone: '+251900000003',
    profile: '../../Owner%20DashBoard/...icons/Owner%20D.Board/P%203%20icon.png'
  }
};

const supportId = new URLSearchParams(window.location.search).get('support');
const signedInSupport = supportAccounts[supportId];

if (!signedInSupport) {
  window.location.replace('../../Full-HTML/Adminstration.html');
} else {
  document.title = `${signedInSupport.name} | Customer Support Dashboard`;
  document.getElementById('welcomeTitle').textContent = `Hello, ${signedInSupport.name}!`;
  document.getElementById('accountSummary').textContent = `Signed in as ${signedInSupport.name}`;
  document.getElementById('accountPhone').textContent = signedInSupport.phone;

  [document.getElementById('headerProfile'), document.getElementById('welcomeProfile')].forEach((image) => {
    image.src = signedInSupport.profile;
    image.alt = `${signedInSupport.name} profile`;
  });
}

document.querySelectorAll('.ceo-nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.ceo-nav-link').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});
