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
      const res = await fetch('https://zentra-tzml.onrender.com/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error('Failed to fetch users');
    }
  };

  const fetchWallets = async () => {
    try {
      const res = await fetch('https://zentra-tzml.onrender.com/api/admin/wallets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWallets(data);
    } catch {
      toast.error('Failed to fetch wallets');
    }
  };

  const fetchPendingDeposits = async () => {
    try {
      const res = await fetch('https://zentra-tzml.onrender.com/api/admin/pending-deposits', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPendingDeposits(data);
    } catch {
      toast.error('Failed to fetch pending deposits');
    }
  };

  const fetchPendingWithdrawals = async () => {
    try {
      const res = await fetch('https://zentra-tzml.onrender.com/api/admin/pending-withdrawals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPendingWithdrawals(data);
    } catch {
      toast.error('Failed to fetch pending withdrawals');
    }
  };

  const toggleFreeze = async (userId, currentStatus) => {
    try {
      const res = await fetch(`https://zentra-tzml.onrender.com/api/admin/wallets/${userId}/freeze`, {
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

  const filteredData = (data) => {
    return data.filter((item) => {
      const name = item.name || item.user?.name || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const paginatedData = (data) => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const totalPages = (data) => Math.ceil(filteredData(data).length / itemsPerPage);

  const handleAmountChange = (walletId, value) => {
    setAmounts((prev) => ({ ...prev, [walletId]: value }));
  };

  const handleTopUp = async (walletId, userId) => {
    const amount = amounts[walletId];
    if (!amount || isNaN(amount) || amount <= 0) return toast.error('Invalid amount');
    try {
      const res = await fetch('https://zentra-tzml.onrender.com/api/admin/topup', {
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

  const handleDebitAmountChange = (walletId, value) => {
    setDebitAmounts((prev) => ({ ...prev, [walletId]: value }));
  };

  const handleDebit = async (walletId, userId) => {
    const amount = debitAmounts[walletId];
    if (!amount || isNaN(amount) || amount <= 0) return toast.error('Invalid amount');
    try {
      const res = await fetch('https://zentra-tzml.onrender.com/api/admin/wallets/debit', {
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

  const handleApproval = async (type, id, action) => {
    const endpoint = `https://zentra-tzml.onrender.com/api/admin/${action}-${type}/${id}`;
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

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await fetch(`https://zentra-tzml.onrender.com/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Delete failed');
    }
  };

  const SidebarItem = ({ label, icon, tab }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setCurrentPage(1);
        setSearchTerm('');
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-cyan-700 ${
        activeTab === tab ? 'bg-cyan-600' : 'bg-gray-800'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const Pagination = ({ total }) => (
    <div className="flex justify-between items-center mt-4 text-sm">
      <p>
        Page {currentPage} of {total}
      </p>
      <div className="space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          Prev
        </button>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, total))}
          className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );

  const TableWrapper = ({ data, headers, rows }) => (
    <div className="overflow-x-auto">
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
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
          <tr>{headers.map((h) => <th className="p-3 text-left" key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      {data.length > itemsPerPage && <Pagination total={totalPages(data)} />}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-60 bg-gray-800 p-4 space-y-2">
        <h1 className="text-xl font-bold text-center mb-6">Admin Panel</h1>
        <SidebarItem label="Users" icon={<FaUser />} tab="users" />
        <SidebarItem label="Wallets" icon={<FaWallet />} tab="wallets" />
        <SidebarItem label="Deposits" icon={<FaDownload />} tab="deposits" />
        <SidebarItem label="Withdrawals" icon={<FaUpload />} tab="withdrawals" />
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">{activeTab.toUpperCase()}</h2>

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <TableWrapper
            data={filteredData(users)}
            headers={['Name', 'Email', 'Role', 'Bonus', 'Actions']}
            rows={paginatedData(filteredData(users)).map((u) => (
              <tr key={u.id} className="border-b border-gray-700">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">${u.bonus}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 text-xs rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          />
        )}

        {/* WALLETS TAB */}
        {activeTab === 'wallets' && (
          <TableWrapper
            data={filteredData(wallets)}
            headers={['User', 'Balance', 'Top-Up', '', 'Debit', '', 'Frozen', 'Action', 'Updated']}
            rows={paginatedData(filteredData(wallets)).map((w) => (
              <tr key={w.id} className="border-b border-gray-700">
                <td className="p-3">{w.user?.name}</td>
                <td className="p-3">${w.balance.toFixed(2)}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={amounts[w.id] || ''}
                    onChange={(e) => handleAmountChange(w.id, e.target.value)}
                    className="w-20 bg-gray-700 px-2 py-1 rounded"
                  />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleTopUp(w.id, w.userId)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 text-xs rounded"
                  >
                    Top Up
                  </button>
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={debitAmounts[w.id] || ''}
                    onChange={(e) => handleDebitAmountChange(w.id, e.target.value)}
                    className="w-20 bg-gray-700 px-2 py-1 rounded"
                  />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDebit(w.id, w.userId)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 text-xs rounded"
                  >
                    Debit
                  </button>
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
                  >
                    {w.frozen ? 'Unfreeze' : 'Freeze'}
                  </button>
                </td>
                <td className="p-3 text-xs text-gray-400">
                  {new Date(w.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          />
        )}

        {/* DEPOSITS TAB */}
        {activeTab === 'deposits' && (
          <TableWrapper
            data={pendingDeposits}
            headers={['User', 'Amount', 'Description', 'Date', 'Actions']}
            rows={pendingDeposits.map((d) => (
              <tr key={d.id} className="border-b border-gray-700 text-center">
                <td className="p-3">{d.user?.name}</td>
                <td className="p-3">${d.amount}</td>
                <td className="p-3">{d.description || '-'}</td>
                <td className="p-3">{new Date(d.createdAt).toLocaleString()}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleApproval('deposit', d.id, 'approve')} className="bg-green-600 hover:bg-green-700 px-3 py-1 text-xs rounded">Approve</button>
                  <button onClick={() => handleApproval('deposit', d.id, 'disapprove')} className="bg-red-500 hover:bg-red-600 px-3 py-1 text-xs rounded">Disapprove</button>
                </td>
              </tr>
            ))}
          />
        )}

        {/* WITHDRAWALS TAB */}
        {activeTab === 'withdrawals' && (
          <TableWrapper
            data={pendingWithdrawals}
            headers={['User', 'Amount', 'Description', 'Date', 'Actions']}
            rows={pendingWithdrawals.map((w) => (
              <tr key={w.id} className="border-b border-gray-700 text-center">
                <td className="p-3">{w.user?.name}</td>
                <td className="p-3">${w.amount}</td>
                <td className="p-3">{w.description || '-'}</td>
                <td className="p-3">{new Date(w.createdAt).toLocaleString()}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleApproval('withdrawal', w.id, 'approve')} className="bg-green-600 hover:bg-green-700 px-3 py-1 text-xs rounded">Approve</button>
                  <button onClick={() => handleApproval('withdrawal', w.id, 'disapprove')} className="bg-red-500 hover:bg-red-600 px-3 py-1 text-xs rounded">Disapprove</button>
                </td>
              </tr>
            ))}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
