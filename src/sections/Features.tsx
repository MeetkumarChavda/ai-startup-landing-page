"use client"
import { DotLottieCommonPlayer, DotLottiePlayer } from "@dotlottie/react-player";
import productImage from "@/assets/product-image.png";
import { useEffect, useRef } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, ValueAnimationTransition } from "framer-motion";

const tabs = [
  {
    icon: "/assets/lottie/vroom.lottie",
    title: "User-friendly dashboard",
    isNew: false,
    backgroundPositionX: 0,
    backgroundPositionY: 0,
    backgroundSizeX: 150,
  },
  {
    icon: "/assets/lottie/click.lottie",
    title: "One-click optimization",
    isNew: false,
    backgroundPositionX: 98,
    backgroundPositionY: 100,
    backgroundSizeX: 135,
  },
  {
    icon: "/assets/lottie/stars.lottie",
    title: "Smart keyword generator",
    isNew: true,
    backgroundPositionX: 100,
    backgroundPositionY: 27,
    backgroundSizeX: 177,
  },
];
const FeatureTab = (tab: typeof tabs[number])=>{

  const dotLottieRef = useRef<DotLottieCommonPlayer>(null);

  const xPercentage = useMotionValue(0);
  const yPercentage = useMotionValue(0);

  const maskImageVar = useMotionTemplate`radial-gradient(80px 80px at ${xPercentage}% ${yPercentage}%, black, transparent)`;

  useEffect(()=>{
    const options:ValueAnimationTransition = {
      duration:4,
      repeat:Infinity,
      ease:'linear',
      repeatType:'loop',
    }
    animate(xPercentage,[0, 100, 100, 0, 0],options);
    animate(yPercentage , [0, 0, 100, 100, 0],options);
  }, []);

  const handleTabHover = () => {
    if(dotLottieRef.current === null) return;
    dotLottieRef.current.seek(0);
    dotLottieRef.current.play();
  }

  return(
      <div 
      onMouseEnter = {handleTabHover}
      className=" relative border border-white/15 rounded-xl flex lg:flex-1 items-center p-2.5 gap-2.5 ">
        <motion.div 
          style = {{
            maskImage:maskImageVar
          }}
          className="absolute -m-px rounded-xl inset-0 border border-[#A369FF] "></motion.div>
        <div className="h-12 w-12 border rounded-lg border-white/15 inline-flex items-center justify-center">
          <DotLottiePlayer
            ref = {dotLottieRef} 
            src={tab.icon} 
            className="h-5 w-5"
            autoplay
          />
        </div>
        <div>{tab.title}</div>
        {tab.isNew && 
          <div className="text-xs rounded-full px-2 py-0.5 bg-[#8c44ff] text-black font-semibold">
            new
          </div>
        }
      </div>
  )
}

export const Features = () => {
  return (
  <section className='py-20 md:py-24'>
    <div className="container">
      <h2 className="text-5xl md:text-6xl font-medium text-center tracking-tighter ">
        Elevate your SEO efforts.</h2>
      <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto tracking-tight text-center mt-5">
        From small startups to larg enterprises, our AI-driven tool has revolutionized the way business approch SEO.
      </p>
      <div className="mt-10 flex flex-col lg:flex-row  gap-3">
        {// We used lottie files
          tabs.map(tab=>(
            <FeatureTab {...tab} key={tab.title} />
          ))}
        </div>
        <div className="border border-white/20 p-2.5 rounded-xl mt-3">
          <div className="aspect-video bg-cover border border-white/20 rounded-lg" style={{
            backgroundImage:`url(${productImage.src})`
            }}>
          </div>
        </div>
    </div>
  </section>
  );
};
