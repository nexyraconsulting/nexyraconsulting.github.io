import { useState } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

// ─── Web3Forms ────────────────────────────────────────────────────────────────
// 1. Go to https://web3forms.com
// 2. Enter "hello@nexyraconsulting.co.uk" and click "Create Access Key"
// 3. Paste the key you receive below (replace the empty string)
// ─────────────────────────────────────────────────────────────────────────────
const WEB3FORMS_KEY = "30117b51-b50f-4e59-9611-f16935eb19f7" as string | undefined;
const TO_EMAIL = "hello@nexyraconsulting.co.uk";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";

type SendState = "idle" | "sending" | "success" | "error";

type FormFields = {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormFields, string>>;

const inputStyle = {
  background: "#0d0d20",
  border: "1px solid rgba(124,58,237,0.2)",
  color: "#e8e8ff",
  fontFamily: "'DM Sans', sans-serif",
};

const EMPTY_FORM: FormFields = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  message: "",
};

function validateForm(form: FormFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.name.trim()) {
    errors.name = "Full name is required.";
  }

  if (!form.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!form.message.trim()) {
    errors.message = "Please tell us about your project.";
  } else if (form.message.trim().length < 20) {
    errors.message = "Please provide a bit more detail (at least 20 characters).";
  }

  return errors;
}

export function Contact() {
  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [sendState, setSendState] = useState<SendState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as soon as the user edits it
    if (fieldErrors[name as keyof FormFields]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendState === "sending") return;

    // Client-side validation
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (!WEB3FORMS_KEY) {
      setErrorMsg(
        "Form not configured yet. Please contact us directly at " + TO_EMAIL
      );
      setSendState("error");
      return;
    }

    setSendState("sending");
    setErrorMsg("");
    setFieldErrors({});

    try {
      const payload = {
        access_key: WEB3FORMS_KEY,
        subject: `New enquiry from ${form.name.trim()} — NEXYRA Consulting`,
        from_name: "NEXYRA Website",
        // Recipient is determined by the access key (tied to hello@nexyraconsulting.co.uk)
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || "Not specified",
        service: form.service || "Not specified",
        budget: form.budget || "Not specified",
        message: form.message.trim(),
        // Redirect web3forms replyto to the sender so we can reply directly
        replyto: form.email.trim(),
        // Honeypot anti-spam
        botcheck: "",
      };

      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSendState("success");
      } else {
        throw new Error(data.message ?? "Submission failed");
      }
    } catch (err: unknown) {
      console.error("Form submission error:", err);
      setErrorMsg(
        "Something went wrong sending your message. Please try again, or email us directly at " +
          TO_EMAIL
      );
      setSendState("error");
    }
  };

  const handleReset = () => {
    setSendState("idle");
    setErrorMsg("");
    setFieldErrors({});
    setForm(EMPTY_FORM);
  };

  const focusStyle = (field: keyof FormFields) => ({
    ...inputStyle,
    border: fieldErrors[field]
      ? "1px solid rgba(239,68,68,0.6)"
      : inputStyle.border,
    color: form[field] ? "#e8e8ff" : "#555577",
  });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e8ff" }}>
      {/* Header */}
      <section
        className="pt-32 pb-16 px-6 relative overflow-hidden"
        aria-labelledby="contact-heading"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace" }}>
            Get in Touch
          </p>
          <h1
            id="contact-heading"
            className="text-4xl md:text-5xl mb-6"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, color: "#e8e8ff", lineHeight: 1.15 }}
          >
            Let's start something remarkable
          </h1>
          <p className="text-lg" style={{ color: "#8888bb", lineHeight: 1.7 }}>
            Whether you're ready to start or just exploring, we'd love to hear about your project.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <section className="px-6 pb-24" aria-label="Contact information and form">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">

          {/* Left info col */}
          <aside className="lg:col-span-2 flex flex-col gap-8">
            <div
              className="rounded-2xl p-8 flex flex-col gap-6"
              style={{ background: "#08081a", border: "1px solid rgba(124,58,237,0.18)" }}
            >
              <h2
                className="text-xl"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: "#e8e8ff" }}
              >
                Contact Details
              </h2>
              <div className="flex flex-col gap-5">
                {[
                  { Icon: Mail,  label: "Email",         value: "hello@nexyraconsulting.co.uk", href: "mailto:hello@nexyraconsulting.co.uk" },
                  { Icon: Phone, label: "Phone",         value: "+44 74151 71157",               href: "tel:+447415171157" },
                  { Icon: MapPin,label: "Location",      value: "Slough, Berkshire, UK", href: null },
                  { Icon: Clock, label: "Response time", value: "We reply within 4 business hours",  href: null },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(124,58,237,0.15)" }}
                    >
                      <Icon size={17} style={{ color: "#a78bfa" }} />
                    </div>
                    <div>
                      <div className="text-xs mb-0.5 uppercase tracking-widest" style={{ color: "#555577", fontFamily: "'JetBrains Mono', monospace" }}>
                        {label}
                      </div>
                      {href ? (
                        <a href={href} className="text-sm hover:text-white transition-colors" style={{ color: "#c4c4e8" }}>
                          {value}
                        </a>
                      ) : (
                        <span className="text-sm" style={{ color: "#c4c4e8" }}>{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-8"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.1) 100%)",
                border: "1px solid rgba(124,58,237,0.25)",
              }}
            >
              <h3 className="text-lg mb-3" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: "#e8e8ff" }}>
                Prefer a call?
              </h3>
              <p className="text-sm mb-5" style={{ color: "#8888bb" }}>
                Book a free 30-minute discovery call with our team. We'll discuss your project, answer your questions, and recommend the best approach.
              </p>
              <a
                href="tel:+447415171157"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff", fontWeight: 600 }}
              >
                Call Us Now
              </a>
            </div>
          </aside>

          {/* Form col */}
          <div className="lg:col-span-3">
            {sendState === "success" ? (
              <div
                className="rounded-2xl p-12 flex flex-col items-center justify-center gap-6 text-center min-h-96"
                style={{ background: "#08081a", border: "1px solid rgba(124,58,237,0.25)" }}
                role="status"
                aria-live="polite"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(124,58,237,0.2)" }}>
                  <CheckCircle2 size={32} style={{ color: "#a78bfa" }} />
                </div>
                <h2 className="text-2xl" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 800, color: "#e8e8ff" }}>
                  Message sent!
                </h2>
                <p className="text-base max-w-sm" style={{ color: "#8888bb" }}>
                  Thanks for reaching out. A member of our team will be in touch within 4 business hours.
                </p>
                <button
                  onClick={handleReset}
                  className="text-sm px-6 py-2.5 rounded-full transition-all hover:opacity-90 cursor-pointer"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl p-8 flex flex-col gap-5"
                style={{ background: "#08081a", border: "1px solid rgba(124,58,237,0.18)" }}
                noValidate
                aria-label="Contact form"
              >
                {/* Name + Email */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm" style={{ color: "#c4c4e8", fontWeight: 600 }}>
                      Full Name <span style={{ color: "#7c3aed" }}>*</span>
                    </label>
                    <input
                      id="name" name="name" type="text"
                      value={form.name} onChange={handleChange}
                      placeholder="Jane Smith"
                      className="px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={focusStyle("name")}
                      onFocus={(e) => (e.target.style.borderColor = fieldErrors.name ? "rgba(239,68,68,0.8)" : "rgba(124,58,237,0.6)")}
                      onBlur={(e)  => (e.target.style.borderColor = fieldErrors.name ? "rgba(239,68,68,0.6)" : "rgba(124,58,237,0.2)")}
                      aria-describedby={fieldErrors.name ? "name-error" : undefined}
                      aria-invalid={!!fieldErrors.name}
                    />
                    {fieldErrors.name && (
                      <p id="name-error" className="text-xs mt-0.5" style={{ color: "#fca5a5" }} role="alert">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm" style={{ color: "#c4c4e8", fontWeight: 600 }}>
                      Email <span style={{ color: "#7c3aed" }}>*</span>
                    </label>
                    <input
                      id="email" name="email" type="email"
                      value={form.email} onChange={handleChange}
                      placeholder="jane@company.com"
                      className="px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={focusStyle("email")}
                      onFocus={(e) => (e.target.style.borderColor = fieldErrors.email ? "rgba(239,68,68,0.8)" : "rgba(124,58,237,0.6)")}
                      onBlur={(e)  => (e.target.style.borderColor = fieldErrors.email ? "rgba(239,68,68,0.6)" : "rgba(124,58,237,0.2)")}
                      aria-describedby={fieldErrors.email ? "email-error" : undefined}
                      aria-invalid={!!fieldErrors.email}
                    />
                    {fieldErrors.email && (
                      <p id="email-error" className="text-xs mt-0.5" style={{ color: "#fca5a5" }} role="alert">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="company" className="text-sm" style={{ color: "#c4c4e8", fontWeight: 600 }}>
                    Company
                  </label>
                  <input
                    id="company" name="company" type="text"
                    value={form.company} onChange={handleChange}
                    placeholder="Acme Corp"
                    className="px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.6)")}
                    onBlur={(e)  => (e.target.style.borderColor = "rgba(124,58,237,0.2)")}
                  />
                </div>

                {/* Service + Budget */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="service" className="text-sm" style={{ color: "#c4c4e8", fontWeight: 600 }}>
                      Service Needed
                    </label>
                    <select
                      id="service" name="service"
                      value={form.service} onChange={handleChange}
                      className="px-4 py-3 rounded-xl text-sm outline-none transition-all cursor-pointer"
                      style={{ ...inputStyle, color: form.service ? "#e8e8ff" : "#555577" }}
                    >
                      <option value="">Select a service</option>
                      <optgroup label="— Product Design">
                        <option value="UI/UX Product Design">UI/UX Product Design</option>
                        <option value="SaaS Product Design">SaaS Product Design</option>
                        <option value="Enterprise Software Design">Enterprise Software Design</option>
                      </optgroup>
                      <optgroup label="— Brand &amp; Identity">
                        <option value="Brand Design System">Brand Design System</option>
                        <option value="Visual Identity &amp; Branding">Visual Identity &amp; Branding</option>
                      </optgroup>
                      <optgroup label="— Digital &amp; Commerce">
                        <option value="Web &amp; Landing Page Design">Web &amp; Landing Page Design</option>
                        <option value="Mobile App Design">Mobile App Design</option>
                        <option value="E-commerce Design">E-commerce Design</option>
                      </optgroup>
                      <optgroup label="— Creative &amp; Content">
                        <option value="Motion Graphic Design">Motion Graphic Design</option>
                        <option value="Infographic &amp; Data Visualization">Infographic &amp; Data Visualization</option>
                        <option value="Print, Merchandise &amp; Packaging">Print, Merchandise &amp; Packaging</option>
                        <option value="Pitch Deck &amp; Presentation Design">Pitch Deck &amp; Presentation Design</option>
                      </optgroup>
                      <optgroup label="— Other">
                        <option value="Multiple services">Multiple services</option>
                        <option value="Not sure yet">Not sure yet</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="budget" className="text-sm" style={{ color: "#c4c4e8", fontWeight: 600 }}>
                      Budget
                    </label>
                    <select
                      id="budget" name="budget"
                      value={form.budget} onChange={handleChange}
                      className="px-4 py-3 rounded-xl text-sm outline-none transition-all cursor-pointer"
                      style={{ ...inputStyle, color: form.budget ? "#e8e8ff" : "#555577" }}
                    >
                      <option value="">Select a range</option>
                      <optgroup label="— Fixed Price (one-off)">
                        <option value="Under £1,500 — Creative deliverable">Under £1,500 — Creative deliverable</option>
                        <option value="£1,500–£4,000 — Digital or brand engagement">£1,500–£4,000 — Digital or brand engagement</option>
                        <option value="£4,000–£8,000 — Product design engagement">£4,000–£8,000 — Product design engagement</option>
                        <option value="£8,000+ — Large or multi-service project">£8,000+ — Large or multi-service project</option>
                      </optgroup>
                      <optgroup label="— Partnership Ladder (retained)">
                        <option value="£1,500–£3,000 / mo — Discover or light retainer">£1,500–£3,000 / mo — Discover or light retainer</option>
                        <option value="£3,000–£6,000 / mo — Build retainer">£3,000–£6,000 / mo — Build retainer</option>
                        <option value="£6,000+ / mo — Full-service partnership">£6,000+ / mo — Full-service partnership</option>
                      </optgroup>
                      <option value="Not sure yet — Let's discuss">Not sure yet — Let's discuss</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm" style={{ color: "#c4c4e8", fontWeight: 600 }}>
                    Tell us about your project <span style={{ color: "#7c3aed" }}>*</span>
                  </label>
                  <textarea
                    id="message" name="message" rows={5}
                    value={form.message} onChange={handleChange}
                    placeholder="Describe your goals, current challenges, and any timelines we should know about..."
                    className="px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                    style={focusStyle("message")}
                    onFocus={(e) => (e.target.style.borderColor = fieldErrors.message ? "rgba(239,68,68,0.8)" : "rgba(124,58,237,0.6)")}
                    onBlur={(e)  => (e.target.style.borderColor = fieldErrors.message ? "rgba(239,68,68,0.6)" : "rgba(124,58,237,0.2)")}
                    aria-describedby={fieldErrors.message ? "message-error" : undefined}
                    aria-invalid={!!fieldErrors.message}
                  />
                  {fieldErrors.message && (
                    <p id="message-error" className="text-xs mt-0.5" style={{ color: "#fca5a5" }} role="alert">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Global error */}
                {sendState === "error" && (
                  <div
                    className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}
                    role="alert"
                  >
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    {errorMsg}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sendState === "sending"}
                  className="mt-2 py-4 rounded-full text-base transition-all hover:opacity-90 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                    color: "#fff",
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontWeight: 700,
                    border: "none",
                    boxShadow: "0 0 40px rgba(124,58,237,0.3)",
                  }}
                >
                  {sendState === "sending" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
