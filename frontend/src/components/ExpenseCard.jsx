import React from 'react';
import { FaBed, FaPlane, FaShoppingCart, FaTicketAlt, FaQuestionCircle, FaTrash } from 'react-icons/fa';
import { IoMdRestaurant } from 'react-icons/io';

const categoryIcons = {
  hotel: <FaBed />,
  flight: <FaPlane />,
  shopping: <FaShoppingCart />,
  food: <IoMdRestaurant />,
  tickets: <FaTicketAlt />,
  other: <FaQuestionCircle />,
};

const ExpenseCard = ({ expense, onDelete }) => {
  const { title, category, price } = expense;
  const icon = categoryIcons[category.toLowerCase()] || <FaQuestionCircle />;

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md mb-4">
      <div className="flex items-center">
        <div className="p-3 bg-gray-200 rounded-full">
          {React.cloneElement(icon, { size: 24, className: 'text-gray-600' })}
        </div>
        <div className="ml-4">
          <p className="font-bold text-gray-800">{title || 'Expense'}</p>
          <p className="text-sm text-gray-500 capitalize">{category}</p>
        </div>
      </div>
      <div className="flex items-center">
        <p className="font-bold text-lg text-gray-800 mr-4">${price.toFixed(2)}</p>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
