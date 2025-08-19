import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Example notifications (you’ll replace with real API/WebSocket data)
const sampleEvents = [
  { name: "investor", country: "USA", action: "deposited", amount: "$2500" },
  { name: "investor.", country: "Dubai", action: "withdrew", amount: "$1200" },
  { name: "investor", country: "Brazil", action: "deposited", amount: "$15,000" },
  { name: "investor", country: "China", action: "withdrew", amount: "$300" },
  { name: "investor", country: "USA", action: "withdrew", amount: "$45,000" },
  { name: "investor", country: "Canada", action: "withdrew", amount: "$200" },
  { name: "investor", country: "pakistan", action: "withdrew", amount: "$2000" },
];

const LiveNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      const event = sampleEvents[index % sampleEvents.length];
      setNotifications((prev) => [...prev, { id: Date.now(), ...event }]);

      // Auto remove after 5s
      setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 5000);

      index++;
    }, 6000); // show every 6s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-5 left-5 space-y-2 z-50">
      <AnimatePresence>
        {notifications.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-2xl px-4 py-3 border flex items-center gap-2 w-72"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {note.name.charAt(0)}
            </div>
            <div className="text-sm">
              <span className="font-semibold">{note.name}</span> from{" "}
              <span className="font-medium">{note.country}</span>{" "}
              <span className="text-green-600">{note.action}</span>{" "}
              <span className="font-semibold">{note.amount}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LiveNotifications;
