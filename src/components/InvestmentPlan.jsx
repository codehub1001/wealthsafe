import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const InvestmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('https://wealthsafeapi.onrender.com/api/investments/plans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPlans(data);
    } catch {
      toast.error('Failed to fetch plans');
    }
  };

  const invest = async (planId) => {
    const amount = prompt('Enter amount to invest:');
    if (!amount || isNaN(amount)) return toast.error('Invalid amount');

    try {
      const res = await fetch('https://wealthsafeapi.onrender.com/api/investments/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId, amount: parseFloat(amount) }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);
      toast.success('Investment successful');
    } catch {
      toast.error('Investment failed');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`p-4 rounded-xl shadow-lg bg-gradient-to-br ${plan.color} text-white ${plan.glow}`}
        >
          <h2 className="text-xl font-bold">{plan.name}</h2>
          <p className="text-sm">{plan.price || `$${plan.minAmount} - $${plan.maxAmount || '∞'}`}</p>
          <p className="text-xs mt-1">{plan.dailyReturn * 100}% daily for {plan.duration} days</p>
          <ul className="mt-2 text-xs">
            {plan.perks.split(',').map((perk, idx) => (
              <li key={idx}>• {perk.trim()}</li>
            ))}
          </ul>
          <button
            onClick={() => invest(plan.id)}
            className="mt-4 px-3 py-1 bg-black bg-opacity-30 rounded text-xs hover:bg-opacity-50"
          >
            Invest
          </button>
        </div>
      ))}
    </div>
  );
};

export default InvestmentPlans;
