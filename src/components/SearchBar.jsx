import React from 'react';

/**
 * SearchBar: input controlado para búsquedas
 */
export default function SearchBar({ placeholder, value, onChange }) {
  return (
    <input
      type="text"
      className="border px-2 py-1 rounded w-full mb-4"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}
