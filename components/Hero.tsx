"use client";
import { useEffect, useRef } from "react";
import { ArrowDown, Terminal } from "lucide-react";
import { useTheme } from "@/theme";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      hue: "cyan" | "mag";
    };
    const particles: P[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.8 + 0.4,
      hue: Math.random() > 0.5 ? "cyan" : "mag",
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Particle opacity reduced in light mode for readability
      const opacity = isDark ? 0.55 : 0.35;
      const lineOpacity = isDark ? 0.14 : 0.09;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === "cyan"
            ? `rgba(43,233,240,${opacity})`
            : `rgba(252,33,209,${opacity * 0.9})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            const a = lineOpacity * (1 - d / 120);
            const bothC =
              particles[i].hue === "cyan" && particles[j].hue === "cyan";
            const bothM =
              particles[i].hue === "mag" && particles[j].hue === "mag";
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = bothC
              ? `rgba(43,233,240,${a})`
              : bothM
                ? `rgba(252,33,209,${a})`
                : `rgba(150,130,210,${a * 0.8})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [isDark]);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden no-transition"
      style={{ backgroundColor: "var(--bg-0)" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-70 no-transition"
      />
      <div className="absolute inset-0 bg-grid opacity-100" />

      {/* Dual corner glows */}
      <div
        className="absolute top-0 left-0 w-[700px] h-[500px]"
        style={{
          background: `radial-gradient(ellipse at 20% 10%, var(--hero-glow-c) 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[500px]"
        style={{
          background: `radial-gradient(ellipse at 80% 90%, var(--hero-glow-m) 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Tag pill */}
        <div
          className="inline-flex items-center gap-2.5 mb-10 px-4 py-2 rounded-full border"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "color-mix(in srgb, var(--bg-0) 70%, transparent)",
          }}
        >
          <Terminal className="w-3.5 h-3.5" style={{ color: "var(--cyan)" }} />
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--tx-3)" }}
          >
            Cybersecurity Ops · Alberton, South Africa
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse-slow"
            style={{ backgroundColor: "var(--cyan)" }}
          />
        </div>

        {/* Headline */}
        <h1 className="font-display font-extrabold leading-[0.92] tracking-tight mb-8">
          <span
            className="block text-[clamp(3.5rem,10vw,7.5rem)]"
            style={{ color: "var(--tx-0)" }}
          >
            watch.
          </span>
          <span className="block text-[clamp(3.5rem,10vw,7.5rem)] text-brand">
            safeguard.
          </span>
          <span
            className="block text-[clamp(3rem,8vw,6rem)] opacity-60"
            style={{ color: "var(--tx-0)" }}
          >
            your assets.
          </span>
        </h1>

        <p
          className="font-mono text-sm md:text-base mb-12 max-w-lg mx-auto leading-relaxed"
          style={{ color: "var(--tx-3)" }}
        >
          <span style={{ color: "var(--cyan)" }}>{"{ "}</span>
          We confidently protect your business.
          <span style={{ color: "var(--magenta)" }}>{" }"}</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-sm hover:opacity-90 transition-opacity glow-cyan"
            style={{ background: "var(--grad)", color: "var(--bg-0)" }}
          >
            Explore Services
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-display font-medium text-sm border transition-all"
            style={{ color: "var(--tx-1)", borderColor: "var(--border-b)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--cyan)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(43,233,240,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--tx-1)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--border-b)";
            }}
          >
            Start a Secure Project
          </a>
        </div>

        <div
          className="mt-16 font-mono text-xs hidden sm:block"
          style={{ color: "var(--tx-3)" }}
        >
          <span style={{ color: "var(--cyan)" }}>$</span> muchatech --init
          protection --region ZA
          <span className="cursor" />
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-colors"
        style={{ color: "var(--tx-3)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--tx-3)")}
      >
        <span className="font-mono text-xs tracking-widest uppercase">
          scroll
        </span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
}
