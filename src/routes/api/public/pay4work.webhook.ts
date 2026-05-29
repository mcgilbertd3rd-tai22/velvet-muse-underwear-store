import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

export const Route = createFileRoute("/api/public/pay4work/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.PAY4WORK_WEBHOOK_SECRET;
        if (!secret) return new Response("Server missing webhook secret", { status: 500 });

        const body = await request.text();
        const signature =
          request.headers.get("x-pay4work-signature") ||
          request.headers.get("x-webhook-signature") ||
          request.headers.get("pay4work-signature") ||
          "";

        try {
          const expected = createHmac("sha256", secret).update(body).digest("hex");
          const a = Buffer.from(signature, "utf8");
          const b = Buffer.from(expected, "utf8");
          if (a.length !== b.length || !timingSafeEqual(a, b)) {
            return new Response("Invalid signature", { status: 401 });
          }
        } catch {
          return new Response("Invalid signature", { status: 401 });
        }

        // Accept the event. Persistence would happen here if a DB existed.
        try {
          const event = JSON.parse(body);
          console.log("Pay4Work webhook:", event?.type || event?.event, event?.reference || event?.data?.reference);
        } catch {}

        return new Response("ok", { status: 200 });
      },
    },
  },
});
