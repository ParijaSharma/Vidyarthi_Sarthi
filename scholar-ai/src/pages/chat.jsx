import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Globe, Lightbulb, ArrowUp } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I can help you find scholarships or internships. What are you looking for?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Create a reference to anchor the bottom of the chat
  const messagesEndRef = useRef(null);

  // 2. Function to trigger the smooth scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 3. Fire the scroll every time 'messages' or 'isLoading' changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 🚀 Your Ollama Backend Call Will Go Here 🚀
      
      // Fake delay for testing UI
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'assistant', content: "This is a dummy response. Connect your API, bro!" }]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-[#0b1220] via-[#112a24] to-[#1a3d2f] overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85))] z-0" />
      <div className="absolute inset-0 glass-grid opacity-30 z-0"></div>

      {/* Messages Display Area */}
      <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-4 pt-8 pb-4 z-10 flex flex-col gap-6 custom-scrollbar">
        
        {messages.length === 1 && (
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white text-center mt-10">
              What can I help with?
            </h1>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-yellow-500 text-black rounded-br-sm' 
                : 'bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
            <div className="flex justify-start w-full">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white/50 rounded-2xl rounded-bl-sm p-4 animate-pulse">
                    AI is typing...
                </div>
            </div>
        )}

        {/* 4. The invisible anchor div at the bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Pinned to bottom) */}
      <div className="w-full max-w-3xl mx-auto px-4 z-10 relative pb-6 shrink-0">
        <div className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all focus-within:bg-white/[0.12] focus-within:border-white/30">
          
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            }}
            placeholder="Ask anything about your opportunities..."
            className="w-full bg-transparent text-white placeholder-white/50 text-base resize-none outline-none min-h-[60px] max-h-[200px] p-2"
          ></textarea>
          
          <div className="flex justify-between items-center mt-2 px-2">
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white transition-all">
                <Paperclip size={14} />
              </button>
            </div>
            
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-full bg-yellow-400 disabled:opacity-50 hover:bg-yellow-500 text-black flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-transform hover:scale-105"
            >
              <ArrowUp size={20} className="stroke-[3]" />
            </button>
          </div>
        </div>
        <div className="mt-4 text-center">
           <p className="text-xs text-white/40">AI can make mistakes. Please double-check responses.</p>
        </div>
      </div>
    </div>
  );
}