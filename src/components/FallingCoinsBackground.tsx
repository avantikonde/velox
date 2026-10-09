import React, { useEffect, useRef } from 'react';

export const FallingCoinsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track Coins Progress along the exact path from user's image:
    // Path 1 (Upper Ramp): Progress 0.0 -> 0.42 (Dark metallic coin with silver rim)
    // Path 2 (Through Portal): Progress 0.42 -> 0.52 (Drops through portal, color transmuting)
    // Path 3 (Lower Ramp): Progress 0.52 -> 1.0 (Rolls on lower ramp with vibrant NEON PURPLE/MAGENTA RIM)

    interface MovingCoin {
      progress: number; // 0 to 1
      speed: number;
      symbol: string;
      rotation: number;
    }

    // Spawn 3 coins at staggered offsets
    const coins: MovingCoin[] = [
      { progress: 0.15, speed: 0.0016, symbol: 'M', rotation: 0 },
      { progress: 0.48, speed: 0.0016, symbol: '$', rotation: 1.2 },
      { progress: 0.82, speed: 0.0016, symbol: 'CHOG', rotation: 2.5 },
    ];

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Deep obsidian void background
      ctx.fillStyle = '#030508';
      ctx.fillRect(0, 0, width, height);

      // Center anchor points scaled to screen
      // Align scene to the center-right exactly like the Pinterest image
      const originX = Math.max(500, width * 0.65);
      const originY = height * 0.48;
      const scale = Math.min(1.1, Math.max(0.65, width / 1400));

      // -------------------------------------------------------------
      // 1. DRAW UPPER TEXTURED RAMP (Curving down to the portal)
      // -------------------------------------------------------------
      ctx.save();
      ctx.translate(originX, originY);
      ctx.scale(scale, scale);

      // Upper Ramp Coordinates
      const upperRampStart = { x: -140, y: -290 };
      const upperRampEnd = { x: 30, y: -120 };

      // Upper track ribbon / blocks
      ctx.beginPath();
      ctx.moveTo(upperRampStart.x - 45, upperRampStart.y);
      ctx.quadraticCurveTo(-110, -210, upperRampEnd.x - 45, upperRampEnd.y);
      ctx.lineTo(upperRampEnd.x + 45, upperRampEnd.y + 15);
      ctx.quadraticCurveTo(-30, -200, upperRampStart.x + 45, upperRampStart.y + 15);
      ctx.closePath();
      
      const upperTrackGrad = ctx.createLinearGradient(-150, -300, 50, -100);
      upperTrackGrad.addColorStop(0, '#0c1017');
      upperTrackGrad.addColorStop(0.5, '#161c28');
      upperTrackGrad.addColorStop(1, '#080c12');
      ctx.fillStyle = upperTrackGrad;
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Textured geometric ribs on upper ramp
      for (let i = 0; i < 9; i++) {
        const t = i / 8;
        const ribX1 = (upperRampStart.x - 45) * (1 - t) + (upperRampEnd.x - 45) * t;
        const ribY1 = upperRampStart.y * (1 - t) + upperRampEnd.y * t;
        const ribX2 = (upperRampStart.x + 45) * (1 - t) + (upperRampEnd.x + 45) * t;
        const ribY2 = (upperRampStart.y + 15) * (1 - t) + (upperRampEnd.y + 15) * t;

        ctx.beginPath();
        ctx.moveTo(ribX1, ribY1);
        ctx.lineTo(ribX2, ribY2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // 2. DRAW LOWER TEXTURED RAMP (Curving down from below portal)
      // -------------------------------------------------------------
      const lowerRampStart = { x: 20, y: 70 };
      const lowerRampEnd = { x: 180, y: 250 };

      ctx.beginPath();
      ctx.moveTo(lowerRampStart.x - 50, lowerRampStart.y);
      ctx.quadraticCurveTo(80, 150, lowerRampEnd.x - 50, lowerRampEnd.y);
      ctx.lineTo(lowerRampEnd.x + 50, lowerRampEnd.y + 20);
      ctx.quadraticCurveTo(160, 160, lowerRampStart.x + 50, lowerRampStart.y + 20);
      ctx.closePath();

      const lowerTrackGrad = ctx.createLinearGradient(0, 50, 200, 260);
      lowerTrackGrad.addColorStop(0, '#0c1017');
      lowerTrackGrad.addColorStop(0.5, '#182030');
      lowerTrackGrad.addColorStop(1, '#070b10');
      ctx.fillStyle = lowerTrackGrad;
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Textured geometric ribs on lower ramp
      for (let i = 0; i < 9; i++) {
        const t = i / 8;
        const ribX1 = (lowerRampStart.x - 50) * (1 - t) + (lowerRampEnd.x - 50) * t;
        const ribY1 = lowerRampStart.y * (1 - t) + lowerRampEnd.y * t;
        const ribX2 = (lowerRampStart.x + 50) * (1 - t) + (lowerRampEnd.x + 50) * t;
        const ribY2 = (lowerRampStart.y + 20) * (1 - t) + (lowerRampEnd.y + 20) * t;

        ctx.beginPath();
        ctx.moveTo(ribX1, ribY1);
        ctx.lineTo(ribX2, ribY2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // 3. DRAW THE WONDER GLOWING PORTAL DISC (Exact Pinterest design)
      // -------------------------------------------------------------
      const portalX = 10;
      const portalY = -15;
      const portalRx = 115;
      const portalRy = 38;

      // Portal Ambient Glow / Radiance
      const portalBloom = ctx.createRadialGradient(portalX, portalY, 10, portalX, portalY, 180);
      portalBloom.addColorStop(0, 'rgba(235, 150, 255, 0.45)');
      portalBloom.addColorStop(0.3, 'rgba(217, 70, 239, 0.25)');
      portalBloom.addColorStop(0.7, 'rgba(110, 84, 255, 0.1)');
      portalBloom.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.ellipse(portalX, portalY, 200, 90, 0, 0, Math.PI * 2);
      ctx.fillStyle = portalBloom;
      ctx.fill();

      // Lower pedestal base of portal
      ctx.beginPath();
      ctx.ellipse(portalX, portalY + 12, portalRx * 0.95, portalRy * 0.95, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0c111a';
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Portal Disc Rim
      ctx.beginPath();
      ctx.ellipse(portalX, portalY, portalRx, portalRy, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#070b12';
      ctx.fill();

      // Wavy Organic Liquid Neon Ring (The "Wonder" Moat from user's image)
      ctx.save();
      ctx.shadowColor = '#d946ef';
      ctx.shadowBlur = 32;

      ctx.beginPath();
      const points = 32;
      for (let i = 0; i <= points; i++) {
        const theta = (i / points) * Math.PI * 2;
        // Wavy perimeter ripple
        const wave = Math.sin(theta * 6 + time * 2) * 5 + Math.cos(theta * 4 - time) * 3;
        const px = portalX + Math.cos(theta) * (portalRx * 0.88 + wave);
        const py = portalY + Math.sin(theta) * (portalRy * 0.88 + wave * 0.4);

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Inner Liquid Neon Fill
      const innerNeon = ctx.createRadialGradient(portalX, portalY, 0, portalX, portalY, portalRx * 0.85);
      innerNeon.addColorStop(0, '#ffffff');
      innerNeon.addColorStop(0.35, '#f5d0fe');
      innerNeon.addColorStop(0.7, '#d946ef');
      innerNeon.addColorStop(1, '#a21caf');

      ctx.fillStyle = innerNeon;
      ctx.fill();

      // Blazing Neon Outline
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.restore();

      // -------------------------------------------------------------
      // 4. DRAW COINS & COLOR TRANSMUTATION
      // -------------------------------------------------------------
      coins.forEach((coin) => {
        coin.progress += coin.speed;
        coin.rotation += 0.035;
        if (coin.progress > 1) {
          coin.progress = 0;
        }

        let coinX = 0;
        let coinY = 0;
        let isTransmuted = false;

        // Path calculations
        if (coin.progress <= 0.42) {
          // Upper Ramp
          const t = coin.progress / 0.42;
          coinX = upperRampStart.x * (1 - t) + upperRampEnd.x * t;
          coinY = upperRampStart.y * (1 - t) + upperRampEnd.y * t - 25;
          isTransmuted = false;
        } else if (coin.progress <= 0.54) {
          // Falling Through the Glowing Portal
          const t = (coin.progress - 0.42) / 0.12;
          coinX = upperRampEnd.x * (1 - t) + (portalX) * t;
          coinY = (upperRampEnd.y - 25) * (1 - t) + (portalY + 50) * t;
          // Mid-transmutation
          isTransmuted = t > 0.5;
        } else {
          // Lower Ramp
          const t = (coin.progress - 0.54) / 0.46;
          coinX = lowerRampStart.x * (1 - t) + lowerRampEnd.x * t;
          coinY = lowerRampStart.y * (1 - t) + lowerRampEnd.y * t - 25;
          isTransmuted = true;
        }

        // Draw Individual 3D Coin
        ctx.save();
        ctx.translate(coinX, coinY);

        const coinRadius = 42;
        // 3D tilt perspective (matching image angle)
        const tiltAngle = -0.32;
        ctx.rotate(tiltAngle);

        const rotSquish = Math.cos(coin.rotation);
        const absSquish = Math.max(0.25, Math.abs(rotSquish));

        // 3D Coin Edge (Thickness)
        const edgeDepth = 14;
        ctx.fillStyle = isTransmuted ? '#701a75' : '#1e293b';
        ctx.beginPath();
        ctx.ellipse(edgeDepth * 0.4, 0, coinRadius * absSquish, coinRadius, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3D Coin Face
        ctx.beginPath();
        ctx.ellipse(0, 0, coinRadius * absSquish, coinRadius, 0, 0, Math.PI * 2);

        // Coin Face Gradient
        const faceGrad = ctx.createLinearGradient(-coinRadius, -coinRadius, coinRadius, coinRadius);
        if (!isTransmuted) {
          // Top: Dark Metallic Gunmetal / Titanium Face with Silver Highlights
          faceGrad.addColorStop(0, '#cbd5e1');
          faceGrad.addColorStop(0.3, '#475569');
          faceGrad.addColorStop(0.7, '#1e293b');
          faceGrad.addColorStop(1, '#090d16');
        } else {
          // Bottom: Dark Core Face with Violet Undertone
          faceGrad.addColorStop(0, '#38164f');
          faceGrad.addColorStop(0.5, '#180d26');
          faceGrad.addColorStop(1, '#08040d');
        }
        ctx.fillStyle = faceGrad;
        ctx.fill();

        // THE TRANSMUTATION WONDER:
        // Before portal: Matte silver/titanium rim
        // After portal: BLAZING NEON MAGENTA / PURPLE GLOWING RIM (Exact match to image!)
        if (!isTransmuted) {
          // Silver / Titanium Rim
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 3.5;
          ctx.stroke();

          // Embossed Rim Inner Ring
          ctx.beginPath();
          ctx.ellipse(0, 0, (coinRadius - 5) * absSquish, coinRadius - 5, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // Radiant Neon Magenta / Purple Glowing Rim
          ctx.shadowColor = '#d946ef';
          ctx.shadowBlur = 28;

          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 6;
          ctx.stroke();

          // Bright hot white core of neon tube
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.shadowBlur = 0; // Reset
        }

        // Center Embossed Symbol on Coin
        ctx.save();
        ctx.fillStyle = isTransmuted ? '#fdf4ff' : '#e2e8f0';
        ctx.font = `bold ${Math.round(coinRadius * 0.7 * absSquish + 10)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Symbol: Monad 'M' or '$'
        if (absSquish > 0.3) {
          if (coin.symbol === 'M') {
            // Monad Isometric Symbol
            ctx.rotate(Math.PI / 4);
            const sqSize = 14 * absSquish;
            ctx.rect(-sqSize, -sqSize, sqSize * 2, sqSize * 2);
            ctx.lineWidth = 3;
            ctx.strokeStyle = isTransmuted ? '#ffffff' : '#f8fafc';
            ctx.stroke();
          } else {
            ctx.fillText(coin.symbol, 0, 0);
          }
        }
        ctx.restore();

        ctx.restore();
      });

      ctx.restore(); // Restore origin transform

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};
