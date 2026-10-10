import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { NMonogramSVG, HorizontalLockupSVG, VerticalLockupSVG } from "../BrandLogo";
import {
  ArrowUpRight, ArrowRight, Check, X as XIcon, AlertCircle, Info,
  Mail, Phone, MapPin, Clock, Globe, Menu,
  Users, Briefcase, Zap, Sparkles, Star, Target, Building2, Lock,
  ChevronRight, Eye, Copy, CheckCheck,
  Palette, Type, Layout, Box, Smartphone, Accessibility,
  Image, Code2, Mic2, ArrowLeft,
} from "lucide-react";

// ─── Section manifest ─────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview",      num: "01", label: "Overview",         Icon: Sparkles },
  { id: "logo",          num: "02", label: "Logo",             Icon: Star },
  { id: "colour",        num: "03", label: "Colour",           Icon: Palette },
  { id: "typography",    num: "04", label: "Typography",       Icon: Type },
  { id: "layout",        num: "05", label: "Layout",           Icon: Layout },
  { id: "components",    num: "06", label: "Components",       Icon: Box },
  { id: "responsive",    num: "07", label: "Responsive",       Icon: Smartphone },
  { id: "accessibility", num: "08", label: "Accessibility",    Icon: Accessibility },
  { id: "icons",         num: "09", label: "Icons & Imagery",  Icon: Image },
  { id: "tokens",        num: "10", label: "Design Tokens",    Icon: Code2 },
  { id: "voice",         num: "11", label: "Voice",            Icon: Mic2 },
];

// ─── Color palette data ───────────────────────────────────────────────────────

const PALETTE = {
  brand: [
    { name: "Brand Purple",    hex: "#9333EA", rgb: "147, 51, 234",   hsl: "276°, 81%, 56%", token: "color-brand-primary",        role: "Primary",        usage: "CTAs, highlights, interactive elements" },
    { name: "Brand Blue",      hex: "#2563EB", rgb: "37, 99, 235",    hsl: "221°, 83%, 53%", token: "color-brand-secondary",      role: "Secondary",      usage: "Gradient endpoint, links, accents" },
    { name: "Purple Light",    hex: "#a78bfa", rgb: "167, 139, 250",  hsl: "259°, 90%, 76%", token: "color-brand-grad-start",     role: "Gradient start", usage: "Gradient start, hover tints" },
    { name: "Purple Mid",      hex: "#7c3aed", rgb: "124, 58, 237",   hsl: "262°, 83%, 58%", token: "color-brand-grad-mid",       role: "Gradient mid",   usage: "Borders, mid-gradient anchors" },
    { name: "Blue Mid",        hex: "#3b82f6", rgb: "59, 130, 246",   hsl: "217°, 91%, 60%", token: "color-brand-grad-end",       role: "Gradient end",   usage: "Cool accents, gradient tail" },
  ],
  backgrounds: [
    { name: "Deep Black",      hex: "#04040f", rgb: "4, 4, 15",       hsl: "240°, 58%, 4%",  token: "color-bg-base",             role: "Background",     usage: "Page background base" },
    { name: "Card Surface",    hex: "#08081a", rgb: "8, 8, 26",       hsl: "240°, 53%, 7%",  token: "color-bg-surface",          role: "Surface",        usage: "Cards, panels, sections" },
    { name: "Elevated",        hex: "#0d0d22", rgb: "13, 13, 34",     hsl: "240°, 45%, 9%",  token: "color-bg-elevated",         role: "Elevated",       usage: "Tooltips, dropdowns, modals" },
  ],
  text: [
    { name: "Text Primary",    hex: "#e8e8ff", rgb: "232, 232, 255",  hsl: "240°, 100%, 95%",token: "color-text-primary",        role: "Primary text",   usage: "Headings, important body copy" },
    { name: "Text Secondary",  hex: "#c4c4e8", rgb: "196, 196, 232",  hsl: "240°, 39%, 84%", token: "color-text-secondary",      role: "Secondary text", usage: "Supporting body, descriptions" },
    { name: "Text Muted",      hex: "#8888bb", rgb: "136, 136, 187",  hsl: "240°, 22%, 63%", token: "color-text-muted",          role: "Muted",          usage: "Captions, placeholders, helpers" },
    { name: "Text Subtle",     hex: "#555577", rgb: "85, 85, 119",    hsl: "240°, 17%, 40%", token: "color-text-subtle",         role: "Subtle",         usage: "Timestamps, legal, meta text" },
  ],
  semantic: [
    { name: "Success",         hex: "#86efac", rgb: "134, 239, 172",  hsl: "142°, 76%, 73%", token: "color-state-success",       role: "Success",        usage: "Active status, confirmations" },
    { name: "Error",           hex: "#fca5a5", rgb: "252, 165, 165",  hsl: "0°, 93%, 82%",   token: "color-state-error",         role: "Error",          usage: "Validation, destructive actions" },
    { name: "Warning",         hex: "#fcd34d", rgb: "252, 211, 77",   hsl: "45°, 96%, 65%",  token: "color-state-warning",       role: "Warning",        usage: "Caution, upcoming, beta" },
    { name: "Info",            hex: "#93c5fd", rgb: "147, 197, 253",  hsl: "213°, 96%, 78%", token: "color-state-info",          role: "Info",           usage: "Informational, help text" },
  ],
};

// ─── Type scale ───────────────────────────────────────────────────────────────

const TYPE_SCALE = [
  { label: "Display",      size: "clamp(3rem,6vw,4.6rem)", weight: "700", family: "Hanken Grotesk", tracking: "−0.025em", lh: "1.05", sample: "Two pricing engines." },
  { label: "Heading XL",  size: "48px",                   weight: "700", family: "Hanken Grotesk", tracking: "−0.01em",  lh: "1.1",  sample: "Designing What's Next" },
  { label: "Heading L",   size: "36px",                   weight: "700", family: "Hanken Grotesk", tracking: "−0.01em",  lh: "1.15", sample: "Technology & Product Partner" },
  { label: "Heading M",   size: "30px",                   weight: "600", family: "Hanken Grotesk", tracking: "0",        lh: "1.25", sample: "UI/UX Design Services" },
  { label: "Heading S",   size: "24px",                   weight: "600", family: "Hanken Grotesk", tracking: "0",        lh: "1.3",  sample: "What we deliver" },
  { label: "Body L",      size: "18px",                   weight: "400", family: "DM Sans",        tracking: "0",        lh: "1.7",  sample: "Your dedicated technology partner — strategy, design, and engineering." },
  { label: "Body",        size: "16px",                   weight: "400", family: "DM Sans",        tracking: "0",        lh: "1.6",  sample: "We partner with startups, scale-ups, and enterprise teams globally." },
  { label: "Body S",      size: "14px",                   weight: "400", family: "DM Sans",        tracking: "0",        lh: "1.5",  sample: "Senior-level design with the velocity of an in-house team." },
  { label: "Caption",     size: "12px",                   weight: "400", family: "DM Sans",        tracking: "0.02em",   lh: "1.4",  sample: "Updated August 2026 · Internal reference document" },
  { label: "Price / Figure", size: "24px",                weight: "500", family: "DM Mono",        tracking: "0",        lh: "1.2",  sample: "£2,400" },
  { label: "Label / Tag", size: "12px",                   weight: "500", family: "JetBrains Mono", tracking: "0.12em",   lh: "1.4",  sample: "BRAND IDENTITY" },
  { label: "Overline",    size: "10px",                   weight: "400", family: "JetBrains Mono", tracking: "0.3em",    lh: "1.4",  sample: "DESIGNING WHAT'S NEXT" },
];

// ─── Spacing scale ────────────────────────────────────────────────────────────

const SPACING = [
  { token: "spacing-1",  px: "4px",   rem: "0.25rem", tw: "1",  use: "Icon inner gap, hairline spacing" },
  { token: "spacing-2",  px: "8px",   rem: "0.5rem",  tw: "2",  use: "Component tight padding" },
  { token: "spacing-3",  px: "12px",  rem: "0.75rem", tw: "3",  use: "Small related-item gaps" },
  { token: "spacing-4",  px: "16px",  rem: "1rem",    tw: "4",  use: "Standard padding, card inner" },
  { token: "spacing-6",  px: "24px",  rem: "1.5rem",  tw: "6",  use: "Section inner padding" },
  { token: "spacing-8",  px: "32px",  rem: "2rem",    tw: "8",  use: "Card groups, gutter" },
  { token: "spacing-10", px: "40px",  rem: "2.5rem",  tw: "10", use: "Section tops/bottoms (small)" },
  { token: "spacing-12", px: "48px",  rem: "3rem",    tw: "12", use: "Between major sections" },
  { token: "spacing-16", px: "64px",  rem: "4rem",    tw: "16", use: "Section padding py-16" },
  { token: "spacing-20", px: "80px",  rem: "5rem",    tw: "20", use: "Major section spacing" },
  { token: "spacing-24", px: "96px",  rem: "6rem",    tw: "24", use: "Hero section top padding" },
  { token: "spacing-32", px: "128px", rem: "8rem",    tw: "32", use: "Page-level top padding pt-32" },
];

// ─── Design tokens ────────────────────────────────────────────────────────────

const TOKENS: { category: string; token: string; value: string; description: string }[] = [
  { category: "Color",      token: "color-brand-primary",       value: "#9333EA",                description: "Primary brand purple" },
  { category: "Color",      token: "color-brand-secondary",     value: "#2563EB",                description: "Secondary brand blue" },
  { category: "Color",      token: "color-brand-gradient",      value: "#a78bfa→#7c3aed→#3b82f6",description: "135° gradient — wordmark, CTAs" },
  { category: "Color",      token: "color-bg-base",             value: "#04040f",                description: "Page background" },
  { category: "Color",      token: "color-bg-surface",          value: "#08081a",                description: "Card / panel surface" },
  { category: "Color",      token: "color-bg-elevated",         value: "#0d0d22",                description: "Tooltip / modal surface" },
  { category: "Color",      token: "color-text-primary",        value: "#e8e8ff",                description: "Headings & important body" },
  { category: "Color",      token: "color-text-secondary",      value: "#c4c4e8",                description: "Supporting body text" },
  { category: "Color",      token: "color-text-muted",          value: "#8888bb",                description: "Descriptive / helper text" },
  { category: "Color",      token: "color-text-subtle",         value: "#555577",                description: "Meta, timestamps, legal" },
  { category: "Color",      token: "color-border-default",      value: "rgba(147,51,234,0.18)",  description: "Card borders, dividers" },
  { category: "Color",      token: "color-border-active",       value: "rgba(147,51,234,0.5)",   description: "Focus / hover borders" },
  { category: "Color",      token: "color-state-success",       value: "#86efac",                description: "Success / active status" },
  { category: "Color",      token: "color-state-error",         value: "#fca5a5",                description: "Error / destructive" },
  { category: "Color",      token: "color-state-warning",       value: "#fcd34d",                description: "Warning / upcoming" },
  { category: "Color",      token: "color-state-info",          value: "#93c5fd",                description: "Informational notices" },
  { category: "Typography", token: "font-family-display",       value: "'Hanken Grotesk'",       description: "All display & section headings" },
  { category: "Typography", token: "font-family-body",          value: "'DM Sans'",              description: "Body copy, UI labels, navigation" },
  { category: "Typography", token: "font-family-price",         value: "'DM Mono'",              description: "Price figures, numeric values" },
  { category: "Typography", token: "font-family-mono",          value: "'JetBrains Mono'",       description: "Labels, badges, code, tokens" },
  { category: "Typography", token: "font-family-logo",          value: "'Hanken Grotesk'",       description: "Logo wordmark (v2, was Inter Tight)" },
  { category: "Typography", token: "font-weight-bold",          value: "700",                    description: "Page hero headings" },
  { category: "Typography", token: "font-weight-semibold",      value: "600",                    description: "Section headings, card titles" },
  { category: "Typography", token: "font-size-display",         value: "clamp(5rem,18vw,14rem)", description: "Hero wordmark" },
  { category: "Typography", token: "font-size-heading-xl",      value: "3rem / 48px",            description: "Page hero heading" },
  { category: "Typography", token: "font-size-heading-l",       value: "2.25rem / 36px",         description: "Section heading" },
  { category: "Typography", token: "font-size-heading-m",       value: "1.875rem / 30px",        description: "Card / sub-section title" },
  { category: "Typography", token: "font-size-body",            value: "1rem / 16px",            description: "Default body text" },
  { category: "Typography", token: "font-size-label",           value: "0.75rem / 12px",         description: "Tags, badges, labels" },
  { category: "Spacing",    token: "spacing-xs",                value: "0.25rem / 4px",          description: "Tight icon gaps" },
  { category: "Spacing",    token: "spacing-sm",                value: "0.5rem / 8px",           description: "Component padding" },
  { category: "Spacing",    token: "spacing-md",                value: "1rem / 16px",            description: "Standard padding unit" },
  { category: "Spacing",    token: "spacing-lg",                value: "1.5rem / 24px",          description: "Section inner padding" },
  { category: "Spacing",    token: "spacing-xl",                value: "2.5rem / 40px",          description: "Section spacing" },
  { category: "Spacing",    token: "spacing-2xl",               value: "4rem / 64px",            description: "Major section padding" },
  { category: "Radius",     token: "radius-sm",                 value: "6px",                    description: "Small tags, pills" },
  { category: "Radius",     token: "radius-md",                 value: "10px",                   description: "Buttons, inputs" },
  { category: "Radius",     token: "radius-lg",                 value: "14px",                   description: "Cards, panels" },
  { category: "Radius",     token: "radius-xl",                 value: "18px",                   description: "Large cards, modals" },
  { category: "Radius",     token: "radius-2xl",                value: "24px",                   description: "Hero sections, feature blocks" },
  { category: "Radius",     token: "radius-full",               value: "9999px",                 description: "Badges, pills, avatars" },
  { category: "Shadow",     token: "shadow-card",               value: "0 1px 3px rgba(0,0,0,.3), 0 0 0 1px rgba(147,51,234,.12)", description: "Default card shadow" },
  { category: "Shadow",     token: "shadow-elevated",           value: "0 8px 32px rgba(0,0,0,.4), 0 0 0 1px rgba(147,51,234,.18)", description: "Elevated panels" },
  { category: "Shadow",     token: "shadow-glow-purple",        value: "0 0 40px rgba(147,51,234,.3)", description: "CTA buttons glow" },
  { category: "Breakpoint", token: "breakpoint-sm",             value: "640px",                  description: "Small phones (portrait)" },
  { category: "Breakpoint", token: "breakpoint-md",             value: "768px",                  description: "Tablets & large phones" },
  { category: "Breakpoint", token: "breakpoint-lg",             value: "1024px",                 description: "Laptops, small desktops" },
  { category: "Breakpoint", token: "breakpoint-xl",             value: "1280px",                 description: "Desktop" },
  { category: "Breakpoint", token: "breakpoint-2xl",            value: "1536px",                 description: "Wide / large desktop" },
];

// ─── Brand.tsx ────────────────────────────────────────────────────────────────

export function Brand() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Scroll-spy with IntersectionObserver
  useEffect(() => {
    const opts: IntersectionObserverInit = { rootMargin: "-25% 0px -65% 0px" };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, opts);
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileNavOpen(false);
  };

  const copyToken = (value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedToken(value);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#04040f", color: "#e8e8ff", minHeight: "100vh" }}>

      {/* ── BRAND BOOK HEADER ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{ background: "rgba(4,4,15,0.95)", backdropFilter: "blur(16px)", borderColor: "rgba(147,51,234,0.2)" }}
      >
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ color: "#8888bb" }}>
            <ArrowLeft size={14} />
            <span>Back to site</span>
          </Link>
          <span style={{ color: "rgba(147,51,234,0.4)" }}>|</span>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 900, fontSize: "1.05rem", letterSpacing: "0.16em", background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 40%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>NEXYRA</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#555577", textTransform: "uppercase" }}>Brand System</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(134,239,172,0.1)", color: "#86efac", fontFamily: "'JetBrains Mono', monospace", border: "1px solid rgba(134,239,172,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            v1.0 · August 2026
          </span>
          <button className="lg:hidden p-2 rounded-lg" style={{ color: "#8888bb" }} onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* ── MOBILE NAV DRAWER ── */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-16" style={{ background: "rgba(4,4,15,0.97)" }}>
          <nav className="p-6 flex flex-col gap-1">
            {SECTIONS.map(({ id, num, label, Icon }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                style={{ background: activeSection === id ? "rgba(147,51,234,0.12)" : "transparent", color: activeSection === id ? "#e8e8ff" : "#8888bb" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#9333EA", minWidth: "1.5rem" }}>{num}</span>
                <Icon size={14} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="flex max-w-screen-2xl mx-auto">

        {/* ── STICKY SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col w-52 shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto py-8 px-4 border-r" style={{ borderColor: "rgba(147,51,234,0.1)" }}>
          <p className="text-xs uppercase tracking-widest mb-4 px-4" style={{ color: "#555577", fontFamily: "'JetBrains Mono', monospace" }}>Sections</p>
          <nav className="flex flex-col gap-0.5">
            {SECTIONS.map(({ id, num, label, Icon }) => {
              const active = activeSection === id;
              return (
                <button key={id} onClick={() => scrollTo(id)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all"
                  style={{ background: active ? "rgba(147,51,234,0.12)" : "transparent", color: active ? "#e8e8ff" : "#8888bb", borderLeft: active ? "2px solid #9333EA" : "2px solid transparent" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: active ? "#9333EA" : "#555577", minWidth: "1.25rem" }}>{num}</span>
                  <Icon size={12} />
                  <span style={{ fontWeight: active ? 600 : 400 }}>{label}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-auto pt-6 px-3">
            <p className="text-xs" style={{ color: "#555577", fontFamily: "'JetBrains Mono', monospace" }}>© 2026 NEXYRA</p>
            <p className="text-xs mt-0.5" style={{ color: "#555577" }}>Internal use only</p>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main ref={mainRef} className="flex-1 min-w-0 px-6 md:px-10 lg:px-16 py-12">

          {/* ══════════════════════════════════════════════════════ OVERVIEW */}
          <section id="overview" className="mb-24">
            <SLabel num="01" text="Brand Overview" />

            {/* Hero statement */}
            <div className="rounded-2xl p-8 md:p-12 mb-10 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.15) 0%, rgba(37,99,235,0.08) 100%)", border: "1px solid rgba(147,51,234,0.25)" }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 80% 50%, rgba(147,51,234,0.1) 0%, transparent 70%)" }} />
              <div className="relative">
                <p className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Brand Statement</p>
                <p className="text-2xl md:text-3xl mb-6" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, color: "#e8e8ff", lineHeight: 1.3 }}>
                  "We design, build and transform digital products and technology solutions that help organisations move forward."
                </p>
                <p className="text-base" style={{ color: "#8888bb", maxWidth: "64ch", lineHeight: 1.7 }}>
                  NEXYRA Consulting is a technology and digital product partner headquartered in Slough, UK, with a delivery hub in Kolkata, India. Combining product design, software engineering, IT consulting and emerging technologies, we work with enterprises and growth-stage organisations to turn complex business challenges into scalable, high-performing digital products.
                </p>
              </div>
            </div>

            {/* 2-col grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <InfoBlock title="Brand Purpose" icon={<Target size={16} />}>
                To serve as the strategic technology partner that enterprises trust to navigate complexity — from product discovery and design through to software delivery and long-term digital transformation.
              </InfoBlock>
              <InfoBlock title="Brand Positioning" icon={<Sparkles size={16} />}>
                NEXYRA sits at the intersection of design rigour, engineering depth, and consulting intelligence. We bring the quality of a specialist consultancy without the overhead, moving from strategy to production at enterprise pace.
              </InfoBlock>
              <InfoBlock title="Brand Personality" icon={<Zap size={16} />}>
                Strategic without jargon. Technically deep without being opaque. Confident in outcomes, honest about constraints. We think in systems and deliver in specifics — precise, candid, and always outcome-driven.
              </InfoBlock>
              <InfoBlock title="Brand Principles" icon={<Building2 size={16} />}>
                <strong style={{ color: "#e8e8ff" }}>Outcome-first thinking.</strong> We measure success by business impact, not deliverable count. <strong style={{ color: "#e8e8ff" }}>Depth over speed.</strong> Sustainable quality is always faster than rework. <strong style={{ color: "#e8e8ff" }}>Partnership, not vendor.</strong>
              </InfoBlock>
            </div>

            {/* Who we serve */}
            <div className="rounded-2xl p-8 mb-8" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.12)" }}>
              <p className="text-xs uppercase tracking-widest mb-5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Who We Serve</p>
              <p className="text-base mb-6" style={{ color: "#8888bb", lineHeight: 1.7, maxWidth: "68ch" }}>
                Our clients are enterprises, scale-ups, and public-sector organisations operating across financial services, healthcare, retail, logistics, education and beyond. They come to NEXYRA when internal teams need specialist depth, when a product must move from concept to production quickly without compromising quality, or when technology strategy needs to be grounded in delivery reality.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Capability", value: "End-to-End" },
                  { label: "Sectors Active", value: "8+" },
                  { label: "Specialists", value: "28" },
                  { label: "Continents", value: "3" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-4" style={{ background: "rgba(147,51,234,0.06)", border: "1px solid rgba(147,51,234,0.14)" }}>
                    <p className="text-2xl mb-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, color: "#e8e8ff" }}>{value}</p>
                    <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand attributes */}
            <h3 className="text-sm uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Brand Attributes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {["Strategic", "Technology-Led", "Precise", "Enterprise-Ready", "Transparent", "Outcome-Driven"].map((attr) => (
                <div key={attr} className="text-center py-4 px-3 rounded-xl" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                  <p className="text-sm" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: "#e8e8ff" }}>{attr}</p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════════════════════ LOGO */}
          <section id="logo" className="mb-24">
            <SLabel num="02" text="Logo System" />

            {/* Primary horizontal lockup — gradient */}
            <h3 className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Primary Lockup — Horizontal (Gradient Colourway)</h3>
            <div className="rounded-2xl p-10 mb-4 flex items-center justify-center" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.2)" }}>
              <HorizontalLockupSVG width={320} variant="gradient" />
            </div>
            <p className="text-sm mb-8" style={{ color: "#8888bb" }}>The primary horizontal lockup at 400 × 104 units. Five approved colourways cover every placement context — gradient (default), on-dark, on-light, mono-white, and mono-black. The logo also ships as a vertical lockup and a standalone N monogram. All three configurations use the same N geometry and type metrics.</p>

            {/* 5 Colourways — horizontal */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>5 Approved Colourways — Horizontal</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
              <LogoVariantCard label="Gradient — dark backgrounds" bg="#08081a" border="rgba(147,51,234,0.2)">
                <HorizontalLockupSVG width={220} variant="gradient" />
              </LogoVariantCard>
              <LogoVariantCard label="On Dark — dark backgrounds" bg="#08081a" border="rgba(147,51,234,0.2)">
                <HorizontalLockupSVG width={220} variant="on-dark" />
              </LogoVariantCard>
              <LogoVariantCard label="On Light — white / pale backgrounds" bg="#f0f0ff" border="rgba(147,51,234,0.15)">
                <HorizontalLockupSVG width={220} variant="on-light" />
              </LogoVariantCard>
              <LogoVariantCard label="Mono White — single-colour dark" bg="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.1)">
                <HorizontalLockupSVG width={220} variant="mono-white" />
              </LogoVariantCard>
              <LogoVariantCard label="Mono Black — single-colour light" bg="#f0f0ff" border="rgba(0,0,0,0.1)">
                <HorizontalLockupSVG width={220} variant="mono-black" />
              </LogoVariantCard>
              <LogoVariantCard label="N Monogram — favicon / avatar" bg="#08081a" border="rgba(147,51,234,0.2)">
                <NMonogramSVG size={72} variant="gradient" />
              </LogoVariantCard>
            </div>
            <p className="text-xs mb-8 mt-3" style={{ color: "#8888bb" }}>Gradient is the preferred colourway on dark (website, digital advertising, event assets). On-dark and On-light are the safe-choice variants. Mono files are for one-colour print, engraving, and embroidery.</p>

            {/* Vertical lockup */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Vertical Lockup — 292 × 226</h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <LogoVariantCard label="Gradient" bg="#08081a" border="rgba(147,51,234,0.2)">
                <VerticalLockupSVG width={160} variant="gradient" />
              </LogoVariantCard>
              <LogoVariantCard label="On Light" bg="#f0f0ff" border="rgba(147,51,234,0.15)">
                <VerticalLockupSVG width={160} variant="on-light" />
              </LogoVariantCard>
              <LogoVariantCard label="Mono White" bg="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.1)">
                <VerticalLockupSVG width={160} variant="mono-white" />
              </LogoVariantCard>
            </div>

            {/* Gradient colourway documentation */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Gradient Colourway — Specification</h3>
            <div className="rounded-xl p-6 mb-8" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold mb-3" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Gradient Axis &amp; Stops</h4>
                  <div className="flex flex-col gap-2 mb-4">
                    {[
                      { label: "gradientUnits",   value: "userSpaceOnUse" },
                      { label: "x1 y1",           value: "0, 0" },
                      { label: "x2 y2",           value: "130, 130" },
                      { label: "Stop 0 (0%)",     value: "#A78BFA — violet-300" },
                      { label: "Stop 1 (39%)",    value: "#7C3AED — violet-600" },
                      { label: "Stop 2 (100%)",   value: "#3B82F6 — blue-500" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center py-1" style={{ borderBottom: "1px solid rgba(147,51,234,0.07)" }}>
                        <span className="text-xs" style={{ color: "#8888bb" }}>{label}</span>
                        <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-8 rounded-md" style={{ background: "linear-gradient(135deg, #A78BFA 0%, #7C3AED 39%, #3B82F6 100%)" }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-3" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Gradient Usage Rules</h4>
                  <ul className="flex flex-col gap-2">
                    {[
                      "Use gradient on dark (≥ #06060f) backgrounds only",
                      "gradient units are userSpaceOnUse — gradient maps to the 120 × 140 letterform grid, not the SVG canvas",
                      "NEXYRA and CONSULTING wordmarks are white (#FFFFFF) in this colourway",
                      "Do not apply the gradient to the wordmarks or hairlines",
                      "Do not reuse this gradient as a general brand fill outside the logo",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-xs" style={{ color: "#8888bb" }}>
                        <span style={{ color: "#a78bfa", flexShrink: 0 }}>›</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Hairline concept + Geometry */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                <h4 className="text-sm font-bold mb-3" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>The "Hairline into Gap" Concept</h4>
                <p className="text-sm mb-3" style={{ color: "#8888bb", lineHeight: 1.6 }}>
                  The N letterform is bisected by a precise diagonal cut. Two hairlines extend through this gap — continuing beyond the letterform on both sides.
                </p>
                <div className="rounded-lg p-3 mb-3" style={{ background: "rgba(147,51,234,0.08)", border: "1px solid rgba(147,51,234,0.2)" }}>
                  <p className="text-xs font-semibold mb-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#a78bfa" }}>Critical detail — do not alter</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#8888bb" }}>
                    The hairline runs along the <strong style={{ color: "#e8e8ff" }}>upper edge</strong> of the cut, not its centreline. The drawn line and the top edge of the opening are one continuous contour. This relationship is the defining detail of the mark. Do not "correct" it by centring the hairline in the gap.
                  </p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(147,51,234,0.06)", border: "1px solid rgba(147,51,234,0.12)" }}>
                  <NMonogramSVG size={48} variant="gradient" />
                  <div>
                    <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>N Monogram anatomy</p>
                    <p className="text-xs mt-1" style={{ color: "#8888bb" }}>Upper-edge hairline running through the diagonal gap</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                <h4 className="text-sm font-bold mb-3" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Monogram Geometry</h4>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: "#8888bb" }}>
                  All values are taken verbatim from the approved asset files. Do not redraw or approximate them.
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Letterform grid",       value: "120 × 140 units" },
                    { label: "Stem width",            value: "26 units" },
                    { label: "Cut — start",           value: "(−40, 120)" },
                    { label: "Cut — end",             value: "(160, 22)" },
                    { label: "Cut separation",        value: "10 units vertical, ~9 perpendicular" },
                    { label: "Hairline (left)",       value: "(−30, 115) → (−2, 101)" },
                    { label: "Hairline (right)",      value: "(122, 41) → (150, 27)" },
                    { label: "Hairline width",        value: "4 units, round caps" },
                    { label: "Mark total width",      value: "180 units (letter: 120)" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-1" style={{ borderBottom: "1px solid rgba(147,51,234,0.07)" }}>
                      <span className="text-xs" style={{ color: "#8888bb" }}>{label}</span>
                      <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Balance & configuration */}
            <div className="rounded-xl p-6 mb-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
              <h4 className="text-sm font-bold mb-3" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Balance &amp; Configuration</h4>
              <p className="text-xs mb-4" style={{ color: "#8888bb", lineHeight: 1.6 }}>
                In the horizontal lockup the N monogram is scaled to 0.457 and positioned at translate(34, 20) within the 400 × 104 canvas. In the vertical lockup it is scaled to 0.73 and centred at translate(102.2, 20) within the 292 × 226 canvas. The wordmark origin in the horizontal lockup sits at x=138, giving 104 units of text field width to the right of the mark — leaving a natural 34-unit margin from the wordmark edge to the SVG boundary. Text in the vertical lockup uses textAnchor="middle", anchored at x=148.7 (NEXYRA) and x=150.8 (CONSULTING), compensating for letter-spacing trailing advance.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { cfg: "Horizontal lockup", vb: "0 0 400 104", nTransform: "translate(34,20) scale(0.457)", nexyraOrigin: "x=138, y=57.1", consultingOrigin: "x=140.7, y=84.0" },
                  { cfg: "Vertical lockup",   vb: "0 0 292 226", nTransform: "translate(102.2,20) scale(0.73)", nexyraOrigin: "x=148.7, y=179.3 (middle)", consultingOrigin: "x=150.8, y=206.2 (middle)" },
                ].map(({ cfg, vb, nTransform, nexyraOrigin, consultingOrigin }) => (
                  <div key={cfg} className="rounded-lg p-4" style={{ background: "rgba(147,51,234,0.05)", border: "1px solid rgba(147,51,234,0.12)" }}>
                    <p className="text-xs font-semibold mb-2" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#a78bfa" }}>{cfg}</p>
                    {[
                      { k: "viewBox", v: vb },
                      { k: "N transform", v: nTransform },
                      { k: "NEXYRA", v: nexyraOrigin },
                      { k: "CONSULTING", v: consultingOrigin },
                    ].map(({ k, v }) => (
                      <div key={k} className="flex justify-between py-0.5">
                        <span className="text-xs" style={{ color: "#8888bb" }}>{k}</span>
                        <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Typography in the lockup */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Wordmark Typography</h3>
            <div className="rounded-xl overflow-hidden mb-6" style={{ border: "1px solid rgba(147,51,234,0.18)" }}>
              <div className="grid px-5 py-2 text-xs uppercase tracking-widest" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", background: "#0d0d22", fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>
                <span>Element</span><span>Typeface</span><span>Size</span><span>Weight</span><span>Tracking</span><span>Baseline interval</span>
              </div>
              {[
                { el: "NEXYRA",     tf: "Hanken Grotesk", sz: "51",   wt: "500 — Medium", tr: "5.33", bl: "26.9" },
                { el: "CONSULTING", tf: "Hanken Grotesk", sz: "16.1", wt: "400 — Regular", tr: "9.67", bl: "26.9" },
              ].map(({ el, tf, sz, wt, tr, bl }, i) => (
                <div key={el} className="grid items-center px-5 py-3" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", background: i % 2 === 0 ? "#08081a" : "transparent", borderTop: "1px solid rgba(147,51,234,0.08)" }}>
                  <span className="text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff" }}>{el}</span>
                  <span className="text-xs" style={{ color: "#c4c4e8" }}>{tf}</span>
                  <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#a78bfa" }}>{sz}</span>
                  <span className="text-xs" style={{ color: "#8888bb" }}>{wt}</span>
                  <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff" }}>{tr}</span>
                  <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8888bb" }}>{bl}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mb-8" style={{ color: "#8888bb" }}>
              The baseline interval of 26.9 units places CONSULTING at y=84.0 (horizontal) and y=206.2 (vertical), exactly one baseline below NEXYRA at y=57.1 / y=179.3. Do not alter size, weight, or tracking values — they are locked to the approved assets. Font: Hanken Grotesk (was Inter Tight prior to v2, August 2026).
            </p>

            {/* Clear space + Minimum sizes */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                <h4 className="text-sm font-bold mb-3" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Clear Space</h4>
                <p className="text-sm mb-4" style={{ color: "#8888bb", lineHeight: 1.6 }}>
                  One stem width (26 units, approximately 22% of the letter height) on all sides. Measure from the <strong style={{ color: "#e8e8ff" }}>hairline tips</strong>, not the letterform edge. Never let other elements intrude into this zone.
                </p>
                <div className="flex items-center justify-center p-4 rounded-lg" style={{ background: "rgba(147,51,234,0.05)", border: "1px dashed rgba(147,51,234,0.3)" }}>
                  <div className="relative p-6" style={{ border: "1px dashed rgba(167,139,250,0.4)", borderRadius: 4 }}>
                    <NMonogramSVG size={56} variant="gradient" />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#a78bfa", background: "#08081a" }}>26 units</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                <h4 className="text-sm font-bold mb-3" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Minimum Sizes</h4>
                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { label: "Horizontal lockup",    value: "165 px wide" },
                    { label: "Vertical lockup",      value: "120 px wide" },
                    { label: "N Monogram",           value: "40 px tall" },
                    { label: "Print minimum",        value: "40 mm wide (horizontal)" },
                    { label: "Clear space",          value: "26 units from hairline tips" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid rgba(147,51,234,0.08)" }}>
                      <span className="text-sm" style={{ color: "#8888bb" }}>{label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff", fontSize: "0.75rem" }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg p-3" style={{ background: "rgba(252,211,77,0.06)", border: "1px solid rgba(252,211,77,0.2)" }}>
                  <p className="text-xs leading-relaxed" style={{ color: "#8888bb" }}>
                    <strong style={{ color: "#fcd34d" }}>Below 40 px monogram:</strong> the 4-unit hairline and 9-unit gap begin to close on screen. For favicons at 16–32 px, request a small-size variant with the cut widened and external hairlines trimmed. That is the only case where the geometry above should change.
                  </p>
                </div>
              </div>
            </div>

            {/* Colour roles in the logo */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Colour Roles in the Logo</h3>
            <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid rgba(147,51,234,0.18)" }}>
              <div className="grid px-5 py-2 text-xs uppercase tracking-widest" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr", background: "#0d0d22", fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>
                <span>Role</span><span>Gradient</span><span>Light bg</span><span>Dark bg</span>
              </div>
              {[
                { role: "N letterform",       grad: "url(gradient)", gradDot: null, light: "#000000", dark: "#FFFFFF" },
                { role: "Hairline",           grad: "#9333EA",       gradDot: "#9333EA", light: "#9333EA", dark: "#9333EA" },
                { role: "NEXYRA wordmark",    grad: "#FFFFFF",       gradDot: "#FFFFFF", light: "#000000", dark: "#FFFFFF" },
                { role: "CONSULTING",         grad: "#FFFFFF",       gradDot: "#FFFFFF", light: "#2563EB", dark: "#2563EB" },
              ].map(({ role, grad, gradDot, light, dark }, i) => (
                <div key={role} className="grid items-center px-5 py-3" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr", background: i % 2 === 0 ? "#08081a" : "transparent", borderTop: "1px solid rgba(147,51,234,0.08)" }}>
                  <span className="text-sm" style={{ color: "#c4c4e8" }}>{role}</span>
                  <div className="flex items-center gap-2">
                    {gradDot
                      ? <div className="w-4 h-4 rounded-sm border" style={{ background: gradDot, borderColor: "rgba(255,255,255,0.1)" }} />
                      : <div className="w-4 h-4 rounded-sm border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(135deg, #A78BFA, #7C3AED 39%, #3B82F6)" }} />
                    }
                    <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8888bb" }}>{grad}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm border" style={{ background: light, borderColor: "rgba(255,255,255,0.1)" }} />
                    <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff" }}>{light}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm border" style={{ background: dark, borderColor: "rgba(255,255,255,0.1)" }} />
                    <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff" }}>{dark}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl p-4" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.15)" }}>
                <div className="w-3 h-3 rounded-full mb-2" style={{ background: "#9333EA" }} />
                <p className="text-xs font-semibold mb-1" style={{ color: "#a78bfa" }}>Violet — Hairline</p>
                <p className="text-xs leading-relaxed" style={{ color: "#8888bb" }}>Violet carries the hairline across all colourways. It is the signature element that crosses the letterform and extends beyond it, and it never changes colour.</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.15)" }}>
                <div className="w-3 h-3 rounded-full mb-2" style={{ background: "#2563EB" }} />
                <p className="text-xs font-semibold mb-1" style={{ color: "#93c5fd" }}>Blue — CONSULTING (on-dark / on-light)</p>
                <p className="text-xs leading-relaxed" style={{ color: "#8888bb" }}>Blue (#2563EB) carries the CONSULTING subline in the on-dark and on-light colourways, establishing visual hierarchy below NEXYRA. In the gradient colourway, CONSULTING is white — the gradient N already provides the accent.</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.15)" }}>
                <div className="w-3 h-3 rounded-full mb-2" style={{ background: "linear-gradient(135deg, #A78BFA, #3B82F6)", borderRadius: "50%" }} />
                <p className="text-xs font-semibold mb-1" style={{ color: "#e8e8ff" }}>Gradient — N Letterform (gradient colourway)</p>
                <p className="text-xs leading-relaxed" style={{ color: "#8888bb" }}>
                  The violet-to-blue gradient is applied only to the N letterform, using userSpaceOnUse coordinates. It maps continuously across both clip-path halves. Blue-on-black (CONSULTING, on-dark) is ~3.7:1 — acceptable at logo size; do not reuse for body copy.
                </p>
              </div>
            </div>

            {/* DOs and DON'Ts */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Correct &amp; Incorrect Usage</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl p-6" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <p className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "#86efac" }}>
                  <Check size={14} /> DO
                </p>
                <ul className="flex flex-col gap-2">
                  {[
                    "Use the gradient colourway as the default on dark backgrounds",
                    "Use the on-light version on white or pale backgrounds",
                    "Use the vertical lockup for square or portrait placements",
                    "Use mono files for one-colour print, engraving and embroidery",
                    "Maintain clear space (26 units from hairline tips) on all sides",
                    "Keep minimum widths: 165 px horizontal, 120 px vertical, 40 px tall monogram",
                    "Scale proportionally from the approved viewBox — never stretch",
                    "Convert to outlines before final print or handoff",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm" style={{ color: "#8888bb" }}>
                      <Check size={12} style={{ color: "#86efac", marginTop: 3, flexShrink: 0 }} />{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl p-6" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <p className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "#fca5a5" }}>
                  <XIcon size={14} /> DON'T
                </p>
                <ul className="flex flex-col gap-2">
                  {[
                    "Use the gradient colourway on white or light backgrounds",
                    "Centre the hairline in the cut — it belongs on the upper edge",
                    "Redraw or approximate the mark geometry — use the approved files",
                    "Rotate, skew, or distort any element",
                    "Apply drop shadows, outer glows, or effects",
                    "Change typeface, letter-spacing, or size values independently",
                    "Apply the N gradient to wordmarks, hairlines, or other elements",
                    "Use the blue-on-dark (#2563EB on dark) pairing for body copy",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm" style={{ color: "#8888bb" }}>
                      <XIcon size={12} style={{ color: "#fca5a5", marginTop: 3, flexShrink: 0 }} />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════════════════════ COLOUR */}
          <section id="colour" className="mb-24">
            <SLabel num="03" text="Colour System" />

            {/* Brand gradient */}
            <div className="rounded-2xl p-8 mb-8" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.2)" }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Primary Brand Gradient</p>
              <div className="rounded-xl h-20 mb-4" style={{ background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 40%, #3b82f6 100%)" }} />
              <p className="text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8888bb" }}>linear-gradient(135deg, #a78bfa 0%, #7c3aed 40%, #3b82f6 100%)</p>
              <p className="text-xs mt-1" style={{ color: "#555577" }}>Applied to: wordmark, CTA buttons, section accents, progress bars, underlines</p>
            </div>

            {/* Palette groups */}
            {[
              { title: "Brand Colours", items: PALETTE.brand },
              { title: "Background Colours", items: PALETTE.backgrounds },
              { title: "Text Colours", items: PALETTE.text },
              { title: "Semantic / State Colours", items: PALETTE.semantic },
            ].map(({ title, items }) => (
              <div key={title} className="mb-8">
                <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>{title}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((c) => (
                    <ColorSwatch key={c.hex} {...c} onCopy={copyToken} copied={copiedToken === c.hex} />
                  ))}
                </div>
              </div>
            ))}

            {/* UI States */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Interactive State Colours</h3>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(147,51,234,0.18)" }}>
              {[
                { state: "Default",  bg: "#9333EA",              text: "white",    desc: "Resting state for primary elements" },
                { state: "Hover",    bg: "#a855f7",              text: "white",    desc: "Lightened by ~10% on hover" },
                { state: "Active",   bg: "#7c3aed",              text: "white",    desc: "Darkened/pressed state" },
                { state: "Focus",    bg: "rgba(147,51,234,0.15)",text: "#e8e8ff", desc: "Ring: 2px solid rgba(147,51,234,0.8)" },
                { state: "Disabled", bg: "rgba(147,51,234,0.2)", text: "#555577", desc: "Reduced opacity, cursor:not-allowed" },
                { state: "Error",    bg: "rgba(239,68,68,0.15)", text: "#fca5a5", desc: "Error border + background tint" },
                { state: "Success",  bg: "rgba(34,197,94,0.12)", text: "#86efac", desc: "Confirmation and status active" },
                { state: "Warning",  bg: "rgba(234,179,8,0.12)", text: "#fcd34d", desc: "Caution and upcoming states" },
              ].map(({ state, bg, text, desc }, i) => (
                <div key={state} className="flex items-center gap-4 px-5 py-3" style={{ background: i % 2 === 0 ? "#08081a" : "transparent", borderBottom: "1px solid rgba(147,51,234,0.1)" }}>
                  <div className="w-24 h-7 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: bg, color: text, fontFamily: "'JetBrains Mono', monospace" }}>{state}</div>
                  <p className="text-sm flex-1" style={{ color: "#8888bb" }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════════════════ TYPOGRAPHY */}
          <section id="typography" className="mb-24">
            <SLabel num="04" text="Typography" />

            {/* Typeface showcase */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                { family: "Hanken Grotesk", weight: "600–700", role: "Display & Headings", token: "font-family-display", sample: "Designing What's Next", desc: "All hero, section, and card headings. Clean Swiss grotesque — legible at any weight and size. Replaces Archivo as of v2 (August 2026)." },
                { family: "DM Sans",        weight: "300–700", role: "Body & UI",          token: "font-family-body",    sample: "Clear thinking. Bold outcomes.", desc: "Body copy, button labels, navigation, form elements. Humanist sans optimised for screen reading at any size." },
                { family: "DM Mono",        weight: "400–500", role: "Price / Figures",    token: "font-family-price",   sample: "£2,400 / £1,800", desc: "Price tags, numeric values, and financial figures. Tabular spacing ensures clean column alignment." },
                { family: "JetBrains Mono", weight: "400–500", role: "Labels & Code",      token: "font-family-mono",    sample: "BRAND IDENTITY · 01", desc: "Section labels, badges, tags, design tokens, and technical values. Provides technical precision and contrast." },
              ].map(({ family, weight, role, token, sample, desc }) => (
                <div key={family} className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div>
                      <p className="text-base font-bold" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>{family}</p>
                      <p className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>{token}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: "rgba(147,51,234,0.12)", color: "#a78bfa", fontFamily: "'JetBrains Mono', monospace" }}>{role}</span>
                  </div>
                  <p className="mb-3 truncate" style={{
                    fontFamily: family === "JetBrains Mono" ? "'JetBrains Mono', monospace" : family === "DM Mono" ? "'DM Mono', monospace" : `'${family}', sans-serif`,
                    fontWeight: family === "Hanken Grotesk" ? 700 : family === "DM Mono" ? 500 : family === "JetBrains Mono" ? 500 : 400,
                    fontSize: family === "Hanken Grotesk" ? "1.5rem" : family === "DM Mono" ? "1.4rem" : family === "JetBrains Mono" ? "0.75rem" : "1rem",
                    color: "#e8e8ff",
                    letterSpacing: family === "JetBrains Mono" ? "0.12em" : family === "Hanken Grotesk" ? "-0.01em" : "0",
                    lineHeight: 1.2,
                  }}>
                    {sample}
                  </p>
                  <p className="text-sm" style={{ color: "#555577" }}>{desc}</p>
                  <p className="text-xs mt-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>Weights: {weight}</p>
                </div>
              ))}
            </div>

            {/* Logo typography specification */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Logo Wordmark Specification</h3>
            <div className="rounded-xl p-6 mb-8" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
              <div className="grid md:grid-cols-2 gap-6 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>NEXYRA</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Size",        value: "51 units (horizontal) · 51 units (vertical)" },
                      { label: "Weight",      value: "500 (Medium)" },
                      { label: "Tracking",    value: "+5.33 units (≈ 0.10 em)" },
                      { label: "Family",      value: "Hanken Grotesk → Neue Haas Grotesk Display → Helvetica Neue (v2)" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start py-1.5" style={{ borderBottom: "1px solid rgba(147,51,234,0.08)" }}>
                        <span className="text-xs" style={{ color: "#8888bb" }}>{label}</span>
                        <span className="text-xs text-right max-w-[55%]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#2563EB" }}>CONSULTING</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Size",                value: "16.1 units (both lockups)" },
                      { label: "Weight",              value: "400 (Regular)" },
                      { label: "Tracking",            value: "+9.67 units (≈ 0.60 em)" },
                      { label: "Baseline (h-lockup)", value: "y=84.0 (26.9 units below NEXYRA y=57.1)" },
                      { label: "Baseline (v-lockup)", value: "y=206.2 (26.9 units below NEXYRA y=179.3)" },
                      { label: "Family",              value: "Hanken Grotesk (matches NEXYRA)" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start py-1.5" style={{ borderBottom: "1px solid rgba(147,51,234,0.08)" }}>
                        <span className="text-xs" style={{ color: "#8888bb" }}>{label}</span>
                        <span className="text-xs text-right max-w-[55%]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg p-4" style={{ background: "rgba(147,51,234,0.06)", border: "1px solid rgba(147,51,234,0.15)" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#a78bfa" }}>Why different tracking values?</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#8888bb" }}>
                    CONSULTING is tracked at 0.60 em in both lockups. Because the horizontal and stacked lockups set the subline at different sizes (12 vs 11 units), the absolute values differ — 7.2 and 6.6. Matching the numbers rather than the ratio would make the two look different at matching sizes.
                  </p>
                </div>
                <div className="rounded-lg p-4" style={{ background: "rgba(147,51,234,0.06)", border: "1px solid rgba(147,51,234,0.15)" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#a78bfa" }}>Tracking limits & anchor compensation</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#8888bb" }}>
                    0.60 em is deliberately below the 0.78 em maximum — past that point CONSULTING grows wider than NEXYRA and the hierarchy inverts. For centred text, letter-spacing adds a trailing advance after the last glyph, shifting the visual centre left. The stacked lockup compensates by anchoring at x=123.3 instead of 120. If tracking changes, shift the anchor by half the difference.
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-lg p-3 flex items-start gap-2" style={{ background: "rgba(252,211,77,0.06)", border: "1px solid rgba(252,211,77,0.2)" }}>
                <span style={{ color: "#fcd34d", flexShrink: 0, marginTop: 1 }}>⚠</span>
                <p className="text-xs leading-relaxed" style={{ color: "#8888bb" }}>
                  <strong style={{ color: "#fcd34d" }}>Before final handoff:</strong> convert the wordmark text to outlines so it cannot re-flow on a machine without Hanken Grotesk installed. The wordmark typeface changed from Inter Tight to Hanken Grotesk in v2 (August 2026) — update any archived SVGs before re-use.
                </p>
              </div>
            </div>

            {/* Type scale */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Type Scale</h3>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(147,51,234,0.18)" }}>
              {TYPE_SCALE.map(({ label, size, weight, family, tracking, lh, sample }, i) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4" style={{ background: i % 2 === 0 ? "#08081a" : "transparent", borderBottom: i < TYPE_SCALE.length - 1 ? "1px solid rgba(147,51,234,0.1)" : "none" }}>
                  <div className="w-28 shrink-0">
                    <p className="text-xs font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#555577" }}>{size} · {weight}</p>
                  </div>
                  <p className="flex-1 truncate" style={{ fontFamily: family === "JetBrains Mono" ? "'JetBrains Mono', monospace" : family === "DM Mono" ? "'DM Mono', monospace" : `'${family}', sans-serif`, fontWeight: parseInt(weight), fontSize: label === "Display" ? "2rem" : label === "Heading XL" ? "1.8rem" : label === "Heading L" ? "1.5rem" : label === "Heading M" ? "1.25rem" : label === "Heading S" ? "1.1rem" : label === "Body L" ? "1.05rem" : label === "Body" ? "1rem" : label === "Body S" ? "0.9rem" : "0.8rem", color: "#e8e8ff", letterSpacing: tracking, lineHeight: lh }}>
                    {sample}
                  </p>
                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>ls {tracking}</p>
                    <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>lh {lh}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* ════════════════════════════════════════════════════════ LAYOUT */}
          <section id="layout" className="mb-24">
            <SLabel num="05" text="Spacing & Layout" />

            {/* Spacing scale */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Spacing Scale (4px base unit)</h3>
            <div className="rounded-xl overflow-hidden mb-8" style={{ border: "1px solid rgba(147,51,234,0.18)" }}>
              {SPACING.map(({ token, px, rem, tw, use }, i) => (
                <div key={token} className="flex items-center gap-4 px-5 py-3" style={{ background: i % 2 === 0 ? "#08081a" : "transparent", borderBottom: i < SPACING.length - 1 ? "1px solid rgba(147,51,234,0.08)" : "none" }}>
                  <div className="w-24 shrink-0 flex items-center">
                    <div className="h-4 rounded-sm" style={{ width: Math.min(parseInt(px), 128), background: "linear-gradient(90deg, #7c3aed, #3b82f6)", minWidth: 4 }} />
                  </div>
                  <div className="w-24 shrink-0">
                    <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>{token}</p>
                  </div>
                  <div className="flex gap-4 flex-1">
                    <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff" }}>{px}</p>
                    <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>{rem}</p>
                    <p className="text-xs hidden sm:block" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>tw-{tw}</p>
                  </div>
                  <p className="text-xs hidden md:block" style={{ color: "#555577" }}>{use}</p>
                </div>
              ))}
            </div>

            {/* Grid system */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Grid System & Container Widths</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                <h4 className="text-sm font-bold mb-4" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Container Widths</h4>
                {[
                  { label: "Max container", value: "max-w-7xl (1280px)" },
                  { label: "Wide container", value: "max-w-screen-2xl (1536px)" },
                  { label: "Content column", value: "max-w-3xl (768px)" },
                  { label: "Narrow content", value: "max-w-2xl (672px)" },
                  { label: "Horizontal padding", value: "px-6 (24px) → px-10 (40px) on md+" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 text-sm" style={{ borderBottom: "1px solid rgba(147,51,234,0.08)" }}>
                    <span style={{ color: "#8888bb" }}>{label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff", fontSize: "0.7rem" }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                <h4 className="text-sm font-bold mb-4" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Border Radius Scale</h4>
                {[
                  { token: "radius-sm",   value: "6px",    use: "Pills, small tags, chips" },
                  { token: "radius-md",   value: "10px",   use: "Buttons, inputs, select" },
                  { token: "radius-lg",   value: "14px",   use: "Cards, panels, tooltips" },
                  { token: "radius-xl",   value: "18px",   use: "Large cards, modals" },
                  { token: "radius-2xl",  value: "24px",   use: "Hero cards, feature blocks" },
                  { token: "radius-full", value: "9999px", use: "Badges, pills, avatars" },
                ].map(({ token, value, use }) => (
                  <div key={token} className="flex items-center gap-3 py-1.5" style={{ borderBottom: "1px solid rgba(147,51,234,0.08)" }}>
                    <div className="w-8 h-5 bg-purple-700 shrink-0" style={{ borderRadius: value === "9999px" ? "9999px" : value }} />
                    <p className="text-xs flex-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>{token}</p>
                    <p className="text-xs" style={{ color: "#555577" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section spacing */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Section Spacing Conventions</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: "Page header padding", value: "pt-32 (128px)", note: "All page routes start at pt-32 to clear the fixed navbar" },
                { label: "Section vertical spacing", value: "py-16 → py-24", note: "Most sections use py-16 or py-20; hero and CTA sections use py-24" },
                { label: "Card inner padding", value: "p-6 → p-8 → p-10", note: "Standard cards use p-6; featured / wide cards use p-8 or p-10" },
              ].map(({ label, value, note }) => (
                <div key={label} className="rounded-xl p-5" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>{label}</p>
                  <p className="text-lg font-bold mb-2" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>{value}</p>
                  <p className="text-xs" style={{ color: "#555577" }}>{note}</p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* ════════════════════════════════════════════════════ COMPONENTS */}
          <section id="components" className="mb-24">
            <SLabel num="06" text="UI Components" />

            {/* Buttons */}
            <ComponentGroup title="Buttons">
              <div className="flex flex-wrap gap-3 mb-4">
                <button className="px-6 py-3 rounded-full text-sm font-bold transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff", boxShadow: "0 0 24px rgba(147,51,234,0.3)", fontFamily: "'DM Sans', sans-serif" }}>Primary CTA</button>
                <button className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:border-purple-500" style={{ border: "1px solid rgba(147,51,234,0.4)", color: "#e8e8ff", background: "transparent", fontFamily: "'DM Sans', sans-serif" }}>Secondary</button>
                <button className="px-6 py-3 rounded-full text-sm font-semibold transition-colors hover:text-white" style={{ color: "#8888bb", background: "transparent", fontFamily: "'DM Sans', sans-serif" }}>Ghost</button>
                <button className="px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2" style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
                  With Icon <ArrowUpRight size={14} />
                </button>
                <button disabled className="px-6 py-3 rounded-full text-sm font-bold cursor-not-allowed" style={{ background: "rgba(147,51,234,0.15)", color: "#555577", fontFamily: "'DM Sans', sans-serif" }}>Disabled</button>
              </div>
              <p className="text-xs" style={{ color: "#555577" }}>Buttons use rounded-full (radius-full). Primary uses gradient fill + glow shadow. Secondary uses purple border. All buttons min-height 44px (touch target).</p>
            </ComponentGroup>

            {/* Badges */}
            <ComponentGroup title="Badges & Pills">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(34,197,94,0.12)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>● Active</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(107,114,128,0.15)", color: "#9ca3af", border: "1px solid rgba(107,114,128,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>○ Upcoming</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(147,51,234,0.12)", color: "#a78bfa", border: "1px solid rgba(147,51,234,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>Brand Identity</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.25)", fontFamily: "'JetBrains Mono', monospace" }}>Error</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(234,179,8,0.1)", color: "#fcd34d", border: "1px solid rgba(234,179,8,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>Warning</span>
              </div>
              <p className="text-xs" style={{ color: "#555577" }}>All badges use JetBrains Mono at 12px. Rounded-full. Background is 10–15% opacity of the semantic colour.</p>
            </ComponentGroup>

            {/* Cards */}
            <ComponentGroup title="Cards">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="rounded-2xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                  <p className="text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Standard Card</p>
                  <h4 className="text-base font-bold mb-2" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>UI/UX Design</h4>
                  <p className="text-sm" style={{ color: "#8888bb" }}>Interfaces that feel inevitable — intuitive, performant, and precisely crafted.</p>
                </div>
                <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.12) 0%, rgba(37,99,235,0.08) 100%)", border: "1px solid rgba(147,51,234,0.3)" }}>
                  <p className="text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Featured Card</p>
                  <h4 className="text-base font-bold mb-2" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Brand Identity</h4>
                  <p className="text-sm" style={{ color: "#8888bb" }}>Systems that scale — not just a logo, but a living identity that compounds.</p>
                </div>
              </div>
              <p className="text-xs" style={{ color: "#555577" }}>Standard cards: #08081a bg + rgba(147,51,234,0.18) border + rounded-2xl. Featured cards use gradient background.</p>
            </ComponentGroup>

            {/* Form elements */}
            <ComponentGroup title="Form Elements">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold" style={{ color: "#c4c4e8" }}>Full Name <span style={{ color: "#9333EA" }}>*</span></label>
                  <input placeholder="Jane Smith" className="px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#0d0d20", border: "1px solid rgba(124,58,237,0.2)", color: "#e8e8ff", fontFamily: "'DM Sans', sans-serif" }} readOnly />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold" style={{ color: "#c4c4e8" }}>Error State</label>
                  <input placeholder="invalid@" className="px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.4)", color: "#e8e8ff", fontFamily: "'DM Sans', sans-serif" }} readOnly />
                  <p className="text-xs flex items-center gap-1" style={{ color: "#fca5a5" }}><AlertCircle size={11} />Please enter a valid email address</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold" style={{ color: "#c4c4e8" }}>Select / Dropdown</label>
                  <select className="px-4 py-3 rounded-xl text-sm outline-none cursor-pointer" style={{ background: "#0d0d20", border: "1px solid rgba(124,58,237,0.2)", color: "#8888bb", fontFamily: "'DM Sans', sans-serif" }}>
                    <option>Select a service</option>
                    <option>Brand Identity</option>
                    <option>UI/UX Design</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold" style={{ color: "#c4c4e8" }}>Textarea</label>
                  <textarea placeholder="Describe your project..." rows={3} className="px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: "#0d0d20", border: "1px solid rgba(124,58,237,0.2)", color: "#e8e8ff", fontFamily: "'DM Sans', sans-serif" }} readOnly />
                </div>
              </div>
              <p className="text-xs" style={{ color: "#555577" }}>Inputs: #0d0d20 bg, rgba(124,58,237,0.2) border, rounded-xl. Focus: border-color rgba(124,58,237,0.6). Error: rgba(239,68,68,0.4) border.</p>
            </ComponentGroup>

            {/* Alerts */}
            <ComponentGroup title="Alerts & Notices">
              <div className="flex flex-col gap-3 mb-4">
                {[
                  { type: "success", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.25)",  color: "#86efac",  icon: <Check size={15} />,        msg: "Your message has been sent. We'll respond within 4 hours." },
                  { type: "error",   bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.25)",  color: "#fca5a5",  icon: <AlertCircle size={15} />,  msg: "Something went wrong. Please try again or email us directly." },
                  { type: "info",    bg: "rgba(147,51,234,0.08)", border: "rgba(147,51,234,0.25)", color: "#a78bfa",  icon: <Info size={15} />,         msg: "Dubai studio opening Q3 2025 — stay tuned for more details." },
                  { type: "warning", bg: "rgba(234,179,8,0.08)",  border: "rgba(234,179,8,0.2)",   color: "#fcd34d",  icon: <AlertCircle size={15} />,  msg: "This project plan is currently in draft state." },
                ].map(({ type, bg, border, color, icon, msg }) => (
                  <div key={type} className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm" style={{ background: bg, border: `1px solid ${border}`, color }}>
                    <span className="shrink-0 mt-0.5">{icon}</span>
                    <span style={{ color: "#c4c4e8" }}>{msg}</span>
                  </div>
                ))}
              </div>
            </ComponentGroup>

            {/* Navigation */}
            <ComponentGroup title="Navigation Items">
              <div className="flex flex-col gap-1 rounded-xl p-4 mb-4 w-48" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                {["Services", "Work", "Pricing", "About", "Location"].map((item, i) => (
                  <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: i === 1 ? "rgba(147,51,234,0.12)" : "transparent", color: i === 1 ? "#e8e8ff" : "#8888bb", fontFamily: "'DM Sans', sans-serif", fontWeight: i === 1 ? 600 : 400 }}>
                    {i === 1 && <ChevronRight size={12} style={{ color: "#9333EA" }} />}
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: "#555577" }}>Active nav items: white text, no underline. Inactive: #8888bb. Hover: #e8e8ff. Active state uses subtle purple tint background on sidebar nav.</p>
            </ComponentGroup>

            {/* Section header pattern */}
            <ComponentGroup title="Section Header Pattern">
              <div className="p-6 rounded-xl mb-4" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Why NEXYRA</p>
                <h2 className="text-3xl font-black mb-3" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Built different, by design</h2>
                <p className="text-base" style={{ color: "#8888bb", lineHeight: 1.7, maxWidth: "52ch" }}>We operate as an embedded extension of your team — not an agency that disappears after a brief.</p>
              </div>
              <p className="text-xs" style={{ color: "#555577" }}>Pattern: JetBrains Mono overline → Hanken Grotesk heading → DM Sans description. Always stacked vertically. Overline uses brand purple.</p>
            </ComponentGroup>
          </section>

          <Divider />

          {/* ════════════════════════════════════════════════════ RESPONSIVE */}
          <section id="responsive" className="mb-24">
            <SLabel num="07" text="Responsive Design System" />

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                { bp: "Mobile", px: "< 640px", tw: "default", cols: "1", nav: "Hamburger drawer", spacing: "px-4, py-12", type: "Fluid font sizes via clamp()" },
                { bp: "Tablet", px: "640–1023px", tw: "sm / md", cols: "1–2", nav: "Hamburger drawer", spacing: "px-6, py-16", type: "Intermediate sizes" },
                { bp: "Laptop", px: "1024–1279px", tw: "lg", cols: "2–3", nav: "Full desktop nav", spacing: "px-8, py-20", type: "Full scale visible" },
                { bp: "Desktop", px: "≥ 1280px", tw: "xl / 2xl", cols: "3–4", nav: "Full desktop nav", spacing: "px-10, py-24", type: "Full display scale" },
              ].map(({ bp, px, tw, cols, nav, spacing, type }) => (
                <div key={bp} className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone size={14} style={{ color: "#9333EA" }} />
                    <h4 className="text-base font-bold" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>{bp}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ fontFamily: "'JetBrains Mono', monospace", background: "rgba(147,51,234,0.1)", color: "#a78bfa" }}>{tw}</span>
                  </div>
                  <p className="text-xs mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>{px}</p>
                  {[
                    ["Grid", cols + " col(s)"],
                    ["Navigation", nav],
                    ["Spacing", spacing],
                    ["Typography", type],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm py-1" style={{ borderBottom: "1px solid rgba(147,51,234,0.08)" }}>
                      <span style={{ color: "#555577" }}>{k}</span>
                      <span style={{ color: "#c4c4e8" }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Mobile-First Principles</h3>
            <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
              <ul className="grid sm:grid-cols-2 gap-3">
                {[
                  "Write base styles for mobile first, use breakpoint prefixes (sm:, md:, lg:) for larger screens",
                  "Use clamp() for fluid typography — no abrupt size jumps",
                  "Touch targets minimum 44×44px on all interactive elements",
                  "Navigation collapses to hamburger drawer below lg (1024px)",
                  "Grid always starts 1-column, expands with sm:grid-cols-2, lg:grid-cols-3",
                  "Sidebar navigation hidden on mobile — accessible via hamburger or bottom pill nav",
                  "Hero font sizes use clamp(5rem, 18vw, 14rem) to scale gracefully",
                  "Cards always full-width on mobile, 2-col on sm+, 3+ on lg+",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm" style={{ color: "#8888bb" }}>
                    <Check size={12} style={{ color: "#9333EA", marginTop: 3, flexShrink: 0 }} />{p}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════════ ACCESSIBILITY */}
          <section id="accessibility" className="mb-24">
            <SLabel num="08" text="Accessibility" />

            <div className="rounded-xl p-5 mb-6 flex items-start gap-3" style={{ background: "rgba(147,51,234,0.08)", border: "1px solid rgba(147,51,234,0.25)" }}>
              <Info size={16} style={{ color: "#9333EA", marginTop: 1, flexShrink: 0 }} />
              <p className="text-sm" style={{ color: "#c4c4e8" }}>NEXYRA Consulting aims for <strong style={{ color: "#e8e8ff" }}>WCAG 2.2 AA compliance</strong> across all digital touchpoints. The following guidelines apply to all components and pages.</p>
            </div>

            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Colour Contrast Ratios</h3>
            <div className="rounded-xl overflow-hidden mb-6" style={{ border: "1px solid rgba(147,51,234,0.18)" }}>
              {[
                { pair: "#e8e8ff on #04040f",    ratio: "18.4:1", level: "AAA", pass: true },
                { pair: "#c4c4e8 on #04040f",    ratio: "12.1:1", level: "AAA", pass: true },
                { pair: "#8888bb on #04040f",    ratio: "5.8:1",  level: "AA",  pass: true },
                { pair: "#e8e8ff on #08081a",    ratio: "16.9:1", level: "AAA", pass: true },
                { pair: "#9333EA on #08081a",    ratio: "4.7:1",  level: "AA",  pass: true, note: "Large text / UI components" },
                { pair: "#555577 on #04040f",    ratio: "3.1:1",  level: "—",   pass: false, note: "Decorative / non-critical only" },
              ].map(({ pair, ratio, level, pass, note }, i) => (
                <div key={pair} className="flex items-center gap-4 px-5 py-3 text-sm" style={{ background: i % 2 === 0 ? "#08081a" : "transparent", borderBottom: i < 5 ? "1px solid rgba(147,51,234,0.08)" : "none" }}>
                  <span className="flex-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8888bb", fontSize: "0.7rem" }}>{pair}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff", minWidth: "3.5rem" }}>{ratio}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: pass ? "rgba(34,197,94,0.12)" : "rgba(107,114,128,0.15)", color: pass ? "#86efac" : "#9ca3af", fontFamily: "'JetBrains Mono', monospace" }}>{level}</span>
                  {note && <span className="hidden sm:inline text-xs" style={{ color: "#555577" }}>{note}</span>}
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                <h4 className="text-sm font-bold mb-4" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Focus & Keyboard</h4>
                <ul className="flex flex-col gap-2">
                  {["All interactive elements are keyboard reachable","Focus ring: 2px solid rgba(147,51,234,0.8), 2px offset","Never remove :focus-visible outline","Tab order matches visual reading order","Skip-to-content link on all pages","Modals trap focus; ESC closes them"].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm" style={{ color: "#8888bb" }}>
                      <Check size={12} style={{ color: "#86efac", marginTop: 3, flexShrink: 0 }} />{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                <h4 className="text-sm font-bold mb-4" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Content & Structure</h4>
                <ul className="flex flex-col gap-2">
                  {["Single H1 per page; logical heading hierarchy","All images carry descriptive alt text","Decorative images use alt=\"\"","Buttons have accessible labels (aria-label)","Forms have associated labels via htmlFor","Error messages linked to fields via aria-describedby","Touch targets minimum 44×44px","Colour never used as the sole conveyor of meaning"].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm" style={{ color: "#8888bb" }}>
                      <Check size={12} style={{ color: "#86efac", marginTop: 3, flexShrink: 0 }} />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <Divider />

          {/* ════════════════════════════════════════════════ ICONS & IMAGERY */}
          <section id="icons" className="mb-24">
            <SLabel num="09" text="Icons & Imagery" />

            {/* Icon system */}
            <div className="rounded-xl p-6 mb-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
              <div className="flex items-center gap-3 mb-4">
                <Globe size={16} style={{ color: "#9333EA" }} />
                <h4 className="text-sm font-bold" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Icon Library — Lucide React</h4>
                <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="ml-auto text-xs flex items-center gap-1 hover:text-white transition-colors" style={{ color: "#9333EA" }}>lucide.dev <ArrowUpRight size={10} /></a>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-3 mb-4">
                {[
                  ArrowUpRight, ArrowRight, ChevronRight, Menu, Mail, Phone,
                  MapPin, Clock, Globe, Users, Briefcase, Zap,
                  Sparkles, Star, Target, Building2, Lock, Check,
                  AlertCircle, Info, Eye, Copy, Image, Code2,
                ].map((Icon, i) => (
                  <div key={i} className="flex items-center justify-center w-10 h-10 rounded-lg transition-all hover:bg-purple-900/20" style={{ border: "1px solid rgba(147,51,234,0.15)" }}>
                    <Icon size={16} style={{ color: "#8888bb" }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                <h4 className="text-sm font-bold mb-4" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Icon Sizing Guide</h4>
                {[
                  { size: "12px", use: "Inline text, badge indicators" },
                  { size: "14–16px", use: "Navigation, buttons, list items" },
                  { size: "18–20px", use: "Primary actions, card headers" },
                  { size: "24px", use: "Section icons, feature highlights" },
                  { size: "32–48px", use: "Hero illustrations, empty states" },
                ].map(({ size, use }) => (
                  <div key={size} className="flex items-center gap-3 py-1.5" style={{ borderBottom: "1px solid rgba(147,51,234,0.08)" }}>
                    <ArrowRight size={parseInt(size)} style={{ color: "#9333EA", flexShrink: 0 }} />
                    <p className="text-xs flex-1" style={{ color: "#8888bb" }}>{use}</p>
                    <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>{size}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                <h4 className="text-sm font-bold mb-4" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>Photography & Imagery Direction</h4>
                <ul className="flex flex-col gap-2">
                  {[
                    "Dark, atmospheric photography — minimal, intentional light",
                    "Technology-forward subjects: code, design, interfaces",
                    "Human presence: focused professionals, not stock smiles",
                    "Avoid overly corporate or literal imagery",
                    "Prefer: dark backgrounds, high-contrast, single focal points",
                    "Always use 16:9 (landscape) or 4:3 for content images",
                    "Profile/avatar images: 1:1 square with radius-full",
                    "Apply subtle purple tint overlay at 15–25% opacity on photos",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm" style={{ color: "#8888bb" }}>
                      <Check size={11} style={{ color: "#9333EA", marginTop: 3, flexShrink: 0 }} />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════════ DESIGN TOKENS */}
          <section id="tokens" className="mb-24">
            <SLabel num="10" text="Design Tokens" />

            <p className="text-sm mb-6" style={{ color: "#8888bb", lineHeight: 1.7 }}>
              All design decisions are expressed as named tokens. These map directly to CSS custom properties and can be exported to a Figma design-token system. Token names follow the pattern: <code className="px-1.5 py-0.5 rounded" style={{ background: "rgba(147,51,234,0.12)", color: "#a78bfa", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem" }}>category-role-variant</code>
            </p>

            {["Color", "Typography", "Spacing", "Radius", "Shadow", "Breakpoint"].map((cat) => {
              const rows = TOKENS.filter((t) => t.category === cat);
              return (
                <div key={cat} className="mb-6">
                  <h3 className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>{cat} Tokens</h3>
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(147,51,234,0.18)" }}>
                    {rows.map(({ token, value, description }, i) => (
                      <div key={token} className="flex items-center gap-3 px-4 py-2.5" style={{ background: i % 2 === 0 ? "#08081a" : "transparent", borderBottom: i < rows.length - 1 ? "1px solid rgba(147,51,234,0.06)" : "none" }}>
                        {cat === "Color" && !value.includes("→") && (
                          <div className="w-5 h-5 rounded shrink-0" style={{ background: value, border: "1px solid rgba(255,255,255,0.1)" }} />
                        )}
                        <code className="text-xs w-64 shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#a78bfa" }}>{token}</code>
                        <code className="text-xs flex-1 hidden sm:block" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e8e8ff" }}>{value}</code>
                        <p className="text-xs flex-1 hidden md:block" style={{ color: "#555577" }}>{description}</p>
                        <button onClick={() => copyToken(value)} className="shrink-0 p-1.5 rounded transition-colors hover:bg-purple-900/20" style={{ color: copiedToken === value ? "#86efac" : "#555577" }} title="Copy value">
                          {copiedToken === value ? <CheckCheck size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          <Divider />

          {/* ══════════════════════════════════════════════════════════ VOICE */}
          <section id="voice" className="mb-24">
            <SLabel num="11" text="Brand Voice & Content" />

            {/* Personality attributes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { attr: "Confident",     desc: "We speak with authority — not arrogance. We know our work, and we stand behind it." },
                { attr: "Intelligent",   desc: "We use precise language. We don't oversimplify, and we never pad with buzzwords." },
                { attr: "Modern",        desc: "Current, relevant, forward-facing. We write like a company that belongs at the frontier." },
                { attr: "Trustworthy",   desc: "Honest about timelines, capabilities, and outcomes. No false promises, ever." },
              ].map(({ attr, desc }) => (
                <div key={attr} className="rounded-xl p-5" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                  <p className="text-base font-black mb-2" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>{attr}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#8888bb" }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Writing principles */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Writing Principles</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { principle: "Lead with outcome, not process", body: "Say 'Elevate your brand' not 'We will go through a branding process with you'." },
                { principle: "Be specific, not vague", body: "Say 'Response within 4 hours' not 'Quick response times'." },
                { principle: "Active voice always", body: "Say 'We deliver' not 'Deliverables are provided by our team'." },
                { principle: "Short sentences win", body: "Target 15–20 words per sentence for body copy. Headings under 8 words." },
              ].map(({ principle, body }) => (
                <div key={principle} className="rounded-xl p-5 flex gap-3" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
                  <div className="w-1.5 rounded-full shrink-0 mt-1" style={{ background: "linear-gradient(to bottom, #9333EA, #2563EB)", minHeight: "2.5rem" }} />
                  <div>
                    <p className="text-sm font-bold mb-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>{principle}</p>
                    <p className="text-sm" style={{ color: "#8888bb" }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* DOs and DON'Ts for copy */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Copy Do's & Don'ts</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="rounded-xl p-6" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <p className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "#86efac" }}><Check size={14} />Write like this</p>
                <ul className="flex flex-col gap-3">
                  {[
                    ["CTA", "Start your project →"],
                    ["Heading", "Design that moves at your speed"],
                    ["Body", "Senior-level work. No overhead. No hand-holding."],
                    ["Badge", "ACTIVE"],
                    ["Error", "Please enter a valid email address."],
                  ].map(([type, text]) => (
                    <li key={type} className="text-sm">
                      <span className="text-xs mr-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>{type}</span>
                      <span style={{ color: "#c4c4e8" }}>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl p-6" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <p className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "#fca5a5" }}><XIcon size={14} />Not like this</p>
                <ul className="flex flex-col gap-3">
                  {[
                    ["CTA", "Click here to get started with us today!"],
                    ["Heading", "Innovative synergistic design solutions for your needs"],
                    ["Body", "We are a passionate team of creative individuals..."],
                    ["Badge", "Currently Active Status"],
                    ["Error", "Oops! Something seems to be wrong."],
                  ].map(([type, text]) => (
                    <li key={type} className="text-sm">
                      <span className="text-xs mr-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>{type}</span>
                      <span style={{ color: "#8888bb" }}>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA language */}
            <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>Approved CTA Language</h3>
            <div className="flex flex-wrap gap-2">
              {["Start a Project", "Book a Call", "Get in Touch", "View Our Work", "See Pricing", "Explore Services", "Meet the Team"].map((cta) => (
                <span key={cta} className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "rgba(147,51,234,0.12)", color: "#a78bfa", border: "1px solid rgba(147,51,234,0.25)", fontFamily: "'DM Sans', sans-serif" }}>
                  {cta} →
                </span>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(147,51,234,0.15)" }}>
            <div>
              <p className="text-sm font-bold" style={{ fontFamily: "'Inter Tight', sans-serif", letterSpacing: "0.15em", background: "linear-gradient(135deg, #a78bfa, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>NEXYRA</p>
              <p className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577", letterSpacing: "0.2em" }}>BRAND SYSTEM v1.0 · AUGUST 2026</p>
            </div>
            <p className="text-xs" style={{ color: "#555577" }}>Internal use only. Not for distribution. © 2026 NEXYRA CONSULTING LTD.</p>
            <Link to="/" className="text-sm flex items-center gap-1.5 transition-colors hover:text-white" style={{ color: "#9333EA" }}>
              Back to website <ArrowUpRight size={13} />
            </Link>
          </footer>

        </main>
      </div>
    </div>
  );
}

// ─── Helper UI components ─────────────────────────────────────────────────────

function SLabel({ num, text }: { num: string; text: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-8">
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#9333EA", letterSpacing: "0.15em" }}>{num}</span>
      <h2 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#e8e8ff", lineHeight: 1.1 }}>{text}</h2>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(147,51,234,0.25), transparent)", margin: "0 0 5rem" }} />;
}

function InfoBlock({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: "#9333EA" }}>{icon}</span>
        <h3 className="text-sm font-bold" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>{title}</h3>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "#8888bb" }}>{children}</p>
    </div>
  );
}

function LogoVariantCard({ label, bg, border, children }: { label: string; bg: string; border: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
      <div className="flex items-center justify-center p-8" style={{ background: bg, minHeight: "120px" }}>
        {children}
      </div>
      <p className="text-xs text-center py-2.5 px-4" style={{ background: "#08081a", fontFamily: "'JetBrains Mono', monospace", color: "#555577", borderTop: `1px solid ${border}` }}>{label}</p>
    </div>
  );
}

function ComponentGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#9333EA" }}>{title}</h3>
      <div className="rounded-xl p-6" style={{ background: "#08081a", border: "1px solid rgba(147,51,234,0.18)" }}>{children}</div>
    </div>
  );
}

function ColorSwatch({ name, hex, rgb, hsl, token, role, usage, onCopy, copied }: {
  name: string; hex: string; rgb: string; hsl: string; token: string; role: string; usage: string;
  onCopy: (v: string) => void; copied: boolean;
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(147,51,234,0.15)" }}>
      <div className="relative h-16 group cursor-pointer" style={{ background: hex }} onClick={() => onCopy(hex)}>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.4)" }}>
          {copied ? <CheckCheck size={16} color="white" /> : <Copy size={16} color="white" />}
        </div>
      </div>
      <div className="p-3.5" style={{ background: "#08081a" }}>
        <div className="flex items-start justify-between gap-1 mb-1">
          <p className="text-xs font-bold" style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: "#e8e8ff" }}>{name}</p>
          <span className="text-xs px-1.5 py-0.5 rounded shrink-0" style={{ background: "rgba(147,51,234,0.1)", color: "#a78bfa", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem" }}>{role}</span>
        </div>
        <p className="text-xs mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#c4c4e8" }}>{hex}</p>
        <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>rgb({rgb})</p>
        <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#555577" }}>hsl({hsl})</p>
        <p className="text-xs mt-2 leading-relaxed" style={{ color: "#555577" }}>{usage}</p>
      </div>
    </div>
  );
}
