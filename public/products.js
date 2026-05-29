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

window.getProducts = function () {
  try {
    const raw = localStorage.getItem("vm_products");
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
  } catch (e) {}
  return window.DEFAULT_PRODUCTS.slice();
};

window.saveProducts = function (list) {
  localStorage.setItem("vm_products", JSON.stringify(list));
};

window.resetProducts = function () {
  localStorage.removeItem("vm_products");
};
