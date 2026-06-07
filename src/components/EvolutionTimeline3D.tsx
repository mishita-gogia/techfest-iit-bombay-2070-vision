import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface EvolutionTimeline3Props {
  scrollProgress: number;
}

export default function EvolutionTimeline3D({ scrollProgress }: EvolutionTimeline3Props) {
  const containerRef = useRef<THREE.Group>(null);
  
  // Create refs for individual objects to rotate them uniquely
  const computerRef = useRef<THREE.Group>(null);
  const phoneRef = useRef<THREE.Group>(null);
  const chipRef = useRef<THREE.Group>(null);
  const robotRef = useRef<THREE.Group>(null);
  const quantumRef = useRef<THREE.Group>(null);

  // Position coordinates in 3D space for each era item (tuple coordinate format)
  // Placing them along a beautiful horizontal curve in 3D
  const positions: [number, number, number][] = useMemo(() => [
    [-12, 0, -2],   // Computer (Progress 1.0 - 1.2)
    [-6,  0.5, 0],  // Phone (Progress 1.2 - 1.4)
    [0,   0,   -1], // AI Chip (Progress 1.4 - 1.6)
    [6,   0,   0],  // Humanoid (Progress 1.6 - 1.8)
    [12,  0.5, -2]  // Quantum Core (Progress 1.8 - 2.0)
  ], []);

  useFrame((state, delta) => {
    if (!containerRef.current) return;

    // Visibility range for Scene 2: 0.8 to 2.2
    let opacity = 0.0;
    if (scrollProgress >= 0.8 && scrollProgress <= 1.0) {
      // Fade in
      opacity = (scrollProgress - 0.8) / 0.2;
    } else if (scrollProgress > 1.0 && scrollProgress < 2.0) {
      opacity = 1.0;
    } else if (scrollProgress >= 2.0 && scrollProgress <= 2.2) {
      // Fade out
      opacity = 1.0 - (scrollProgress - 2.0) / 0.2;
    }

    containerRef.current.visible = opacity > 0.01;

    // Track smooth relative panning of the container based on scroll
    // Map scrollProgress (1.0 to 2.0) to slide across the positions range
    if (scrollProgress >= 1.0 && scrollProgress <= 2.0) {
      const progressT = (scrollProgress - 1.0); // 0.0 to 1.0
      // Target position X to center the active object: -Positions[active].x
      // Let's smoothly interpolate the container position X
      const targetX = -PositionsInterpolation(progressT, positions);
      containerRef.current.position.x += (targetX - containerRef.current.position.x) * 0.1;
      
      // Dynamic camera/container distance
      const targetZ = -2 + Math.sin(progressT * Math.PI) * 1.5;
      containerRef.current.position.z += (targetZ - containerRef.current.position.z) * 0.1;
    } else if (scrollProgress < 1.0) {
      // Park to the left
      containerRef.current.position.x = -positions[0][0];
    } else {
      // Park to the right
      containerRef.current.position.x = -positions[4][0];
    }

    // Gentle floating and independent rotations
    const time = state.clock.getElapsedTime();

    // 1. CRT Computer rotation
    if (computerRef.current) {
      computerRef.current.rotation.y = time * 0.25;
      computerRef.current.position.y = positions[0][1] + Math.sin(time + 0) * 0.15;
    }

    // 2. Phone rotation
    if (phoneRef.current) {
      phoneRef.current.rotation.y = -time * 0.3;
      phoneRef.current.rotation.x = Math.sin(time * 0.5) * 0.15;
      phoneRef.current.position.y = positions[1][1] + Math.sin(time + 1) * 0.15;
    }

    // 3. AI Chip rotation
    if (chipRef.current) {
      chipRef.current.rotation.y = time * 0.15;
      chipRef.current.rotation.x = 0.4 + Math.sin(time * 0.4) * 0.1;
      chipRef.current.position.y = positions[2][1] + Math.sin(time + 2) * 0.15;
    }

    // 4. Robot head rotation
    if (robotRef.current) {
      robotRef.current.rotation.y = Math.sin(time * 0.4) * 0.4;
      robotRef.current.rotation.x = Math.cos(time * 0.3) * 0.1;
      robotRef.current.position.y = positions[3][1] + Math.sin(time + 3) * 0.15;
    }

    // 5. Quantum reactor rotation
    if (quantumRef.current) {
      quantumRef.current.rotation.y = time * 0.5;
      quantumRef.current.rotation.z = Math.sin(time * 0.6) * 0.2;
      quantumRef.current.position.y = positions[4][1] + Math.sin(time + 4) * 0.15;
    }

    // Apply active global opacity to all children materials
    containerRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => {
            m.transparent = true;
            m.opacity = opacity;
          });
        } else {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      }
    });
  });

  // Simple interpolation helper
  function PositionsInterpolation(t: number, posList: typeof positions) {
    // scale t from [0, 1] to indices [0, 4]
    const scaledT = t * (posList.length - 1);
    const index = Math.floor(scaledT);
    const fraction = scaledT - index;
    if (index >= posList.length - 1) return posList[posList.length - 1][0];
    return posList[index][0] + (posList[index + 1][0] - posList[index][0]) * fraction;
  }

  return (
    <group ref={containerRef}>
      {/* Background soft grids for coordinates */}
      <gridHelper args={[40, 40]} position={[0, -3, 0]} />

      {/* Spotlights focused along the hallway */}
      <spotLight position={[0, 10, 5]} angle={0.6} penumbra={1} intensity={1.5} color="#00f0ff" />
      <spotLight position={[-6, 8, 3]} angle={0.6} penumbra={1} intensity={1} color="#bd00ff" />
      <spotLight position={[6, 8, 3]} angle={0.6} penumbra={1} intensity={1} color="#00ffd1" />

      {/* ELEMENT 1: OLD COMPUTER (1970) */}
      <group ref={computerRef} position={positions[0]} scale={[1.1, 1.1, 1.1]}>
        {/* Main CRT Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.8, 1.5, 1.6]} />
          <meshStandardMaterial color="#2d303a" roughness={0.7} metalness={0.2} />
        </mesh>
        {/* Curved Bevel Glass Screen */}
        <mesh position={[0, 0, 0.81]}>
          <boxGeometry args={[1.5, 1.2, 0.05]} />
          <meshStandardMaterial
            color="#093d25"
            emissive="#12a864"
            emissiveIntensity={0.6}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* CRT Scanline Indicator Grid inside screen */}
        <mesh position={[0, 0, 0.84]} scale={[1.4, 1.1, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#00ffd1" wireframe={true} transparent opacity={0.18} />
        </mesh>
        {/* Keyboard base */}
        <mesh position={[0, -0.8, 0.9]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[1.8, 0.15, 0.8]} />
          <meshStandardMaterial color="#1f2129" roughness={0.6} />
        </mesh>
        {/* Floppy Drive Slot */}
        <mesh position={[0.5, -0.4, 0.82]}>
          <boxGeometry args={[0.4, 0.04, 0.02]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* ELEMENT 2: SMARTPHONE (2000) */}
      <group ref={phoneRef} position={positions[1]} scale={[1.2, 1.2, 1.2]}>
        {/* Sleek Chassis */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.1, 2.1, 0.12]} />
          <meshPhysicalMaterial
            color="#0b0c10"
            metalness={0.9}
            roughness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
        {/* Glowing Dynamic Phone Screen */}
        <mesh position={[0, 0, 0.065]}>
          <planeGeometry args={[1.0, 2.0]} />
          <meshStandardMaterial
            color="#051226"
            emissive="#00f0ff"
            emissiveIntensity={0.5}
            roughness={0.15}
          />
        </mesh>
        {/* Floating Holographic Interface Plane in front */}
        <group position={[0, 0, 0.4]}>
          <mesh>
            <planeGeometry args={[1.3, 1.3]} />
            <meshBasicMaterial
              color="#00ffd1"
              transparent={true}
              opacity={0.15}
              wireframe={true}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.3, 0.01]}>
            <ringGeometry args={[0.15, 0.18, 32]} />
            <meshBasicMaterial color="#00ffd1" transparent opacity={0.4} />
          </mesh>
        </group>
      </group>

      {/* ELEMENT 3: AI CHIP (2025) */}
      <group ref={chipRef} position={positions[2]} scale={[1.25, 1.25, 1.25]}>
        {/* Silicon Wafer Substrate */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.8, 1.8, 0.12]} />
          <meshStandardMaterial color="#12131a" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Center Metal Die (CPU brain) */}
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.9, 0.9, 0.05]} />
          <meshPhysicalMaterial color="#3a3e4d" roughness={0.2} metalness={0.95} />
        </mesh>
        {/* Gold core micro lines (Radiating pins) */}
        <group position={[0, 0, 0.07]}>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.75, Math.sin(angle) * 0.75, 0.02]}
                rotation={[0, 0, angle]}
              >
                <boxGeometry args={[0.3, 0.04, 0.01]} />
                <meshStandardMaterial color="#e5c158" metalness={0.9} roughness={0.1} />
              </mesh>
            );
          })}
        </group>
        {/* Concentric glowing circular tracers */}
        <mesh position={[0, 0, 0.11]}>
          <ringGeometry args={[0.7, 0.73, 32]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.11]}>
          <ringGeometry args={[0.3, 0.33, 4]} />
          <meshBasicMaterial color="#bd00ff" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* ELEMENT 4: HUMANOID CYBERNETIC HEAD (2045) */}
      <group ref={robotRef} position={positions[3]} scale={[1.05, 1.05, 1.05]}>
        {/* Skull Dome base */}
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.85, 32, 16]} />
          <meshPhysicalMaterial
            color="#2a2c3a"
            metalness={0.85}
            roughness={0.15}
            clearcoat={1}
          />
        </mesh>
        {/* Visor shield */}
        <mesh position={[0, 0.25, 0.52]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.3, 32, 1, false, 0, Math.PI]} />
          <meshPhysicalMaterial
            color="#020d1c"
            roughness={0.05}
            metalness={0.95}
            transmission={0.4}
            thickness={1}
            emissive="#00f0ff"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Glowing Laser Eyes behind visor */}
        <group position={[0, 0.25, 0.55]}>
          <mesh position={[-0.2, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ff0077" />
          </mesh>
          <mesh position={[0.2, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ff0077" />
          </mesh>
        </group>
        {/* Jaw segment */}
        <mesh position={[0, -0.4, 0.2]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.7, 0.5, 0.6]} />
          <meshStandardMaterial color="#1a1c24" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Ear hub connector nodes */}
        <mesh position={[-0.9, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
          <meshStandardMaterial color="#bd00ff" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0.9, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
          <meshStandardMaterial color="#bd00ff" roughness={0.3} metalness={0.9} />
        </mesh>
      </group>

      {/* ELEMENT 5: QUANTUM ENTANGLEMENT CORE (2070) */}
      <group ref={quantumRef} position={positions[4]} scale={[1.1, 1.1, 1.1]}>
        {/* Rotating central octahedron core */}
        <mesh>
          <octahedronGeometry args={[0.9, 0]} />
          <meshPhysicalMaterial
            color="#00ffd1"
            emissive="#00f0ff"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.05}
            clearcoat={1.0}
            transmission={0.3}
          />
        </mesh>
        <mesh scale={[0.5, 0.5, 0.5]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.9, 0]} />
          <meshBasicMaterial color="#bd00ff" wireframe={true} />
        </mesh>
        {/* Intertwining Orbit Tracks */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.5, 0.03, 8, 48]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} />
        </mesh>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[1.7, 0.02, 8, 48]} />
          <meshStandardMaterial color="#bd00ff" emissive="#bd00ff" emissiveIntensity={0.5} />
        </mesh>
        {/* Holographic scanner grid bounds */}
        <mesh>
          <boxGeometry args={[2.2, 2.2, 2.2]} />
          <meshBasicMaterial color="#00ffd1" wireframe={true} transparent opacity={0.08} />
        </mesh>
      </group>
    </group>
  );
}
