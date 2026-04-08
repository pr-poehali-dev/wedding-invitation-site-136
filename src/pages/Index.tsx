import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const WEDDING_DATE = new Date("2026-08-30T14:00:00");

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const prevRef = useRef({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
    const id = setInterval(() => {
      const next = calc();
      prevRef.current = timeLeft;
      setTimeLeft(next);
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return { timeLeft, prev: prevRef.current };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="glass-card px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] flex items-center justify-center relative overflow-hidden">
        <span className="font-display text-4xl md:text-6xl font-light gold-text leading-none">
          {String(value).padStart(2, "0")}
        </span>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at top, rgba(212,168,67,0.08) 0%, transparent 70%)"
        }} />
      </div>
      <span className="mt-2 text-xs md:text-sm font-body text-gold/60 uppercase tracking-widest">{label}</span>
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
  }, []);
  return { ref, inView };
}

const schedule = [
  { time: "14:00", icon: "Heart", title: "Церемония бракосочетания", desc: "Торжественная роспись в Дворце бракосочетания" },
  { time: "15:00", icon: "Camera", title: "Фотосессия", desc: "Прогулка и памятные фотографии молодожёнов" },
  { time: "16:30", icon: "UtensilsCrossed", title: "Встреча гостей", desc: "Торжественный приём в банкетном зале" },
  { time: "17:00", icon: "Music", title: "Праздничный банкет", desc: "Ужин, тосты и поздравления от близких" },
  { time: "19:00", icon: "Sparkles", title: "Первый танец", desc: "Вальс молодожёнов и открытие танцпола" },
  { time: "23:00", icon: "Star", title: "Торт и сюрпризы", desc: "Торжественный разрез свадебного торта" },
];

export default function Index() {
  const { timeLeft } = useCountdown(WEDDING_DATE);
  const heroRef = useInView(0.1);
  const dateRef = useInView(0.2);
  const scheduleRef = useInView(0.1);
  const rsvpRef = useInView(0.2);
  const contactRef = useInView(0.2);

  const [form, setForm] = useState({ name: "", guests: "1", diet: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-midnight font-body overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/32140290-44a5-4820-9999-7685a86ac4f3/files/24e5a6df-0786-4a62-9aa8-4a2cc1ccf957.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-1" style={{
          background: "linear-gradient(to bottom, rgba(10,10,20,0.55) 0%, rgba(10,10,20,0.3) 40%, rgba(10,10,20,0.75) 100%)"
        }} />

        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${2 + (i % 3) + 2}px`,
              height: `${2 + (i % 3) + 2}px`,
              background: `rgba(212, 168, 67, ${0.2 + (i % 5) * 0.1})`,
              left: `${(i * 8.3) % 100}%`,
              top: `${(i * 7.7) % 100}%`,
              animation: `float ${3 + (i % 4)}s ease-in-out ${(i % 3)}s infinite`,
            }}
          />
        ))}

        <div ref={heroRef.ref} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body text-gold/70 uppercase tracking-[0.4em] text-sm mb-6">
              С радостью приглашаем вас на
            </p>
          </div>

          <div className={`transition-all duration-1000 delay-200 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h1 className="font-display text-7xl md:text-9xl font-light leading-none mb-2 gold-shimmer">
              Игорь
            </h1>
            <div className="flex items-center justify-center gap-6 my-4">
              <div className="section-divider flex-1" />
              <span className="font-display text-3xl md:text-4xl italic text-gold-light/80">&amp;</span>
              <div className="section-divider flex-1" />
            </div>
            <h1 className="font-display text-7xl md:text-9xl font-light leading-none gold-shimmer">
              Ксения
            </h1>
          </div>

          <div className={`transition-all duration-1000 delay-500 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body text-foreground/60 mt-8 text-lg tracking-wide">
              30 августа 2026
            </p>
          </div>

          <div className={`transition-all duration-1000 delay-700 mt-12 ${heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <a
              href="#rsvp"
              className="gold-btn inline-flex items-center gap-2 px-8 py-4 rounded-full font-body font-semibold text-sm uppercase tracking-widest"
            >
              <Icon name="Heart" size={16} />
              Подтвердить присутствие
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <Icon name="ChevronDown" size={24} className="text-gold/50" />
        </div>
      </section>

      {/* ─── COUNTDOWN ─── */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, rgba(212,168,67,0.04) 0%, transparent 70%)"
        }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="font-body text-gold/60 uppercase tracking-[0.3em] text-xs mb-4">До торжества</p>
          <h2 className="font-display text-4xl md:text-5xl font-light gold-text mb-12">Обратный отсчёт</h2>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <CountdownUnit value={timeLeft.days} label="дней" />
            <span className="font-display text-3xl text-gold/40 mb-6">:</span>
            <CountdownUnit value={timeLeft.hours} label="часов" />
            <span className="font-display text-3xl text-gold/40 mb-6">:</span>
            <CountdownUnit value={timeLeft.minutes} label="минут" />
            <span className="font-display text-3xl text-gold/40 mb-6">:</span>
            <CountdownUnit value={timeLeft.seconds} label="секунд" />
          </div>
        </div>
      </section>

      {/* ─── DATE & PLACE ─── */}
      <section className="py-20 px-6" id="details">
        <div ref={dateRef.ref} className="max-w-5xl mx-auto">
          <div className={`text-center mb-14 transition-all duration-800 ${dateRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body text-gold/60 uppercase tracking-[0.3em] text-xs mb-4">Когда и где</p>
            <h2 className="font-display text-4xl md:text-5xl font-light gold-text mb-3">Детали торжества</h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "CalendarDays", title: "Дата", lines: ["30 августа 2026", "Воскресенье"] },
              { icon: "Clock", title: "Время", lines: ["Начало в 14:00", "Ждём вас заранее"] },
              { icon: "MapPin", title: "Место", lines: ["Банкетный зал «Изумруд»", "ул. Садовая, 15"] },
            ].map((item, i) => (
              <div
                key={i}
                className={`glass-card p-8 text-center transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(212,168,67,0.15)] ${dateRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.05))", border: "1px solid rgba(212,168,67,0.3)" }}>
                  <Icon name={item.icon} size={24} className="text-gold" />
                </div>
                <h3 className="font-body text-gold/70 uppercase tracking-widest text-xs mb-3">{item.title}</h3>
                {item.lines.map((l, j) => (
                  <p key={j} className={`font-display text-xl ${j === 0 ? "text-foreground" : "text-foreground/50 text-base"}`}>{l}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCHEDULE ─── */}
      <section className="py-20 px-6 relative" id="schedule">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, transparent, rgba(212,168,67,0.03) 50%, transparent)"
        }} />
        <div ref={scheduleRef.ref} className="max-w-2xl mx-auto relative z-10">
          <div className={`text-center mb-14 transition-all duration-800 ${scheduleRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body text-gold/60 uppercase tracking-[0.3em] text-xs mb-4">Программа</p>
            <h2 className="font-display text-4xl md:text-5xl font-light gold-text mb-3">Расписание дня</h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="relative">
            <div className="absolute left-[2.25rem] top-0 bottom-0 w-px" style={{
              background: "linear-gradient(to bottom, transparent, rgba(212,168,67,0.4) 10%, rgba(212,168,67,0.4) 90%, transparent)"
            }} />
            <div className="space-y-2">
              {schedule.map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-5 group transition-all duration-700 ${scheduleRef.inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-[4.5rem] h-[4.5rem] rounded-full glass-card flex items-center justify-center z-10 transition-all">
                      <Icon name={item.icon} size={20} className="text-gold" />
                    </div>
                  </div>
                  <div className="glass-card flex-1 p-5 mb-2 group-hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-body text-gold font-semibold text-sm">{item.time}</span>
                      <span className="w-4 h-px bg-gold/30" />
                      <h3 className="font-display text-lg text-foreground">{item.title}</h3>
                    </div>
                    <p className="font-body text-foreground/50 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── RSVP ─── */}
      <section className="py-20 px-6" id="rsvp">
        <div ref={rsvpRef.ref} className="max-w-xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-800 ${rsvpRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body text-gold/60 uppercase tracking-[0.3em] text-xs mb-4">Ответ гостя</p>
            <h2 className="font-display text-4xl md:text-5xl font-light gold-text mb-3">Подтверждение</h2>
            <div className="section-divider mt-6" />
            <p className="text-foreground/50 text-sm mt-6 font-body">Просим подтвердить присутствие до 1 августа 2026</p>
          </div>

          {submitted ? (
            <div className="glass-card p-12 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.3), rgba(212,168,67,0.1))", border: "1px solid rgba(212,168,67,0.4)" }}>
                <Icon name="Heart" size={32} className="text-gold" />
              </div>
              <h3 className="font-display text-3xl gold-text mb-3">Спасибо!</h3>
              <p className="font-body text-foreground/60">Мы рады, что вы будете с нами в этот особенный день</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className={`glass-card p-8 space-y-5 transition-all duration-700 ${rsvpRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div>
                <label className="block font-body text-foreground/60 text-xs uppercase tracking-widest mb-2">Ваше имя *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Иван Иванов"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-body text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                />
              </div>
              <div>
                <label className="block font-body text-foreground/60 text-xs uppercase tracking-widest mb-2">Количество гостей</label>
                <select
                  value={form.guests}
                  onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
                  className="w-full border border-white/10 rounded-xl px-4 py-3 font-body text-foreground focus:outline-none focus:border-gold/50 transition-all"
                  style={{ background: "rgba(26,26,46,0.95)" }}
                >
                  {["1", "2", "3", "4"].map(n => (
                    <option key={n} value={n}>{n} {n === "1" ? "гость" : "гостя"}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-body text-foreground/60 text-xs uppercase tracking-widest mb-2">Пожелания по меню</label>
                <input
                  value={form.diet}
                  onChange={e => setForm(f => ({ ...f, diet: e.target.value }))}
                  placeholder="Вегетарианское, аллергия..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-body text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                />
              </div>
              <div>
                <label className="block font-body text-foreground/60 text-xs uppercase tracking-widest mb-2">Пожелания молодожёнам</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Ваши тёплые слова..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-body text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all resize-none"
                />
              </div>
              <button type="submit" className="gold-btn w-full py-4 rounded-xl font-body font-semibold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                <Icon name="Send" size={16} />
                Подтвердить присутствие
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── CONTACTS ─── */}
      <section className="py-20 px-6" id="contacts">
        <div ref={contactRef.ref} className="max-w-3xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-800 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="font-body text-gold/60 uppercase tracking-[0.3em] text-xs mb-4">Связь</p>
            <h2 className="font-display text-4xl md:text-5xl font-light gold-text mb-3">Контакты</h2>
            <div className="section-divider mt-6" />
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 delay-200 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {[
              { icon: "Phone", label: "Телефон жениха", value: "+7 (999) 123-45-67", name: "Игорь" },
              { icon: "Phone", label: "Телефон невесты", value: "+7 (999) 765-43-21", name: "Ксения" },
              { icon: "MessageCircle", label: "WhatsApp / Telegram", value: "@wedding_igor_ksenia", name: "Организаторы" },
              { icon: "Mail", label: "Электронная почта", value: "wedding@example.com", name: "По всем вопросам" },
            ].map((c, i) => (
              <div key={i} className="glass-card p-6 flex items-center gap-5 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(212,168,67,0.12)] transition-all duration-300">
                <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.05))", border: "1px solid rgba(212,168,67,0.3)" }}>
                  <Icon name={c.icon} size={20} className="text-gold" />
                </div>
                <div>
                  <p className="font-body text-foreground/40 text-xs uppercase tracking-wider mb-0.5">{c.label}</p>
                  <p className="font-body text-foreground font-medium">{c.value}</p>
                  <p className="font-body text-gold/60 text-xs">{c.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-6 text-center border-t border-white/5">
        <p className="font-display text-2xl gold-text mb-2">Игорь & Ксения</p>
        <p className="font-body text-foreground/30 text-sm">30 августа 2026 · С любовью ❤️</p>
      </footer>
    </div>
  );
}