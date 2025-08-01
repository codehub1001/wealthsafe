import React, { useEffect, useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import ReferralSummaryCard from '../components/ReferralSummaryCard';
import WalletDashboard from '../components/WalletDashboard';
import {
  FaUser, FaEnvelope, FaBirthdayCake, FaGlobe, FaFlag, FaGift,
  FaEdit, FaSave, FaTimes, FaWallet, FaIdBadge, FaCopy
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfileCard = ({ label, value, icon, editable, onChange, name, type = 'text', copyable }) => {
  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      toast.success('Referral code copied!');
    }
  };

  return (
    <div className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-lg px-5 py-4 shadow-sm">
      <div className="text-cyan-400 text-xl">{icon}</div>
      <div className="flex-1">
        <p className="text-xs uppercase font-semibold text-gray-400 tracking-wide mb-1">
          {label}
        </p>
        {editable && name ? (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full bg-gray-900 text-white placeholder-gray-500 border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-white truncate">{value}</p>
            {copyable && (
              <button
                onClick={handleCopy}
                className="ml-4 text-cyan-400 hover:text-cyan-300 transition text-sm"
                title="Copy Referral Code"
              >
                <FaCopy />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return setError('Token missing. Please log in again.');

      try {
        const res = await fetch('http://localhost:3000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) return setError(data.message || 'Failed to load profile');

        setUser(data.user);
        setForm(data.user);
      } catch (err) {
        setError('Error fetching profile');
      }
    };

    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    try {
      const updatedData = {
        ...form,
        dob: form.dob ? new Date(form.dob).toISOString() : null,
      };

      const res = await fetch('http://localhost:3000/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Failed to update profile');

      toast.success('Profile updated!');
      setUser(data.user);
      setEditMode(false);
    } catch (err) {
      toast.error('Something went wrong while updating');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (error) {
    return (
      <div className="text-red-600 bg-red-100 border border-red-300 rounded-md p-5 mt-10 mx-auto max-w-xl text-center font-semibold">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-gray-400 text-center mt-10 text-lg font-medium animate-pulse">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-950 px-6 py-12 text-white">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        {/* Top Buttons */}
        <div className="flex justify-between items-center">
          <LogoutButton />
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setEditMode(false);
              setForm(user);
            }}
            className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-md hover:bg-gray-700 transition flex items-center gap-2"
          >
            <FaIdBadge className="text-cyan-400" />
            {showProfile ? 'Hide Profile' : 'Show Profile'}
          </button>
        </div>

        {/* Greeting */}
        <div className="w-full bg-gray-900 text-white rounded-xl shadow p-6 md:p-8 border border-gray-800">
          <div className="mb-4 flex justify-between items-center border-b border-gray-700 pb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-wide flex items-center gap-2">
              <FaUser className="text-cyan-400 text-lg" />
              Welcome, <span className="text-cyan-400">{user.name?.split(' ')[0]}</span>
            </h2>
            {showProfile && !editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-cyan-400 hover:text-cyan-300 transition text-xl"
                title="Edit Profile"
              >
                <FaEdit />
              </button>
            )}
            {showProfile && editMode && (
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="text-green-400 hover:text-green-300 text-xl"
                  title="Save Changes"
                >
                  <FaSave />
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setForm(user);
                  }}
                  className="text-red-400 hover:text-red-300 text-xl"
                  title="Cancel Edit"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {/* Profile Details */}
          {showProfile && (
            <div className="space-y-4">
              <ProfileCard
                label="Full Name"
                name="name"
                value={form.name}
                editable={editMode}
                onChange={handleChange}
                icon={<FaUser />}
              />
              <ProfileCard label="Email" value={user.email} icon={<FaEnvelope />} />
              <ProfileCard
                label="Date of Birth"
                name="dob"
                type="date"
                value={form.dob?.split('T')[0]}
                editable={editMode}
                onChange={handleChange}
                icon={<FaBirthdayCake />}
              />
              <ProfileCard
                label="Country"
                name="country"
                value={form.country}
                editable={editMode}
                onChange={handleChange}
                icon={<FaGlobe />}
              />
              <ProfileCard
                label="Nationality"
                name="nationality"
                value={form.nationality}
                editable={editMode}
                onChange={handleChange}
                icon={<FaFlag />}
              />
              <ProfileCard
                label="Referral Code"
                value={user.referralCode || '—'}
                icon={<FaGift />}
                copyable
              />
            </div>
          )}
        </div>

        {/* Wallet Section */}
        <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-2xl font-semibold flex items-center gap-3">
            <FaWallet className="text-cyan-400" /> Wallet Overview
          </h3>
          <WalletDashboard />
        </div>

        {/* Referral Summary */}
        <ReferralSummaryCard />
      </div>
    </section>
  );
};

export default UserDashboard;
