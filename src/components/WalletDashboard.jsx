import React, { useEffect, useState } from 'react';
import InvestmentStatusCard from './InvestmentStatusCard';
import { toast } from 'react-toastify';
import {
  FaDownload,
  FaUpload,
  FaChartLine,
  FaHistory,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const WalletDashboard = () => {
  const [wallet, setWallet] = useState(null);
  const [btcRate, setBtcRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [investment, setInvestment] = useState(null);
  const [showBalance, setShowBalance] = useState(true);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWallet();
    fetchBtcRate();
    fetchActiveInvestment();
  }, []);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://zentra-tzml.onrender.com:3000/api/wallet', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch wallet');
      const data = await res.json();
      setWallet(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBtcRate = async () => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      const data = await res.json();
      setBtcRate(data.bitcoin.usd);
    } catch {
      toast.error('Failed to load BTC rate');
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('https://zentra-tzml.onrender.com/api/wallet/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchActiveInvestment = async () => {
    try {
      const res = await fetch('https://zentra-tzml.onrender.com/api/investment/my-investments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch investments');
      const data = await res.json();
      const active = data.find((inv) => inv.status === 'ACTIVE');
      setInvestment(active || null);
    } catch (err) {
      console.error('Failed to fetch investment:', err);
    }
  };

  const toggleHistory = () => {
    if (!showHistory) fetchTransactions();
    setShowHistory(!showHistory);
  };

  const toggleBalanceVisibility = () => {
    setShowBalance((prev) => !prev);
  };

  if (loading || btcRate === null)
    return (
      <p className="text-center text-gray-400 mt-10 animate-pulse font-medium text-lg">
        Loading wallet data...
      </p>
    );

  if (!wallet)
    return (
      <p className="text-center text-red-600 mt-10 font-semibold text-lg">
        Failed to load wallet data.
      </p>
    );

  const btcValue = wallet.balance / btcRate;

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 text-gray-900 max-w-4xl mx-auto">
      {/* Wallet Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6 px-4 py-4 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
        {/* USD Balance */}
        <div className="flex-1 text-center w-full">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Balance (USD)</p>
          <div className="flex justify-center items-center gap-2">
            <p className="text-2xl font-bold text-green-600 tracking-wide">
              {showBalance ? `$${wallet.balance.toFixed(2)}` : (
                <span className="blur-sm select-none">$00000.00</span>
              )}
            </p>
            <button
              onClick={toggleBalanceVisibility}
              className="text-gray-500 hover:text-gray-700 transition"
              title={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
            </button>
          </div>
        </div>

        <div className="border-t sm:border-l sm:border-t-0 border-gray-300 h-px sm:h-12 sm:mx-4 w-full sm:w-px" />

        {/* BTC Balance */}
        <div className="flex-1 text-center w-full">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">BTC Equivalent</p>
          <p className="text-2xl font-semibold text-yellow-600 tracking-wide">
            {showBalance ? `${btcValue.toFixed(6)} BTC` : (
              <span className="blur-sm select-none">0.000000</span>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-1">1 BTC ≈ ${btcRate.toLocaleString()}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row flex-wrap justify-center gap-4 mt-6">
        <button
          onClick={() => navigate('/deposit')}
          className="flex flex-col items-center bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl py-3 px-6 w-[100px] transition text-center shadow-md cursor-pointer hover:scale-105"
        >
          <FaDownload className="text-2xl mb-1" />
          <span className="text-sm font-semibold">Deposit</span>
        </button>

        <button
          onClick={() => navigate('/withdraw')}
          className="flex flex-col items-center bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl py-3 px-6 w-[100px] transition text-center shadow-md cursor-pointer hover:scale-105"
        >
          <FaUpload className="text-2xl mb-1" />
          <span className="text-sm font-semibold">Withdraw</span>
        </button>

        <button
          onClick={() => navigate('/invest')}
          className="flex flex-col items-center bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 px-6 w-[100px] transition text-center shadow-md cursor-pointer hover:scale-105"
        >
          <FaChartLine className="text-2xl mb-1" />
          <span className="text-sm font-semibold">Invest</span>
        </button>
      </div>

      {/* Transaction History Toggle */}
      <button
        onClick={toggleHistory}
        className="w-full flex justify-center items-center gap-2 py-2 mt-6 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition cursor-pointer"
      >
        <FaHistory />
        {showHistory ? 'Hide' : 'View'} Transaction History
        {showHistory ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {/* Transaction History Table */}
      {showHistory && (
        <div className="bg-gray-50 rounded-lg p-4 mt-3 border border-gray-200 max-h-[300px] overflow-y-auto shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-600 uppercase border-b border-gray-300">
              <tr>
                <th className="p-2">Amount</th>
                <th className="p-2">Type</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-100 transition">
                    <td className="p-2">${t.amount.toFixed(2)}</td>
                    <td className="p-2 capitalize">{t.type}</td>
                    <td className="p-2 text-sm font-medium text-green-600">{t.status}</td>
                    <td className="p-2 text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 py-4">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Active Investment Status */}
      {investment && <InvestmentStatusCard investment={investment} />}
    </div>
  );
};

export default WalletDashboard;
