import React, { useEffect, useState } from "react";
import { Bookmark, Trash2, ExternalLink } from "lucide-react";

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const userId = localStorage.getItem("userId"); 
  //  FETCH BOOKMARKS
  const fetchBookmarks = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookmark/all/${userId}`);

      if (!res.ok) {
        throw new Error("Failed to fetch bookmarks");
      }

      const data = await res.json();
      setBookmarks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/bookmark/delete/${id}`, {
        method: "DELETE"
      });

      setBookmarks(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen px-6 py-6">

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <Bookmark className="text-yellow-500" />
        Saved Scholarships
      </h1>

      <p className="text-gray-500 mt-2">
        Your bookmarked scholarships appear here
      </p>

      {/* Empty State */}
      {bookmarks.length === 0 ? (
        <div className="mt-10 text-center text-gray-500">
          <Bookmark size={40} className="mx-auto mb-3 opacity-50" />
          <p>No bookmarks yet</p>
        </div>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {bookmarks.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top */}
              <div>
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {item.title}
                </h3>

                {/* Award */}
                <p className="text-sm text-gray-600 flex items-start gap-2 mt-2">
                  <span></span> {item.award || "Not specified"}
                </p>

                {/* Eligibility */}
                <p className="text-sm text-gray-500 flex items-start gap-2 line-clamp-2">
                  <span>🎓</span> {item.eligibility || "Not specified"}
                </p>
              </div>

              {/* Bottom */}
              <div className="flex justify-between items-center mt-4">

                {/* Apply */}
                <a
                  href={item.apply_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-600 text-sm font-semibold hover:underline"
                >
                  Apply <ExternalLink size={14} />
                </a>

                {/* Right side */}
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-sm font-medium">
                    ✓ Saved
                  </span>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkPage;