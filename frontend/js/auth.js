/**
 * auth.js — shared authentication helper
 * Include this in every page. It reads sessionStorage and handles
 * redirects centrally so no page has hardcoded login logic.
 */

// Pages that are always accessible without login
const PUBLIC_PAGES = ['index.html', 'signup.html'];

// Pages only accessible by specific roles
const ROLE_PAGES = {
  'buyer-dash.html':  ['buyer'],
  'seller-dash.html': ['seller'],
  'admin-dash.html':  ['admin'],
};

// Pages that are part of the combined SPA (no separate auth needed)
const SPA_VIEWS = ['home.html'];

function getUser() {
  try { return JSON.parse(sessionStorage.getItem('hf_user') || 'null'); }
  catch { return null; }
}

function currentPage() {
  const p = window.location.pathname.split('/').pop();
  if (!p || p === '') return 'index.html';
  // Strip query strings
  return p.split('?')[0];
}

function authGuard() {
  const page = currentPage();
  const user = getUser();

  // Always allow public pages
  if (PUBLIC_PAGES.includes(page)) return;

  // Not logged in → send to login
  if (!user) {
    sessionStorage.setItem('hf_after_login', page);
    window.location.href = 'index.html';
    return;
  }

  // Role-restricted pages
  if (ROLE_PAGES[page] && !ROLE_PAGES[page].includes(user.role)) {
    const dest = { admin: 'admin-dash.html', seller: 'seller-dash.html', buyer: 'buyer-dash.html' }[user.role] || 'home.html';
    window.location.href = dest;
  }
}

/**
 * Build the profile dropdown and side menu nav items based on current user.
 * Call this after DOMContentLoaded.
 */
function buildNav(profBtnId, profDropId, pdNameId, pdRoleId, pdLinksId, smAuthId) {
  const user = getUser();
  const profBtn  = document.getElementById(profBtnId  || 'prof-btn');
  const profDrop = document.getElementById(profDropId || 'prof-drop');
  const pdName   = document.getElementById(pdNameId   || 'pd-name');
  const pdRole   = document.getElementById(pdRoleId   || 'pd-role');
  const pdLinks  = document.getElementById(pdLinksId  || 'pd-links');
  const smAuth   = document.getElementById(smAuthId   || 'sm-auth-links');

  if (!profBtn) return;

  const dashUrl = user
    ? ({ admin: 'admin-dash.html', seller: 'seller-dash.html', buyer: 'buyer-dash.html' }[user.role] || 'home.html')
    : 'index.html';

  if (user) {
    profBtn.textContent = user.initials || user.name.substring(0, 2).toUpperCase();
    if (pdName) pdName.textContent = user.name;
    if (pdRole) pdRole.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    if (pdLinks) pdLinks.innerHTML = `
      <button class="pd-item" onclick="location.href='${dashUrl}'">My Dashboard</button>
      <button class="pd-item" onclick="location.href='home.html'">Browse Listings</button>
      <button class="pd-item" onclick="authLogout()">Sign Out</button>`;
    if (smAuth) smAuth.innerHTML = `
      <button class="sm-item" onclick="location.href='${dashUrl}'">My Dashboard</button>
      <button class="sm-item" onclick="authLogout()">Sign Out</button>`;
  } else {
    profBtn.textContent = 'G';
    if (pdName) pdName.textContent = 'Guest';
    if (pdRole) pdRole.textContent = 'Not signed in';
    if (pdLinks) pdLinks.innerHTML = `
      <button class="pd-item" onclick="location.href='index.html'">Sign In</button>
      <button class="pd-item" onclick="location.href='signup.html'">Create Account</button>`;
    if (smAuth) smAuth.innerHTML = `
      <button class="sm-item" onclick="location.href='index.html'">Sign In</button>
      <button class="sm-item" onclick="location.href='signup.html'">Create Account</button>`;
  }

  // Toggle dropdown
  profBtn.onclick = () => {
    if (profDrop) profDrop.classList.toggle('on');
  };
  document.addEventListener('click', e => {
    if (profDrop && !e.target.closest('.prof-wrap')) profDrop.classList.remove('on');
  });
}

function authLogout() {
  sessionStorage.removeItem('hf_user');
  window.location.href = 'index.html';
}

// Run guard immediately
authGuard();