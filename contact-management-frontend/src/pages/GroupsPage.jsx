import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addContactToGroup,
  createGroup,
  deleteGroup,
  fetchGroups,
  removeContactFromGroup,
  updateGroup,
} from '../services/groupService.js';
import { fetchContacts } from '../services/contactService.js';

const EMPTY_FORM = { name: '', description: '' };

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [newMemberId, setNewMemberId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) || null,
    [groups, selectedGroupId]
  );

  const memberIds = useMemo(() => new Set(selectedGroup?.contactIds || []), [selectedGroup]);
  const availableContacts = useMemo(
    () => contacts.filter((c) => !memberIds.has(c.id)),
    [contacts, memberIds]
  );
  const memberContacts = useMemo(
    () => contacts.filter((c) => memberIds.has(c.id)),
    [contacts, memberIds]
  );

  const syncSelectedGroup = useCallback((nextGroups) => {
    if (!nextGroups.length) {
      setSelectedGroupId('');
      setForm(EMPTY_FORM);
      return;
    }
    setSelectedGroupId((prev) => {
      const exists = nextGroups.some((g) => g.id === prev);
      const nextId = exists ? prev : nextGroups[0].id;
      const next = nextGroups.find((g) => g.id === nextId) || nextGroups[0];
      setForm({ name: next.name || '', description: next.description || '' });
      return next.id;
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [groupData, contactPage] = await Promise.all([fetchGroups(), fetchContacts(0, 500)]);
      setGroups(groupData);
      setContacts(contactPage.content || []);
      syncSelectedGroup(groupData);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, [syncSelectedGroup]);

  useEffect(() => {
    load();
  }, [load]);

  const createNewGroup = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const created = await createGroup({
        name: form.name.trim(),
        description: form.description.trim(),
        contactIds: [],
      });
      const nextGroups = [...groups, created].sort((a, b) => a.name.localeCompare(b.name));
      setGroups(nextGroups);
      setSelectedGroupId(created.id);
      setForm({ name: created.name || '', description: created.description || '' });
      setNewMemberId('');
    } catch (e) {
      setError(e.response?.data?.message || 'Could not create group');
    } finally {
      setSaving(false);
    }
  };

  const saveGroup = async () => {
    if (!selectedGroup || !form.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateGroup(selectedGroup.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        contactIds: selectedGroup.contactIds || [],
      });
      const nextGroups = groups.map((g) => (g.id === updated.id ? updated : g));
      setGroups(nextGroups);
      setForm({ name: updated.name || '', description: updated.description || '' });
    } catch (e) {
      setError(e.response?.data?.message || 'Could not update group');
    } finally {
      setSaving(false);
    }
  };

  const removeGroup = async () => {
    if (!selectedGroup) return;
    if (!window.confirm(`Delete group "${selectedGroup.name}"?`)) return;
    setSaving(true);
    setError('');
    try {
      await deleteGroup(selectedGroup.id);
      const nextGroups = groups.filter((g) => g.id !== selectedGroup.id);
      setGroups(nextGroups);
      syncSelectedGroup(nextGroups);
    } catch (e) {
      setError(e.response?.data?.message || 'Could not delete group');
    } finally {
      setSaving(false);
    }
  };

  const addMember = async () => {
    if (!selectedGroup || !newMemberId) return;
    setSaving(true);
    setError('');
    try {
      const updated = await addContactToGroup(selectedGroup.id, newMemberId);
      setGroups(groups.map((g) => (g.id === updated.id ? updated : g)));
      setNewMemberId('');
    } catch (e) {
      setError(e.response?.data?.message || 'Could not add contact to group');
    } finally {
      setSaving(false);
    }
  };

  const removeMember = async (contactId) => {
    if (!selectedGroup) return;
    setSaving(true);
    setError('');
    try {
      const updated = await removeContactFromGroup(selectedGroup.id, contactId);
      setGroups(groups.map((g) => (g.id === updated.id ? updated : g)));
    } catch (e) {
      setError(e.response?.data?.message || 'Could not remove contact from group');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header-row">
        <h1 className="page-title">Groups</h1>
      </div>
      {error ? <div className="alert-error">{error}</div> : null}

      {loading ? (
        <div className="loading-inline">Loading groups�</div>
      ) : (
        <div className="groups-layout">
          <aside className="card groups-sidebar">
            <h2 className="groups-title">Your groups</h2>
            <div className="groups-list">
              {groups.length === 0 ? (
                <p className="empty-hint">No groups yet. Create your first one.</p>
              ) : (
                groups.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={`group-pill ${selectedGroupId === g.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedGroupId(g.id);
                      setForm({ name: g.name || '', description: g.description || '' });
                      setNewMemberId('');
                    }}
                  >
                    <span>{g.name}</span>
                    <small>{g.contactIds?.length || 0}</small>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="card groups-main">
            <h2 className="groups-title">Group details</h2>

            <div className="form-group">
              <label htmlFor="group-name">Group name</label>
              <input
                id="group-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Family, Friends, Work..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="group-description">Description</label>
              <input
                id="group-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional"
              />
            </div>

            <div className="groups-actions">
              <button type="button" className="btn btn-primary" disabled={saving || !form.name.trim()} onClick={createNewGroup}>
                Create group
              </button>
              <button
                type="button"
                className="btn btn-accent"
                disabled={saving || !selectedGroup || !form.name.trim()}
                onClick={saveGroup}
              >
                Save changes
              </button>
              <button type="button" className="btn btn-danger" disabled={saving || !selectedGroup} onClick={removeGroup}>
                Delete group
              </button>
            </div>

            {selectedGroup ? (
              <>
                <hr className="groups-divider" />
                <h3 className="groups-subtitle">Group contacts</h3>

                <div className="groups-member-add">
                  <select
                    className="group-by-select"
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                  >
                    <option value="">Select a contact</option>
                    {availableContacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                  <button type="button" className="btn btn-primary" disabled={!newMemberId || saving} onClick={addMember}>
                    Add contact
                  </button>
                </div>

                <div className="groups-members-list">
                  {memberContacts.length === 0 ? (
                    <p className="empty-hint">No contacts in this group yet.</p>
                  ) : (
                    memberContacts.map((c) => (
                      <div key={c.id} className="group-member-item">
                        <div className="group-member-info">
                          <strong>{c.name}</strong>
                          <span>{c.email}</span>
                        </div>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeMember(c.id)}>
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : null}
          </section>
        </div>
      )}
    </div>
  );
}
