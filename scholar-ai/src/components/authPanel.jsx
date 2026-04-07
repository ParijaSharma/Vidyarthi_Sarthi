import { X } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GraduationCap } from "lucide-react";
import Hero from "./hero";

export default function AuthPanel({ isOpen, onClose }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 LOGIN FUNCTION
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ store token
        localStorage.setItem("token", data.token);

        // close panel
        onClose();

        // optional redirect
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition duration-300 
      ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <div className="grid md:grid-cols-[450px_1fr] h-full">

        {/* LEFT SIDE */}
        <div className="relative flex items-center justify-center bg-white">
          <div className="relative flex flex-col justify-between items-center h-full">

            <div className="flex flex-col items-center justify-center w-[420px] h-full p-10 relative">

              {/* CLOSE */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-black/70 hover:text-black transition"
              >
                <X size={24} />
              </button>

              {/* LOGO */}
              <div className="flex flex-col items-center gap-3 mb-4 border-b w-full pb-5">
                <div className="w-[100px] h-[100px] rounded-xl 
                                bg-gradient-to-br from-yellow-300 to-yellow-500
                                flex items-center justify-center shadow-md">
                  <GraduationCap className="text-white" size={60}/>
                </div>

                <h2 className="text-3xl font-bold text-green-900">
                  Vidyarthi Sarthi
                </h2>
              </div>

              {/* EMAIL */}
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full mb-4 p-3 rounded-xl
                border border-gray-500
                outline-none focus:border-[#f5b301]"
              />

              {/* PASSWORD */}
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full mb-4 p-3 rounded-xl 
                border border-gray-500 text-black
                outline-none focus:border-[#f5b301]"
              />

              {/* LOGIN BUTTON */}
              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-2xl font-semibold
                bg-yellow-400 text-slate-900
                hover:bg-yellow-500 transition shadow-lg"
              >
                Login
              </button>

              {/* DIVIDER */}
              <div className="flex items-center my-6 w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* GOOGLE */}
              <button
                className="w-full flex items-center justify-center gap-3
                border border-gray-300
                py-3 rounded-xl
                hover:bg-gray-50 transition font-medium"
              >
                <FcGoogle size={20} />
                <span className="text-black">Continue with Google</span>
              </button>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center justify-center
          bg-[#071c18] text-white relative glass-grid">

          <Hero onGetStarted={onClose} />

        </div>
      </div>
    </div>
  );
}