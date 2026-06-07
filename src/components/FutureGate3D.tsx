import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FutureGate3DProps {
  scrollProgress: number;
}

export default function FutureGate3D({ scrollProgress }: FutureGate3DProps) {
  const containerRef = useRef<THREE.Group>(null);
  
  // Left and Right sliding gates
  const leftGateRef = useRef<THREE.Group>(null);
  const rightGateRef = useRef<THREE.Group>(null);
  
  // Rotating inner wormhole rings
  const innerRingRef1 = useRef<THREE.Mesh>(null);
  const innerRingRef2 = useRef<THREE.Mesh>(null);
  const lightRayRef = useRef<THREE.Mesh>(null);

  // Scene visible filter (Active range: 4.8 to 6.0)
  useFrame((state, delta) => {
    if (!containerRef.current) return;

    let opacity = 0.0;
    if (scrollProgress >= 4.8 && scrollProgress <= 5.0) {
      opacity = (scrollProgress - 4.8) / 0.2; // Fade in
    } else if (scrollProgress > 5.0) {
      opacity = 1.0;
    }

    containerRef.current.visible = opacity > 0.01;

    // Opening animation of the gates:
    // When scroll progress moves from 5.0 to 6.0, translate gates wide open!
    let openFactor = 0.0; 
    if (scrollProgress > 5.0) {
      openFactor = Math.min((scrollProgress - 5.0) / 1.0, 1.0); // max 1.0
    }

    const smoothOpenFactor = THREE.MathUtils.lerp(
      0.0,
      1.0,
      openFactor
    );

    // Slide left gate to the left, slide right gate to the right
    if (leftGateRef.current) {
      leftGateRef.current.position.x = -1.2 - smoothOpenFactor * 3.5;
      leftGateRef.current.rotation.y = smoothOpenFactor * 0.4; // sway open
    }
    if (rightGateRef.current) {
      rightGateRef.current.position.x = 1.2 + smoothOpenFactor * 3.5;
      rightGateRef.current.rotation.y = -smoothOpenFactor * 0.4;
    }

    // High frequency spinning of the inner event horizon rings
    const time = state.clock.getElapsedTime();
    if (innerRingRef1.current) {
      innerRingRef1.current.rotation.z = time * 2.2;
      innerRingRef1.current.rotation.x = Math.sin(time) * 0.1;
    }

    if (innerRingRef2.current) {
      innerRingRef2.current.rotation.z = -time * 1.5;
      innerRingRef2.current.scale.setScalar(1 + Math.sin(time * 6) * 0.05);
    }

    // Volumetric pulsing light rays
    if (lightRayRef.current) {
      lightRayRef.current.rotation.y = time * 0.4;
      const pulsingIntensity = 0.4 + Math.sin(time * 15) * 0.15;
      const mat = lightRayRef.current.material as THREE.Material;
      mat.opacity = pulsingIntensity * opacity * smoothOpenFactor;
    }

    // Update opacity transitively
    containerRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // Skip animating the custom volumetric material's opacity which is bound to smoothOpenFactor above
        if (child.name === "event-ray") return;

        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          mat.transparent = true;
          mat.opacity = (child.name === "energy-vortex" ? 0.7 * smoothOpenFactor : 0.85) * opacity;
        });
      }
    });
  });

  return (
    <group ref={containerRef} position={[0, 0, -2]}>
      {/* Immersive Gate Uplight / Tunnel rays */}
      <spotLight position={[0, -5, -4]} angle={1.1} intensity={6} color="#00f0ff" />
      <pointLight position={[0, 0, -5]} intensity={4} color="#bd00ff" distance={20} />

      {/* ======================================= */}
      {/* 1. PORTAL FRAME OUTLINE RINGS */}
      {/* ======================================= */}
      <mesh position={[0, 0, -1]}>
        <torusGeometry args={[3.2, 0.12, 16, 64]} />
        <meshStandardMaterial color="#0e132e" roughness={0.2} metalness={0.9} />
      </mesh>
      
      {/* Outer neon scanner bounds */}
      <mesh position={[0, 0, -0.9]}>
        <torusGeometry args={[3.3, 0.03, 8, 64]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* ======================================= */}
      {/* 2. INNER EVENT HORIZON (ENERGY VORTEX) */}
      {/* ======================================= */}
      <group position={[0, 0, -1.2]}>
        {/* Glowing Energy Web Ring */}
        <mesh ref={innerRingRef1} name="energy-vortex">
          <ringGeometry args={[0.2, 3.1, 64]} />
          <meshBasicMaterial
            color="#002b44"
            side={THREE.DoubleSide}
            wireframe={true}
            transparent
            opacity={0.15}
          />
        </mesh>

        <mesh ref={innerRingRef2} name="energy-vortex">
          <ringGeometry args={[0.1, 2.8, 3]} />
          <meshBasicMaterial
            color="#bd00ff"
            side={THREE.DoubleSide}
            wireframe={true}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Volumetric Glowing Light Cylinder passing through the gate */}
        <mesh ref={lightRayRef} name="event-ray" rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.5]}>
          <cylinderGeometry args={[1.5, 0.1, 4.0, 32, 1, true]} />
          <meshBasicMaterial
            color="#00ffd1"
            transparent={true}
            opacity={0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            wireframe={true}
          />
        </mesh>
      </group>

      {/* ======================================= */}
      {/* 3. LEFT PORTAL GATE LEAF */}
      {/* ======================================= */}
      <group ref={leftGateRef} position={[-1.2, 0, 0]}>
        {/* Massive shield block */}
        <mesh>
          <boxGeometry args={[1.8, 5.0, 0.2]} />
          <meshStandardMaterial color="#1a1f3c" metalness={0.88} roughness={0.35} />
        </mesh>
        
        {/* Detailed geometric mechanical panels */}
        <mesh position={[0.2, 0, 0.12]} scale={[0.8, 0.9, 1]}>
          <boxGeometry args={[1.1, 4.6, 0.08]} />
          <meshStandardMaterial color="#0c0e1a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Glowing cyan status light rail */}
        <mesh position={[0.65, 0, 0.17]}>
          <boxGeometry args={[0.06, 4.2, 0.02]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>

        {/* Diagonal mechanical chevrons */}
        <mesh position={[-0.4, 1.2, 0.15]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.12, 0.9, 0.04]} />
          <meshStandardMaterial color="#bd00ff" metalness={0.9} />
        </mesh>
        <mesh position={[-0.4, -1.2, 0.15]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.12, 0.9, 0.04]} />
          <meshStandardMaterial color="#bd00ff" metalness={0.9} />
        </mesh>
      </group>

      {/* ======================================= */}
      {/* 4. RIGHT PORTAL GATE LEAF */}
      {/* ======================================= */}
      <group ref={rightGateRef} position={[1.2, 0, 0]}>
        {/* Massive shield block */}
        <mesh>
          <boxGeometry args={[1.8, 5.0, 0.2]} />
          <meshStandardMaterial color="#1a1f3c" metalness={0.88} roughness={0.35} />
        </mesh>
        
        {/* Detailed geometric mechanical panels */}
        <mesh position={[-0.2, 0, 0.12]} scale={[0.8, 0.9, 1]}>
          <boxGeometry args={[1.1, 4.6, 0.08]} />
          <meshStandardMaterial color="#0c0e1a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Glowing cyan status light rail */}
        <mesh position={[-0.65, 0, 0.17]}>
          <boxGeometry args={[0.06, 4.2, 0.02]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>

        {/* Diagonal mechanical chevrons */}
        <mesh position={[0.4, 1.2, 0.15]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.12, 0.9, 0.04]} />
          <meshStandardMaterial color="#bd00ff" metalness={0.9} />
        </mesh>
        <mesh position={[0.4, -1.2, 0.15]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.12, 0.9, 0.04]} />
          <meshStandardMaterial color="#bd00ff" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
