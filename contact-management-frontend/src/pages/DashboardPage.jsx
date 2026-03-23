import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats } from '../services/contactService.js';
import DashboardStats from '../components/DashboardStats.jsx';
import Avatar from '../components/Avatar.jsx';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchDashboardStats();
        if (!cancelled) setStats(data);
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      {error ? <div className="alert-error">{error}</div> : null}
      <DashboardStats totalContacts={stats?.totalContacts ?? 0} loading={loading} />
      <section className="dashboard-recent">
        <h2>Recent contacts</h2>
        {loading ? (
          <div className="loading-inline">Loading…</div>
        ) : !stats?.recentContacts?.length ? (
          <p className="empty-hint">
            No contacts yet. <Link to="/contacts/new">Add one</Link>
          </p>
        ) : (
          <div className="recent-grid">
            {stats.recentContacts.map((c) => (
              <div key={c.id} className="card recent-card">
                <div className="recent-card-head">
                  <Avatar name={c.name} size={44} />
                  <div className="recent-card-text">
                    <p className="recent-name">{c.name}</p>
                    <p className="recent-meta">{c.email}</p>
                  </div>
                </div>
                <div className="recent-card-footer">
                  <Link to={`/contacts/${c.id}/edit`} className="btn btn-accent btn-sm">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
