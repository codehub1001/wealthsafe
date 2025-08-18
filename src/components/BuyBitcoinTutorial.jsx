import React from "react";

const BuyBitcoinTutorial = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 bg-gray-50 min-h-screen">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
        How to Buy Bitcoin – Safe Step-by-Step Guide
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 text-center max-w-2xl mb-8">
        Follow this updated tutorial to learn how to buy Bitcoin safely and confidently—even if you're a complete beginner.
      </p>

      {/* Embedded YouTube Video */}
      <div className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/7OouSSeZhcQ"
          title="Buy Bitcoin Safely In 2025: Step By Step Guide"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default BuyBitcoinTutorial;
