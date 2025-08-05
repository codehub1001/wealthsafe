import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaTelegramPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-extrabold mb-3">zentravault</h3>
          <p className="text-sm text-blue-100 leading-relaxed">
            Empowering your crypto journey with smart, secure, and scalable investment plans.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-blue-100">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/plans" className="hover:text-white transition">Plans</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-blue-100">
            <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            <li><Link to="/faq" className="hover:text-white transition">FAQs</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="p-2 bg-blue-800 hover:bg-white hover:text-blue-800 rounded-full transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="p-2 bg-blue-800 hover:bg-white hover:text-blue-800 rounded-full transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="p-2 bg-blue-800 hover:bg-white hover:text-blue-800 rounded-full transition"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="#"
              aria-label="Telegram"
              className="p-2 bg-blue-800 hover:bg-white hover:text-blue-800 rounded-full transition"
            >
              <FaTelegramPlane />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-blue-800 mt-12 pt-6 text-center text-sm text-blue-200">
        &copy; {new Date().getFullYear()} zentravault. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
