import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          {/* Logo inside spinning ring */}
          <img
            src="/img/wealthsafe.png"
            alt="Zentra Vault Logo"
            className="absolute inset-2 w-16 h-16 object-contain animate-pulse z-10"
          />
          <div className="w-full h-full border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-blue-700 text-lg font-semibold animate-pulse">Loading Wealth Safe Gain...</p>
      </div>
    </div>
  );
};

export default Loader;
