"use client"
import productImage from "@/assets/product-image.png";
import { useState, useEffect, useRef, ComponentPropsWithoutRef } from "react";
import { DotLottieCommonPlayer, DotLottiePlayer } from "@dotlottie/react-player";
import { animate, motion, useMotionTemplate, useMotionValue, ValueAnimationTransition } from "framer-motion";

/**
 * Array of objects representing the tabs in the Features component.
 * Each tab includes an icon path, title, newness flag, and background animation properties.
 */
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

/**
 * Renders a single feature tab, which includes a Lottie animation, title, and optional "new" badge.
 * Handles tab selection and animation triggers on hover.
 * 
 * @param props - The properties of the tab, including icon, title, background positions, and whether it is selected.
 */
const FeatureTab = (
  props: typeof tabs[number] &
  ComponentPropsWithoutRef<'div'> &
  { selected: boolean}
)=>{
  
  // Motion values for tracking background position in percentage during animation.
  const xPercentage = useMotionValue(0);
  const yPercentage = useMotionValue(0);
  const tabRef = useRef<HTMLDivElement>(null);// Ref to access the tab element.
  const dotLottieRef = useRef<DotLottieCommonPlayer>(null); // Ref to control the Lottie player.
  // Creates a radial gradient for background masking, animated with x and y percentages.
  const maskImageVar = useMotionTemplate`radial-gradient(80px 80px at ${xPercentage}% ${yPercentage}%, black, transparent)`;

   /**
   * useEffect hook to handle background animation when the tab is selected.
   * Resets motion values and triggers animations for smooth visual transitions.
   */
  useEffect(()=>{

    // Skip the animation if the tab is not selected.
    if (!tabRef.current || !props.selected ) return;

    // Reset the motion values to their initial state.
    xPercentage.set(0);
    yPercentage.set(0);

    // Get the size of the tab element to calculate the animation path.
    const { height, width } = tabRef.current?.getBoundingClientRect();

    // Calculate the total length of the element's border, used for defining animation times.
    const circumference = height * 2 + width * 2;

    /*
    * Define animation timing points based on element proportions.
    * Start, After the (first, second, third) side, end 
    */
    const times = [ 
      0, 
      width/circumference, 
      (width+ height) / circumference, 
      (width * 2 + height)/circumference,  
      1
    ];

    const options:ValueAnimationTransition = {
      times,
      duration:4,
      ease:'linear',
      repeatType:'loop',
      repeat:Infinity,
    }

    // Start animations for x and y percentage based on calculated values.
    animate(xPercentage,[0, 100, 100, 0, 0],options);
    animate(yPercentage , [0, 0, 100, 100, 0],options);

  }, [props.selected]);// Only run the effect when the `selected` prop changes.

  /**
   * Handles hover events to restart the Lottie animation from the beginning.
   */
  const handleTabHover = () => {
    if(dotLottieRef.current === null) return;

    dotLottieRef.current.seek(0);
    dotLottieRef.current.play();
  }

  /**
   * JSX to render the feature tab with Lottie animation and title.
   * Adds a "new" badge if the tab is marked as new and highlights the tab if selected.
   */
  return(
      <div
        ref={tabRef}
        onClick={props.onClick}
        onMouseEnter = {handleTabHover}
        className=" relative cursor-pointer border border-white/15 rounded-xl flex lg:flex-1 items-center p-2.5 gap-2.5 ">
        {props.selected &&
          <motion.div style = {{
            maskImage:maskImageVar
          }}
          className="absolute -m-px rounded-xl inset-0 border border-[#A369FF] "></motion.div>
        }
        <div className="h-12 w-12 border rounded-lg border-white/15 inline-flex items-center justify-center">
          <DotLottiePlayer
            ref = {dotLottieRef} 
            src={props.icon} 
            className="h-5 w-5"
            autoplay
          />
        </div>
        <div>{props.title}</div>
        {props.isNew && 
          <div className="text-xs rounded-full px-2 py-0.5 bg-[#8c44ff] text-black font-semibold">
            new
          </div>
        }
      </div>
  )
}

/**
 * The main Features component that showcases different features using tabs.
 * Includes animated background transitions and a product image.
 */
export const Features = () => {

  const [selectedTab , setSelectedTab] = useState(0);

  // Motion values for animating the background image size and position.
  const backgroundSizeX = useMotionValue(tabs[0].backgroundSizeX);
  const backgroundPositionX = useMotionValue(tabs[0].backgroundPositionX);
  const backgroundPositionY = useMotionValue(tabs[0].backgroundPositionY);
  
  // Template strings for generating the background size and position styles.
  const backgroundSize = useMotionTemplate`${backgroundSizeX}% auto`;
  const backgroundPosition =  useMotionTemplate`${backgroundPositionX}% ${backgroundPositionY}%`;
  
   /**
   * Handles the selection of a new tab, triggering background animations for smooth transitions.
   * 
   * @param index - The index of the selected tab.
   */
  const handleSelectTab = (index: number) =>{
    setSelectedTab(index); 

  
    const animateOptions: ValueAnimationTransition = {
      duration:2,
      ease:'easeInOut',
    }
   
    animate(
      backgroundSizeX,
      [backgroundSizeX.get(), 100, tabs[index].backgroundSizeX], animateOptions,);
    animate(
      backgroundPositionX,
      [backgroundPositionX.get(), 100, tabs[index].backgroundPositionX],animateOptions,);
    animate(
      backgroundPositionY,
      [backgroundPositionY.get(), 100, tabs[index].backgroundPositionY],animateOptions,);

  };

   /**
   * JSX to render the main section of the features component.
   * Displays a headline, description, and tabs with associated animations and a product image.
   */
  return (
  <section className='py-20 md:py-24'>
    <div className="container">
      <h2 className="text-5xl md:text-6xl font-medium text-center tracking-tighter ">
        Elevate your SEO efforts.
      </h2>
      <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto tracking-tight text-center mt-5">
        From small startups to large enterprises, our AI-driven tool has revolutionized the way businesses approch SEO.
      </p>
        <div className="mt-10 flex flex-col lg:flex-row  gap-3">
          {/* Iterate over the `tabs` array to render each FeatureTab component */}
          {// We used lottie files
          tabs.map((tab, tabIndex)=>(
            <FeatureTab  
              {...tab} 
              onClick={()=>handleSelectTab(tabIndex)}
              selected = {selectedTab === tabIndex}
              key={tab.title} 
            />
          ))}
          {/* 
              - Pass each tab's properties using the spread operator {...tab}.
              - Attach an onClick handler that selects the tab based on its index.
              - Pass a `selected` prop to highlight the currently selected tab.
              - Use the tab title as a unique key.
           */}
        </div>
        <div className="border border-white/20 p-2.5 rounded-xl mt-3">
          <motion.div 
            className="aspect-video bg-cover border border-white/20 rounded-lg" 
            style={{
              backgroundSize,
              backgroundPosition,
              backgroundImage:`url(${productImage.src})`
            }}>
          </motion.div>
           {/* 
              - Use Framer Motion to animate the background properties.
              - The `aspect-video` class ensures a consistent aspect ratio.
              - The background is styled dynamically using the `backgroundSize` and `backgroundPosition` values.
            */}
        </div>
    </div>
  </section>
);};
