import React, { useState } from 'react';

// Base64 encoded simple placeholder image
const placeholderImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? placeholderImage : src}
      alt={alt}
      className={`${className} ${error ? 'bg-gray-800' : ''}`}
      onError={() => setError(true)}
      style={error ? { backgroundColor: '#121212', objectFit: 'cover' } : undefined}
      {...props}
    />
  );
};

export default ImageWithFallback;
