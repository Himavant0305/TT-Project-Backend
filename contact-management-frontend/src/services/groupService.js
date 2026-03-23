import { api } from './api.js';

export async function fetchGroups() {
  const { data } = await api.get('/api/groups');
  return data;
}

export async function createGroup(payload) {
  const { data } = await api.post('/api/groups', payload);
  return data;
}

export async function updateGroup(id, payload) {
  const { data } = await api.put(`/api/groups/${id}`, payload);
  return data;
}

export async function deleteGroup(id) {
  await api.delete(`/api/groups/${id}`);
}

export async function addContactToGroup(groupId, contactId) {
  const { data } = await api.post(`/api/groups/${groupId}/contacts/${contactId}`);
  return data;
}

export async function removeContactFromGroup(groupId, contactId) {
  const { data } = await api.delete(`/api/groups/${groupId}/contacts/${contactId}`);
  return data;
}
