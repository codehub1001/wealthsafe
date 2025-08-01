import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CoinSlider.css'; // For animation

const CoinSlider = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    axios
      .get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          sparkline: false,
        },
      })
      .then((res) => setCoins(res.data))
      .catch((err) => console.error(err));
  }, []);

  const coinList = [...coins, ...coins]; // Duplicate for seamless scroll

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 py-4">
      <div className="coin-slider-track flex gap-6 px-6 w-max">
        {coinList.map((coin, index) => (
          <div
            key={`${coin.id}-${index}`}
            className="bg-white/80 backdrop-blur-md border border-white/30 px-5 py-3 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 min-w-[180px] flex items-center gap-3"
          >
            <img
              src={coin.image}
              alt={coin.name}
              className="w-8 h-8 object-contain"
              loading="lazy"
            />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-blue-900">{coin.name}</p>
              <p className="text-xs text-gray-700">${coin.current_price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoinSlider;
