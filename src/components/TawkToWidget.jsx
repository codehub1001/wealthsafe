// src/components/TawkToWidget.jsx
import { useEffect } from 'react';

const TawkToWidget = () => {
  useEffect(() => {
    if (window.Tawk_API) return; // Prevent duplicate script injection

    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6891b6fdddd4a01926700de1/1j1sj5kf9';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    const s0 = document.getElementsByTagName('script')[0];
    s0.parentNode.insertBefore(s1, s0);
  }, []);

  return null; // No visible UI, it's just injecting the script
};

export default TawkToWidget;
