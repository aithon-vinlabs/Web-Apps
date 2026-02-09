import { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Filters from "./components/Filters";
import ExpenseChart from "./components/ExpenseChart";
import { getExpenses, saveExpenses } from "./utils/localStorage";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Load expenses from localStorage
  useEffect(() => {
    setExpenses(getExpenses());
  }, []);

  // Save expenses to localStorage
  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  const addExpense = (expense) => {
    setExpenses([expense, ...expenses]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // FIX 1: Generate categories dynamically
  const defaultCategories = ["Food", "Travel", "Bills", "Others"];

const categories = Array.from(
  new Set([
    ...defaultCategories,
    ...expenses.map((e) => e.category),
  ])
);


  // Apply category + month + year filters
  const filteredExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);

    const matchCategory = category ? e.category === category : true;

    const matchMonth = selectedMonth
      ? expenseDate.getMonth() + 1 === Number(selectedMonth)
      : true;

    const matchYear = selectedYear
      ? expenseDate.getFullYear() === Number(selectedYear)
      : true;

    return matchCategory && matchMonth && matchYear;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 relative overflow-hidden">

      {/* Background Icons */}
      <div className="absolute inset-0 opacity-100 pointer-events-none">
        <span className="absolute text-7xl top-10 left-12">💰</span>
        <span className="absolute text-7xl top-40 right-24">📊</span>
        <span className="absolute text-7xl bottom-32 left-32">🧾</span>
        <span className="absolute text-7xl bottom-16 right-24">💵</span>
      </div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto p-4 relative z-20">
        <h1 className="text-2xl font-bold text-center mb-4">
          Smart Expense Tracker
        </h1>

        {/* 📅 Month & Year Filter */}
        <div className="flex justify-end gap-2 mb-4">
          <select
            className="input w-32"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Month</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <input
  type="number"
  placeholder="Year"
  className="input w-32"
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
  min="2000"
  max="2100"
/>

        </div>

        <ExpenseForm addExpense={addExpense} />

        {/* ✅ FIX 2: Pass dynamic categories */}
        <Filters
          categories={categories}
          setCategory={setCategory}
        />

        <ExpenseChart expenses={filteredExpenses} />

        <ExpenseList
          expenses={filteredExpenses}
          deleteExpense={deleteExpense}
        />
      </div>
    </div>
  );
}

