import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SceneControllerProps {
  scrollProgress: number;
  selectedPlanetId: string | null;
}

export default function SceneController({ scrollProgress, selectedPlanetId }: SceneControllerProps) {
  useFrame((state) => {
    const cam = state.camera;

    // Check if we are currently inspecting a planet in Galaxy view.
    // If so, let Web3DGalaxy's detail-zoom logic handle the camera to prevent positional conflicts.
    if (scrollProgress >= 1.8 && scrollProgress <= 3.2 && selectedPlanetId) {
      return; 
    }

    // target camera positions and look-at focal points based on current scroll depth (0 to 6)
    const targetPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3(0, 0, 0);

    // Dynamic state positioning engine
    if (scrollProgress <= 1.0) {
      // SCENE 1: Launch Portal
      // Camera slowly zooms in from distance 8 to 5.2, tracking down a bit
      const t = scrollProgress;
      targetPos.set(0, 0, 8.0 - t * 2.8);
      targetLookAt.set(0, -t * 0.5, 0);
    } 
    else if (scrollProgress > 1.0 && scrollProgress <= 2.0) {
      // SCENE 2: Evolution of Technology
      // Standard static focal lane. Parallax shifts are managed within the object group
      const t = scrollProgress - 1.0;
      targetPos.set(0, 0.4, 5.2);
      targetLookAt.set(0, 0, -1);
    } 
    else if (scrollProgress > 2.0 && scrollProgress <= 3.0) {
      // SCENE 3: Techfest Galaxy
      // wide tilted angle looking down at planetary rings
      const t = scrollProgress - 2.0;
      targetPos.set(0, 2.0, 7.8);
      targetLookAt.set(0, -0.6, 0);
    } 
    else if (scrollProgress > 3.0 && scrollProgress <= 4.0) {
      // SCENE 4: Innovation Lab
      // Focused centered perspective for detailed inspection
      const t = scrollProgress - 3.0;
      targetPos.set(0, 0.5, 4.8);
      targetLookAt.set(0, -0.2, 0);
    } 
    else if (scrollProgress > 4.0 && scrollProgress <= 5.0) {
      // SCENE 5: Global Impact Earth
      // Earth telemetry overview perspective
      const t = scrollProgress - 4.0;
      targetPos.set(0, 0.3, 4.3);
      targetLookAt.set(0, 0, 0);
    } 
    else if (scrollProgress > 5.0) {
      // SCENE 6: The Future Gate Final
      // Plunges forward directly INTO the wormhole tunnel as user finishes scrolling!
      const t = Math.min(scrollProgress - 5.0, 1.0); // 0 to 1
      targetPos.set(0, 0, 4.5 - t * 3.6);
      targetLookAt.set(0, 0, -5);
    }

    // Smoothly interpolate (lerp) the camera coordinate and target focus for a premium sliding effect
    cam.position.lerp(targetPos, 0.08);

    // Apply look-at transformation smoothly using an interpolated target vector
    const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion).add(cam.position);
    currentLookAt.lerp(targetLookAt, 0.08);
    cam.lookAt(currentLookAt);
  });

  return (
    <>
      {/* High contrast lighting setups suitable for cinematic highlights */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} color="#00f0ff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#bd00ff" />
      <hemisphereLight groundColor="#070913" color="#00ffd1" intensity={0.5} />
    </>
  );
}
