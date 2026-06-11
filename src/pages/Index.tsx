import { BG_IMAGE, C } from "./wedding/wedding-config";
import HeroSection from "./wedding/HeroSection";
import InfoSections from "./wedding/InfoSections";
import RsvpSection from "./wedding/RsvpSection";

export default function Index() {
  return (
    <div className="min-h-screen font-body overflow-x-hidden relative bg-responsive-pattern">
      <style>{`
        .bg-responsive-pattern {
          background-image: url(${BG_IMAGE});
          background-size: 1000px 1000px;
          background-attachment: fixed;
          background-repeat: repeat;
        }
        @media (max-width: 640px) {
          .bg-responsive-pattern {
            background-size: 520px 520px;
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
            { label: "Детали",       href: "#details"   },
            { label: "Программа",    href: "#schedule"  },
            { label: "Дресс-код",    href: "#dresscode" },
            { label: "Анкета гостя", href: "#rsvp"      },
            { label: "Место",        href: "#map"       },
            { label: "Контакты",     href: "#contacts"  },
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
        <HeroSection />
        <InfoSections />
        <RsvpSection />
      </div>
    </div>
  );
}