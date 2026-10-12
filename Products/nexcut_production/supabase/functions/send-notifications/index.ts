// /functions/v1/send-notifications   (cron, every 5 minutes — see docs/DEPLOYMENT.md)
// Drains notifications_outbox through Postmark. Templates live in Postmark (aliases below).
import { admin } from "../_shared/billing.ts";

const TOKEN = Deno.env.get("POSTMARK_SERVER_TOKEN");
const FROM = Deno.env.get("EMAIL_FROM") ?? "NEXCut <billing@nexcut.co.uk>";
const ALIAS: Record<string, string> = {
  trial_started: "nexcut-trial-started",          // trial start + end dates, first payment date/amount, how to cancel
  trial_ending: "nexcut-trial-ending",            // sent ~3 days before trial end
  trial_cancelled: "nexcut-trial-cancelled",      // confirms no charge will be taken
  payment_succeeded: "nexcut-payment-receipt",
  payment_failed: "nexcut-payment-failed",        // link to update payment method (portal)
  renewal_upcoming: "nexcut-renewal-upcoming",    // fixed terms: before renewal
  subscription_cancelled: "nexcut-subscription-ended",
  payment_method_updated: "nexcut-payment-method-updated",
};

Deno.serve(async (req) => {
  if (req.headers.get("authorization") !== `Bearer ${Deno.env.get("CRON_SECRET")}`) return new Response("forbidden", { status: 403 });
  if (!TOKEN) return new Response("POSTMARK_SERVER_TOKEN not set — emails stay queued", { status: 503 });
  const { data: rows } = await admin.from("notifications_outbox").select("*").eq("status", "queued").lt("attempts", 5).order("created_at").limit(50);
  let sent = 0;
  for (const r of rows ?? []) {
    const res = await fetch("https://api.postmarkapp.com/email/withTemplate", {
      method: "POST",
      headers: { "X-Postmark-Server-Token": TOKEN, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ From: FROM, To: r.to_email, TemplateAlias: ALIAS[r.template], TemplateModel: r.payload, MessageStream: "outbound" }),
    });
    await admin.from("notifications_outbox").update(res.ok ? { status: "sent", sent_at: new Date().toISOString() } : { attempts: r.attempts + 1, status: r.attempts + 1 >= 5 ? "failed" : "queued" }).eq("id", r.id);
    if (res.ok) sent++;
  }
  return new Response(JSON.stringify({ sent }), { headers: { "Content-Type": "application/json" } });
});
