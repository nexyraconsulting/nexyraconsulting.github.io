import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    title: "Orbitron — SaaS Dashboard",
    category: "UI/UX Design",
    tags: ["Product Design", "Design System", "SaaS"],
    desc: "End-to-end product redesign for a B2B analytics platform. We restructured the information architecture, rebuilt the design system, and shipped a dark-first interface that reduced user churn by 31%.",
    img: "https://images.unsplash.com/photo-1621111848501-8d3634f82336?w=800&h=500&fit=crop&auto=format",
    alt: "SaaS dashboard design displayed on a silver iMac",
    accent: "#7c3aed",
  },
  {
    id: 2,
    title: "Luminary — Brand Identity",
    category: "Brand Identity",
    tags: ["Branding", "Logo", "Guidelines"],
    desc: "Complete brand identity for a health-tech scale-up entering Series B. Logo family, color system, typography hierarchy, and a 60-page brand standards document.",
    img: "https://images.unsplash.com/photo-1716471330463-f475b00f0506?w=800&h=500&fit=crop&auto=format",
    alt: "Brand design materials spread across a desk",
    accent: "#3b82f6",
  },
  {
    id: 3,
    title: "Vanta — Motion Campaign",
    category: "Motion Design",
    tags: ["Animation", "Social", "Video"],
    desc: "Social media motion campaign across 12 formats for a logistics brand launch. 3D animated logo reveal, stories templates, and loop-ready background reels for event screens.",
    img: "https://images.unsplash.com/photo-1590102426275-8d1c367070d3?w=800&h=500&fit=crop&auto=format",
    alt: "Creative design and strategy materials on a desk",
    accent: "#a855f7",
  },
  {
    id: 4,
    title: "Pillar Kids — Web & Collateral",
    category: "Web Design",
    tags: ["Web Design", "Print", "Illustrations"],
    desc: "Marketing website and print collateral system for a children's education platform. Custom illustration library, responsive landing pages, and a downloadable resource kit.",
    img: "https://images.unsplash.com/photo-1627384113710-424c9181ebbb?w=800&h=500&fit=crop&auto=format",
    alt: "Colorful design layout with typography",
    accent: "#06b6d4",
  },
  {
    id: 5,
    title: "Axon — Enterprise Data Platform",
    category: "Enterprise UX",
    tags: ["Enterprise", "Complex Systems", "Accessibility"],
    desc: "UX redesign of an enterprise analytics suite serving 200+ concurrent users. Focus on data-table scalability, role-based layouts, and WCAG AA compliance throughout.",
    img: "https://images.unsplash.com/photo-1765539160785-e7953620488f?w=800&h=500&fit=crop&auto=format",
    alt: "Designer working at computer with creative setup",
    accent: "#7c3aed",
  },
  {
    id: 6,
    title: "Quantum — Investor Pitch Deck",
    category: "Presentation",
    tags: ["Pitch Deck", "Investor", "Storytelling"],
    desc: "Series A pitch deck for a deep-tech startup. 28 slides balancing technical depth with narrative clarity — the deck supported a $9M raise.",
    img: "https://images.unsplash.com/photo-1645658043538-fc2bb1702cfe?w=800&h=500&fit=crop&auto=format",
    alt: "A man holding a designing brand identity book",
    accent: "#3b82f6",
  },
];

const FILTER_OPTIONS = ["All", "UI/UX Design", "Brand Identity", "Motion Design", "Web Design", "Enterprise UX", "Presentation"];

export function Work() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e8ff" }}>
      {/* Header */}
      <section
        className="pt-32 pb-16 px-6 text-center relative overflow-hidden"
        aria-labelledby="work-heading"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace" }}>
            Portfolio
          </p>
          <h1
            id="work-heading"
            className="text-4xl md:text-5xl mb-6"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, color: "#e8e8ff", lineHeight: 1.15 }}
          >
            Work that speaks for itself
          </h1>
          <p className="text-lg" style={{ color: "#8888bb", lineHeight: 1.7 }}>
            A curated selection of brand, product, and motion projects delivered across industries and markets.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="px-6 mb-10" aria-label="Filter projects">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 justify-center">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className="text-sm px-4 py-2 rounded-full transition-all"
              style={{
                background: filter === opt ? "linear-gradient(135deg, #7c3aed, #3b82f6)" : "rgba(124,58,237,0.08)",
                color: filter === opt ? "#fff" : "#8888bb",
                border: filter === opt ? "none" : "1px solid rgba(124,58,237,0.2)",
                fontWeight: filter === opt ? 700 : 400,
                cursor: "pointer",
              }}
              aria-pressed={filter === opt}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      {/* Projects grid */}
      <section className="px-6 pb-24" aria-label="Project list">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(({ id, title, category, tags, desc, img, alt, accent }) => (
            <article
              key={id}
              className="rounded-2xl overflow-hidden flex flex-col group hover:border-[rgba(124,58,237,0.5)] transition-all hover:-translate-y-1 duration-200"
              style={{ background: "#08081a", border: "1px solid rgba(124,58,237,0.18)" }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/10", background: "#0d0d22" }}>
                <img
                  src={img}
                  alt={alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, rgba(8,8,26,0.7) 0%, transparent 60%)` }}
                />
              </div>
              <div className="p-7 flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "rgba(124,58,237,0.12)", color: "#a78bfa", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {category}
                  </span>
                </div>
                <h2
                  className="text-xl"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: "#e8e8ff" }}
                >
                  {title}
                </h2>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#8888bb" }}>{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(59,130,246,0.08)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.15)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "#06060f", borderTop: "1px solid rgba(124,58,237,0.12)" }}
        aria-labelledby="work-cta"
      >
        <div className="max-w-2xl mx-auto">
          <h2
            id="work-cta"
            className="text-3xl md:text-4xl mb-4"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, color: "#e8e8ff" }}
          >
            Your brand could be next.
          </h2>
          <p className="mb-8" style={{ color: "#8888bb" }}>
            Let's start with a conversation about where you want to take your brand.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff", fontWeight: 700 }}
          >
            Start a Project <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
