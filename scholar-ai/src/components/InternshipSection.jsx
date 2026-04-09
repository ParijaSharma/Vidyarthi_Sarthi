import { ExternalLink, Bookmark, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

export default function InternshipSection({ data, userProfile }) {
  const [filterType, setFilterType] = useState("live");

  if (!data) {
    return <p className="text-gray-500 p-6">Loading AI recommendations from port 8000...</p>;
  }

  const removeDuplicates = (arr) => {
    if (!arr) return [];
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
        <Sparkles size={30} className="text-indigo-500 mb-2" />
        <h2 className="text-2xl font-bold mb-2">
          {userProfile?.domain 
            ? `Internships for ${userProfile.domain} students aiming for ${userProfile.work_mode || "any"} roles`
            : "Top Internships for You"}
        </h2>
      </span>

      <p className="text-gray-700 mb-6 md:w-max bg-gray-200/70 backdrop-blur-sm inline-block px-3 py-1 rounded-full text-sm">
        Curated based on your profile and preferences
      </p>

      <div className="flex flex-col gap-8">
        <Section title="🎯 Top Matches for You" subtitle="Best internships based on your profile" data={best} type="best" />
        <Section title="💰 High Reward Internships" subtitle="Maximum stipend benefits" data={high} type="high" />
        <Section title="🛡️ Easy to Get (Safe Options)" subtitle="Higher chances of selection" data={safe} type="safe" />
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
      <h3 className="text-lg md:text-xl font-semibold tracking-tight mb-1">{title}</h3>
      <p className="text-gray-500 mb-4 text-sm">{subtitle}</p>

      <div className="relative w-full">
        <button onClick={() => scroll("left")} className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur shadow-md p-2 rounded-full z-20 border hover:bg-gray-100 transition-opacity opacity-0 group-hover:opacity-100">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => scroll("right")} className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur shadow-md p-2 rounded-full z-20 border hover:bg-gray-100 transition-opacity opacity-0 group-hover:opacity-100">
          <ChevronRight size={20} />
        </button>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-6 px-4">
          {data.map((internship, i) => (
            <InternshipCard key={i} internship={internship} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
}

function InternshipCard({ internship, type }) {
  const match = Math.round(internship.score || 85);
  const [saved, setSaved] = useState(false);

  const baseStyle = "min-w-[300px] w-[300px] h-[400px] shrink-0 rounded-2xl shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 p-5 border hover:-translate-y-1 snap-start flex flex-col justify-between";

  const typeStyles = {
    best: "bg-gradient-to-br from-indigo-50 to-white border-indigo-100",
    high: "bg-gradient-to-br from-emerald-50 to-white border-emerald-100",
    safe: "bg-gradient-to-br from-blue-50 to-white border-blue-100",
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type]}`}>
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
            {match.toFixed(0)}% Match
          </span>
          {type === "high" && <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-full">High Paying</span>}
          {type === "safe" && <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">Easy</span>}
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight">
          {internship.title}
        </h3>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600 flex items-start gap-2">
            <span>💸</span> {internship.award}
          </p>
          <p className="text-sm text-gray-500 line-clamp-2 flex items-start gap-2">
            <span>🎓</span> {internship.eligibility}
          </p>
          <p className="text-xs text-indigo-600 bg-indigo-50/70 border border-indigo-100 p-2 rounded-lg line-clamp-2">
            💡 {internship.reason}
          </p>
        </div>
      </div>

      <span className="flex flex-col gap-2">
        <a href={internship.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-600 text-sm font-semibold hover:underline transition-colors hover:text-indigo-700 mt-2">
          Apply Now <ExternalLink size={14} />
        </a>
        <button onClick={() => setSaved(!saved)}>
          <span className={`flex items-center gap-1 text-lg transition-colors ${saved ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-500'}`}>
            <Bookmark size={20} className={saved ? "fill-current" : ""} /> {saved ? 'Saved' : 'Save'}
          </span>
        </button>
      </span>    
    </div>
  );
}