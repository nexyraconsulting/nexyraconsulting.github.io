import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Check } from "lucide-react";

// ── Fixed-price package groups ────────────────────────────────────────────────

const FIXED_PACKAGES = [
  {
    id: "product",
    overline: "01 · Product Design",
    group: "Product Design",
    desc: "End-to-end UX and UI for digital products — from discovery research through to component specs your engineers can build from directly.",
    services: [
      "UI/UX Product Design",
      "SaaS Product Design",
      "Enterprise Software Design",
    ],
    price: "From £4,800",
    period: "per engagement",
    deliverables: [
      "UX research & user journey mapping",
      "Wireframes & interactive prototype",
      "High-fidelity screen designs",
      "Component specs & Figma handoff",
    ],
    scope: "Scoped by platform type and screen count. Fixed fee agreed before any work begins.",
  },
  {
    id: "brand",
    overline: "02 · Brand & Identity",
    group: "Brand & Identity",
    desc: "Complete brand foundations — a visual identity and design system your teams can apply consistently across every channel and format.",
    services: [
      "Visual Identity & Branding",
      "Brand Design System",
    ],
    price: "From £3,200",
    period: "per engagement",
    deliverables: [
      "Logo system & visual language",
      "Colour, typography & token system",
      "Full usage guidelines",
      "Production-ready asset pack",
    ],
    scope: "Scoped as a complete deliverable set. Identity or design system delivered in a single fixed-fee engagement.",
  },
  {
    id: "digital",
    overline: "03 · Digital & Commerce",
    group: "Digital & Commerce",
    desc: "Conversion-focused design for websites, mobile apps, and online stores — built for the screens and behaviours of your actual users.",
    services: [
      "Web & Landing Page Design",
      "Mobile App Design",
      "E-commerce Design",
    ],
    price: "From £2,800",
    period: "per engagement",
    deliverables: [
      "Responsive page or screen designs",
      "Interaction & animation specifications",
      "Desktop & mobile breakpoints",
      "Developer-ready Figma handoff",
    ],
    scope: "Scoped by page count (web) or screen count (apps). Fixed fee based on agreed scope document.",
  },
  {
    id: "creative",
    overline: "04 · Creative & Content",
    group: "Creative & Content",
    desc: "Standalone creative deliverables — motion, print, data, and presentation assets produced to the same standard as our digital work.",
    services: [
      "Motion Graphic Design",
      "Infographic & Data Visualization",
      "Print, Merchandise & Packaging",
      "Pitch Deck & Presentation Design",
    ],
    price: "From £950",
    period: "per deliverable",
    deliverables: [
      "Production-ready final files",
      "Source files & assets supplied",
      "Multiple format exports",
      "Two structured revision rounds",
    ],
    scope: "Scoped per deliverable. Brief agreed upfront, price fixed before production begins.",
  },
];

// ── Architecture groups (Engine 1) ────────────────────────────────────────────

const ARCH_GROUPS = [
  { label: "Product Design", services: ["UI/UX Product Design", "SaaS Product Design", "Enterprise Software Design"] },
  { label: "Brand & Identity", services: ["Visual Identity & Branding", "Brand Design System"] },
  { label: "Digital & Commerce", services: ["Web & Landing Page Design", "Mobile App Design", "E-commerce Design"] },
  { label: "Creative & Content", services: ["Motion Graphic Design", "Infographic & Data Visualization", "Print, Merchandise & Packaging", "Pitch Deck & Presentation Design"] },
];

// ── Partnership Ladder ────────────────────────────────────────────────────────

const PARTNERSHIP_SERVICES = [
  "Ongoing Product & UX Design",
  "Brand Design & Governance",
  "Digital Design Support",
  "Creative Production Retainer",
  "Design System Management",
  "Full-Service Design Partnership",
];

const STAGES = [
  {
    id: "discover",
    num: "01",
    label: "Discover",
    billing: "Fixed fee · time-boxed",
    desc: "A focused design research sprint to map your users, existing systems, and competitive landscape. We validate assumptions and produce a delivery roadmap before any retained engagement begins. Two to three weeks, fee agreed upfront.",
    deliverables: [
      "User research & journey mapping",
      "Design audit & gap analysis",
      "Prioritised design roadmap",
      "Engagement scope recommendation",
    ],
  },
  {
    id: "build",
    num: "02",
    label: "Build",
    billing: "Retained pod · monthly",
    desc: "A dedicated design squad retained on a rolling monthly basis — iterating, shipping, and evolving your product, brand, or digital presence in regular sprint cycles. Squad composition adapts to your priorities at a fixed monthly rate.",
    deliverables: [
      "Sprint-based design delivery",
      "Weekly design reviews",
      "Stakeholder presentations",
      "Living design system updates",
    ],
  },
  {
    id: "run",
    num: "03",
    label: "Run",
    billing: "Design ops · monthly",
    desc: "Ongoing design operations for live products and brands — managing your design system, quality-checking creative output, responding to new briefs, and maintaining design standards as your organisation scales.",
    deliverables: [
      "Design system management",
      "Monthly quality review",
      "Ad-hoc creative support",
      "Brand governance oversight",
    ],
  },
];

// ── Scoping process steps ─────────────────────────────────────────────────────

const SCOPE_STEPS = [
  { num: "01", label: "Discovery call", desc: "30 minutes. We discuss your brief, goals, and constraints — free, no obligation." },
  { num: "02", label: "Scope document", desc: "A written brief defining exactly what is included, what is excluded, deliverables, and timeline." },
  { num: "03", label: "Fixed fee proposal", desc: "A single price agreed before any work begins. No hourly tracking, no invoice surprises." },
  { num: "04", label: "Delivery", desc: "Structured phases with clear review points. You see progress before we finalise anything." },
  { num: "05", label: "Handoff", desc: "All files, source documents, and specifications delivered in full. The work is yours outright." },
];

// ── FAQs ──────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How is a fixed-scope fee calculated?",
    a: "We issue a written scope document that defines exactly what is included, what is explicitly excluded, key deliverables, and the expected timeline. The fee is based on that agreed scope — not on hours tracked.",
  },
  {
    q: "What happens if our requirements change?",
    a: "Any requirements that fall outside the agreed scope are handled as a formal change request with its own fixed fee, agreed in writing before work proceeds. Nothing is added to your invoice without prior sign-off.",
  },
  {
    q: "Do prices include VAT?",
    a: "All prices shown are exclusive of UK VAT at the prevailing rate. VAT invoices are issued to UK-registered clients. Overseas clients pay net of UK VAT.",
  },
  {
    q: "Can I start with one service and add others later?",
    a: "Yes. Each fixed-price package is scoped and delivered independently. Many clients begin with a single deliverable — a brand identity or a pitch deck — and return for broader engagements as their needs grow.",
  },
  {
    q: "What is the Partnership Ladder for?",
    a: "The Partnership Ladder is for clients who need sustained, ongoing design support rather than a single defined deliverable. It provides a retained design pod working in regular sprints — ideal for product teams, growing brands, or organisations managing complex, evolving digital estates.",
  },
  {
    q: "Can we go straight to Build without Discover?",
    a: "If you arrive with a clear brief, an existing design system, and agreed priorities, yes. We will review what you have and confirm whether a Discover sprint adds value before committing to a Build retainer.",
  },
];

// ── Helper components ─────────────────────────────────────────────────────────

function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 w-full mb-12">
      <p
        className="text-xs uppercase tracking-widest shrink-0 whitespace-nowrap"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}
      >
        {label}
      </p>
      <div className="flex-1 h-px" style={{ background: "rgba(147,51,234,0.2)" }} />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function Pricing() {
  const [activeStage, setActiveStage] = useState("discover");
  const stage = STAGES.find((s) => s.id === activeStage)!;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e8ff" }}>

      {/* ══════════════════════════════════ HERO */}
      <section
        className="pt-32 pb-14 px-6 relative overflow-hidden"
        style={{ borderBottom: "1px solid rgba(147,51,234,0.18)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 55% at 25% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <p
            className="text-xs uppercase tracking-widest mb-8"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}
          >
            Pricing
          </p>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Headline */}
            <div className="lg:col-span-7">
              <h1
                className="mb-6"
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(3rem, 6vw, 4.6rem)",
                  lineHeight: 1.05,
                  color: "#e8e8ff",
                  letterSpacing: "-0.025em",
                }}
              >
                Two pricing<br />engines.
              </h1>
              <p className="text-lg" style={{ color: "#8888bb", lineHeight: 1.75, maxWidth: "52ch" }}>
                Twelve services. Two ways to engage. Design, brand, and creative work is available as fixed-price, fixed-scope engagements. Sustained design partnerships run through a structured retainer model.
              </p>
            </div>
            {/* Engine summary cards */}
            <div className="lg:col-span-5 flex flex-col gap-3 lg:pt-2">
              <div className="rounded-xl p-5" style={{ background: "#08081a", border: "1px solid rgba(124,58,237,0.18)" }}>
                <p
                  className="text-xs uppercase tracking-widest mb-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}
                >
                  Engine 1
                </p>
                <p
                  className="text-base font-semibold mb-2"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}
                >
                  Fixed Price / Fixed Scope
                </p>
                <p className="text-sm" style={{ color: "#8888bb", lineHeight: 1.65 }}>
                  All twelve services available as defined, one-off engagements. Brief agreed upfront, price fixed before work begins — no hourly billing, no scope creep.
                </p>
              </div>
              <div className="rounded-xl p-5" style={{ background: "rgba(147,51,234,0.08)", border: "1px solid rgba(147,51,234,0.32)" }}>
                <p
                  className="text-xs uppercase tracking-widest mb-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}
                >
                  Engine 2
                </p>
                <p
                  className="text-base font-semibold mb-2"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}
                >
                  Partnership Ladder
                </p>
                <p className="text-sm" style={{ color: "#8888bb", lineHeight: 1.65 }}>
                  Discover → Build → Run. A retained design pod working in regular sprints — for teams that need sustained, ongoing design capability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ ARCHITECTURE */}
      <section
        className="px-6 py-14"
        style={{ borderBottom: "1px solid rgba(147,51,234,0.18)" }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionRule label="Architecture" />
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(124,58,237,0.18)" }}
          >
            <div className="grid md:grid-cols-2">
              {/* Engine 1 */}
              <div
                className="p-8 md:p-10"
                style={{ borderRight: "1px solid rgba(147,51,234,0.18)" }}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}
                >
                  Engine 1
                </p>
                <p
                  className="text-base font-bold mb-1"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}
                >
                  Fixed Price / Fixed Scope
                </p>
                <p className="text-sm mb-6" style={{ color: "#8888bb" }}>
                  Twelve services, grouped into four packages. Each engagement is scoped, priced, and delivered as a defined unit.
                </p>
                <div className="flex flex-col gap-5">
                  {ARCH_GROUPS.map((group, gi) => (
                    <div
                      key={group.label}
                      className="pt-4"
                      style={{ borderTop: gi > 0 ? "1px solid rgba(147,51,234,0.1)" : undefined }}
                    >
                      <p className="text-xs font-semibold mb-2" style={{ color: "#a78bfa", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>
                        {group.label}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {group.services.map((svc) => (
                          <div key={svc} className="flex items-center gap-2.5">
                            <div className="w-1 h-1 rounded-full shrink-0" style={{ background: "#9333EA" }} />
                            <span className="text-sm" style={{ color: "#c4c4e8" }}>{svc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engine 2 */}
              <div className="p-8 md:p-10">
                <p
                  className="text-xs uppercase tracking-widest mb-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}
                >
                  Engine 2
                </p>
                <p
                  className="text-base font-bold mb-1"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}
                >
                  Partnership Ladder
                </p>
                <div className="flex items-center gap-2 mb-6">
                  {["Discover", "Build", "Run"].map((s, i) => (
                    <span key={s} className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: "#9333EA" }}>
                        {s}
                      </span>
                      {i < 2 && (
                        <span className="text-xs" style={{ color: "#555577" }}>→</span>
                      )}
                    </span>
                  ))}
                </div>
                <p className="text-sm mb-6" style={{ color: "#8888bb", lineHeight: 1.6 }}>
                  For clients who need ongoing, iterative design capability rather than a single defined deliverable. A retained design pod working in monthly sprints — scaling up or down as priorities evolve.
                </p>
                <div className="flex flex-col">
                  {PARTNERSHIP_SERVICES.map((svc, i) => (
                    <div
                      key={svc}
                      className="flex items-center gap-3 py-3"
                      style={{
                        borderTop: i > 0 ? "1px solid rgba(147,51,234,0.1)" : undefined,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: "rgba(147,51,234,0.5)" }}
                      />
                      <span className="text-sm" style={{ color: "#c4c4e8" }}>
                        {svc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Caption */}
            <div
              className="px-8 py-4 text-center text-xs"
              style={{
                borderTop: "1px solid rgba(147,51,234,0.18)",
                color: "#555577",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              The brief sets the scope, the scope sets the price — every change is agreed in writing before it begins.
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ ENGINE 1 — FIXED PRICE */}
      <section
        className="px-6 py-14"
        style={{ borderBottom: "1px solid rgba(147,51,234,0.18)" }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionRule label="Engine 1 — Fixed Price / Fixed Scope" />

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 mb-14">
            {/* Description */}
            <div className="lg:col-span-4">
              <h2
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.8rem, 3vw, 2.3rem)",
                  lineHeight: 1.1,
                  color: "#e8e8ff",
                  letterSpacing: "-0.02em",
                }}
              >
                Defined brief.<br />Fixed price.
              </h2>
              <p className="mt-4 text-sm" style={{ color: "#8888bb", lineHeight: 1.75 }}>
                Every fixed-scope engagement begins with a written brief. Deliverables, timeline, and price are agreed before any work starts. What is in the scope is delivered. What is outside it requires a separate change request — nothing is added to your invoice without approval.
              </p>
              <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(147,51,234,0.06)", border: "1px solid rgba(147,51,234,0.18)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "#a78bfa" }}>No surprises</p>
                <p className="text-xs leading-relaxed" style={{ color: "#8888bb" }}>
                  Fixed-fee engagements protect both sides. You know exactly what you are buying. We know exactly what we are delivering. Scope creep doesn't happen — because every change has a price before it happens.
                </p>
              </div>
            </div>

            {/* Package cards */}
            <div className="lg:col-span-8 grid md:grid-cols-2 gap-5">
              {FIXED_PACKAGES.map(({ id, overline, group, desc, services, price, period, deliverables, scope }) => (
                <div
                  key={id}
                  className="rounded-xl flex flex-col p-6 hover:border-[rgba(124,58,237,0.4)] transition-colors"
                  style={{ background: "#08081a", border: "1px solid rgba(124,58,237,0.18)" }}
                >
                  {/* Header */}
                  <p className="text-xs mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>
                    {overline}
                  </p>
                  <h3
                    className="text-lg mb-2 leading-snug"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: "#e8e8ff" }}
                  >
                    {group}
                  </h3>
                  <p className="text-xs mb-4 leading-relaxed flex-none" style={{ color: "#8888bb" }}>
                    {desc}
                  </p>

                  {/* Included services */}
                  <div className="mb-4 pb-4" style={{ borderBottom: "1px solid rgba(147,51,234,0.14)" }}>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>
                      Includes
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {services.map((svc) => (
                        <div key={svc} className="flex items-center gap-2">
                          <Check size={11} style={{ color: "#9333EA", flexShrink: 0 }} />
                          <span className="text-xs" style={{ color: "#c4c4e8" }}>{svc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="mb-4 pb-4 flex-1" style={{ borderBottom: "1px solid rgba(147,51,234,0.14)" }}>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>
                      Key deliverables
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {deliverables.map((d) => (
                        <div key={d} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: "#555577" }} />
                          <span className="text-xs" style={{ color: "#8888bb" }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-widest mb-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>
                      Starting from
                    </p>
                    <p className="text-2xl" style={{ fontFamily: "'DM Mono', monospace", color: "#e8e8ff", fontWeight: 500 }}>
                      {price}
                    </p>
                    <p className="text-xs" style={{ color: "#555577" }}>{period}</p>
                  </div>

                  {/* Scope note */}
                  <p className="text-xs mb-5 leading-relaxed" style={{ color: "#555577", fontStyle: "italic" }}>
                    {scope}
                  </p>

                  {/* CTA */}
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff" }}
                  >
                    Get a quote <ArrowUpRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* How it works — scoping process */}
          <div
            className="rounded-xl p-8 md:p-10"
            style={{ background: "#08081a", border: "1px solid rgba(124,58,237,0.18)" }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>
              How it works
            </p>
            <h3
              className="text-xl mb-8"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: "#e8e8ff" }}
            >
              From brief to handoff in five steps
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {SCOPE_STEPS.map(({ num, label, desc }) => (
                <div key={num}>
                  <p className="text-xs mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>{num}</p>
                  <p className="text-sm font-semibold mb-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>{label}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#8888bb" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ ENGINE 2 — PARTNERSHIP LADDER */}
      <section
        className="px-6 py-14"
        style={{ borderBottom: "1px solid rgba(147,51,234,0.18)" }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionRule label="Engine 2 — Partnership Ladder" />
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left description */}
            <div className="lg:col-span-4">
              <h2
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.8rem, 3vw, 2.3rem)",
                  lineHeight: 1.1,
                  color: "#e8e8ff",
                  letterSpacing: "-0.02em",
                }}
              >
                Discover.<br />Build.<br />Run.
              </h2>
              <p className="mt-4 mb-7 text-sm" style={{ color: "#8888bb", lineHeight: 1.75 }}>
                For organisations that need a sustained design partner rather than a one-off delivery. A retained design pod, working in monthly sprints, scaling with your priorities. Engagement starts with a time-boxed Discover sprint — then moves into Build and Run as needed.
              </p>
              <p
                className="text-xs uppercase tracking-widest mb-3"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}
              >
                Typical use cases
              </p>
              <ul className="flex flex-col gap-2.5">
                {PARTNERSHIP_SERVICES.map((svc) => (
                  <li
                    key={svc}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: "#8888bb" }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "rgba(147,51,234,0.5)" }}
                    />
                    {svc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: tabbed stage panel */}
            <div className="lg:col-span-8 flex flex-col">
              {/* Tab bar */}
              <div
                className="flex"
                style={{ borderBottom: "1px solid rgba(147,51,234,0.2)" }}
              >
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStage(s.id)}
                    className="flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest transition-all"
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom:
                        activeStage === s.id
                          ? "2px solid #9333EA"
                          : "2px solid transparent",
                      marginBottom: "-1px",
                      color: activeStage === s.id ? "#9333EA" : "#555577",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: activeStage === s.id ? 700 : 400,
                      cursor: "pointer",
                    }}
                  >
                    <span className="opacity-50">{s.num}</span>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Stage panel */}
              <div
                className="rounded-b-xl p-7 flex-1"
                style={{
                  background:
                    activeStage === "discover"
                      ? "rgba(147,51,234,0.07)"
                      : "#08081a",
                  border: "1px solid rgba(124,58,237,0.18)",
                  borderTop: "none",
                }}
              >
                <div className="flex flex-wrap items-baseline gap-3 mb-3">
                  <h3
                    className="text-2xl"
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontWeight: 700,
                      color: "#e8e8ff",
                    }}
                  >
                    {stage.label}
                  </h3>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(147,51,234,0.15)",
                      color: "#a78bfa",
                      border: "1px solid rgba(147,51,234,0.3)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {stage.billing}
                  </span>
                </div>
                <p
                  className="text-sm mb-7"
                  style={{ color: "#8888bb", lineHeight: 1.75, maxWidth: "56ch" }}
                >
                  {stage.desc}
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-7">
                  {stage.deliverables.map((d) => (
                    <div
                      key={d}
                      className="flex items-start gap-3 p-4 rounded-lg"
                      style={{
                        background: "#08081a",
                        border: "1px solid rgba(147,51,234,0.18)",
                      }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        className="shrink-0 mt-0.5"
                      >
                        <path
                          d="M2.5 6.5L5.5 9.5L10.5 4"
                          stroke="#9333EA"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm" style={{ color: "#e8e8ff" }}>
                        {d}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                    color: "#fff",
                  }}
                >
                  Enquire about {stage.label} <ArrowUpRight size={13} />
                </Link>
              </div>

              {/* Stage selector pills */}
              <div
                className="grid grid-cols-3 mt-4 overflow-hidden rounded-xl"
                style={{
                  border: "1px solid rgba(147,51,234,0.2)",
                  gap: "1px",
                  background: "rgba(147,51,234,0.2)",
                }}
              >
                {STAGES.map((s) => {
                  const active = activeStage === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveStage(s.id)}
                      className="flex flex-col items-start p-5 transition-all hover:opacity-90"
                      style={{
                        background: active ? "rgba(147,51,234,0.15)" : "#08081a",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs opacity-50"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: active ? "#9333EA" : "#555577",
                          }}
                        >
                          {s.num}
                        </span>
                        <span
                          className="text-xs uppercase tracking-widest font-semibold"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: active ? "#9333EA" : "#8888bb",
                          }}
                        >
                          {s.label}
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: "#555577" }}>
                        {s.billing}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ COMMON QUESTIONS */}
      <section
        className="px-6 py-14"
        style={{ borderBottom: "1px solid rgba(147,51,234,0.18)" }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionRule label="Common questions" />
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-8">
            {FAQS.map(({ q, a }, i) => (
              <div
                key={i}
                className="pt-5"
                style={{ borderTop: "1px solid rgba(147,51,234,0.2)" }}
              >
                <p
                  className="text-sm font-semibold mb-3 leading-snug"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}
                >
                  {q}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#8888bb" }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ CTA */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p
                className="text-xs uppercase tracking-widest mb-5"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}
              >
                Not sure where to start?
              </p>
              <h2
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 4vw, 3.1rem)",
                  lineHeight: 1.08,
                  color: "#e8e8ff",
                  letterSpacing: "-0.02em",
                }}
              >
                Not sure which engine<br />fits your project?
              </h2>
              <p
                className="mt-5 text-lg"
                style={{ color: "#8888bb", lineHeight: 1.75, maxWidth: "44ch" }}
              >
                Book a no-obligation 30-minute call. We will listen to what you need and tell you honestly which model — and which services — make sense.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff" }}
              >
                Book a discovery call <ArrowUpRight size={14} />
              </Link>
              <Link
                to="/work"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium transition-all hover:opacity-80 whitespace-nowrap"
                style={{
                  background: "#08081a",
                  border: "1px solid rgba(147,51,234,0.3)",
                  color: "#c4c4e8",
                }}
              >
                View our work <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
