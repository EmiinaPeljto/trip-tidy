import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex justify-center w-full max-w-xl mx-auto mt-4">
      <input
        type="text"
        placeholder="Search by destination..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-grow px-4 py-2 rounded-l-2xl bg-white text-gray-800 border-t border-b border-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5AB1F5]"
      />
      <button
        className="px-5 py-2 bg-[#5AB1F5] hover:bg-[#4098db] text-white rounded-r-2xl flex items-center justify-center transition"
        tabIndex={-1}
        type="button"
        disabled
      >
        <FaSearch className="text-sm" />
      </button>
    </div>
  );
};

export default SearchBar;