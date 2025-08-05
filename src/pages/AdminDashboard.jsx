import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaWallet, FaDownload, FaUpload, FaSearch } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [debitAmounts, setDebitAmounts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [approvingId, setApprovingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
    fetchWallets();
    fetchPendingDeposits();
    fetchPendingWithdrawals();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error('Failed to fetch users');
    }
  };

  const fetchWallets = async () => {
    try {
      const res = await fetch('/api/admin/wallets', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setWallets(data);
    } catch {
      toast.error('Failed to fetch wallets');
    }
  };

  const fetchPendingDeposits = async () => {
    try {
      const res = await fetch('/api/admin/pending-deposits', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setPendingDeposits(data);
    } catch {
      toast.error('Failed to fetch pending deposits');
    }
  };

  const fetchPendingWithdrawals = async () => {
    try {
      const res = await fetch('/api/admin/pending-withdrawals', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setPendingWithdrawals(data);
    } catch {
      toast.error('Failed to fetch pending withdrawals');
    }
  };

  const SidebarItem = ({ label, icon, tab }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setCurrentPage(1);
        setSearchTerm('');
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-cyan-700 w-full text-left ${
        activeTab === tab ? 'bg-cyan-600' : 'bg-gray-800'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const TableWrapper = ({ data, headers, children }) => {
    const filtered = data.filter((item) => {
      const name = item.name || item.user?.name || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
      <div className="overflow-x-auto w-full">
        <div className="flex justify-between mb-3 items-center">
          <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded">
            <FaSearch />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-white text-sm"
            />
          </div>
          <div className="space-x-2 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            >Prev</button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            >Next</button>
          </div>
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-700 text-gray-300 uppercase text-xs sticky top-0">
            <tr>{headers.map((h) => <th key={h} className="p-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>{children(paginated)}</tbody>
        </table>
      </div>
    );
  };

  const WalletRow = ({ w }) => (
    <tr className="border-b border-gray-700">
      <td className="p-3">{w.user?.name}</td>
      <td className="p-3">${w.balance.toFixed(2)}</td>
      <td className="p-3 flex flex-col sm:flex-row gap-2">
        <input
          type="number"
          value={amounts[w.id] || ''}
          onChange={(e) => setAmounts((prev) => ({ ...prev, [w.id]: e.target.value }))}
          className="w-20 bg-gray-700 px-2 py-1 rounded"
        />
        <button
          onClick={() => handleTopUp(w.id, w.userId)}
          className="bg-green-600 hover:bg-green-700 px-3 py-1 text-xs rounded"
        >Top Up</button>
      </td>
      <td className="p-3 flex flex-col sm:flex-row gap-2">
        <input
          type="number"
          value={debitAmounts[w.id] || ''}
          onChange={(e) => setDebitAmounts((prev) => ({ ...prev, [w.id]: e.target.value }))}
          className="w-20 bg-gray-700 px-2 py-1 rounded"
        />
        <button
          onClick={() => handleDebit(w.id, w.userId)}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 text-xs rounded"
        >Debit</button>
      </td>
      <td className="p-3">
        <span className={`text-xs px-2 py-1 rounded ${w.frozen ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {w.frozen ? 'Frozen' : 'Active'}
        </span>
      </td>
      <td className="p-3">
        <button
          onClick={() => toggleFreeze(w.userId, w.frozen)}
          className={`px-3 py-1 text-xs rounded ${w.frozen ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
        >{w.frozen ? 'Unfreeze' : 'Freeze'}</button>
      </td>
      <td className="p-3 text-xs text-gray-400">
        {new Date(w.updatedAt).toLocaleString()}
      </td>
    </tr>
  );

  const ApprovalRow = ({ t, type }) => (
    <tr key={t.id} className="border-b border-gray-700 text-center">
      <td className="p-3">{t.user?.name}</td>
      <td className="p-3">${t.amount}</td>
      <td className="p-3">{t.description || '-'}</td>
      <td className="p-3">{new Date(t.createdAt).toLocaleString()}</td>
      <td className="p-3 flex flex-col sm:flex-row gap-2 justify-center">
        <button onClick={() => handleApproval(type, t.id, 'approve')} className="bg-green-600 hover:bg-green-700 px-3 py-1 text-xs rounded">Approve</button>
        <button onClick={() => handleApproval(type, t.id, 'disapprove')} className="bg-red-500 hover:bg-red-600 px-3 py-1 text-xs rounded">Disapprove</button>
      </td>
    </tr>
  );

  const handleTopUp = async (walletId, userId) => {
    const amount = amounts[walletId];
    if (!amount || isNaN(amount) || amount <= 0) return toast.error('Invalid amount');
    try {
      const res = await fetch('/api/admin/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, amount: parseFloat(amount) }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);
      toast.success('Top-up successful');
      fetchWallets();
    } catch {
      toast.error('Top-up failed');
    }
  };

  const handleDebit = async (walletId, userId) => {
    const amount = debitAmounts[walletId];
    if (!amount || isNaN(amount) || amount <= 0) return toast.error('Invalid amount');
    try {
      const res = await fetch('/api/admin/wallets/debit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, amount: parseFloat(amount) }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);
      toast.success('Debit successful');
      fetchWallets();
    } catch {
      toast.error('Debit failed');
    }
  };

  const toggleFreeze = async (userId, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/wallets/${userId}/freeze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ freeze: !currentStatus }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);
      toast.success(`Wallet ${!currentStatus ? 'frozen' : 'unfrozen'} successfully`);
      fetchWallets();
    } catch {
      toast.error('Failed to update wallet status');
    }
  };

  const handleApproval = async (type, id, action) => {
    const endpoint = `/api/admin/${action}-${type}/${id}`;
    if (!window.confirm(`${action} this ${type}?`)) return;
    setApprovingId(id);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);
      toast.success(`${type} ${action}d`);
      if (type === 'deposit') fetchPendingDeposits();
      else fetchPendingWithdrawals();
      fetchWallets();
    } catch {
      toast.error('Action failed');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row">
      <div className="lg:hidden flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <button
          className="text-white px-3 py-1 bg-cyan-600 rounded"
          onClick={() => setActiveTab((prev) => (prev === 'menu' ? 'users' : 'menu'))}
        >
          Menu
        </button>
      </div>

      <aside className={`bg-gray-800 lg:w-60 w-full lg:block ${activeTab === 'menu' ? 'block' : 'hidden'} p-4 space-y-2`}>
        <h1 className="text-xl font-bold text-center mb-6 hidden lg:block">Admin Panel</h1>
        <SidebarItem label="Users" icon={<FaUser />} tab="users" />
        <SidebarItem label="Wallets" icon={<FaWallet />} tab="wallets" />
        <SidebarItem label="Deposits" icon={<FaDownload />} tab="deposits" />
        <SidebarItem label="Withdrawals" icon={<FaUpload />} tab="withdrawals" />
      </aside>

      <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">{activeTab.toUpperCase()}</h2>

        {activeTab === 'users' && (
          <TableWrapper data={users} headers={['Name', 'Email', 'Role', 'Actions']}>
            {(pageData) => pageData.map((u) => (
              <tr key={u.id} className="border-b border-gray-700">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  <button className="bg-red-500 hover:bg-red-600 px-3 py-1 text-xs rounded">Delete</button>
                </td>
              </tr>
            ))}
          </TableWrapper>
        )}

        {activeTab === 'wallets' && (
          <TableWrapper data={wallets} headers={['User', 'Balance', 'Top-Up', 'Debit', 'Status', 'Action', 'Updated']}>
            {(pageData) => pageData.map((w) => <WalletRow key={w.id} w={w} />)}
          </TableWrapper>
        )}

        {activeTab === 'deposits' && (
          <TableWrapper data={pendingDeposits} headers={['User', 'Amount', 'Description', 'Date', 'Actions']}>
            {(pageData) => pageData.map((t) => <ApprovalRow key={t.id} t={t} type="deposit" />)}
          </TableWrapper>
        )}

        {activeTab === 'withdrawals' && (
          <TableWrapper data={pendingWithdrawals} headers={['User', 'Amount', 'Description', 'Date', 'Actions']}>
            {(pageData) => pageData.map((t) => <ApprovalRow key={t.id} t={t} type="withdrawal" />)}
          </TableWrapper>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
