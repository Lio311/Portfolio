import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { BotsSection } from "@/components/sections/bots";
import { ProjectsSection } from "@/components/sections/projects";
import { PulseSection } from "@/components/sections/pulse";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <BotsSection />
      <ProjectsSection />
      <PulseSection />
      <ContactSection />
    </>
  );
}
