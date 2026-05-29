// Velvet Muse — Welcome / Auth page logic
const ADMIN_EMAIL = "dayoadewusi@gmail.com";

// ============== TOAST ==============
function toast(msg, type) {
  const el = document.getElementById("toast");
  if (!el) return alert(msg);
  el.textContent = msg;
  el.className = "toast show " + (type || "");
  clearTimeout(window.__t);
  window.__t = setTimeout(() => (el.className = "toast"), 2600);
}
window.vmToast = toast;

// ============== AUTH HELPERS ==============
window.getUsers = function () {
  try { return JSON.parse(localStorage.getItem("vm_users") || "[]"); } catch (e) { return []; }
};
window.saveUsers = function (list) { localStorage.setItem("vm_users", JSON.stringify(list)); };
window.getCurrentUser = function () {
  try { return JSON.parse(localStorage.getItem("vm_user") || "null"); } catch (e) { return null; }
};
window.setCurrentUser = function (u) {
  if (u) localStorage.setItem("vm_user", JSON.stringify(u));
  else localStorage.removeItem("vm_user");
};
window.isAdminEmail = function (email) {
  return (email || "").trim().toLowerCase() === ADMIN_EMAIL;
};

// If already logged in, redirect into shop
(function autoRedirect() {
  const u = window.getCurrentUser();
  if (u && location.pathname.endsWith("/welcome.html")) {
    location.replace(window.isAdminEmail(u.email) ? "/admin.html" : "/shop.html");
  }
})();

// ============== AUTH TABS ==============
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".auth-tab");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      const tab = t.dataset.tab;
      if (tab === "login") { loginForm.hidden = false; signupForm.hidden = true; }
      else { loginForm.hidden = true; signupForm.hidden = false; }
    });
  });

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(loginForm);
      const email = (data.get("email") || "").toString().trim().toLowerCase();
      const password = (data.get("password") || "").toString();
      const msg = document.getElementById("login-msg");
      const users = window.getUsers();
      const found = users.find((u) => u.email === email && u.password === password);

      // Admin shortcut — allow admin login without prior signup
      if (window.isAdminEmail(email) && !found) {
        if (password.length < 4) {
          msg.className = "form-msg error"; msg.textContent = "Password too short."; return;
        }
        const adminUser = { name: "Admin", email, password, isAdmin: true };
        const next = users.filter((u) => u.email !== email).concat(adminUser);
        window.saveUsers(next);
        window.setCurrentUser(adminUser);
        msg.className = "form-msg success"; msg.textContent = "Welcome, Admin.";
        setTimeout(() => location.assign("/admin.html"), 500);
        return;
      }

      if (!found) {
        msg.className = "form-msg error";
        msg.textContent = "We couldn't find that account. Please check your details or create one.";
        return;
      }
      const isAdmin = window.isAdminEmail(found.email);
      window.setCurrentUser({ ...found, isAdmin });
      msg.className = "form-msg success"; msg.textContent = "Welcome back, " + found.name + ".";
      setTimeout(() => location.assign(isAdmin ? "/admin.html" : "/shop.html"), 500);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(signupForm);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim().toLowerCase();
      const password = (data.get("password") || "").toString();
      const msg = document.getElementById("signup-msg");

      if (!name || !email || password.length < 4) {
        msg.className = "form-msg error"; msg.textContent = "Please complete every field."; return;
      }
      const users = window.getUsers();
      if (users.some((u) => u.email === email)) {
        msg.className = "form-msg error";
        msg.textContent = "An account with that email already exists. Try signing in instead.";
        return;
      }
      const user = { name, email, password, isAdmin: window.isAdminEmail(email) };
      users.push(user);
      window.saveUsers(users);
      window.setCurrentUser(user);
      msg.className = "form-msg success"; msg.textContent = "Welcome to Velvet Muse, " + name + ".";
      setTimeout(() => location.assign(user.isAdmin ? "/admin.html" : "/shop.html"), 600);
    });
  }

  // Modals (privacy / terms)
  document.querySelectorAll("[data-open]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.dataset.open + "-modal";
      const m = document.getElementById(id);
      if (m) m.classList.add("open");
    });
  });
  document.querySelectorAll(".modal").forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target === m || e.target.hasAttribute("data-close")) m.classList.remove("open");
    });
  });
});
