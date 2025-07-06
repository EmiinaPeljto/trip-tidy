import React from 'react';
import { FaBoxOpen } from 'react-icons/fa';

const TravelChecklist = ({ checklist }) => {
  // If the checklist is not an array or is empty, show a fallback message.
  if (!Array.isArray(checklist) || checklist.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
        <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-4" />
        <p>No travel checklist items available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <ul className="space-y-4">
        {checklist.map((item, index) => (
          <li key={index} className="flex items-center">
            <input
              type="checkbox"
              id={`item-${index}`}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor={`item-${index}`} className="ml-3 text-md text-gray-700 cursor-pointer">
              {item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TravelChecklist;
