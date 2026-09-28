"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Sphere, Stars, Environment, ContactShadows, Trail, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Agent component representing a single AI agent in the network
function Agent({ radius, speed, offset, color, size }: { radius: number, speed: number, offset: number, color: string, size: number }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      // Adding vertical oscillation based on time and radius
      ref.current.position.y = Math.sin(t * 1.5) * (radius * 0.2); 
    }
  });

  return (
    <group ref={ref}>
      <Trail width={size * 4} length={40} color={new THREE.Color(color)} attenuation={(t) => t * t}>
        <Sphere args={[size, 16, 16]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
        </Sphere>
      </Trail>
    </group>
  );
}

function InnerCore() {
  const texture = useTexture("/images/profile-hero.png");
  // Adjust texture mapping if needed
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // texture.repeat.set(2, 1); // Optional: repeat to wrap better
  
  return (
    <Icosahedron args={[1.2, 64]}>
      <MeshDistortMaterial
        map={texture}
        color="#ffffff"
        emissive="#1e1b4b"
        emissiveIntensity={0.2}
        envMapIntensity={0.5} // Lowered to prevent environment from washing out the image
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.1} // Lowered so the texture is more visible and not just metallic
        roughness={0.3}
        distort={0.2} // Reduced distort so the face isn't completely mangled
        speed={2}
      />
    </Icosahedron>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Smoothly interpolate the rotation towards the mouse pointer position
      const targetX = state.pointer.y * 0.15;
      const targetY = state.pointer.x * 0.15;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Orchestrator / Core System */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        {/* Inner core with Profile Picture */}
        <Suspense fallback={
          <Icosahedron args={[1.2, 64]}>
            <MeshDistortMaterial color="#4f46e5" distort={0.2} speed={2} />
          </Icosahedron>
        }>
          <InnerCore />
        </Suspense>
        
        {/* Outer wireframe bounds */}
        <Icosahedron args={[1.6, 1]}>
          <meshStandardMaterial color="#818cf8" wireframe transparent opacity={0.3} roughness={0.1} metalness={0.8} />
        </Icosahedron>
      </Float>

      {/* Orbiting Agents in the Multi-Agent System */}
      <Agent radius={2.2} speed={0.6} offset={0} color="#a855f7" size={0.12} />
      <Agent radius={2.8} speed={-0.4} offset={Math.PI} color="#ec4899" size={0.08} />
      <Agent radius={3.5} speed={0.5} offset={Math.PI / 2} color="#06b6d4" size={0.15} />
      <Agent radius={3.0} speed={-0.6} offset={Math.PI * 1.5} color="#10b981" size={0.10} />
      <Agent radius={4.0} speed={0.3} offset={Math.PI / 4} color="#f59e0b" size={0.09} />

      {/* Changed Environment to "studio" to avoid the city buildings reflection */}
      <Environment preset="studio" />
      <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1.5} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <pointLight position={[-10, -10, -10]} color="#ec4899" intensity={2} />
      <pointLight position={[10, -10, 10]} color="#3b82f6" intensity={2} />
      
      <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={15} blur={2.5} far={4.5} />
    </group>
  );
}

export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 11], fov: 45 }} 
        dpr={[1, 2]}
        className="pointer-events-auto"
        style={{ pointerEvents: 'auto' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
