import React from 'react';
import { FaShieldAlt, FaBitcoin, FaClock, FaRocket, FaGlobe, FaHandshake, FaUsers, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <section className="min-h-screen bg-gray-900 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-extrabold mb-4 text-cyan-400 tracking-wide">
            About CryptoInvest
          </h2>
          <p className="text-gray-300 text-lg">
            Building wealth through blockchain for over a decade.
          </p>
        </motion.div>

        {/* Who we are */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20"
        >
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Who We Are</h3>
            <p className="text-gray-300">
              CryptoInvest is a pioneering cryptocurrency investment platform founded in 2015. We’ve served thousands of clients globally, offering curated investment strategies backed by data, experience, and blockchain technology. With over 10 years in operation, we remain leaders in the crypto space.
            </p>
            <p className="text-gray-300">
              Our services range from portfolio management and staking to AI-based trading insights and education. CryptoInvest believes in equal access to the digital economy and ensures every investor — big or small — can grow securely.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/images/team-crypto.jpg"
              alt="CryptoInvest Team"
              className="rounded-lg shadow-xl w-full max-w-md"
            />
          </div>
        </motion.div>

        {/* Mission Vision Values */}
        <div className="grid md:grid-cols-3 gap-8 text-center mb-20">
          {[
            {
              icon: <FaRocket />,
              title: 'Our Mission',
              desc: 'To empower everyday people to achieve financial freedom through secure crypto investments.',
            },
            {
              icon: <FaGlobe />,
              title: 'Our Vision',
              desc: 'To become the most trusted decentralized finance partner globally.',
            },
            {
              icon: <FaHandshake />,
              title: 'Core Values',
              desc: 'Integrity, Transparency, Innovation, and Customer Success.',
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-cyan-700/40 transition"
            >
              <div className="text-cyan-400 text-4xl mb-4">{card.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{card.title}</h4>
              <p className="text-gray-300 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div>
          <h3 className="text-3xl font-bold text-center text-white mb-8">Why Choose Us?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Proven Track Record',
                icon: <FaClock />,
                desc: 'Over 10 years of consistent returns and global growth.',
              },
              {
                title: 'Cutting-edge Security',
                icon: <FaShieldAlt />,
                desc: 'Military-grade encryption and 24/7 monitoring.',
              },
              {
                title: 'Smart Portfolio Strategy',
                icon: <FaChartLine />,
                desc: 'Customized portfolios using real-time AI insights.',
              },
              {
                title: 'Diverse Asset Support',
                icon: <FaBitcoin />,
                desc: 'Invest in BTC, ETH, DeFi tokens, stablecoins, and more.',
              },
              {
                title: 'Global User Base',
                icon: <FaUsers />,
                desc: 'Trusted by 100K+ investors in 50+ countries.',
              },
              {
                title: '24/7 Support',
                icon: <FaHandshake />,
                desc: 'Our expert team is available around the clock to help you thrive.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-lg p-6 text-center shadow hover:shadow-lg hover:shadow-cyan-600/30 transition"
              >
                <div className="text-cyan-400 text-3xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-300 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
