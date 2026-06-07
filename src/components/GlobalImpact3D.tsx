import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GlobalImpactNode } from "../types";

interface GlobalImpact3DProps {
  scrollProgress: number;
}

// Coordinate locations on a sphere of radius 1.8
// Formula:
// x = r * cos(lat) * cos(lon)
// y = r * sin(lat)
// z = r * cos(lat) * sin(lon)
const HUB_NODES: GlobalImpactNode[] = [
  { name: "Mumbai (IIT Bombay)", lat: 0.33, lng: 1.27, type: "student", connections: ["San Francisco", "London", "Tokyo", "Sydney"], value: "120k+" },
  { name: "San Francisco", lat: 0.66, lng: -2.13, type: "startup", connections: [], value: "45k+" },
  { name: "London", lat: 0.9, lng: -0.1, type: "researcher", connections: [], value: "35k+" },
  { name: "Tokyo", lat: 0.62, lng: 2.44, type: "innovator", connections: [], value: "50k+" },
  { name: "Sydney", lat: -0.59, lng: 2.63, type: "student", connections: [], value: "20k+" }
];

export default function GlobalImpact3D({ scrollProgress }: GlobalImpact3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const R = 1.8; // Globe Radius

  // Generate the high-tech procedural continent map texture
  const globeTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Dark cyber ocean
      ctx.fillStyle = "#0c0d1c";
      ctx.fillRect(0, 0, 512, 256);

      // Draw high-tech schematic grid in ocean
      ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 512; i += 16) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
      }
      for (let i = 0; i < 256; i += 16) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
      }

      // Draw continents procedurally with simple filled silhouettes
      ctx.fillStyle = "#1e223f";
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 1.5;

      const drawContinent = (coords: [number, number][]) => {
        ctx.beginPath();
        coords.forEach(([x, y], idx) => {
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      // Americas
      drawContinent([
        [60, 40], [100, 50], [130, 80], [140, 100], [110, 120], [120, 140], 
        [150, 160], [170, 200], [150, 230], [130, 240], [130, 210], [110, 170],
        [80, 140], [60, 130], [50, 100], [40, 60]
      ]);

      // Eurasia & Africa
      drawContinent([
        [240, 40], [290, 30], [330, 40], [380, 50], [420, 60], [420, 90],
        [370, 120], [350, 140], [310, 130], [290, 150], [300, 180], [293, 210],
        [270, 210], [260, 180], [240, 140], [210, 110], [200, 80], [210, 60]
      ]);

      // Australia
      drawContinent([
        [410, 180], [450, 170], [470, 190], [450, 210], [420, 210], [400, 190]
      ]);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Convert Spherical coordinates to 3D Cartesian coordinates
  const getCoordinates = (lat: number, lng: number) => {
    const latRad = lat;
    const lngRad = lng;
    return new THREE.Vector3(
      R * Math.cos(latRad) * Math.cos(lngRad),
      R * Math.sin(latRad),
      R * Math.cos(latRad) * Math.sin(lngRad)
    );
  };

  // Generate connection bezier lines (Mumbai to others)
  const connectionArcs = useMemo(() => {
    const arcs: { curve: THREE.QuadraticBezierCurve3; color: string }[] = [];
    const mumbaiNode = HUB_NODES[0];
    const pMumbai = getCoordinates(mumbaiNode.lat, mumbaiNode.lng);

    HUB_NODES.slice(1).forEach((node) => {
      const pNode = getCoordinates(node.lat, node.lng);
      
      // Midpoint pulled outwards to create a nice looping arch
      const pMid = new THREE.Vector3()
        .addVectors(pMumbai, pNode)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(R * 1.5); // arch height factor

      const curve = new THREE.QuadraticBezierCurve3(pMumbai, pMid, pNode);
      arcs.push({ curve, color: node.type === "startup" ? "#bd00ff" : "#00f0ff" });
    });

    return arcs;
  }, []);

  // Scene Visibility and camera pacing (Active range: 3.8 to 5.2)
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    let opacity = 0.0;
    if (scrollProgress >= 3.8 && scrollProgress <= 4.0) {
      opacity = (scrollProgress - 3.8) / 0.2; // Fade in
    } else if (scrollProgress > 4.0 && scrollProgress < 5.0) {
      opacity = 1.0;
    } else if (scrollProgress >= 5.0 && scrollProgress <= 5.2) {
      opacity = 1.0 - (scrollProgress - 5.0) / 0.2; // Fade out
    }

    groupRef.current.visible = opacity > 0.01;

    // Rotate the globe gently
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = -state.clock.getElapsedTime() * 0.08;
    }

    // Set interactive opacities
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          mat.transparent = true;
          mat.opacity = (child.name === "atmosphere" ? 0.12 : 0.85) * opacity;
        });
      } else if (child instanceof THREE.Line && child.material) {
        const mat = child.material as THREE.Material;
        mat.transparent = true;
        mat.opacity = 0.4 * opacity;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Interactive global illumination */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#00ffd1" />
      <pointLight position={[0, 0, 0]} intensity={25} color="#bd00ff" distance={10} />

      {/* 2. Base Glow Globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[R, 32, 32]} />
        <meshStandardMaterial
          map={globeTexture}
          roughness={0.4}
          metalness={0.8}
          emissive="#00f0ff"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 3. Outer Magnetic Shield Atmosphere Atmosphere */}
      <mesh ref={atmosphereRef} name="atmosphere" scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[R, 16, 16]} />
        <meshBasicMaterial color="#00f0ff" wireframe={true} transparent opacity={0.1} />
      </mesh>

      {/* 4. Telemetry Arcs (Bézier curves) */}
      <group>
        {connectionArcs.map(({ curve, color }, index) => {
          const points = curve.getPoints(30);
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

          return (
            <group key={index}>
              {/* Stationary curve track - rendered via primitive to prevent SVG element conflicts */}
              <primitive object={new THREE.Line(
                lineGeometry,
                new THREE.LineBasicMaterial({
                  color: new THREE.Color(color),
                  transparent: true,
                  opacity: 0.3
                })
              )} />

              {/* Glowing tracer pulse particles along the connection lines */}
              <LineTracerPulse curve={curve} color={color} />
            </group>
          );
        })}
      </group>

      {/* 5. Telemetry Pulse Pin Markers */}
      <group>
        {HUB_NODES.map((node, idx) => {
          const pos = getCoordinates(node.lat, node.lng);
          const labelColor = node.type === "student" ? "#00f0ff" : "#bd00ff";
          return (
            <group key={idx} position={pos}>
              {/* Outer pulsing ring */}
              <PulsingMarker color={labelColor} />
            </group>
          );
        })}
      </group>
    </group>
  );
}

// Inner Component to animate moving points along the Bézier curve
interface LineTracerPulseProps {
  curve: THREE.QuadraticBezierCurve3;
  color: string;
}
function LineTracerPulse({ curve, color }: LineTracerPulseProps) {
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!pulseRef.current) return;
    
    // Loop transit position from 0 to 1 based on clock
    const speed = 0.65;
    const t = (state.clock.getElapsedTime() * speed + Math.random() * 0.1) % 1.0;
    
    const point = curve.getPointAt(t);
    pulseRef.current.position.copy(point);
  });

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={4.0} />
    </mesh>
  );
}

// Inline Component to pulse target coordinate points
interface PulsingMarkerProps {
  color: string;
}
function PulsingMarker({ color }: PulsingMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const scale = 1.0 + Math.sin(state.clock.getElapsedTime() * 5.0) * 0.4;
    meshRef.current.scale.set(scale, scale, scale);
    const mat = meshRef.current.material as THREE.Material;
    mat.opacity = 1.0 - (scale - 0.6) / 0.8;
  });

  return (
    <group>
      {/* Anchor Dot */}
      <mesh>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Pulsing Aura */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
