import { Search } from "lucide-react";

export default function ScholarshipSection() {
  return (
    <div className="p-6">

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">
        Scholarships for Indian Students
      </h2>

     

      {/* Category Buttons */}
      <div className="flex gap-4 mb-6">
        <button className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-medium">
          Live Scholarships 216
        </button>

        <button className="border px-6 py-3 rounded-xl text-gray-600">
          Upcoming Scholarships
        </button>

        <button className="border px-6 py-3 rounded-xl text-gray-600">
          Always Open
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-end gap-3 mb-6">
        <button className="border px-4 py-2 rounded-full text-indigo-600">
          Recently Posted
        </button>

        <button className="bg-yellow-500 text-white px-4 py-2 rounded-full">
          Deadline Date
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ScholarshipCard />
        <ScholarshipCard />
        <ScholarshipCard />
      </div>

    </div>
  );
}

/* CARD COMPONENT */
function ScholarshipCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 relative">

      <span className="absolute -top-3 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
        Featured
      </span>

      <h3 className="font-semibold text-lg mb-2">
        Aspire Leaders Program 2026
      </h3>

      <p className="text-sm text-gray-500 mb-4">
        Free access to training modules, live sessions
      </p>

      <div className="text-sm text-gray-600 mb-2">
        🏆 Award: Fee waiver
      </div>

      <div className="text-sm text-gray-600">
        Eligibility: Class 11–12
      </div>

    </div>
  );
}
