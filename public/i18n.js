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
      "btn.addbag": "Add to Bag", "btn.buy": "Buy Now", "btn.order": "Order Now",
      "lang.title": "Choose your language", "lang.subtitle": "Select your preferred language for the boutique.",
      "lang.continue": "Continue",
      "tips.top": "💡 Tip: every <strong>Supplier</strong> on Velvet Muse is <strong>verified ✓</strong>. Items from Suppliers are often cheaper than the Personal Collection — look for the ★ tag.",
      "tips.footer": "🪙 <strong>Payments</strong> — both <strong>Suppliers</strong> and the <strong>Personal Collection</strong> receive payment in <strong>digital coins / cryptocurrency</strong>. 📦 Orders arrive in <strong>3–7 days</strong>. ✓ Every supplier is verified.",
      "sup.eyebrow": "Order direct from supplier",
      "sup.shipping": "Shipping details",
      "sup.note": "The supplier will confirm stock and send you payment instructions shortly.",
      "sup.fullname": "Full Name", "sup.email": "Email", "sup.phone": "Phone", "sup.address": "Shipping Address",
      "sup.send": "Send order to supplier",
      "ord.subtotal": "Subtotal", "ord.shipping": "Shipping", "ord.total": "Total",
      "ord.cryptoDelivery": "🪙 Paid in crypto · 📦 Delivery in 3–7 days",
      "ord.cryptoNotice": "🪙 All payments on Velvet Muse — both Suppliers and Personal Collection — are settled in <strong>digital coins / cryptocurrency</strong>.",
      "ord.deliveryNotice": "📦 Orders are typically delivered within <strong>3–7 days</strong>.",
      "ord.tipsTitle": "Tips",
      "ord.tip1": "Every supplier on Velvet Muse is verified ✓.",
      "ord.tip2": "Payments are made with digital coins / cryptocurrency.",
      "ord.tip3": "Orders are expected to arrive within 3–7 days.",
      "ord.replyHere": "Tap here for supplier replies",
      "search.title": "Browse categories",
      "search.subtitle": "Pick a collection or search by keyword.",
      "search.back": "← Back to Boutique",
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
      "btn.addbag": "Añadir a la Bolsa", "btn.buy": "Comprar Ahora", "btn.order": "Pedir Ahora",
      "lang.title": "Elige tu idioma", "lang.subtitle": "Selecciona tu idioma preferido para la boutique.",
      "lang.continue": "Continuar",
      "tips.top": "💡 Consejo: cada <strong>Proveedor</strong> en Velvet Muse está <strong>verificado ✓</strong>. Los artículos de Proveedores suelen ser más baratos que la Colección Personal — busca la etiqueta ★.",
      "tips.footer": "🪙 <strong>Pagos</strong> — tanto los <strong>Proveedores</strong> como la <strong>Colección Personal</strong> reciben pago en <strong>monedas digitales / criptomonedas</strong>. 📦 Los pedidos llegan en <strong>3–7 días</strong>. ✓ Cada proveedor está verificado.",
      "sup.eyebrow": "Pide directamente al proveedor",
      "sup.shipping": "Datos de envío",
      "sup.note": "El proveedor confirmará el stock y te enviará las instrucciones de pago en breve.",
      "sup.fullname": "Nombre completo", "sup.email": "Correo", "sup.phone": "Teléfono", "sup.address": "Dirección de envío",
      "sup.send": "Enviar pedido al proveedor",
      "ord.subtotal": "Subtotal", "ord.shipping": "Envío", "ord.total": "Total",
      "ord.cryptoDelivery": "🪙 Pago en cripto · 📦 Entrega en 3–7 días",
      "ord.cryptoNotice": "🪙 Todos los pagos en Velvet Muse — Proveedores y Colección Personal — se hacen en <strong>monedas digitales / criptomonedas</strong>.",
      "ord.deliveryNotice": "📦 Los pedidos normalmente se entregan en <strong>3–7 días</strong>.",
      "ord.tipsTitle": "Consejos",
      "ord.tip1": "Cada proveedor en Velvet Muse está verificado ✓.",
      "ord.tip2": "Los pagos se hacen con monedas digitales / criptomonedas.",
      "ord.tip3": "Se espera que los pedidos lleguen en 3–7 días.",
      "ord.replyHere": "Toca aquí para ver respuestas",
      "search.title": "Explorar categorías",
      "search.subtitle": "Elige una colección o busca por palabra clave.",
      "search.back": "← Volver a la Boutique",
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
      "tips.top": "💡 Suggerimento: ogni <strong>Fornitore</strong> su Velvet Muse è <strong>verificato ✓</strong>. Gli articoli dei Fornitori sono spesso più economici della Collezione Personale — cerca l'etichetta ★.",
      "tips.footer": "🪙 <strong>Pagamenti</strong> — sia i <strong>Fornitori</strong> sia la <strong>Collezione Personale</strong> ricevono pagamenti in <strong>monete digitali / criptovalute</strong>. 📦 Gli ordini arrivano in <strong>3–7 giorni</strong>. ✓ Ogni fornitore è verificato.",
      "sup.eyebrow": "Ordina direttamente dal fornitore",
      "sup.shipping": "Dati di spedizione",
      "sup.note": "Il fornitore confermerà la disponibilità e ti invierà le istruzioni di pagamento a breve.",
      "sup.fullname": "Nome completo", "sup.email": "Email", "sup.phone": "Telefono", "sup.address": "Indirizzo di spedizione",
      "sup.send": "Invia ordine al fornitore",
      "ord.subtotal": "Subtotale", "ord.shipping": "Spedizione", "ord.total": "Totale",
      "ord.cryptoDelivery": "🪙 Pagato in cripto · 📦 Consegna in 3–7 giorni",
      "ord.cryptoNotice": "🪙 Tutti i pagamenti su Velvet Muse — Fornitori e Collezione Personale — vengono effettuati in <strong>monete digitali / criptovalute</strong>.",
      "ord.deliveryNotice": "📦 Gli ordini vengono solitamente consegnati entro <strong>3–7 giorni</strong>.",
      "ord.tipsTitle": "Consigli",
      "ord.tip1": "Ogni fornitore su Velvet Muse è verificato ✓.",
      "ord.tip2": "I pagamenti si effettuano con monete digitali / criptovalute.",
      "ord.tip3": "Gli ordini arrivano in 3–7 giorni.",
      "ord.replyHere": "Tocca qui per le risposte",
      "search.title": "Sfoglia le categorie",
      "search.subtitle": "Scegli una collezione o cerca per parola chiave.",
      "search.back": "← Torna alla Boutique",
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
      "tips.top": "💡 İpucu: Velvet Muse'daki her <strong>Tedarikçi</strong> <strong>doğrulanmıştır ✓</strong>. Tedarikçi ürünleri genellikle Kişisel Koleksiyondan daha ucuzdur — ★ etiketini arayın.",
      "tips.footer": "🪙 <strong>Ödemeler</strong> — hem <strong>Tedarikçiler</strong> hem de <strong>Kişisel Koleksiyon</strong> ödemeleri <strong>dijital kripto para</strong> ile alır. 📦 Siparişler <strong>3–7 gün</strong> içinde ulaşır. ✓ Her tedarikçi doğrulanmıştır.",
      "sup.eyebrow": "Tedarikçiden doğrudan sipariş ver",
      "sup.shipping": "Teslimat bilgileri",
      "sup.note": "Tedarikçi stok durumunu onaylayıp ödeme talimatlarını kısa süre içinde gönderecek.",
      "sup.fullname": "Ad Soyad", "sup.email": "E-posta", "sup.phone": "Telefon", "sup.address": "Teslimat Adresi",
      "sup.send": "Siparişi tedarikçiye gönder",
      "ord.subtotal": "Ara toplam", "ord.shipping": "Kargo", "ord.total": "Toplam",
      "ord.cryptoDelivery": "🪙 Kripto ile ödenir · 📦 3–7 gün içinde teslimat",
      "ord.cryptoNotice": "🪙 Velvet Muse'daki tüm ödemeler — Tedarikçiler ve Kişisel Koleksiyon — <strong>dijital kripto para</strong> ile yapılır.",
      "ord.deliveryNotice": "📦 Siparişler genellikle <strong>3–7 gün</strong> içinde teslim edilir.",
      "ord.tipsTitle": "İpuçları",
      "ord.tip1": "Velvet Muse'daki her tedarikçi doğrulanmıştır ✓.",
      "ord.tip2": "Ödemeler dijital kripto para ile yapılır.",
      "ord.tip3": "Siparişlerin 3–7 gün içinde gelmesi beklenir.",
      "ord.replyHere": "Tedarikçi yanıtları için buraya dokunun",
      "search.title": "Kategorilere göz at",
      "search.subtitle": "Bir koleksiyon seç veya anahtar kelimeyle ara.",
      "search.back": "← Butiğe Dön",
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
    scope.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
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
