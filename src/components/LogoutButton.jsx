// components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLogOut } from 'react-icons/fi'; // Logout icon

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove auth token
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 text-white font-semibold px-4 py-2 rounded-md shadow-lg transition duration-200 group"
      title="Log out of your vault"
    >
      <FiLogOut className="text-lg group-hover:rotate-[-15deg] transition-transform duration-200" />
      Logout
    </button>
  );
};

export default LogoutButton;
