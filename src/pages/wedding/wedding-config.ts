import { useState, useEffect, useRef } from "react";

export const WEDDING_DATE = new Date("2026-08-30T16:00:00+03:00");
export const RSVP_URL = "https://functions.poehali.dev/0dd5b90c-d39e-490c-a1f6-c76af69c88e5";

export const BG_IMAGE = "https://cdn.poehali.dev/projects/32140290-44a5-4820-9999-7685a86ac4f3/files/954c0db7-b763-4291-8c91-8007ceda3764.jpg";

export const C = {
  olive:       "#4a5228",
  oliveMid:    "#6b7545",
  olivePale:   "#8a9460",
  sage:        "#a8b888",
  sagePale:    "rgba(168,184,136,0.18)",
  textStrong:  "#e8dfc8",
  textMid:     "#d4c9a8",
  textMuted:   "#b8ad90",
  textLabel:   "#9e9478",
  cardBg:      "rgba(255,252,245,0.72)",
  inputBg:     "rgba(255,252,240,0.85)",
  sectionAlt:  "rgba(168,184,136,0.12)",
  sectionWhite:"rgba(255,252,240,0.55)",
  border:      "rgba(107,117,69,0.2)",
  borderMid:   "rgba(107,117,69,0.3)",
};

export const schedule = [
  { time: "15:30", icon: "Users",           title: "Сбор гостей",              desc: "Встреча гостей, фуршет" },
  { time: "16:00", icon: "Heart",           title: "Церемония бракосочетания", desc: "Выездная торжественная церемония" },
  { time: "16:50", icon: "UtensilsCrossed", title: "Начало банкета",            desc: "Праздничный ужин, тосты и поздравления" },
  { time: "22:00", icon: "Cake",            title: "Свадебный торт",            desc: "Торжественная подача и разрез торта" },
  { time: "00:00", icon: "Star",            title: "Завершение банкета",        desc: "Финальный танец и прощание с гостями" },
];

export const palette = [
  { label: "Тёмно-зелёный", hex: "#1e4a30" },
  { label: "Оливковый",     hex: "#4a5228" },
  { label: "Пудровый",      hex: "#e8c8c0" },
  { label: "Голубой",       hex: "#b8cce0" },
  { label: "Ivory",         hex: "#f5f0e0" },
  { label: "Шоколадный",    hex: "#3e2010" },
  { label: "Бордо",         hex: "#6e1e2c" },
  { label: "Чёрный",        hex: "#1a1a1a" },
];

export function useCountdown(targetDate: Date) {
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

export function useInView(threshold = 0.15) {
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

export function useParallax() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return offset;
}