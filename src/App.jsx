import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // make sure this import exists

import Header from './components/Header';
import Footer from './components/Footer';
import Carousel from './components/Carousel';

import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import CoinSlider from './components/CoinSlider';
import WhatWeOffer from './components/WhatWeOffer';
import Plans from './components/Plans';
import WhyChooseUs from './components/WhyChooseUs';
import UserDashboard from './pages/UserDashboard';
import Testimonials from './components/Testimonial';
import AdminDashboard from './pages/AdminDashboard';
import DepositForm from './components/DepositForm';
import ConfirmPayment from './components/ConfirmPayment';
import InvestForm from './components/InvestForm';
import WithdrawalForm from './components/WithdrawalForm';
import InvestmentPlan from './components/InvestmentPlan';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';

const AppLayout = () => {
  const location = useLocation();
  const hideLayoutRoutes = ['/userdashboard', '/admindashboard', '/deposit','/withdraw', '/invest' , '/confirmpayment' ];

  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Carousel />
              <CoinSlider />
              <WhatWeOffer />
              <Plans />
              <WhyChooseUs />
              <Testimonials />
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/withdraw" element={<WithdrawalForm />} />
        <Route path="/deposit" element={<DepositForm />} />
        <Route path="/invest" element={<InvestForm/>} />
        <Route path="/investment" element={<InvestmentPlan/>} />
        <Route path="/confirmpayment" element={<ConfirmPayment />} />
      </Routes>

      {!hideLayout && <Footer />}

      {/* 🔔 Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} pauseOnFocusLoss={false} pauseOnHover theme="dark" />
    </>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
