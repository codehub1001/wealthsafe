import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaBars,
  FaUser,
  FaWallet,
  FaDownload,
  FaUpload,
  FaSearch,
} from 'react-icons/fa';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const totalPages = (data) =>
    Math.ceil(filteredData(data).length / itemsPerPage);

  const TableWrapper = ({ data, headers, rows }) => (
    <div className="overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-3">
        <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded w-full md:w-auto">
          <FaSearch />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-white text-sm w-full"
          />
        </div>
        <div className="text-sm text-gray-300">
          Page {currentPage} of {totalPages(data) || 1}
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
          <tr>{headers.map((h) => <th className="p-3 text-left" key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      {totalPages(data) > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages(data)))}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  const SidebarItem = ({ icon, label, tab }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setCurrentPage(1);
        setSearchTerm('');
        setSidebarOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-cyan-700 w-full ${
        activeTab === tab ? 'bg-cyan-600' : 'bg-gray-800'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white">
      {/* Mobile Topbar */}
      <div className="flex md:hidden items-center justify-between p-4 bg-gray-800">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-60 bg-gray-800 p-4 space-y-2`}
      >
        <SidebarItem icon={<FaUser />} label="Users" tab="users" />
        <SidebarItem icon={<FaWallet />} label="Wallets" tab="wallets" />
        <SidebarItem icon={<FaDownload />} label="Deposits" tab="deposits" />
        <SidebarItem icon={<FaUpload />} label="Withdrawals" tab="withdrawals" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4 capitalize">{activeTab}</h2>

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

        {activeTab === 'wallets' && (
          <TableWrapper
            data={filteredData(wallets)}
            headers={[
              'User',
              'Balance',
              'Top-Up',
              '',
              'Debit',
              '',
              'Frozen',
              'Action',
              'Updated',
            ]}
            rows={paginatedData(filteredData(wallets)).map((w) => (
              <tr key={w.id} className="border-b border-gray-700 text-xs">
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
                  <span
                    className={`px-2 py-1 rounded ${
                      w.frozen
                        ? 'bg-red-200 text-red-800'
                        : 'bg-green-200 text-green-800'
                    }`}
                  >
                    {w.frozen ? 'Frozen' : 'Active'}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleFreeze(w.userId, w.frozen)}
                    className={`px-3 py-1 text-xs rounded ${
                      w.frozen
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {w.frozen ? 'Unfreeze' : 'Freeze'}
                  </button>
                </td>
                <td className="p-3 text-gray-400">
                  {new Date(w.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          />
        )}

        {activeTab === 'deposits' && (
          <TableWrapper
            data={filteredData(pendingDeposits)}
            headers={['User', 'Amount', 'Description', 'Date', 'Actions']}
            rows={paginatedData(filteredData(pendingDeposits)).map((d) => (
              <tr key={d.id} className="border-b border-gray-700 text-xs text-center">
                <td className="p-3">{d.user?.name}</td>
                <td className="p-3">${d.amount}</td>
                <td className="p-3">{d.description || '-'}</td>
                <td className="p-3">{new Date(d.createdAt).toLocaleString()}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleApproval('deposit', d.id, 'approve')}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 text-xs rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval('deposit', d.id, 'disapprove')}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 text-xs rounded"
                  >
                    Disapprove
                  </button>
                </td>
              </tr>
            ))}
          />
        )}

        {activeTab === 'withdrawals' && (
          <TableWrapper
            data={filteredData(pendingWithdrawals)}
            headers={['User', 'Amount', 'Description', 'Date', 'Actions']}
            rows={paginatedData(filteredData(pendingWithdrawals)).map((w) => (
              <tr key={w.id} className="border-b border-gray-700 text-xs text-center">
                <td className="p-3">{w.user?.name}</td>
                <td className="p-3">${w.amount}</td>
                <td className="p-3">{w.description || '-'}</td>
                <td className="p-3">{new Date(w.createdAt).toLocaleString()}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleApproval('withdrawal', w.id, 'approve')}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 text-xs rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval('withdrawal', w.id, 'disapprove')}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 text-xs rounded"
                  >
                    Disapprove
                  </button>
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
