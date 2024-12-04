import React, { useState, useEffect } from 'react';

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
          backgroundColor: '#1a1a1a',
          border: '2px dashed #4a90e2',
          aspectRatio: '2/3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="flex flex-col items-center justify-center text-center p-4">
          <span role="img" aria-label="Movie Camera" className="text-cyan-400 text-2xl mb-3">
            🎬
          </span>
          <div className="text-cyan-400 text-sm font-medium">No Poster Available</div>
          {alt && alt !== 'Movie Poster' && (
            <div className="text-cyan-400 text-xs mt-2 px-2 max-w-[80%] overflow-hidden text-ellipsis">
              {alt}
            </div>
          )}
        </div>
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
