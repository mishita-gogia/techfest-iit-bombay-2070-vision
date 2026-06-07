import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlanetData } from "../types";

interface Web3DGalaxyProps {
  scrollProgress: number;
  selectedPlanetId: string | null;
  onSelectPlanet: (id: string | null) => void;
}

export const PLANETS_DATA: PlanetData[] = [
  {
    id: "robotics",
    name: "Robotics & Automation",
    sector: "Sector Alpha-I",
    description: "The horizon of cybernetic dexterity and self-evolving biomechanics. Engineering cognitive limbs and drone fleets designed for high-risk extraplanetary construction.",
    color: "#ff5e00",
    emissive: "#ff5e00",
    size: 0.8,
    orbitRadius: 4.0,
    orbitSpeed: 0.25,
    techHighlights: ["Neuromorphic Actuators", "Autonomous Swarm Intelligence", "Bipedal Balance Synthesizers"],
    metrics: { label: "Deployment", value: "2.4M Units" }
  },
  {
    id: "ai",
    name: "Cognitive AI Systems",
    sector: "Sector Lambda-V",
    description: "Deep artificial consciousness neural pathways, scaling quantum intelligence grids beyond human processing thresholds while ensuring neural network alignment.",
    color: "#a400ff",
    emissive: "#a400ff",
    size: 1.0,
    orbitRadius: 6.5,
    orbitSpeed: 0.18,
    techHighlights: ["Self-Correcting Hypermodels", "Quantum Neural Synapes", "Dynamic State Decoders"],
    metrics: { label: "Processing Speed", value: "85 PFLOPS" }
  },
  {
    id: "spacetech",
    name: "Astro Engineering & Propulsion",
    sector: "Sector Orion-IX",
    description: "Conquering deep space with antimatter engines and solar sail navigation, connecting Earth orbit directly to interplanetary resource terminals.",
    color: "#00c3ff",
    emissive: "#00c3ff",
    size: 1.1,
    orbitRadius: 9.0,
    orbitSpeed: 0.12,
    techHighlights: ["Antimatter Harvesters", "Thermonuclear Plasma Cores", "Laser Sail Arrays"],
    metrics: { label: "Warp Velocity", value: "0.22 c" }
  },
  {
    id: "sustainability",
    name: "Biosphere Restoration Tech",
    sector: "Sector Gaia-IV",
    description: "Pioneering atmospheric scrubbing systems, high-efficiency closed-loop organic vertical food domes, and geo-magnetic solar radiation deflection filters.",
    color: "#00ff73",
    emissive: "#00ff73",
    size: 0.95,
    orbitRadius: 11.5,
    orbitSpeed: 0.08,
    techHighlights: ["Magnetosphere Deflectors", "Carbon Condenser Scrubbers", "Geo-genetic Seeds"],
    metrics: { label: "CO2 Reduction Ratio", value: "98.4%" }
  },
  {
    id: "cybersecurity",
    name: "Quantum Security Guard",
    sector: "Sector Crypt-Z",
    description: "Active defenses preventing quantum supercomputer decryptions using real-time cryptographic matrix shields and decentralized sensory ledger databases.",
    color: "#00ffd1",
    emissive: "#00ffd1",
    size: 0.85,
    orbitRadius: 14.0,
    orbitSpeed: 0.05,
    techHighlights: ["Chronos Ledger Keys", "Neural Deflection Firewalls", "Entropic Lattice Seals"],
    metrics: { label: "Intrusion Block Ratio", value: "99.999%" }
  }
];

export default function Web3DGalaxy({
  scrollProgress,
  selectedPlanetId,
  onSelectPlanet,
}: Web3DGalaxyProps) {
  const galaxyRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);

  // Maintain position coordinates for orbiting planets so they can be read dynamically
  const orbitsRefs = useRef<{ [key: string]: THREE.Group }>({});

  useFrame((state, delta) => {
    if (!galaxyRef.current) return;

    // Visibility range for Scene 3: 1.8 to 3.2
    let opacity = 0.0;
    if (scrollProgress >= 1.8 && scrollProgress <= 2.0) {
      // Fade in
      opacity = (scrollProgress - 1.8) / 0.2;
    } else if (scrollProgress > 2.0 && scrollProgress < 3.0) {
      opacity = 1.0;
    } else if (scrollProgress >= 3.0 && scrollProgress <= 3.2) {
      // Fade out
      opacity = 1.0 - (scrollProgress - 3.0) / 0.2;
    }

    galaxyRef.current.visible = opacity > 0.01;

    // Gentle galaxy tilting and floating
    const time = state.clock.getElapsedTime();
    galaxyRef.current.rotation.x = 0.6 + Math.sin(time * 0.1) * 0.05;
    
    // Rotate center galaxy core
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.25;
      const pulse = 1.0 + Math.sin(time * 2.5) * 0.12;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    // Orbit the planets if no planet is selected, else smoothly pause them/inspections
    PLANETS_DATA.forEach((planet) => {
      const orbitGroup = orbitsRefs.current[planet.id];
      if (orbitGroup) {
        if (selectedPlanetId === planet.id) {
          // Slow down and guide to center-ish facing angle for camera spotlight
          const currentRotation = orbitGroup.rotation.y % (Math.PI * 2);
          // Let's guide the planet facing side straight to front (towards camera vector)
          // Simply decelerate the orbit rotation smoothly
          orbitGroup.rotation.y += (Math.PI - currentRotation) * 0.03;
        } else if (selectedPlanetId) {
          // If another planet other than this is selected, rotate extremely slow in background
          orbitGroup.rotation.y += delta * planet.orbitSpeed * 0.15;
        } else {
          // Normal orbit
          orbitGroup.rotation.y += delta * planet.orbitSpeed;
        }

        // Add small planetary self rotation inside the orbit group
        const planetMesh = orbitGroup.getObjectByName("planet-body") as THREE.Mesh;
        if (planetMesh) {
          planetMesh.rotation.y += delta * 0.8;
        }
      }
    });

    // Update opacity transitively
    galaxyRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          mat.transparent = true;
          mat.opacity = (child.name === "orbit-trail" ? 0.15 : 0.85) * opacity;
        });
      } else if (child instanceof THREE.LineSegments && child.material) {
        const mat = child.material as THREE.Material;
        mat.transparent = true;
        mat.opacity = 0.3 * opacity;
      }
    });

    // Interpolate camera to look at the selected planet if any
    if (selectedPlanetId) {
      const activeGroup = orbitsRefs.current[selectedPlanetId];
      if (activeGroup) {
        // Calculate cosmic coordinates of the active planet in world coordinates
        const activeMesh = activeGroup.getObjectByName("planet-body") as THREE.Mesh;
        if (activeMesh) {
          const worldPos = new THREE.Vector3();
          activeMesh.getWorldPosition(worldPos);
          
          // Lerp camera position and lookAt towards it
          const cam = state.camera;
          const targetCamPos = new THREE.Vector3(worldPos.x, worldPos.y + 1.2, worldPos.z + 5.0);
          cam.position.lerp(targetCamPos, 0.05);
          cam.lookAt(worldPos);
        }
      }
    }
  });

  const handlePointerOver = (id: string) => {
    setHoveredPlanetId(id);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHoveredPlanetId(null);
    document.body.style.cursor = "default";
  };

  return (
    <group ref={galaxyRef} position={[0, -1, 0]}>
      {/* 1. Galaxy Center Star (Pulsing Plasma) */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" wireframe={true} />
        <pointLight color="#bd00ff" intensity={4} distance={30} />
      </mesh>
      
      {/* Glowing core atmosphere */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[1.6, 16, 16]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} wireframe />
      </mesh>

      {/* Render Planets and their orbits */}
      {PLANETS_DATA.map((planet) => {
        const isSelected = selectedPlanetId === planet.id;
        const isHovered = hoveredPlanetId === planet.id;
        
        // Dynamic scale factor based on hover / select
        let scale = 1.0;
        if (isSelected) {
          scale = 1.45; // zoom up significantly on inspection
        } else if (isHovered) {
          scale = 1.18; // hover pulse
        }

        return (
          <group
            key={planet.id}
            ref={(el) => {
              if (el) orbitsRefs.current[planet.id] = el;
            }}
          >
            {/* Draw Orbit Path Trail outline */}
            <mesh rotation={[Math.PI / 2, 0, 0]} name="orbit-trail">
              <ringGeometry args={[planet.orbitRadius - 0.02, planet.orbitRadius + 0.02, 64]} />
              <meshBasicMaterial color={planet.color} side={THREE.DoubleSide} transparent opacity={0.12} />
            </mesh>

            {/* Orbiting Planet Group wrapper */}
            <group position={[planet.orbitRadius, 0, 0]} scale={[scale, scale, scale]}>
              {/* Planet Interactive sphere body */}
              <mesh
                name="planet-body"
                onPointerOver={() => handlePointerOver(planet.id)}
                onPointerOut={handlePointerOut}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlanet(isSelected ? null : planet.id);
                }}
              >
                <sphereGeometry args={[planet.size, 32, 16]} />
                <meshStandardMaterial
                  color={planet.color}
                  roughness={0.25}
                  metalness={0.7}
                  emissive={planet.emissive}
                  emissiveIntensity={isHovered || isSelected ? 1.4 : 0.4}
                />
              </mesh>

              {/* SPECIFIC PROCEDURAL ADDITIONS FOR PLANETS */}

              {/* 1. Robotics (Satellite Probes) */}
              {planet.id === "robotics" && (
                <group>
                  <mesh rotation={[0, 0, Math.PI / 6]}>
                    <ringGeometry args={[1.2, 1.25, 32]} />
                    <meshBasicMaterial color={planet.color} transparent opacity={0.3} side={THREE.DoubleSide} />
                  </mesh>
                  {/* Orbiting small probe */}
                  <mesh position={[1.4, 0, 0]} scale={[0.12, 0.12, 0.12]}>
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                </group>
              )}

              {/* 2. AI (Translucent Network Geodesic Ring Grid) */}
              {planet.id === "ai" && (
                <mesh scale={[1.4, 1.4, 1.4]}>
                  <icosahedronGeometry args={[planet.size, 1]} />
                  <meshBasicMaterial color={planet.color} wireframe={true} transparent opacity={0.25} />
                </mesh>
              )}

              {/* 3. Space Tech: Saturn Rings */}
              {planet.id === "spacetech" && (
                <mesh rotation={[Math.PI / 3, 0.2, 0]}>
                  <ringGeometry args={[1.5, 2.2, 64]} />
                  <meshBasicMaterial color={planet.color} side={THREE.DoubleSide} transparent opacity={0.4} />
                </mesh>
              )}

              {/* 4. Sustainability: Orbital Helix loops */}
              {planet.id === "sustainability" && (
                <group>
                  <mesh rotation={[Math.PI / 4, 0, 0]}>
                    <ringGeometry args={[1.3, 1.33, 32]} />
                    <meshBasicMaterial color="#00ff73" side={THREE.DoubleSide} transparent opacity={0.4} />
                  </mesh>
                  <mesh rotation={[-Math.PI / 4, 0, 0]}>
                    <ringGeometry args={[1.5, 1.53, 32]} />
                    <meshBasicMaterial color="#fffb00" side={THREE.DoubleSide} transparent opacity={0.3} />
                  </mesh>
                </group>
              )}

              {/* 5. Cybersecurity: Encapsulated Segments Shield rings */}
              {planet.id === "cybersecurity" && (
                <group>
                  <mesh rotation={[0, 0, 0]} scale={[1.3, 1.3, 1.3]}>
                    <sphereGeometry args={[planet.size, 8, 8]} />
                    <meshBasicMaterial color="#00ffd1" wireframe={true} transparent opacity={0.2} />
                  </mesh>
                  <mesh rotation={[Math.PI/2, 0, 0]}>
                    <ringGeometry args={[1.4, 1.5, 6]} />
                    <meshBasicMaterial color="#00ffd1" side={THREE.DoubleSide} transparent opacity={0.5} />
                  </mesh>
                </group>
              )}
            </group>
          </group>
        );
      })}
    </group>
  );
}
