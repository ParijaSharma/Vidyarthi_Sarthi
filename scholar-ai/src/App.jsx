import { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import AuthPanel from "./components/authPanel";

// Pages
import Questions from "./pages/questions";
import Dashboard from "./pages/dashboard";
import InternshipDashboard from "./pages/InternshipDashboard";
import ChatPage from "./pages/chat";
import SavedScholarships from "./pages/SavedScholarships";

// Layout
import DashboardLayout from "./layout/DashboardLayout";

/* Landing Page Component (Using your smoother animations) */
function LandingPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0b1220] via-[#112a24] to-[#1a3d2f] text-white relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85))]" />

      <div
        className={`relative glass-grid min-h-screen pt-6 transition-all duration-500 ease-in-out
        ${open ? "translate-x-[50%] md:translate-x-[35%] scale-[0.98] opacity-60" : "translate-x-0 scale-100 opacity-100"}`}
      >
        <Navbar onOpenAuth={() => setOpen(true)} />
        <Hero onGetStarted={() => setOpen(true)} />
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 pointer-events-none transition-opacity duration-300"></div>
      )}

      <AuthPanel
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

/* Main App Router */
function App() {
  return (
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Selection page: Scholarship or Internship? */}
        <Route path="/questions" element={<Questions />} /> 
        
        {/* Your Internship Dashboard */}
        <Route path="/internship-dashboard" element={<InternshipDashboard />} /> 

        {/* Parija's Nested Dashboard Layout (UNTOUCHED) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="saved" element={<SavedScholarships />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Routes>
  );
}

export default App;