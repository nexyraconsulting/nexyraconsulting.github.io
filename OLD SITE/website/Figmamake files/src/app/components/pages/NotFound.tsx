import { Link } from "react-router";

export function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e8ff" }}
      aria-labelledby="notfound-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(124,58,237,0.18) 0%, transparent 70%)" }}
      />
      <div className="relative z-10">
        <div
          className="text-9xl mb-6 leading-none select-none"
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 900,
            background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </div>
        <h1
          id="notfound-heading"
          className="text-2xl md:text-3xl mb-4"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800 }}
        >
          This page doesn't exist
        </h1>
        <p className="mb-10 max-w-sm" style={{ color: "#8888bb" }}>
          You may have followed a broken link or the page has been moved. Let's get you back on track.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff", fontWeight: 700 }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
