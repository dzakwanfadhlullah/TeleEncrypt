import React, { useEffect, useRef } from 'react';

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters (Katakana + Latin)
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const chars = (katakana + latin).split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    let animationFrame: number;

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(250, 250, 250, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix text
      ctx.font = `${fontSize}px JetBrains Mono`;
      
      for (let i = 0; i < drops.length; i++) {
        // Occasional indigo flicker (5% chance)
        const isIndigo = Math.random() > 0.95;
        ctx.fillStyle = isIndigo 
          ? 'rgba(79, 70, 229, 0.4)' 
          : 'rgba(100, 116, 139, 0.08)';

        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        // Reset drop to top randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Cursor glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = `${e.clientX}px`;
        cursorGlowRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Layer 1: Base */}
      <div className="fixed inset-0 bg-[#FAFAFA] -z-50" />

      {/* Layer 2: Matrix Code */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-40 pointer-events-none"
      />

      {/* Layer 3: Ambient Light Blobs */}
      <div className="fixed inset-0 -z-30 pointer-events-none overflow-hidden">
        {/* Top-left blob */}
        <div 
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.06) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        {/* Bottom-right blob */}
        <div 
          className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.06) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
      </div>

      {/* Layer 4: Cursor Glow */}
      <div
        ref={cursorGlowRef}
        className="fixed w-[400px] h-[400px] -z-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.15s ease-out, top 0.15s ease-out'
        }}
      />
    </>
  );
}
