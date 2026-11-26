'use client';

import { useId } from 'react';

const RATINGS = [1, 2, 3, 4, 5];

interface RatingInputProps {
  legend: string;
  value: number | null;
  format: (value: number) => string;
  onChange: (value: number) => void;
}

export function RatingInput({ legend, value, format, onChange }: RatingInputProps) {
  const name = useId();
  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium">{legend}</legend>
      <div className="flex gap-4">
        {RATINGS.map((rating) => (
          <label key={rating} className="flex items-center gap-1">
            <input
              type="radio"
              name={name}
              value={rating}
              checked={value === rating}
              onChange={() => onChange(rating)}
            />
            {format(rating)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
