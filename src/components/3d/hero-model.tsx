"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Sphere, Stars, Environment, ContactShadows, Trail, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

// Agent component representing a technology node
function Agent({ radius, speed, offset, iconSlug, color, size }: { radius: number, speed: number, offset: number, iconSlug: string, color: string, size: number }) {
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
      
      {/* The HTML Icon overlay */}
      <Html transform center style={{ pointerEvents: 'none' }} distanceFactor={10}>
        <div 
          className="bg-white rounded-full flex items-center justify-center shadow-lg border border-purple-200/50" 
          style={{ width: '40px', height: '40px', boxShadow: `0 0 15px ${color}80` }}
        >
          {/* We fetch the icon directly from simpleicons CDN, defaulting to its brand color if we just pass the slug */}
          <img 
            src={`https://cdn.simpleicons.org/${iconSlug}`} 
            alt={iconSlug} 
            style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
          />
        </div>
      </Html>
    </group>
  );
}

function InnerCore() {
  const texture = useTexture("/images/profile-hero.png");
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  
  // Move the image right and down
  texture.offset.set(-0.8, -0.2);
  
  // Counteract the sphere's equatorial stretching (2:1 ratio) by repeating more on X than Y
  texture.repeat.set(4.0, 2.2);
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

const technologies = [
  { slug: "anthropic", radius: 2.3, speed: 0.6, color: "#d97757" },
  { slug: "openai", radius: 2.0, speed: -0.5, color: "#10a37f" },
  { slug: "googlegemini", radius: 2.4, speed: 0.7, color: "#8e75b2" },
  { slug: "vercel", radius: 1.9, speed: -0.8, color: "#000000" },
  { slug: "github", radius: 2.2, speed: 0.4, color: "#181717" },
  { slug: "neon", radius: 2.3, speed: -0.6, color: "#00e599" },
  { slug: "googlecloud", radius: 2.0, speed: 0.5, color: "#4285f4" },
  { slug: "amazonwebservices", radius: 2.4, speed: -0.4, color: "#232f3e" },
  { slug: "react", radius: 2.1, speed: 0.8, color: "#61dafb" },
  { slug: "nextdotjs", radius: 2.2, speed: -0.7, color: "#000000" },
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
        
        {/* Inner core with Profile Picture */}
        <Suspense fallback={
          <Icosahedron args={[1.8, 64]}>
            <MeshDistortMaterial color="#a855f7" distort={0.4} speed={3} />
          </Icosahedron>
        }>
          <InnerCore />
        </Suspense>
        
        {/* Technology Agents trapped INSIDE the network wireframe */}
        {technologies.map((tech, i) => (
          <Agent 
            key={tech.slug}
            iconSlug={tech.slug}
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
