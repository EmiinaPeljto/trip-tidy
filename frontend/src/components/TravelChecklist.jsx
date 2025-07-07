import React from 'react';
import { FaMapMarkerAlt, FaBoxOpen, FaExclamationCircle } from 'react-icons/fa';

const TravelChecklist = ({ checklist = [] }) => {

  if (!Array.isArray(checklist) || checklist.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm text-center text-gray-500">
        <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-4" />
        <p>No travel checklist items available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <FaExclamationCircle className="text-blue-500 text-xl" />
            <span className="font-bold text-blue-500 tracking-wider">MUST HAVE</span>
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {checklist.map((item, index) => (
          <label key={index} className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer hover:text-blue-600">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TravelChecklist;
