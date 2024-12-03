import { useState } from "react";
import { Spin } from "antd";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

function ImageWithLoader({ src, alt, className = "" }: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative inline-block">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Spin className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      )}

      {hasError ? (
        <div className="flex items-center justify-center bg-gray-100 p-4 text-gray-500">
          Failed to load image
        </div>
      ) : (
        <img
          style={{ height: 200, objectFit: "cover" }}
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? "invisible" : "visible"}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

export default ImageWithLoader;
