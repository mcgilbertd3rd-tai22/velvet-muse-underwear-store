// Velvet Muse — Admin dashboard logic
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

// Gate — admin only
const user = getCurrentUser();
if (!user) location.replace("/welcome.html");
else if ((user.email || "").toLowerCase() !== ADMIN_EMAIL) {
  alert("Admin access only.");
  location.replace("/shop.html");
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function money(n) { return "$" + Number(n).toFixed(2); }

function renderTable() {
  const list = window.getProducts();
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

function startEdit(id) {
  const list = window.getProducts();
  const p = list.find((x) => x.id === id);
  if (!p) return;
  const f = document.getElementById("product-form");
  f.elements.id.value = p.id;
  f.elements.name.value = p.name;
  f.elements.category.value = p.category;
  f.elements.price.value = p.price;
  f.elements.discount.value = p.discount || 0;
  f.elements.rating.value = p.rating || 5;
  f.elements.image.value = p.image;
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
  document.getElementById("form-title").textContent = "Add a Product";
  document.getElementById("save-btn").textContent = "Save Product";
  document.getElementById("cancel-btn").hidden = true;
  document.getElementById("form-msg").className = "form-msg";
  document.getElementById("form-msg").textContent = "";
}

function deleteProduct(id) {
  if (!confirm("Delete this product? This cannot be undone.")) return;
  const list = window.getProducts().filter((p) => p.id !== id);
  window.saveProducts(list);
  toast("Product deleted");
  renderTable();
}

document.addEventListener("DOMContentLoaded", () => {
  renderTable();

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

    if (!name || !image) { msg.className = "form-msg error"; msg.textContent = "Name and image URL are required."; return; }
    if (!allowed.includes(category)) { msg.className = "form-msg error"; msg.textContent = "Category must be bras, panties, lingerie or underwear."; return; }
    if (!(price >= 15)) { msg.className = "form-msg error"; msg.textContent = "Minimum price is $15 USD."; return; }

    const list = window.getProducts();
    const idx = list.findIndex((p) => p.id === id);
    const next = { id, name, category, price: +price.toFixed(2), discount, rating: +rating.toFixed(1), image };
    if (idx >= 0) list[idx] = next; else list.push(next);
    window.saveProducts(list);

    msg.className = "form-msg success";
    msg.textContent = idx >= 0 ? "Product updated." : "Product added.";
    toast(idx >= 0 ? "Product updated" : "Product added", "success");
    resetForm();
    renderTable();
  });

  document.getElementById("cancel-btn").addEventListener("click", resetForm);

  document.getElementById("reset-btn").addEventListener("click", () => {
    if (!confirm("Reset catalog to the default Velvet Muse collection?")) return;
    window.resetProducts();
    toast("Catalog reset");
    renderTable();
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    setCurrentUser(null);
    location.replace("/welcome.html");
  });
});
