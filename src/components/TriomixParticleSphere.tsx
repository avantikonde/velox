import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  color: string;
  glowColor: string;
  alpha: number;
  layer: 'sphere' | 'ring' | 'ambient';
  speedMultiplier: number;
}

interface TriomixParticleSphereProps {
  className?: string;
}

export const TriomixParticleSphere: React.FC<TriomixParticleSphereProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Color palette based on screenshot: vibrant purple, violet, magenta, and pure white
    const colors = [
      { fill: '#ffffff', glow: 'rgba(255, 255, 255, 0.8)' },
      { fill: '#f3e8ff', glow: 'rgba(216, 180, 254, 0.7)' },
      { fill: '#e9d5ff', glow: 'rgba(192, 132, 252, 0.8)' },
      { fill: '#d8b4fe', glow: 'rgba(168, 85, 247, 0.9)' },
      { fill: '#c084fc', glow: 'rgba(147, 51, 234, 0.9)' },
      { fill: '#a855f7', glow: 'rgba(126, 34, 206, 0.8)' },
      { fill: '#9333ea', glow: 'rgba(107, 33, 168, 0.7)' },
      { fill: '#38bdf8', glow: 'rgba(56, 189, 248, 0.6)' }, // rare subtle cyan accent
    ];

    const particles: Particle[] = [];
    const sphereRadius = Math.min(width, height) * 0.32;
    const numSphereParticles = 1400;
    const numRingParticles = 350;
    const numAmbientParticles = 120;

    // Fibonacci sphere distribution for uniform 3D sphere
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < numSphereParticles; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / numSphereParticles);
      
      // Slight radial variation for organic volumetric depth
      const r = sphereRadius * (0.92 + Math.random() * 0.16);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const colorObj = colors[Math.floor(Math.random() * colors.length)];
      // Bright white centers for high-energy look
      const isBright = Math.random() < 0.25;

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: isBright ? Math.random() * 2.2 + 1.2 : Math.random() * 1.6 + 0.8,
        color: isBright ? '#ffffff' : colorObj.fill,
        glowColor: colorObj.glow,
        alpha: Math.random() * 0.5 + 0.5,
        layer: 'sphere',
        speedMultiplier: 0.9 + Math.random() * 0.2
      });
    }

    // Outer orbital halo/ring particles
    for (let i = 0; i < numRingParticles; i++) {
      const angle = (i / numRingParticles) * Math.PI * 2 + Math.random() * 0.1;
      const ringRadius = sphereRadius * (1.15 + Math.random() * 0.4);
      const inclination = (Math.PI / 6) + (Math.random() - 0.5) * 0.3; // tilted orbital plane

      const x = ringRadius * Math.cos(angle);
      const y = ringRadius * Math.sin(angle) * Math.cos(inclination) + (Math.random() - 0.5) * 20;
      const z = ringRadius * Math.sin(angle) * Math.sin(inclination) + (Math.random() - 0.5) * 20;

      const colorObj = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 1.8 + 0.8,
        color: colorObj.fill,
        glowColor: colorObj.glow,
        alpha: Math.random() * 0.6 + 0.3,
        layer: 'ring',
        speedMultiplier: 0.8 + Math.random() * 0.4
      });
    }

    // Drifting ambient cosmic sparks
    for (let i = 0; i < numAmbientParticles; i++) {
      const r = sphereRadius * (1.4 + Math.random() * 0.8);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 1.2 + 0.5,
        color: '#c084fc',
        glowColor: 'rgba(168, 85, 247, 0.4)',
        alpha: Math.random() * 0.4 + 0.2,
        layer: 'ambient',
        speedMultiplier: 0.5
      });
    }

    // Physics & Rotation state
    let rotX = 0.2;
    let rotY = 0;
    let targetRotX = 0.15;
    let targetRotY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let waveTime = 0;
    let ripplePulse = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      if (isMouseDown) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.008;
      } else {
        targetRotY = nx * 0.5;
        targetRotX = -ny * 0.4 + 0.15;
      }

      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      mouseX = nx;
      mouseY = ny;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      ripplePulse = 1.0; // trigger shockwave ripple!
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
    }

    // 3D Rotation matrices
    const render = () => {
      waveTime += 0.015;
      if (ripplePulse > 0.005) {
        ripplePulse *= 0.94;
      } else {
        ripplePulse = 0;
      }

      // Smooth damping interpolation towards mouse target + continuous rotation
      targetRotY += 0.0025; // idle spin
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const cameraDistance = 500;

      // Draw central ambient nebula glow behind sphere
      const nebulaGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        sphereRadius * 0.1,
        centerX,
        centerY,
        sphereRadius * 1.4
      );
      nebulaGrad.addColorStop(0, 'rgba(147, 51, 234, 0.35)');
      nebulaGrad.addColorStop(0.3, 'rgba(126, 34, 206, 0.18)');
      nebulaGrad.addColorStop(0.7, 'rgba(76, 29, 149, 0.06)');
      nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = nebulaGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Transform, sort, and project particles
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Wave breathing effect
        const wave = Math.sin(waveTime * p.speedMultiplier * 2 + p.baseY * 0.02) * 5;
        const ripple = ripplePulse * Math.sin(p.baseX * 0.05 + waveTime * 8) * 18;
        const currentRMult = 1 + (wave + ripple) / sphereRadius;

        const bx = p.baseX * currentRMult;
        const by = p.baseY * currentRMult;
        const bz = p.baseZ * currentRMult;

        // Y-axis rotation
        let x1 = bx * cosY - bz * sinY;
        let z1 = bx * sinY + bz * cosY;

        // X-axis rotation
        let y2 = by * cosX - z1 * sinX;
        let z2 = by * sinX + z1 * cosX;

        // Perspective projection
        const fov = cameraDistance / (cameraDistance + z2);
        const projX = centerX + x1 * fov;
        const projY = centerY + y2 * fov;
        const projSize = p.size * fov;

        // Depth cueing alpha (foreground brighter, background softer)
        const depthAlpha = Math.max(0.1, Math.min(1.0, (z2 + sphereRadius * 1.2) / (sphereRadius * 2.4)));
        const finalAlpha = p.alpha * depthAlpha;

        projected.push({
          x: projX,
          y: projY,
          size: projSize,
          z: z2,
          color: p.color,
          glowColor: p.glowColor,
          alpha: finalAlpha,
          layer: p.layer
        });
      }

      // Sort back-to-front for proper depth rendering
      projected.sort((a, b) => a.z - b.z);

      // Draw all particles
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];

        ctx.save();
        ctx.globalAlpha = p.alpha;

        // Glow halo for larger or bright particles
        if (p.size > 1.4 || p.color === '#ffffff') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = p.glowColor;
          ctx.fill();
        }

        // Particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, p.size), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setPulseCount((prev) => prev + 1)}
      className={`relative w-full h-full min-h-[420px] md:min-h-[560px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Interactive 3D Sphere: Click to ripple shockwave, drag to rotate!"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Subtle interactive tip indicator at bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/20 backdrop-blur-md text-[11px] font-mono text-purple-300/80 pointer-events-none transition-opacity duration-300 flex items-center gap-1.5 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
        <span>Interactive 3D • Drag to rotate • Click for shockwave</span>
      </div>
    </div>
  );
};
