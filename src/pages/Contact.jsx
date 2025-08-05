import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return alert('Please fill in all fields.');
    }

    setSubmitting(true);
    // Simulate sending form (replace with real email logic or API call)
    setTimeout(() => {
      alert('Message sent successfully!');
      setSubmitting(false);
      setForm({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <section className="bg-gray-900 text-white py-16 px-6" id="contact">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-cyan-400">
          Get in Touch
        </h2>
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
          We're here to answer your questions about crypto investing, account setup, or anything else
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6 text-base">
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-cyan-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-white">Office Address</h4>
                <p className="text-gray-400">
                  zentravault Inc.
                  85 Broad Street, 28th Floor
                  New York, NY 10004
                  United States
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaPhoneAlt className="text-cyan-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-white">Phone</h4>
                <p className="text-gray-400">+234 700-CRYPTO-INVEST</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaEnvelope className="text-cyan-500 text-xl mt-1" />
              <div>
                <h4 className="font-semibold text-white">Email</h4>
                <p className="text-gray-400">support@zentravault.us</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-xl p-6 shadow-md space-y-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            ></textarea>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded transition"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactUs;
