import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext.jsx';
import DarkModeToggle from './DarkModeToggle.jsx';
import Avatar from './Avatar.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="navbar-brand">
          EasyConnect
        </Link>
        {isAuthenticated ? (
          <>
            <nav className="navbar-links">
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-active' : '')}>
                Dashboard
              </NavLink>
              <NavLink to="/contacts" className={({ isActive }) => (isActive ? 'nav-active' : '')}>
                Contacts
              </NavLink>
              <NavLink to="/groups" className={({ isActive }) => (isActive ? 'nav-active' : '')}>
                Groups
              </NavLink>
              <NavLink to="/contacts/new" className={({ isActive }) => (isActive ? 'nav-active' : '')}>
                Add
              </NavLink>
            </nav>
            <div className="navbar-right">
              <DarkModeToggle />
              <div className="navbar-user">
                <Avatar name={user?.name || user?.email || 'User'} size={36} />
                <span className="navbar-user-name">{user?.name}</span>
              </div>
              <button type="button" className="btn btn-ghost navbar-logout" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-right">
            <DarkModeToggle />
            <NavLink to="/login" className="btn btn-primary btn-nav">
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-ghost btn-nav">
              Register
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
