import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LaunchPortalProps {
  scrollProgress: number;
}

export default function LaunchPortal({ scrollProgress }: LaunchPortalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  // Fade in/out based on scroll progress (Active range: 0.0 to 1.3)
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Calculate visibility
    let opacity = 1.0;
    if (scrollProgress <= 1.0) {
      opacity = 1.0;
    } else if (scrollProgress > 1.0 && scrollProgress <= 1.4) {
      // Fade out from 1.0 to 0.0
      opacity = 1.0 - (scrollProgress - 1.0) / 0.4;
    } else {
      opacity = 0.0;
    }

    // Apply scale and position based on scroll progress (zoom in while scrolling)
    const scale = scrollProgress <= 1.2 ? 1 + scrollProgress * 0.4 : 1.48;
    groupRef.current.scale.set(scale, scale, scale);

    // Fade out elements by modifying visibility and position
    groupRef.current.visible = opacity > 0.01;
    
    // Smoothly shift position out on scroll
    if (scrollProgress > 1.0) {
      groupRef.current.position.y = - (scrollProgress - 1.0) * 8;
    } else {
      groupRef.current.position.y = 0;
    }

    // Animate the core components
    const time = state.clock.getElapsedTime();
    
    if (coreRef.current) {
      // Pulse scale
      const pulse = 1.0 + Math.sin(time * 3) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
      coreRef.current.rotation.y += delta * 0.5;
      coreRef.current.rotation.x += delta * 0.2;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.6;
      ring1Ref.current.rotation.y += delta * 0.3;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.8;
      ring2Ref.current.rotation.z += delta * 0.4;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.2;
      ring3Ref.current.rotation.x -= delta * 0.4;
    }

    // Keep active material opacities updated
    const updateOpacity = (ref: React.RefObject<THREE.Mesh | null>) => {
      if (ref.current && ref.current.material) {
        const material = ref.current.material as THREE.Material;
        material.opacity = opacity;
        material.transparent = true;
      }
    };

    updateOpacity(coreRef);
    updateOpacity(ring1Ref);
    updateOpacity(ring2Ref);
    updateOpacity(ring3Ref);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Dynamic ambient point light focused on the core */}
      <pointLight color="#00f0ff" intensity={3} distance={15} />
      <pointLight color="#bd00ff" intensity={2} distance={15} />

      {/* 1. Core Energy Star (Icosahedron) */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshPhysicalMaterial
          color="#00ffd1"
          emissive="#00ffd1"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
          wireframe={true}
          transparent={true}
          opacity={1}
        />
      </mesh>

      {/* 2. Concentric Orbit Ring 1 (Vertical-ish) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.2, 0.06, 16, 100]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.8}
          transparent={true}
          opacity={1}
        />
      </mesh>

      {/* 3. Concentric Orbit Ring 2 (Horizontal-ish) */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.6, 0.04, 12, 100]} />
        <meshStandardMaterial
          color="#bd00ff"
          emissive="#bd00ff"
          emissiveIntensity={0.8}
          transparent={true}
          opacity={1}
        />
      </mesh>

      {/* 4. Outer HUD Concentric Scanner Ring */}
      <mesh ref={ring3Ref}>
        <ringGeometry args={[3.0, 3.05, 64]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent={true}
          opacity={0.3}
          side={THREE.DoubleSide}
          wireframe={true}
        />
      </mesh>

      {/* Ambient floating ring details */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.55, 32]} />
        <meshBasicMaterial
          color="#bd00ff"
          transparent={true}
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
