import { getInitials } from '../utils/initials.js';

export default function Avatar({ name, size = 40 }) {
  const initials = getInitials(name);
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      title={name}
      aria-hidden
    >
      {initials}
    </span>
  );
}
