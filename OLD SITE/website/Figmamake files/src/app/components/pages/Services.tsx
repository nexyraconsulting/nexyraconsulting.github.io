import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

const SERVICES = [
  {
    id: 1,
    category: "Product",
    title: "UI/UX Product Design",
    desc: "Research-led design that turns complex user problems into intuitive digital experiences. We map user journeys, define information architecture, and craft high-fidelity interfaces that your team can ship with confidence — from initial wireframes through to developer-ready component specs.",
    tags: ["User Research", "Interaction Design", "Prototyping", "Usability Testing"],
  },
  {
    id: 2,
    category: "Product",
    title: "SaaS Product Design",
    desc: "SaaS products live or die by the quality of their experience. We design the flows, dashboards, and interaction patterns that drive activation, reduce churn, and make your product genuinely enjoyable to use — with a design system built to scale alongside your feature roadmap.",
    tags: ["Dashboard Design", "Onboarding Flows", "Feature Design", "Design Systems"],
  },
  {
    id: 3,
    category: "Product",
    title: "Enterprise Software Design",
    desc: "Large-scale business software demands a different design discipline. We bring the structure, patience, and systems thinking needed to design ERPs, CRMs, internal tools, and data-heavy platforms — making complexity navigable for the people who use them every day.",
    tags: ["Complex Systems", "Data Tables", "B2B UX", "Accessibility"],
  },
  {
    id: 4,
    category: "Brand",
    title: "Brand Design System",
    desc: "A single source of truth for how your brand looks and behaves across every product and platform. We build scalable design systems — documented components, tokens, patterns, and usage guidelines — that give your teams the tools to ship on-brand, consistently, at speed.",
    tags: ["Component Library", "Design Tokens", "Style Guide", "Figma System"],
  },
  {
    id: 5,
    category: "Brand",
    title: "Visual Identity & Branding",
    desc: "We create identities that hold up under scrutiny — distinctive, ownable, and built to scale from business card to billboard. Brand strategy, naming, logo system, colour and type, and a full set of usage guidelines delivered as a production-ready asset pack.",
    tags: ["Logo Design", "Brand Strategy", "Visual Language", "Brand Guidelines"],
  },
  {
    id: 6,
    category: "Digital",
    title: "Web & Landing Page Design",
    desc: "High-converting web experiences designed to communicate value clearly and drive action. From full marketing sites to campaign-specific landing pages, we design for the entire journey — structure, copy hierarchy, responsive layout, and handoff-ready specs for your development team.",
    tags: ["Marketing Sites", "Landing Pages", "CRO", "Responsive Design"],
  },
  {
    id: 7,
    category: "Digital",
    title: "Mobile App Design",
    desc: "Native-quality mobile experiences designed for the platforms your users actually live on. We design iOS and Android applications with platform conventions in mind — producing research-informed, prototype-tested screens your engineering team can build from with confidence.",
    tags: ["iOS & Android", "Native UX", "App Prototyping", "App Store Assets"],
  },
  {
    id: 8,
    category: "Digital",
    title: "E-commerce Design",
    desc: "Commerce experiences built around the buying decision. We design product discovery, category layouts, product detail pages, and checkout flows that reduce friction and increase conversion — optimised for mobile-first shopping behaviour and backed by UX best practice.",
    tags: ["Product Pages", "Checkout UX", "Conversion Optimisation", "Shopify"],
  },
  {
    id: 9,
    category: "Creative",
    title: "Motion Graphic Design",
    desc: "Motion that communicates, not just decorates. We create brand animations, explainer videos, UI micro-interactions, and social-ready content that bring your messaging to life — produced frame-by-frame with the same level of craft we apply to every static design deliverable.",
    tags: ["Brand Animation", "Explainer Videos", "UI Motion", "Social Content"],
  },
  {
    id: 10,
    category: "Creative",
    title: "Print, Merchandise & Packaging",
    desc: "Brand expression in the physical world. We design printed collateral, product packaging, merchandise, and branded materials that carry the same polish as your digital presence — supplied as print-ready artwork files for any supplier or production run.",
    tags: ["Print Design", "Packaging", "Merchandise", "Brand Collateral"],
  },
  {
    id: 11,
    category: "Creative",
    title: "Infographic & Data Visualization",
    desc: "Complex data made clear, compelling, and impossible to ignore. We design editorial infographics, statistical charts, and interactive data narratives that communicate insight at a glance — built for reports, presentations, media assets, and digital publications.",
    tags: ["Editorial Infographics", "Data Charts", "Interactive Dashboards", "Reports"],
  },
  {
    id: 12,
    category: "Creative",
    title: "Pitch Deck & Presentation Design",
    desc: "Presentations that command attention and move decisions forward. We design investor pitches, sales decks, board presentations, and keynote templates — structuring your story for clarity, then designing slides that make every point land with authority.",
    tags: ["Investor Decks", "Sales Presentations", "Keynote / PowerPoint", "Slide Templates"],
  },
];

export function Services() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e8ff" }}>
      {/* Header */}
      <section
        className="pt-32 pb-20 px-6 text-center relative overflow-hidden"
        aria-labelledby="services-heading"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace" }}>
            What We Do
          </p>
          <h1
            id="services-heading"
            className="text-4xl md:text-5xl mb-6"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: "#e8e8ff", lineHeight: 1.15 }}
          >
            Design, brand, and digital — built for every scale
          </h1>
          <p className="text-lg" style={{ color: "#8888bb", lineHeight: 1.7 }}>
            Twelve specialist services. One partner. From brand identity and product design to motion graphics and data visualisation — every capability your organisation needs, delivered to the same standard.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="px-6 pb-24" aria-label="Services list">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ id, category, title, desc, tags }) => (
              <article
                key={id}
                className="rounded-2xl p-8 flex flex-col gap-5 hover:border-[rgba(124,58,237,0.45)] transition-all duration-200 hover:-translate-y-0.5 group"
                style={{ background: "#08081a", border: "1px solid rgba(124,58,237,0.18)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="text-xs px-3 py-1 rounded-full uppercase tracking-widest"
                    style={{
                      background: "rgba(124,58,237,0.12)",
                      color: "#a78bfa",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 500,
                    }}
                  >
                    {category}
                  </span>
                  <span
                    className="text-xs opacity-40 group-hover:opacity-60 transition-opacity"
                    style={{ color: "#8888bb", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {String(id).padStart(2, "0")}
                  </span>
                </div>
                <h2
                  className="text-xl leading-snug"
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "#06060f", borderTop: "1px solid rgba(124,58,237,0.12)" }}
        aria-labelledby="services-cta"
      >
        <div className="max-w-2xl mx-auto">
          <h2
            id="services-cta"
            className="text-3xl md:text-4xl mb-4"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: "#e8e8ff" }}
          >
            Don't see exactly what you need?
          </h2>
          <p className="mb-8" style={{ color: "#8888bb" }}>
            We adapt to your brief. Book a call and we'll figure out the best approach together.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff", fontWeight: 700 }}
          >
            Talk to Us <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
