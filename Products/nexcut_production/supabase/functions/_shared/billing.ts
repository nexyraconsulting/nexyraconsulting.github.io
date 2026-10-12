// Shared clients + helpers for NEXCut billing Edge Functions (Deno).
import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

export const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});
export const cryptoProvider = Stripe.createSubtleCryptoProvider();

export const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

const ALLOWED = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
export function cors(req: Request) {
  const o = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED.includes(o) ? o : ALLOWED[0] ?? "",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    Vary: "Origin",
  };
}
export const json = (req: Request, status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(req), "Content-Type": "application/json" } });

export const TRIAL_DAYS = 14;

// The signed-in user (from the Supabase JWT) and the business they own.
export async function ownerFromRequest(req: Request) {
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;
  const { data: m } = await admin.from("business_members").select("business_id, role").eq("user_id", data.user.id).eq("role", "owner").maybeSingle();
  if (!m) return null;
  return { user: data.user, businessId: m.business_id as string };
}

export function mapStripeStatus(sub: Stripe.Subscription): string {
  if (sub.status === "trialing" && sub.cancel_at_period_end) return "trial_cancelled";
  if (sub.status === "canceled") return sub.trial_end && sub.ended_at && sub.ended_at <= sub.trial_end ? "trial_cancelled" : "cancelled";
  if (sub.status === "unpaid" || sub.status === "incomplete_expired") return "expired";
  if (sub.status === "incomplete") return "incomplete";
  return sub.status; // trialing | active | past_due | paused
}

export const ts = (s?: number | null) => (s ? new Date(s * 1000).toISOString() : null);

export async function enqueue(businessId: string, template: string, toEmail: string, payload: Record<string, unknown> = {}) {
  await admin.from("notifications_outbox").upsert({ business_id: businessId, template, to_email: toEmail, payload }, { onConflict: "business_id,template,payload", ignoreDuplicates: true });
}
