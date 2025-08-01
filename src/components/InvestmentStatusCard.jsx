// components/InvestmentStatusCard.jsx
import React from 'react';

const InvestmentStatusCard = ({ investment }) => {
  if (!investment) return null;

  const calculateProgress = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    const total = endDate - startDate;
    const completed = now - startDate;
    const percent = (completed / total) * 100;
    return Math.min(100, Math.max(0, percent.toFixed(2)));
  };

  const progress = calculateProgress(investment.startDate, investment.endDate);

  return (
    <section
      aria-label="Active Investment Status"
      className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-lg shadow-md max-w-md mx-auto"
    >
      <h4 className="text-xl font-semibold text-blue-800 mb-3 tracking-wide">
        Active Investment: <span className="capitalize">{investment.plan?.name || '—'}</span>
      </h4>

      <p className="mb-4 text-gray-700 text-sm">
        Duration: <time dateTime={investment.startDate}>{investment.startDate.slice(0, 10)}</time>{' '}
        &rarr;{' '}
        <time dateTime={investment.endDate}>{investment.endDate.slice(0, 10)}</time>
      </p>

      {/* Progress bar */}
      <div
        className="relative w-full h-6 bg-blue-200 rounded-full overflow-hidden mb-4"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Investment progress"
      >
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-medium text-white drop-shadow-md select-none">
          {progress}%
        </span>
      </div>

      <div className="flex justify-between text-gray-800 text-sm font-medium">
        <div>
          Invested:{' '}
          <span className="text-blue-900">${investment.amount.toFixed(2)}</span>
        </div>
        <div>
          Expected Return:{' '}
          <span className="text-green-700">${investment.expectedReturn.toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
};

export default InvestmentStatusCard;
