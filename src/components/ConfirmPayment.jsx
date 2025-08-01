import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ConfirmPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { coin, usdAmount, cryptoAmount, walletAddress } = state || {};

  if (!state) {
    return <p className="text-white text-center mt-10">No payment info found.</p>;
  }

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch('https://zentra-tzml.onrender.com/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(usdAmount),
          description: `${cryptoAmount} ${coin} deposit`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || 'Deposit request failed');
      }

      toast.success('Deposit request submitted and is pending approval');
      setTimeout(() => {
        navigate('/userdashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
      <div className="bg-gray-800 rounded p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Confirm Your Payment</h2>
        <p className="mb-2">Coin: <strong>{coin}</strong></p>
        <p className="mb-2">USD Amount: <strong>${usdAmount}</strong></p>
        <p className="mb-2">Crypto to Send: <strong>{cryptoAmount} {coin}</strong></p>
        <p className="mb-2">Wallet Address:</p>
        <p className="break-all bg-gray-700 p-3 mt-1 rounded">{walletAddress}</p>

        <p className="text-sm mt-4 text-gray-400">
          After sending the payment, click below to confirm.
        </p>

        <button
          onClick={handleConfirm}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 py-2 rounded"
        >
          I've Sent the Payment
        </button>
      </div>
    </div>
  );
};

export default ConfirmPayment;
