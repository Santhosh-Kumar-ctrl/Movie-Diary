interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  mediaType: 'multi' | 'movie' | 'tv';
  onMediaTypeChange: (type: 'multi' | 'movie' | 'tv') => void;
}

const TABS = [
  { value: 'multi' as const, label: 'All' },
  { value: 'movie' as const, label: 'Movies' },
  { value: 'tv' as const, label: 'TV Shows' },
];

export function SearchBar({ query, onQueryChange, mediaType, onMediaTypeChange }: SearchBarProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search movies and TV shows..."
          className="w-full rounded-xl border border-gray-700 bg-gray-800 py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onMediaTypeChange(tab.value)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              mediaType === tab.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
