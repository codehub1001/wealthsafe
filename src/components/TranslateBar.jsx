// TranslateBar.jsx
import { useEffect, useState } from 'react';
import { FaGlobe } from 'react-icons/fa';

const TranslateBar = () => {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.google?.translate) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      setLoaded(true);
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,fr,es,de,pt,zh,ar,ru',
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        },
        'google_translate_element'
      );
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setVisible(!visible)}
        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm px-2.5 py-1.5 rounded shadow"
      >
        <FaGlobe className="text-sm" />
        <span className="hidden sm:inline">Language</span>
        <svg
          className={`w-3 h-3 transition-transform ${visible ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {visible && loaded && (
        <div
          id="google_translate_element"
          className="absolute right-0 mt-2 p-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow z-50 text-sm"
        />
      )}
    </div>
  );
};

export default TranslateBar;
