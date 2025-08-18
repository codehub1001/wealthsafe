// src/components/TawkToWidget.jsx
import { useEffect } from 'react';

const TawkToWidget = () => {
  useEffect(() => {
    if (window.Tawk_API) return; // Prevent duplicate script injection

    const Tawk_API = window.Tawk_API || {};
    const Tawk_LoadStart = new Date();

    (function () {
      const s1 = document.createElement('script');
      const s0 = document.getElementsByTagName('script')[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/68a3337875e23f192b2c4ced/1j2uo24fq';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  return null; // No visible UI, just injects the script
};

export default TawkToWidget;
