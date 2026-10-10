import React, { useEffect, useRef, useCallback } from "react";
import {
  HorizontalLockupSVG,
  VerticalLockupSVG,
  NMonogramSVG,
  type LogoVariant,
} from "../BrandLogo";
import {
  ArrowRight, ArrowUpRight, BarChart2, Calendar, Check,
  ChevronDown, ChevronRight, Clock, Cloud, Code, Compass,
  Database, Download, ExternalLink, FileText, Folder,
  GitBranch, Globe, Layers, LayoutGrid, Lightbulb, Mail,
  Menu, Monitor, Phone, Plus, Search, Settings, Shield,
  Smartphone, Target, Terminal, TrendingUp, User, Users, X, Zap,
} from "lucide-react";

// ─── Download helpers ─────────────────────────────────────────────────────────

function downloadSVGEl(svgEl: SVGElement | null, filename: string) {
  if (!svgEl) return;
  const serializer = new XMLSerializer();
  const svgStr =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    serializer.serializeToString(svgEl);
  const blob = new Blob([svgStr], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".svg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function openSVGEl(svgEl: SVGElement | null) {
  if (!svgEl) return;
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const blob = new Blob([svgStr], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
}

// ─── App Icon component ───────────────────────────────────────────────────────

const N_PATH = "M0 140 L0 0 L26 0 L94 96 L94 0 L120 0 L120 140 L94 140 L26 44 L26 140 Z";
const CLIP_TOP = "-40,120 160,22 160,-70 -40,-70";
const CLIP_BOT = "-40,130 160,32 160,230 -40,230";

function AppIconSVG({
  bg, nColor, strokeColor, size = 112,
}: {
  bg: string; nColor: string; strokeColor: string; size?: number;
}) {
  const r = Math.round((112 / 512) * size);
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`act-${bg.replace("#", "")}-${size}`}><polygon points={CLIP_TOP} transform="translate(136,96) scale(2.47)" /></clipPath>
        <clipPath id={`acb-${bg.replace("#", "")}-${size}`}><polygon points={CLIP_BOT} transform="translate(136,96) scale(2.47)" /></clipPath>
      </defs>
      <rect width={512} height={512} rx={r} fill={bg} />
      <g transform="translate(136,96) scale(2.47)">
        <g clipPath={`url(#act-${bg.replace("#", "")}-${size})`}><path fill={nColor} d={N_PATH} /></g>
        <g clipPath={`url(#acb-${bg.replace("#", "")}-${size})`}><path fill={nColor} d={N_PATH} /></g>
        <line stroke={strokeColor} strokeWidth="4" strokeLinecap="round" x1="-30" y1="115" x2="-2" y2="101" />
        <line stroke={strokeColor} strokeWidth="4" strokeLinecap="round" x1="122" y1="41" x2="150" y2="27" />
      </g>
    </svg>
  );
}

// ─── Reusable logo card ───────────────────────────────────────────────────────

function LogoCard({
  label, bg, filename, maxWidth, children,
}: {
  label: string; bg: string; filename: string; maxWidth?: number; children: React.ReactNode;
}) {
  const artRef = useRef<HTMLDivElement>(null);

  const getSVG = () => artRef.current?.querySelector("svg") ?? null;

  return (
    <div className="logo-card">
      <div className={`logo-card__art logo-card__art--${bg}`} ref={artRef}
        style={maxWidth ? { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 150 } : undefined}>
        <div style={maxWidth ? { maxWidth } : undefined}>{children}</div>
      </div>
      <div className="logo-card__foot">
        <span className="logo-card__name">{label}</span>
        <span className="asset-links">
          <button
            className="bb-link-btn"
            onClick={() => openSVGEl(getSVG())}
          >View</button>
          <button
            className="bb-link-btn"
            onClick={() => downloadSVGEl(getSVG(), filename)}
          >Download SVG</button>
        </span>
      </div>
    </div>
  );
}

// ─── App icon card ────────────────────────────────────────────────────────────

function AppIconCard({
  label, bg, nColor, strokeColor, filename,
}: {
  label: string; bg: string; nColor: string; strokeColor: string; filename: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
      <div ref={ref}><AppIconSVG bg={bg} nColor={nColor} strokeColor={strokeColor} size={112} /></div>
      <figcaption className="logo-card__name">{label}</figcaption>
      <span className="asset-links">
        <button className="bb-link-btn"
          onClick={() => downloadSVGEl(ref.current?.querySelector("svg") as SVGElement | null, filename)}>
          SVG
        </button>
      </span>
    </figure>
  );
}

// ─── Icon row with download ───────────────────────────────────────────────────

const ICON_MAP: Record<string, React.FC<{ size?: number; strokeWidth?: number }>> = {
  "arrow-right": ArrowRight, "arrow-up-right": ArrowUpRight, "bar-chart": BarChart2,
  "calendar": Calendar, "check": Check, "chevron-down": ChevronDown,
  "chevron-right": ChevronRight, "clock": Clock, "cloud": Cloud, "code": Code,
  "compass": Compass, "database": Database, "download": Download,
  "external-link": ExternalLink, "file-text": FileText, "folder": Folder,
  "git-branch": GitBranch, "globe": Globe, "layers": Layers,
  "layout-grid": LayoutGrid, "lightbulb": Lightbulb, "mail": Mail,
  "menu": Menu, "monitor": Monitor, "phone": Phone, "plus": Plus,
  "search": Search, "settings": Settings, "shield": Shield,
  "smartphone": Smartphone, "target": Target, "terminal": Terminal,
  "trending-up": TrendingUp, "user": User, "users": Users, "x": X, "zap": Zap,
};
const ICON_NAMES = Object.keys(ICON_MAP);

function IconTile({ name }: { name: string }) {
  const Icon = ICON_MAP[name];
  const ref = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    const svg = ref.current?.querySelector("svg") as SVGElement | null;
    downloadSVGEl(svg, name);
  }, [name]);

  return (
    <div
      ref={ref}
      title={name}
      onClick={handleDownload}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 42, height: 42, border: "1px solid #E7E7EC", cursor: "pointer",
      }}
    >
      <Icon size={24} strokeWidth={1.5} />
    </div>
  );
}

// ─── CSS (scoped to .bb) ──────────────────────────────────────────────────────

const CSS = `
.bb,.bb *{box-sizing:border-box;}
.bb{font-family:'Hanken Grotesk','Neue Haas Grotesk Display','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.65;color:#0A0A0F;background:#FFFFFF;-webkit-font-smoothing:antialiased;}
.bb h1,.bb h2,.bb h3,.bb h4{font-family:'Hanken Grotesk','Neue Haas Grotesk Display','Helvetica Neue',Arial,sans-serif;margin:0;letter-spacing:-0.025em;font-weight:600;}
.bb p{margin:0;}.bb img{display:block;max-width:100%;}
.bb ul{margin:0;padding-left:18px;}
.bb a{color:#6D28D9;text-decoration:none;}
.bb a:hover{color:#5B21B6;}
.bb a:focus-visible,.bb button:focus-visible{outline:2px solid #7C3AED;outline-offset:2px;}
.bb ::selection{background:#EDE9FE;}
.bb .section{padding:88px 7vw;border-bottom:2px solid #E7E7EC;}
.bb .section--mist{background:#F7F7F9;}
.bb .section--ink{background:#0A0A0F;color:#FFFFFF;border-bottom:0;}
.bb .section-head{display:flex;align-items:baseline;gap:20px;margin-bottom:48px;}
.bb .section-head .num{font-size:13px;font-weight:600;letter-spacing:0.2em;color:#7C3AED;}
.bb .section--ink .section-head .num{color:#A78BFA;}
.bb .section-head h2{font-size:clamp(28px,3.4vw,44px);}
.bb .section-head .rule{flex:1;height:2px;background:#E7E7EC;}
.bb .section--ink .section-head .rule{background:#1A1A24;}
.bb .lede{font-size:16px;line-height:1.6;color:#4A4A5A;max-width:640px;margin-bottom:48px;}
.bb .eyebrow{font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#6B6B7B;}
.bb .grid{display:grid;gap:24px;}
.bb .grid--2{grid-template-columns:repeat(auto-fit,minmax(300px,1fr));}
.bb .grid--3{grid-template-columns:repeat(auto-fit,minmax(280px,1fr));}
.bb .grid--4{grid-template-columns:repeat(auto-fit,minmax(230px,1fr));}
.bb .row{display:flex;flex-wrap:wrap;gap:24px;}
.bb .topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:24px;padding:12px 7vw;background:#0A0A0F;border-bottom:1px solid #1A1A24;}
.bb .topbar nav{display:flex;gap:24px;margin-left:auto;flex-wrap:wrap;}
.bb .topbar nav a{font-size:13px;font-weight:500;color:#B4B4C4;text-decoration:none;}
.bb .topbar nav a:hover,.bb .topbar nav a[aria-current="true"]{color:#FFFFFF;}
.bb .cover{background:#0A0A0F;color:#FFFFFF;padding:88px 7vw;display:grid;gap:64px;}
.bb .cover-top{display:flex;justify-content:space-between;align-items:flex-start;gap:32px;flex-wrap:wrap;}
.bb .cover-meta{font-size:12px;font-weight:500;letter-spacing:0.22em;color:#8A8A9C;text-align:right;}
.bb .cover-main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:48px;align-items:end;}
.bb .cover h1{font-size:clamp(44px,6vw,88px);font-weight:600;line-height:0.98;letter-spacing:-0.03em;}
.bb .cover .kicker{font-size:13px;font-weight:500;letter-spacing:0.28em;color:#A78BFA;margin-bottom:24px;}
.bb .cover-main>p{font-size:17px;line-height:1.6;color:#B4B4C4;max-width:460px;}
.bb .gradient-rule{height:3px;background:linear-gradient(90deg,#A78BFA 0%,#7C3AED 39%,#3B82F6 100%);}
.bb .toc{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:0 48px;}
.bb .toc a{display:flex;gap:16px;padding:14px 0;border-top:1px solid #E7E7EC;color:#0A0A0F;font-size:16px;font-weight:500;}
.bb .toc a span{color:#7C3AED;font-variant-numeric:tabular-nums;}
.bb .toc a:hover{color:#6D28D9;}
.bb .panel{border:2px solid #0A0A0F;display:flex;flex-direction:column;}
.bb .panel__head{padding:12px 20px;border-bottom:2px solid #0A0A0F;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;}
.bb .panel__body{flex:1;padding:48px 32px;display:flex;align-items:center;justify-content:center;}
.bb .panel__body--ink{background:#0A0A0F;}
.bb .panel__body--mist{background:#F7F7F9;}
.bb .panel__note{padding:20px;border-top:1px solid #E7E7EC;font-size:14px;line-height:1.6;color:#4A4A5A;}
.bb .principles{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));border-top:2px solid #0A0A0F;}
.bb .principles>div{padding:28px;border-right:1px solid #E7E7EC;}
.bb .principles>div:first-child{padding-left:0;}
.bb .principles>div:last-child{border-right:0;padding-right:0;}
.bb .principles .n{font-size:12px;font-weight:600;color:#7C3AED;margin-bottom:10px;}
.bb .principles h3{font-size:19px;margin-bottom:8px;}
.bb .principles p{font-size:15px;color:#4A4A5A;}
.bb .voice{border-left:3px solid #7C3AED;padding:4px 0 4px 24px;}
.bb .voice--muted{border-left-color:#E7E7EC;}
.bb .voice ul{font-size:16px;line-height:1.9;}
.bb .voice--muted ul{color:#6B6B7B;}
.bb .logo-card{border:1px solid #E7E7EC;display:flex;flex-direction:column;}
.bb .logo-card__art{flex:1;padding:36px 28px;display:flex;align-items:center;justify-content:center;min-height:150px;}
.bb .logo-card__art--ink{background:#0A0A0F;}
.bb .logo-card__art--light{background:#FFFFFF;}
.bb .logo-card__art--mid{background:#4A4A5A;}
.bb .logo-card__art--mist{background:#F7F7F9;}
.bb .logo-card__foot{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 16px;border-top:1px solid #E7E7EC;flex-wrap:wrap;}
.bb .logo-card__name{font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#6B6B7B;}
.bb .asset-links{display:flex;gap:12px;font-size:12px;font-weight:500;}
.bb .asset-links a,.bb .bb-link-btn{color:#6D28D9;background:none;border:none;padding:0;font-size:12px;font-weight:500;font-family:inherit;cursor:pointer;}
.bb .asset-links a:hover,.bb .bb-link-btn:hover{color:#5B21B6;text-decoration:underline;}
.bb .btn{display:inline-flex;align-items:center;gap:8px;font-family:inherit;font-size:14px;font-weight:500;padding:12px 22px;border:0;cursor:pointer;text-align:left;text-decoration:none;}
.bb .btn-primary{background:#7C3AED;color:#FFFFFF;}
.bb .btn-primary:hover{background:#6D28D9;color:#FFFFFF;}
.bb .btn-secondary{background:transparent;color:#0A0A0F;border:1px solid #0A0A0F;padding:11px 21px;}
.bb .btn-secondary:hover{background:#F7F7F9;color:#0A0A0F;}
.bb .btn-ghost{background:transparent;color:#7C3AED;padding:12px 8px;}
.bb .btn-ghost:hover{color:#6D28D9;}
.bb .btn[disabled],.bb .btn.is-disabled{opacity:0.45;pointer-events:none;}
.bb .tag{display:inline-block;font-size:12px;font-weight:500;padding:5px 12px;}
.bb .tag--violet{background:#EDE9FE;color:#5B21B6;}
.bb .tag--blue{background:#DBEAFE;color:#1D4ED8;}
.bb .tag--neutral{background:#F7F7F9;color:#4A4A5A;}
.bb .tag--outline{border:1px solid #E7E7EC;color:#4A4A5A;}
.bb .gradient-band{height:120px;background:linear-gradient(90deg,#A78BFA 0%,#7C3AED 39%,#3B82F6 100%);display:flex;align-items:flex-end;padding:16px 20px;margin-bottom:8px;}
.bb .gradient-band span{font-size:12px;font-weight:600;letter-spacing:0.18em;color:#FFFFFF;}
.bb .swatches{display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));}
.bb .swatches--neutral{grid-template-columns:repeat(auto-fit,minmax(150px,1fr));}
.bb .swatch{padding:28px 20px 20px;}
.bb .swatch h3{font-size:15px;}
.bb .swatch .hex{font-size:13px;margin-top:6px;opacity:0.8;font-variant-numeric:tabular-nums;}
.bb .swatch .use{font-size:12px;margin-top:20px;opacity:0.8;}
.bb .swatch--outline{box-shadow:inset 0 0 0 1px #E7E7EC;}
.bb .balance{display:flex;height:44px;margin-bottom:12px;}
.bb .specimen{border:2px solid #0A0A0F;padding:48px;}
.bb .specimen .aa{font-size:clamp(56px,10vw,140px);font-weight:500;letter-spacing:-0.03em;line-height:1;margin-bottom:24px;}
.bb .specimen .glyphs{font-size:18px;line-height:1.7;color:#4A4A5A;word-break:break-word;}
.bb .specimen .weights{display:flex;gap:32px;flex-wrap:wrap;margin-top:32px;padding-top:16px;border-top:1px solid #E7E7EC;font-size:20px;}
.bb .scale{border:1px solid #E7E7EC;}
.bb .scale-row{display:grid;grid-template-columns:minmax(0,2.2fr) minmax(0,1fr);gap:24px;padding:22px 24px;border-bottom:1px solid #E7E7EC;align-items:baseline;}
.bb .scale-row:last-child{border-bottom:0;}
.bb .scale-row .spec{font-size:13px;color:#6B6B7B;line-height:1.7;}
.bb .fontpack{border:2px solid #0A0A0F;margin-top:32px;}
.bb .fontpack__head{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:20px 24px;border-bottom:2px solid #0A0A0F;flex-wrap:wrap;}
.bb .fontpack__head h3{font-size:22px;}
.bb .fontpack__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));}
.bb .fontpack__cell{padding:24px;border-right:1px solid #E7E7EC;border-bottom:1px solid #E7E7EC;}
.bb .fontpack__cell:last-child{border-right:0;}
.bb .fontpack__cell .sample{font-size:30px;line-height:1.2;margin-bottom:12px;}
.bb .filelist{list-style:none;padding:0;margin:0;}
.bb .filelist li{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid #E7E7EC;font-size:13px;}
.bb .filelist li:last-child{border-bottom:0;}
.bb .filelist .meta{color:#6B6B7B;font-variant-numeric:tabular-nums;}
.bb code{font-family:ui-monospace,SFMono-Regular,monospace;font-size:0.875em;background:#F7F7F9;padding:1px 4px;}
.bb .kit{background:#FFFFFF;border:1px solid #E7E7EC;padding:28px;}
.bb .kit--ink{background:#0A0A0F;border-color:#0A0A0F;}
.bb .field{display:flex;flex-direction:column;gap:8px;font-size:12px;font-weight:500;color:#4A4A5A;}
.bb .input{font-family:inherit;font-size:14px;padding:11px 12px;border:1px solid #E7E7EC;background:#FFFFFF;color:#0A0A0F;width:100%;}
.bb .input:hover{border-color:#6B6B7B;}
.bb .input:focus{outline:2px solid #7C3AED;outline-offset:0;border-color:#7C3AED;}
.bb .seg{display:flex;border:1px solid #E7E7EC;width:fit-content;}
.bb .seg span{font-size:13px;font-weight:500;padding:9px 16px;color:#4A4A5A;border-left:1px solid #E7E7EC;}
.bb .seg span:first-child{border-left:0;}
.bb .seg span.is-on{background:#7C3AED;color:#FFFFFF;}
.bb .radio{display:inline-flex;align-items:center;gap:8px;font-size:14px;color:#4A4A5A;}
.bb .radio i{width:15px;height:15px;border-radius:50%;border:1px solid #6B6B7B;display:inline-block;font-style:normal;}
.bb .radio.is-on i{border:5px solid #7C3AED;}
.bb .sys-card{border:1px solid #E7E7EC;border-top:3px solid #7C3AED;padding:24px;}
.bb .sys-card .kicker{font-size:11px;font-weight:600;letter-spacing:0.16em;color:#7C3AED;margin-bottom:12px;}
.bb .sys-card h3{font-size:20px;margin-bottom:10px;}
.bb .sys-card p{font-size:14px;color:#4A4A5A;margin-bottom:16px;}
.bb .sys-card .meta{font-size:12px;color:#6B6B7B;padding-top:14px;border-top:1px solid #E7E7EC;}
.bb .table{width:100%;border-collapse:collapse;font-size:14px;}
.bb .table th{text-align:left;font-size:11px;font-weight:600;letter-spacing:0.14em;color:#6B6B7B;padding:10px 8px;border-bottom:2px solid #0A0A0F;}
.bb .table td{padding:12px 8px;border-bottom:1px solid #E7E7EC;}
.bb .table tr:last-child td{border-bottom:0;}
.bb .table .num{text-align:right;font-weight:700;font-variant-numeric:tabular-nums;}
.bb .table .stage{color:#6D28D9;}
.bb .iconset{display:grid;grid-template-columns:repeat(auto-fill,minmax(42px,1fr));gap:4px;margin-bottom:20px;}
.bb .mock{border:1px solid #E7E7EC;}
.bb .mock__head{padding:12px 18px;border-bottom:1px solid #E7E7EC;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#6B6B7B;}
.bb .site-header{background:#0A0A0F;display:flex;align-items:center;gap:48px;padding:20px 32px;flex-wrap:wrap;}
.bb .site-header-logo-wrap{width:170px;margin-right:auto;}
.bb .site-header nav{display:flex;gap:28px;font-size:14px;font-weight:500;color:#B4B4C4;}
.bb .site-hero{background:#0A0A0F;padding:48px 32px 64px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:48px;align-items:end;border-top:1px solid #1A1A24;}
.bb .site-hero h3{font-size:clamp(32px,4.4vw,56px);line-height:1.02;letter-spacing:-0.03em;color:#FFFFFF;}
.bb .site-hero p{font-size:16px;color:#B4B4C4;}
.bb .card-front,.bb .card-back,.bb .deck-cover{width:340px;height:200px;padding:26px;display:flex;flex-direction:column;justify-content:space-between;}
.bb .card-front{background:#0A0A0F;}
.bb .card-back{background:#FFFFFF;border:1px solid #E7E7EC;}
.bb .deck-cover{width:356px;background:linear-gradient(135deg,#7C3AED 0%,#3B82F6 100%);color:#FFFFFF;}
.bb .homescreen{padding:28px;background:#1A1A24;display:flex;gap:24px;}
.bb .homescreen figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:8px;}
.bb .homescreen figcaption{font-size:11px;color:#FFFFFF;}
.bb .profile{padding:24px;display:flex;gap:16px;align-items:center;}
.bb .profile-avatar{width:68px;height:68px;border-radius:50%;overflow:hidden;flex:none;}
.bb .product{display:flex;min-height:220px;}
.bb .product__nav{width:180px;background:#0A0A0F;padding:20px 16px;display:flex;flex-direction:column;gap:20px;}
.bb .product__nav div{font-size:13px;font-weight:500;padding:9px 12px;color:#B4B4C4;}
.bb .product__nav div.is-on{background:#7C3AED;color:#FFFFFF;}
.bb .product__main{flex:1;padding:20px;min-width:0;}
.bb .misuse{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:20px;}
.bb .misuse figure{margin:0;border:1px solid #E7E7EC;padding:24px;display:flex;flex-direction:column;gap:16px;align-items:center;}
.bb .misuse figcaption{font-size:12px;font-weight:500;color:#DC2626;text-align:center;}
.bb .m-stretch{transform:scaleY(0.3);transform-origin:center;}
.bb .m-rotate{transform:rotate(-8deg);}
.bb .m-recolour filter{filter:sepia(1) saturate(6) hue-rotate(60deg);}
.bb .m-shadow{filter:drop-shadow(4px 6px 4px rgba(0,0,0,0.5));}
.bb .m-busy{background:linear-gradient(135deg,#A78BFA 0%,#7C3AED 39%,#3B82F6 100%);padding:10px 14px;}
.bb .assetindex{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:48px;font-size:14px;line-height:2;color:#B4B4C4;}
.bb .assetindex a,.bb .assetindex .bb-link-btn{color:#B4B4C4;background:none;border:none;padding:0;font-size:14px;font-family:inherit;cursor:pointer;display:inline;}
.bb .assetindex a:hover,.bb .assetindex .bb-link-btn:hover{color:#A78BFA;text-decoration:underline;}
.bb .assetindex h3{font-size:11px;font-weight:600;letter-spacing:0.2em;color:#8A8A9C;margin-bottom:12px;}
.bb .colophon{margin-top:64px;padding-top:28px;border-top:1px solid #1A1A24;display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;font-size:13px;color:#6B6B7B;}
.bb .colophon a{color:#A78BFA;}
@media(max-width:720px){
  .bb .section{padding:56px 24px;}
  .bb .cover{padding:56px 24px;}
  .bb .topbar{padding:12px 24px;}
  .bb .topbar nav{display:none;}
  .bb .principles>div{border-right:0;border-bottom:1px solid #E7E7EC;padding:24px 0;}
  .bb .card-front,.bb .card-back,.bb .deck-cover{width:100%;}
}
`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export function BrandBook() {
  /* Active nav on scroll */
  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".bb-topbar a[href^='#']")
    );
    if (!links.length || !("IntersectionObserver" in window)) return;
    const byId: Record<string, HTMLAnchorElement> = {};
    const targets: Element[] = [];
    links.forEach((link) => {
      const id = link.getAttribute("href")!.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      byId[id] = link;
      targets.push(el);
    });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = byId[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach((l) => l.removeAttribute("aria-current"));
            link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-72px 0px -70% 0px", threshold: 0 }
    );
    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const APP_ICONS = [
    { bg: "#7C3AED", nColor: "#FFFFFF", strokeColor: "#9333EA", label: "Violet · default", filename: "app-icon-violet" },
    { bg: "#2563EB", nColor: "#FFFFFF", strokeColor: "#3B82F6", label: "Blue", filename: "app-icon-blue" },
    { bg: "#0A0A0F", nColor: "#FFFFFF", strokeColor: "#9333EA", label: "Black", filename: "app-icon-black" },
    { bg: "#FFFFFF", nColor: "#0A0A0F", strokeColor: "#9333EA", label: "White", filename: "app-icon-white" },
  ];

  const LOGO_CARDS: {
    label: string; variant: LogoVariant; type: "h" | "v" | "m";
    bg: string; filename: string; maxW?: number;
  }[] = [
    { label: "Horizontal — on light", variant: "on-light", type: "h", bg: "light", filename: "lockup-horizontal-on-light" },
    { label: "Horizontal — on dark", variant: "on-dark", type: "h", bg: "ink", filename: "lockup-horizontal-on-dark" },
    { label: "Horizontal — mono black", variant: "mono-black", type: "h", bg: "light", filename: "lockup-horizontal-mono-black" },
    { label: "Horizontal — mono white", variant: "mono-white", type: "h", bg: "mid", filename: "lockup-horizontal-mono-white" },
    { label: "Vertical — on light", variant: "on-light", type: "v", bg: "light", filename: "lockup-vertical-on-light", maxW: 180 },
    { label: "Vertical — on dark", variant: "on-dark", type: "v", bg: "ink", filename: "lockup-vertical-on-dark", maxW: 180 },
    { label: "Vertical — mono black", variant: "mono-black", type: "v", bg: "light", filename: "lockup-vertical-mono-black", maxW: 180 },
    { label: "Vertical — mono white", variant: "mono-white", type: "v", bg: "mid", filename: "lockup-vertical-mono-white", maxW: 180 },
    { label: "Monogram — on light", variant: "on-light", type: "m", bg: "light", filename: "monogram-on-light", maxW: 120 },
    { label: "Monogram — on dark", variant: "on-dark", type: "m", bg: "ink", filename: "monogram-on-dark", maxW: 120 },
    { label: "Monogram — mono black", variant: "mono-black", type: "m", bg: "light", filename: "monogram-mono-black", maxW: 120 },
    { label: "Monogram — mono white", variant: "mono-white", type: "m", bg: "mid", filename: "monogram-mono-white", maxW: 120 },
  ];

  const renderLogo = (type: "h" | "v" | "m", variant: LogoVariant, maxW?: number) => {
    if (type === "h") return <HorizontalLockupSVG width={maxW ?? 220} variant={variant} />;
    if (type === "v") return <VerticalLockupSVG width={maxW ?? 180} variant={variant} />;
    return <NMonogramSVG size={maxW ?? 100} variant={variant} />;
  };

  return (
    <div className="bb" id="bb-top">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── Sticky topbar ── */}
      <header className="topbar bb-topbar">
        <a href="#bb-top" style={{ lineHeight: 0 }}>
          <HorizontalLockupSVG width={132} variant="on-dark" />
        </a>
        <nav aria-label="Sections">
          <a href="#foundation">Foundation</a>
          <a href="#logo">Logo</a>
          <a href="#colour">Colour</a>
          <a href="#typography">Typography</a>
          <a href="#grid">Grid</a>
          <a href="#system">Design system</a>
          <a href="#applications">Applications</a>
          <a href="#assets">Assets</a>
        </nav>
      </header>

      <main>

        {/* ── Cover ── */}
        <section className="cover">
          <div className="cover-top">
            <HorizontalLockupSVG width={280} variant="on-dark" />
            <p className="cover-meta">VERSION 1.0<br />SEPTEMBER 2026</p>
          </div>
          <div className="cover-main">
            <div>
              <p className="kicker">BRAND IDENTITY &amp; DESIGN SYSTEM</p>
              <h1>Brand<br />Guidelines</h1>
            </div>
            <p>The complete reference for the Nexyra Consulting identity — mark, colour, type, layout and interface. Everything here is normative: build from it, don't reinterpret it.</p>
          </div>
          <div className="gradient-rule" />
        </section>

        {/* ── Contents ── */}
        <section className="section">
          <p className="eyebrow" style={{ marginBottom: 28 }}>Contents</p>
          <nav className="toc" aria-label="Contents">
            <a href="#foundation"><span>01</span> Brand foundation</a>
            <a href="#logo"><span>02</span> Logo &amp; lock-ups</a>
            <a href="#colour"><span>03</span> Colour</a>
            <a href="#typography"><span>04</span> Typography</a>
            <a href="#grid"><span>05</span> Grid &amp; space</a>
            <a href="#system"><span>06</span> Design system</a>
            <a href="#applications"><span>07</span> Applications</a>
            <a href="#assets"><span>08</span> Asset index</a>
          </nav>
        </section>

        {/* ── 01 Brand Foundation ── */}
        <section className="section" id="foundation">
          <div className="section-head"><span className="num">01</span><h2>Brand foundation</h2><span className="rule" /></div>
          <div className="grid grid--2" style={{ marginBottom: 64 }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 16 }}>Positioning</p>
              <p style={{ fontSize: 22, lineHeight: 1.45 }}>Nexyra Consulting partners with enterprises across the whole digital journey — strategy and discovery through design, build, deployment and scale.</p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: 16 }}>The promise</p>
              <p style={{ fontSize: 22, lineHeight: 1.45 }}>Design-led thinking with engineering discipline. We make transformation legible — and then we ship it.</p>
            </div>
          </div>
          <div className="principles">
            <div><p className="n">01</p><h3>Clarity over cleverness</h3><p>Complexity is the client's problem to hand over, never ours to hand back.</p></div>
            <div><p className="n">02</p><h3>Systems, not artefacts</h3><p>Everything we deliver is built to be extended by the people who inherit it.</p></div>
            <div><p className="n">03</p><h3>Evidence first</h3><p>Opinions are cheap. We bring research, prototypes and measured outcomes.</p></div>
            <div><p className="n">04</p><h3>Progress in the open</h3><p>Senior stakeholders see the work as it happens, not at the end of it.</p></div>
          </div>
          <div className="grid grid--2" style={{ marginTop: 64 }}>
            <div className="voice">
              <p className="eyebrow" style={{ marginBottom: 14 }}>Voice — we write</p>
              <ul>
                <li>Plainly, in the active voice</li>
                <li>Specifically — named outcomes, real numbers</li>
                <li>Confidently, without superlatives</li>
                <li>Short first sentence, detail after</li>
              </ul>
            </div>
            <div className="voice voice--muted">
              <p className="eyebrow" style={{ marginBottom: 14 }}>Voice — we avoid</p>
              <ul>
                <li>"Cutting-edge", "synergy", "leverage"</li>
                <li>Hype about AI or technology for its own sake</li>
                <li>Jargon a board member would have to decode</li>
                <li>Exclamation marks, ever</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 02 Logo ── */}
        <section className="section" id="logo">
          <div className="section-head"><span className="num">02</span><h2>Logo &amp; lock-ups</h2><span className="rule" /></div>
          <p className="lede">The monogram is a geometric N cut by a single diagonal slice, with two detached strokes continuing the cut beyond the counter. The mark is fixed — never redraw, re-space or re-proportion it.</p>

          {/* Primary 3-up */}
          <div className="grid grid--3" style={{ marginBottom: 24 }}>
            <LogoCard label="Primary — horizontal" bg="ink" filename="lockup-horizontal-gradient">
              <HorizontalLockupSVG width={220} variant="gradient" />
            </LogoCard>
            <LogoCard label="Secondary — vertical" bg="ink" filename="lockup-vertical-gradient" maxWidth={200}>
              <VerticalLockupSVG width={200} variant="gradient" />
            </LogoCard>
            <LogoCard label="Monogram" bg="ink" filename="monogram-gradient" maxWidth={160}>
              <NMonogramSVG size={100} variant="gradient" />
            </LogoCard>
          </div>

          {/* All colourways 4-up */}
          <div className="grid grid--4" style={{ marginBottom: 24 }}>
            {LOGO_CARDS.map(({ label, variant, type, bg, filename, maxW }) => (
              <LogoCard key={filename} label={label} bg={bg} filename={filename} maxWidth={maxW}>
                {renderLogo(type, variant, maxW)}
              </LogoCard>
            ))}
          </div>

          {/* Clear space + Min sizes */}
          <div className="grid grid--2" style={{ marginBottom: 64 }}>
            <div className="panel">
              <p className="panel__head">Clear space</p>
              <div className="panel__body panel__body--mist">
                <div style={{ border: "1px dashed #7C3AED", padding: 44, background: "#FFFFFF" }}>
                  <HorizontalLockupSVG width={220} variant="mono-black" />
                </div>
              </div>
              <p className="panel__note">Keep clear space equal to the full height of the monogram on every side. Nothing — type, rules, image edges — enters this field.</p>
            </div>
            <div className="panel">
              <p className="panel__head">Minimum sizes</p>
              <div className="panel__body panel__body--mist" style={{ alignItems: "flex-end", gap: 36, flexWrap: "wrap" }}>
                <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  <HorizontalLockupSVG width={140} variant="mono-black" />
                  <figcaption style={{ fontSize: 12, color: "#6B6B7B" }}>140 px / 36 mm — lock-up floor</figcaption>
                </figure>
                <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  <NMonogramSVG size={24} variant="mono-black" />
                  <figcaption style={{ fontSize: 12, color: "#6B6B7B" }}>24 px — monogram floor</figcaption>
                </figure>
              </div>
              <p className="panel__note">Below 140px use the monogram alone. Below 24px the slice closes — use the solid app icon instead.</p>
            </div>
          </div>

          {/* App icons */}
          <div className="panel" style={{ marginBottom: 64 }}>
            <p className="panel__head">App icon — corner radius 112 / 512</p>
            <div className="panel__body panel__body--mist" style={{ gap: 32, flexWrap: "wrap", alignItems: "flex-end", justifyContent: "flex-start" }}>
              {APP_ICONS.map(({ bg, nColor, strokeColor, label, filename }) => (
                <AppIconCard key={filename} bg={bg} nColor={nColor} strokeColor={strokeColor} label={label} filename={filename} />
              ))}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-end", paddingLeft: 16, borderLeft: "1px solid #E7E7EC" }}>
                {[64, 40, 24, 16].map((sz) => (
                  <AppIconSVG key={sz} bg="#7C3AED" nColor="#FFFFFF" strokeColor="#9333EA" size={sz} />
                ))}
              </div>
            </div>
          </div>

          {/* Misuse */}
          <p className="eyebrow" style={{ marginBottom: 20 }}>Misuse — never do this</p>
          <div className="misuse">
            <figure>
              <div className="m-stretch"><HorizontalLockupSVG width={180} variant="mono-black" /></div>
              <figcaption>Stretch or squash</figcaption>
            </figure>
            <figure>
              <div className="m-rotate"><HorizontalLockupSVG width={150} variant="mono-black" /></div>
              <figcaption>Rotate or tilt</figcaption>
            </figure>
            <figure>
              <div style={{ filter: "sepia(1) saturate(6) hue-rotate(60deg)" }}>
                <HorizontalLockupSVG width={170} variant="mono-black" />
              </div>
              <figcaption>Recolour outside the palette</figcaption>
            </figure>
            <figure>
              <div className="m-busy"><HorizontalLockupSVG width={150} variant="mono-white" /></div>
              <figcaption>Place on a busy or low-contrast field</figcaption>
            </figure>
            <figure>
              <div className="m-shadow"><HorizontalLockupSVG width={170} variant="mono-black" /></div>
              <figcaption>Add shadow, glow or outline</figcaption>
            </figure>
          </div>
        </section>

        {/* ── 03 Colour ── */}
        <section className="section" id="colour">
          <div className="section-head"><span className="num">03</span><h2>Colour</h2><span className="rule" /></div>
          <p className="lede">The identity runs violet into blue on near-black. The gradient belongs to the mark and to full-bleed brand moments only — interfaces use the flat steps.</p>
          <div className="gradient-band"><span>SIGNATURE GRADIENT · 135° · #A78BFA 0% → #7C3AED 39% → #3B82F6 100%</span></div>
          <div className="swatches" style={{ marginBottom: 48 }}>
            {[
              { bg: "#A78BFA", c: "#0A0A0F", name: "Violet Light", hex: "#A78BFA", use: "Tints, charts, dark-mode links" },
              { bg: "#7C3AED", c: "#FFFFFF", name: "Violet — Primary", hex: "#7C3AED", use: "Primary action, key emphasis" },
              { bg: "#9333EA", c: "#FFFFFF", name: "Purple", hex: "#9333EA", use: "The mark's cut strokes; hover" },
              { bg: "#2563EB", c: "#FFFFFF", name: "Blue — Secondary", hex: "#2563EB", use: "Links, secondary emphasis" },
              { bg: "#3B82F6", c: "#0A0A0F", name: "Blue Light", hex: "#3B82F6", use: "Gradient end, info states" },
            ].map(({ bg, c, name, hex, use }) => (
              <div key={name} className="swatch" style={{ background: bg, color: c }}>
                <h3>{name}</h3><p className="hex">{hex}</p><p className="use">{use}</p>
              </div>
            ))}
          </div>
          <div className="swatches swatches--neutral" style={{ marginBottom: 48 }}>
            {[
              { bg: "#0A0A0F", c: "#FFFFFF", name: "Ink", hex: "#0A0A0F" },
              { bg: "#1A1A24", c: "#FFFFFF", name: "Ink Raised", hex: "#1A1A24" },
              { bg: "#4A4A5A", c: "#FFFFFF", name: "Slate", hex: "#4A4A5A" },
              { bg: "#6B6B7B", c: "#FFFFFF", name: "Slate Light", hex: "#6B6B7B" },
              { bg: "#E7E7EC", c: "#0A0A0F", name: "Line", hex: "#E7E7EC" },
              { bg: "#F7F7F9", c: "#0A0A0F", name: "Mist", hex: "#F7F7F9" },
              { bg: "#FFFFFF", c: "#0A0A0F", name: "White", hex: "#FFFFFF", outline: true },
            ].map(({ bg, c, name, hex, outline }) => (
              <div key={name} className={`swatch${outline ? " swatch--outline" : ""}`} style={{ background: bg, color: c, paddingBottom: 28 }}>
                <h3>{name}</h3><p className="hex">{hex}</p>
              </div>
            ))}
          </div>
          <div className="grid grid--2">
            <div>
              <p className="eyebrow" style={{ marginBottom: 16 }}>Balance</p>
              <div className="balance">
                <span style={{ flex: 60, background: "#0A0A0F" }} />
                <span style={{ flex: 30, background: "#F7F7F9", boxShadow: "inset 0 0 0 1px #E7E7EC" }} />
                <span style={{ flex: 10, background: "linear-gradient(90deg,#7C3AED,#3B82F6)" }} />
              </div>
              <p style={{ fontSize: 14, color: "#4A4A5A" }}>60 ink · 30 neutral · 10 brand colour. If the violet is doing more than a tenth of the work, the layout is compensating for weak structure.</p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: 16 }}>Contrast rules</p>
              <ul style={{ fontSize: 15, lineHeight: 1.8, color: "#4A4A5A" }}>
                <li>Body copy on white: Ink #0A0A0F only.</li>
                <li>#7C3AED on white passes for 18px+ and UI chrome — use #6D28D9 for small text.</li>
                <li>On ink, links use #A78BFA, never #2563EB.</li>
                <li>Never set the gradient behind body-size text.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 04 Typography ── */}
        <section className="section" id="typography">
          <div className="section-head"><span className="num">04</span><h2>Typography</h2><span className="rule" /></div>
          <p className="lede">Hanken Grotesk sets everything — the wordmark, headlines, interface and documents. It is self-hosted in this package; no external font service is used. Neue Haas Grotesk Display is the licensed substitute, Helvetica Neue or Arial the system fallback.</p>
          <div className="specimen" style={{ marginBottom: 32 }}>
            <p className="aa">Aa Nn</p>
            <p className="glyphs">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 &amp; £ % — →</p>
            <div className="weights">
              <span style={{ fontWeight: 300 }}>300 Light</span>
              <span style={{ fontWeight: 400 }}>400 Regular</span>
              <span style={{ fontWeight: 500 }}>500 Medium</span>
              <span style={{ fontWeight: 600 }}>600 Semibold</span>
              <span style={{ fontWeight: 700 }}>700 Bold</span>
              <span style={{ fontWeight: 400, fontStyle: "italic" }}>400 Italic</span>
            </div>
          </div>
          <div className="scale">
            <div className="scale-row"><p style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05 }}>Display</p><p className="spec">56–88 / 600 / −3% tracking<br />Covers, hero statements</p></div>
            <div className="scale-row"><p style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.025em" }}>Heading 1</p><p className="spec">36 / 600 / −2.5%<br />Section openers</p></div>
            <div className="scale-row"><p style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>Heading 2</p><p className="spec">24 / 600 / −2%<br />Card and block titles</p></div>
            <div className="scale-row"><p style={{ fontSize: 18, lineHeight: 1.6 }}>Body large — the default for introductions and standfirsts.</p><p className="spec">18 / 400 / 1.6<br />Intros</p></div>
            <div className="scale-row"><p style={{ fontSize: 15, lineHeight: 1.65 }}>Body — running copy, maximum 72 characters per line.</p><p className="spec">15 / 400 / 1.65<br />Paragraphs</p></div>
            <div className="scale-row"><p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em" }}>LABEL / EYEBROW</p><p className="spec">11 / 600 / +20% tracking / caps<br />Eyebrows, table heads, meta</p></div>
          </div>
          <div className="grid grid--3" style={{ marginTop: 32, fontSize: 15, lineHeight: 1.7, color: "#4A4A5A" }}>
            <p><strong style={{ color: "#0A0A0F" }}>Wordmark tracking is fixed.</strong> NEXYRA sits at +5.33/51 (≈0.105em) in Medium; CONSULTING at +9.67/16.1 (≈0.6em) in Regular. Never reset the wordmark by hand — use the supplied files.</p>
            <p><strong style={{ color: "#0A0A0F" }}>Headlines go tight, labels go wide.</strong> Anything above 24px takes negative tracking; anything below 12px takes caps and +0.2em.</p>
            <p><strong style={{ color: "#0A0A0F" }}>One weight per level.</strong> 600 for headings, 400 for copy, 500 for interface labels. Bold 700 is reserved for numerals in data.</p>
          </div>
          <div className="fontpack" id="bb-fonts">
            <div className="fontpack__head">
              <div>
                <h3>Download fonts</h3>
                <p style={{ fontSize: 14, color: "#4A4A5A" }}>Hanken Grotesk · variable 100–900, roman and italic · SIL Open Font License 1.1</p>
              </div>
              <a className="btn btn-primary" href="/brand/fonts/hanken-grotesk-webfonts.zip" download>Download complete package (ZIP)</a>
            </div>
            <div className="fontpack__grid">
              <div className="fontpack__cell">
                <p className="sample" style={{ fontWeight: 600, letterSpacing: "-0.025em" }}>Hanken Grotesk</p>
                <p className="eyebrow" style={{ marginBottom: 10 }}>Brand face — all uses</p>
                <p style={{ fontSize: 14, color: "#4A4A5A", marginBottom: 16 }}>Sets the wordmark, every headline, all interface labels and all running copy. Weights in active use: 300 Light, 400 Regular, 500 Medium, 600 Semibold, 700 Bold, plus roman italics for citations.</p>
                <ul className="filelist">
                  {[
                    ["hanken-grotesk-latin-normal.woff2", "34 KB · roman"],
                    ["hanken-grotesk-latin-ext-normal.woff2", "19 KB · roman"],
                    ["hanken-grotesk-latin-italic.woff2", "35 KB · italic"],
                    ["hanken-grotesk-latin-ext-italic.woff2", "20 KB · italic"],
                  ].map(([file, meta]) => (
                    <li key={file}>
                      <a href={`/brand/fonts/${file}`} download>{file}</a>
                      <span className="meta">{meta}</span>
                    </li>
                  ))}
                  <li>
                    <a href="/brand/fonts/OFL.txt" target="_blank" rel="noopener">OFL.txt — licence</a>
                    <span className="meta">4 KB</span>
                  </li>
                </ul>
              </div>
              <div className="fontpack__cell">
                <p className="sample" style={{ fontWeight: 500 }}>Neue Haas Grotesk Display</p>
                <p className="eyebrow" style={{ marginBottom: 10 }}>Licensed substitute</p>
                <p style={{ fontSize: 14, color: "#4A4A5A" }}>Named in the logo files as the first fallback. Commercially licensed — not distributed in this package. Purchase per seat from the foundry and install locally; the CSS picks it up automatically if Hanken Grotesk is unavailable.</p>
                <p style={{ fontSize: 14, color: "#4A4A5A", marginTop: 16 }}><strong style={{ color: "#0A0A0F" }}>System fallback:</strong> Helvetica Neue, then Arial.</p>
              </div>
              <div className="fontpack__cell" style={{ borderRight: 0 }}>
                <p className="sample" style={{ fontWeight: 400 }}>Implementation</p>
                <p className="eyebrow" style={{ marginBottom: 10 }}>How it is wired</p>
                <p style={{ fontSize: 14, color: "#4A4A5A", marginBottom: 12 }}>All four files declared as a single variable family with <code>font-weight: 100 900</code> and <code>font-display: swap</code>, split by unicode range so latin pages load 34 KB.</p>
                <p style={{ fontSize: 14, color: "#4A4A5A" }}>Font stack: <code>'Hanken Grotesk', 'Neue Haas Grotesk Display', 'Helvetica Neue', Arial, sans-serif</code></p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 05 Grid & Space ── */}
        <section className="section" id="grid">
          <div className="section-head"><span className="num">05</span><h2>Grid &amp; space</h2><span className="rule" /></div>
          <div className="grid grid--2">
            <div>
              <p className="eyebrow" style={{ marginBottom: 20 }}>8pt spacing scale</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "#4A4A5A" }}>
                {[
                  [4, "4 — icon gaps, inline nudges"],
                  [8, "8 — label to control"],
                  [16, "16 — inside components"],
                  [24, "24 — between components"],
                  [48, "48 — block separation"],
                  [88, "88 — section padding"],
                ].map(([w, label]) => (
                  <div key={w} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ width: w as number, height: 20, background: "#7C3AED", flexShrink: 0 }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: 20 }}>12-column grid</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 8, height: 150, border: "1px solid #E7E7EC", padding: 12 }}>
                {Array.from({ length: 12 }).map((_, i) => <span key={i} style={{ background: "#EDE9FE" }} />)}
              </div>
              <p style={{ fontSize: 14, color: "#4A4A5A", marginTop: 16 }}>Desktop 12 columns / 24px gutters / 7vw margins. Tablet 8 / 16. Mobile 4 / 16. Zero corner radius everywhere except the app icon.</p>
            </div>
          </div>
        </section>

        {/* ── 06 Design System ── */}
        <section className="section section--mist" id="system">
          <div className="section-head"><span className="num">06</span><h2>Design system</h2><span className="rule" /></div>
          <p className="lede">Interface primitives on the brand palette. Flat surfaces, 1px lines, square corners, one primary action per view.</p>
          <div className="grid grid--3">
            <div className="kit">
              <p className="eyebrow" style={{ marginBottom: 20 }}>Buttons</p>
              <div className="row" style={{ gap: 12, alignItems: "center" }}>
                <button className="btn btn-primary" type="button">Primary</button>
                <button className="btn btn-secondary" type="button">Secondary</button>
                <button className="btn btn-ghost" type="button">Ghost →</button>
                <button className="btn btn-primary is-disabled" type="button" disabled>Disabled</button>
              </div>
              <div className="row" style={{ gap: 10, marginTop: 20, paddingTop: 20, borderTop: "1px solid #E7E7EC" }}>
                <span className="tag tag--violet">Discovery</span>
                <span className="tag tag--blue">Build</span>
                <span className="tag tag--neutral">Archived</span>
                <span className="tag tag--outline">Outline</span>
              </div>
            </div>
            <div className="kit">
              <p className="eyebrow" style={{ marginBottom: 20 }}>Form controls</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <label className="field">Work email
                  <input className="input" type="email" placeholder="name@organisation.com" readOnly />
                </label>
                <div className="seg" role="group">
                  <span className="is-on">Strategy</span><span>Design</span><span>Build</span>
                </div>
                <div className="row" style={{ gap: 20 }}>
                  <span className="radio is-on"><i />Selected</span>
                  <span className="radio"><i />Unselected</span>
                </div>
              </div>
            </div>
            <div className="kit">
              <p className="eyebrow" style={{ marginBottom: 20 }}>Card</p>
              <article className="sys-card">
                <p className="kicker">CASE STUDY</p>
                <h3>Core banking platform, rebuilt in 14 months</h3>
                <p>A design system and four product teams, working from one shared spec.</p>
                <p className="meta">Financial services · UK</p>
              </article>
            </div>
            <div className="kit">
              <p className="eyebrow" style={{ marginBottom: 20 }}>Data table</p>
              <table className="table">
                <thead><tr><th>Programme</th><th>Stage</th><th className="num">Value</th></tr></thead>
                <tbody>
                  <tr><td>Claims platform</td><td className="stage">Build</td><td className="num">£2.4m</td></tr>
                  <tr><td>Field app rollout</td><td className="stage">Scale</td><td className="num">£1.1m</td></tr>
                  <tr><td>Meridian design system</td><td className="stage">Discovery</td><td className="num">£640k</td></tr>
                </tbody>
              </table>
            </div>
            <div className="kit kit--ink">
              <p className="eyebrow" style={{ marginBottom: 20, color: "#8A8A9C" }}>Dark surfaces</p>
              <div style={{ background: "#1A1A24", padding: 24, marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, color: "#FFFFFF", marginBottom: 8 }}>Elevated panel</h3>
                <p style={{ fontSize: 14, color: "#B4B4C4", marginBottom: 16 }}>Raised surfaces step up in value, never in shadow. Links on ink use <span style={{ color: "#A78BFA" }}>Violet Light</span>.</p>
                <button className="btn btn-primary" type="button">Primary on ink</button>
              </div>
              <div className="gradient-rule" />
            </div>
            <div className="kit">
              <p className="eyebrow" style={{ marginBottom: 20 }}>Iconography</p>
              <div className="iconset">
                {ICON_NAMES.map((name) => <IconTile key={name} name={name} />)}
              </div>
              <p style={{ fontSize: 14, color: "#4A4A5A" }}>Lucide, 1.5px stroke, 24px grid, stroke set to <code>currentColor</code>. Icons are ink — colour them violet only when they carry the action. Click any icon to download its SVG.</p>
            </div>
          </div>
        </section>

        {/* ── 07 Applications ── */}
        <section className="section" id="applications">
          <div className="section-head"><span className="num">07</span><h2>Applications</h2><span className="rule" /></div>
          <div className="mock" style={{ marginBottom: 24 }}>
            <div className="site-header">
              <div className="site-header-logo-wrap"><HorizontalLockupSVG width={170} variant="on-dark" /></div>
              <nav aria-label="Example site navigation">
                <span>Services</span><span>Work</span><span>Thinking</span><span>About</span>
              </nav>
              <span className="btn btn-primary">Start a project</span>
            </div>
            <div className="site-hero">
              <h3>Digital products,<br />engineered end to end.</h3>
              <p>Strategy, design systems and enterprise software for organisations in the middle of a transformation.</p>
            </div>
          </div>
          <div className="row" style={{ marginBottom: 24 }}>
            <div className="card-front">
              <NMonogramSVG size={56} variant="gradient" />
              <HorizontalLockupSVG width={170} variant="on-dark" />
            </div>
            <div className="card-back">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 17, fontWeight: 600 }}>Amara Osei</p>
                  <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", color: "#6D28D9", marginTop: 4 }}>PRINCIPAL, PRODUCT DESIGN</p>
                </div>
                <NMonogramSVG size={34} variant="mono-black" />
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.8, color: "#4A4A5A", borderTop: "1px solid #E7E7EC", paddingTop: 12 }}>
                amara@nexyra.co.uk<br />+44 20 7946 0231 · nexyraconsulting.co.uk
              </p>
            </div>
            <div className="deck-cover">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <NMonogramSVG size={44} variant="mono-white" />
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", color: "rgba(255,255,255,0.9)" }}>CONFIDENTIAL · Q4 2026</span>
              </div>
              <div>
                <p style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05 }}>Platform<br />Modernisation</p>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", marginTop: 12, color: "rgba(255,255,255,0.85)" }}>DISCOVERY REPORT</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="mock" style={{ width: 300 }}>
              <p className="mock__head">Home screen</p>
              <div className="homescreen">
                <figure>
                  <AppIconSVG bg="#7C3AED" nColor="#FFFFFF" strokeColor="#9333EA" size={72} />
                  <figcaption>Nexyra</figcaption>
                </figure>
                <figure>
                  <AppIconSVG bg="#2563EB" nColor="#FFFFFF" strokeColor="#3B82F6" size={72} />
                  <figcaption>Nexyra ID</figcaption>
                </figure>
              </div>
            </div>
            <div className="mock" style={{ width: 320 }}>
              <p className="mock__head">Social profile</p>
              <div className="profile">
                <div className="profile-avatar">
                  <AppIconSVG bg="#0A0A0F" nColor="#FFFFFF" strokeColor="#9333EA" size={68} />
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 600 }}>Nexyra Consulting</p>
                  <p style={{ fontSize: 13, color: "#6B6B7B" }}>@nexyra · 18.4k followers</p>
                  <span className="tag" style={{ background: "#7C3AED", color: "#FFFFFF", marginTop: 10 }}>Follow</span>
                </div>
              </div>
            </div>
            <div className="mock" style={{ flex: "1 1 420px", minWidth: 340 }}>
              <p className="mock__head">Product interface</p>
              <div className="product">
                <div className="product__nav">
                  <NMonogramSVG size={28} variant="mono-white" />
                  <div>
                    <div className="is-on">Programmes</div>
                    <div>Delivery</div>
                    <div>Design system</div>
                    <div>Reporting</div>
                  </div>
                </div>
                <div className="product__main">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #0A0A0F", paddingBottom: 10, marginBottom: 14 }}>
                    <h3 style={{ fontSize: 19 }}>Programmes</h3>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#6D28D9" }}>4 active</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
                    {[
                      { stage: "Discovery", name: "Core banking UX", accent: "#7C3AED" },
                      { stage: "Build", name: "Claims platform", accent: "#2563EB" },
                      { stage: "Scale", name: "Field app rollout", accent: "#2563EB" },
                      { stage: "System", name: "Meridian v3", accent: "#7C3AED" },
                    ].map(({ stage, name, accent }) => (
                      <div key={name} style={{ border: "1px solid #E7E7EC", borderTop: `2px solid ${accent}`, padding: 14 }}>
                        <p className="logo-card__name">{stage}</p>
                        <p style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>{name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 08 Asset Index ── */}
        <section className="section section--ink" id="assets">
          <div className="section-head"><span className="num">08</span><h2>Asset index</h2><span className="rule" /></div>
          <div className="assetindex">
            {/* Each group renders hidden SVGs + download buttons */}
            <AssetGroup title="Horizontal lock-up" items={[
              { label: "lockup-horizontal-gradient.svg", type: "h" as const, variant: "gradient" as LogoVariant },
              { label: "lockup-horizontal-on-light.svg", type: "h" as const, variant: "on-light" as LogoVariant },
              { label: "lockup-horizontal-on-dark.svg", type: "h" as const, variant: "on-dark" as LogoVariant },
              { label: "lockup-horizontal-mono-black.svg", type: "h" as const, variant: "mono-black" as LogoVariant },
              { label: "lockup-horizontal-mono-white.svg", type: "h" as const, variant: "mono-white" as LogoVariant },
            ]} />
            <AssetGroup title="Vertical lock-up" items={[
              { label: "lockup-vertical-gradient.svg", type: "v" as const, variant: "gradient" as LogoVariant },
              { label: "lockup-vertical-on-light.svg", type: "v" as const, variant: "on-light" as LogoVariant },
              { label: "lockup-vertical-on-dark.svg", type: "v" as const, variant: "on-dark" as LogoVariant },
              { label: "lockup-vertical-mono-black.svg", type: "v" as const, variant: "mono-black" as LogoVariant },
              { label: "lockup-vertical-mono-white.svg", type: "v" as const, variant: "mono-white" as LogoVariant },
            ]} />
            <AssetGroup title="Monogram" items={[
              { label: "monogram-gradient.svg", type: "m" as const, variant: "gradient" as LogoVariant },
              { label: "monogram-on-light.svg", type: "m" as const, variant: "on-light" as LogoVariant },
              { label: "monogram-on-dark.svg", type: "m" as const, variant: "on-dark" as LogoVariant },
              { label: "monogram-mono-black.svg", type: "m" as const, variant: "mono-black" as LogoVariant },
              { label: "monogram-mono-white.svg", type: "m" as const, variant: "mono-white" as LogoVariant },
            ]} />
            <div>
              <h3>App icons &amp; packages</h3>
              {APP_ICONS.map(({ filename, bg, nColor, strokeColor }) => (
                <AssetAppIconRow key={filename} filename={filename} bg={bg} nColor={nColor} strokeColor={strokeColor} />
              ))}
              <a href="/brand/fonts/hanken-grotesk-webfonts.zip" download>hanken-grotesk-webfonts.zip</a><br />
            </div>
          </div>
          <div className="colophon">
            <span>Nexyra Consulting Ltd · Brand Guidelines v1.0</span>
            <span>Questions on usage: <a href="mailto:hello@nexyraconsulting.co.uk">hello@nexyraconsulting.co.uk</a></span>
          </div>
        </section>

      </main>
    </div>
  );
}

// ─── Asset index helpers ──────────────────────────────────────────────────────

function AssetGroup({ title, items }: {
  title: string;
  items: { label: string; type: "h" | "v" | "m"; variant: LogoVariant }[];
}) {
  return (
    <div>
      <h3>{title}</h3>
      {items.map(({ label, type, variant }) => (
        <AssetLogoRow key={label} label={label} type={type} variant={variant} />
      ))}
    </div>
  );
}

function AssetLogoRow({ label, type, variant }: { label: string; type: "h" | "v" | "m"; variant: LogoVariant }) {
  const ref = useRef<HTMLDivElement>(null);
  const filename = label.replace(".svg", "");
  const getSVG = () => ref.current?.querySelector("svg") as SVGElement | null;

  return (
    <span style={{ display: "block" }}>
      {/* Hidden SVG for serialisation */}
      <div ref={ref} style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
        {type === "h" && <HorizontalLockupSVG width={300} variant={variant} />}
        {type === "v" && <VerticalLockupSVG width={220} variant={variant} />}
        {type === "m" && <NMonogramSVG size={120} variant={variant} />}
      </div>
      <button className="bb-link-btn" onClick={() => downloadSVGEl(getSVG(), filename)}>{label}</button>
      <br />
    </span>
  );
}

function AssetAppIconRow({ filename, bg, nColor, strokeColor }: { filename: string; bg: string; nColor: string; strokeColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <span style={{ display: "block" }}>
      <div ref={ref} style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
        <AppIconSVG bg={bg} nColor={nColor} strokeColor={strokeColor} size={512} />
      </div>
      <button className="bb-link-btn" onClick={() => downloadSVGEl(ref.current?.querySelector("svg") as SVGElement | null, filename)}>
        {filename}.svg
      </button>
      <br />
    </span>
  );
}
