import { useEffect, useState } from "react";

export default function SavedScholarships() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookmark/all")
      .then(res => res.json())
      .then(data => setSaved(data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Saved Scholarships</h1>

      {saved.length === 0 ? (
        <p>No saved scholarships yet.</p>
      ) : (
        <div className="grid gap-4">
          {saved.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800 rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p>{item.provider}</p>
              <p>{item.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}