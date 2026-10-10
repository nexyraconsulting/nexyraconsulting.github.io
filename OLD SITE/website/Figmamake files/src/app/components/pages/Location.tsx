import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { MapPin, Clock, Mail, Phone, Globe, ArrowUpRight, X } from "lucide-react";
import { Link } from "react-router";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const LOCATIONS = [
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    flag: "🇬🇧",
    coordinates: [-0.1278, 51.5074] as [number, number],
    address: "12 Boveney Close, Slough, SL1 9BJ",
    timezone: "GMT / BST (UTC+0/+1)",
    email: "hello@nexyraconsulting.co.uk",
    phone: "+44 74151 71157",
    status: "active" as const,
    description: "Our headquarters and primary creative hub, serving clients across Europe and the Americas.",
    pinColor: "#9333EA",
  },
  {
    id: "kolkata",
    city: "Kolkata",
    country: "India",
    flag: "🇮🇳",
    coordinates: [88.3639, 22.5726] as [number, number],
    address: "N-188/1 Mudiali 1st Lane, Garden Reach, Kolkata - 700024",
    timezone: "IST (UTC+5:30)",
    email: "india@nexyraconsulting.co.uk",
    phone: "+91 9035940404",
    status: "active" as const,
    description: "Our Asia-Pacific delivery centre, home to our motion and product design teams.",
    pinColor: "#2563EB",
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    coordinates: [55.2708, 25.2048] as [number, number],
    address: "Business Bay, Dubai, UAE",
    timezone: "GST (UTC+4)",
    email: null,
    phone: null,
    status: "upcoming" as const,
    description: "Our upcoming Middle East hub — set to open Q3 2025 to serve the MENA region.",
    pinColor: "#6b7280",
  },
];

export function Location() {
  const [tapped, setTapped] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>("london");

  const tappedLoc = LOCATIONS.find((l) => l.id === tapped) ?? null;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e8ff", background: "#04040f" }}>

      {/* ── HEADER ── */}
      <section
        className="pt-32 pb-10 px-6 text-center relative overflow-hidden"
        aria-labelledby="location-heading"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(147,51,234,0.18) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#9333EA", fontFamily: "'JetBrains Mono', monospace" }}>
            Global Presence
          </p>
          <h1
            id="location-heading"
            className="text-4xl md:text-5xl mb-5"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, color: "#e8e8ff", lineHeight: 1.15 }}
          >
            Where we operate
          </h1>
          <p className="text-lg" style={{ color: "#8888bb", lineHeight: 1.7 }}>
            Two active studios, one on the horizon — delivering world-class design across every timezone.
          </p>
        </div>
      </section>

      {/* ── STATUS PILLS ── */}
      <section className="px-6 mb-5" aria-label="Location status summary">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-3">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => {
                setActiveId(loc.id);
                setTapped(loc.id);
              }}
              aria-pressed={activeId === loc.id}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm transition-all cursor-pointer"
              style={{
                background: activeId === loc.id
                  ? loc.status === "active" ? "rgba(147,51,234,0.18)" : "rgba(107,114,128,0.15)"
                  : "rgba(255,255,255,0.03)",
                border: activeId === loc.id
                  ? loc.status === "active" ? "1px solid rgba(147,51,234,0.5)" : "1px solid rgba(107,114,128,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: activeId === loc.id ? "#e8e8ff" : "#8888bb",
              }}
            >
              <span>{loc.flag}</span>
              <span style={{ fontWeight: activeId === loc.id ? 600 : 400 }}>{loc.city}</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: loc.status === "active" ? "rgba(34,197,94,0.12)" : "rgba(107,114,128,0.15)",
                  color: loc.status === "active" ? "#86efac" : "#9ca3af",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {loc.status === "active" ? "Active" : "Soon"}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="px-4 md:px-8 pb-8" aria-label="Interactive world map">
        <div
          className="rounded-2xl overflow-hidden relative select-none"
          style={{
            background: "#06060f",
            border: "1px solid rgba(147,51,234,0.18)",
            boxShadow: "0 0 80px rgba(147,51,234,0.08) inset",
          }}
        >
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 50% 30% at 50% 60%, rgba(147,51,234,0.05) 0%, transparent 70%)" }}
          />

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 140, center: [30, 25] }}
            style={{ width: "100%", height: "auto" }}
          >
            <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={6} translateExtent={[[-200, -100], [1200, 700]]}>

              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#0e0e24"
                      stroke="rgba(147,51,234,0.2)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover:   { fill: "#14143a", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {LOCATIONS.map((loc) => {
                const isActive = loc.status === "active";
                const isHighlighted = activeId === loc.id;

                return (
                  <Marker
                    key={loc.id}
                    coordinates={loc.coordinates}
                    style={{ cursor: isActive ? "pointer" : "default" }}
                    onClick={(evt: React.MouseEvent) => {
                      evt.stopPropagation();
                      setActiveId(loc.id);
                      setTapped((prev) => (prev === loc.id ? null : loc.id));
                    }}
                  >
                    {/* Pulse rings — active & highlighted */}
                    {isActive && isHighlighted && (
                      <>
                        <circle r="6" fill="none" stroke={loc.pinColor} strokeWidth="1.2" opacity="0.7">
                          <animate attributeName="r" from="6" to="24" dur="1.8s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.6" to="0" dur="1.8s" repeatCount="indefinite" />
                        </circle>
                        <circle r="6" fill="none" stroke={loc.pinColor} strokeWidth="1" opacity="0.5">
                          <animate attributeName="r" from="6" to="18" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.4" to="0" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                    {/* Idle ring for active locations */}
                    {isActive && !isHighlighted && (
                      <circle r="9" fill="none" stroke={loc.pinColor} strokeWidth="0.8" opacity="0.25" />
                    )}

                    {/* Core dot */}
                    <circle
                      r={isHighlighted ? 6 : 4.5}
                      fill={isActive ? loc.pinColor : "#4b5563"}
                      stroke={isHighlighted ? "#e8e8ff" : "rgba(232,232,255,0.25)"}
                      strokeWidth={isHighlighted ? 1.5 : 1}
                      style={{ transition: "r 0.2s ease, stroke-width 0.2s ease" }}
                    />

                    {/* Label */}
                    <text
                      textAnchor="middle"
                      y={isHighlighted ? -16 : -12}
                      style={{
                        fontFamily: "'Hanken Grotesk', sans-serif",
                        fontSize: isHighlighted ? "9.5px" : "7.5px",
                        fontWeight: isHighlighted ? 700 : 400,
                        fill: !isActive ? "#6b7280" : isHighlighted ? "#e8e8ff" : "#a78bfa",
                        pointerEvents: "none",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {loc.city}
                    </text>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Map hint */}
          <p className="absolute bottom-3 right-4 text-xs" style={{ color: "#555577", fontFamily: "'JetBrains Mono', monospace" }}>
            Scroll to zoom · Drag to pan
          </p>
        </div>
      </section>

      {/* ── MOBILE TAP PANEL ── */}
      {tappedLoc && (
        <section
          className="px-4 pb-6"
          aria-label={`${tappedLoc.city} contact details`}
        >
          <div
            className="rounded-2xl p-6 relative"
            style={{
              background: "rgba(8,8,26,0.98)",
              border: "1px solid rgba(147,51,234,0.4)",
              boxShadow: "0 0 40px rgba(147,51,234,0.1)",
            }}
          >
            <button
              onClick={() => setTapped(null)}
              className="absolute top-4 right-4"
              aria-label="Close"
              style={{ color: "#555577", background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span style={{ fontSize: "1.6rem" }}>{tappedLoc.flag}</span>
              <div>
                <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#e8e8ff" }}>
                  {tappedLoc.city}
                </p>
                <p style={{ fontSize: "0.7rem", color: "#8888bb" }}>{tappedLoc.country}</p>
              </div>
              <span
                className="ml-auto text-xs px-2.5 py-1 rounded-full shrink-0"
                style={{
                  background: tappedLoc.status === "active" ? "rgba(34,197,94,0.12)" : "rgba(107,114,128,0.15)",
                  color: tappedLoc.status === "active" ? "#86efac" : "#9ca3af",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {tappedLoc.status === "active" ? "● Active" : "○ Upcoming"}
              </span>
            </div>

            <div style={{ height: 1, background: "rgba(147,51,234,0.18)", marginBottom: "16px" }} />

            <p className="text-sm mb-4 leading-relaxed" style={{ color: "#8888bb" }}>
              {tappedLoc.description}
            </p>

            <div className="flex flex-col gap-3">
              <LocationRow icon={<MapPin size={14} />} text={tappedLoc.address} />
              <LocationRow icon={<Clock size={14} />} text={tappedLoc.timezone} />
              {tappedLoc.status === "active" && tappedLoc.email && (
                <LocationRow icon={<Mail size={14} />} text={tappedLoc.email} href={`mailto:${tappedLoc.email}`} />
              )}
              {tappedLoc.status === "active" && tappedLoc.phone && (
                <LocationRow icon={<Phone size={14} />} text={tappedLoc.phone} href={`tel:${tappedLoc.phone.replace(/\s/g, "")}`} />
              )}
              {tappedLoc.status === "upcoming" && (
                <LocationRow icon={<Globe size={14} />} text="Opening soon — stay tuned" muted />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section
        className="py-20 px-6 text-center relative overflow-hidden"
        style={{ borderTop: "1px solid rgba(147,51,234,0.12)" }}
        aria-labelledby="location-cta"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(147,51,234,0.12) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 id="location-cta" className="text-3xl md:text-4xl mb-4"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, color: "#e8e8ff" }}>
            Work with us from anywhere
          </h2>
          <p className="mb-8" style={{ color: "#8888bb" }}>
            Timezone gaps don't stop great design. Get in touch and we'll find the right cadence for your team.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full transition-all hover:opacity-90"
            style={{ background: "linear-gradient(to right, #9333EA, #2563EB)", color: "#fff", fontWeight: 700 }}
          >
            Get in Touch <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ── Helper component ────────────────────────────────────────────────────── */

function LocationRow({
  icon, text, href, muted = false,
}: { icon: React.ReactNode; text: string; href?: string; muted?: boolean }) {
  const content = (
    <div className="flex items-start gap-3">
      <span style={{ color: "#9333EA", marginTop: "2px", flexShrink: 0 }}>{icon}</span>
      <span className="text-sm" style={{ color: muted ? "#6b7280" : "#c4c4e8", lineHeight: 1.5 }}>{text}</span>
    </div>
  );
  return href
    ? <a href={href} className="hover:text-white transition-colors">{content}</a>
    : <div>{content}</div>;
}
