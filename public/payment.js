// Pay4Work Merchant payment integration
// Replace these placeholders with real merchant credentials before going live.
window.PAY4WORK_PUBLIC_KEY = "PAY4WORK_PUBLIC_KEY";
window.PAY4WORK_MERCHANT_ID = "PAY4WORK_MERCHANT_ID";

/**
 * processPay4WorkPayment
 * @param {Object} opts
 * @param {number} opts.amount - USD amount
 * @param {string} opts.email - customer email
 * @param {string} opts.name - customer name
 * @param {Array}  opts.items - cart items [{id,name,price,qty}]
 * @returns {Promise<{status:'success'|'failed', reference:string, message:string}>}
 */
window.processPay4WorkPayment = function (opts) {
  return new Promise((resolve) => {
    const { amount, email, name, items } = opts;
    if (!amount || amount <= 0) {
      return resolve({ status: "failed", reference: "", message: "Invalid amount." });
    }
    if (!email || !name) {
      return resolve({ status: "failed", reference: "", message: "Missing customer details." });
    }

    // If real Pay4Work SDK is available on window, use it.
    if (window.Pay4Work && typeof window.Pay4Work.checkout === "function") {
      try {
        window.Pay4Work.checkout({
          publicKey: window.PAY4WORK_PUBLIC_KEY,
          merchantId: window.PAY4WORK_MERCHANT_ID,
          amount: amount,
          currency: "USD",
          email: email,
          customerName: name,
          items: items,
          onSuccess: (ref) =>
            resolve({ status: "success", reference: ref || ("P4W-" + Date.now()), message: "Payment successful." }),
          onFailure: (err) =>
            resolve({ status: "failed", reference: "", message: (err && err.message) || "Payment failed." }),
        });
        return;
      } catch (e) {
        return resolve({ status: "failed", reference: "", message: e.message || "Payment error." });
      }
    }

    // Fallback simulated flow — used until merchant credentials & SDK are added.
    setTimeout(() => {
      const ok = Math.random() > 0.08; // 92% success in simulation
      if (ok) {
        const ref = "P4W-" + Date.now().toString(36).toUpperCase();
        // Save order to localStorage
        try {
          const orders = JSON.parse(localStorage.getItem("vm_orders") || "[]");
          orders.push({
            reference: ref,
            amount,
            email,
            name,
            items,
            createdAt: new Date().toISOString(),
            status: "paid",
          });
          localStorage.setItem("vm_orders", JSON.stringify(orders));
        } catch (e) {}
        resolve({ status: "success", reference: ref, message: "Payment authorized successfully." });
      } else {
        resolve({ status: "failed", reference: "", message: "Card declined. Please try another card." });
      }
    }, 1600);
  });
};
