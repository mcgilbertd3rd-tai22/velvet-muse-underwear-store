import { createFileRoute } from "@tanstack/react-router";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/pay4work/create-order")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: corsHeaders }),

      POST: async ({ request }) => {
        const secret = process.env.PAY4WORK_SECRET_KEY;
        if (!secret) {
          return new Response(
            JSON.stringify({ status: "failed", message: "Server missing PAY4WORK_SECRET_KEY" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        let body: any;
        try {
          body = await request.json();
        } catch {
          return new Response(
            JSON.stringify({ status: "failed", message: "Invalid JSON body" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const amount = Number(body?.amount);
        const email = String(body?.email || "").trim();
        const name = String(body?.name || "").trim();
        const items = Array.isArray(body?.items) ? body.items : [];

        if (!amount || amount <= 0 || !email || !name) {
          return new Response(
            JSON.stringify({ status: "failed", message: "Missing amount, email or name." }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const origin = new URL(request.url).origin;
        const reference = "VM-" + Date.now().toString(36).toUpperCase();

        const payload = {
          amount,
          currency: "USD",
          reference,
          description: `Velvet Muse order — ${items.length} item(s)`,
          customer: { name, email },
          items: items.map((i: any) => ({
            name: String(i.name || "Item"),
            price: Number(i.price || 0),
            quantity: Number(i.qty || 1),
          })),
          callback_url: `${origin}/shop.html?p4w_ref=${reference}`,
          redirect_url: `${origin}/shop.html?p4w_ref=${reference}`,
          webhook_url: `${origin}/api/public/pay4work/webhook`,
        };

        try {
          const res = await fetch("https://api.pay4.work/api/v1/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${secret}`,
            },
            body: JSON.stringify(payload),
          });

          const text = await res.text();
          let data: any = {};
          try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

          if (!res.ok) {
            return new Response(
              JSON.stringify({
                status: "failed",
                message: data?.message || data?.error || `Pay4Work error (${res.status})`,
                details: data,
              }),
              { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }

          // Try to find the hosted checkout URL across common response shapes.
          const checkoutUrl =
            data?.checkout_url ||
            data?.payment_url ||
            data?.hosted_url ||
            data?.url ||
            data?.data?.checkout_url ||
            data?.data?.payment_url ||
            data?.data?.hosted_url ||
            data?.data?.url ||
            data?.order?.checkout_url ||
            data?.order?.payment_url;

          const remoteRef =
            data?.reference || data?.id || data?.data?.reference || data?.data?.id || reference;

          if (!checkoutUrl) {
            return new Response(
              JSON.stringify({
                status: "failed",
                message: "Pay4Work did not return a checkout URL.",
                details: data,
              }),
              { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }

          return new Response(
            JSON.stringify({
              status: "success",
              reference: remoteRef,
              checkout_url: checkoutUrl,
            }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } catch (e: any) {
          return new Response(
            JSON.stringify({ status: "failed", message: e?.message || "Network error contacting Pay4Work." }),
            { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      },
    },
  },
});
