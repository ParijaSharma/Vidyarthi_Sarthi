import { ExternalLink } from "lucide-react";

export default function ScholarshipSection({ data, userProfile }) {
  if (!data) {
    return <p className="text-gray-500 p-4">Loading recommendations...</p>;
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-2">
        {userProfile
          ? `Scholarships for ${userProfile.field || userProfile.stream} students aiming for ${userProfile.aspiration}`
          : "Scholarships for Indian Students"}
      </h2>

      <p className="text-gray-500 mb-6">
        Curated based on your profile and preferences
      </p>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button className="bg-yellow-500 text-white px-5 py-2 rounded-full text-sm font-medium">
          Live Scholarships
        </button>
        <button className="border px-5 py-2 rounded-full text-gray-600 text-sm">
          Upcoming
        </button>
        <button className="border px-5 py-2 rounded-full text-gray-600 text-sm">
          Always Open
        </button>
      </div>

      {/* 🥇 TOP MATCHES */}
      <Section
        title="🎯 Top Matches for You"
        subtitle="Best scholarships based on your profile"
        data={data.best_matches}
        type="best"
      />

      {/* 💰 HIGH REWARD */}
      <Section
        title="💰 High Reward Scholarships"
        subtitle="Maximum financial benefits"
        data={data.high_reward}
        type="high"
      />

      {/* 🛡️ SAFE OPTIONS */}
      <Section
        title="🛡️ Easy to Get (Safe Options)"
        subtitle="Higher chances of selection"
        data={data.safe_options}
        type="safe"
      />
    </div>
  );
}

/* ================= SECTION ================= */

function Section({ title, subtitle, data, type }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-gray-500 mb-4 text-sm">{subtitle}</p>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((sch, i) => (
          <ScholarshipCard key={i} scholarship={sch} type={type} />
        ))}
      </div>
    </div>
  );
}

/* ================= CARD ================= */

function ScholarshipCard({ scholarship, type }) {
  const match = Math.min(95, Math.max(50, (scholarship.score * 100 * 2.2)));

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-5 border">

      {/* TOP BADGES */}
      <div className="flex justify-between items-center mb-3">

        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
          {match.toFixed(0)}% Match
        </span>

        {type === "high" && (
          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
            High Reward
          </span>
        )}

        {type === "safe" && (
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
            Easy
          </span>
        )}
      </div>

      {/* TITLE */}
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
        {scholarship.title}
      </h3>

      {/* AWARD */}
      <p className="text-sm text-gray-600 mb-1">
        🏆 {scholarship.award}
      </p>

      {/* ELIGIBILITY */}
      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
        🎓 {scholarship.eligibility}
      </p>

      {/* REASON */}
      <p className="text-xs text-indigo-600 mb-3 line-clamp-2">
        💡 {scholarship.reason}
      </p>

      {/* CTA */}
      <a
        href={scholarship.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:underline"
      >
        Apply <ExternalLink size={14} />
      </a>
    </div>
  );
}