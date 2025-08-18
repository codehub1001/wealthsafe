import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiLogIn } from 'react-icons/fi';
import { HiOutlineHome, HiOutlineClipboardCheck } from 'react-icons/hi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { MdOutlineContactSupport } from 'react-icons/md';

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);

  const navLinks = [
    { name: 'Home', to: '/', icon: <HiOutlineHome className="inline mr-1 text-lg" /> },
    { name: 'About', to: '/about', icon: <AiOutlineInfoCircle className="inline mr-1 text-lg" /> },
    { name: 'Plans', to: '/plans', icon: <HiOutlineClipboardCheck className="inline mr-1 text-lg" /> },
    { name: 'Contact', to: '/contact', icon: <MdOutlineContactSupport className="inline mr-1 text-lg" /> },
  ];

  const toggleNav = () => setNavOpen(!navOpen);

  return (
    <header className="bg-white/90 backdrop-blur-lg text-blue-900 shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-1.5 bg-blue-100 rounded-full shadow-md transition-transform group-hover:scale-110 duration-300">
            <img
              src="/img/wealthsafe.png"
              alt="WealthSafeGain Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          {/* <span className="text-2xl font-extrabold text-blue-800 tracking-wide group-hover:text-blue-900 transition-all">
            WealthSafeGain
          </span> */}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 animate-fade-in">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `transition-all duration-200 flex items-center text-sm font-medium gap-1 border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-blue-900 hover:border-blue-400 hover:text-blue-500'
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-blue-500 transition-all duration-200"
          >
            <FiLogIn /> Login
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-2xl text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
          onClick={toggleNav}
          aria-label="Toggle menu"
        >
          {navOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {navOpen && (
        <div className="md:hidden bg-blue-50 px-6 py-6 space-y-5 rounded-b-2xl shadow-inner animate-slide-down">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              onClick={toggleNav}
              className={({ isActive }) =>
                `block text-base flex items-center gap-2 rounded-md px-2 py-2 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-blue-900 hover:bg-blue-100 hover:text-blue-600'
                } transition duration-200`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/login"
            onClick={toggleNav}
            className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition"
          >
            <FiLogIn /> Login
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
