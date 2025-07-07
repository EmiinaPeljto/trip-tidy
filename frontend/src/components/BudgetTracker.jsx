import React from 'react';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const BudgetTracker = ({ budget }) => {
  const spent = 0; // Reset spent to 0 for initial state
  const percentageSpent = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = Math.max(budget - spent, 0);

  const getProgressColor = () => {
    if (percentageSpent < 50) return '#3BB77E'; // Green
    if (percentageSpent < 80) return '#FFB648'; // Yellow
    return '#F86C6B'; // Red
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
      {/* Progress Circle */}
      <div className="w-28 h-28">
        <CircularProgressbar
          value={percentageSpent}
          text={`${Math.round(percentageSpent)}%`}
          styles={buildStyles({
            pathColor: getProgressColor(),
            textColor: '#333',
            trailColor: '#eee',
            textSize: '16px',
            strokeLinecap: 'round',
          })}
        />
      </div>

      {/* Budget Summary */}
      <div className="flex-grow space-y-2 text-gray-700">
        <h3 className="text-xl font-semibold text-gray-900">Monthly Budget</h3>
        <p className="text-sm">
          <span className="font-medium">Spent:</span> ${spent}
        </p>
        <p className="text-sm">
          <span className="font-medium">Remaining:</span> ${remaining}
        </p>
        <p className="text-sm">
          <span className="font-medium">Total Budget:</span> ${budget}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-3">
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg flex items-center">
          <FaEdit className="mr-2" /> Edit Budget
        </button>
        <button className="bg-[#5AB1F5] hover:bg-[#4098db] text-white font-medium py-2 px-4 rounded-lg flex items-center">
          <FaPlus className="mr-2" /> Add Expense
        </button>
      </div>
    </div>
  );
};

export default BudgetTracker;
