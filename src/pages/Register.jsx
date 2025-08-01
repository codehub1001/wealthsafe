import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaGlobe, FaCalendarAlt, FaFlag, FaGift } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import countries from '../data/countries.json';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const countryOptions = countries.map((c) => ({
  value: c.name,
  label: c.name,
}));

const InputField = ({ icon: Icon, label, name, type = 'text', placeholder, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm text-white mb-1">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-3 text-slate-300 pointer-events-none"><Icon /></span>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={name !== 'referralCode'}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    country: '',
    nationality: '',
    referralCode: '',
  });

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isAbove18 = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && m >= 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (!isAbove18(form.dob)) {
      return toast.error('You must be at least 18 years old');
    }

    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || 'Registration failed');
      }

      toast.success('Registration successful! Redirecting to login...');
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        country: '',
        nationality: '',
        referralCode: '',
      });

      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error('Network error. Please try again.');
      console.error(err);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050d1a] via-[#0d1a2e] to-[#050e1c] px-4 py-16 text-white relative overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-500/20 blur-[100px] rounded-full z-0" />
      <div className="absolute bottom-10 right-1/3 w-[250px] h-[250px] bg-cyan-500/20 blur-[100px] rounded-full z-0" />
      <div className="max-w-xl w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg z-10">
        <h2 className="text-3xl font-bold text-cyan-400 text-center mb-1">Create Your Vault</h2>
        <p className="text-center text-slate-300 text-sm mb-6">Join the future of crypto investing</p>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <InputField icon={FaUser} label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Satoshi Nakamoto" />
          <InputField icon={FaEnvelope} label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@crypto.xyz" />

          <div className="grid md:grid-cols-2 gap-4">
            <InputField icon={FaCalendarAlt} label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
            <div>
              <label htmlFor="country" className="block text-sm text-white mb-1 ">Country</label>
              <div className="relative">
                <Select
                  id="country"
                  name="country"
                  options={countryOptions}
                  value={countryOptions.find((c) => c.value === form.country) || null}
                  onChange={(selected) => setForm({ ...form, country: selected?.value || '' })}
                  placeholder="Type or select your country"
                  isClearable
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({ ...base, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }),
                    menu: (base) => ({ ...base, backgroundColor: '#0d1a2e', color: 'white' }),
                    singleValue: (base) => ({ ...base, color: 'white',paddingLeft:'1.2rem' }),
                    input: (base) => ({ ...base, color: 'white',paddingLeft:'1.2rem'}),
                    placeholder: (base) => ({ ...base, color: 'rgba(255,255,255,0.6)' }),
                  }}
                />
                <span className="absolute left-3 top-3 text-slate-300 pointer-events-none"><FaGlobe /></span>
              </div>
            </div>
          </div>

          <InputField icon={FaFlag} label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} placeholder="e.g., Canadian" />
          <InputField icon={FaGift} label="Referral Code (Optional)" name="referralCode" value={form.referralCode} onChange={handleChange} placeholder="ABC123XYZ" />

          <div>
            <label htmlFor="password" className="block text-sm text-white mb-1">Vault Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-300 pointer-events-none"><FaEyeSlash /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="••••••••"
              />
              <span onClick={togglePassword} className="absolute right-3 top-3 text-cyan-300 cursor-pointer">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <InputField icon={FaEye} label="Confirm Password" name="confirmPassword" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" />

          <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 text-white font-semibold py-2 rounded-md shadow-lg transition">
            Create Account
          </button>
        </form>

        <div className="text-sm text-center text-slate-400 mt-6">
          Already have a vault?{' '}
          <Link to="/login" className="text-cyan-300 font-semibold hover:underline">
            Log In
          </Link>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default Register;
