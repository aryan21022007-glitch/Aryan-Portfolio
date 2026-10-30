// ---------- Helpers ----------
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---------- Theme toggle (remembered) ----------
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
} catch (e) {}
$("#themeToggle").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Mobile menu ----------
const navLinks = $("#navLinks");
$("#menuToggle").addEventListener("click", () => navLinks.classList.toggle("open"));
$$("#navLinks a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

// ---------- Typing effect ----------
const words = ["Graphic Designer", "Brand Identity Creator", "UI Enthusiast", "CS Student"];
const typed = $("#typed");
let w = 0, c = 0, deleting = false;
function type() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (!deleting && c < word.length) { c++; return setTimeout(type, 90); }
  if (!deleting && c === word.length) { deleting = true; return setTimeout(type, 1400); }
  if (deleting && c > 0) { c--; return setTimeout(type, 45); }
  deleting = false; w = (w + 1) % words.length;
  setTimeout(type, 300);
}
type();

// ---------- Scroll reveal + skill bars + counters ----------
function animateCount(el) {
  const target = +el.dataset.target;
  let n = 0;
  const step = Math.max(1, Math.round(target / 40));
  const timer = setInterval(() => {
    n += step;
    if (n >= target) { n = target; clearInterval(timer); }
    el.textContent = n;
  }, 35);
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add("visible");
    $$(".fill", el).forEach(f => (f.style.width = f.dataset.level + "%"));
    $$(".num", el).forEach(animateCount);
    io.unobserve(el);
  });
}, { threshold: 0.15 });
$$(".reveal").forEach(el => io.observe(el));

// ---------- Project filters ----------
$$(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    $$("#projects .card").forEach(card => {
      card.classList.toggle("hide", f !== "all" && card.dataset.cat !== f);
    });
  });
});

// ---------- Nav state, active link, back-to-top ----------
const nav = $("#nav");
const toTop = $("#toTop");
const sections = $$("main section[id]");
function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 20);
  toTop.classList.toggle("show", window.scrollY > 500);
  let current = "home";
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
  $$("#navLinks a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------- Contact form (opens the visitor's email app) ----------
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();
  const msg = $("#formMsg");

  if (!name || !email || !message) {
    msg.className = "form-msg error";
    msg.textContent = "Please fill in all fields.";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.className = "form-msg error";
    msg.textContent = "Please enter a valid email address.";
    return;
  }

  const subject = encodeURIComponent("Portfolio enquiry from " + name);
  const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
  window.location.href = "mailto:anandagarwal260@gmail.com?subject=" + subject + "&body=" + body;
  msg.className = "form-msg ok";
  msg.textContent = "Opening your email app…";
  e.target.reset();
});

// ---------- Footer year ----------
$("#year").textContent = new Date().getFullYear();