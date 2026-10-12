// /functions/v1/store-sync   (NEXCut Business app, Route A — iOS App Store / Google Play)
// STATUS: integration-ready skeleton. Signature verification and store API calls need store credentials
// (see docs/PAYMENTS.md §App stores and docs/CONFIGURATION_CHECKLIST.md). It is NOT functional until then.
//
//   POST {platform:"app_store", signedTransaction, businessId}   from the app after a StoreKit 2 purchase
//   POST {platform:"google_play", purchaseToken, productId, businessId}  from the app after a Play Billing purchase
//   POST (no auth)  App Store Server Notifications V2  → body {signedPayload}
//   POST (no auth)  Google RTDN via Pub/Sub push       → body {message:{data}}
//
// Writes the SAME public.subscriptions row (unique per business) with channel app_store | google_play, so a
// business can never hold a web subscription and a store subscription at once. If a Stripe subscription is
// already active/trialing for the business, the app must not offer a store purchase (the app reads
// GET /subscription first), and this function rejects it with 409.
import { admin, json, cors, ownerFromRequest, TRIAL_DAYS } from "../_shared/billing.ts";

async function verifyAppleJWS(_jws: string): Promise<any> {
  // TODO(credentials): verify the x5c chain against Apple Root CA G3, then decode the payload.
  // Library option: npm:@apple/app-store-server-library (SignedDataVerifier) with APPLE_BUNDLE_ID, APPLE_APP_ID, environment.
  throw new Error("Apple verification not configured");
}
async function verifyGooglePurchase(_token: string, _productId: string): Promise<any> {
  // TODO(credentials): call androidpublisher.purchases.subscriptionsv2.get with GOOGLE_PLAY_SERVICE_ACCOUNT_JSON.
  throw new Error("Google Play verification not configured");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  const body = await req.json().catch(() => ({}));

  // Store-to-server notifications (renewals, cancellations, refunds, billing retry, expiry)
  if (body.signedPayload || body.message?.data) {
    const id = body.signedPayload ? "apple:" + body.signedPayload.slice(-40) : "google:" + body.message.messageId;
    const { error: dup } = await admin.from("billing_events").insert({ id, source: body.signedPayload ? "app_store" : "google_play", type: "notification", payload: body });
    if (dup) return new Response("duplicate", { status: 200 });
    return new Response("stored (processing requires store credentials)", { status: 202 });
  }

  // App-initiated purchase confirmation
  const owner = await ownerFromRequest(req);
  if (!owner) return json(req, 401, { message: "Sign in as the business owner." });
  const { data: existing } = await admin.from("subscriptions").select("channel, status").eq("business_id", owner.businessId).maybeSingle();
  if (existing && existing.channel === "stripe" && ["trialing", "active", "past_due", "trial_cancelled"].includes(existing.status))
    return json(req, 409, { message: "This business already has a subscription from the website. Manage it there." });

  try {
    const tx = body.platform === "app_store" ? await verifyAppleJWS(body.signedTransaction) : await verifyGooglePurchase(body.purchaseToken, body.productId);
    const start = new Date(tx.purchaseDate ?? Date.now());
    await admin.from("subscriptions").upsert({
      business_id: owner.businessId, channel: body.platform, term_code: tx.termCode, status: "trialing",
      trial_start: start.toISOString(), trial_end: new Date(start.getTime() + TRIAL_DAYS * 864e5).toISOString(),
      store_original_transaction_id: tx.originalTransactionId ?? null, store_purchase_token: body.purchaseToken ?? null,
      payment_method_type: body.platform === "app_store" ? "apple_iap" : "google_play",
    }, { onConflict: "business_id" });
    return json(req, 200, { status: "trialing" });
  } catch (e) {
    return json(req, 501, { message: (e as Error).message });
  }
});
