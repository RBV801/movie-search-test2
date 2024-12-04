import React, { useState } from 'react';
import cyberpunkPlaceholder from '../assets/CyberpunkPlaceholder.svg';

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setError(true);
    }
  };

  return (
    <img
      src={error ? cyberpunkPlaceholder : src}
      alt={alt}
      onError={handleError}
      className={`transition-opacity duration-300 ${className || ''}`}
      {...props}
    />
  );
};

export default ImageWithFallback;
