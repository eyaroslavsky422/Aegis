import React from "react";

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-1 text-sm text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 ${className}`}
    />
  );
}
