import React, { useState } from 'react';
import { FaEdit, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ExpensesModal from './ExpensesModal';
import ExpenseCard from './ExpenseCard';

const BudgetTracker = ({ budget, expenses, setExpenses, setBudget }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget);

  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  const handleDeleteExpense = (indexToDelete) => {
    setExpenses(expenses.filter((_, index) => index !== indexToDelete));
  };

  const handleBudgetSave = () => {
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      setBudget(newBudget);
      setEditingBudget(false);
    }
  };

  const spent = expenses.reduce((total, expense) => total + (parseFloat(expense.price) || 0), 0);
  const percentageSpent = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = Math.max(budget - spent, 0);

  const getProgressColor = () => {
    if (percentageSpent < 50) return '#3BB77E'; // Green
    if (percentageSpent < 80) return '#FFB648'; // Yellow
    return '#F86C6B'; // Red
  };

  return (
    <>
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
              transition: 'stroke-dashoffset 0.5s ease 0s',
            })}
          />
        </div>

        {/* Budget Details */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-800">Budget Tracker</h2>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 flex items-center gap-2">
              <strong>Total Budget:</strong>
              {!editingBudget ? (
                <>
                  ${budget.toLocaleString()}
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      setEditingBudget(true);
                      setBudgetInput(budget);
                    }}
                    title="Edit Budget"
                  >
                    <FaEdit size={16} />
                  </button>
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    className="border rounded px-2 py-1 w-24 text-sm"
                    value={budgetInput}
                    onChange={e => setBudgetInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") handleBudgetSave();
                      if (e.key === "Escape") setEditingBudget(false);
                    }}
                    autoFocus
                  />
                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={handleBudgetSave}
                    title="Save"
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setEditingBudget(false)}
                    title="Cancel"
                  >
                    <FaTimes />
                  </button>
                </span>
              )}
            </p>
            <p className="text-red-500">
              <strong>Spent:</strong> ${spent.toLocaleString()}
            </p>
            <p className="text-green-500">
              <strong>Remaining:</strong> ${remaining.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#5AB1F5] hover:bg-[#4098db] text-white font-medium py-2 px-4 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Add Expense
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Expenses</h3>
        </div>
        <div className="space-y-4">
          {expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <ExpenseCard
                key={index}
                expense={expense}
                onDelete={() => handleDeleteExpense(index)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No expenses added yet.</p>
          )}
        </div>
      </div>

      <ExpensesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddExpense={handleAddExpense}
      />
    </>
  );
};

export default BudgetTracker;