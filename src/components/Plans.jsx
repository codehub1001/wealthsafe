import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: '$200',
    returns: 'Earn $500',
    duration: '48 Hours',
    perks: ['Quick Return', 'Beginner Friendly'],
    color: 'from-green-400 to-green-600',
    glow: 'shadow-green-300',
  },
  {
    name: 'Basic',
    price: '$1,000',
    returns: 'Earn $3,000',
    duration: '72 Hours',
    perks: ['High ROI', 'Fast Growth'],
    color: 'from-blue-400 to-blue-600',
    glow: 'shadow-blue-300',
  },
  {
    name: 'Pro',
    price: '$3,000',
    returns: 'Earn $10,000',
    duration: '3 Days',
    perks: ['Bigger Profits', 'Short Duration'],
    color: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-300',
  },
  {
    name: 'Elite',
    price: '$5,000',
    returns: 'Earn $25,000',
    duration: '5 Days',
    perks: ['Massive Returns', 'VIP Priority'],
    color: 'from-yellow-500 to-yellow-700',
    glow: 'shadow-yellow-300',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};

const Plans = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-blue-900 mb-4"
        >
          Choose Your Plan
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-12 max-w-xl mx-auto"
        >
          No matter where you start, our plans scale with your ambition. Enjoy
          tailored returns and powerful features for every budget.
        </motion.p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className={`rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-blue-200 transition relative overflow-hidden`}
            >
              <div
                className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${plan.color}`}
              />
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                {plan.name}
              </h3>
              <p className="text-lg font-semibold text-gray-800">
                {plan.price}
              </p>
              <p className="text-sm text-blue-700 mb-2">{plan.duration}</p>
              <p className="text-sm text-green-700 font-bold mb-4">
                {plan.returns}
              </p>

              <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1">
                {plan.perks.map((perk, idx) => (
                  <li key={idx}>{perk}</li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/login')}
                className={`w-full mt-2 py-2 px-4 rounded-md bg-gradient-to-r ${plan.color} text-white font-semibold hover:opacity-90 transition cursor-pointer`}
              >
                Choose {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;
