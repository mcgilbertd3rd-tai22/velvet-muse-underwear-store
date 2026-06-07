// Velvet Muse — Admin dashboard logic (with suppliers)
const ADMIN_EMAIL = "dayoadewusi08@gmail.com";

function toast(msg, type) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast show " + (type || "");
  clearTimeout(window.__t);
  window.__t = setTimeout(() => (el.className = "toast"), 2400);
}

function getCurrentUser() { try { return JSON.parse(localStorage.getItem("vm_user") || "null"); } catch (e) { return null; } }
function setCurrentUser(u) { if (u) localStorage.setItem("vm_user", JSON.stringify(u)); else localStorage.removeItem("vm_user"); }

const user = getCurrentUser();
if (!user) location.replace("/welcome.html");
else if ((user.email || "").toLowerCase() !== ADMIN_EMAIL) {
  alert("Admin access only.");
  location.replace("/shop.html");
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function money(n) { return "$" + Number(n).toFixed(2); }
function orderMoney(o) {
  const itemSubtotal = (o.items || []).reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);
  const subtotal = Number(o.subtotal || itemSubtotal || 0);
  const shipping = Number(o.shipping || 0) > 0 ? Number(o.shipping) : Number(window.SHIPPING_FEE || 10);
  const storedTotal = Number(o.total || 0);
  const total = storedTotal >= subtotal + shipping ? storedTotal : +(subtotal + shipping).toFixed(2);
  return { subtotal, shipping, total };
}

// active collection: { type: 'personal' } or { type: 'supplier', id, name }
let active = { type: "personal" };

function loadActiveProducts() {
  if (active.type === "personal") return window.getProducts();
  const s = window.getSupplier(active.id);
  return s ? (s.products || []) : [];
}
function saveActiveProducts(list) {
  if (active.type === "personal") window.saveProducts(list);
  else window.saveSupplierProducts(active.id, list);
}

function renderSuppliers() {
  const wrap = document.getElementById("supplier-list");
  const suppliers = window.getSuppliers();
  if (!suppliers.length) {
    wrap.innerHTML = '<p style="font-size:.72rem;color:var(--muted);">No suppliers yet.</p>';
  } else {
    wrap.innerHTML = suppliers.map((s) => {
      const count = (s.products || []).length;
      const isActive = active.type === "supplier" && active.id === s.id;
      return `
      <div class="admin-row" style="padding:6px 8px;${isActive ? "outline:2px solid var(--rose-gold);" : ""}">
        <div class="admin-row-info" style="cursor:pointer;" data-open="${s.id}">
          <h4>${escapeHtml(s.name)}</h4>
          <span>${count} product${count === 1 ? "" : "s"}</span>
        </div>
        <div class="admin-row-actions">
          <button title="Delete supplier" data-delsup="${s.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
          </button>
        </div>
      </div>`;
    }).join("");
    wrap.querySelectorAll("[data-open]").forEach((b) =>
      b.addEventListener("click", () => {
        const s = window.getSupplier(b.dataset.open);
        if (!s) return;
        active = { type: "supplier", id: s.id, name: s.name };
        resetForm();
        renderAll();
      })
    );
    wrap.querySelectorAll("[data-delsup]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!confirm("Delete this supplier and all their products?")) return;
        const id = b.dataset.delsup;
        window.deleteSupplier(id);
        if (active.type === "supplier" && active.id === id) active = { type: "personal" };
        toast("Supplier deleted");
        renderAll();
      })
    );
  }

  // Highlight personal button
  const personalBtn = document.getElementById("select-personal");
  if (personalBtn) {
    personalBtn.style.background = active.type === "personal" ? "var(--rose-gold)" : "transparent";
    personalBtn.style.color = active.type === "personal" ? "#fff" : "var(--rose-gold)";
  }

  // Active collection label
  const label = document.getElementById("active-collection");
  if (label) label.textContent = "Editing: " + (active.type === "personal" ? "Personal" : active.name);

  // Title hint for product form
  const ft = document.getElementById("form-title");
  if (ft && !document.querySelector('#product-form input[name="id"]').value) {
    ft.textContent = "Add Product · " + (active.type === "personal" ? "Personal" : active.name);
  }
}

function renderTable() {
  const list = loadActiveProducts();
  const table = document.getElementById("table");
  document.getElementById("count").textContent = list.length + " items";

  if (!list.length) {
    table.innerHTML = '<p style="color: var(--muted); text-align: center; padding: 20px;">No products yet — add your first one.</p>';
    return;
  }

  table.innerHTML = list.map((p) => `
    <div class="admin-row">
      <img src="${p.image}" alt="" onerror="this.style.opacity=0" />
      <div class="admin-row-info">
        <h4>${escapeHtml(p.name)}</h4>
        <span>${escapeHtml(p.category)} · ${money(p.price)}${p.discount ? ` · −${p.discount}%` : ""} · ★ ${(p.rating || 0).toFixed(1)}</span>
      </div>
      <div class="admin-row-actions">
        <button title="Edit" data-edit="${p.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button title="Delete" data-del="${p.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>`).join("");

  table.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => startEdit(b.dataset.edit)));
  table.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => deleteProduct(b.dataset.del)));
}

function renderSupplierPayment() {
  const wrap = document.getElementById("supplier-payment-wrap");
  if (!wrap) return;
  if (active.type !== "supplier") { wrap.hidden = true; return; }
  const s = window.getSupplier(active.id);
  if (!s) { wrap.hidden = true; return; }
  wrap.hidden = false;
  document.getElementById("sp-name").textContent = s.name;
  document.getElementById("supplier-payment").value = s.paymentInstructions || "";
}

function renderOrders() {
  const wrap = document.getElementById("orders-list");
  if (!wrap) return;
  const orders = window.getSupplierOrders();
  if (!orders.length) {
    wrap.innerHTML = '<p style="font-size:.78rem;color:var(--muted);">No supplier orders yet.</p>';
    return;
  }
  const statusColor = {
    pending_confirmation: "#b45309",
    awaiting_payment: "#0369a1",
    paid: "#15803d",
    rejected: "#b91c1c",
  };
  const statusLabel = {
    pending_confirmation: "Pending confirmation",
    awaiting_payment: "Awaiting payment",
    receipt_submitted: "Receipt submitted",
    paid: "Paid",
    rejected: "Rejected",
  };
  const statusColor2 = { ...statusColor, receipt_submitted: "#7c3aed" };
  wrap.innerHTML = orders.map((o) => {
    const itemsHtml = (o.items || []).map((i) => `<div style="font-size:.75rem;">• ${escapeHtml(i.name)} × ${i.qty} — ${money(i.price * i.qty)}</div>`).join("");
    const sup = window.getSupplier(o.supplierId);
    const defaultInstr = (sup && sup.paymentInstructions) || "";
    const totals = orderMoney(o);
    return `
    <div style="border:1px solid var(--line);border-radius:10px;padding:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
        <div>
          <strong style="font-size:.85rem;">${escapeHtml(o.supplierName || "Supplier")}</strong>
          <span style="font-size:.7rem;color:var(--muted);"> · ${o.id}</span>
        </div>
        <span style="font-size:.7rem;font-weight:600;color:${statusColor2[o.status] || "#555"};">${statusLabel[o.status] || o.status}</span>
      </div>
      <div style="margin-top:6px;font-size:.75rem;color:var(--ink-soft);">
        <div>👤 ${escapeHtml(o.customerName)} · ${escapeHtml(o.customerEmail)}${o.customerPhone ? " · " + escapeHtml(o.customerPhone) : ""}</div>
        <div>📦 ${escapeHtml(o.shippingAddress)}</div>
      </div>
      <div style="margin-top:6px;">${itemsHtml}</div>
      <div style="font-size:.72rem;color:var(--muted);">Subtotal: ${money(totals.subtotal)}</div>
      <div style="font-size:.72rem;color:var(--muted);">Shipping fee: ${money(totals.shipping)}</div>
      <div style="margin-top:4px;font-size:.78rem;"><strong>Total before payment: ${money(totals.total)}</strong></div>

      ${o.status === "pending_confirmation" ? `
        <div style="margin-top:10px;">
          <label style="font-size:.72rem;font-weight:600;display:block;margin-bottom:4px;">Payment instructions to send (crypto wallet / coin)</label>
          <textarea data-instr="${o.id}" rows="2" style="width:100%;padding:6px;font-size:.75rem;border:1px solid var(--line);border-radius:6px;font-family:inherit;">${escapeHtml(o.paymentInstructions || defaultInstr)}</textarea>
          <div style="display:flex;gap:6px;margin-top:6px;">
            <button class="btn btn-primary btn-sm" data-confirm="${o.id}" style="flex:1;">✓ Confirm stock &amp; send</button>
            <button class="btn btn-outline btn-sm" data-reject="${o.id}">✗ Reject</button>
          </div>
        </div>
      ` : o.status === "awaiting_payment" ? `
        <div style="margin-top:8px;padding:8px;background:#f0f9ff;border-radius:6px;font-size:.72rem;white-space:pre-wrap;">${escapeHtml(o.paymentInstructions || "")}</div>
        <div style="margin-top:6px;font-size:.7rem;color:var(--muted);">Waiting for customer to submit receipt…</div>
      ` : o.status === "receipt_submitted" ? `
        <div style="margin-top:8px;padding:8px;background:#f5f3ff;border-radius:6px;font-size:.72rem;">
          <strong>🧾 Customer submitted receipt</strong>
          ${o.receipt ? `<div style="margin-top:6px;"><a href="${o.receipt}" target="_blank"><img src="${o.receipt}" alt="receipt" style="max-width:160px;border-radius:6px;border:1px solid var(--line);"/></a></div>` : '<div style="margin-top:6px;color:var(--muted);">(no image attached)</div>'}
        </div>
        <button class="btn btn-primary btn-sm btn-block" data-mark-paid="${o.id}" style="margin-top:6px;">✓ Confirm payment received</button>
      ` : o.status === "paid" ? `
        <div style="margin-top:6px;font-size:.72rem;color:#15803d;">✓ Payment confirmed</div>
        <button class="btn btn-outline btn-sm btn-block" data-del-order="${o.id}" style="margin-top:8px;color:#b91c1c;border-color:#fecaca;">🗑 Delete order</button>
      ` : ""}
    </div>`;
  }).join("");

  wrap.querySelectorAll("[data-confirm]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.confirm;
    const ta = wrap.querySelector(`[data-instr="${id}"]`);
    const instr = (ta && ta.value || "").trim();
    if (!instr) { toast("Enter payment instructions first", "error"); return; }
    window.updateSupplierOrder(id, { status: "awaiting_payment", paymentInstructions: instr });
    toast("Sent to customer", "success");
    renderOrders();
  }));
  wrap.querySelectorAll("[data-reject]").forEach((b) => b.addEventListener("click", () => {
    if (!confirm("Reject this order (out of stock)?")) return;
    window.updateSupplierOrder(b.dataset.reject, { status: "rejected" });
    renderOrders();
  }));
  wrap.querySelectorAll("[data-mark-paid]").forEach((b) => b.addEventListener("click", () => {
    window.updateSupplierOrder(b.dataset["markPaid"], { status: "paid" });
    toast("Payment confirmed", "success");
    renderOrders();
  }));
  wrap.querySelectorAll("[data-del-order]").forEach((b) => b.addEventListener("click", () => {
    if (!confirm("Delete this paid order? This cannot be undone.")) return;
    window.deleteSupplierOrder(b.dataset["delOrder"]);
    toast("Order deleted");
    renderOrders();
  }));
}

function renderAll() { renderSuppliers(); renderSupplierPayment(); renderTable(); renderOrders(); }

function setPreview(src) {
  const wrap = document.getElementById("image-preview");
  const img = document.getElementById("image-preview-img");
  if (src) { img.src = src; wrap.hidden = false; }
  else { img.removeAttribute("src"); wrap.hidden = true; }
}

function startEdit(id) {
  const p = loadActiveProducts().find((x) => x.id === id);
  if (!p) return;
  const f = document.getElementById("product-form");
  f.elements.id.value = p.id;
  f.elements.name.value = p.name;
  f.elements.category.value = p.category;
  f.elements.price.value = p.price;
  f.elements.discount.value = p.discount || 0;
  f.elements.rating.value = p.rating || 5;
  f.elements.image.value = p.image;
  setPreview(p.image);
  document.getElementById("form-title").textContent = "Edit Product";
  document.getElementById("save-btn").textContent = "Update Product";
  document.getElementById("cancel-btn").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  const f = document.getElementById("product-form");
  f.reset();
  f.elements.id.value = "";
  f.elements.discount.value = 0;
  f.elements.rating.value = 5;
  document.getElementById("form-title").textContent = "Add Product · " + (active.type === "personal" ? "Personal" : active.name);
  document.getElementById("save-btn").textContent = "Save Product";
  document.getElementById("cancel-btn").hidden = true;
  document.getElementById("form-msg").className = "form-msg";
  document.getElementById("form-msg").textContent = "";
  const fileInput = document.getElementById("image-file");
  if (fileInput) fileInput.value = "";
  setPreview("");
}

function deleteProduct(id) {
  if (!confirm("Delete this product? This cannot be undone.")) return;
  const list = loadActiveProducts().filter((p) => p.id !== id);
  saveActiveProducts(list);
  toast("Product deleted");
  renderAll();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();

  document.getElementById("select-personal").addEventListener("click", () => {
    active = { type: "personal" };
    resetForm();
    renderAll();
  });

  document.getElementById("supplier-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = (fd.get("name") || "").toString().trim();
    if (!name) return;
    const id = window.addSupplier(name);
    e.target.reset();
    active = { type: "supplier", id, name };
    resetForm();
    renderAll();
    toast("Supplier added", "success");
  });

  document.getElementById("image-file").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast("Image too large (max 5MB)", "error"); e.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const max = 900;
        const ratio = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * ratio), h = Math.round(img.height * ratio);
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        const dataUrl = c.toDataURL("image/jpeg", 0.82);
        document.querySelector('#product-form input[name="image"]').value = dataUrl;
        setPreview(dataUrl);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("image-clear").addEventListener("click", () => {
    document.querySelector('#product-form input[name="image"]').value = "";
    document.getElementById("image-file").value = "";
    setPreview("");
  });

  document.getElementById("product-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const fd = new FormData(f);
    const id = fd.get("id") || ("p" + Date.now().toString(36));
    const name = (fd.get("name") || "").toString().trim();
    const category = (fd.get("category") || "").toString();
    const price = parseFloat(fd.get("price") || "0");
    const discount = Math.max(0, Math.min(90, parseInt(fd.get("discount") || "0", 10) || 0));
    const rating = Math.max(0, Math.min(5, parseFloat(fd.get("rating") || "0")));
    const image = (fd.get("image") || "").toString().trim();
    const allowed = ["bras", "panties", "lingerie", "underwear"];
    const msg = document.getElementById("form-msg");

    if (!name) { msg.className = "form-msg error"; msg.textContent = "Product name is required."; return; }
    if (!image) { msg.className = "form-msg error"; msg.textContent = "Please upload a product photo."; return; }
    if (!allowed.includes(category)) { msg.className = "form-msg error"; msg.textContent = "Category must be bras, panties, lingerie or underwear."; return; }
    if (!(price >= 15)) { msg.className = "form-msg error"; msg.textContent = "Minimum price is $15 USD."; return; }

    const list = loadActiveProducts();
    const idx = list.findIndex((p) => p.id === id);
    const next = { id, name, category, price: +price.toFixed(2), discount, rating: +rating.toFixed(1), image };
    if (idx >= 0) list[idx] = next; else list.push(next);
    try {
      saveActiveProducts(list);
    } catch (err) {
      msg.className = "form-msg error"; msg.textContent = "Storage full — try a smaller photo."; return;
    }

    msg.className = "form-msg success";
    msg.textContent = idx >= 0 ? "Product updated." : "Product added.";
    toast(idx >= 0 ? "Product updated" : "Product added", "success");
    resetForm();
    renderAll();
  });

  document.getElementById("cancel-btn").addEventListener("click", resetForm);

  document.getElementById("supplier-payment-save").addEventListener("click", () => {
    if (active.type !== "supplier") return;
    const val = document.getElementById("supplier-payment").value;
    window.saveSupplierPayment(active.id, val);
    toast("Payment instructions saved", "success");
    renderOrders();
  });
});
