import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;

  const handleClick = (starIndex: number, isLeftHalf: boolean) => {
    if (readonly || !onChange) return;
    const newValue = isLeftHalf ? starIndex * 2 - 1 : starIndex * 2;
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHoverValue(0)}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const fillLevel = Math.min(Math.max(displayValue - (starIndex - 1) * 2, 0), 2);

        return (
          <div key={starIndex} className={`relative ${SIZES[size]} ${readonly ? '' : 'cursor-pointer'}`}>
            {!readonly && (
              <>
                <div
                  className="absolute left-0 top-0 z-10 h-full w-1/2"
                  onMouseEnter={() => setHoverValue(starIndex * 2 - 1)}
                  onClick={() => handleClick(starIndex, true)}
                />
                <div
                  className="absolute right-0 top-0 z-10 h-full w-1/2"
                  onMouseEnter={() => setHoverValue(starIndex * 2)}
                  onClick={() => handleClick(starIndex, false)}
                />
              </>
            )}

            <svg viewBox="0 0 24 24" className={SIZES[size]}>
              <defs>
                <linearGradient id={`star-grad-${starIndex}-${value}-${hoverValue}`}>
                  <stop offset={`${(fillLevel / 2) * 100}%`} stopColor="#facc15" />
                  <stop offset={`${(fillLevel / 2) * 100}%`} stopColor="#374151" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#star-grad-${starIndex}-${value}-${hoverValue})`}
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </div>
        );
      })}
      <span className="ml-2 text-sm text-gray-400">
        {value > 0 ? `${value}/10` : ''}
      </span>
    </div>
  );
}
