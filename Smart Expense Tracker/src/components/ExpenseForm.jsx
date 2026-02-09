import { useState } from "react";

const categories = ["Food", "Travel", "Bills", "Others"];

export default function ExpenseForm({ addExpense }) {
  const [customCategory, setCustomCategory] = useState("");

  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    date: "",
    note: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalCategory =
      form.category === "Others" ? customCategory : form.category;

    addExpense({
      ...form,
      category: finalCategory,
      id: Date.now()
    });

    setForm({
      amount: "",
      category: "Food",
      date: "",
      note: ""
    });

    setCustomCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
      <input
        type="number"
        placeholder="Amount"
        className="input"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        required
      />

      <select
        className="input"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      {form.category === "Others" && (
        <input
          type="text"
          placeholder="Enter custom category (e.g., Treat for friends)"
          className="input"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          required
        />
      )}

      <input
        type="date"
        className="input"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Note"
        className="input"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
      />

      <button className="btn">Add Expense</button>
    </form>
  );
}
