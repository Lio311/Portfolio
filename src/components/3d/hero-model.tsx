"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Stars, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Smoothly interpolate the rotation towards the mouse pointer position
      const targetX = state.pointer.y * 0.3;
      const targetY = state.pointer.x * 0.3;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        {/* Outer wireframe */}
        <Icosahedron args={[2.5, 1]}>
          <meshStandardMaterial color="#4f46e5" wireframe roughness={0.1} metalness={0.8} />
        </Icosahedron>
        
        {/* Inner distorting blob */}
        <Icosahedron args={[1.8, 64]}>
          <MeshDistortMaterial
            color="#a855f7"
            emissive="#4c1d95"
            envMapIntensity={2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.9}
            roughness={0.1}
            distort={0.4}
            speed={3}
          />
        </Icosahedron>
      </Float>
      
      <Environment preset="city" />
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
