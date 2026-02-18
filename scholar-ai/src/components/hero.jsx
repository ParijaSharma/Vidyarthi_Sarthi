import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import {faArrowRight } from "@fortawesome/free-solid-svg-icons";
const Hero= ({onGetStarted}) => {
    return (
        <section >
            <div className="mx-auto max-w-5xl px-4 text-center py-20 ">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10 text-sm text-white/80 mb-6">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                     <FontAwesomeIcon icon={faBolt} className="text-yellow-400" />
                     New Launch: Scholar AI is now live!
                </div>
                {/* Heading */}

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                    Find a Scholarship <br />
                    That Sounds Like <span className="text-yellow-400">You</span>
                </h1>
                {/* Subheading */}
                <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10">
                    Scholar AI helps you find scholarships that match your unique profile and aspirations.
                </p>

                {/* Call to Action Buttons */}
                <div className=" flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                    onClick={() => {
                    console.log("clicked");
                    onGetStarted();
                    }}
                    className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-2xl text-sm font-medium hover:bg-yellow-600 transition">
                        Get Started <FontAwesomeIcon icon={faArrowRight} />

                    </button>
                    <button className="border border-white/30 text-white/80 px-6 py-3 rounded-2xl text-sm font-medium hover:bg-white/10 transition">Learn More</button>
                </div>
            </div>
       </section>
    );
     
}
export default Hero;