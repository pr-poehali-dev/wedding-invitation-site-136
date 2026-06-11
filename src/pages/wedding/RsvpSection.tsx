import { useState } from "react";
import type { CSSProperties } from "react";
import Icon from "@/components/ui/icon";
import { C, RSVP_URL, useInView } from "./wedding-config";

export default function RsvpSection() {
  const rsvpRef    = useInView(0.2);
  const contactRef = useInView(0.2);
  const mapRef     = useInView(0.2);

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

  const inputStyle: CSSProperties = { background: C.inputBg, border: `1px solid ${C.borderMid}`, color: C.textStrong };
  const labelStyle: CSSProperties = { color: C.textLabel };

  return (
    <>
      {/* ─── RSVP ─── */}
      <section className="py-20 px-6" id="rsvp" style={{ background: C.sectionAlt }}>
        <div ref={rsvpRef.ref} className="max-w-xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${rsvpRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

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

      {/* ─── MAP ─── */}
      <section className="py-20 px-6" id="map" style={{ background: C.sectionAlt }}>
        <div ref={mapRef.ref} className="max-w-4xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${mapRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

            <h2 className="font-display mb-3" style={{ fontSize: "clamp(2.5rem,6vw,4rem)", color: C.textStrong }}>Место проведения</h2>
            <div className="section-divider mt-5" />
            <p className="font-body text-sm mt-4" style={{ color: "ivory" }}>
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

      {/* ─── CONTACTS ─── */}
      <section className="py-20 px-6" id="contacts" style={{ background: C.sectionWhite }}>
        <div ref={contactRef.ref} className="max-w-3xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${contactRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

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
    </>
  );
}