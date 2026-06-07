import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Cpu,
  Globe,
  Bot,
  Zap,
  Shield,
  Layers,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  User,
  Mail,
  QrCode,
  RotateCcw,
} from "lucide-react";
import { PLANETS_DATA } from "./Web3DGalaxy";
import { playHoverClick, playSectionSweep } from "./AudioController";

interface ScrollOverlayProps {
  scrollProgress: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selectedPlanetId: string | null;
  onSelectPlanet: (id: string | null) => void;
  activeLabObject: "robotArm" | "holoScreen" | "aiCore";
  setActiveLabObject: (id: "robotArm" | "holoScreen" | "aiCore") => void;
}

export default function ScrollOverlay({
  scrollProgress,
  containerRef,
  selectedPlanetId,
  onSelectPlanet,
  activeLabObject,
  setActiveLabObject,
}: ScrollOverlayProps) {
  
  // Registration Form States
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [registered, setRegistered] = useState(false);
  const [ticketID, setTicketID] = useState("");
  const [seatNum, setSeatNum] = useState("");

  const selectedPlanet = PLANETS_DATA.find((p) => p.id === selectedPlanetId);

  // Determine active era timeline index based on scrollProgress in Scene 2 (1.0 to 2.0 range)
  const activeTimelineIndex = Math.min(
    Math.max(Math.floor((scrollProgress - 1.0) * 5), 0),
    4
  );

  const TIMELINE_DATA = [
    { year: "1970", title: "Era of Mainframes", desc: "First room-sized computing grids designed purely for binary calculations and raster logistics.", techTerm: "Relay logic & copper nets" },
    { year: "2000", title: "Handheld Cellular", desc: "Global miniaturization. Handheld cellular links connect billions of nodes through electromagnetic networks.", techTerm: "Pocket silicon grids" },
    { year: "2025", title: "Edge Artificial Intelligence", desc: "Distributed smart chip architectures integrated directly into physical appliances and neural chips.", techTerm: "Edge nodes & neural webs" },
    { year: "2045", title: "Autonomous Cybernetics", desc: "Bio-machine fusion architectures and humanoid robotics capable of high-frequency cognitive labour.", techTerm: "Actuators & bioplating" },
    { year: "2070", title: "Quantum Singularity", desc: "Dynamic mathematical reactors resolving deep space mechanics and chemical syntheses on the fly.", techTerm: "Superconducting cores" }
  ];

  // Map click controllers to programmatically scroll HTML container
  const navigateToSection = (sectionIndex: number) => {
    playSectionSweep();
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: sectionIndex * containerRef.current.clientHeight,
        behavior: "smooth",
      });
    }
  };

  // Generate a random ticket upon registration complete
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;
    playSectionSweep();
    setTicketID("TF-" + Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase());
    setSeatNum("SECTOR-" + Math.floor(100 + Math.random() * 899).toString() + "A");
    setRegistered(true);
  };

  // Play micro click sounds on button hover
  const triggerHoverBeep = () => {
    playHoverClick();
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">
      
      {/* Decorative HUD corners from Bold Typography theme */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-white/10 hidden md:block"></div>
        <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-white/10 hidden md:block"></div>
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-white/10 hidden md:block"></div>
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-white/10 hidden md:block"></div>
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_2px_2px,#ffffff_1px,transparent_0)] bg-[size:40px_40px]"></div>
      </div>

      {/* HEADER BAR (FIXED LOGO & BOLD TYPOGRAPHY NAVIGATION) */}
      <header className="absolute top-0 inset-x-0 z-30 px-6 md:px-12 py-6 flex justify-between items-center bg-[#02040a]/25 backdrop-blur-md border-b border-white/10 pointer-events-auto">
        <div id="company-brand" className="flex items-center gap-4 cursor-pointer" onClick={() => navigateToSection(0)}>
          <div className="w-9 h-9 border-2 border-cyber-cyan rotate-45 flex items-center justify-center transition-transform hover:rotate-135 duration-500">
            <div className="w-4 h-4 bg-cyber-cyan"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl tracking-tighter uppercase italic leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-cyber-cyan to-white">
              Techfest 2070
            </span>
            <span className="font-mono text-[9px] text-cyber-cyan/60 tracking-widest uppercase font-semibold mt-0.5">IIT Bombay • 30th Anniversary</span>
          </div>
        </div>

        {/* Global Nav Indicator */}
        <div className="hidden md:flex gap-10 text-xs font-bold tracking-[0.2em] uppercase opacity-80">
          {["PORTAL", "TIMELINE", "GALAXY", "CORE LAB", "IMPACT", "THE GATE"].map((label, idx) => {
            const indexValue = idx;
            const isActive = Math.round(scrollProgress) === indexValue;
            return (
              <button
                key={label}
                onMouseEnter={triggerHoverBeep}
                onClick={() => navigateToSection(indexValue)}
                className={`transition-all duration-300 relative cursor-pointer font-sans ${
                  isActive
                    ? "text-cyber-cyan font-black opacity-100"
                    : "text-white opacity-60 hover:opacity-100"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </header>

      {/* FLOATING COORDINATES TELEMETRY RAIL (LEFT MARGIN) */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-35 flex-col gap-10 text-[10px] font-mono pointer-events-none">
        <div className="flex flex-col gap-2 text-left">
          <span className="text-[10px] text-cyber-cyan font-mono tracking-widest uppercase">Coordinates</span>
          <span className="text-white font-mono text-xs">19.1334° N, 72.9133° E</span>
          <span className="text-gray-500 font-mono text-[9px] mt-1.5 block">X: {(123.45 * (scrollProgress + 1)).toFixed(2)}N</span>
          <span className="text-gray-500 font-mono text-[9px] block">Y: {(-45.89 * (scrollProgress + 1.2)).toFixed(2)}E</span>
        </div>
        
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
        
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3, 4, 5].map((s) => {
            const isActive = Math.round(scrollProgress) === s;
            return (
              <div
                key={s}
                className={`w-1 transition-all duration-300 ${
                  isActive ? "h-8 bg-cyber-cyan" : "h-4 bg-white/20"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ======================================= */}
      {/* SECTION OVERLAYS */}
      {/* ======================================= */}

      {/* SECTION 1: LAUNCH PORTAL (ScrollProgress: 0.0) */}
      <section className="absolute top-0 inset-x-0 h-screen flex flex-col justify-center items-center px-6 relative">
        <div className="max-w-4xl text-center flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: scrollProgress < 0.6 ? 1 : 0, y: scrollProgress < 0.6 ? 0 : -20 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mt-12"
          >
            <div className="flex items-center gap-2 border border-cyber-cyan/35 px-4 py-1.5 rounded-full bg-cyber-cyan/5 mb-8">
              <Compass className="w-3.5 h-3.5 text-cyber-cyan animate-spin" />
              <span className="font-mono text-[9px] font-bold text-cyber-cyan uppercase tracking-[0.2em]">INITIATING CHRONO LINK</span>
            </div>

            <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl leading-[0.85] tracking-tight italic uppercase text-white select-none">
              30 Years of<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-purple">Innovation.</span>
            </h1>

            <p className="mt-8 text-sm sm:text-lg font-light tracking-[0.4em] uppercase opacity-70">
              Infinite Years Ahead
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
              <button
                id="cta-explore-timeline"
                onMouseEnter={triggerHoverBeep}
                onClick={() => navigateToSection(1)}
                className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-cyber-cyan transition-all duration-300 skew-x-[-12deg] pointer-events-auto cursor-pointer shadow-lg"
              >
                <span className="inline-block skew-x-[12deg] flex items-center gap-2">
                  <span>Explore Future</span>
                  <ChevronRight className="w-4 h-4 stroke-[3px]" />
                </span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_#00ffd1]"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyber-cyan">System Ready</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Interactive Map (Galaxy/Evolution Shortcut) - from Bold Typography layout, active when scrollProgress is near start */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: scrollProgress < 0.6 ? 1 : 0, y: scrollProgress < 0.6 ? 0 : 30 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-0 left-0 w-full px-6 md:px-12 py-10 flex flex-col md:flex-row justify-between items-stretch md:items-end gap-6 z-50 pointer-events-none md:pointer-events-auto"
        >
          {/* Grid of Scene Shortcuts */}
          <div className="grid grid-cols-5 gap-3 sm:gap-4 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 pointer-events-auto">
            {[
              { id: 0, label: "Launch", code: "SCENE 01" },
              { id: 1, label: "Timeline", code: "SCENE 02" },
              { id: 2, label: "Galaxy", code: "SCENE 03" },
              { id: 4, label: "Impact", code: "SCENE 04" },
              { id: 5, label: "The Gate", code: "SCENE 05" },
            ].map((scene) => {
              const isActive = Math.round(scrollProgress) === scene.id;
              return (
                <div
                  key={scene.id}
                  onClick={() => navigateToSection(scene.id)}
                  onMouseEnter={triggerHoverBeep}
                  className="group cursor-pointer text-left transition-all hover:scale-105"
                >
                  <div className={`h-1 w-10 sm:w-12 mb-2 transition-colors ${isActive ? "bg-cyber-cyan animate-pulse" : "bg-white/25 group-hover:bg-white/40"}`}></div>
                  <div className="text-[8px] sm:text-[10px] font-mono opacity-50">{scene.code}</div>
                  <div className={`text-[10px] sm:text-xs font-bold uppercase transition-colors ${isActive ? "text-cyber-cyan font-black" : "text-white/60 group-hover:text-white"}`}>{scene.label}</div>
                </div>
              );
            })}
          </div>

          {/* IIT Bombay Brand badge card */}
          <div className="p-5 border border-white/10 backdrop-blur-xl bg-white/5 rounded-tl-3xl flex gap-10 items-center justify-between text-left pointer-events-auto">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-tighter opacity-50 mb-1">Evolution Progress</span>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-3.5 bg-cyber-cyan"></div>
                <div className="w-1.5 h-3.5 bg-cyber-cyan"></div>
                <div className="w-1.5 h-3.5 bg-cyber-cyan"></div>
                <div className="w-1.5 h-3.5 bg-white/20"></div>
                <div className="w-1.5 h-3.5 bg-white/20"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black italic tracking-tighter text-white">IIT BOMBAY</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-cyber-cyan">Asia's Largest Techfest</div>
            </div>
          </div>
        </motion.div>

        {/* Scrolling Indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-32 flex flex-col items-center gap-2 animate-bounce pointer-events-none">
          <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/70">Scroll to Advance</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* SECTION 2: EVOLUTION TIMELINE (ScrollProgress: 1.0) */}
      <section className="absolute top-[100vh] inset-x-0 h-screen flex justify-between items-center px-6 md:px-12 relative">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto">
          
          {/* Left indicator list */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-2 border border-cyber-purple/35 px-4 py-1.5 rounded-full bg-cyber-purple/5 w-fit">
              <Cpu className="w-3.5 h-3.5 text-cyber-purple" />
              <span className="font-mono text-[9px] font-bold text-cyber-purple uppercase tracking-[0.2em]">EVOLUTION_TRAJECTORY</span>
            </div>
 
            <div className="flex flex-col gap-4 relative before:absolute before:left-3 before:top-4 before:bottom-4 before:w-[1px] before:bg-white/10">
              {TIMELINE_DATA.map((item, idx) => {
                const isActive = activeTimelineIndex === idx;
                return (
                  <button
                    key={item.year}
                    onMouseEnter={triggerHoverBeep}
                    className={`flex items-center gap-4 text-left pointer-events-auto transition-all pl-1.5 ${
                      isActive ? "scale-105 pl-4" : "opacity-40 hover:opacity-75"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full z-10 border transition-all flex items-center justify-center ${
                        isActive ? "bg-cyber-purple border-cyber-purple shadow-[0_0_8px_#bd00ff] scale-110" : "bg-cyber-dark border-white/20"
                      }`}
                    >
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-mono text-xs font-black ${isActive ? "text-cyber-purple" : "text-gray-400"}`}>
                        {item.year}
                      </span>
                      <span className={`font-display text-sm font-black tracking-tight uppercase italic ${isActive ? "text-white" : "text-gray-500"}`}>
                        {item.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
 
          {/* Right dynamic cards */}
          <div className="lg:col-span-5 lg:col-start-8">
            <AnimatePresence mode="wait">
              {TIMELINE_DATA.map((item, idx) => {
                if (idx !== activeTimelineIndex) return null;
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="p-6 md:p-8 rounded-xl glass-card border border-cyber-purple/35 text-left relative overflow-hidden"
                  >
                    {/* Background decor text */}
                    <span className="absolute -top-3 -right-3 font-display font-black text-8xl text-white/5 select-none font-black leading-none italic">
                      {item.year}
                    </span>
 
                    <span className="font-mono text-[9px] font-bold text-cyber-cyan uppercase tracking-widest block mb-2 font-semibold">
                      Tech Core Module #{idx + 1}
                    </span>
                    <h2 className="font-display font-black text-3xl text-white tracking-tight mb-3 uppercase italic">
                      {item.title}
                    </h2>
                    <p className="font-sans text-xs text-gray-300 leading-relaxed tracking-wide mb-6">
                      {item.desc}
                    </p>
 
                    <div className="border-t border-white/10 pt-4 flex justify-between items-center text-[10px] font-mono">
                      <span className="text-gray-500 uppercase">TELEMETRY ENVELOPE:</span>
                      <span className="text-cyber-cyan font-semibold uppercase">{item.techTerm}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>
 
      {/* SECTION 3: TECHFEST GALAXY (ScrollProgress: 2.0) */}
      <section className="absolute top-[200vh] inset-x-0 h-screen flex justify-between items-center px-6 md:px-12 relative">
        <div className="w-full flex flex-col justify-between h-full max-w-7xl mx-auto py-24 relative">
          
          {/* Top Title Bar */}
          <div className="w-full text-left flex flex-col gap-2">
            <div className="flex items-center gap-2 border border-cyber-blue/35 px-4 py-1.5 rounded-full bg-cyber-blue/5 w-fit">
              <Layers className="w-3.5 h-3.5 text-cyber-blue" />
              <span className="font-mono text-[9px] font-bold text-cyber-blue uppercase tracking-[0.2em]">TECHFEST_CORE_SOLAR_SYSTEM</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase italic tracking-tight">
              Galaxy of Innovation
            </h2>
            <p className="font-sans text-xs text-gray-400 max-w-lg tracking-wide mt-1.5">
              Click on any floating planetary sector block in the 3D space to run code diagnostics and examine full development highlights.
            </p>
          </div>
 
          {/* Holographic HUD side card (Slide in on planet select) */}
          <AnimatePresence>
            {selectedPlanet && (
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, type: "spring", damping: 20 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-full max-w-md p-6 sm:p-8 rounded-xl glass-card border border-cyber-blue/35 pointer-events-auto text-left z-20"
              >
                <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-cyber-cyan uppercase tracking-widest font-semibold">{selectedPlanet.sector}</span>
                    <h3 className="font-display font-black text-2xl text-white tracking-tight uppercase mt-1 italic">
                      {selectedPlanet.name}
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 font-mono text-[9px] font-bold tracking-wider rounded border border-[#00f0ff]/30 text-[#00f0ff] uppercase bg-[#00f0ff]/5">
                    DIAGNOSTIC ACTIVE
                  </span>
                </div>
 
                <p className="font-sans text-xs text-gray-300 leading-relaxed mb-6">
                  {selectedPlanet.description}
                </p>
 
                <div className="flex flex-col gap-2.5 mb-6">
                  <span className="font-mono text-[9px] text-cyber-purple uppercase tracking-wider font-semibold">HIGH_TECH_MODULES</span>
                  {selectedPlanet.techHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs font-mono text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
 
                {/* Quantitative Metric */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div className="flex flex-col text-left">
                    <span className="font-mono text-[9px] text-gray-500 uppercase">{selectedPlanet.metrics.label}</span>
                    <span className="font-mono text-lg font-bold text-cyber-cyan uppercase tracking-wider">{selectedPlanet.metrics.value}</span>
                  </div>
                  <button
                    onMouseEnter={triggerHoverBeep}
                    onClick={() => {
                      playSectionSweep();
                      onSelectPlanet(null);
                    }}
                    className="flex justify-center items-center gap-2 border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-all duration-300 text-[10px] font-mono font-bold uppercase py-2 px-3 cursor-pointer skew-x-[-12deg]"
                  >
                    <span className="inline-block skew-x-[12deg] flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 stroke-[2px]" />
                      <span>Return Orbit</span>
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
 
          {/* Simple list alternative in mobile view */}
          {!selectedPlanetId && (
            <div className="block lg:hidden flex flex-wrap gap-2 pointer-events-auto">
              {PLANETS_DATA.map((planet) => (
                <button
                  key={planet.id}
                  onMouseEnter={triggerHoverBeep}
                  onClick={() => onSelectPlanet(planet.id)}
                  className="px-3.5 py-1.5 border border-white/10 bg-cyber-dark/40 text-xs font-mono text-gray-300 hover:text-white hover:border-cyber-blue/40 font-semibold cursor-pointer"
                >
                  Explore {planet.name.split(" ")[0]}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
 
      {/* SECTION 4: INNOVATION LAB (ScrollProgress: 3.0) */}
      <section className="absolute top-[300vh] inset-x-0 h-screen flex justify-between items-center px-6 md:px-12 relative animate-page">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto py-24 relative h-full">
          
          {/* Left panel instructions/coordinates */}
          <div className="lg:col-span-4 flex flex-col justify-center h-full text-left gap-5">
            <div className="flex items-center gap-2 border border-[#00ffd1]/35 px-4 py-1.5 rounded-full bg-[#00ffd1]/5 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#00ffd1]" />
              <span className="font-mono text-[9px] font-bold text-[#00ffd1] uppercase tracking-[0.2em]">3D_RESEARCH_LABORATORY</span>
            </div>
 
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-[0.9] italic">
              Interactive <br />
              Innovation Lab
            </h2>
 
            <p className="font-sans text-xs text-gray-400 tracking-wide leading-relaxed">
              Unlock modular development specs across futuristic engineering structures. You can rotate current lab assets directly inside 3D coordinate table loops using click drag tracks.
            </p>
 
            <div className="p-3 bg-cyber-dark-accent/30 rounded border border-white/5 font-mono text-[9px] text-cyber-cyan flex flex-col gap-1 tracking-wider uppercase font-semibold">
              <span>SCAN TELEMETRY ENVELOPE: ACTIVE</span>
              <span>DRAG CANVAS TO ROTATE DIAGNOSTICS</span>
            </div>
          </div>
 
          {/* Right tab systems */}
          <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-center h-full gap-5">
            <div className="flex flex-col p-1.5 gap-2 rounded-lg bg-[#02040a]/40 border border-white/10 pointer-events-auto">
              <button
                onMouseEnter={triggerHoverBeep}
                onClick={() => { playSectionSweep(); setActiveLabObject("robotArm"); }}
                className={`px-5 py-3.5 text-left font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-300 cursor-pointer skew-x-[-8deg] ${
                  activeLabObject === "robotArm"
                    ? "text-black bg-white font-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 skew-x-[8deg]">
                  <Bot className="w-4 h-4" />
                  <span>Interactive Cyber Climber</span>
                </div>
                <ChevronRight className="w-4 h-4 skew-x-[8deg]" />
              </button>
 
              <button
                onMouseEnter={triggerHoverBeep}
                onClick={() => { playSectionSweep(); setActiveLabObject("holoScreen"); }}
                className={`px-5 py-3.5 text-left font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-300 cursor-pointer skew-x-[-8deg] ${
                  activeLabObject === "holoScreen"
                    ? "text-black bg-white font-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 skew-x-[8deg]">
                  <Layers className="w-4 h-4" />
                  <span>Holographic Scan Plate</span>
                </div>
                <ChevronRight className="w-4 h-4 skew-x-[8deg]" />
              </button>
 
              <button
                onMouseEnter={triggerHoverBeep}
                onClick={() => { playSectionSweep(); setActiveLabObject("aiCore"); }}
                className={`px-5 py-3.5 text-left font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-300 cursor-pointer skew-x-[-8deg] ${
                  activeLabObject === "aiCore"
                    ? "text-black bg-white font-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 skew-x-[8deg]">
                  <Cpu className="w-4 h-4" />
                  <span>Neural Core Processor</span>
                </div>
                <ChevronRight className="w-4 h-4 skew-x-[8deg]" />
              </button>
            </div>
 
            {/* Spec readout based on selected */}
            <div className="p-5 rounded-lg glass-card text-left border border-white/10">
              <span className="font-mono text-[9px] text-[#bd00ff] block mb-1.5 font-bold uppercase tracking-widest">SYSTEM READOUT DIAGNOSTICS</span>
              {activeLabObject === "robotArm" && (
                <>
                  <h4 className="font-display font-black text-lg text-white mb-2 uppercase italic tracking-tight">Cybernetic Segment Gripper</h4>
                  <p className="font-sans text-xs text-gray-400 mb-3 leading-relaxed">Highly dextrous kinetic arms processing heavy-load macro logistics under hazardous extraplanetary atmospheres.</p>
                  <div className="border-t border-white/10 pt-2.5 flex justify-between font-mono text-[10px] text-cyber-cyan font-bold">
                    <span>ACCURACY: 0.001MM</span>
                    <span>JOINT RAD: 5DOF</span>
                  </div>
                </>
              )}
              {activeLabObject === "holoScreen" && (
                <>
                  <h4 className="font-display font-black text-lg text-white mb-2 uppercase italic tracking-tight">Holographic Diagnostic Display</h4>
                  <p className="font-sans text-xs text-gray-400 mb-3 leading-relaxed">Dynamic floating display panels using projected laser light lines to map physical structures accurately.</p>
                  <div className="border-t border-white/10 pt-2.5 flex justify-between font-mono text-[10px] text-cyber-cyan font-bold">
                    <span>RESOLUTION: 16K MATRIX</span>
                    <span>EMISSIVE: 1400NITS</span>
                  </div>
                </>
              )}
              {activeLabObject === "aiCore" && (
                <>
                  <h4 className="font-display font-black text-lg text-white mb-2 uppercase italic tracking-tight">Neural Logic Octahedron Core</h4>
                  <p className="font-sans text-xs text-gray-400 mb-3 leading-relaxed">Complex multi-layer icosahedron compute engines aligning vector space coordinates at near light velocities.</p>
                  <div className="border-t border-white/10 pt-2.5 flex justify-between font-mono text-[10px] text-cyber-cyan font-bold">
                    <span>ALIGNED PATH: 99.98%</span>
                    <span>CHANNELS: 104K/N</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
 
      {/* SECTION 5: GLOBAL IMPACT (ScrollProgress: 4.0) */}
      <section className="absolute top-[400vh] inset-x-0 h-screen flex justify-between items-center px-6 md:px-12 relative animate-page">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto py-24 relative h-full">
          
          {/* Left quantitative analytics stats */}
          <div className="lg:col-span-5 flex flex-col justify-center h-full text-left gap-5 pointer-events-auto">
            <div className="flex items-center gap-2 border border-cyber-cyan/35 px-4 py-1.5 rounded-full bg-cyber-cyan/5 w-fit">
              <Globe className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
              <span className="font-mono text-[9px] font-bold text-cyber-cyan uppercase tracking-[0.2em]">GLOBAL_TELEMETRY</span>
            </div>
 
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-[0.9] italic">
              Global Impact <br />& Connect
            </h2>
 
            <p className="font-sans text-xs text-gray-400 tracking-wide leading-relaxed">
              IIT Bombay's Techfest connects students, elite research founders, futuristic laboratory builders, and deep innovators together in coordinated synergy tracks.
            </p>
 
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-4 sm:p-5 rounded-lg glass-card border border-white/10 flex flex-col justify-between">
                <span className="font-display text-3xl sm:text-4xl font-black text-cyber-cyan italic tracking-tighter leading-none">250K+</span>
                <span className="font-mono text-[9px] text-[#00ffd1] uppercase block mt-1 tracking-wider font-bold">Active Innovators</span>
              </div>
              <div className="p-4 sm:p-5 rounded-lg glass-card border border-white/10 flex flex-col justify-between">
                <span className="font-display text-3xl sm:text-4xl font-black text-white italic tracking-tighter leading-none">1,450+</span>
                <span className="font-mono text-[9px] text-gray-500 uppercase block mt-1 tracking-wider font-bold">Academic Hubs</span>
              </div>
              <div className="p-4 sm:p-5 rounded-lg glass-card border border-white/10 flex flex-col justify-between">
                <span className="font-display text-3xl sm:text-4xl font-black text-white italic tracking-tighter leading-none">80+</span>
                <span className="font-mono text-[9px] text-cyber-cyan uppercase block mt-1 tracking-wider font-bold">Elite Labs</span>
              </div>
              <div className="p-4 sm:p-5 rounded-lg glass-card border border-white/10 flex flex-col justify-between">
                <span className="font-display text-3xl sm:text-4xl font-black text-cyber-cyan italic tracking-tighter leading-none">200+</span>
                <span className="font-mono text-[9px] text-gray-500 uppercase block mt-1 tracking-wider font-bold">Startups Accelerate</span>
              </div>
            </div>
          </div>
 
          {/* Right telemetry cities list */}
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-center h-full gap-4">
            <div className="p-5 sm:p-6 rounded-xl glass-card space-y-3 pointer-events-auto border border-white/10 bg-black/20">
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest block font-bold mb-1">
                TELEMETRY NETWORK PIN NODES
              </span>
              
              <div className="flex flex-col gap-2">
                {[
                  { name: "IIT Bombay (Mumbai)", tag: "Central Hub", val: "120,000+ Students", status: "Host Node" },
                  { name: "Silicon Valley (San Francisco)", tag: "Startup Hub", val: "45,000+ Founders", status: "Active Node" },
                  { name: "London Tech Center", tag: "Research Node", val: "35,000+ Scholars", status: "Active Node" },
                  { name: "Tokyo Synth Link", tag: "Innovation Hub", val: "50,000+ Eng", status: "Active Node" }
                ].map((hub) => (
                  <div key={hub.name} className="p-2.5 rounded border border-white/5 bg-cyber-dark/40 flex justify-between items-center text-xs">
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-white font-sans">{hub.name}</span>
                      <span className="font-mono text-[9px] text-cyber-cyan font-semibold block mt-0.5">{hub.tag} • {hub.val}</span>
                    </div>
                    <span className="font-mono text-[9px] text-right font-medium text-cyber-cyan">{hub.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* SECTION 6: THE FUTURE GATE (ScrollProgress: 5.0) */}
      <section className="absolute top-[500vh] inset-x-0 h-screen flex justify-between items-center px-6 md:px-12 relative animate-page">
        <div className="w-full flex flex-col justify-center items-center h-full max-w-3xl mx-auto text-center relative py-12">
          
          <div className="flex items-center gap-2 border border-cyber-purple/35 px-4 py-1.5 rounded-full bg-cyber-purple/5 mb-6 pointer-events-auto">
            <Zap className="w-3.5 h-3.5 text-cyber-purple" />
            <span className="font-mono text-[9px] font-bold text-cyber-purple uppercase tracking-[0.2em]">HYPERDRIVE_TERMINATION_LINK</span>
          </div>
 
          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white uppercase italic leading-[0.85] tracking-tight select-none">
            The Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-purple">Starts Here.</span>
          </h2>
          
          <p className="font-sans text-xs text-gray-400 max-w-md mt-6 leading-relaxed tracking-wide">
            Secure your elite access credentials for IIT Bombay's Techfest 2070. Reserve your cyber seating pass instantly inside the blockchain terminal below.
          </p>
 
          <div className="w-full max-w-md mt-8 pointer-events-auto z-20">
            <AnimatePresence mode="wait">
              {!registered ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleRegister}
                  className="p-6 sm:p-8 rounded-xl glass-card border border-white/10 bg-black/30 text-left space-y-5"
                >
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-gray-400 font-bold">FullName</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-purple" />
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g., Jane Doe"
                        className="w-full bg-[#02040a] text-white border border-white/10 rounded-none px-11 py-3 font-sans text-xs focus:outline-none focus:border-cyber-cyan"
                      />
                    </div>
                  </div>
 
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-gray-400 font-bold">Secure Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-cyan" />
                      <input
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="username@email.com"
                        className="w-full bg-[#02040a] text-white border border-white/10 rounded-none px-11 py-3 font-sans text-xs focus:outline-none focus:border-cyber-cyan"
                      />
                    </div>
                  </div>
 
                  <button
                    type="submit"
                    onMouseEnter={triggerHoverBeep}
                    className="w-full py-4 bg-white hover:bg-cyber-cyan text-black font-display text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 skew-x-[-12deg] cursor-pointer shadow-lg"
                  >
                    <span className="inline-block skew-x-[12deg] flex items-center justify-center gap-2">
                      <span>JOIN TECHFEST 2070</span>
                      <ArrowUpRight className="w-4 h-4 stroke-[3px]" />
                    </span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="ticket"
                  initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  className="p-6 rounded-xl glass-card border border-cyber-cyan/40 text-left relative overflow-hidden h-fit flex flex-col justify-between bg-black/40"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-[#00ffd1]/5 rounded-bl-full z-0 flex items-center justify-end p-4">
                    <QrCode className="w-10 h-10 text-cyber-cyan opacity-80" />
                  </div>
 
                  <div className="z-10 text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-4">
                      <div>
                        <span className="font-mono text-[9px] text-[#00ffd1] uppercase tracking-wider font-semibold block">IIT BOMBAY METALLIC KEY</span>
                        <h3 className="font-display font-black text-sm text-white tracking-widest mt-0.5">TECHFEST ENTRY TICKET</h3>
                      </div>
                    </div>
 
                    <div className="space-y-3.5 mb-5 select-text">
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-gray-500">Cred_Bearer:</span>
                        <span className="text-white font-sans text-sm font-semibold mt-0.5">{userName}</span>
                        <span className="text-gray-400 font-sans text-[10px]">{userEmail}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col text-left">
                          <span className="font-mono text-[8px] uppercase tracking-wider text-gray-500">System_AccessID:</span>
                          <span className="font-mono text-sm font-bold text-cyber-cyan mt-0.5">{ticketID}</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-mono text-[8px] uppercase tracking-wider text-gray-500">SecurityDome:</span>
                          <span className="font-mono text-sm font-bold text-cyber-purple mt-0.5">{seatNum}</span>
                        </div>
                      </div>
                    </div>
 
                    <div className="border-t border-dashed border-white/20 pt-4 flex justify-between items-center">
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[7px] text-gray-500 uppercase">Verify code hash</span>
                        <span className="font-mono text-[8px] text-cyber-cyan select-all">SHA-256_{ticketID.slice(3)}_OK</span>
                      </div>
                      <span className="px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider rounded border border-[#00ffd1]/20 text-[#00ffd1] uppercase bg-[#00ffd1]/5">
                        REGISTRATION COMPLETE
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      
    </div>
  );
}
