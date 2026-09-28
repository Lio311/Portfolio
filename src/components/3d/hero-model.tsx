"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Sphere, Stars, Environment, ContactShadows, Trail, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Agent component representing a single AI agent moving inside the network
function Agent({ radius, speed, offset, color, size }: { radius: number, speed: number, offset: number, color: string, size: number }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (ref.current) {
      // Orbit inside the bounds of the 2.5 wireframe, outside the 1.8 blob
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t * 1.2) * (radius * 0.4); 
    }
  });

  return (
    <group ref={ref}>
      <Trail width={size * 3} length={20} color={new THREE.Color(color)} attenuation={(t) => t * t}>
        <Sphere args={[size, 16, 16]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
        </Sphere>
      </Trail>
    </group>
  );
}

function InnerCore() {
  const texture = useTexture("/images/profile-hero.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  
  // Shift the image slightly down so the head isn't cut off at the pinched pole of the sphere
  texture.offset.set(0, -0.2);
  // Zoom out slightly so more of the face fits within the main viewable area
  texture.repeat.set(1.2, 1.2);
  texture.center.set(0.5, 0.5); // Set scale center to middle of the texture

  return (
    <Icosahedron args={[1.8, 64]}> 
      <MeshDistortMaterial
        map={texture}
        color="#a855f7" // Purple base color to blend with the image
        emissive="#4c1d95" // Deep purple glow
        emissiveIntensity={0.6}
        envMapIntensity={0.8} 
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.6} // Increased metalness for that sleek 3D look
        roughness={0.2}
        distort={0.4} 
        speed={3} 
      />
    </Icosahedron>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const targetX = state.pointer.y * 0.3; 
      const targetY = state.pointer.x * 0.3; 
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}> 
        
        {/* Inner core with Profile Picture */}
        <Suspense fallback={
          <Icosahedron args={[1.8, 64]}>
            <MeshDistortMaterial color="#a855f7" distort={0.4} speed={3} />
          </Icosahedron>
        }>
          <InnerCore />
        </Suspense>
        
        {/* Agents trapped INSIDE the network wireframe (Radius between 1.9 and 2.4) */}
        <Agent radius={2.0} speed={0.8} offset={0} color="#a855f7" size={0.06} />
        <Agent radius={2.2} speed={-0.5} offset={Math.PI} color="#ec4899" size={0.05} />
        <Agent radius={2.4} speed={0.6} offset={Math.PI / 2} color="#06b6d4" size={0.07} />
        <Agent radius={2.1} speed={-0.7} offset={Math.PI * 1.5} color="#10b981" size={0.04} />
        <Agent radius={2.3} speed={0.4} offset={Math.PI / 4} color="#f59e0b" size={0.05} />

        {/* Outer wireframe bounds (The Network) */}
        <Icosahedron args={[2.5, 1]}> 
          <meshStandardMaterial color="#4f46e5" wireframe roughness={0.1} metalness={0.8} /> 
        </Icosahedron>
      </Float>

      <Environment preset="studio" /> 
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} /> 
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <pointLight position={[-10, -10, -10]} color="#ec4899" intensity={2} />
      <pointLight position={[10, -10, 10]} color="#3b82f6" intensity={2} />
      
      <ContactShadows position={[0, -3.5, 0]} opacity={0.5} scale={15} blur={2.5} far={4.5} /> 
    </group>
  );
}

export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }} 
        dpr={[1, 2]}
        className="pointer-events-auto"
        style={{ pointerEvents: 'auto' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
