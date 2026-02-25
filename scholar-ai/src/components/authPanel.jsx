import { X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AuthPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoadingPin, setIsLoadingPin] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    pincode: "",
    city: "",
    state: "",
    education: "school",
  });

  const handleLogin = () => {
    onClose();
    navigate('/chat');
  };

  const handleRegister = () => {
    onClose();
    navigate('/chat');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-fetch City & State when pincode is 6 digits
  const handlePincodeChange = async (e) => {
    const pin = e.target.value;
    setFormData((prev) => ({ ...prev, pincode: pin }));

    if (pin.length === 6) {
      setIsLoadingPin(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await response.json();
        
        if (data && data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State,
          }));
        } else {
          // Reset if invalid pincode
          setFormData((prev) => ({ ...prev, city: "", state: "" }));
        }
      } catch (error) {
        console.error("Failed to fetch location data", error);
      } finally {
        setIsLoadingPin(false);
      }
    } else {
      // Clear city/state if pincode is altered and not 6 digits
      if (formData.city || formData.state) {
        setFormData((prev) => ({ ...prev, city: "", state: "" }));
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 
      ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <div className="grid md:grid-cols-2 h-full w-full">

        {/* LEFT SIDE */}
        <div className="relative flex items-center justify-center w-full h-full
        bg-gradient-to-br from-[#0c1f1b]/90 via-[#0d2f28]/90 to-[#071514]/90 backdrop-blur-xl">

          {/* Glow behind card */}
          <div className="absolute w-[520px] h-[520px] 
          bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"></div>

          {/* Centered Wrapper */}
          <div className="relative flex flex-col justify-center items-center w-full h-full px-4 py-8">

            {/* CARD */}
            <div
              className="
                w-full max-w-md p-8 md:p-10 rounded-3xl
                bg-white/10 backdrop-blur-2xl
                border border-white/20
                shadow-[0_20px_80px_rgba(0,0,0,0.45)]
                relative max-h-[90vh] overflow-y-auto no-scrollbar">
                
              {/* Custom CSS to hide scrollbar but keep functionality */}
              <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>

              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-bold text-white mb-8">
                {isLogin ? "Welcome 👋" : "Create Account 🎓"}
              </h2>

              {/* ----- LOGIN FORM ----- */}
              {isLogin ? (
                <>
                  <input
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mb-4 p-3 rounded-2xl bg-white/15 backdrop-blur border border-white/20 text-white placeholder-white/60 outline-none focus:border-[#f5b301] transition-colors"
                  />
                  <input
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full mb-6 p-3 rounded-2xl bg-white/15 backdrop-blur border border-white/20 text-white placeholder-white/60 outline-none focus:border-[#f5b301] transition-colors"
                  />
                  <button
                    onClick={handleLogin}
                    className="w-full py-3 rounded-2xl font-semibold bg-[#f5b301] text-black shadow-lg hover:brightness-105 transition-all">
                    Login
                  </button>
                  <p className="text-white/80 mt-7 text-sm text-center">
                    Don’t have an account?{" "}
                    <button onClick={() => setIsLogin(false)} className="font-semibold hover:text-white transition-colors">Register</button>
                  </p>
                </>
              ) : (
                /* ----- REGISTER FORM ----- */
                <div className="flex flex-col gap-4">
                  <input
                    placeholder="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 rounded-2xl bg-white/15 backdrop-blur border border-white/20 text-white placeholder-white/60 outline-none focus:border-[#f5b301] transition-colors"
                  />
                  <input
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-2xl bg-white/15 backdrop-blur border border-white/20 text-white placeholder-white/60 outline-none focus:border-[#f5b301] transition-colors"
                  />
                  <input
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded-2xl bg-white/15 backdrop-blur border border-white/20 text-white placeholder-white/60 outline-none focus:border-[#f5b301] transition-colors"
                  />

                  {/* Location Area */}
                  <div className="relative">
                    <input
                      placeholder="Pincode (6 digits)"
                      name="pincode"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handlePincodeChange}
                      className="w-full p-3 rounded-2xl bg-white/15 backdrop-blur border border-white/20 text-white placeholder-white/60 outline-none focus:border-[#f5b301] transition-colors"
                    />
                    {isLoadingPin && <Loader2 className="absolute right-3 top-3 animate-spin text-white/60" size={20} />}
                  </div>

                  <div className="flex gap-3">
                    <input
                      placeholder="City"
                      readOnly
                      value={formData.city}
                      className="w-1/2 p-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-white/80 placeholder-white/40 outline-none cursor-not-allowed"
                    />
                    <input
                      placeholder="State"
                      readOnly
                      value={formData.state}
                      className="w-1/2 p-3 rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-white/80 placeholder-white/40 outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Education Dropdown */}
                  <div className="relative">
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full p-3 rounded-2xl bg-white/15 backdrop-blur border border-white/20 text-white outline-none focus:border-[#f5b301] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="school" className="text-black">High School Student</option>
                      <option value="college" className="text-black">College / University Student</option>
                      <option value="internship" className="text-black">Looking for Internships</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/60">
                      ▼
                    </div>
                  </div>

                  <button
                    onClick={handleRegister}
                    className="w-full py-3 mt-2 rounded-2xl font-semibold bg-[#f5b301] text-black shadow-lg hover:brightness-105 transition-all">
                    Create Account
                  </button>

                  <p className="text-white/80 mt-4 text-sm text-center">
                    Already have an account?{" "}
                    <button onClick={() => setIsLogin(true)} className="font-semibold hover:text-white transition-colors">Sign in</button>
                  </p>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:block"></div>

      </div>
    </div>
  );
}