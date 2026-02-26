
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import AuthPanel from "./components/authPanel";
import Dashboard from "./pages/dashboard";
import Questions from "./pages/questions";
import ChatPage from "./pages/chat";
import DashboardLayout from "./layout/DashboardLayout";
import { useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Landing Page Component */
function LandingPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b1220] via-[#112a24] to-[#1a3d2f] text-white">

      <div className="pointer-events-none absolute inset-0
        bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85))]" />

      <div
        className={`relative glass-grid min-h-screen pt-6 transition-all duration-300
        ${open ? "ml-[50%] scale-[0.98]" : "ml-0 scale-100"}`}
      >
        <Navbar />
        <Hero onGetStarted={() => setOpen(true)} />
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 z-40 pointer-events-none"></div>
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

      {/* Dashboard layout wrapper */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
      
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
export default App;
