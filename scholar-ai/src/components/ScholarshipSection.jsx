import { ExternalLink, Bookmark,Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ScholarshipSection({ data, userProfile, filterType, setFilterType }) {
  if (!data) {
    return <p className="text-gray-500 p-4">Loading recommendations...</p>;
  }
 // const [filterType, setFilterType] = useState("live"); // live, upcoming, always
  const removeDuplicates = (arr) => {
  const seen = new Set();
  return arr.filter(item => {
    if (seen.has(item.title)) return false;
    seen.add(item.title);
    return true;
    });
  };
 
  const best = removeDuplicates(data.best_matches);
  const high = removeDuplicates(data.high_reward);
  const safe = removeDuplicates(data.safe_options);
  return (
    <div className="px-4 md:px-8 py-6 h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <span className="flex gap-3 items-center mb-2">
        <Sparkles size={30} className="text-yellow-500 mb-2" />
        <h2 className="text-2xl font-bold mb-2">
          {userProfile
            ? `Scholarships for ${userProfile.field || userProfile.stream} students aiming for ${userProfile.aspiration}`
            : "Scholarships for Indian Students"}
        </h2>
      </span>

      <p className="text-gray-700 mb-6 md:w-max bg-gray-200/70 backdrop-blur-sm inline-block px-3 py-1 rounded-full text-sm">
        Curated based on your profile and preferences
      </p>

      {/* FILTER BAR */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setFilterType("live")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition ${
            filterType === "live"
              ? "bg-yellow-500 text-white"
              : "bg-white border text-gray-600"
          }`}
        >
          Live Scholarships
        </button>

        <button
          onClick={() => setFilterType("upcoming")}
          className={`px-5 py-2 rounded-full text-sm ${
            filterType === "upcoming"
              ? "bg-yellow-500 text-white"
              : "bg-white border text-gray-600"
          }`}
        >
          Upcoming
        </button>

        <button
          onClick={() => setFilterType("always")}
          className={`px-5 py-2 rounded-full text-sm ${
            filterType === "always"
              ? "bg-yellow-500 text-white"
              : "bg-white border text-gray-600"
          }`}
        >
          Always Open
        </button>
      </div>

      {/* SECTIONS */}
      <div className="flex flex-col gap-8">
        <Section
          title="🎯 Top Matches for You"
          subtitle="Best scholarships based on your profile"
          data={best}
          type="best"
        />

        <Section
          title="💰 High Reward Scholarships"
          subtitle="Maximum financial benefits"
          data={high}
          type="high"
        />

        <Section
          title="🛡️ Easy to Get (Safe Options)"
          subtitle="Higher chances of selection"
          data={safe}
          type="safe"
        />
      </div>
    </div>
  );
}

function Section({ title, subtitle, data, type }) {
  const scrollRef = useRef();
  if (!data || data.length === 0) return null;

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.firstChild?.offsetWidth + 24;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col relative group">
      <h3 className="text-lg md:text-xl font-semibold tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-gray-500 mb-4 text-sm">{subtitle}</p>

      <div className="relative w-full">
        {/* LEFT ARROW */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur shadow-md p-2 rounded-full z-20 border hover:bg-gray-100 transition-opacity opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur shadow-md p-2 rounded-full z-20 border hover:bg-gray-100 transition-opacity opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-6 px-4"
        >
          {data.map((sch, i) => (
            <ScholarshipCard key={i} scholarship={sch} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScholarshipCard({ scholarship, type }) {
  const match = Math.round(scholarship.score);
  const [savedIds, setSavedIds] = useState([]);

  const baseStyle =
    "min-w-[300px] w-[300px] h-[400px] shrink-0 rounded-2xl shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 p-5 border hover:-translate-y-1 snap-start flex flex-col justify-between";

  const typeStyles = {
    best: "bg-gradient-to-br from-emerald-50 to-white border-emerald-100",
    high: "bg-gradient-to-br from-yellow-50 to-white border-yellow-100",
    safe: "bg-gradient-to-br from-blue-50 to-white border-blue-100",
  };

  const capitalizeFirst = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
  };

    const handleSave = async (scholarship) => {
  try {
    const res = await fetch("http://localhost:5000/api/bookmark/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: "demo_user",
        scholarship_id: scholarship.id || scholarship._id || scholarship.title,
        title: scholarship.title,
        amount: scholarship.amount || "N/A",
        award: scholarship.award,
        eligibility: scholarship.eligibility,
        apply_link: scholarship.link
      })
    });

    if (res.ok) {
      const id = scholarship.id || scholarship._id || scholarship.title;

      //  prevent duplicate state
      setSavedIds(prev => prev.includes(id) ? prev : [...prev, id]);
    }

  } catch (err) {
    console.error(err);
  }
};
 
  return (
    <div className={`${baseStyle} ${typeStyles[type]}`}>
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
            {match.toFixed(0)}% Match
          </span>

          {type === "high" && (
            <span className="bg-yellow-50 text-yellow-600 text-xs px-2 py-1 rounded-full">
              High Reward
            </span>
          )}

          {type === "safe" && (
            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
              Easy
            </span>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight">
          {capitalizeFirst(scholarship.title)}
        </h3>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600 flex items-start gap-2">
            <span></span> {scholarship.award || "Not specified"}
          </p>
          <p className="text-sm text-gray-500 line-clamp-2 flex items-start gap-2">
            <span></span> {scholarship.eligibility}
          </p>
          <p className="text-xs text-indigo-600 bg-indigo-50/70 border border-indigo-100 p-2 rounded-lg line-clamp-2">
             {scholarship.reason}
          </p>
        </div>
      </div>

      <span className="flex flex-col gap-2 ">
      <a
        href={scholarship.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-indigo-600 text-sm font-semibold hover:underline transition-colors hover:text-indigo-700 mt-2"
      >
        Apply Now <ExternalLink size={14} />
      </a>
      <button onClick={() => handleSave(scholarship)}>
  <span
    className={`flex items-center gap-1 text-lg transition
      ${savedIds.includes(scholarship.id || scholarship._id || scholarship.title)
        ? "text-green-500"
        : "text-yellow-500 hover:text-yellow-600"}`}
  >
    <Bookmark size={20} />

    {savedIds.includes(scholarship.id || scholarship._id || scholarship.title)
      ? "Saved ✓"
      : "Save"}
  </span>
</button>
    </span>    
    </div>
  );
}