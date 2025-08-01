import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Bronze',
    price: '$100 - $499',
    returns: '10% daily return',
    duration : '7days',
    perks: ['Low Risk', , 'Beginner Friendly'],
    color: 'from-amber-400 to-amber-600',
    glow: 'shadow-amber-300',
  },
  {
    name: 'Silver',
    price: '$500 - $999',
    returns: '15% daily Return',
    duration : '10days',
    perks: ['Moderate Risk', 'Faster Growth', 'Priority Support'],
    color: 'from-gray-400 to-gray-600',
    glow: 'shadow-gray-300',
  },
  {
    name: 'Gold',
    price: '$1,000 - $4,999',
    returns: '18% daily Return',
     duration : '14days',
    perks: ['Higher ROI', 'Weekly Analytics', 'Dedicated Advisor'],
    color: 'from-yellow-400 to-yellow-600',
    glow: 'shadow-yellow-300',
  },
  {
    name: 'Diamond',
    price: '$5,000+',
    returns: '22% daily Return',
     duration : '21 days',
    perks: ['Elite Returns', 'VIP Access', '1-on-1 Portfolio Review'],
    color: 'from-blue-500 to-blue-800',
    glow: 'shadow-blue-400',
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
          No matter where you start, our plans scale with your ambition. Enjoy tailored returns and powerful features for every budget.
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
              <h3 className="text-xl font-bold text-blue-800 mb-2">{plan.name}</h3>
              <p className="text-lg font-semibold text-gray-800">{plan.price}</p>
              <p className="text-sm text-blue-700 mb-4">{plan.duration}</p>
              <p className="text-sm text-blue-700 mb-4">{plan.returns}</p>

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
