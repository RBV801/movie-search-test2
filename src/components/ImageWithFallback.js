import React, { useState } from 'react';
import placeholderImage from '../assets/placeholder.svg';

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? placeholderImage : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default ImageWithFallback;
