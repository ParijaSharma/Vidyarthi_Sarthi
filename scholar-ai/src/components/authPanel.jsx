import { X } from "lucide-react";
import girlImg from "../images/girl.svg";

export default function AuthPanel({ isOpen, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-50 transition duration-300 
      ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <div className="grid md:grid-cols-2 h-full">

        {/* LEFT SIDE */}
        <div className="relative flex items-center justify-center
        bg-gradient-to-br from-[#0c1f1b]/90 via-[#0d2f28]/90 to-[#071514]/90 backdrop-blur-xl">

          {/* Glow behind card */}
          <div className="absolute w-[520px] h-[520px] 
          bg-emerald-500/20 blur-[120px] rounded-full"></div>

          <div className="relative flex flex-col justify-between items-center
          h-[650px]">

            {/* LOGIN CARD */}
            <div
              className="
                w-full max-w-md p-10 rounded-3xl
                bg-white/10 backdrop-blur-2xl
                border border-white/20
                shadow-[0_20px_80px_rgba(0,0,0,0.45)]
                relative">

              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-bold text-white mb-8">
                Welcome 👋
              </h2>

              <input
                placeholder="Email"
                className="w-full mb-4 p-3 rounded-2xl
                bg-white/15 backdrop-blur
                border border-white/20
                text-white placeholder-white/60
                outline-none focus:border-[#f5b301]"
              />

              <input
                placeholder="Password"
                type="password"
                className="w-full mb-4 p-3 rounded-2xl
                bg-white/15 backdrop-blur
                border border-white/20
                text-white placeholder-white/60
                outline-none focus:border-[#f5b301]"
              />

              {/* LOGIN BUTTON */}
              <button
                className="w-full py-3 rounded-2xl font-semibold
                bg-[#f5b301] text-black
                shadow-lg hover:brightness-105 transition">
                Login
              </button>

              <p className="text-white/80 mt-7 text-sm text-center">
                Don’t have an account?{" "}
                <span className="font-semibold">Register</span>
              </p>
            </div>

            {/* BOTTOM ILLUSTRATION */}
            {/* <img
              src={girlImg}
              alt="illustration"
              className="w-[260px] opacity-90 translate-y-6"
            /> */}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:block"></div>

      </div>
    </div>
  );
}
