import React, { useState, useEffect } from 'react';

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);
  const [hasValidSource, setHasValidSource] = useState(true);

  useEffect(() => {
    // Reset error state when src changes
    setError(false);
    // Check if we have a valid source
    setHasValidSource(Boolean(src && src !== 'null' && src !== 'undefined'));
  }, [src]);

  const shouldShowPlaceholder = error || !hasValidSource;

  if (shouldShowPlaceholder) {
    return (
      <div 
        className={`${className} relative`}
        style={{ 
          backgroundColor: '#1a1a1a',
          border: '2px dashed #4a90e2',
          minHeight: '300px'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div>
            <span role="img" aria-label="Movie Camera" className="text-cyan-400 text-2xl block mb-2">
              🎬
            </span>
            <div className="text-cyan-400 text-sm font-medium">No Poster Available</div>
            <div className="text-cyan-400 text-xs mt-2 max-w-[200px] overflow-hidden text-ellipsis">{alt}</div>
          </div>
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
