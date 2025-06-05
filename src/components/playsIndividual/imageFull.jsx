// components/FullScreenWidthImage.js

import React from 'react';
import Image from 'next/image'; // Import the next/image component

const FullScreenWidthImage = ({
  src,
  alt,
  imageHeight = '65rem', // Default height for the banner. Adjust as needed.
  objectFit = 'cover',   // How the image should fit: 'cover', 'contain', etc.
  priority = false,      // Set to true if this is your LCP (Largest Contentful Paint) image.
  quality,               // Optional: image quality (1-100)
  style,                 // Optional: additional styles for the wrapper div
}) => {
  const wrapperStyle = {
    position: 'relative', // Crucial for next/image with layout="fill"
    width: '100vw',       // Full viewport width
    height: imageHeight,  // The container needs a defined height for layout="fill"
    ...style,             // Merge with any additional styles for the wrapper
  };

  return (
    <div style={wrapperStyle}>
      <Image
        src={src}               // Can be a string path (from /public or external) or a StaticImageData import
        alt={alt}
        layout="fill"           // Makes the image fill the parent (the div above)
        objectFit={objectFit}   // 'cover', 'contain', etc.
        priority={priority}     // Preload if true
        quality={quality}       // Set image quality
        sizes="100vw"           // Important for optimization: informs next/image about the image's display width
        // You can add other next/image props if needed, e.g., placeholder, blurDataURL
      />
    </div>
  );
};


export default FullScreenWidthImage;