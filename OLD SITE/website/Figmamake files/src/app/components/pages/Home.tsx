import { Link } from "react-router";
import { ArrowUpRight, CheckCircle2, Star, ChevronRight, Target, Layers, Shield } from "lucide-react";
import { useState } from "react";

const SERVICES = [
  "Brand Management & Governance",
  "Custom Software Development",
  "UI/UX & Product Design",
  "Mobile App & Website",
  "SaaS Product",
  "Enterprise Software",
  "Digital Transformation",
  "IT Consulting",
  "Technology Strategy",
  "E-commerce",
  "Creative Production",
  "AI-Enabled Products",
];

const TESTIMONIALS = [
  {
    name: "Priya Anand",
    role: "Head of Product",
    company: "Luminary Health",
    rating: 5,
    text: "NEXYRA rebuilt our patient-facing platform end to end — discovery, UX design, frontend engineering, and API integration. Their ability to operate across strategy, design, and development without losing quality at any layer was genuinely impressive.",
  },
  {
    name: "Marcus Veil",
    role: "Founder & CEO",
    company: "Orbitron SaaS",
    rating: 5,
    text: "We needed to move from a functional MVP to an enterprise-ready product — technically and from a user experience perspective. NEXYRA handled the full scope: architecture review, product redesign, and development. The outcome exceeded what we thought was achievable on our timeline.",
  },
  {
    name: "Selena Tran",
    role: "Chief Operating Officer",
    company: "Vanta Logistics",
    rating: 5,
    text: "NEXYRA embedded with our team, understood our operational complexity, and delivered a platform that reduced manual processing time by over 60%. They didn't just build what we asked for — they challenged our assumptions and built what we actually needed.",
  },
  {
    name: "Daniel Rosner",
    role: "CTO",
    company: "Quantum Factor",
    rating: 5,
    text: "What struck me most was how NEXYRA balanced architectural rigour with a sharp focus on usability. Every system they designed cleared our security review and our engineering team could maintain it from day one.",
  },
  {
    name: "Amara Osei",
    role: "Digital Transformation Director",
    company: "Pillar Group",
    rating: 5,
    text: "Working with NEXYRA on our digital transformation gave us confidence at every stage. They understood our sector constraints, asked the right questions early, and delivered a platform our operations team adopted from day one.",
  },
  {
    name: "Lena Volkov",
    role: "VP Product",
    company: "Axon Analytics",
    rating: 5,
    text: "NEXYRA doesn't just execute briefs — they think strategically about the product problem. Their approach to data architecture and UI complexity made our analytics platform genuinely competitive in a crowded market.",
  },
];

const PROCESS = [
  { step: "01", title: "Discovery & Scoping", desc: "We work with your team to understand business goals, technical landscape, constraints, and user needs before any work begins." },
  { step: "02", title: "Strategy & Architecture", desc: "Define the technology approach, platform choices, and product roadmap — so every decision downstream has a clear rationale." },
  { step: "03", title: "Product Design", desc: "UX research, information architecture, interaction design, and high-fidelity prototyping with continuous stakeholder validation." },
  { step: "04", title: "Engineering & Build", desc: "Full-stack development across iterative sprints, with regular client reviews and CI/CD from the first commit." },
  { step: "05", title: "QA & Validation", desc: "Rigorous testing, accessibility audits, performance benchmarking, and security review before anything ships." },
  { step: "06", title: "Deployment & Launch", desc: "Managed production rollout, infrastructure setup, monitoring configuration, and dedicated go-live support." },
  { step: "07", title: "Continuous Improvement", desc: "Post-launch analytics, user feedback loops, and iterative enhancement sprints driven by real-world data." },
  { step: "08", title: "Scale & Evolve", desc: "As your business grows, we scale the product, engineering team, and infrastructure alongside it." },
];

const STATS = [
  { value: "100+", label: "Projects Delivered" },
  { value: "28", label: "Specialists" },
  { value: "8+", label: "Industry Sectors" },
  { value: "3", label: "Continents Active" },
];

export function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e8ff" }}>
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-24 pb-16"
        aria-labelledby="hero-heading"
      >
        {/* Background orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 20%, rgba(124,58,237,0.22) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(59,130,246,0.14) 0%, transparent 60%)",
          }}
        />
        {/* Grid overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-8 uppercase tracking-widest"
            style={{
              border: "1px solid rgba(124,58,237,0.4)",
              background: "rgba(124,58,237,0.08)",
              color: "#a78bfa",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse" />
            Product · Software · IT Consulting
          </div>

          {/* Wordmark + tagline */}
          <div className="flex flex-col items-center mb-6 select-none" id="hero-heading">
            <h1
              className="leading-none"
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(5rem, 18vw, 14rem)",
                background: "linear-gradient(135deg, #c4b5fd 0%, #7c3aed 35%, #3b82f6 65%, #93c5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.06em",
              }}
            >
              NEXYRA
            </h1>
            <p
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(0.55rem, 1.4vw, 0.8rem)",
                letterSpacing: "0.42em",
                color: "#8888aa",
                textTransform: "uppercase",
                marginTop: "0.6rem",
              }}
            >
              Designing What&apos;s Next
            </p>
          </div>

          <p
            className="text-base md:text-lg mb-12 max-w-2xl mx-auto"
            style={{ color: "#8888bb", lineHeight: 1.7 }}
          >
            We design, build and transform digital products and technology solutions — partnering with enterprises and organisations from strategy and discovery through to deployment and scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base transition-all hover:opacity-90 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                color: "#fff",
                fontWeight: 700,
                letterSpacing: "0.02em",
                boxShadow: "0 0 40px rgba(124,58,237,0.35)",
              }}
            >
              Start a Project <ArrowUpRight size={18} />
            </Link>
            <Link
              to="/work"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base transition-all hover:text-white"
              style={{
                border: "1px solid rgba(124,58,237,0.35)",
                color: "#c4c4e8",
                fontWeight: 600,
              }}
            >
              View Our Work <ChevronRight size={18} />
            </Link>
          </div>

          {/* Capability pillars */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              "Product Design & Development",
              "Software Engineering",
              "Digital Transformation",
              "IT & Technology Consulting",
            ].map((pillar) => (
              <span
                key={pillar}
                className="text-xs uppercase tracking-widest"
                style={{ color: "#555577", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {pillar}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6" aria-label="Company statistics">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-4xl md:text-5xl mb-2"
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #a78bfa, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {value}
              </div>
              <div className="text-sm" style={{ color: "#8888bb" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="py-20 px-6" aria-labelledby="value-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace" }}>
              Why NEXYRA
            </p>
            <h2
              id="value-heading"
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, color: "#e8e8ff" }}
            >
              Built for technology-led organisations
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                Icon: Target,
                title: "Strategy to Delivery",
                desc: "We embed strategic thinking into every phase — from architecture decisions to interaction design. Every technical choice is made with your business outcome in mind.",
                items: ["Technology strategy & roadmapping", "Architecture & systems design", "Outcome-focused delivery frameworks"],
              },
              {
                Icon: Layers,
                title: "Full-Stack Capability",
                desc: "One partner across the entire product lifecycle — product design, frontend and backend engineering, cloud infrastructure, and AI integration.",
                items: ["Product design & UX/UI", "Full-stack software development", "Cloud, APIs, and AI/ML integration"],
              },
              {
                Icon: Shield,
                title: "Enterprise-Ready",
                desc: "Built for the scale, security, and compliance demands of enterprise and regulated-sector organisations from day one.",
                items: ["Security & compliance by default", "Scalable, maintainable architecture", "Dedicated senior-level teams"],
              },
            ].map(({ Icon, title, desc, items }) => (
              <div
                key={title}
                className="rounded-2xl p-8 flex flex-col gap-6 group hover:border-[rgba(124,58,237,0.45)] transition-colors"
                style={{
                  background: "#08081a",
                  border: "1px solid rgba(124,58,237,0.18)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(124,58,237,0.15)" }}
                >
                  <Icon size={22} style={{ color: "#a78bfa" }} />
                </div>
                <div>
                  <h3
                    className="text-xl mb-2"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: "#e8e8ff" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#8888bb" }}>{desc}</p>
                </div>
                <ul className="flex flex-col gap-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "#c4c4e8" }}>
                      <CheckCircle2 size={15} style={{ color: "#7c3aed", flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES MARQUEE ── */}
      <section className="py-10 overflow-hidden" aria-label="Services offered">
        <div
          className="flex gap-6 whitespace-nowrap"
          style={{ animation: "marquee 32s linear infinite" }}
        >
          {[...SERVICES, ...SERVICES].map((svc, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full text-sm shrink-0"
              style={{
                border: "1px solid rgba(124,58,237,0.25)",
                background: "rgba(124,58,237,0.06)",
                color: "#c4c4e8",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#7c3aed" }} />
              {svc}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── HOW WE WORK ── */}
      <section className="py-24 px-6" aria-labelledby="process-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace" }}>
              Our Engagement Model
            </p>
            <h2
              id="process-heading"
              className="text-3xl md:text-4xl"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, color: "#e8e8ff" }}
            >
              From discovery to scale — we cover every stage
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS.map(({ step, title, desc }) => (
              <div
                key={step}
                className="rounded-xl p-6 flex flex-col gap-3 hover:border-[rgba(124,58,237,0.4)] transition-colors"
                style={{ background: "#08081a", border: "1px solid rgba(124,58,237,0.15)" }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "#7c3aed",
                    letterSpacing: "0.08em",
                  }}
                >
                  {step}
                </span>
                <h3 className="text-base" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: "#e8e8ff" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8888bb" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── hidden until populated */}
      {false && <section
        className="py-24 px-6"
        style={{ background: "#06060f" }}
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace" }}>
              Client Stories
            </p>
            <h2
              id="testimonials-heading"
              className="text-3xl md:text-4xl"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, color: "#e8e8ff" }}
            >
              Trusted by teams who demand more
            </h2>
          </div>

          {/* Featured testimonial */}
          <div
            className="rounded-2xl p-8 md:p-12 mb-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(59,130,246,0.08) 100%)",
              border: "1px solid rgba(124,58,237,0.25)",
            }}
          >
            <div className="flex gap-1 mb-6">
              {Array.from({ length: TESTIMONIALS[activeTestimonial].rating }).map((_, i) => (
                <Star key={i} size={16} fill="#7c3aed" style={{ color: "#7c3aed" }} />
              ))}
            </div>
            <blockquote
              className="text-lg md:text-xl leading-relaxed mb-8"
              style={{ color: "#c4c4e8", fontStyle: "italic" }}
            >
              "{TESTIMONIALS[activeTestimonial].text}"
            </blockquote>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800 }}
              >
                {TESTIMONIALS[activeTestimonial].name[0]}
              </div>
              <div>
                <div className="text-base" style={{ color: "#e8e8ff", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700 }}>
                  {TESTIMONIALS[activeTestimonial].name}
                </div>
                <div className="text-sm" style={{ color: "#8888bb" }}>
                  {TESTIMONIALS[activeTestimonial].role} · {TESTIMONIALS[activeTestimonial].company}
                </div>
              </div>
            </div>
          </div>

          {/* Dot nav */}
          <div className="flex justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                aria-label={`View testimonial ${i + 1}`}
                className="transition-all"
                style={{
                  width: i === activeTestimonial ? "2rem" : "0.5rem",
                  height: "0.5rem",
                  borderRadius: "999px",
                  background: i === activeTestimonial ? "#7c3aed" : "rgba(124,58,237,0.3)",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>
      </section>}

      {/* ── CTA BANNER ── */}
      <section
        className="py-28 px-6 text-center relative overflow-hidden"
        aria-labelledby="cta-heading"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(124,58,237,0.2) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2
            id="cta-heading"
            className="text-4xl md:text-5xl mb-6"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, color: "#e8e8ff", lineHeight: 1.15 }}
          >
            Ready to build something transformative?
          </h2>
          <p className="text-lg mb-10" style={{ color: "#8888bb" }}>
            Tell us about your project and we'll outline how we can help — from a focused product build to a full digital transformation programme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-base transition-all hover:opacity-90 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                color: "#fff",
                fontWeight: 700,
                boxShadow: "0 0 50px rgba(124,58,237,0.4)",
              }}
            >
              Start a Project <ArrowUpRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base transition-all hover:text-white"
              style={{
                border: "1px solid rgba(124,58,237,0.35)",
                color: "#c4c4e8",
                fontWeight: 600,
              }}
            >
              Book a Discovery Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
