export default function SearchBar({ value, onChange, placeholder = 'Search by name or email…' }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search contacts"
      />
    </div>
  );
}
