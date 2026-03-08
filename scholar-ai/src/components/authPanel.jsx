import { X } from "lucide-react";
import girlImg from "../images/girl.svg";
import Hero from "./hero";
import { FcGoogle } from "react-icons/fc";
import {

  LayoutDashboard,
  User,
  FileText,
  Bell,
  Settings,
  GraduationCap,
  Sparkles
} from "lucide-react";
export default function AuthPanel({ isOpen, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-50 transition duration-300 
      ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <div className="grid md:grid-cols-[450px_1fr] h-full">
        {/* LEFT SIDE */}
        <div className="relative flex items-center justify-center bg-white">
        
          <div className="relative flex flex-col justify-between items-center
          h-full">

            {/* LOGIN CARD */}
            <div
              className="
                flex flex-col items-center justify-center w-[420px] h-full p-10 bg-white relative">

              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>

                 <div className="flex flex-col items-center gap-3 mb-4 border-b w-full pb-5">
                <div className="w-[100px] h-[100px] rounded-xl 
                                bg-gradient-to-br from-yellow-300 to-yellow-500
                                flex items-center justify-center shadow-md">
                    <GraduationCap className="text-white" size={60}/>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-green-900">
                    Vidyarthi Sarthi
                  </h2>
                </div>
              </div>

              <input
              placeholder="Email"
              className="w-full mb-4 p-3 rounded-xl
              border border-gray-500
              outline-none focus:border-[#f5b301]"
              />

              <input
              placeholder="Password"
              type="password"
              className="w-full mb-4 p-3 rounded-xl
              border border-gray-500
              outline-none focus:border-[#f5b301]"
              />

              {/* LOGIN BUTTON */}
              <button
                className="w-full py-3 rounded-2xl font-semibold
                bg-yellow-400 text-slate-900 px-6 py-3 rounded-2xl text-sm font-medium hover:bg-yellow-500 transition
                shadow-lg ">
                Login
              </button>
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <button
              className="w-full flex items-center justify-center gap-3
              border border-gray-300
              py-3 rounded-xl
              hover:bg-gray-50 transition font-medium"
            >
              <FcGoogle size={20} />
              <span className="text-black">Continue with Google</span>
            </button>

              {/* <p className="text-black/80 mt-7 text-sm text-center">
                Don’t have an account?{" "}
                <span className="font-semibold">Register</span>
              </p> */}
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
        <div className="hidden md:flex items-center justify-center
      bg-[#071c18] text-white relative">

        <Hero onGetStarted={onClose} />

        </div>
      </div>
    </div>
  );
}
