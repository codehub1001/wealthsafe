import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function InvestmentDashboard() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [investments, setInvestments] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPlans();
    fetchUserInvestments();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/investment/plans');
      const data = await res.json();
      setPlans(data);
    } catch {
      toast.error('Failed to load plans');
    }
  };

  const fetchUserInvestments = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/investment/my-investments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setInvestments(data);
    } catch {
      toast.error('Failed to load your investments');
    }
  };

  const handleInvest = async () => {
    if (!selectedPlan) return toast.error('Select an investment plan');
    if (!amount || isNaN(amount)) return toast.error('Enter a valid amount');

    const parsedAmount = parseFloat(amount);

    // Optional frontend validation for amount limits
    if (parsedAmount < selectedPlan.minAmount) {
      return toast.error(`Minimum amount is ${selectedPlan.minAmount}`);
    }
    if (selectedPlan.maxAmount && parsedAmount > selectedPlan.maxAmount) {
      return toast.error(`Maximum amount is ${selectedPlan.maxAmount}`);
    }

    try {
      const res = await fetch('http://localhost:3000/api/investment/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: selectedPlan.id, amount: parsedAmount }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Investment failed');

      toast.success('Investment created successfully');
      setAmount('');
      setSelectedPlan(null);
      fetchUserInvestments();
    } catch {
      toast.error('Investment request failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Investment Plans</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-4 rounded-lg border cursor-pointer ${
              selectedPlan?.id === plan.id ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
            }`}
            onClick={() => setSelectedPlan(plan)}
          >
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p>Price Range: ${plan.minAmount} - {plan.maxAmount ?? '∞'}</p>
            <p>Returns: {(plan.dailyReturn * 100).toFixed(2)}% daily</p>
            <p>Duration: {plan.duration} days</p>
            <p>Perks: {plan.perks}</p>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Invest in {selectedPlan.name}</h3>
          <input
            type="number"
            min={selectedPlan.minAmount}
            max={selectedPlan.maxAmount || undefined}
            placeholder="Amount to invest"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded w-48"
          />
          <button
            onClick={handleInvest}
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Invest
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Your Investments</h2>
      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Plan</th>
            <th className="border border-gray-300 p-2">Amount</th>
            <th className="border border-gray-300 p-2">Start Date</th>
            <th className="border border-gray-300 p-2">End Date</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Expected Return</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => (
            <tr key={inv.id}>
              <td className="border border-gray-300 p-2">{inv.plan.name}</td>
              <td className="border border-gray-300 p-2">${inv.amount.toFixed(2)}</td>
              <td className="border border-gray-300 p-2">{new Date(inv.startDate).toLocaleDateString()}</td>
              <td className="border border-gray-300 p-2">{new Date(inv.endDate).toLocaleDateString()}</td>
              <td className="border border-gray-300 p-2">{inv.status}</td>
              <td className="border border-gray-300 p-2">${inv.expectedReturn.toFixed(2)}</td>
            </tr>
          ))}
          {investments.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No investments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
