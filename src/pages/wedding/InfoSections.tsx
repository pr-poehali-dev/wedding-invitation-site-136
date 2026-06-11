import type { CSSProperties } from "react";
import Icon from "@/components/ui/icon";
import { C, schedule, palette, useInView } from "./wedding-config";

export default function InfoSections() {
  const dateRef     = useInView(0.2);
  const scheduleRef = useInView(0.1);
  const dressRef    = useInView(0.2);
  const mapRef      = useInView(0.2);

  return (
    <>
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
            <p className="font-body text-sm mt-6 mb-10 leading-relaxed" style={{ color: C.textMid }}>
              Мы будем рады, если вы выберете наряды пастельных тонов, которые отлично гармонируют с концепцией нашего торжества<br className="hidden md:block" /> (ниже продемонстрированы примерные оттенки)
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
            <p className="font-body text-sm mt-4" style={{ color: C.olive }}>
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
    </>
  );
}