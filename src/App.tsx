import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import StarsBackground from "./components/StarsBackground";
import SceneController from "./components/SceneController";
import LaunchPortal from "./components/LaunchPortal";
import EvolutionTimeline3D from "./components/EvolutionTimeline3D";
import Web3DGalaxy from "./components/Web3DGalaxy";
import InnovationLab3D from "./components/InnovationLab3D";
import GlobalImpact3D from "./components/GlobalImpact3D";
import FutureGate3D from "./components/FutureGate3D";
import ScrollOverlay from "./components/ScrollOverlay";
import AudioController, { playSectionSweep } from "./components/AudioController";

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sub-scene interaction states
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [activeLabObject, setActiveLabObject] = useState<"robotArm" | "holoScreen" | "aiCore">("robotArm");

  // Track page scroll to update 3D scene timeline progress smoothly
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = target.scrollTop / target.clientHeight;
    
    // Smooth boundary check
    setScrollProgress(Math.min(Math.max(progress, 0), 6.0));
  };

  // Trigger a procedural audio sweep sound whenever sections transition (approx boundaries)
  const prevSectionRef = useRef<number>(0);
  useEffect(() => {
    const currentSection = Math.round(scrollProgress);
    if (currentSection !== prevSectionRef.current) {
      playSectionSweep();
      prevSectionRef.current = currentSection;
    }
  }, [scrollProgress]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-cyber-dark text-slate-100 font-sans select-none hologram-scan">
      
      {/* 1. FIXED BACKGROUND 3D CANVAS */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 60 }}
          gl={{ antialias: true, alpha: false }}
          className="w-full h-full"
        >
          {/* Global Space Space Background */}
          <color attach="background" args={["#030409"]} />

          {/* Procedural hyperdrive stars system */}
          <StarsBackground scrollProgress={scrollProgress} />

          {/* Dynamic camera / lighting conductor based on scroll */}
          <SceneController
            scrollProgress={scrollProgress}
            selectedPlanetId={selectedPlanetId}
          />

          {/* Scene 1: Floating rotating Core */}
          <LaunchPortal scrollProgress={scrollProgress} />

          {/* Scene 2: Tech evolution linear timeline */}
          <EvolutionTimeline3D scrollProgress={scrollProgress} />

          {/* Scene 3: Tech Sectors Orbits & detail inspection */}
          <Web3DGalaxy
            scrollProgress={scrollProgress}
            selectedPlanetId={selectedPlanetId}
            onSelectPlanet={setSelectedPlanetId}
          />

          {/* Scene 4: Interactive 3D robotic researcher lab */}
          <InnovationLab3D
            scrollProgress={scrollProgress}
            activeLabObject={activeLabObject}
          />

          {/* Scene 5: Glowing Earth with bezier flight tracers */}
          <GlobalImpact3D scrollProgress={scrollProgress} />

          {/* Scene 6: Massive opening chevrons portal final */}
          <FutureGate3D scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* 2. DYNAMIC REAL-TIME SOUND IMMERSION PANEL */}
      <AudioController />

      {/* 3. CORE NATURAL SCROLL CONTAINER OVERLAY */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="absolute inset-0 w-full h-full overflow-y-auto z-10 pointer-events-auto scrollbar-none"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {/* Render 6 separate snap elements to anchor standard vertical momentum scroll */}
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="w-full h-screen relative flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          />
        ))}

        {/* Sync full-text HTML presentations (diagnostics, overlays, buttons) on scrolling positions */}
        <ScrollOverlay
          scrollProgress={scrollProgress}
          containerRef={scrollContainerRef}
          selectedPlanetId={selectedPlanetId}
          onSelectPlanet={setSelectedPlanetId}
          activeLabObject={activeLabObject}
          setActiveLabObject={setActiveLabObject}
        />
      </div>

      {/* Cybernetic HUD overlay: Ambient top-to-bottom scanline animation */}
      <div className="absolute inset-x-0 top-0 h-1 z-30 scanline-animation pointer-events-none opacity-40" />
    </div>
  );
}
