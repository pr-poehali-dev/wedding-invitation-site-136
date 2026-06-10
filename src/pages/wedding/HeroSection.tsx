import type { CSSProperties } from "react";
import Icon from "@/components/ui/icon";
import { C, BG_IMAGE, WEDDING_DATE, useCountdown, useInView, useParallax } from "./wedding-config";

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] flex items-center justify-center shadow-lg"
        style={{ background: "rgba(20,32,12,0.88)", border: "1px solid rgba(168,184,136,0.4)", backdropFilter: "blur(10px)" }}>
        <span className="font-display text-4xl md:text-6xl leading-none" style={{ color: "#e8dfc8" }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 text-xs font-body uppercase tracking-widest" style={{ color: "#6b7a40" }}>{label}</span>
    </div>
  );
}

export default function HeroSection() {
  const timeLeft  = useCountdown(WEDDING_DATE);
  const scrollY   = useParallax();
  const heroRef   = useInView(0.1);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-12">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: `center ${50 + scrollY * 0.3}%`,
          opacity: 0,
        }} />

        <div ref={heroRef.ref} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-display mb-6 max-w-sm mx-auto leading-snug" style={{ color: C.textMid, fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", fontStyle: "italic" }}>
              Приглашаем вас на торжество по случаю нашей свадьбы
            </p>
          </div>

          <div className={`transition-all duration-1000 delay-200 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h1 className="font-display leading-none mb-2" style={{ fontSize: "clamp(4rem, 13vw, 9rem)", color: C.textStrong }}>
              Игорь
            </h1>
            <div className="flex items-center justify-center gap-6 my-3">
              <div className="section-divider flex-1" />
              <span className="font-display text-4xl" style={{ color: C.textMid }}>&amp;</span>
              <div className="section-divider flex-1" />
            </div>
            <h1 className="font-display leading-none" style={{ fontSize: "clamp(4rem, 13vw, 9rem)", color: C.textStrong }}>
              Ксения
            </h1>
          </div>

          <div className={`transition-all duration-1000 delay-500 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body mt-8 text-lg tracking-[0.3em] uppercase" style={{ color: C.textMid }}>
              30 августа 2026
            </p>
          </div>

          <div className={`transition-all duration-1000 delay-700 mt-10 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <a
              href="#rsvp"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-body text-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-1"
              style={{ background: C.oliveMid, color: C.textStrong, boxShadow: `0 4px 20px rgba(74,82,40,0.4)`, border: `1px solid ${C.border}` }}
            >
              <Icon name="Heart" size={15} />
              Подтвердить присутствие
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <Icon name="ChevronDown" size={22} style={{ color: C.textMuted } as CSSProperties} />
        </div>
      </section>

      {/* ─── COUNTDOWN ─── */}
      <section className="py-20 px-6" style={{ background: C.sectionWhite }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body uppercase tracking-[0.3em] text-xs mb-3" style={{ color: C.textMuted }}>До торжества</p>
          <h2 className="font-display mb-12" style={{ fontSize: "clamp(2.5rem,6vw,4rem)", color: C.textStrong }}>Обратный отсчёт</h2>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <CountdownUnit value={timeLeft.days}    label="дней"   />
            <span className="font-display text-3xl mb-6" style={{ color: C.sage }}>:</span>
            <CountdownUnit value={timeLeft.hours}   label="часов"  />
            <span className="font-display text-3xl mb-6" style={{ color: C.sage }}>:</span>
            <CountdownUnit value={timeLeft.minutes} label="минут"  />
            <span className="font-display text-3xl mb-6" style={{ color: C.sage }}>:</span>
            <CountdownUnit value={timeLeft.seconds} label="секунд" />
          </div>
        </div>
      </section>
    </>
  );
}