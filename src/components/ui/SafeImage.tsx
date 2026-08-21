'use client';

import React, { useState } from 'react';
import { FileWarning } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  category?: string;
}

export default function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'Civic Issue Case',
  category,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`w-full h-full bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-3 text-center text-slate-400 font-mono ${className}`}>
        <FileWarning className="w-5 h-5 text-amber-400 mb-1 shrink-0" />
        <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
          Evidence Unavailable
        </span>
        {category && (
          <span className="text-[10px] text-indigo-400 font-mono uppercase font-semibold mt-0.5">
            [{category}]
          </span>
        )}
        <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[90%] mt-0.5">
          {fallbackTitle}
        </span>
        <span className="text-[9px] text-slate-500 mt-1">
          Evidence asset could not be loaded from storage
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
