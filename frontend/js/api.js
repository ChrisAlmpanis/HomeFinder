// js/api.js — all backend API calls for HomeFinder
const API = 'http://localhost:3000/api';

// ── Auth ──────────────────────────────────────────
async function apiLogin(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

async function apiRegister(data) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// ── Listings ──────────────────────────────────────
async function apiGetListing(id) {
  const res = await fetch(`${API}/listings/${id}`);
  return res.json();
}

async function apiGetListing(id) {
  const res = await fetch(`${API}/listings/${id}`);
  return res.json();
}

async function apiCreateListing(data) {
  const res = await fetch(`${API}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function apiUpdateListing(id, data) {
  const res = await fetch(`${API}/listings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function apiDeleteListing(id) {
  const res = await fetch(`${API}/listings/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

// ── Appointments ──────────────────────────────────
async function apiGetAppointments() {
  const res = await fetch(`${API}/appointments`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

async function apiCreateAppointment(data) {
  const res = await fetch(`${API}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function apiCancelAppointment(id) {
  const res = await fetch(`${API}/appointments/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

async function apiRescheduleAppointment(id, data) {
  const res = await fetch(`${API}/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

// ── Users (admin) ─────────────────────────────────
async function apiGetUsers() {
  const res = await fetch(`${API}/users`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

async function apiApproveUser(id) {
  const res = await fetch(`${API}/users/${id}/approve`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

// ── Helpers ───────────────────────────────────────
function getToken() {
  const user = JSON.parse(sessionStorage.getItem('hf_user') || '{}');
  return user.token || '';
}

function getUser() {
  return JSON.parse(sessionStorage.getItem('hf_user') || 'null');
}

function saveUser(data) {
  sessionStorage.setItem('hf_user', JSON.stringify(data));
}

function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}