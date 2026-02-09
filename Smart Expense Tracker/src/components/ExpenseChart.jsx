import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart({ expenses }) {
  // ✅ Calculate total per category
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#d24fb1",
          "#22c55e",
          "#f97316",
          "#a855f7",
          "#ef4444",
          "#06b6d4",
        ],
      },
    ],
  };

  return (
    <div className="mt-6">
      {/* 🔹 Section Title */}
      <h2 className="text-lg font-semibold mb-3 text-center">
        📈 Expense Distribution (Pie Chart)
      </h2>

      {/* 🔹 Chart or Empty State */}
      {labels.length === 0 ? (
        <p className="text-center text-gray-500">
          No expenses added yet
        </p>
      ) : (
        <div className="bg-white p-4 rounded shadow mb-4">
          <Pie data={data} />
        </div>
      )}

      {/* 🔹 Category-wise Total Summary */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">
          💸 Spending by Category
        </h3>

        {labels.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No expenses added yet
          </p>
        ) : (
          <ul>
            {Object.entries(categoryTotals).map(([cat, total]) => (
              <li
                key={cat}
                className="flex justify-between border-b py-1"
              >
                <span>{cat}</span>
                <span>₹{total}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}



