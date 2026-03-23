/**
 * Group contacts by the first letter of name (A–Z). Non-letters → "#".
 */
export function getNameGroupKey(name) {
  if (!name || typeof name !== 'string') return '#';
  const trimmed = name.trim();
  if (!trimmed) return '#';
  const ch = trimmed.charAt(0).toUpperCase();
  if (ch >= 'A' && ch <= 'Z') return ch;
  if (ch >= '0' && ch <= '9') return '#';
  return '#';
}

export function groupContactsAlphabetically(contacts) {
  const map = new Map();
  for (const c of contacts) {
    const key = getNameGroupKey(c.name);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(c);
  }

  const sortKey = (a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  };

  return [...map.entries()]
    .sort(([a], [b]) => sortKey(a, b))
    .map(([letter, items]) => ({
      letter,
      items: [...items].sort((x, y) =>
        (x.name || '').localeCompare(y.name || '', undefined, { sensitivity: 'base' })
      ),
    }));
}
