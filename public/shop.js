// Velvet Muse — Shop page logic
const ADMIN_EMAIL = "dayoadewusi08@gmail.com";

function toast(msg, type) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast show " + (type || "");
  clearTimeout(window.__t);
  window.__t = setTimeout(() => (el.className = "toast"), 2400);
}

// Auth helpers (same shape as welcome page)
function getCurrentUser() { try { return JSON.parse(localStorage.getItem("vm_user") || "null"); } catch (e) { return null; } }
function setCurrentUser(u) { if (u) localStorage.setItem("vm_user", JSON.stringify(u)); else localStorage.removeItem("vm_user"); }
function isAdminEmail(email) { return (email || "").trim().toLowerCase() === ADMIN_EMAIL; }

// Gate
const user = getCurrentUser();
if (!user) location.replace("/welcome.html");

// Cart helpers
function getCart() { try { return JSON.parse(localStorage.getItem("vm_cart") || "[]"); } catch (e) { return []; } }
function saveCart(c) { localStorage.setItem("vm_cart", JSON.stringify(c)); renderCart(); }

// State
let activeCategory = "all";
let searchQuery = "";
let pendingSupplierProduct = null;
const ORDER_REPLY_STATUSES = ["awaiting_payment", "paid", "rejected"];

function readJson(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || ""); } catch (e) { return fallback; } }
function writeJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function getOrderMoney(o) {
  const itemSubtotal = (o.items || []).reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);
  const subtotal = Number(o.subtotal || itemSubtotal || 0);
  const shipping = Number(o.shipping || 0) > 0 ? Number(o.shipping) : Number(window.SHIPPING_FEE || 10);
  const storedTotal = Number(o.total || 0);
  const total = storedTotal >= subtotal + shipping ? storedTotal : +(subtotal + shipping).toFixed(2);
  return { subtotal, shipping, total };
}
function markOrderSeen(id, status) {
  const seen = readJson("vm_orders_seen", {});
  seen[id] = status;
  writeJson("vm_orders_seen", seen);
}
function setOrdersBadge(show) {
  const badge = document.getElementById("orders-badge");
  const btn = document.getElementById("orders-btn");
  if (badge) badge.hidden = !show;
  if (btn) btn.classList.toggle("reply-pulse", !!show);
}
function pointToOrders(message, keepBadge) {
  const tip = document.getElementById("reply-hand-tip");
  const text = document.getElementById("reply-hand-text");
  const btn = document.getElementById("orders-btn");
  if (text) text.textContent = message || "Supplier replies appear here";
  if (tip) tip.hidden = false;
  if (btn) btn.classList.add("reply-pulse");
  if (keepBadge) setOrdersBadge(true);
  clearTimeout(window.__replyTipTimer);
  window.__replyTipTimer = setTimeout(() => {
    if (tip) tip.hidden = true;
    if (!keepBadge && btn) btn.classList.remove("reply-pulse");
  }, 7500);
}
function acknowledgeOrders(orders) {
  const ack = readJson("vm_orders_ack", {});
  orders.forEach((o) => { ack[o.id] = o.status; });
  writeJson("vm_orders_ack", ack);
  setOrdersBadge(false);
  const tip = document.getElementById("reply-hand-tip");
  if (tip) tip.hidden = true;
}
function getMySupplierOrders() {
  const u = getCurrentUser();
  if (!u) return [];
  return window.getSupplierOrders().filter((o) => (o.customerEmail || "").toLowerCase() === (u.email || "").toLowerCase());
}

function readReceiptFile(file, orderId, previewEl) {
  if (!file) return;
  if (file.size > 8 * 1024 * 1024) { toast("Receipt image is too large", "error"); return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const max = 800;
      const ratio = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * ratio));
      const h = Math.max(1, Math.round(img.height * ratio));
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.58);
      window.__receipts = window.__receipts || {};
      window.__receipts[orderId] = dataUrl;
      if (previewEl) previewEl.innerHTML = `<img src="${dataUrl}" alt="Receipt preview" style="max-width:130px;border-radius:6px;border:1px solid var(--line);"/>`;
      toast("Receipt ready — tap submit", "success");
    };
    img.onerror = () => toast("Please choose an image receipt", "error");
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function openSupplierOrder(id) {
  const p = findProduct(id);
  if (!p || !p._source || p._source.type !== "supplier") return;
  pendingSupplierProduct = p;
  const wrap = document.getElementById("supplier-order-product");
  const ship = Number(window.SHIPPING_FEE || 10);
  const sub = priceOf(p);
  wrap.innerHTML = `<div style="display:flex;gap:10px;align-items:center;">
    <img src="${p.image}" alt="" style="width:54px;height:54px;border-radius:8px;object-fit:cover;" onerror="this.style.opacity=0"/>
    <div><strong>${escapeHtml(p.name)}</strong><br/>
    <span style="color:var(--muted);font-size:.78rem;">★ ${escapeHtml(p._source.supplierName)} · ${money(sub)}</span></div>
  </div>
  <div style="margin-top:8px;font-size:.78rem;display:flex;justify-content:space-between;"><span>Subtotal</span><span>${money(sub)}</span></div>
  <div style="font-size:.78rem;display:flex;justify-content:space-between;"><span>Shipping</span><span>${money(ship)}</span></div>
  <div style="font-size:.85rem;display:flex;justify-content:space-between;font-weight:700;margin-top:4px;"><span>Total</span><span>${money(sub + ship)}</span></div>
  <div style="margin-top:6px;font-size:.7rem;color:var(--muted);">🪙 Paid in crypto · 📦 Delivery in 3–7 days</div>`;
  const u = getCurrentUser();
  if (u) {
    const form = document.getElementById("supplier-order-form");
    form.elements.name.value = u.name || "";
    form.elements.email.value = u.email || "";
  }
  document.getElementById("sup-order-msg").textContent = "";
  document.getElementById("supplier-order-modal").classList.add("open");
}

function renderMyOrders() {
  const wrap = document.getElementById("orders-items");
  const mine = getMySupplierOrders();

  // Top notices for this panel
  const headerNotices = `
    <div style="padding:10px 12px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;font-size:.78rem;margin-bottom:10px;">
      🪙 All payments on Velvet Muse — both Suppliers and Personal Collection — are settled in <strong>digital coins / cryptocurrency</strong>.
    </div>
    <div style="padding:8px 12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:.78rem;margin-bottom:10px;">
      📦 Orders are typically delivered within <strong>3–7 days</strong>.
    </div>`;

  if (!mine.length) {
    wrap.innerHTML = headerNotices + '<div class="cart-empty"><p>No supplier orders yet.</p><p style="margin-top:8px;font-size:0.85rem;">Order a supplier item to get started.</p></div>';
    return;
  }
  const statusLabel = {
    pending_confirmation: "⏳ Awaiting supplier confirmation",
    awaiting_payment: "💳 Payment instructions ready — submit your receipt",
    receipt_submitted: "🧾 Receipt submitted — supplier is confirming payment",
    paid: "✓ Paid & confirmed by supplier",
    rejected: "✗ Rejected (out of stock)",
  };
  wrap.innerHTML = headerNotices + mine.map((o) => {
    const items = (o.items || []).map((i) => `<div style="font-size:.78rem;">• ${escapeHtml(i.name)} × ${i.qty}</div>`).join("");
    const totals = getOrderMoney(o);
    const tipsHtml = `
      <div class="order-tips">
        <strong>Tips</strong>
        <ul>
          <li>Every supplier on Velvet Muse is verified ✓.</li>
          <li>Payments are made with digital coins / cryptocurrency.</li>
          <li>Orders are expected to arrive within 3–7 days.</li>
        </ul>
      </div>`;
    return `
    <div class="cart-item" style="display:block;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <strong style="font-size:.85rem;">${escapeHtml(o.supplierName || "Supplier")}</strong>
        <span style="font-size:.7rem;color:var(--muted);">${o.id}</span>
      </div>
      <div style="margin-top:4px;font-size:.78rem;font-weight:600;">${statusLabel[o.status] || o.status}</div>
      <div style="margin-top:6px;">${items}</div>
      <div style="font-size:.75rem;color:var(--muted);">Subtotal: ${money(totals.subtotal)}</div>
      <div style="font-size:.75rem;color:var(--muted);">Shipping fee: ${money(totals.shipping)}</div>
      <div style="margin-top:4px;font-size:.86rem;"><strong>Total before payment:</strong> ${money(totals.total)}</div>
      <div style="margin-top:6px;font-size:.7rem;color:var(--muted);">🪙 Payment in crypto · 📦 Delivery 3–7 days</div>
      ${o.status === "awaiting_payment" ? `
        <div style="margin-top:8px;padding:10px;background:#f0f9ff;border-radius:8px;font-size:.78rem;white-space:pre-wrap;"><strong>Payment instructions:</strong>\n${escapeHtml(o.paymentInstructions || "")}</div>
        <div style="margin-top:10px;padding:10px;background:#fffbeb;border:1px dashed #fbbf24;border-radius:8px;">
          <div style="font-size:.78rem;font-weight:600;margin-bottom:6px;">📤 Submit your payment receipt</div>
          <div style="font-size:.72rem;color:var(--muted);margin-bottom:6px;">Upload a screenshot of your transaction below, then tap "I've Paid". Your order will only be marked paid once the supplier confirms.</div>
          <label class="receipt-upload-box">
            <strong>Tap here to choose receipt photo</strong>
            <span>Use a screenshot from your gallery or take a photo.</span>
            <input type="file" accept="image/*" capture="environment" data-receipt-file="${o.id}" />
          </label>
          <div data-receipt-preview="${o.id}" style="margin-top:6px;"></div>
          ${tipsHtml}
          <button class="btn btn-primary btn-sm btn-block" data-paid="${o.id}" style="margin-top:8px;">I've Paid · Submit receipt</button>
        </div>
      ` : o.status === "receipt_submitted" ? `
        <div style="margin-top:8px;padding:8px;background:#f5f3ff;border-radius:8px;font-size:.75rem;">Receipt sent. Waiting for supplier to confirm your payment.</div>
        ${o.receipt ? `<img src="${o.receipt}" alt="receipt" style="margin-top:6px;max-width:140px;border-radius:6px;border:1px solid var(--line);"/>` : ""}
        ${tipsHtml}
      ` : ""}
    </div>`;
  }).join("");

  // Receipt upload preview
  wrap.querySelectorAll("[data-receipt-file]").forEach((inp) => inp.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    const id = inp.dataset.receiptFile;
    const prev = wrap.querySelector(`[data-receipt-preview="${id}"]`);
    readReceiptFile(file, id, prev);
  }));

  wrap.querySelectorAll("[data-paid]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.paid;
    const receipt = (window.__receipts && window.__receipts[id]) || "";
    if (!receipt) { toast("Please upload your receipt first", "error"); return; }
    try {
      window.updateSupplierOrder(id, { status: "receipt_submitted", receipt });
    } catch (err) {
      toast("Receipt storage is full — try a smaller screenshot", "error");
      return;
    }
    toast("Receipt submitted — awaiting supplier confirmation", "success");
    renderMyOrders();
  }));
}

// Notify customer when supplier responds (status change)
function checkOrderNotifications() {
  const u = getCurrentUser();
  if (!u) return;
  const mine = getMySupplierOrders();
  const seen = readJson("vm_orders_seen", {});
  const ack = readJson("vm_orders_ack", {});
  const notifyFor = { awaiting_payment: "Supplier sent payment instructions", paid: "Supplier confirmed your payment ✓", rejected: "Supplier rejected your order" };
  let changed = false;
  let unreadReply = false;
  mine.forEach((o) => {
    if (seen[o.id] !== o.status) {
      if (seen[o.id] && notifyFor[o.status]) {
        toast(`📬 ${notifyFor[o.status]} — open 📋 My Orders`, "success");
        pointToOrders("Supplier replied — tap here", true);
      }
      seen[o.id] = o.status;
      changed = true;
    }
    if (ORDER_REPLY_STATUSES.includes(o.status) && ack[o.id] !== o.status) unreadReply = true;
  });
  if (changed) writeJson("vm_orders_seen", seen);
  setOrdersBadge(unreadReply);
}

function priceOf(p) {
  const d = p.discount ? Number(p.discount) : 0;
  return d > 0 ? Math.max(15, +(p.price * (1 - d / 100)).toFixed(2)) : p.price;
}
function money(n) { return "$" + Number(n).toFixed(2); }

function renderStars(rating) {
  const r = Math.round(rating || 0);
  return "★★★★★".slice(0, r) + "☆☆☆☆☆".slice(0, 5 - r);
}

function renderProducts() {
  const grid = document.getElementById("grid");
  const products = window.getAllProducts();
  const filtered = products.filter((p) => {
    const inCat = activeCategory === "all" || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const inSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p._source && p._source.label.toLowerCase().includes(q));
    return inCat && inSearch;
  });

  if (!filtered.length) {
    grid.innerHTML = '<div class="empty-state"><h3>No pieces found</h3><p>Try a different search or category.</p></div>';
    return;
  }

  grid.innerHTML = filtered.map((p) => {
    const final = priceOf(p);
    const hasDiscount = p.discount && p.discount > 0;
    const src = p._source || { type: "personal", label: "Personal Collection" };
    const isSupplier = src.type === "supplier";
    const originHtml = isSupplier
      ? `<a class="origin-tag supplier" href="/supplier.html?id=${encodeURIComponent(src.supplierId)}" title="View supplier">★ ${escapeHtml(src.label)}</a>`
      : `<span class="origin-tag personal">✦ Personal</span>`;
    const actionsHtml = isSupplier
      ? `<button class="btn btn-primary btn-sm btn-block" data-order="${p.id}">Order Now</button>`
      : `<button class="btn btn-outline btn-sm" data-add="${p.id}" data-i18n="btn.addbag">Add to Bag</button>
         <button class="btn btn-primary btn-sm" data-buy="${p.id}" data-i18n="btn.buy">Buy Now</button>`;
    return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-image">
          ${hasDiscount ? `<span class="discount-badge">-${p.discount}%</span>` : ""}
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.style.opacity=0" />
        </div>
        <div class="product-info">
          ${originHtml}
          <h3 class="product-name">${escapeHtml(p.name)}</h3>
          <div class="product-rating"><span class="stars">${renderStars(p.rating)}</span><span>${(p.rating || 0).toFixed(1)}</span></div>
          <div class="product-price">
            <span class="price">${money(final)}</span>
            ${hasDiscount ? `<span class="price-old">${money(p.price)}</span>` : ""}
          </div>
          <div class="product-actions">${actionsHtml}</div>
        </div>
      </article>`;
  }).join("");
  if (window.vmI18n) window.vmI18n.applyTranslations(grid);

  grid.querySelectorAll("[data-add]").forEach((b) =>
    b.addEventListener("click", () => addToCart(b.dataset.add))
  );
  grid.querySelectorAll("[data-buy]").forEach((b) =>
    b.addEventListener("click", () => buyNow(b.dataset.buy))
  );
  grid.querySelectorAll("[data-order]").forEach((b) =>
    b.addEventListener("click", () => openSupplierOrder(b.dataset.order))
  );
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function findProduct(id) {
  return window.getAllProducts().find((x) => x.id === id);
}

function addToCart(id) {
  const p = findProduct(id);
  if (!p) return;
  const cart = getCart();
  const existing = cart.find((c) => c.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id: p.id, name: p.name, image: p.image, price: priceOf(p), qty: 1 });
  saveCart(cart);
  toast("Added to your bag", "success");
}

function buyNow(id) {
  const p = findProduct(id);
  if (!p) return;
  openCheckout([{ id: p.id, name: p.name, image: p.image, price: priceOf(p), qty: 1 }]);
}

function changeQty(id, delta) {
  const cart = getCart();
  const it = cart.find((c) => c.id === id);
  if (!it) return;
  it.qty += delta;
  const next = it.qty <= 0 ? cart.filter((c) => c.id !== id) : cart;
  saveCart(next);
}

function removeFromCart(id) {
  saveCart(getCart().filter((c) => c.id !== id));
  toast("Removed from bag");
}

function renderCart() {
  const cart = getCart();
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const badge = document.getElementById("cart-badge");
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  if (totalQty > 0) { badge.hidden = false; badge.textContent = totalQty; }
  else { badge.hidden = true; }

  if (!cart.length) {
    itemsEl.innerHTML = '<div class="cart-empty"><p>Your bag is empty.</p><p style="margin-top:8px;font-size:0.85rem;">Discover pieces that make you feel radiant.</p></div>';
    totalEl.textContent = "$0.00";
    return;
  }

  itemsEl.innerHTML = cart.map((i) => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${i.image}" alt="" onerror="this.style.opacity=0" /></div>
      <div class="cart-item-info">
        <h4>${escapeHtml(i.name)}</h4>
        <div class="cart-item-price">${money(i.price)}</div>
        <div class="cart-item-controls">
          <div class="qty-controls">
            <button class="qty-btn" data-dec="${i.id}">−</button>
            <span>${i.qty}</span>
            <button class="qty-btn" data-inc="${i.id}">+</button>
          </div>
          <button class="remove-btn" data-remove="${i.id}">Remove</button>
        </div>
      </div>
    </div>`).join("");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.textContent = money(total);

  itemsEl.querySelectorAll("[data-inc]").forEach((b) => b.addEventListener("click", () => changeQty(b.dataset.inc, 1)));
  itemsEl.querySelectorAll("[data-dec]").forEach((b) => b.addEventListener("click", () => changeQty(b.dataset.dec, -1)));
  itemsEl.querySelectorAll("[data-remove]").forEach((b) => b.addEventListener("click", () => removeFromCart(b.dataset.remove)));
}

// Checkout
let activeCheckoutItems = null;

function openCheckout(items) {
  if (!items || !items.length) { toast("Your bag is empty.", "error"); return; }
  activeCheckoutItems = items;
  const summary = document.getElementById("order-summary");
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  summary.innerHTML = `
    <h4>Order Summary</h4>
    ${items.map((i) => `<div class="order-line"><span>${escapeHtml(i.name)} × ${i.qty}</span><span>${money(i.price * i.qty)}</span></div>`).join("")}
    <div class="order-line total"><span>Total (USD)</span><span>${money(total)}</span></div>
  `;
  document.getElementById("pay-amount").textContent = " · " + money(total);
  // Prefill
  const u = getCurrentUser();
  if (u) {
    document.querySelector('#checkout-form input[name="name"]').value = u.name || "";
    document.querySelector('#checkout-form input[name="email"]').value = u.email || "";
  }
  document.getElementById("pay-msg").className = "form-msg";
  document.getElementById("pay-msg").textContent = "";
  document.getElementById("checkout-modal").classList.add("open");
}

// Wire up
document.addEventListener("DOMContentLoaded", () => {
  // Apply user's saved language preference (if any) before translating
  if (user && user.lang && window.vmI18n) {
    window.vmI18n.setLang(user.lang);
    window.vmI18n.applyTranslations();
  }

  // Greeting + admin — keep it short for mobile
  function shortName(u) {
    if (!u) return "";
    const raw = (u.name || u.email || "user").toString();
    let base = raw.includes("@") ? raw.split("@")[0] : raw.split(/\s+/)[0];
    base = base.replace(/[._\-]?\d+$/g, "").replace(/[._\-]+/g, " ").trim();
    if (!base) base = "user";
    if (base.length > 8) base = base.slice(0, 8);
    return base.charAt(0).toUpperCase() + base.slice(1);
  }
  document.getElementById("hello").textContent = user ? "Hi, " + shortName(user) : "";
  if (user && isAdminEmail(user.email)) document.getElementById("admin-link").hidden = false;

  const langBtn = document.getElementById("lang-btn");
  if (langBtn && window.vmI18n) {
    langBtn.addEventListener("click", () => window.vmI18n.openLanguagePicker((lang) => {
      if (user) { user.lang = lang; setCurrentUser(user); }
      renderProducts();
    }));
  }

  renderProducts();
  renderCart();

  // Cart
  const panel = document.getElementById("cart-panel");
  const backdrop = document.getElementById("cart-backdrop");
  document.getElementById("cart-btn").addEventListener("click", () => { panel.classList.add("open"); backdrop.classList.add("open"); });
  const closeCart = () => { panel.classList.remove("open"); backdrop.classList.remove("open"); };
  document.getElementById("cart-close").addEventListener("click", closeCart);
  backdrop.addEventListener("click", closeCart);

  // Logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    setCurrentUser(null);
    location.replace("/welcome.html");
  });

  // Search & chips
  document.getElementById("search").addEventListener("input", (e) => { searchQuery = e.target.value; renderProducts(); });
  document.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((x) => x.classList.remove("active"));
    c.classList.add("active");
    activeCategory = c.dataset.cat;
    renderProducts();
  }));

  // Checkout open from cart
  document.getElementById("checkout-btn").addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) return toast("Your bag is empty.", "error");
    closeCart();
    openCheckout(cart);
  });

  // Orders panel
  const ordersPanel = document.getElementById("orders-panel");
  const ordersBackdrop = document.getElementById("orders-backdrop");
  const openOrders = () => {
    renderMyOrders();
    acknowledgeOrders(getMySupplierOrders());
    ordersPanel.classList.add("open");
    ordersBackdrop.classList.add("open");
  };
  const closeOrders = () => { ordersPanel.classList.remove("open"); ordersBackdrop.classList.remove("open"); };
  document.getElementById("orders-btn").addEventListener("click", openOrders);
  document.getElementById("orders-close").addEventListener("click", closeOrders);
  ordersBackdrop.addEventListener("click", closeOrders);

  // Supplier order submit
  document.getElementById("supplier-order-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!pendingSupplierProduct) return;
    const fd = new FormData(e.target);
    const name = (fd.get("name") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const phone = (fd.get("phone") || "").toString().trim();
    const address = (fd.get("address") || "").toString().trim();
    const msg = document.getElementById("sup-order-msg");
    if (!name || !email || !phone || !address) { msg.className = "form-msg error"; msg.textContent = "Please fill all fields."; return; }
    const p = pendingSupplierProduct;
    const subtotal = priceOf(p);
    const shipping = Number(window.SHIPPING_FEE || 10);
    const total = +(subtotal + shipping).toFixed(2);
    window.addSupplierOrder({
      supplierId: p._source.supplierId,
      supplierName: p._source.supplierName,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: address,
      items: [{ id: p.id, name: p.name, price: subtotal, qty: 1, image: p.image }],
      subtotal,
      shipping,
      total,
    });
    msg.className = "form-msg success";
    msg.innerHTML = `✓ Order sent! Subtotal ${money(subtotal)} + Shipping ${money(shipping)} = <strong>${money(total)}</strong>.<br/>
      📬 You'll get a notification when the supplier replies.<br/>
      🪙 Payment is made in digital coins / cryptocurrency. 📦 Delivery is expected within 3–7 days.`;
    toast("Order sent — watch 📋 My Orders for the reply", "success");
    pointToOrders("Supplier replies will appear here", false);
    setTimeout(() => {
      document.getElementById("supplier-order-modal").classList.remove("open");
      e.target.reset();
      msg.textContent = "";
      pendingSupplierProduct = null;
    }, 3800);
  });

  // Notification polling — react to supplier status changes
  checkOrderNotifications();
  setInterval(checkOrderNotifications, 4000);
  window.addEventListener("storage", (ev) => {
    if (ev.key === "vm_supplier_orders") { checkOrderNotifications(); if (document.getElementById("orders-panel").classList.contains("open")) renderMyOrders(); }
  });


  // Modal close
  document.querySelectorAll(".modal").forEach((m) => {
    m.addEventListener("click", (e) => { if (e.target === m || e.target.hasAttribute("data-close")) m.classList.remove("open"); });
  });

  // Checkout submit
  document.getElementById("checkout-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const items = activeCheckoutItems || getCart();
    if (!items.length) return;
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const fd = new FormData(e.target);
    const name = (fd.get("name") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const card = (fd.get("card") || "").toString().replace(/\s+/g, "");
    const exp = (fd.get("exp") || "").toString();
    const cvc = (fd.get("cvc") || "").toString();
    const msg = document.getElementById("pay-msg");
    const btn = document.getElementById("pay-btn");

    if (!name || !email) { msg.className = "form-msg error"; msg.textContent = "Please enter your name and email."; return; }
    if (card.length < 12) { msg.className = "form-msg error"; msg.textContent = "Please enter a valid card number."; return; }
    if (!/^\d{2}\/\d{2}$/.test(exp)) { msg.className = "form-msg error"; msg.textContent = "Expiry must be MM/YY."; return; }
    if (cvc.length < 3) { msg.className = "form-msg error"; msg.textContent = "Invalid CVC."; return; }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Processing securely…';
    msg.className = "form-msg"; msg.textContent = "";

    try {
      const result = await window.processPay4WorkPayment({ amount: total, email, name, items });
      if (result.status === "success") {
        msg.className = "form-msg success";
        msg.textContent = "Payment successful · Ref " + result.reference;
        toast("Order confirmed! Thank you 💕", "success");
        // If the checkout used the cart, clear it
        if (activeCheckoutItems === null || activeCheckoutItems === getCart()) saveCart([]);
        else {
          // best-effort: if items array equals cart items, also clear
          const cart = getCart();
          if (JSON.stringify(cart) === JSON.stringify(items)) saveCart([]);
        }
        setTimeout(() => {
          document.getElementById("checkout-modal").classList.remove("open");
          e.target.reset();
          renderCart();
        }, 1600);
      } else {
        msg.className = "form-msg error";
        msg.textContent = result.message || "Payment failed.";
        toast("Payment failed", "error");
      }
    } catch (err) {
      msg.className = "form-msg error";
      msg.textContent = err.message || "Unexpected error.";
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Pay · ' + money(total);
    }
  });
});
