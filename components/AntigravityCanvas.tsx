"use client";

import { useEffect, useRef } from "react";

export default function AntigravityCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init(); // Reinitialize particles to cover new area
    };

    class Particle {
      x: number;
      y: number;
      angle: number;
      radius: number;
      speed: number;
      length: number;

      constructor(width: number, height: number) {
        // Increase radius range to cover standard screens
        const maxRadius = Math.max(width, height) * 0.8;
        this.radius = Math.random() * maxRadius;
        this.angle = Math.random() * Math.PI * 2;
        // Super slow rotation
        this.speed = (Math.random() > 0.5 ? 1 : -1) * (0.0005 + Math.random() * 0.001);
        this.length = Math.random() * 6 + 4; // 4px to 10px long dashes
        this.x = width / 2 + Math.cos(this.angle) * this.radius;
        this.y = height / 2 + Math.sin(this.angle) * this.radius;
      }

      update(width: number, height: number) {
        this.angle += this.speed;
        this.x = width / 2 + Math.cos(this.angle) * this.radius;
        this.y = height / 2 + Math.sin(this.angle) * this.radius;
      }

      draw(width: number) {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2); // Rotate so dash follows the orbital path
        
        // Color mapping purely by X coordinate matching the screenshot gradient
        // Left goes from a warm red -> center purple -> right deep blue
        const normalizedX = Math.max(0, Math.min(1, this.x / width));
        
        let r, g, b;
        if (normalizedX < 0.5) {
          const ratio = normalizedX * 2; // 0 to 1
          // Red (235, 87, 87) to Purple (156, 92, 181)
          r = 235 + ratio * (156 - 235);
          g = 87 + ratio * (92 - 87);
          b = 87 + ratio * (181 - 87);
        } else {
          const ratio = (normalizedX - 0.5) * 2; // 0 to 1
          // Purple (156, 92, 181) to Blue (59, 130, 246)
          r = 156 + ratio * (59 - 156);
          g = 92 + ratio * (130 - 92);
          b = 181 + ratio * (246 - 181);
        }

        ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
        
        // Draw the pill/capsule shape
        ctx.beginPath();
        ctx.arc(0, -this.length / 2, 2, Math.PI, 0);
        ctx.lineTo(2, this.length / 2);
        ctx.arc(0, this.length / 2, 2, 0, Math.PI);
        ctx.lineTo(-2, -this.length / 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    const init = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 6000); // Higher density
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    window.addEventListener("resize", resize);
    resize();

    const animate = () => {
      // Very light trail clear for smoothness
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(canvas.width);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full mix-blend-multiply opacity-80" 
      style={{ pointerEvents: 'none' }} 
    />
  );
}
