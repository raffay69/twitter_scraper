import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col h-[50vh] items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 border-4 border-gray-800 rounded-full animate-spin border-t-white"></div>
        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>
      <div className="text-white text-lg font-medium animate-pulse">
        Scraping trends...
      </div>
    </div>
  );
};

export default LoadingSpinner;
