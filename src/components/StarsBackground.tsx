import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarsBackgroundProps {
  scrollProgress: number;
}

export default function StarsBackground({ scrollProgress }: StarsBackgroundProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1500;

  // Generate random positions and colors for the stars
  const [positions, speeds, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const cols = new Float32Array(count * 3);

    const colorsList = [
      new THREE.Color("#00f0ff"), // Cyber blue
      new THREE.Color("#bd00ff"), // Cyber purple
      new THREE.Color("#00ffd1"), // Neon cyan
      new THREE.Color("#ffffff"), // Pure white
    ];

    for (let i = 0; i < count; i++) {
      // Space sphere distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 25 + Math.random() * 45; // radius between 25 and 70

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi); // Z position

      spd[i] = 0.05 + Math.random() * 0.15; // individual speed

      // Pick random color
      const color = colorsList[Math.floor(Math.random() * colorsList.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, spd, cols];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Slow fallback rotation
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += delta * 0.005;

    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Hyperdrive warp factor: increases drastically in the last section (scrollProgress 5 to 6)
    let warpFactor = 1.0;
    if (scrollProgress > 4.5) {
      // Scale from 1 to 25
      const extraProgress = scrollProgress - 4.5; // max 1.5
      warpFactor = 1.0 + Math.pow(extraProgress, 3.5) * 50; 
    }

    const speedMultiplier = delta * warpFactor * 5;

    for (let i = 0; i < count; i++) {
      // Move stars on Z axis to simulate traveling forward
      positionsArray[i * 3 + 2] += speeds[i] * speedMultiplier;

      // Reset the star if it gets too close to the camera (Z exceeds 35) or too far behind
      if (positionsArray[i * 3 + 2] > 35) {
        positionsArray[i * 3 + 2] = -40; // recycle back in depth
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
