"use client";

import { useEffect } from "react";

type P = { x:number; y:number; vx:number; vy:number; life:number; size:number; hue:number; };

function rand(min:number, max:number){ return Math.random()*(max-min)+min; }

export default function SparksOnClick() {
  useEffect(() => {
    const canvas = document.getElementById("spark-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const sparks: P[] = [];

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (x:number, y:number) => {
      const n = 28;
      for (let i=0;i<n;i++){
        const a = rand(-Math.PI, Math.PI);
        const s = rand(3, 10);
        sparks.push({
          x, y,
          vx: Math.cos(a)*s,
          vy: Math.sin(a)*s - rand(1, 4),
          life: rand(18, 40),
          size: rand(1, 2.6),
          hue: rand(18, 45) // laranja/amarelo
        });
      }
    };

    const onClick = (ev: MouseEvent) => {
      const t = ev.target as HTMLElement | null;
      if (!t) return;

      const el = t.closest('[data-spark="1"], .steelBtn') as HTMLElement | null;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const x = r.left + r.width * 0.55;
      const y = r.top + r.height * 0.45;
      spawn(x, y);
    };

    window.addEventListener("click", onClick, true);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0,0, canvas.width, canvas.height);

      for (let i=sparks.length-1;i>=0;i--){
        const p = sparks[i];
        p.life -= 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;     // gravidade
        p.vx *= 0.98;
        p.vy *= 0.98;

        const alpha = Math.max(0, Math.min(1, p.life/40));
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();

        // risquinho (efeito faísca)
        ctx.strokeStyle = `hsla(${p.hue}, 100%, 70%, ${alpha*0.75})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx*1.8, p.y - p.vy*1.8);
        ctx.stroke();

        if (p.life <= 0) sparks.splice(i,1);
      }
    };
    tick();

    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
