import { useState, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Icon from "@/components/ui/icon";

const WEDDING_DATE = new Date("2026-08-30T16:00:00");
const RSVP_URL = "https://functions.poehali.dev/a94d2141-f6b5-4e60-860b-2ecdc7bb5b3a";

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
      <div className="bg-white rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] flex items-center justify-center shadow-sm"
        style={{ border: "1px solid rgba(201,122,143,0.18)" }}>
        <span className="font-display text-4xl md:text-6xl font-light leading-none rose-text">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 text-xs md:text-sm font-body uppercase tracking-widest" style={{ color: "#b09aa0" }}>{label}</span>
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

const schedule = [
  { time: "15:30", icon: "Users", title: "Сбор гостей", desc: "Встреча и размещение гостей" },
  { time: "16:00", icon: "Heart", title: "Церемония бракосочетания", desc: "Выездная торжественная церемония" },
  { time: "17:00", icon: "Wine", title: "Фуршет", desc: "Лёгкие закуски и напитки под открытым небом" },
  { time: "18:00", icon: "UtensilsCrossed", title: "Начало банкета", desc: "Праздничный ужин, тосты и поздравления" },
  { time: "22:00", icon: "Cake", title: "Свадебный торт", desc: "Торжественная подача и разрез торта" },
  { time: "00:00", icon: "Star", title: "Завершение банкета", desc: "Финальный танец и прощание с гостями" },
];

export default function Index() {
  const timeLeft = useCountdown(WEDDING_DATE);
  const heroRef = useInView(0.1);
  const dateRef = useInView(0.2);
  const scheduleRef = useInView(0.1);
  const rsvpRef = useInView(0.2);
  const contactRef = useInView(0.2);

  const [form, setForm] = useState({ name: "", guests: "1", diet: "", message: "" });
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
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Не удалось отправить. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка сети. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-body overflow-x-hidden" style={{ background: "#fdf8f5" }}>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/32140290-44a5-4820-9999-7685a86ac4f3/files/307177ef-279e-473b-95e6-473d88ae6e3f.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <div className="absolute inset-0 z-0" style={{
          background: "linear-gradient(to bottom, rgba(253,248,245,0.15) 0%, rgba(253,244,240,0.1) 40%, rgba(253,248,245,0.92) 100%)"
        }} />

        <div ref={heroRef.ref} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body uppercase tracking-[0.5em] text-xs mb-8" style={{ color: "#c97a8f" }}>
              мы приглашаем вас
            </p>
          </div>

          <div className={`transition-all duration-1000 delay-200 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h1 className="font-display font-light leading-none mb-2 rose-shimmer" style={{ fontSize: "clamp(4rem, 12vw, 8rem)" }}>
              Игорь
            </h1>
            <div className="flex items-center justify-center gap-6 my-3">
              <div className="section-divider flex-1" />
              <span className="font-display text-3xl italic" style={{ color: "#c97a8f" }}>&amp;</span>
              <div className="section-divider flex-1" />
            </div>
            <h1 className="font-display font-light leading-none rose-shimmer" style={{ fontSize: "clamp(4rem, 12vw, 8rem)" }}>
              Ксения
            </h1>
          </div>

          <div className={`transition-all duration-1000 delay-500 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body mt-8 text-lg tracking-widest" style={{ color: "#9a7080" }}>
              30 августа 2026
            </p>
          </div>

          <div className={`transition-all duration-1000 delay-700 mt-10 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <a
              href="#rsvp"
              className="rose-btn inline-flex items-center gap-2 px-8 py-4 rounded-full font-body text-sm uppercase tracking-widest"
            >
              <Icon name="Heart" size={15} />
              Подтвердить присутствие
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <Icon name="ChevronDown" size={22} style={{ color: "#c97a8f" } as CSSProperties} />
        </div>
      </section>

      {/* ─── COUNTDOWN ─── */}
      <section className="py-20 px-6" style={{ background: "#fff" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body uppercase tracking-[0.3em] text-xs mb-3" style={{ color: "#c97a8f" }}>До торжества</p>
          <h2 className="font-display text-4xl md:text-5xl font-light mb-12 rose-text">Обратный отсчёт</h2>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <CountdownUnit value={timeLeft.days} label="дней" />
            <span className="font-display text-3xl mb-6" style={{ color: "#e8c0c8" }}>:</span>
            <CountdownUnit value={timeLeft.hours} label="часов" />
            <span className="font-display text-3xl mb-6" style={{ color: "#e8c0c8" }}>:</span>
            <CountdownUnit value={timeLeft.minutes} label="минут" />
            <span className="font-display text-3xl mb-6" style={{ color: "#e8c0c8" }}>:</span>
            <CountdownUnit value={timeLeft.seconds} label="секунд" />
          </div>
        </div>
      </section>

      {/* ─── DATE & PLACE ─── */}
      <section className="py-20 px-6" id="details" style={{ background: "#fdf8f5" }}>
        <div ref={dateRef.ref} className="max-w-5xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${dateRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body uppercase tracking-[0.3em] text-xs mb-3" style={{ color: "#c97a8f" }}>Когда и где</p>
            <h2 className="font-display text-4xl md:text-5xl font-light rose-text mb-3">Детали торжества</h2>
            <div className="section-divider mt-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "CalendarDays", title: "Дата", lines: ["30 августа 2026", "Воскресенье"] },
              { icon: "Clock", title: "Время", lines: ["Начало в 16:00", "Сбор гостей с 15:30"] },
              { icon: "MapPin", title: "Место", lines: ["Загородный клуб «Weekend»", "г. Ростов-на-Дону, ул. Левобережная, 47"] },
            ].map((item, i) => (
              <div
                key={i}
                className={`glass-card p-8 text-center transition-all duration-700 hover:-translate-y-1 ${dateRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "linear-gradient(135deg, #fde8ec, #fcd0d8)" }}>
                  <Icon name={item.icon} size={22} style={{ color: "#c97a8f" } as CSSProperties} />
                </div>
                <h3 className="font-body uppercase tracking-widest text-xs mb-3" style={{ color: "#c97a8f" }}>{item.title}</h3>
                {item.lines.map((l, j) => (
                  <p key={j} className={`font-display ${j === 0 ? "text-xl" : "text-sm mt-1"}`}
                    style={{ color: j === 0 ? "#3a2530" : "#9a7080" }}>{l}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCHEDULE ─── */}
      <section className="py-20 px-6" id="schedule" style={{ background: "#fff" }}>
        <div ref={scheduleRef.ref} className="max-w-2xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-700 ${scheduleRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body uppercase tracking-[0.3em] text-xs mb-3" style={{ color: "#c97a8f" }}>Программа</p>
            <h2 className="font-display text-4xl md:text-5xl font-light rose-text mb-3">Расписание дня</h2>
            <div className="section-divider mt-5" />
          </div>
          <div className="relative">
            <div className="absolute left-[2.25rem] top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(201,122,143,0.3) 10%, rgba(201,122,143,0.3) 90%, transparent)" }} />
            <div className="space-y-3">
              {schedule.map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-5 group transition-all duration-700 ${scheduleRef.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center z-10 transition-all"
                      style={{ background: "linear-gradient(135deg, #fde8ec, #fcd0d8)", border: "1px solid rgba(201,122,143,0.2)" }}>
                      <Icon name={item.icon} size={20} style={{ color: "#c97a8f" } as CSSProperties} />
                    </div>
                  </div>
                  <div className="glass-card flex-1 p-5 mb-1 group-hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-body font-semibold text-sm" style={{ color: "#c97a8f" }}>{item.time}</span>
                      <span className="w-3 h-px inline-block" style={{ background: "rgba(201,122,143,0.4)" }} />
                      <h3 className="font-display text-lg" style={{ color: "#3a2530" }}>{item.title}</h3>
                    </div>
                    <p className="font-body text-sm" style={{ color: "#9a7080" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── RSVP ─── */}
      <section className="py-20 px-6" id="rsvp" style={{ background: "#fdf8f5" }}>
        <div ref={rsvpRef.ref} className="max-w-xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${rsvpRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body uppercase tracking-[0.3em] text-xs mb-3" style={{ color: "#c97a8f" }}>Ответ гостя</p>
            <h2 className="font-display text-4xl md:text-5xl font-light rose-text mb-3">Подтверждение</h2>
            <div className="section-divider mt-5" />
            <p className="text-sm mt-5 font-body" style={{ color: "#b09aa0" }}>Просим подтвердить присутствие до 1 августа 2026</p>
          </div>

          {submitted ? (
            <div className="glass-card p-12 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, #fde8ec, #fcd0d8)" }}>
                <Icon name="Heart" size={32} style={{ color: "#c97a8f" } as CSSProperties} />
              </div>
              <h3 className="font-display text-3xl rose-text mb-3">Спасибо!</h3>
              <p className="font-body" style={{ color: "#9a7080" }}>Мы рады, что вы будете с нами в этот особенный день</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className={`glass-card p-8 space-y-5 transition-all duration-700 ${rsvpRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div>
                <label className="block font-body text-xs uppercase tracking-widest mb-2" style={{ color: "#b09aa0" }}>Ваше имя *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Иван Иванов"
                  className="w-full rounded-xl px-4 py-3 font-body focus:outline-none transition-all"
                  style={{ background: "#fdf0f3", border: "1px solid rgba(201,122,143,0.25)", color: "#3a2530" }}
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-widest mb-2" style={{ color: "#b09aa0" }}>Количество гостей</label>
                <select
                  value={form.guests}
                  onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 font-body focus:outline-none transition-all"
                  style={{ background: "#fdf0f3", border: "1px solid rgba(201,122,143,0.25)", color: "#3a2530" }}
                >
                  {["1", "2", "3", "4"].map(n => (
                    <option key={n} value={n}>{n} {n === "1" ? "гость" : "гостя"}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-widest mb-2" style={{ color: "#b09aa0" }}>Пожелания по меню</label>
                <input
                  value={form.diet}
                  onChange={e => setForm(f => ({ ...f, diet: e.target.value }))}
                  placeholder="Вегетарианское, аллергия..."
                  className="w-full rounded-xl px-4 py-3 font-body focus:outline-none transition-all"
                  style={{ background: "#fdf0f3", border: "1px solid rgba(201,122,143,0.25)", color: "#3a2530" }}
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-widest mb-2" style={{ color: "#b09aa0" }}>Пожелания молодожёнам</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Ваши тёплые слова..."
                  className="w-full rounded-xl px-4 py-3 font-body focus:outline-none transition-all resize-none"
                  style={{ background: "#fdf0f3", border: "1px solid rgba(201,122,143,0.25)", color: "#3a2530" }}
                />
              </div>
              {error && (
                <p className="text-sm text-center" style={{ color: "#c97a8f" }}>{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="rose-btn w-full py-4 rounded-xl font-body text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Icon name={loading ? "Loader2" : "Send"} size={16} className={loading ? "animate-spin" : ""} />
                {loading ? "Отправляем..." : "Подтвердить присутствие"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── CONTACTS ─── */}
      <section className="py-20 px-6" id="contacts" style={{ background: "#fff" }}>
        <div ref={contactRef.ref} className="max-w-3xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body uppercase tracking-[0.3em] text-xs mb-3" style={{ color: "#c97a8f" }}>Связь</p>
            <h2 className="font-display text-4xl md:text-5xl font-light rose-text mb-3">Контакты</h2>
            <div className="section-divider mt-5" />
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto transition-all duration-700 delay-200 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {[
              { label: "Телефон жениха", value: "+7 (904) 759-96-05", name: "Игорь" },
              { label: "Телефон невесты", value: "+7 (928) 624-77-38", name: "Ксения" },
            ].map((c, i) => (
              <a
                key={i}
                href={`tel:${c.value.replace(/\D/g, "")}`}
                className="glass-card p-6 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300 no-underline"
                style={{ textDecoration: "none" }}
              >
                <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #fde8ec, #fcd0d8)" }}>
                  <Icon name="Phone" size={20} style={{ color: "#c97a8f" } as CSSProperties} />
                </div>
                <div>
                  <p className="font-body text-xs uppercase tracking-wider mb-0.5" style={{ color: "#b09aa0" }}>{c.label}</p>
                  <p className="font-body font-medium" style={{ color: "#3a2530" }}>{c.value}</p>
                  <p className="font-body text-xs" style={{ color: "#c97a8f" }}>{c.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-6 text-center" style={{ borderTop: "1px solid rgba(201,122,143,0.15)" }}>
        <p className="font-display text-2xl rose-text mb-2">Игорь & Ксения</p>
        <p className="font-body text-sm" style={{ color: "#c9a0ae" }}>30 августа 2026 · с любовью ♡</p>
      </footer>
    </div>
  );
}