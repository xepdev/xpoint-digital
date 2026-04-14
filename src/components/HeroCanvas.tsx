'use client';

import React, { useEffect, useRef } from 'react';
import { Service } from '@/lib/db';

export default function HeroCanvas({ hizmetler }: { hizmetler?: Service[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5
      };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    // Get icons from services or fallback to defaults
    const icons = hizmetler && hizmetler.length > 0 
      ? hizmetler.map(s => s.icon) 
      : ['✨', '🚀', '💡', '📱', '🎯', '🎨', '🔍', '📈'];

    const particles: any[] = [];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: Math.random() * canvas.width,
        baseY: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        icon: icons[i % icons.length],
        fontSize: Math.random() * 20 + 20,
        opacity: Math.random() * 0.4 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        parallaxFactor: Math.random() * 40 + 20
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        // Dynamic continuous movement
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Wrap around screen
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;

        // Mouse Parallax Effect
        const targetX = p.x + (mouseRef.current.x * p.parallaxFactor);
        const targetY = p.y + (mouseRef.current.y * p.parallaxFactor);

        ctx.save();
        ctx.translate(targetX, targetY);
        ctx.rotate(p.rotation);
        ctx.font = `${p.fontSize}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = p.opacity;
        
        // Soft white glow for the icons
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(108, 99, 255, 0.2)';
        
        ctx.fillText(p.icon, 0, 0);
        ctx.restore();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hizmetler]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.7,
        filter: 'blur(0.5px)'
      }} 
    />
  );
}
