import React, { useState } from 'react';

const CyberpunkPlaceholder = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300 450"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect width="300" height="450" fill="#121212" />
    <text
      x="150"
      y="225"
      fontSize="24"
      fill="#00fff2"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      NO IMAGE
    </text>
  </svg>
);

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <CyberpunkPlaceholder />
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
};

export default ImageWithFallback;
