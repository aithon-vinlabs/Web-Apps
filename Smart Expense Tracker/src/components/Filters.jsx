export default function Filters({ categories, setCategory }) {
  return (
    <select
      className="input mt-4"
      onChange={(e) => setCategory(e.target.value)}
    >
      <option value="">All Categories</option>

      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
