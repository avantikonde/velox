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

    // Track Coins Progress along the exact path:
    // Path 1 (Upper Ramp): Progress 0.0 -> 0.42 (Royal Cobalt Blue & Silver coin)
    // Path 2 (Through Portal): Progress 0.42 -> 0.52 (Drops through portal, transmuting to Gold)
    // Path 3 (Lower Ramp): Progress 0.52 -> 1.0 (Rolls on lower ramp as PURE SAFFRON GOLD & SCARLET)

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

      // Center anchor points scaled to screen
      // Align scene to the center-right exactly matching the composition
      const originX = Math.max(500, width * 0.65);
      const originY = height * 0.48;
      const scale = Math.min(1.1, Math.max(0.65, width / 1400));

      // Draw subtle Bitmela discrete binary matrix particles in the background
      ctx.save();
      ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const cell = 64;
      const cols = Math.min(24, Math.floor(width / cell));
      const rows = Math.min(16, Math.floor(height / cell));
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const noise = Math.sin(cx * 12.9898 + cy * 78.233 + Math.floor(time * 0.4)) * 43758.5453;
          const fract = noise - Math.floor(noise);
          if (fract > 0.94) {
            ctx.fillStyle = fract > 0.97 ? 'rgba(226, 58, 46, 0.25)' : 'rgba(242, 194, 58, 0.35)';
            ctx.fillText(fract > 0.97 ? '1' : '0', cx * cell + 32, cy * cell + 32);
          }
        }
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 1. DRAW UPPER TEXTURED RAMP (Curving down to the portal)
      // -------------------------------------------------------------
      ctx.save();
      ctx.translate(originX, originY);
      ctx.scale(scale, scale);

      // Upper Ramp Coordinates
      const upperRampStart = { x: -140, y: -290 };
      const upperRampEnd = { x: 30, y: -120 };

      // Upper track ribbon / blocks (Deep Charcoal stone with Saffron accents)
      ctx.beginPath();
      ctx.moveTo(upperRampStart.x - 45, upperRampStart.y);
      ctx.quadraticCurveTo(-110, -210, upperRampEnd.x - 45, upperRampEnd.y);
      ctx.lineTo(upperRampEnd.x + 45, upperRampEnd.y + 15);
      ctx.quadraticCurveTo(-30, -200, upperRampStart.x + 45, upperRampStart.y + 15);
      ctx.closePath();
      
      const upperTrackGrad = ctx.createLinearGradient(-150, -300, 50, -100);
      upperTrackGrad.addColorStop(0, '#17151E');
      upperTrackGrad.addColorStop(0.5, '#24212D');
      upperTrackGrad.addColorStop(1, '#0E0C13');
      ctx.fillStyle = upperTrackGrad;
      ctx.fill();
      ctx.strokeStyle = '#F2C23A';
      ctx.lineWidth = 1.8;
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
        ctx.strokeStyle = 'rgba(244, 231, 199, 0.2)';
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
      lowerTrackGrad.addColorStop(0, '#17151E');
      lowerTrackGrad.addColorStop(0.5, '#24212D');
      lowerTrackGrad.addColorStop(1, '#0E0C13');
      ctx.fillStyle = lowerTrackGrad;
      ctx.fill();
      ctx.strokeStyle = '#E23A2E';
      ctx.lineWidth = 1.8;
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
        ctx.strokeStyle = 'rgba(242, 194, 58, 0.3)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // 3. DRAW THE WONDER GLOWING PORTAL DISC (Bitmela Saffron & Scarlet)
      // -------------------------------------------------------------
      const portalX = 10;
      const portalY = -15;
      const portalRx = 115;
      const portalRy = 38;

      // Portal Ambient Glow / Radiance in Saffron Gold & Sindoor Scarlet
      const portalBloom = ctx.createRadialGradient(portalX, portalY, 10, portalX, portalY, 180);
      portalBloom.addColorStop(0, 'rgba(242, 194, 58, 0.45)');
      portalBloom.addColorStop(0.35, 'rgba(226, 58, 46, 0.3)');
      portalBloom.addColorStop(0.7, 'rgba(38, 119, 201, 0.15)');
      portalBloom.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.ellipse(portalX, portalY, 200, 90, 0, 0, Math.PI * 2);
      ctx.fillStyle = portalBloom;
      ctx.fill();

      // Lower pedestal base of portal
      ctx.beginPath();
      ctx.ellipse(portalX, portalY + 12, portalRx * 0.95, portalRy * 0.95, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#17151E';
      ctx.fill();
      ctx.strokeStyle = '#F2C23A';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Portal Disc Rim
      ctx.beginPath();
      ctx.ellipse(portalX, portalY, portalRx, portalRy, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0E0C13';
      ctx.fill();

      // Wavy Organic Liquid Neon Ring (The "Wonder" Moat in Bitmela festival flames)
      ctx.save();
      ctx.shadowColor = '#F2C23A';
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

      // Inner Liquid Neon Fill: White core -> Saffron Gold -> Scarlet Red
      const innerNeon = ctx.createRadialGradient(portalX, portalY, 0, portalX, portalY, portalRx * 0.85);
      innerNeon.addColorStop(0, '#FFFFFF');
      innerNeon.addColorStop(0.35, '#FDE68A');
      innerNeon.addColorStop(0.7, '#F2C23A');
      innerNeon.addColorStop(1, '#E23A2E');

      ctx.fillStyle = innerNeon;
      ctx.fill();

      // Blazing Outline
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.restore();

      // -------------------------------------------------------------
      // 4. DRAW COINS & COLOR TRANSMUTATION (Cobalt to Saffron Gold)
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
        const tiltAngle = -0.32;
        ctx.rotate(tiltAngle);

        const rotSquish = Math.cos(coin.rotation);
        const absSquish = Math.max(0.25, Math.abs(rotSquish));

        // 3D Coin Edge (Thickness)
        const edgeDepth = 14;
        ctx.fillStyle = isTransmuted ? '#B7261C' : '#17151E';
        ctx.beginPath();
        ctx.ellipse(edgeDepth * 0.4, 0, coinRadius * absSquish, coinRadius, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3D Coin Face
        ctx.beginPath();
        ctx.ellipse(0, 0, coinRadius * absSquish, coinRadius, 0, 0, Math.PI * 2);

        // Coin Face Gradient
        const faceGrad = ctx.createLinearGradient(-coinRadius, -coinRadius, coinRadius, coinRadius);
        if (!isTransmuted) {
          // Top: Peacock Cobalt Blue & Silver metallic face
          faceGrad.addColorStop(0, '#FAF3E0');
          faceGrad.addColorStop(0.35, '#2677C9');
          faceGrad.addColorStop(0.8, '#17151E');
          faceGrad.addColorStop(1, '#0E0C13');
        } else {
          // Bottom: Pure Radiant Saffron Gold face with Ruby core
          faceGrad.addColorStop(0, '#FFFBEB');
          faceGrad.addColorStop(0.3, '#FDE68A');
          faceGrad.addColorStop(0.7, '#F2C23A');
          faceGrad.addColorStop(1, '#E23A2E');
        }
        ctx.fillStyle = faceGrad;
        ctx.fill();

        // THE TRANSMUTATION WONDER:
        // Before portal: Fine Silver/Cobalt rim
        // After portal: BLAZING SOLID SAFFRON GOLD & SCARLET GLOWING RIM
        if (!isTransmuted) {
          ctx.strokeStyle = '#FAF3E0';
          ctx.lineWidth = 3.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, (coinRadius - 5) * absSquish, coinRadius - 5, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(244, 231, 199, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // Radiant Gold & Scarlet glowing rim
          ctx.shadowColor = '#F2C23A';
          ctx.shadowBlur = 30;

          ctx.strokeStyle = '#F2C23A';
          ctx.lineWidth = 6;
          ctx.stroke();

          // Hot incandescent core
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.shadowBlur = 0;
        }

        // Center Embossed Symbol on Coin
        ctx.save();
        ctx.fillStyle = isTransmuted ? '#17151E' : '#FAF3E0';
        ctx.font = `bold ${Math.round(coinRadius * 0.7 * absSquish + 10)}px "IBM Plex Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (absSquish > 0.3) {
          if (coin.symbol === 'M') {
            ctx.rotate(Math.PI / 4);
            const sqSize = 14 * absSquish;
            ctx.rect(-sqSize, -sqSize, sqSize * 2, sqSize * 2);
            ctx.lineWidth = 3;
            ctx.strokeStyle = isTransmuted ? '#17151E' : '#FAF3E0';
            ctx.stroke();
          } else {
            ctx.fillText(coin.symbol, 0, 0);
          }
        }
        ctx.restore();

        ctx.restore();
      });

      ctx.restore();

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
