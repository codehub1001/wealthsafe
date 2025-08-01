import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaRocket, FaHandsHelping, FaChartPie } from 'react-icons/fa';

const reasons = [
  {
    title: 'Top-Notch Security',
    description: 'Your assets are protected with bank-grade encryption, multi-factor authentication, and cold storage.',
    icon: <FaShieldAlt className="text-3xl text-blue-600" />,
  },
  {
    title: 'Fast & Transparent',
    description: 'We offer lightning-fast withdrawals and full transparency in all our operations and earnings.',
    icon: <FaRocket className="text-3xl text-blue-600" />,
  },
  {
    title: '24/7 Human Support',
    description: 'Real people, real support. Our global support team is always available to help you when you need it.',
    icon: <FaHandsHelping className="text-3xl text-blue-600" />,
  },
  {
    title: 'Proven Track Record',
    description: 'Trusted by thousands, with consistent returns and expert-driven asset management strategies.',
    icon: <FaChartPie className="text-3xl text-blue-600" />,
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const WhyChooseUs = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-blue-900 mb-4"
        >
          Why Choose Us
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          At our core, we’re not just a platform—we’re a partner in your financial growth. Here’s what makes us stand out from the rest:
        </motion.p>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-transparent hover:border-blue-100"
            >
              <div className="mb-4 flex justify-center">{reason.icon}</div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{reason.title}</h3>
              <p className="text-sm text-gray-600">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
