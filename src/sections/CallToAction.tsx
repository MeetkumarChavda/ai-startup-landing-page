'use client'
import { Button } from "@/components/Button";
import starsBg from "@/assets/stars.png";
import gridLines from "@/assets/grid-lines.png";
import { motion , useMotionTemplate, useMotionValue, useScroll, useTransform } from "framer-motion";
import { RefObject, useEffect, useRef } from "react";

/**
 * Custom hook to track mouse position relative to a referenced element.
 * @param {RefObject<HTMLElement>} to - A reference to the target element for tracking mouse position.
 * @returns {[MotionValue<number>, MotionValue<number>]} An array containing `mouseX` and `mouseY` motion values.
 */
const useRelativeMousePosition = (to: RefObject<HTMLElement>)=>{

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  /**
   * Updates the mouse position relative to the element's top-left corner.
   * @param {MouseEvent} event - The mouse event used to calculate the position.
   */
  const updateMousePosition = (event: MouseEvent) =>{
    if(!to.current) return;
    const { top, left } = to.current.getBoundingClientRect();
    mouseX.set(event.x  - left);
    mouseY.set(event.y - top);
  };

  useEffect(()=>{
    window.addEventListener('mousemove', updateMousePosition);

    return () =>{
      window.removeEventListener('mousemove',updateMousePosition);
    }
  },[]);

  return [mouseX, mouseY];
}

/**
 * "CallToAction" component displays a call-to-action section with a title, 
 * description, and a button. The component uses Framer Motion to add 
 * animations that respond to both scroll and mouse movements, enhancing user 
 * engagement.
 * 
 * - The section background shifts vertically based on scroll position.
 * - The `useRelativeMousePosition` hook tracks mouse movement to create a 
 *   parallax effect on grid lines within the section.
 * - On hover, the component reveals hidden elements through smooth transitions.
 * 
 * @returns {JSX.Element} The rendered `CallToAction` component.
 */
export const CallToAction = () => {

  const sectionRef = useRef<HTMLElement>(null);
  const borderedDivRef = useRef<HTMLDivElement>(null);

  // Scroll-based animation for background position.
  const {scrollYProgress} = useScroll({
    target:sectionRef,
    offset:['start end','end start'],
  });
  // Maps the scroll progress to a background Y position, creating a parallax effect
  const backgroundPositionY = useTransform(
    scrollYProgress,// The scroll progress of the section (from 0 to 1)
     [0,1], // Input range representing the start and end of the scroll
     [-300,300] // Output range for the background Y position
    );
  
  // Mouse position tracking for interactive masking effect.
  const[mouseX , mouseY] = useRelativeMousePosition(borderedDivRef);

  const imageMask = useMotionTemplate`radial-gradient(50% 50% at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
  <section ref = {sectionRef} className="py-20 md:py-24" >
    <div className="container">
      {/* used group */}
      <motion.div 
        ref={borderedDivRef}
        className="relative cursor-grab border border-white/15 py-24 rounded-xl overflow-hidden group" 
        animate={{
          backgroundPositionX:starsBg.width,
        }}
        transition={{
          duration:40,
          ease:'linear',
          repeat:Infinity,
        }}
        style={{
          backgroundPositionY,
          backgroundImage:`url(${starsBg.src})`
        }}>
          <div className="absolute inset-0 bg-[rgb(74,32,138)] bg-blend-overlay [mask-image:radial-gradient(50%_50%_at_50%_35%,black,transparent)] group-hover:opacity-0 transition duration-700" 
            style={{
              backgroundImage:`url(${gridLines.src})`
            }}>
          </div>
          <motion.div 
            className="absolute inset-0 bg-[rgb(74,32,138)] bg-blend-overlay  opacity-0 group-hover:opacity-100" 
            style={{
              maskImage:imageMask,
              backgroundImage:`url(${gridLines.src})`
            }}>
          </motion.div>
        <div className="relative">
          <h2 className="text-5xl md:text-6xl max-w-sm mx-auto tracking-tighter text-center font-medium">AI-driven SEO for everyone.</h2>
          <p className="text-center text-lg md:text-xl max-w-xs mx-auto text-white/70 px-4 mt-5 tracking-tighter">Achieve clear, impactful results without the complexity.</p>
          <div className="flex justify-center mt-8">
            <Button>Join waitlist</Button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
  
);};
