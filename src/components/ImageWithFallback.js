import React, { useState } from 'react';

const CyberpunkPlaceholder = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300 450"
    style={{ width: '100%', height: '100%' }}
  >
    <rect width="100%" height="100%" fill="#121212" />
    <path
      d="M0 0h300v450h-300z"
      fill="none"
      stroke="#ffffff10"
      strokeWidth="1"
      strokeDasharray="30"
    />
    <path
      d="M100 165C100 135 200 135 200 165V245C200 275 100 275 100 245Z"
      fill="none"
      stroke="#00fff2"
      strokeWidth="2"
    />
    <rect x="120" y="205" width="20" height="20" fill="#ff00ea" />
    <rect x="160" y="205" width="20" height="20" fill="#ff00ea" />
    <path
      d="M120 245h60l-10 20h-40z"
      fill="none"
      stroke="#00fff2"
      strokeWidth="2"
    />
    <text
      x="150"
      y="350"
      fontFamily="monospace"
      fontSize="24"
      fill="#00fff2"
      textAnchor="middle"
    >
      NO_SIGNAL//
    </text>
  </svg>
);

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);

  return error ? (
    <div className={`relative ${className}`}>
      <CyberpunkPlaceholder />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default ImageWithFallback;
