import React, { useState } from 'react';
import { Paperclip, Globe, Lightbulb, ArrowUp, LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChatPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
      // Genius move clearing both storages, bro
      localStorage.removeItem("scholarship_answers");
      localStorage.removeItem("internship_answers");
      navigate('/');
  };

  return (
    // Fits perfectly inside DashboardLayout with rounded corners for a slick look
    <div className="flex flex-col h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-[#0b1220] via-[#112a24] to-[#1a3d2f] rounded-2xl overflow-hidden relative">
      
      {/* Background Gradients & Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85))] z-0" />
      <div className="absolute inset-0 glass-grid opacity-30 z-0"></div>

      {/* Your Custom Header with Profile & Logout (Hamburger removed since Layout handles it) */}
      <div className="h-20 flex items-center px-6 relative z-10 justify-end shrink-0">
          <div className="flex items-center gap-4 relative">
              <button className="hidden sm:block bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full text-sm font-medium text-white hover:bg-white/20 transition-all">
                Get Pro
              </button>
              
              {/* Clickable Profile Avatar */}
              <div 
                className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold shadow-[0_0_15px_rgba(20,184,166,0.3)] cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#112a24] hover:ring-teal-500 transition-all select-none"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                SJ
              </div>

              {/* Dark Mode Profile Dropdown */}
              {isProfileOpen && (
                  <div className="absolute right-0 top-[110%] mt-2 w-48 bg-[#0b1220]/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 py-2 overflow-hidden z-50">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                          <User size={16} /> My Profile
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                          <Settings size={16} /> Account Settings
                      </button>
                      <div className="h-px bg-white/10 my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                      >
                          <LogOut size={16} /> Sign Out
                      </button>
                  </div>
              )}
          </div>
      </div>

      {/* Main Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 z-10 relative pb-10 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">
          What can I help with?
        </h1>

        {/* Big Glass Input Container */}
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all focus-within:bg-white/[0.12] focus-within:border-white/30">
          
          <textarea 
            placeholder="Ask anything about your opportunities..."
            className="w-full bg-transparent text-white placeholder-white/50 text-lg resize-none outline-none min-h-[120px] p-2"
          ></textarea>
          
          {/* Action Buttons inside Input */}
          <div className="flex justify-between items-center mt-2 px-2">
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white transition-all">
                <Paperclip size={14} />
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/70 hover:bg-white/15 hover:text-white transition-all">
                <Globe size={14} /> Deep Search
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/70 hover:bg-white/15 hover:text-white transition-all">
                <Lightbulb size={14} /> Reason
              </button>
            </div>
            
            {/* Send Button */}
            <button className="w-10 h-10 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-transform hover:scale-105">
              <ArrowUp size={20} className="stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center flex flex-col items-center gap-3">
           <p className="text-xs text-white/40">AI can make mistakes. Please double-check responses.</p>
        </div>
      </div>
    </div>
  );
}