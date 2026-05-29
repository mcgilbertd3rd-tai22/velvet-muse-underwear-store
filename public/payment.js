// Pay4Work Merchant payment integration.
// Public key is safe to expose; the secret + webhook secret live on the server
// (see src/routes/api/public/pay4work.create-order.ts and pay4work.webhook.ts).
window.PAY4WORK_PUBLIC_KEY = "pk_live_1778934500699_2b1ffb23a2398d404aced3e2";

/**
 * processPay4WorkPayment
 * Calls our server endpoint, which creates an order with Pay4Work and
 * returns a hosted checkout URL. The customer is redirected there to pay.
 *
 * @param {Object} opts
 * @param {number} opts.amount - USD amount
 * @param {string} opts.email
 * @param {string} opts.name
 * @param {Array}  opts.items  - [{id,name,price,qty}]
 * @returns {Promise<{status:'success'|'failed', reference:string, message:string}>}
 */
window.processPay4WorkPayment = function (opts) {
  return new Promise(async (resolve) => {
    try {
      const { amount, email, name, items } = opts || {};
      if (!amount || amount <= 0) {
        return resolve({ status: "failed", reference: "", message: "Invalid amount." });
      }
      if (!email || !name) {
        return resolve({ status: "failed", reference: "", message: "Missing customer details." });
      }

      const res = await fetch("/api/public/pay4work/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, email, name, items }),
      });

      let data = {};
      try { data = await res.json(); } catch (e) {}

      if (!res.ok || data.status !== "success" || !data.checkout_url) {
        return resolve({
          status: "failed",
          reference: "",
          message: data.message || `Could not start payment (${res.status}).`,
        });
      }

      // Save a pending order locally so the shop can reconcile on return.
      try {
        const orders = JSON.parse(localStorage.getItem("vm_orders") || "[]");
        orders.push({
          reference: data.reference,
          amount,
          email,
          name,
          items,
          createdAt: new Date().toISOString(),
          status: "pending",
        });
        localStorage.setItem("vm_orders", JSON.stringify(orders));
      } catch (e) {}

      // Redirect to the Pay4Work hosted checkout page.
      resolve({
        status: "success",
        reference: data.reference,
        message: "Redirecting to secure checkout…",
      });

      setTimeout(() => { window.location.href = data.checkout_url; }, 600);
    } catch (e) {
      resolve({ status: "failed", reference: "", message: e.message || "Payment error." });
    }
  });
};
