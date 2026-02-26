import React from 'react';
import { Paperclip, Globe, Lightbulb, ArrowUp, PanelLeft, Plus, MessageSquare } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="w-full flex bg-gradient-to-br from-[#0b1220] via-[#112a24] to-[#1a3d2f] text-white relative overflow-hidden">
      
      {/* Background Gradients & Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85))] z-0" />
      <div className="absolute inset-0 glass-grid opacity-30 z-0"></div>

      {/* Minimal Sidebar (Like the screenshot) */}
      <div className="w-16 h-screen border-r border-white/10 flex flex-col items-center py-6 gap-6 bg-white/5 backdrop-blur-xl z-10 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <button className="text-white/50 hover:text-white transition-colors"><PanelLeft size={20}/></button>
        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><Plus size={16}/></button>
        <button className="text-white/50 hover:text-white transition-colors mt-2"><MessageSquare size={18}/></button>
      </div>

      {/* Top Right Header Elements */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
        <button className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-all">
          Get Pro
        </button>
        <div className="w-10 h-10 rounded-full bg-yellow-400 text-[#0b1220] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(250,204,21,0.3)]">
          SJ
        </div>
      </div>

      {/* Main Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 z-10 relative">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">
          What can I help with?
        </h1>

        {/* Big Glass Input Container */}
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all focus-within:bg-white/[0.12] focus-within:border-white/30">
          
          <textarea 
            placeholder="Ask anything about scholarships..."
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