import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaClipboardList,
} from "react-icons/fa";

const TravelChecklist = ({
  checklist = [],
  editable = false,
  onChecklistChange,
}) => {
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [checked, setChecked] = useState(Array(checklist.length).fill(false));

  const handleAdd = () => {
    if (input.trim()) {
      onChecklistChange([...checklist, input.trim()]);
      setChecked((prev) => [...prev, false]);
      setInput("");
    }
  };

  const handleRemove = (idx) => {
    const updated = checklist.filter((_, i) => i !== idx);
    onChecklistChange(updated);
    setChecked((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEditSave = (idx) => {
    if (editValue.trim()) {
      const updated = checklist.map((item, i) =>
        i === idx ? editValue.trim() : item
      );
      onChecklistChange(updated);
      setEditIndex(null);
      setEditValue("");
    }
  };

  const toggleChecked = (index) => {
    setChecked((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      {/* Add Input */}
      {editable && (
        <div className="flex gap-3 mb-5">
          <input
            type="text"
            placeholder="Add new item..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5AB1F5] focus:border-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-[#5AB1F5] rounded-md hover:bg-blue-600 transition"
            title="Add"
          >
            <FaPlus />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      )}

      {/* List */}
      {checklist.length === 0 ? (
        <p className="text-gray-400 text-sm text-center">
          No items yet. Start packing ✈️
        </p>
      ) : (
        <ul className="space-y-3">
          {checklist.map((item, index) => (
            <li
              key={index}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                checked[index]
                  ? "bg-green-50 border-green-200"
                  : " border-gray-200"
              } hover:shadow-sm transition`}
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  className="h-5 w-5 text-blue-500"
                  checked={checked[index]}
                  onChange={() => toggleChecked(index)}
                />
                {editable && editIndex === index ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleEditSave(index)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleEditSave(index)
                    }
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    autoFocus
                  />
                ) : (
                  <span
                    className={`text-sm flex-1 cursor-pointer ${
                      checked[index]
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                    onClick={() => {
                      if (editable) {
                        setEditIndex(index);
                        setEditValue(item);
                      }
                    }}
                  >
                    {item}
                  </span>
                )}
              </div>
              {editable && (
                <button
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-700 ml-3"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TravelChecklist;
