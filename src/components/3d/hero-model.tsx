"use client";

import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, Sphere, Stars, Environment, ContactShadows, Trail, Html } from "@react-three/drei";
import * as THREE from "three";
import { heroScroll } from "@/lib/hero-scroll";

// Importing icons from react-icons
import { 
  SiAnthropic, SiGooglegemini, SiVercel, SiGithub, SiNeon, SiGooglecloud, 
  SiReact, SiNextdotjs, SiPython, SiTypescript, SiPytorch, SiTensorflow, 
  SiTailwindcss, SiNodedotjs, SiPostgresql, SiPrisma 
} from "react-icons/si";
import { TbBrandOpenai } from "react-icons/tb";
import { FaAws } from "react-icons/fa";

// Agent component representing a technology node
function Agent({ radius, speed, offset, inclination, IconComponent, color, size }: { radius: number, speed: number, offset: number, inclination: number, IconComponent: ComponentType<{ style?: CSSProperties }>, color: string, size: number }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    // Global speed reduction factor (0.3 = 30% of original speed)
    const GLOBAL_SPEED_MULTIPLIER = 0.3;
    const t = state.clock.elapsedTime * speed * GLOBAL_SPEED_MULTIPLIER + offset;
    if (ref.current) {
      // 3D Spherical Orbit
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      
      // Apply 3D rotation (inclination) around X axis, and offset rotation around Y axis
      const y1 = z * Math.sin(inclination);
      const z1 = z * Math.cos(inclination);
      
      const x2 = x * Math.cos(offset) - z1 * Math.sin(offset);
      const z2 = x * Math.sin(offset) + z1 * Math.cos(offset);
      
      ref.current.position.x = x2;
      ref.current.position.y = y1;
      ref.current.position.z = z2;
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
      
      {/* The HTML Icon overlay - Size significantly reduced by half */}
      <Html transform center style={{ pointerEvents: 'none' }} distanceFactor={8}>
        <div 
          className="bg-white rounded-full flex items-center justify-center shadow-md border border-purple-200/50" 
          style={{ width: '9px', height: '9px', boxShadow: `0 0 4px ${color}80` }}
        >
          <IconComponent style={{ width: '5px', height: '5px', color: color }} />
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
  // New added icons based on GitHub profile
  { id: "python", radius: 2.5, speed: 0.5, color: "#3776AB", icon: SiPython },
  { id: "typescript", radius: 2.1, speed: -0.6, color: "#3178C6", icon: SiTypescript },
  { id: "pytorch", radius: 2.4, speed: 0.7, color: "#EE4C2C", icon: SiPytorch },
  { id: "tensorflow", radius: 2.2, speed: -0.5, color: "#FF6F00", icon: SiTensorflow },
  { id: "tailwindcss", radius: 1.8, speed: 0.8, color: "#06B6D4", icon: SiTailwindcss },
  { id: "nodejs", radius: 2.3, speed: -0.7, color: "#339933", icon: SiNodedotjs },
  { id: "postgresql", radius: 2.5, speed: 0.4, color: "#4169E1", icon: SiPostgresql },
  { id: "prisma", radius: 1.9, speed: -0.6, color: "#2D3748", icon: SiPrisma },
];

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const baseZ = useRef<number | null>(null);
  
  useFrame((state) => {
    // Scrolling out of the hero pulls the camera back and spins the network (heroScroll is 0..1)
    const p = heroScroll.progress;
    baseZ.current ??= state.camera.position.z;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, baseZ.current * (1 + p * 0.9), 0.1);

    if (groupRef.current) {
      const targetX = state.pointer.y * 0.3 + p * 0.5;
      const targetY = state.pointer.x * 0.3 + p * Math.PI * 0.9;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}> 
        
        {/* Purple bubble (Inner Core) removed as requested */}        
        {/* Technology Agents scattered across the 3D network */}
        {technologies.map((tech, i) => {
          // Calculate spread offset and inclination so they fly all over the sphere
          const offset = (Math.PI * 2 * i) / technologies.length;
          const inclination = (Math.PI * i) / (technologies.length / 2); // Vary inclination heavily
          
          return (
            <Agent 
              key={tech.id}
              IconComponent={tech.icon}
              radius={tech.radius}
              speed={tech.speed}
              offset={offset}
              inclination={inclination}
              color={tech.color}
              size={0.025} /* Trail size also halved */
            />
          );
        })}

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
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  // Pull the camera back on phones so the globe frames the copy instead of crowding it
  const [cameraZ] = useState(() => (window.innerWidth < 640 ? 12 : 8));

  // Stop the render loop once the hero scrolls away; no point drawing an unseen scene.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="hero-canvas absolute inset-0 z-0 pointer-events-none">
      <Canvas 
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0, cameraZ], fov: 45 }} 
        dpr={[1, 2]}
        className="pointer-events-auto"
        style={{ pointerEvents: 'auto' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
