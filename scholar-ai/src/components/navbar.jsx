import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="mx-6 pt-6 px-8 py-4 rounded-2xl flex justify-between items-center ">
            <div className="flex items-center gap-2">
                
                 <FontAwesomeIcon
                    icon={faGraduationCap}
                    className="text-yellow-400 text-2xl"
                />
                <span className="text-3xl font-semibold">Scholar AI</span>
            </div>

            <div className="hidden md:flex gap-6 text-sm text-slate-30">
                <a href="#" className="text-white/70 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]transition-all duration-300">About</a>
                <Link to="/dashboard" className="text-white/70 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgba(250,204,21,0.8)] transition-all duration-300">
                    Dashboard
                </Link>
                <a href="#" className="text-white/70 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]transition-all duration-300">Scholarships</a>
                <a href="#" className="text-white/70 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]transition-all duration-300">FAQ</a>
            </div>

            <div className="flex gap-3">
                <button className="text-sm text-slate-300 hover:text-white">Sign in </button>
                <button className="text-sm text-slate-900 bg-yellow-400 px-4 py-2 rounded-2xl">Register</button>
            </div>

        </nav>
        
    );
}
export default Navbar;