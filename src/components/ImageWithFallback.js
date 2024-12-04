import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);

  return (
    <div className={`${className} ${error ? 'relative' : ''}`} style={error ? { backgroundColor: '#1a1a1a', border: '2px dashed #4a90e2' } : undefined}>
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div>
            <span role="img" aria-label="Movie Camera" className="text-cyan-400 text-lg mb-2">
              🎬
            </span>
            <div className="text-cyan-400 text-sm">No Poster Available</div>
            <div className="text-cyan-400 text-xs mt-2">{alt}</div>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover`}
          onError={() => setError(true)}
          {...props}
        />
      )}
    </div>
  );
};

export default ImageWithFallback;
