"use client";

import { useEffect, useRef } from 'react';
import { mountScrollWorld } from './scrub-engine';

export function ScrollWorld() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any previous mount during hot reload
    containerRef.current.innerHTML = '';

    mountScrollWorld(containerRef.current, {
      brand: { name: 'AgentWorld', href: '#top' },
      cta: { label: 'Start Building', href: '#finale' },
      hint: 'scroll to fly in',
      diveScroll: 1.3,
      connScroll: 0.9,
      sections: [
        {
          id: 'core', label: 'The Core',
          still: '/assets/scene1.jpg',
          clip: '/assets/vid/scene1.mp4',
          clipMobile: '', // Add mobile 9:16 video here: '/assets/vid/scene1-m.mp4'
          stillMobile: '/assets/scene1.jpg',
          accent: '#00F0FF',
          eyebrow: 'Where it begins',
          title: 'The Neural Core',
          body: 'Intelligence is born in the deep networks. Our agents start from a foundation of advanced reasoning.',
          tags: ['LLMs', 'Neural Networks', 'Compute'],
        },
        {
          id: 'lab', label: 'The Lab',
          still: '/assets/scene2.jpg',
          clip: '/assets/vid/scene2.mp4',
          clipMobile: '',
          stillMobile: '/assets/scene2.jpg',
          accent: '#8A2BE2',
          eyebrow: 'Shaping behavior',
          title: 'The Agent Lab',
          body: 'We configure specialized AI agents, giving them tools, memory, and unique capabilities for any task.',
          tags: ['Configuration', 'Tool Use', 'Memory'],
        },
        {
          id: 'swarm', label: 'The Swarm',
          still: '/assets/scene3.jpg',
          clip: '/assets/vid/scene3.mp4',
          clipMobile: '',
          stillMobile: '/assets/scene3.jpg',
          accent: '#FF00FF',
          eyebrow: 'Working together',
          title: 'Autonomous Swarms',
          body: 'Agents communicate, delegate, and solve complex problems collaboratively in a shared digital space.',
          tags: ['Multi-Agent', 'Collaboration', 'Delegation'],
        },
        {
          id: 'action', label: 'Execution',
          still: '/assets/scene4.jpg',
          clip: '/assets/vid/scene4.mp4',
          clipMobile: '',
          stillMobile: '/assets/scene4.jpg',
          accent: '#00FF9D',
          eyebrow: 'Real world impact',
          title: 'Seamless Execution',
          body: 'From code generation to API interactions, our agents execute tasks directly within your environment.',
          tags: ['Action', 'API Integration', 'Automation'],
        },
        {
          id: 'finale', label: 'The Future',
          still: '/assets/scene5.jpg',
          clip: '/assets/vid/scene5.mp4',
          clipMobile: '',
          stillMobile: '/assets/scene5.jpg',
          accent: '#00F0FF',
          eyebrow: 'Ready to deploy',
          title: 'Your AI Workforce',
          body: 'Bring the power of autonomous AI agents to your business today.',
          tags: [],
          cta: { primary: { label: 'Get Started', href: '#' },
                 secondary: { label: 'Documentation', href: '#' } },
        },
      ],
      // Since video connects are not ready, leave empty strings or omit
      connectors: ['', '', '', ''],
      connectorsMobile: ['', '', '', ''],
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root, .sw-root {
          --sw-bg: #09090b;
          --sw-ink: #f8fafc;
          --sw-ink-soft: #94a3b8;
          --sw-accent: #00F0FF;
        }
        .sw-scene__video, .sw-scene__still {
          transform: scale(1.06);
        }
      `}} />
      <div id="top"></div>
      <div id="world" ref={containerRef}></div>
    </>
  );
}
