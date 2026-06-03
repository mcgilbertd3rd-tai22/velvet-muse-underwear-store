// Velvet Muse — lightweight i18n
(function () {
  const DICT = {
    en: {
      "nav.story": "Our Story", "nav.reviews": "Reviews", "nav.faq": "FAQ", "nav.contact": "Contact",
      "nav.enter": "Enter Boutique", "nav.boutique": "Boutique",
      "auth.members": "Members Only", "auth.step": "Step into the boutique.",
      "auth.subtitle": "Create your account or sign in to access the private collection.",
      "auth.signin": "Sign In", "auth.create": "Create Account",
      "auth.email": "Email", "auth.password": "Password",
      "shop.title": "Today's curated edit",
      "shop.subtitle": "Hand-picked bras, panties and lingerie sets — refreshed weekly.",
      "shop.search": "Search lace, silk, sets…",
      "cat.all": "All", "cat.bras": "Bras", "cat.panties": "Panties",
      "cat.lingerie": "Lingerie Sets", "cat.underwear": "Underwear",
      "cart.title": "Your Bag", "cart.total": "Total", "cart.checkout": "Checkout Securely",
      "btn.addbag": "Add to Bag", "btn.buy": "Buy Now",
      "lang.title": "Choose your language", "lang.subtitle": "Select your preferred language for the boutique.",
      "lang.continue": "Continue",
    },
    es: {
      "nav.story": "Nuestra Historia", "nav.reviews": "Reseñas", "nav.faq": "FAQ", "nav.contact": "Contacto",
      "nav.enter": "Entrar a la Boutique", "nav.boutique": "Boutique",
      "auth.members": "Solo Miembros", "auth.step": "Entra en la boutique.",
      "auth.subtitle": "Crea tu cuenta o inicia sesión para acceder a la colección privada.",
      "auth.signin": "Iniciar Sesión", "auth.create": "Crear Cuenta",
      "auth.email": "Correo", "auth.password": "Contraseña",
      "shop.title": "Selección del día",
      "shop.subtitle": "Sujetadores, braguitas y conjuntos elegidos a mano — renovados cada semana.",
      "shop.search": "Buscar encaje, seda, conjuntos…",
      "cat.all": "Todo", "cat.bras": "Sujetadores", "cat.panties": "Braguitas",
      "cat.lingerie": "Conjuntos", "cat.underwear": "Ropa Interior",
      "cart.title": "Tu Bolsa", "cart.total": "Total", "cart.checkout": "Pagar de Forma Segura",
      "btn.addbag": "Añadir a la Bolsa", "btn.buy": "Comprar Ahora",
      "lang.title": "Elige tu idioma", "lang.subtitle": "Selecciona tu idioma preferido para la boutique.",
      "lang.continue": "Continuar",
    },
    it: {
      "nav.story": "La Nostra Storia", "nav.reviews": "Recensioni", "nav.faq": "FAQ", "nav.contact": "Contatti",
      "nav.enter": "Entra nella Boutique", "nav.boutique": "Boutique",
      "auth.members": "Solo Membri", "auth.step": "Entra nella boutique.",
      "auth.subtitle": "Crea il tuo account o accedi per esplorare la collezione privata.",
      "auth.signin": "Accedi", "auth.create": "Crea Account",
      "auth.email": "Email", "auth.password": "Password",
      "shop.title": "La selezione di oggi",
      "shop.subtitle": "Reggiseni, slip e completi scelti a mano — rinnovati ogni settimana.",
      "shop.search": "Cerca pizzo, seta, completi…",
      "cat.all": "Tutto", "cat.bras": "Reggiseni", "cat.panties": "Slip",
      "cat.lingerie": "Completi", "cat.underwear": "Intimo",
      "cart.title": "La Tua Borsa", "cart.total": "Totale", "cart.checkout": "Paga in Sicurezza",
      "btn.addbag": "Aggiungi alla Borsa", "btn.buy": "Acquista Ora",
      "lang.title": "Scegli la tua lingua", "lang.subtitle": "Seleziona la tua lingua preferita per la boutique.",
      "lang.continue": "Continua",
    },
    tr: {
      "nav.story": "Hikayemiz", "nav.reviews": "Yorumlar", "nav.faq": "SSS", "nav.contact": "İletişim",
      "nav.enter": "Butiğe Gir", "nav.boutique": "Butik",
      "auth.members": "Sadece Üyeler", "auth.step": "Butiğe adım at.",
      "auth.subtitle": "Özel koleksiyona erişmek için hesap oluştur veya giriş yap.",
      "auth.signin": "Giriş Yap", "auth.create": "Hesap Oluştur",
      "auth.email": "E-posta", "auth.password": "Şifre",
      "shop.title": "Bugünün özel seçkisi",
      "shop.subtitle": "Özenle seçilmiş sütyenler, külotlar ve iç çamaşırı takımları — her hafta yenilenir.",
      "shop.search": "Dantel, ipek, takım ara…",
      "cat.all": "Tümü", "cat.bras": "Sütyenler", "cat.panties": "Külotlar",
      "cat.lingerie": "Takımlar", "cat.underwear": "İç Çamaşırı",
      "cart.title": "Çantanız", "cart.total": "Toplam", "cart.checkout": "Güvenli Ödeme",
      "btn.addbag": "Çantaya Ekle", "btn.buy": "Hemen Al",
      "lang.title": "Dilinizi seçin", "lang.subtitle": "Butik için tercih ettiğiniz dili seçin.",
      "lang.continue": "Devam",
    },
  };

  const LANGS = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "it", label: "Italiano", flag: "🇮🇹" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  ];

  function getLang() {
    const l = localStorage.getItem("vm_lang");
    return DICT[l] ? l : "en";
  }
  function setLang(l) {
    if (DICT[l]) localStorage.setItem("vm_lang", l);
  }
  function t(key) {
    const l = getLang();
    return (DICT[l] && DICT[l][key]) || DICT.en[key] || key;
  }
  function applyTranslations(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    scope.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.setAttribute("placeholder", t(el.dataset.i18nPh)); });
    document.documentElement.lang = getLang();
  }

  function ensureModal() {
    let m = document.getElementById("lang-modal");
    if (m) return m;
    m = document.createElement("div");
    m.className = "modal lang-slide";
    m.id = "lang-modal";
    m.innerHTML = `
      <div class="modal-content lang-slide-content">
        <h3 data-i18n="lang.title" style="margin:0 0 4px;font-size:1.15rem;">Choose your language</h3>
        <p style="color: var(--ink-soft); font-size: 0.85rem; margin:0 0 14px;" data-i18n="lang.subtitle">Select your preferred language for the boutique.</p>
        <div class="lang-grid" style="display:flex;flex-direction:column;gap:8px;">
          ${LANGS.map((L) => `
            <button type="button" class="lang-opt btn btn-outline" data-lang="${L.code}" style="display:flex;align-items:center;gap:10px;justify-content:flex-start;padding:10px 12px;font-size:0.95rem;">
              <span style="font-size:1.2rem;">${L.flag}</span><span>${L.label}</span>
            </button>`).join("")}
        </div>
      </div>`;
    document.body.appendChild(m);
    m.querySelectorAll(".lang-opt").forEach((b) => {
      b.addEventListener("click", () => {
        setLang(b.dataset.lang);
        applyTranslations();
        m.classList.remove("open");
        if (typeof window.__onLangChosen === "function") {
          const cb = window.__onLangChosen;
          window.__onLangChosen = null;
          cb(b.dataset.lang);
        }
      });
    });
    return m;
  }

  function openLanguagePicker(cb) {
    const m = ensureModal();
    window.__onLangChosen = cb || null;
    m.classList.add("open");
  }

  window.vmI18n = { t, getLang, setLang, applyTranslations, openLanguagePicker, LANGS };

  document.addEventListener("DOMContentLoaded", () => { ensureModal(); applyTranslations(); });
})();
