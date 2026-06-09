import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Icon from "@/components/ui/icon";

const WEDDING_DATE = new Date("2026-08-30T16:00:00");
const RSVP_URL = "https://functions.poehali.dev/a94d2141-f6b5-4e60-860b-2ecdc7bb5b3a";

const BG_IMAGE = "https://cdn.poehali.dev/projects/32140290-44a5-4820-9999-7685a86ac4f3/files/fe90672b-dc76-4030-941c-f0e58a9662c5.jpg";

// Все цвета — бежево-тёплые тексты, зелёные акценты
const C = {
  // акценты
  olive:      "#4a5228",
  oliveMid:   "#6b7545",
  olivePale:  "#8a9460",
  sage:       "#a8b888",
  sagePale:   "rgba(168,184,136,0.18)",
  // тексты (бежевые оттенки)
  textStrong: "#e8dfc8",   // заголовки
  textMid:    "#d4c9a8",   // подзаголовки / italic
  textMuted:  "#b8ad90",   // подписи
  textLabel:  "#9e9478",   // лейблы форм
  // фоны
  cardBg:     "rgba(255,252,245,0.72)",
  inputBg:    "rgba(255,252,240,0.85)",
  sectionAlt: "rgba(168,184,136,0.12)",
  sectionWhite:"rgba(255,252,240,0.55)",
  // границы
  border:     "rgba(107,117,69,0.2)",
  borderMid:  "rgba(107,117,69,0.3)",
};

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

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

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useParallax() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return offset;
}

const schedule = [
  { time: "15:30", icon: "Users",           title: "Сбор гостей",              desc: "Встреча и размещение гостей" },
  { time: "16:00", icon: "Heart",           title: "Церемония бракосочетания", desc: "Выездная торжественная церемония" },
  { time: "16:50", icon: "UtensilsCrossed", title: "Начало банкета",            desc: "Праздничный ужин, тосты и поздравления" },
  { time: "22:00", icon: "Cake",            title: "Свадебный торт",            desc: "Торжественная подача и разрез торта" },
  { time: "00:00", icon: "Star",            title: "Завершение банкета",        desc: "Финальный танец и прощание с гостями" },
];

const palette = [
  { label: "Тёмно-зелёный", hex: "#1e4a30" },
  { label: "Оливковый",     hex: "#4a5228" },
  { label: "Пудровый",      hex: "#e8c8c0" },
  { label: "Голубой",       hex: "#b8cce0" },
  { label: "Ivory",         hex: "#f5f0e0" },
  { label: "Шоколадный",    hex: "#3e2010" },
  { label: "Бордо",         hex: "#6e1e2c" },
  { label: "Чёрный",        hex: "#1a1a1a" },
];

export default function Index() {
  const timeLeft    = useCountdown(WEDDING_DATE);
  const scrollY     = useParallax();
  const heroRef     = useInView(0.1);
  const dateRef     = useInView(0.2);
  const scheduleRef = useInView(0.1);
  const dressRef    = useInView(0.2);
  const mapRef      = useInView(0.2);
  const rsvpRef     = useInView(0.2);
  const contactRef  = useInView(0.2);

  const [form, setForm] = useState({ name: "", guests: "1", alcohol: "", accommodation: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(RSVP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
      else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch {
      setError("Ошибка сети. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: CSSProperties  = { background: C.inputBg, border: `1px solid ${C.borderMid}`, color: C.textStrong };
  const labelStyle: CSSProperties  = { color: C.textLabel };

  const globalBg: CSSProperties = {};

  return (
    <div className="min-h-screen font-body overflow-x-hidden relative bg-responsive-pattern" style={globalBg}>
      <style>{`
        .bg-responsive-pattern {
          background-image: url(${BG_IMAGE});
          background-size: 420px 420px;
          background-attachment: fixed;
          background-repeat: repeat;
        }
        @media (max-width: 640px) {
          .bg-responsive-pattern {
            background-size: 260px 260px;
            background-attachment: scroll;
          }
        }
      `}</style>

      {/* Постоянный тёмный оверлей поверх всей страницы */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: "linear-gradient(160deg, rgba(18,28,12,0.72) 0%, rgba(30,50,20,0.68) 50%, rgba(18,28,12,0.75) 100%)"
      }} />

      {/* ─── ЯКОРНОЕ МЕНЮ ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-3 px-4"
        style={{ background: "rgba(18,28,12,0.72)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(168,184,136,0.15)" }}>
        <ul className="flex flex-wrap justify-center gap-1 md:gap-2">
          {[
            { label: "Детали",     href: "#details"   },
            { label: "Программа",  href: "#schedule"  },
            { label: "Дресс-код",  href: "#dresscode" },
            { label: "Место",      href: "#map"       },
            { label: "Подтвердить",href: "#rsvp"      },
          ].map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                className="block px-3 py-1.5 rounded-full font-body text-xs uppercase tracking-widest transition-all duration-200 hover:opacity-100"
                style={{ color: "#c8bfa0", opacity: 0.75 }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(168,184,136,0.18)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Весь контент поверх оверлея */}
      <div className="relative z-10">

        {/* ─── HERO ─── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-12">
          {/* Параллакс-слой только для hero */}
          <div className="absolute inset-0 z-0 pointer-events-none" style={{
            backgroundImage: `url(${BG_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: `center ${50 + scrollY * 0.3}%`,
            opacity: 0,
          }} />

          <div ref={heroRef.ref} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <div className={`transition-all duration-1000 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <p className="font-body uppercase tracking-[0.5em] text-xs mb-8" style={{ color: C.textMuted }}>
                мы приглашаем вас
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
              <CountdownUnit value={timeLeft.days}    label="дней"    />
              <span className="font-display text-3xl mb-6" style={{ color: C.sage }}>:</span>
              <CountdownUnit value={timeLeft.hours}   label="часов"   />
              <span className="font-display text-3xl mb-6" style={{ color: C.sage }}>:</span>
              <CountdownUnit value={timeLeft.minutes} label="минут"   />
              <span className="font-display text-3xl mb-6" style={{ color: C.sage }}>:</span>
              <CountdownUnit value={timeLeft.seconds} label="секунд"  />
            </div>
          </div>
        </section>

        {/* ─── DATE & PLACE ─── */}
        <section className="py-20 px-6" id="details" style={{ background: C.sectionAlt }}>
          <div ref={dateRef.ref} className="max-w-5xl mx-auto">
            <div className={`text-center mb-14 transition-all duration-700 ${dateRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <p className="font-body uppercase tracking-[0.3em] text-xs mb-3" style={{ color: C.textMuted }}>Когда и где</p>
              <h2 className="font-display mb-3" style={{ fontSize: "clamp(2.5rem,6vw,4rem)", color: C.textStrong }}>Детали торжества</h2>
              <div className="section-divider mt-5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "CalendarDays", title: "Дата",  lines: ["30 августа 2026", "Воскресенье"] },
                { icon: "Clock",        title: "Время", lines: ["Сбор гостей с 15:30", "Начало в 16:00"] },
                { icon: "MapPin",       title: "Место", lines: ["Загородный клуб «Weekend»", "г. Ростов-на-Дону, ул. Левобережная, 47"] },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`glass-card p-8 text-center transition-all duration-700 hover:-translate-y-1 ${dateRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: C.sagePale, border: `1px solid ${C.border}` }}>
                    <Icon name={item.icon} size={22} style={{ color: C.sage } as CSSProperties} />
                  </div>
                  <h3 className="font-body uppercase tracking-widest text-xs mb-3" style={{ color: C.textMuted }}>{item.title}</h3>
                  {item.lines.map((l, j) => (
                    <p key={j} className={`font-body ${j === 0 ? "text-lg font-light" : "text-sm mt-1"}`}
                      style={{ color: j === 0 ? C.textStrong : C.textMid }}>{l}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SCHEDULE ─── */}
        <section className="py-20 px-6" id="schedule" style={{ background: C.sectionWhite }}>
          <div ref={scheduleRef.ref} className="max-w-2xl mx-auto">
            <div className={`text-center mb-14 transition-all duration-700 ${scheduleRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <p className="font-body uppercase tracking-[0.3em] text-xs mb-3" style={{ color: C.textMuted }}>Программа</p>
              <h2 className="font-display mb-3" style={{ fontSize: "clamp(2.5rem,6vw,4rem)", color: C.textStrong }}>Расписание дня</h2>
              <div className="section-divider mt-5" />
            </div>
            <div className="relative">
              <div className="absolute left-[2.25rem] top-0 bottom-0 w-px"
                style={{ background: `linear-gradient(to bottom, transparent, ${C.sage} 10%, ${C.sage} 90%, transparent)` }} />
              <div className="space-y-3">
                {schedule.map((item, i) => (
                  <div
                    key={i}
                    className={`flex gap-5 group transition-all duration-700 ${scheduleRef.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                    style={{ transitionDelay: `${i * 90}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center z-10 shadow-md"
                        style={{ background: "rgba(60,10,18,0.88)", border: "1px solid rgba(180,60,80,0.45)" }}>
                        <Icon name={item.icon} size={20} style={{ color: "#c8607a" } as CSSProperties} />
                      </div>
                    </div>
                    <div className="glass-card flex-1 p-5 mb-1 group-hover:-translate-y-0.5 transition-all duration-300">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-body text-sm tracking-widest" style={{ color: C.sage }}>{item.time}</span>
                        <span className="w-3 h-px inline-block" style={{ background: C.sage }} />
                        <h3 className="font-body font-light text-base" style={{ color: C.textStrong }}>{item.title}</h3>
                      </div>
                      <p className="font-body text-sm" style={{ color: C.textMuted }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── DRESS CODE ─── */}
        <section className="py-20 px-6" id="dresscode" style={{ background: C.sectionAlt }}>
          <div ref={dressRef.ref} className="max-w-xl mx-auto text-center">
            <div className={`transition-all duration-700 ${dressRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <p className="font-body uppercase tracking-[0.3em] text-xs mb-3" style={{ color: C.textMuted }}>Образ</p>
              <h2 className="font-display mb-3" style={{ fontSize: "clamp(2.5rem,6vw,4rem)", color: C.textStrong }}>Дресс-код</h2>
              <div className="section-divider mt-5" />
              <p className="font-body text-sm mt-6 mb-10" style={{ color: C.textMid }}>
                Будем рады, если ваш образ будет в гармонии с нашей цветовой палитрой
              </p>
            </div>
            <div className={`flex flex-wrap justify-center gap-6 transition-all duration-700 delay-200 ${dressRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {palette.map((c) => (
                <div key={c.label} className="flex flex-col items-center gap-2 w-16">
                  <div className="w-14 h-14 rounded-full shadow-md"
                    style={{ background: c.hex, border: "2px solid rgba(168,184,136,0.3)" }} />
                  <span className="font-body text-xs text-center leading-tight" style={{ color: C.textMuted }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MAP ─── */}
        <section className="py-20 px-6" id="map" style={{ background: C.sectionWhite }}>
          <div ref={mapRef.ref} className="max-w-4xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-700 ${mapRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <p className="font-body uppercase tracking-[0.3em] text-xs mb-3" style={{ color: C.textMuted }}>Как добраться</p>
              <h2 className="font-display mb-3" style={{ fontSize: "clamp(2.5rem,6vw,4rem)", color: C.textStrong }}>Место проведения</h2>
              <div className="section-divider mt-5" />
              <p className="font-body text-sm mt-4" style={{ color: C.textMid }}>
                Загородный клуб «Weekend» · г. Ростов-на-Дону, ул. Левобережная, 47
              </p>
            </div>
            <div className={`transition-all duration-700 delay-200 ${mapRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="rounded-2xl overflow-hidden shadow-md" style={{ border: `1px solid ${C.border}` }}>
                <iframe
                  title="Карта — Загородный клуб Weekend"
                  src="https://yandex.ru/map-widget/v1/?text=%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%94%D0%BE%D0%BD%D1%83%2C+%D1%83%D0%BB.+%D0%9B%D0%B5%D0%B2%D0%BE%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F%2C+47&z=15&l=map"
                  width="100%"
                  height="420"
                  style={{ display: "block", border: "none" }}
                  allowFullScreen
                />
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <a
                  href="https://yandex.ru/maps/?text=%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%94%D0%BE%D0%BD%D1%83%2C+%D1%83%D0%BB.+%D0%9B%D0%B5%D0%B2%D0%BE%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F%2C+47"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body text-sm uppercase tracking-widest transition-all hover:-translate-y-0.5"
                  style={{ background: C.oliveMid, color: C.textStrong, border: `1px solid ${C.border}` }}
                >
                  <Icon name="MapPin" size={15} />
                  Яндекс Карты
                </a>
                <a
                  href="https://maps.google.com/?q=Ростов-на-Дону,+ул.+Левобережная,+47"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body text-sm uppercase tracking-widest transition-all hover:-translate-y-0.5"
                  style={{ background: "transparent", color: C.textStrong, border: `1px solid ${C.border}` }}
                >
                  <Icon name="Globe" size={15} />
                  Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── RSVP ─── */}
        <section className="py-20 px-6" id="rsvp" style={{ background: C.sectionAlt }}>
          <div ref={rsvpRef.ref} className="max-w-xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-700 ${rsvpRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <p className="font-body uppercase tracking-[0.3em] text-xs mb-3" style={{ color: C.textMuted }}>Ответ гостя</p>
              <h2 className="font-display mb-3" style={{ fontSize: "clamp(2.5rem,6vw,4rem)", color: C.textStrong }}>Подтверждение</h2>
              <div className="section-divider mt-5" />
              <p className="text-sm mt-5 font-body" style={{ color: C.textMuted }}>Просим подтвердить присутствие до 1 августа 2026</p>
            </div>

            {submitted ? (
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: C.sagePale }}>
                  <Icon name="Heart" size={32} style={{ color: C.sage } as CSSProperties} />
                </div>
                <h3 className="font-display text-4xl mb-3" style={{ color: C.textStrong }}>Спасибо!</h3>
                <p className="font-body" style={{ color: C.textMid }}>Мы рады, что вы будете с нами в этот особенный день</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className={`glass-card p-8 space-y-5 transition-all duration-700 ${rsvpRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <div>
                  <label className="block font-body text-xs uppercase tracking-widest mb-2" style={labelStyle}>Ваше имя *</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Иван Иванов"
                    className="w-full rounded-xl px-4 py-3 font-body focus:outline-none transition-all"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-widest mb-2" style={labelStyle}>Количество гостей</label>
                  <select
                    value={form.guests}
                    onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 font-body focus:outline-none transition-all"
                    style={inputStyle}
                  >
                    {["1", "2", "3", "4"].map(n => (
                      <option key={n} value={n}>{n} {n === "1" ? "гость" : "гостя"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-widest mb-2" style={labelStyle}>Пожелания по алкоголю</label>
                  <input
                    value={form.alcohol}
                    onChange={e => setForm(f => ({ ...f, alcohol: e.target.value }))}
                    placeholder="Вино, шампанское, не пью..."
                    className="w-full rounded-xl px-4 py-3 font-body focus:outline-none transition-all"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-widest mb-3" style={labelStyle}>У вас есть где остановиться?</label>
                  <div className="flex gap-3">
                    {["Да", "Нет"].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, accommodation: opt }))}
                        className="flex-1 py-3 rounded-xl font-body text-sm uppercase tracking-widest transition-all duration-200"
                        style={form.accommodation === opt
                          ? { background: C.oliveMid, color: C.textStrong, border: `1px solid ${C.border}` }
                          : { background: "transparent", color: C.textMuted, border: `1px solid ${C.border}` }
                        }
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-center" style={{ color: C.sage }}>{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-body text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:-translate-y-0.5"
                  style={{ background: C.oliveMid, color: C.textStrong, boxShadow: `0 4px 20px rgba(74,82,40,0.35)`, border: `1px solid ${C.border}` }}
                >
                  <Icon name={loading ? "Loader2" : "Send"} size={16} className={loading ? "animate-spin" : ""} />
                  {loading ? "Отправляем..." : "Подтвердить присутствие"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ─── CONTACTS ─── */}
        <section className="py-20 px-6" id="contacts" style={{ background: C.sectionWhite }}>
          <div ref={contactRef.ref} className="max-w-3xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-700 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <p className="font-body uppercase tracking-[0.3em] text-xs mb-3" style={{ color: C.textMuted }}>Связь</p>
              <h2 className="font-display mb-3" style={{ fontSize: "clamp(2.5rem,6vw,4rem)", color: C.textStrong }}>Контакты</h2>
              <div className="section-divider mt-5" />
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto transition-all duration-700 delay-200 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {[
                { label: "Телефон жениха",  value: "+7 (904) 759-96-05", name: "Игорь"  },
                { label: "Телефон невесты", value: "+7 (928) 624-77-38", name: "Ксения" },
              ].map((c, i) => (
                <a
                  key={i}
                  href={`tel:${c.value.replace(/\D/g, "")}`}
                  className="glass-card p-6 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300"
                  style={{ textDecoration: "none" }}
                >
                  <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: C.sagePale, border: `1px solid ${C.border}` }}>
                    <Icon name="Phone" size={20} style={{ color: C.sage } as CSSProperties} />
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-wider mb-0.5" style={{ color: C.textMuted }}>{c.label}</p>
                    <p className="font-body font-light" style={{ color: C.textStrong }}>{c.value}</p>
                    <p className="font-body text-xs" style={{ color: C.sage }}>{c.name}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="py-12 px-6 text-center" style={{ borderTop: `1px solid ${C.border}`, background: C.sectionAlt }}>
          <p className="font-display text-4xl mb-2" style={{ color: C.textStrong }}>Игорь &amp; Ксения</p>
          <p className="font-body text-sm" style={{ color: C.textMuted }}>30 августа 2026 · с любовью ♡</p>
        </footer>

      </div>
    </div>
  );
}