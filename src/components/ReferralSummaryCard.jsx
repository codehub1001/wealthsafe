import React, { useEffect, useState } from 'react';
import { FaUsers, FaMoneyBillWave, FaGift } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ReferralSummaryCard = () => {
  const [summary, setSummary] = useState({ referredCount: 0, totalBonus: 0 });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReferralSummary = async () => {
      try {
        const res = await fetch('https://wealthsafeapi.onrender.com/api/referrals', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch referral summary');
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralSummary();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-white shadow-md text-center animate-pulse">
        Loading referral summary...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 border border-gray-800 flex flex-col sm:flex-row gap-6 items-center justify-between">
      <div className="flex items-center gap-4">
        <FaUsers className="text-cyan-400 text-3xl" />
        <div>
          <p className="text-sm text-gray-400 uppercase">Referrals</p>
          <h2 className="text-xl font-bold">{summary.referredCount}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <FaMoneyBillWave className="text-yellow-400 text-3xl" />
        <div>
          <p className="text-sm text-gray-400 uppercase">Total Bonus</p>
          <h2 className="text-xl font-bold text-green-400">${summary.totalBonus.toFixed(2)}</h2>
        </div>
      </div>
    </div>
  );
};

export default ReferralSummaryCard;
