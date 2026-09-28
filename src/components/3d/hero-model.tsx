"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Sphere, Stars, Environment, ContactShadows, Trail, Html } from "@react-three/drei";
import * as THREE from "three";

// Importing icons from react-icons
import { SiAnthropic, SiGooglegemini, SiVercel, SiGithub, SiNeon, SiGooglecloud, SiReact, SiNextdotjs } from "react-icons/si";
import { TbBrandOpenai } from "react-icons/tb";
import { FaAws } from "react-icons/fa";

// Agent component representing a technology node
function Agent({ radius, speed, offset, IconComponent, color, size }: { radius: number, speed: number, offset: number, IconComponent: any, color: string, size: number }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    if (ref.current) {
      // Orbit inside the bounds of the 2.5 wireframe, outside the 1.8 blob
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t * 1.5) * (radius * 0.3); 
    }
  });

  return (
    <group ref={ref}>
      {/* Keeping a very faint trail just for the motion effect */}
      <Trail width={size * 2} length={10} color={new THREE.Color(color)} attenuation={(t) => t * t}>
        <Sphere args={[0.01, 8, 8]}>
          <meshBasicMaterial color={color} transparent opacity={0} />
        </Sphere>
      </Trail>
      
      {/* The HTML Icon overlay - Size significantly reduced */}
      <Html transform center style={{ pointerEvents: 'none' }} distanceFactor={8}>
        <div 
          className="bg-white rounded-full flex items-center justify-center shadow-md border border-purple-200/50" 
          style={{ width: '18px', height: '18px', boxShadow: `0 0 8px ${color}80` }}
        >
          <IconComponent style={{ width: '10px', height: '10px', color: color }} />
        </div>
      </Html>
    </group>
  );
}

const technologies = [
  { id: "anthropic", radius: 2.3, speed: 0.6, color: "#d97757", icon: SiAnthropic },
  { id: "openai", radius: 2.0, speed: -0.5, color: "#10a37f", icon: TbBrandOpenai },
  { id: "googlegemini", radius: 2.4, speed: 0.7, color: "#8e75b2", icon: SiGooglegemini },
  { id: "vercel", radius: 1.9, speed: -0.8, color: "#000000", icon: SiVercel },
  { id: "github", radius: 2.2, speed: 0.4, color: "#181717", icon: SiGithub },
  { id: "neon", radius: 2.3, speed: -0.6, color: "#00e599", icon: SiNeon },
  { id: "googlecloud", radius: 2.0, speed: 0.5, color: "#4285f4", icon: SiGooglecloud },
  { id: "aws", radius: 2.4, speed: -0.4, color: "#232f3e", icon: FaAws },
  { id: "react", radius: 2.1, speed: 0.8, color: "#61dafb", icon: SiReact },
  { id: "nextjs", radius: 2.2, speed: -0.7, color: "#000000", icon: SiNextdotjs },
];

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
        
        {/* Original Inner Core (Purple with Environment City Reflection) */}
        <Suspense fallback={null}>
          <Icosahedron args={[1.8, 64]}>
            <MeshDistortMaterial
              color="#4f46e5"
              emissive="#1e1b4b"
              envMapIntensity={2}
              clearcoat={1}
              clearcoatRoughness={0.1}
              metalness={0.9}
              roughness={0.1}
              distort={0.4}
              speed={3}
            />
          </Icosahedron>
        </Suspense>
        
        {/* Technology Agents trapped INSIDE the network wireframe */}
        {technologies.map((tech, i) => (
          <Agent 
            key={tech.id}
            IconComponent={tech.icon}
            radius={tech.radius}
            speed={tech.speed}
            offset={(Math.PI * 2 * i) / technologies.length}
            color={tech.color}
            size={0.05}
          />
        ))}

        {/* Outer wireframe bounds (The Network) */}
        <Icosahedron args={[2.5, 1]}> 
          <meshStandardMaterial color="#4f46e5" wireframe roughness={0.1} metalness={0.8} /> 
        </Icosahedron>
      </Float>

      {/* Restoring city environment for the building reflections */}
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
