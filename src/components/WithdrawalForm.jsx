import React, { useState } from 'react';
import { toast } from 'react-toastify';

const WithdrawalForm = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('crypto'); // could expand later
  const [coin, setCoin] = useState('BTC');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return toast.error('Please enter a valid withdrawal amount');
    }
    if (paymentMethod === 'crypto' && !walletAddress.trim()) {
      return toast.error('Please enter your wallet address');
    }

    setLoading(true);

    try {
      const res = await fetch('https://zentra-tzml.onrender.com/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description,
          paymentMethod,
          coin,
          walletAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Withdrawal request failed');
      } else {
        toast.success('Withdrawal request submitted successfully');
        setAmount('');
        setDescription('');
        setWalletAddress('');
        setCoin('BTC');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-gradient-to-br from-gray-900 to-black'>
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-md text-white"
    >
      <h2 className="text-2xl mb-4 font-semibold">Withdraw Funds</h2>

      <label className="block mb-4">
        Amount
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
          placeholder="Enter amount"
          required
        />
      </label>

      <label className="block mb-4">
        Payment Method
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
          required
        >
          <option value="crypto">Crypto Payment</option>
          {/* Extendable for other methods */}
        </select>
      </label>

      {paymentMethod === 'crypto' && (
        <>
          <label className="block mb-4">
            Coin
            <select
              value={coin}
              onChange={(e) => setCoin(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              required
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="LTC">Litecoin (LTC)</option>
            </select>
          </label>

          <label className="block mb-4">
            Wallet Address
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              placeholder="Enter your wallet address"
              required
            />
          </label>
        </>
      )}

      <label className="block mb-4">
        Description (optional)
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
          placeholder="Reason for withdrawal"
          rows={3}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded bg-cyan-600 hover:bg-cyan-700 hover:cursor-pointer transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Submitting...' : 'Withdraw'}
      </button>
    </form>
    </div>
  );
};

export default WithdrawalForm;
