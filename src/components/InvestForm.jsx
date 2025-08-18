import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import useNavigate
import { toast } from 'react-toastify';

const InvestForm = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // ✅ initialize navigate

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('https://zentra-tzml.onrender.com/api/investment/plans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      toast.error('Failed to load investment plans');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlanId || !amount) {
      return toast.error('Please select a plan and enter an amount');
    }

    setLoading(true);
    try {
      const res = await fetch('https://zentra-tzml.onrender.com/api/investment/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: selectedPlanId, amount: parseFloat(amount) }),
      });

      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message || 'Investment failed');
      }

      toast.success('Investment created successfully');
      setAmount('');
      setSelectedPlanId('');
      navigate('/userdashboard'); // ✅ redirect to user dashboard
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full min-h-screen flex flex-col justify-center max-w-md mx-auto">
      <h2 className="text-2xl font-extrabold mb-6 text-center">Start an Investment</h2>

      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <div className="mb-5">
          <label className="block text-gray-300 font-semibold mb-2">Select Plan</label>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
          >
            <option value="" className="text-gray-500">-- Choose a Plan --</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} (${plan.minAmount} - {plan.maxAmount ?? '∞'}) | {(plan.dailyReturn * 100).toFixed(2)}% daily
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 font-semibold mb-2">Amount to Invest</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Enter amount"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 transition font-semibold py-3 rounded-md shadow"
        >
          {loading ? 'Processing...' : 'Invest Now'}
        </button>
      </form>
    </div>
  );
};

export default InvestForm;
