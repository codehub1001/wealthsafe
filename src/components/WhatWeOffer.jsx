import React from 'react';
import { FaLock, FaWallet, FaChartLine, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

const offers = [
  {
    title: 'Secure Wallets',
    description: 'All your digital assets are protected with bank-level encryption.',
    icon: <FaLock className="text-4xl text-blue-600" />,
  },
  {
    title: 'Real-Time Tracking',
    description: 'Get up-to-the-minute tracking of prices, balances, and transactions.',
    icon: <FaChartLine className="text-4xl text-blue-600" />,
  },
  {
    title: 'Referral Bonuses',
    description: 'Earn by inviting others. Enjoy layered referral rewards.',
    icon: <FaUsers className="text-4xl text-blue-600" />,
  },
  {
    title: 'Flexible Investment Plans',
    description: 'Choose from a variety of crypto-backed plans tailored to your needs.',
    icon: <FaWallet className="text-4xl text-blue-600" />,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const WhatWeOffer = () => {
  return (
    <section className="bg-white py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-blue-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          What We Offer
        </motion.h2>

        <motion.p
          className="text-gray-600 mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Everything you need to grow, manage, and protect your crypto assets—all in one place.
        </motion.p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer, i) => (
            <motion.div
              key={i}
              className="bg-blue-50 hover:bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 text-center border border-transparent hover:border-blue-200 cursor-pointer group"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <div className="mb-4 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="transition-all duration-300"
                >
                  {offer.icon}
                </motion.div>
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2 group-hover:text-blue-900 transition">
                {offer.title}
              </h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-800 transition">
                {offer.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
