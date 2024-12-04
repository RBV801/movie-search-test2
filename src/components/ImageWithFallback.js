import React, { useState, useEffect } from 'react';

const CyberpunkPlaceholder = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300 450"
    className="w-full h-full"
  >
    {/* Background Grid */}
    <defs>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path
          d="M 30 0 L 0 0 0 30"
          fill="none"
          stroke="#ffffff10"
          strokeWidth="1"
        />
      </pattern>
      
      {/* Glow Filter */}
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 18 -7"
          result="glow"
        />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Background */}
    <rect width="100%" height="100%" fill="#121212" />
    <rect width="100%" height="100%" fill="url(#grid)" />

    {/* Skull Design */}
    <g transform="translate(150, 225)" filter="url(#glow)">
      <path
        d="M-50 -60 C-50 -90, 50 -90, 50 -60 L50 20 C50 50, -50 50, -50 20 Z"
        fill="none"
        stroke="#00fff2"
        strokeWidth="2"
      />
      {/* Eyes */}
      <path
        d="M-30 -20 L-10 -20 L-10 0 L-30 0 Z M10 -20 L30 -20 L30 0 L10 0 Z"
        fill="#ff00ea"
      />
      {/* Teeth */}
      <path
        d="M-30 20 L30 20 L20 40 L-20 40 Z"
        fill="none"
        stroke="#00fff2"
        strokeWidth="2"
      />
    </g>

    {/* Text */}
    <text
      x="150"
      y="350"
      fontFamily="monospace"
      fontSize="24"
      fill="#00fff2"
      textAnchor="middle"
      filter="url(#glow)"
    >
      NO_SIGNAL//
    </text>
  </svg>
);

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);
  const [hasValidSource, setHasValidSource] = useState(true);

  useEffect(() => {
    setError(false);
    setHasValidSource(Boolean(src && src !== 'null' && src !== 'undefined'));
  }, [src]);

  const shouldShowPlaceholder = error || !hasValidSource;

  if (shouldShowPlaceholder) {
    return (
      <div 
        className={`${className} relative w-full h-full`}
        style={{ 
          backgroundColor: '#121212',
          aspectRatio: '2/3',
          overflow: 'hidden'
        }}
      >
        <CyberpunkPlaceholder />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} w-full h-full object-cover`}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default ImageWithFallback;
