// GET /functions/v1/checkout-status?session_id=cs_…   (website step 5, polled after the Stripe redirect)
// Returns the trial only once the webhook has recorded it, so the page never shows an unconfirmed trial.
import { admin, stripe, json, cors } from "../_shared/billing.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  const id = new URL(req.url).searchParams.get("session_id") ?? "";
  if (!/^cs_(test|live)_\w+$/.test(id)) return json(req, 400, { message: "Bad session id." });
  const session = await stripe.checkout.sessions.retrieve(id).catch(() => null);
  if (!session || !session.client_reference_id) return json(req, 404, { status: "unknown" });
  const { data: s } = await admin.from("subscriptions")
    .select("status, term_code, trial_start, trial_end, payment_method_label, businesses(name, public_id)")
    .eq("business_id", session.client_reference_id).maybeSingle();
  if (!s || s.status === "incomplete") return json(req, 200, { status: "pending" });
  return json(req, 200, {
    status: s.status, plan: s.term_code, trialStart: s.trial_start, trialEnd: s.trial_end,
    paymentMethodLabel: s.payment_method_label, email: session.customer_details?.email ?? null,
    businessName: (s as any).businesses?.name, businessPublicId: (s as any).businesses?.public_id,
  });
});
