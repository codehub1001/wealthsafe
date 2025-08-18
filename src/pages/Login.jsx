import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://wealthsafeapi.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || 'Login failed');
      }

      toast.success('Login successful! Redirecting...');
      localStorage.setItem('token', data.token); // optional
      localStorage.setItem('userRole', data.user?.role); // store role if needed

      // Redirect based on user role
      const userRole = data.user?.role;
      setTimeout(() => {
        if (userRole === 'ADMIN') {
          navigate('/admindashboard');
        } else {
          navigate('/userdashboard');
        }
      }, 1500);
    } catch (error) {
      toast.error('Network error. Try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e1116] via-[#0d1b2a] to-[#050d18] px-4 py-16 relative overflow-hidden text-white">
      {/* Background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-cyan-500/20 blur-[120px] rounded-full z-0" />
      <div className="absolute bottom-0 right-1/3 w-[250px] h-[250px] bg-purple-500/20 blur-[100px] rounded-full z-0" />

      {/* Glass card */}
      <div className="max-w-md w-full bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl p-8 z-10">
        <h2 className="text-3xl font-extrabold text-cyan-400 mb-2 text-center">Crypto Gateway</h2>
        <p className="text-sm text-slate-300 mb-6 text-center">Securely connect to your vault</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm text-slate-200 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="you@blockchainmail.xyz"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-slate-200 mb-1">Vault Key</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-10"
                placeholder="••••••••"
              />
              <span
                onClick={togglePassword}
                className="absolute inset-y-0 right-3 flex items-center text-cyan-300 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgotpassword" className="text-sm text-cyan-400 hover:underline">Forgot Key?</Link>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 hover:cursor-pointer  text-white font-semibold py-2 rounded-md transition shadow-md"
          >
            Connect Wallet
          </button>
        </form>

        <div className="text-sm text-center text-slate-400 mt-6">
          No vault yet?{' '}
          <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
            Create Account
          </Link>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default Login;
