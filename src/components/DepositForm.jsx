import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBitcoin, FaRegCopy } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';

const walletAddresses = {
  BTC: 'bc1qkfguepjc8dymuhkajpx7jxvl8tp8kg88x2d8ar',
  USDT: '0xfca17919aF9C8Af69e87D08921A471A4AE15D34B', // TRC20 wallet
};

const coinIcons = {
  BTC: <FaBitcoin className="text-yellow-400 inline mr-2" />,
  USDT: <SiTether className="text-green-400 inline mr-2" />,
};

const DepositForm = () => {
  const navigate = useNavigate();
  const [coin, setCoin] = useState('BTC');
  const [usdAmount, setUsdAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [liveRates, setLiveRates] = useState({ BTC: 0, USDT: 1 });
  const [convertedAmount, setConvertedAmount] = useState('');

  useEffect(() => {
    const fetchRate = async (fsym) => {
      const url = `https://min-api.cryptocompare.com/data/generateAvg?fsym=${fsym}&tsym=USD&e=CCCAGG`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Rate fetch failed');
      const json = await res.json();
      return json.RAW?.PRICE || 0;
    };

    // BTC live, USDT always ~1
    fetchRate('BTC')
      .then((btc) => setLiveRates({ BTC: btc, USDT: 1 }))
      .catch(() => toast.error('Failed to fetch BTC rate'));
  }, []);

  useEffect(() => {
    if (usdAmount && liveRates[coin]) {
      setConvertedAmount((parseFloat(usdAmount) / liveRates[coin]).toFixed(8));
    } else {
      setConvertedAmount('');
    }
  }, [usdAmount, coin, liveRates]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(usdAmount);

    if (!usdAmount || isNaN(value) || value < 100) {
      return toast.error('Minimum deposit is $100 USD');
    }

    setSubmitted(true);
  };

  const copyAndContinue = () => {
    navigator.clipboard.writeText(walletAddresses[coin])
      .then(() => {
        toast.success('Wallet address copied!');
        setTimeout(() => {
          navigate('/confirmpayment', {
            state: {
              coin,
              usdAmount,
              cryptoAmount: convertedAmount,
              walletAddress: walletAddresses[coin],
            },
          });
        }, 1500);
      })
      .catch(() => toast.error('Copy failed'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold text-center mb-6 border-b border-gray-600 pb-2">Deposit Funds</h2>

        <form onSubmit={handleSubmit}>
          {/* Payment Method */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Payment Method</label>
            <input type="text" value="Crypto" readOnly className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 text-white" />
          </div>

          {/* Choose Coin */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Choose Coin</label>
            <select value={coin} onChange={(e) => setCoin(e.target.value)} className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 text-white">
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="USDT">Tether USDT (TRC20)</option>
            </select>
          </div>

          {/* USD Amount */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Amount (USD)</label>
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              placeholder="Minimum $100"
              className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 text-white"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition duration-200">
            Continue
          </button>
        </form>

        {submitted && (
          <div className="mt-6 bg-gray-900 rounded border border-gray-700 p-4 text-center">
            <p className="text-sm text-gray-400">Rate: 1 {coin} = ${liveRates[coin]?.toFixed(2)}</p>
            <p className="mt-2 text-xl font-bold text-green-400">{convertedAmount} {coin}</p>
            <p className="text-sm text-gray-400 mt-2">Send exactly to:</p>
            <div className="mt-2 bg-gray-800 rounded p-3 font-mono text-green-300 break-all relative">
              {walletAddresses[coin]}
              <button
                onClick={copyAndContinue}
                className="absolute top-2 right-2 text-gray-400 hover:text-white cursor-pointer"
                title="Copy & Continue"
              >
                <FaRegCopy />
              </button>
            </div>
            <div className="mt-4 flex justify-center items-center">
              {coinIcons[coin]}
              <span className="ml-1 font-semibold">{coin}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositForm;
