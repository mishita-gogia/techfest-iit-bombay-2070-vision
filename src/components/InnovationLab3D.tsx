import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface InnovationLab3DProps {
  scrollProgress: number;
  activeLabObject: "robotArm" | "holoScreen" | "aiCore";
}

export default function InnovationLab3D({ scrollProgress, activeLabObject }: InnovationLab3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Custom Drag Rotation states
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  // Model references for micro-animations
  const robotBaseRef = useRef<THREE.Group>(null);
  const robotElbowRef = useRef<THREE.Mesh>(null);
  const robotClawRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Group>(null);
  const aiCoreRef = useRef<THREE.Mesh>(null);

  // Scene Visibility and animations (Active range: 2.8 to 4.2)
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    let opacity = 0.0;
    if (scrollProgress >= 2.8 && scrollProgress <= 3.0) {
      opacity = (scrollProgress - 2.8) / 0.2; // Fade in
    } else if (scrollProgress > 3.0 && scrollProgress < 4.0) {
      opacity = 1.0;
    } else if (scrollProgress >= 4.0 && scrollProgress <= 4.2) {
      opacity = 1.0 - (scrollProgress - 4.0) / 0.2; // Fade out
    }

    groupRef.current.visible = opacity > 0.01;

    // Apply global drag rotation smoothly
    if (!isDragging) {
      // Return slowly to normal rotation
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * 0.05;
    } else {
      groupRef.current.rotation.y = rotation.y;
      groupRef.current.rotation.x = rotation.x;
    }

    const time = state.clock.getElapsedTime();

    // 1. Robot Arm Micro-movement
    if (activeLabObject === "robotArm" && robotElbowRef.current && robotClawRef.current) {
      // Gentle flexing coordinate movement
      robotElbowRef.current.rotation.z = Math.sin(time * 1.5) * 0.2 - 0.2;
      robotClawRef.current.rotation.x = Math.cos(time * 2.0) * 0.3;
    }

    // 2. Holographic screen flicker
    if (activeLabObject === "holoScreen" && screenRef.current) {
      screenRef.current.position.y = Math.sin(time * 1.2) * 0.12;
    }

    // 3. AI Core pulsating morphing
    if (activeLabObject === "aiCore" && aiCoreRef.current) {
      aiCoreRef.current.rotation.y += delta * 0.6;
      aiCoreRef.current.rotation.z -= delta * 0.3;
      const coreScale = 1.0 + Math.sin(time * 2.8) * 0.08;
      aiCoreRef.current.scale.set(coreScale, coreScale, coreScale);
    }

    // Set interactive opacity
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => {
            m.transparent = true;
            m.opacity = (child.name === "screen-panel" ? 0.35 : 0.85) * opacity;
          });
        } else {
          child.material.transparent = true;
          child.material.opacity = (child.name === "screen-panel" ? 0.35 : 0.85) * opacity;
        }
      }
    });
  });

  // Handle Drag Interactions
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStart.current = { x: e.clientX ?? e.touches?.[0]?.clientX ?? 0, y: e.clientY ?? e.touches?.[0]?.clientY ?? 0 };
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;

    setRotation((prev) => ({
      x: Math.min(Math.max(prev.x + deltaY * (Math.PI / size.height) * 1.2, -Math.PI / 3), Math.PI / 3),
      y: prev.y + deltaX * (Math.PI / size.width) * 1.2
    }));

    dragStart.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      scale={[1.3, 1.3, 1.3]}
    >
      {/* Dynamic ambient lab spotlight */}
      <spotLight position={[0, 10, 0]} angle={0.8} penumbra={1} intensity={2} color="#00f0ff" />
      <pointLight position={[2, -1, 2]} intensity={1.5} color="#bd00ff" />

      {/* Lab inspect table grid base */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[2.5, 2.7, 0.2, 32]} />
        <meshStandardMaterial color="#0f111e" roughness={0.5} metalness={0.9} />
      </mesh>
      
      {/* Hologram rings base locator */}
      <mesh position={[0, -1.89, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 2.0, 32]} />
        <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>

      {/* ======================================= */}
      {/* MODEL A: ROBOTIC ARM ASSEMBLY */}
      {/* ======================================= */}
      {activeLabObject === "robotArm" && (
        <group ref={robotBaseRef} position={[0, -1.5, 0]}>
          {/* Base Joint */}
          <mesh>
            <cylinderGeometry args={[0.6, 0.8, 0.4, 16]} />
            <meshStandardMaterial color="#2d303d" roughness={0.4} metalness={0.8} />
          </mesh>

          {/* Upper Arm Joint */}
          <group position={[0, 0.3, 0]}>
            <mesh>
              <sphereGeometry args={[0.32, 16, 16]} />
              <meshStandardMaterial color="#bd00ff" metalness={0.9} />
            </mesh>
            
            {/* Lower Segment Bone */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.14, 0.18, 1.2, 16]} />
              <meshStandardMaterial color="#1a1b24" roughness={0.3} metalness={0.88} />
            </mesh>

            {/* Elbow Hinge Joint */}
            <group position={[0, 1.2, 0]}>
              <mesh ref={robotElbowRef} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.22, 0.22, 0.4, 16]} />
                <meshStandardMaterial color="#00f0ff" roughness={0.3} metalness={0.9} />
              </mesh>

              {/* Forearm Segment Bone */}
              <group position={[0, 0, 0]} rotation={[0, 0, -0.6]}>
                <mesh position={[0, 0.6, 0]}>
                  <cylinderGeometry args={[0.1, 0.14, 1.0, 16]} />
                  <meshStandardMaterial color="#1a1b24" roughness={0.3} metalness={0.8} />
                </mesh>

                {/* Gripper Claw Head holding pulsing micro-core */}
                <group ref={robotClawRef} position={[0, 1.1, 0]}>
                  <mesh>
                    <boxGeometry args={[0.3, 0.15, 0.3]} />
                    <meshStandardMaterial color="#2d303d" />
                  </mesh>

                  {/* Right Claw prong */}
                  <mesh position={[0.2, 0.2, 0]}>
                    <boxGeometry args={[0.06, 0.4, 0.1]} />
                    <meshStandardMaterial color="#ffffff" metalness={0.9} />
                  </mesh>
                  {/* Left Claw prong */}
                  <mesh position={[-0.2, 0.2, 0]}>
                    <boxGeometry args={[0.06, 0.4, 0.1]} />
                    <meshStandardMaterial color="#ffffff" metalness={0.9} />
                  </mesh>

                  {/* Captured Particle Target (Pulsing Energy Pearl) */}
                  <mesh position={[0, 0.25, 0]}>
                    <sphereGeometry args={[0.14, 16, 16]} />
                    <meshBasicMaterial color="#00ffd1" />
                    <pointLight color="#00ffd1" intensity={1} distance={5} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      )}

      {/* ======================================= */}
      {/* MODEL B: HOLOGRAPHIC FLOATING SCREEN */}
      {/* ======================================= */}
      {activeLabObject === "holoScreen" && (
        <group ref={screenRef} position={[0, -0.2, 0]}>
          {/* Main Curved Glass Screen Plane */}
          <mesh name="screen-panel">
            <boxGeometry args={[2.8, 1.7, 0.08]} />
            <meshPhysicalMaterial
              color="#006c8a"
              metalness={0.1}
              roughness={0.05}
              transmission={0.85}
              thickness={1.2}
              transparent={true}
              opacity={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Glowing laser tracker scans overlayed on screen margins */}
          <mesh scale={[1.02, 1.02, 1]} position={[0, 0, 0.05]}>
            <planeGeometry args={[2.7, 1.6]} />
            <meshBasicMaterial color="#00f0ff" wireframe={true} transparent opacity={0.25} />
          </mesh>

          {/* Central graphic scanner matrix */}
          <mesh position={[0, 0, 0.06]}>
            <ringGeometry args={[0.4, 0.52, 32]} />
            <meshBasicMaterial color="#bd00ff" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.06]} rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[0.2, 0.3, 4]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>

          {/* Floating scanner HUD components */}
          <mesh position={[-1.0, 0.5, 0.06]}>
            <planeGeometry args={[0.5, 0.2]} />
            <meshBasicMaterial color="#00ffd1" transparent opacity={0.5} />
          </mesh>
          <mesh position={[1.0, -0.5, 0.06]}>
            <planeGeometry args={[0.4, 0.3]} />
            <meshBasicMaterial color="#00ffd1" transparent opacity={0.3} wireframe={true} />
          </mesh>

          {/* Projector nodes from bottom table */}
          <group position={[0, -1.6, 0]}>
            <mesh position={[-1.2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.4, 8]} />
              <meshStandardMaterial color="#1f2230" />
            </mesh>
            <mesh position={[1.2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.4, 8]} />
              <meshStandardMaterial color="#1f2230" />
            </mesh>
          </group>
        </group>
      )}

      {/* ======================================= */}
      {/* MODEL C: HIGH-DIMENSIONAL AI CORE */}
      {/* ======================================= */}
      {activeLabObject === "aiCore" && (
        <group position={[0, -0.1, 0]}>
          {/* Inner Core Particle Core Sphere */}
          <mesh ref={aiCoreRef}>
            <icosahedronGeometry args={[0.85, 1]} />
            <meshPhysicalMaterial
              color="#bd00ff"
              emissive="#00f0ff"
              emissiveIntensity={0.6}
              wireframe={true}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>

          {/* Concentric rotating shell coordinates */}
          <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]} scale={[1.25, 1.25, 1.25]}>
            <dodecahedronGeometry args={[0.8, 0]} />
            <meshBasicMaterial color="#00ffd1" wireframe={true} transparent opacity={0.3} />
          </mesh>

          {/* Circular vector coordinate energy rings */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.5, 0.02, 8, 32]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[1.7, 0.015, 8, 32]} />
            <meshBasicMaterial color="#bd00ff" transparent opacity={0.3} />
          </mesh>

          {/* Dynamic star emitters orbiting core */}
          {Array.from({ length: 4 }).map((_, i) => {
            const angle = (i * Math.PI) / 2;
            const orbitRadius = 1.35;
            return (
              <mesh key={i} position={[Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius]} scale={[0.1, 0.1, 0.1]}>
                <sphereGeometry args={[1, 8, 8]} />
                <meshBasicMaterial color="#00ffff" />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
