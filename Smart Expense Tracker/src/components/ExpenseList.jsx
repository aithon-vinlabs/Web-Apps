export default function ExpenseList({ expenses, deleteExpense }) {
  return (
    <div className="mt-4">
      {expenses.length === 0 && (
        <p className="text-center text-gray-500">
          No expenses added yet
        </p>
      )}

      {expenses.map((e) => (
        <div
          key={e.id}
          className="flex justify-between items-center p-2 border-b"
        >
          <div>
            <p className="font-semibold">
              {e.category} – ₹{e.amount}
            </p>
            <small>{e.date} | {e.note}</small>
          </div>
          <button
            onClick={() => deleteExpense(e.id)}
            className="text-red-600"
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  );
}
