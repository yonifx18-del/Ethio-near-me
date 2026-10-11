const adminAccounts = {
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

const adminId = new URLSearchParams(window.location.search).get('admin');
const signedInAdmin = adminAccounts[adminId];

if (!signedInAdmin) {
  window.location.replace('../../Full-HTML/Adminstration.html');
} else {
  document.title = `${signedInAdmin.name} | Admin Dashboard`;
  document.getElementById('welcomeTitle').textContent = `Hello, ${signedInAdmin.name}!`;
  document.getElementById('accountSummary').textContent = `Signed in as ${signedInAdmin.name}`;
  document.getElementById('accountPhone').textContent = signedInAdmin.phone;

  [document.getElementById('headerProfile'), document.getElementById('welcomeProfile')].forEach((image) => {
    image.src = signedInAdmin.profile;
    image.alt = `${signedInAdmin.name} profile`;
  });
}

document.querySelectorAll('.ceo-nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.ceo-nav-link').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});
