import { api } from './api.js';

export async function fetchDashboardStats() {
  const { data } = await api.get('/api/dashboard/stats');
  return data;
}

export async function fetchContacts(page = 0, size = 10) {
  const { data } = await api.get('/api/contacts', { params: { page, size } });
  return data;
}

export async function searchContacts(query, page = 0, size = 10) {
  const { data } = await api.get('/api/contacts/search', {
    params: { query: query || '', page, size },
  });
  return data;
}

export async function getContact(id) {
  const { data } = await api.get(`/api/contacts/${id}`);
  return data;
}

export async function createContact(payload) {
  const { data } = await api.post('/api/contacts', payload);
  return data;
}

export async function updateContact(id, payload) {
  const { data } = await api.put(`/api/contacts/${id}`, payload);
  return data;
}

export async function deleteContact(id) {
  await api.delete(`/api/contacts/${id}`);
}
