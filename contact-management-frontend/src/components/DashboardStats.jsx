export default function DashboardStats({ totalContacts, loading }) {
  if (loading) {
    return <div className="dashboard-stats loading-inline">Loading stats…</div>;
  }
  return (
    <div className="dashboard-stats">
      <div className="stat-card card">
        <p className="stat-label">Total contacts</p>
        <p className="stat-value">{totalContacts}</p>
      </div>
    </div>
  );
}
