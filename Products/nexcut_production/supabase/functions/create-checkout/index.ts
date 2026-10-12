// POST /functions/v1/create-checkout  (website Route B, step 4)
// Creates: auth user → business (+ owner membership) → consents → Stripe customer → subscriptions row (incomplete)
// → Stripe Checkout Session (subscription, 14-day trial, payment details collected, nothing charged today).
// The trial is recorded as started only when the webhook receives checkout.session.completed.
import { admin, stripe, json, cors, TRIAL_DAYS } from "../_shared/billing.ts";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE = /^\+447\d{9}$/;
const RETURN_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map((s) => s.trim());

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return json(req, 405, { message: "Method not allowed" });

  const b = await req.json().catch(() => null);
  const a = b?.account ?? {};
  if (!b || !["card", "bacs_debit"].includes(b.paymentMethod)) return json(req, 400, { message: "Choose a payment method." });
  if (!b.consents?.terms || !b.consents?.trialTerms) return json(req, 422, { message: "Accept the terms to continue.", field: "terms" });
  if (!a.businessName || a.businessName.length < 2) return json(req, 422, { field: "bizName", message: "Enter your business name." });
  if (!a.ownerName || a.ownerName.length < 2) return json(req, 422, { field: "owner", message: "Enter your full name." });
  if (!EMAIL.test(a.email ?? "")) return json(req, 422, { field: "email", message: "Enter a valid email address." });
  if (!MOBILE.test(a.mobile ?? "")) return json(req, 422, { field: "mobile", message: "Enter a UK mobile number." });
  if ((a.password ?? "").length < 10) return json(req, 422, { field: "password", message: "Use at least 10 characters." });
  let ret: URL;
  try { ret = new URL(b.returnUrl); } catch { return json(req, 400, { message: "Bad return URL." }); }
  if (!RETURN_ORIGINS.includes(ret.origin)) return json(req, 400, { message: "Return URL not allowed." });

  // Server-side price lookup: never trust a price from the browser.
  const { data: term } = await admin.from("billing_terms").select("*").eq("code", b.plan).eq("active", true).maybeSingle();
  if (!term) return json(req, 400, { message: "Unknown billing option." });
  if (!term.price_pence || !term.stripe_price_id) return json(req, 503, { message: "Online checkout opens once prices are confirmed. You can start your trial in the NEXCut Business app." });

  // 1. Account (duplicate email → 409; the user signs in instead of creating a second record)
  const { data: created, error: uErr } = await admin.auth.admin.createUser({
    email: a.email, password: a.password, phone: a.mobile, email_confirm: false,
    user_metadata: { full_name: a.ownerName, marketing_opt_in: !!b.consents.marketing },
  });
  if (uErr) {
    if (/already|exists|registered/i.test(uErr.message)) return json(req, 409, { message: "An account already exists for this email." });
    return json(req, 400, { message: uErr.message });
  }
  const userId = created.user!.id;
  const rollback = async () => { await admin.auth.admin.deleteUser(userId).catch(() => {}); };

  try {
    // 2. Business + owner
    const { data: biz, error: bErr } = await admin.from("businesses").insert({ name: a.businessName, business_type: a.businessType ?? null }).select().single();
    if (bErr) throw bErr;
    await admin.from("business_members").insert({ business_id: biz.id, user_id: userId, role: "owner" });

    // 3. Consents (audit trail for the trial terms shown at step 3)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null, ua = req.headers.get("user-agent");
    const v = String(b.consents.termsVersion ?? "unpublished");
    await admin.from("consents").insert([
      { business_id: biz.id, user_id: userId, kind: "terms", version: v, accepted: true, ip, user_agent: ua },
      { business_id: biz.id, user_id: userId, kind: "privacy", version: v, accepted: true, ip, user_agent: ua },
      { business_id: biz.id, user_id: userId, kind: "trial_terms", version: `${term.code}:${TRIAL_DAYS}d`, accepted: true, ip, user_agent: ua },
      { business_id: biz.id, user_id: userId, kind: "marketing", version: v, accepted: !!b.consents.marketing, ip, user_agent: ua },
    ]);

    // 4. Stripe customer + local subscription record (status incomplete until the webhook confirms)
    const customer = await stripe.customers.create({
      email: a.email, name: a.ownerName, phone: a.mobile, preferred_locales: ["en-GB"],
      metadata: { business_id: biz.id, business_public_id: biz.public_id, business_name: a.businessName },
    }, { idempotencyKey: `cust-${biz.id}` });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      client_reference_id: biz.id,
      line_items: [{ price: term.stripe_price_id, quantity: 1 }],
      payment_method_types: [b.paymentMethod],            // 'card' also offers Apple Pay / Google Pay when enabled
      payment_method_collection: "always",               // details saved now, nothing charged until trial end
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        trial_settings: { end_behavior: { missing_payment_method: "cancel" } },  // never converts without a method
        metadata: { business_id: biz.id, term_code: term.code },
      },
      locale: "en-GB",
      success_url: `${ret.origin}${ret.pathname}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ret.origin}${ret.pathname}?cancelled=1&plan=${term.code}`,
    }, { idempotencyKey: `cs-${biz.id}` });

    await admin.from("subscriptions").insert({
      business_id: biz.id, term_code: term.code, status: "incomplete", channel: "stripe",
      stripe_customer_id: customer.id, stripe_checkout_session_id: session.id, payment_method_type: b.paymentMethod,
    });

    return json(req, 200, { url: session.url });
  } catch (e) {
    console.error("create-checkout", e);
    await rollback();
    return json(req, 500, { message: "We could not start secure payment. Nothing has been charged. Please try again." });
  }
});
