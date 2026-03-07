'use client';

import { m } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface ParticleEffectProps {
  count?: number;
  color?: string;
  className?: string;
}

export default function ParticleEffect({ 
  count = 15,
  color = 'rgba(251, 146, 60, 0.5)',
  className = '' 
}: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 3,
      });
    }
    setParticles(newParticles);
  }, [count]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <m.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size * 4}px`,
            height: `${particle.size * 4}px`,
            backgroundColor: color,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
