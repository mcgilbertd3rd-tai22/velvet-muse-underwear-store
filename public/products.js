// Velvet Muse — default product catalog (bras, panties, lingerie sets, underwear)
window.DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "Soir Lace Bralette",
    category: "bras",
    price: 68,
    discount: 15,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=800&q=80",
  },
  {
    id: "p2",
    name: "Velvet Rose Set",
    category: "lingerie",
    price: 142,
    discount: 0,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=800&q=80",
  },
  {
    id: "p3",
    name: "Silk Whisper Brief",
    category: "panties",
    price: 32,
    discount: 0,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=800&q=80",
  },
  {
    id: "p4",
    name: "Champagne Demi Bra",
    category: "bras",
    price: 78,
    discount: 20,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571907483086-3c8f76135ada?w=800&q=80",
  },
  {
    id: "p5",
    name: "Noir Mesh Set",
    category: "lingerie",
    price: 168,
    discount: 10,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80",
  },
  {
    id: "p6",
    name: "Blush Cotton Brief",
    category: "underwear",
    price: 24,
    discount: 0,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800&q=80",
  },
  {
    id: "p7",
    name: "Ivory Lace Thong",
    category: "panties",
    price: 28,
    discount: 0,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
  },
  {
    id: "p8",
    name: "Rosé Satin Babydoll",
    category: "lingerie",
    price: 124,
    discount: 25,
    rating: 4.95,
    image: "https://images.unsplash.com/photo-1583846552345-d27f3a40f2f8?w=800&q=80",
  },
];

window.PRODUCT_CATEGORIES = ["bras", "panties", "lingerie", "underwear"];

window.getProducts = async function () {
  const { data, error } =
    await window.supabase
      .from("products")
      .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
};

window.saveProducts = async function (list) {

  const { error } =
    await window.supabase
      .from("products")
      .upsert(list);

  if (error)
    console.error(error);

};

window.resetProducts = function () {
  localStorage.removeItem("vm_products");
};

// ============== Suppliers ==============
window.getSuppliers = function () {
  try {
    const raw = localStorage.getItem("vm_suppliers");
    if (raw) { const list = JSON.parse(raw); if (Array.isArray(list)) return list; }
  } catch (e) {}
  return [];
};
window.saveSuppliers = function (list) { localStorage.setItem("vm_suppliers", JSON.stringify(list)); };
window.addSupplier = function (name) {
  const list = window.getSuppliers();
  const id = "s" + Date.now().toString(36);
  list.push({ id, name: String(name || "").trim() || "Supplier", products: [], paymentInstructions: "" });
  window.saveSuppliers(list);
  return id;
};
window.deleteSupplier = function (id) {
  window.saveSuppliers(window.getSuppliers().filter((s) => s.id !== id));
};
window.getSupplier = function (id) { return window.getSuppliers().find((s) => s.id === id) || null; };
window.saveSupplierProducts = function (id, products) {
  const list = window.getSuppliers();
  const idx = list.findIndex((s) => s.id === id);
  if (idx < 0) return;
  list[idx].products = products;
  window.saveSuppliers(list);
};
window.saveSupplierPayment = function (id, instructions) {
  const list = window.getSuppliers();
  const idx = list.findIndex((s) => s.id === id);
  if (idx < 0) return;
  list[idx].paymentInstructions = String(instructions || "");
  window.saveSuppliers(list);
};

// ============== Supplier Orders (tickets) ==============
// status: pending_confirmation | awaiting_payment | receipt_submitted | paid | rejected
window.getSupplierOrders = function () {
  try {
    const raw = localStorage.getItem("vm_supplier_orders");
    if (raw) { const list = JSON.parse(raw); if (Array.isArray(list)) return list; }
  } catch (e) {}
  return [];
};
window.saveSupplierOrders = function (list) {
  localStorage.setItem("vm_supplier_orders", JSON.stringify(list));
};
window.addSupplierOrder = function (order) {
  const list = window.getSupplierOrders();
  const id = "ord_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const subtotal = Number(order.subtotal ?? (order.items || []).reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0));
  const shipping = Number(order.shipping ?? window.SHIPPING_FEE ?? 10);
  const total = +(subtotal + shipping).toFixed(2);
  const ticket = {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending_confirmation",
    paymentInstructions: "",
    ...order,
    subtotal,
    shipping,
    total,
  };
  list.unshift(ticket);
  window.saveSupplierOrders(list);
  return ticket;
};
window.updateSupplierOrder = function (id, patch) {
  const list = window.getSupplierOrders();
  const idx = list.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  window.saveSupplierOrders(list);
  return list[idx];
};
window.deleteSupplierOrder = function (id) {
  window.saveSupplierOrders(window.getSupplierOrders().filter((o) => o.id !== id));
};

// Flat shipping fee applied before payment
window.SHIPPING_FEE = 10;

// Unified marketplace feed — each item tagged with origin
window.getAllProducts = function () {
  const personal =
await window.getProducts().map((p) => ({
    ...p, _source: { type: "personal", label: "Personal Collection" },
  }));
  const supplierItems = [];
  window.getSuppliers().forEach((s) => {
    (s.products || []).forEach((p) => {
      supplierItems.push({
        ...p,
        id: "sup_" + s.id + "_" + p.id,
        _source: { type: "supplier", supplierId: s.id, supplierName: s.name, label: s.name },
      });
    });
  });
  return personal.concat(supplierItems);
};
