import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    console.warn(`Image failed to load: ${src}`);
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  if (error) {
    return (
      <div className={`${className} placeholder-image`} {...props}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="placeholder-icon"
        >
          <rect width="24" height="24" fill="#1a1a1a" />
          <path
            d="M12 8.5V12M12 15.5H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="#666"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text
            x="50%"
            y="75%"
            textAnchor="middle"
            fill="#666"
            fontSize="0.2em"
            fontFamily="system-ui"
          >
            {alt || 'Image not available'}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`image-container ${className}`}>
      {loading && (
        <div className="loading-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`${className} ${loading ? 'loading' : ''}`}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;