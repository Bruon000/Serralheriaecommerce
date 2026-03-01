"use client";

import { useEffect } from "react";

type P = { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string };

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function SparksOnClick() {
  useEffect(() => {
    const canvas = document.getElementById("spark-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const particles: P[] = [];

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const colors = ["var(--spark1)", "var(--spark2)", "var(--spark3)"];

    function spawn(x: number, y: number) {
      // spray “solda”: mais pra direita e pra cima um pouco
      const count = Math.floor(rand(18, 28));
      for (let i = 0; i < count; i++) {
        const ang = rand(-0.25, 0.9); // leque
        const spd = rand(2.0, 6.5);
        particles.push({
          x,
          y,
          vx: Math.cos(ang) * spd * rand(0.9, 1.2),
          vy: Math.sin(ang) * spd * rand(0.9, 1.2) * -1,
          life: rand(18, 34),
          size: rand(1.2, 2.6),
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      // só dispara em elementos marcados (botões/links que a gente escolher)
      const el = t.closest('[data-spark="1"]') as HTMLElement | null;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const x = r.left + r.width * 0.75; // ponto “faísca” no botão
      const y = r.top + r.height * 0.55;
      spawn(x, y);
    };

    window.addEventListener("pointerdown", onPointerDown);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // desenha
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 1;

        // gravidade leve + arrasto
        p.vy += 0.18;
        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        const alpha = Math.max(0, Math.min(1, p.life / 28));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        // “risco” curto (spark)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // trail
        ctx.globalAlpha = alpha * 0.45;
        ctx.fillRect(p.x - p.vx * 1.8, p.y - p.vy * 1.8, 2, 2);

        if (p.life <= 0) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;
    };

    tick();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
