import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import {faArrowRight } from "@fortawesome/free-solid-svg-icons";

import HeroCarousel from "./HeroCarousel";
   
const Hero= ({onGetStarted}) => {
    
    return (
       <section className="relative min-h-[90vh] flex flex-col overflow-hidden">
                {/* Badge */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10 text-sm text-white/80">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                     <FontAwesomeIcon icon={faBolt} className="text-yellow-400" />
                     New Launch: Vidyarthi Sarthi is now live!
                </div>
               
                    <HeroCarousel onGetStarted={onGetStarted} />
            
       </section>
    );
     
}
export default Hero;
