import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

const TEAM = [
  {
    name: "Aria Voss",
    role: "Founder & CEO",
    bio: "15 years spanning product strategy, software delivery, and enterprise consulting. Previously led digital transformation programmes at a Fortune 500 consultancy. Obsessed with outcomes over outputs.",
    initials: "AV",
    gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
  },
  {
    name: "Kai Nakamura",
    role: "Head of Product & Engineering",
    bio: "Ex-Google and Stripe. Kai brings deep expertise in SaaS product systems, full-stack engineering, and design ops — with a track record of shipping at scale.",
    initials: "KN",
    gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
  },
  {
    name: "Sofia Marín",
    role: "Creative & Motion Lead",
    bio: "Award-winning creative director who has produced digital campaigns and motion systems for global brands. Specialises in brand experience design that scales across platforms.",
    initials: "SM",
    gradient: "linear-gradient(135deg, #a855f7, #ec4899)",
  },
  {
    name: "Tobias Berg",
    role: "Head of Strategy & Consulting",
    bio: "Background in IT advisory and digital strategy for Series A to enterprise organisations. Tobias bridges technology decisions with commercial outcomes at every engagement.",
    initials: "TB",
    gradient: "linear-gradient(135deg, #7c3aed, #3b82f6)",
  },
  {
    name: "Yemi Adeyemi",
    role: "Senior Product Designer",
    bio: "Crafts intuitive product experiences with a rigorous approach to systems and accessibility. Yemi's work has shipped to millions of users across fintech, edtech, and healthcare.",
    initials: "YA",
    gradient: "linear-gradient(135deg, #06b6d4, #7c3aed)",
  },
  {
    name: "Petra Horak",
    role: "Client Partnership Lead",
    bio: "The engine behind every successful NEXYRA engagement. Petra ensures projects run on time, briefs land clearly, and every client relationship deepens with each delivery.",
    initials: "PH",
    gradient: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
  },
];

const VALUES = [
  {
    title: "Outcome-first thinking",
    desc: "We begin every engagement by defining what success looks like for your business. Technology and design are the tools — the measurable outcome is what we're actually building toward.",
  },
  {
    title: "Depth over speed",
    desc: "We'd rather invest the time to understand a problem fully than move fast and miss what matters. Every decision is considered, every architecture choice is justified.",
  },
  {
    title: "Radical transparency",
    desc: "Clear timelines, honest technical assessments, and no hidden costs. We tell you what we think — including when the answer is difficult — not what sounds good.",
  },
  {
    title: "Partnership, not vendor",
    desc: "We invest in understanding your organisation deeply. Your success is our metric. We measure ourselves by the outcomes we help you achieve, not hours billed.",
  },
];

const EXPERTISE = [
  {
    area: "Product Strategy & Design",
    desc: "Human-centred discovery, UX research, and high-fidelity product design that reduces development waste and drives adoption from launch.",
  },
  {
    area: "Software Engineering",
    desc: "Full-stack development from early-stage MVPs through to complex, enterprise-scale platforms — built to be maintained and evolved.",
  },
  {
    area: "Digital Transformation",
    desc: "Strategy, architecture, and change programme delivery for organisations modernising at pace — with a focus on outcomes, not just technology.",
  },
  {
    area: "IT & Technology Consulting",
    desc: "Technology strategy, vendor assessment, and architecture advisory that gives leadership teams the clarity to make high-stakes technology decisions with confidence.",
  },
];

export function About() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e8ff" }}>
      {/* Header */}
      <section
        className="pt-32 pb-20 px-6 relative overflow-hidden"
        aria-labelledby="about-heading"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 40% at 70% 30%, rgba(59,130,246,0.14) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace" }}>
              Our Story
            </p>
            <h1
              id="about-heading"
              className="text-4xl md:text-5xl mb-6"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, color: "#e8e8ff", lineHeight: 1.15 }}
            >
              Technology consulting and product delivery, built for enterprise ambition
            </h1>
            <p className="text-lg mb-4" style={{ color: "#8888bb", lineHeight: 1.7 }}>
              NEXYRA was founded to close a persistent gap: organisations needed a partner who could think strategically about technology, design products people genuinely use, and build software that scales — without compromising at any layer.
            </p>
            <p className="text-base" style={{ color: "#8888bb", lineHeight: 1.7 }}>
              Today we work with enterprises, scale-ups, and public sector organisations across three continents as a trusted end-to-end technology partner — from initial discovery and strategy through product design, software development, and continuous improvement.
            </p>
          </div>

          {/* Stats block */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "2026", label: "Founded" },
              { value: "100+", label: "Engagements delivered" },
              { value: "28", label: "Specialists" },
              { value: "3", label: "Continents active" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl p-6"
                style={{ background: "#08081a", border: "1px solid rgba(124,58,237,0.18)" }}
              >
                <div
                  className="text-3xl md:text-4xl mb-1"
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
        </div>
      </section>

      {/* Values */}
      <section
        className="py-20 px-6"
        style={{ background: "#06060f", borderTop: "1px solid rgba(124,58,237,0.12)" }}
        aria-labelledby="values-heading"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace" }}>
              What We Stand For
            </p>
            <h2
              id="values-heading"
              className="text-3xl md:text-4xl"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, color: "#e8e8ff" }}
            >
              Principles that guide every engagement
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-xl p-8"
                style={{ background: "#08081a", border: "1px solid rgba(124,58,237,0.18)" }}
              >
                <h3
                  className="text-xl mb-3"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: "#e8e8ff" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8888bb" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section
        className="py-20 px-6"
        style={{ background: "#06060f", borderTop: "1px solid rgba(124,58,237,0.12)" }}
        aria-labelledby="expertise-heading"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace" }}>
              What We Bring
            </p>
            <h2
              id="expertise-heading"
              className="text-3xl md:text-4xl"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, color: "#e8e8ff" }}
            >
              Core expertise across every engagement
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EXPERTISE.map(({ area, desc }) => (
              <div
                key={area}
                className="rounded-xl p-6"
                style={{ background: "#08081a", border: "1px solid rgba(124,58,237,0.18)" }}
              >
                <div
                  className="w-1 h-8 rounded-full mb-4"
                  style={{ background: "linear-gradient(to bottom, #7c3aed, #3b82f6)" }}
                />
                <h3
                  className="text-base mb-3"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: "#e8e8ff" }}
                >
                  {area}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8888bb" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center relative overflow-hidden" aria-labelledby="about-cta">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.18) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2
            id="about-cta"
            className="text-3xl md:text-4xl mb-4"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, color: "#e8e8ff" }}
          >
            Ready to start a conversation?
          </h2>
          <p className="mb-8" style={{ color: "#8888bb" }}>
            We'd love to understand your project and explore how we can help — whether that's a focused product build or a broader technology transformation.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff", fontWeight: 700 }}
          >
            Get in Touch <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
