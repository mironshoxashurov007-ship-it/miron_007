const ADMIN_KEY = "mironuz-admin-v1";
const API_STATE_PATH = "/api/state";
const DEFAULT_PASSWORD = "@Mironshox_77.@";
const categories = ["Barchasi", "Siyosat", "Jamiyat", "Iqtisodiyot", "Sport", "Texnologiya", "Madaniyat", "Dunyo"];

const seedArticles = [
  {
    id: crypto.randomUUID(),
    title: "Yangi raqamli xizmatlar Markaziy Osiyoda yangiliklar oqimini tezlashtirmoqda",
    excerpt: "Hukumatlar va media platformalar kontentni tezroq tarqatish uchun yagona raqamli infratuzilmaga o‘tmoqda.",
    category: "Texnologiya",
    accent: "#0d1b2a",
    featured: true,
    published: true,
    publishedAt: "2026-06-24T10:15:00Z",
    updatedAt: "2026-06-24T10:15:00Z",
    views: 1840,
    tags: ["startap", "media", "raqamlashtirish"],
    content:
      "So‘nggi yillarda yangiliklar iste’moli odatiy televideniye va bosma nashrlardan ko‘proq mobil ilovalar hamda veb-platformalarga ko‘chdi.\n\nMiron.uz aynan shu yo‘nalishda tezkor, aniq va qulay yangilik yetkazish tajribasini taqdim etadi.\n\nBizning maqsadimiz faqat xabar berish emas, balki har bir yangilikni izoh, ko‘rishlar statistikasi va boshqaruv vositalari bilan birga markazlashgan platformada jamlashdir.",
    comments: [
      {
        id: crypto.randomUUID(),
        name: "Anvar",
        text: "Dizayn juda chiroyli chiqibdi. O'qish qulay.",
        createdAt: "2026-06-25T11:30:00Z",
        approved: true
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    title: "Shahar infratuzilmasida yangi loyihalar: transport va servislar yangilanadi",
    excerpt: "Yo‘llar, jamoat transporti va xizmat ko‘rsatish tizimida bir qator yangi loyihalar boshlanmoqda.",
    category: "Jamiyat",
    accent: "#14213d",
    featured: false,
    published: true,
    publishedAt: "2026-06-23T07:45:00Z",
    updatedAt: "2026-06-23T07:45:00Z",
    views: 1123,
    tags: ["transport", "shahar", "loyiha"],
    content:
      "Shahar rivojlanishi bilan birga fuqarolarga xizmat ko‘rsatish sifati ham oshishi kerak.\n\nShu sababli yangi loyihalarda nafaqat yo‘llar, balki axborot muhitini ham modernizatsiya qilish rejalashtirilmoqda.",
    comments: []
  },
  {
    id: crypto.randomUUID(),
    title: "Sport maydonlarida mavsumning eng keskin bahslari boshlandi",
    excerpt: "Jamoalar tayyorgarlikni kuchaytirar ekan, muxlislar uchun yanada qiziqarli o‘yinlar kutilyapti.",
    category: "Sport",
    accent: "#1d3557",
    featured: false,
    published: true,
    publishedAt: "2026-06-22T17:20:00Z",
    updatedAt: "2026-06-22T17:20:00Z",
    views: 951,
    tags: ["futbol", "sport", "mavsum"],
    content:
      "Mavsum oldidan jamoalar tarkibni kuchaytirib, taktika ustida ishlamoqda.\n\nMuxlislar esa yangiliklarni tezda ko‘rish, izoh qoldirish va statistikani kuzatishni xohlaydi.",
    comments: []
  },
  {
    id: crypto.randomUUID(),
    title: "Iqtisodiyotda kichik biznes uchun yangi imkoniyatlar paydo bo‘lmoqda",
    excerpt: "Soddalashtirilgan xizmatlar va raqamli to‘lovlar kichik tadbirkorlar uchun katta yengillik bermoqda.",
    category: "Iqtisodiyot",
    accent: "#2a9d8f",
    featured: false,
    published: true,
    publishedAt: "2026-06-21T08:10:00Z",
    updatedAt: "2026-06-21T08:10:00Z",
    views: 782,
    tags: ["biznes", "startup", "to'lov"],
    content:
      "Kichik biznes uchun eng muhim omillar soddalik, tezlik va ishonchlilikdir.\n\nYangiliklar platformasi ham shu tamoyil asosida qurilganda, foydalanuvchi tajribasi ancha yaxshilanadi.",
    comments: []
  },
  {
    id: crypto.randomUUID(),
    title: "Madaniyat sahnasida yangi festival: yosh ijodkorlar uchun katta minbar",
    excerpt: "Festival yosh avlod ijodkorlari uchun o‘z ishlarini ommaga taqdim etish imkonini beradi.",
    category: "Madaniyat",
    accent: "#8338ec",
    featured: false,
    published: true,
    publishedAt: "2026-06-20T14:00:00Z",
    updatedAt: "2026-06-20T14:00:00Z",
    views: 673,
    tags: ["festival", "madaniyat", "san'at"],
    content:
      "Madaniyat va ijodkorlikni qo‘llab-quvvatlash jamiyatning ruhiy boyligini oshiradi.\n\nMiron.uz bunday yangiliklarni alohida bo‘limlarda ko‘rsatib boradi.",
    comments: []
  }
];

const state = { articles: [] };

const app = document.getElementById("app");
const navLinks = document.getElementById("nav-links");
const globalSearch = document.getElementById("global-search");
const tickerTrack = document.getElementById("ticker-track");
const liveDate = document.getElementById("live-date");

let ui = {
  category: "Barchasi",
  search: "",
  adminTab: "overview",
  editingId: null
};

async function loadState() {
  try {
    const response = await fetch(API_STATE_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`State fetch failed ${response.status}`);
    }
    const parsed = await response.json();
    if (!parsed.articles?.length) {
      return { articles: seedArticles };
    }
    return parsed;
  } catch (error) {
    console.warn("Could not load shared state:", error);
    return { articles: seedArticles };
  }
}

async function saveState() {
  try {
    const response = await fetch(API_STATE_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });
    if (!response.ok) {
      const payload = await response.text();
      console.error("Failed to save shared state:", response.status, payload);
    }
  } catch (error) {
    console.error("Could not save shared state:", error);
  }
}

async function persistAndRender() {
  await saveState();
  render();
}

function articleCommentsCount(article) {
  return (article.comments || []).filter((comment) => comment.approved !== false).length;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatDateTime(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\u0400-\u04FF]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function placeholderImage(title, accent = "#0d1b2a") {
  const safeTitle = escapeHtml(title).slice(0, 72);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#0b1220" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)" />
      <circle cx="1020" cy="130" r="160" fill="rgba(255,255,255,0.12)" />
      <circle cx="180" cy="650" r="210" fill="rgba(244,185,66,0.16)" />
      <text x="72" y="180" fill="#f8fafc" font-size="72" font-family="Arial, sans-serif" font-weight="700">Miron.uz</text>
      <text x="72" y="300" fill="#ffffff" font-size="58" font-family="Arial, sans-serif" font-weight="700">${safeTitle}</text>
      <text x="72" y="410" fill="#dbe4f0" font-size="30" font-family="Arial, sans-serif">Yangiliklar portali</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function ensureSlugs() {
  let changed = false;
  for (const article of state.articles) {
    if (!article.slug) {
      article.slug = slugify(article.title);
      changed = true;
    }
    if (!article.image) {
      article.image = placeholderImage(article.title, article.accent || "#0d1b2a");
      changed = true;
    }
  }
  if (changed) void saveState();
}

function getArticleBySlug(slug) {
  return state.articles.find((article) => article.slug === slug);
}

function getArticleById(id) {
  return state.articles.find((article) => article.id === id);
}

function sortedPublishedArticles() {
  return state.articles
    .filter((article) => article.published !== false)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function filteredArticles() {
  const q = ui.search.trim().toLowerCase();
  const category = ui.category;
  return sortedPublishedArticles().filter((article) => {
    const inCategory = category === "Barchasi" || article.category === category;
    const text = `${article.title} ${article.excerpt} ${article.category} ${(article.tags || []).join(" ")}`.toLowerCase();
    const matches = !q || text.includes(q);
    return inCategory && matches;
  });
}

function navMarkup() {
  const links = [
    { label: "Bosh sahifa", href: "#/" },
    ...categories.slice(1).map((category) => ({
      label: category,
      href: `#/category/${encodeURIComponent(category)}`
    })),
    { label: "Yangilik qo'shish", href: "#/admin" }
  ];

  navLinks.innerHTML = links
    .map((link) => {
      const active = isActiveLink(link.href) ? "active" : "";
      return `<a class="${active}" href="${link.href}">${link.label}</a>`;
    })
    .join("");
}

function isActiveLink(href) {
  const route = location.hash || "#/";
  if (href === "#/" && (route === "#/" || route === "")) return true;
  if (href === "#/admin") return route.startsWith("#/admin");
  if (href.startsWith("#/category/")) {
    return route.startsWith(href);
  }
  return false;
}

function renderTicker() {
  const items = sortedPublishedArticles()
    .slice(0, 6)
    .map((article) => `<span>• ${escapeHtml(article.title)}</span>`)
    .join("");
  tickerTrack.innerHTML = `${items}${items}`;
}

function renderHome(categoryOverride = "Barchasi") {
  ui.category = categoryOverride;
  const articles = filteredArticles();
  const featured = articles.find((article) => article.featured) || articles[0];
  const latest = articles.slice(0, 8);
  const trending = [...sortedPublishedArticles()]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  const topCategories = categories.filter((category) => category !== "Barchasi");

  app.innerHTML = `
    <section class="hero">
      <article class="panel hero-main">
        <div class="hero-grid">
          <div class="hero-copy">
            <div>
              <span class="kicker">Miron.uz yangiliklar markazi</span>
              <h1 class="hero-title">Yangiliklarni tez yozish, tarqatish va boshqarish uchun zamonaviy sayt.</h1>
              <p class="hero-desc">
                Xabardor bo‘lish, izoh qoldirish, ko‘rishlar sonini kuzatish va admin paneldan yangilik qo‘shish
                endi bitta joyda.
              </p>
            </div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#/admin">Yangilik qo'shish</a>
              <button class="btn btn-secondary" data-scroll-target="#latest-news">So'nggi yangiliklar</button>
            </div>
            <div class="hero-stats">
              <div class="stat-card">
                <strong>${state.articles.filter((article) => article.published !== false).length}</strong>
                <span class="muted">Faol yangiliklar</span>
              </div>
              <div class="stat-card">
                <strong>${state.articles.reduce((sum, article) => sum + article.views, 0)}</strong>
                <span class="muted">Jami ko'rishlar</span>
              </div>
              <div class="stat-card">
                <strong>${state.articles.reduce((sum, article) => sum + articleCommentsCount(article), 0)}</strong>
                <span class="muted">Izohlar</span>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <img src="${featured?.image || placeholderImage("Miron.uz", "#14213d")}" alt="${escapeHtml(featured?.title || "Miron.uz")}" />
            <div class="overlay">
              <div class="badge-row">
                <span class="badge">${featured?.category || "Yangilik"}</span>
                <span class="badge">${formatDate(featured?.publishedAt || new Date())}</span>
                <span class="badge">${featured ? featured.views : 0} ko'rish</span>
              </div>
              <div class="mini-card">
                <span class="kicker">Tanlangan material</span>
                <h3>${escapeHtml(featured?.title || "Yaqinda qo'shilgan yangilik")}</h3>
                <p>${escapeHtml(featured?.excerpt || "Admin panel orqali yangi yangilik qo‘shing va u avtomatik ravishda bosh sahifaga chiqadi.")}</p>
                ${featured ? `<a class="btn btn-primary" href="#/article/${featured.slug}">O'qish</a>` : ""}
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section class="sections">
      <div class="section-head">
        <div>
          <h2>Bo'limlar</h2>
          <p>Yangiliklarni kategoriyalar bo'yicha ajrating.</p>
        </div>
        <div class="chips">
          ${topCategories
            .map((category) => {
              const active = ui.category === category ? "active" : "";
              return `<a class="chip ${active}" href="#/category/${encodeURIComponent(category)}">${category}</a>`;
            })
            .join("")}
        </div>
      </div>

      <div class="section-head" id="latest-news">
        <div>
          <h2>So'nggi yangiliklar</h2>
          <p>Foydalanuvchi ko'radigan asosiy oqim.</p>
        </div>
        <p>${articles.length} ta natija</p>
      </div>

      <div class="news-grid">
        ${
          articles.length
            ? articles
                .map((article, index) => renderNewsCard(article, index === 0 ? "featured" : ""))
                .join("")
            : `<div class="empty-state">Hech narsa topilmadi. Boshqa kategoriya yoki qidiruvni sinab ko'ring.</div>`
        }
      </div>
    </section>

    <section class="sections content-grid">
      <article class="panel side-panel">
        <div class="section-head">
          <div>
            <h2>Ko'p o'qilayotganlar</h2>
            <p>View count bo'yicha saralangan.</p>
          </div>
        </div>
        <ol class="rank-list">
          ${trending
            .map(
              (article) => `
                <li class="rank-item">
                  <a href="#/article/${article.slug}"><strong>${escapeHtml(article.title)}</strong></a>
                  <div class="news-meta">
                    <span>${article.category}</span>
                    <span>${article.views} ko'rish</span>
                    <span>${articleCommentsCount(article)} izoh</span>
                  </div>
                </li>
              `
            )
            .join("")}
        </ol>
      </article>

      <article class="panel side-panel">
        <div class="section-head">
          <div>
            <h2>Admin uchun qisqa yo'l</h2>
            <p>Yangilik qo‘shish oynasi alohida tayyorlangan.</p>
          </div>
        </div>
        <div class="mini-card" style="background: rgba(13,27,42,0.96); color: white;">
          <span class="kicker">Admin panel</span>
          <h3>Yangi post yozish, tahrirlash, o‘chirish va izohlarni boshqarish.</h3>
          <p>Miron.uz sayti uchun barcha boshqaruv funksiyalari admin panelda jamlangan.</p>
          <a class="btn btn-primary" href="#/admin">Panelga o‘tish</a>
        </div>
      </article>
    </section>
  `;
  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(button.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderNewsCard(article, extraClass = "") {
  const classes = ["news-card"];
  if (article.featured) classes.push("featured");
  if (extraClass) classes.push(extraClass);
  return `
    <article class="${classes.join(" ")}">
      <div class="cover">
        <img src="${article.image || placeholderImage(article.title, article.accent)}" alt="${escapeHtml(article.title)}" />
        <div class="overlay"></div>
      </div>
      <div class="body">
        <div class="news-meta">
          <span>${article.category}</span>
          <span>${formatDate(article.publishedAt)}</span>
        </div>
        <h3><a href="#/article/${article.slug}">${escapeHtml(article.title)}</a></h3>
        <p>${escapeHtml(article.excerpt)}</p>
        <div class="actions">
          <div class="inline-meta">
            <span>${article.views} ko'rish</span>
            <span>${articleCommentsCount(article)} izoh</span>
          </div>
          <a class="link" href="#/article/${article.slug}">O'qish</a>
        </div>
      </div>
    </article>
  `;
}

function renderArticle(slug) {
  const article = getArticleBySlug(slug);
  if (!article) {
    app.innerHTML = `
      <section class="panel article-view">
        <div class="empty-state">
          Bunday yangilik topilmadi. <a href="#/">Bosh sahifaga qaytish</a>
        </div>
      </section>
    `;
    return;
  }

  const viewKey = `viewed-${article.id}`;
  if (!sessionStorage.getItem(viewKey)) {
    article.views += 1;
    sessionStorage.setItem(viewKey, "1");
    void saveState();
  }

  const related = sortedPublishedArticles()
    .filter((item) => item.id !== article.id && item.category === article.category)
    .slice(0, 4);

  app.innerHTML = `
    <section class="panel article-view">
      <div class="article-hero">
        <div class="page-head">
          <span class="kicker">${article.category}</span>
          <h1 class="article-title">${escapeHtml(article.title)}</h1>
          <p>${escapeHtml(article.excerpt)}</p>
          <div class="news-meta">
            <span>${formatDate(article.publishedAt)}</span>
            <span>${article.views} ko'rish</span>
            <span>${articleCommentsCount(article)} izoh</span>
          </div>
          <div class="article-tags">
            ${(article.tags || []).map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
        <div class="article-cover">
          <img src="${article.image || placeholderImage(article.title, article.accent)}" alt="${escapeHtml(article.title)}" />
        </div>
      </div>

      <div class="article-body content-grid">
        <article class="article-text panel" style="padding: 1rem;">
          ${renderText(article.content)}
        </article>

        <aside class="side-stack">
          <section class="panel side-panel">
            <h3>Shu bo'limdagi yangiliklar</h3>
            <ul class="rank-list">
              ${
                related.length
                  ? related
                      .map(
                        (item) => `
                          <li class="rank-item">
                            <a href="#/article/${item.slug}"><strong>${escapeHtml(item.title)}</strong></a>
                            <div class="news-meta">
                              <span>${item.views} ko'rish</span>
                              <span>${formatDate(item.publishedAt)}</span>
                            </div>
                          </li>
                        `
                      )
                      .join("")
                  : `<li class="muted">Hozircha bu bo'limda boshqa material yo'q.</li>`
              }
            </ul>
          </section>
          <section class="panel side-panel">
            <h3>Admin eslatma</h3>
            <p class="muted">Yangilikni tahrirlash yoki o'chirish uchun admin panelga o'ting.</p>
            <a class="btn btn-primary" href="#/admin">Admin panel</a>
          </section>
        </aside>
      </div>

      <section class="comments-wrap">
        <div class="section-head">
          <div>
            <h2>Izohlar</h2>
            <p>Foydalanuvchilar fikr qoldirishi mumkin.</p>
          </div>
        </div>
        <div class="content-grid">
          <form class="panel comment-form" id="comment-form">
            <div class="field-grid">
              <div class="field">
                <label for="comment-name">Ism</label>
                <input id="comment-name" name="name" required maxlength="50" placeholder="Masalan: Ali" />
              </div>
              <div class="field">
                <label for="comment-text">Izoh</label>
                <textarea id="comment-text" name="text" required maxlength="500" placeholder="Fikringizni yozing..."></textarea>
              </div>
            </div>
            <button class="btn btn-primary" type="submit">Izoh yuborish</button>
            <p class="helper">Izoh darhol saqlanadi va quyida ko‘rinadi.</p>
          </form>

          <section class="panel side-panel">
            <h3>Mavjud izohlar</h3>
            <ul class="comment-list" id="comment-list">
              ${renderComments(article)}
            </ul>
          </section>
        </div>
      </section>
    </section>
  `;

  const commentForm = document.getElementById("comment-form");
  commentForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(commentForm);
    const name = String(formData.get("name") || "").trim();
    const text = String(formData.get("text") || "").trim();
    if (!name || !text) return;

    article.comments = article.comments || [];
    article.comments.unshift({
      id: crypto.randomUUID(),
      name,
      text,
      createdAt: new Date().toISOString(),
      approved: true
    });
    await saveState();
    renderArticle(slug);
  });
}

function renderText(content) {
  return String(content || "")
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function renderComments(article) {
  const comments = (article.comments || []).filter((comment) => comment.approved !== false);
  if (!comments.length) {
    return `<li class="empty-state">Hali izoh yo'q. Birinchi bo'lib fikr bildiring.</li>`;
  }
  return comments
    .map(
      (comment) => `
        <li class="comment-item">
          <strong>${escapeHtml(comment.name)}</strong>
          <div class="time">${formatDateTime(comment.createdAt)}</div>
          <p>${escapeHtml(comment.text)}</p>
        </li>
      `
    )
    .join("");
}

function renderAdmin() {
  const loggedIn = localStorage.getItem(ADMIN_KEY) === "1";
  if (!loggedIn) {
    app.innerHTML = `
      <section class="panel article-view">
        <div class="page-head">
          <span class="kicker">Admin panel</span>
          <h1 class="article-title">Kirish</h1>
          <p>Yangilik qo‘shish va boshqarish uchun avval tizimga kiring.</p>
        </div>
        <form class="login-box" id="login-form">
          <div class="field">
            <label for="admin-password">Parol</label>
            <input id="admin-password" type="password" required placeholder="Admin parol" />
          </div>
          <button class="btn btn-primary" type="submit">Kirish</button>
        </form>
      </section>
    `;
    document.getElementById("login-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const password = document.getElementById("admin-password").value.trim();
      if (password === DEFAULT_PASSWORD) {
        localStorage.setItem(ADMIN_KEY, "1");
        render();
      } else {
        alert("Parol noto'g'ri.");
      }
    });
    return;
  }

  const activeTab = ui.adminTab;
  const editingArticle = ui.editingId ? getArticleById(ui.editingId) : null;

  app.innerHTML = `
    <section class="panel article-view">
      <div class="page-head">
        <span class="kicker">Admin panel</span>
        <h1 class="article-title">Miron.uz boshqaruv markazi</h1>
        <p>Yangilik qo'shish, tahrirlash, ko'rishlar va izohlarni boshqarish.</p>
      </div>

      <div class="admin-layout">
        <aside class="panel admin-sidebar">
          <div class="admin-menu">
            <button class="btn ${activeTab === "overview" ? "btn-primary" : "btn-secondary"}" data-admin-tab="overview">Umumiy holat</button>
            <button class="btn ${activeTab === "compose" ? "btn-primary" : "btn-secondary"}" data-admin-tab="compose">Yangilik qo'shish</button>
            <button class="btn ${activeTab === "posts" ? "btn-primary" : "btn-secondary"}" data-admin-tab="posts">Barcha yangiliklar</button>
            <button class="btn ${activeTab === "comments" ? "btn-primary" : "btn-secondary"}" data-admin-tab="comments">Izohlar</button>
            <button class="btn btn-danger" data-logout>Chiqish</button>
          </div>
        </aside>

        <div class="admin-main">
          <div class="dashboard-stats">
            <div class="stat-box"><strong>${state.articles.length}</strong><span class="muted">Jami yangiliklar</span></div>
            <div class="stat-box"><strong>${state.articles.filter((a) => a.published !== false).length}</strong><span class="muted">Faol postlar</span></div>
            <div class="stat-box"><strong>${state.articles.reduce((sum, a) => sum + a.views, 0)}</strong><span class="muted">Jami ko'rishlar</span></div>
            <div class="stat-box"><strong>${state.articles.reduce((sum, a) => sum + articleCommentsCount(a), 0)}</strong><span class="muted">Izohlar</span></div>
          </div>

          <div class="tab-panel ${activeTab === "overview" ? "active" : ""}" data-panel="overview">
            <div class="panel side-panel">
              <h3>Tezkor boshqaruv</h3>
              <p class="muted">
                Bu panelda yangi yangilik yozish, kontentni tahrirlash, o‘chirish va izohlarni nazorat qilish mumkin.
              </p>
              <div class="hero-actions">
                <button class="btn btn-primary" data-admin-tab="compose">Yangilik qo'shish</button>
                <button class="btn btn-secondary" data-admin-tab="posts">Postlar ro'yxati</button>
              </div>
            </div>
          </div>

          <div class="tab-panel ${activeTab === "compose" ? "active" : ""}" data-panel="compose">
            <div class="panel side-panel">
              <div class="section-head">
                <div>
                  <h2>${editingArticle ? "Yangilikni tahrirlash" : "Yangilik qo'shish"}</h2>
                  <p>Post uchun alohida bo‘lim tayyorlangan.</p>
                </div>
                ${editingArticle ? `<button class="btn btn-secondary" data-cancel-edit>Tahrirni bekor qilish</button>` : ""}
              </div>
              <form class="admin-form" id="post-form">
                <div class="field-grid">
                  <div class="field">
                    <label for="title">Sarlavha</label>
                    <input id="title" name="title" required value="${escapeHtml(editingArticle?.title || "")}" />
                  </div>
                  <div class="field">
                    <label for="category">Kategoriya</label>
                    <select id="category" name="category" required>
                      ${categories
                        .slice(1)
                        .map(
                          (category) => `<option value="${escapeHtml(category)}" ${editingArticle?.category === category ? "selected" : ""}>${category}</option>`
                        )
                        .join("")}
                    </select>
                  </div>
                </div>

                <div class="field-grid">
                  <div class="field">
                    <label for="excerpt">Qisqacha matn</label>
                    <textarea id="excerpt" name="excerpt" required maxlength="240">${escapeHtml(editingArticle?.excerpt || "")}</textarea>
                  </div>
                  <div class="field">
                    <label for="image">Rasm havolasi</label>
                    <input id="image" name="image" placeholder="Bo'sh qoldirsangiz avtomatik rasm yaratiladi" value="${escapeHtml(editingArticle?.image && !editingArticle.image.startsWith("data:image/svg+xml") ? editingArticle.image : "")}" />
                  </div>
                </div>

                <div class="field-grid">
                  <div class="field">
                    <label for="tags">Teglar</label>
                    <input id="tags" name="tags" placeholder="sport, tezkor, siyosat" value="${escapeHtml((editingArticle?.tags || []).join(", "))}" />
                  </div>
                  <div class="field">
                    <label for="featured">Tanlangan yangilik</label>
                    <select id="featured" name="featured">
                      <option value="no" ${editingArticle?.featured ? "" : "selected"}>Yo'q</option>
                      <option value="yes" ${editingArticle?.featured ? "selected" : ""}>Ha</option>
                    </select>
                  </div>
                </div>

                <div class="field">
                  <label for="content">Matn</label>
                  <textarea id="content" name="content" required placeholder="Yangilik matnini kiriting...">${escapeHtml(editingArticle?.content || "")}</textarea>
                </div>

                <div class="field-grid">
                  <div class="field">
                    <label for="published">Holati</label>
                    <select id="published" name="published">
                      <option value="yes" ${editingArticle?.published === false ? "" : "selected"}>Chop etilgan</option>
                      <option value="no" ${editingArticle?.published === false ? "selected" : ""}>Yashirin</option>
                    </select>
                  </div>
                  <div class="field">
                    <label>&nbsp;</label>
                    <button class="btn btn-primary" type="submit">${editingArticle ? "Saqlash" : "Yangilikni qo'shish"}</button>
                  </div>
                </div>
                <p class="helper">Admin paneldan har qanday yangilikni keyin tahrirlashingiz mumkin.</p>
              </form>
            </div>
          </div>

          <div class="tab-panel ${activeTab === "posts" ? "active" : ""}" data-panel="posts">
            <div class="panel side-panel">
              <h2>Yangiliklar ro'yxati</h2>
              <ul class="admin-list" id="admin-post-list">
                ${renderAdminPosts()}
              </ul>
            </div>
          </div>

          <div class="tab-panel ${activeTab === "comments" ? "active" : ""}" data-panel="comments">
            <div class="panel side-panel">
              <h2>Izohlar</h2>
              <ul class="comment-admin-list" id="admin-comment-list">
                ${renderAdminComments()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      ui.adminTab = button.dataset.adminTab;
      render();
    });
  });

  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    localStorage.removeItem(ADMIN_KEY);
    ui.editingId = null;
    render();
  });

  document.querySelector("[data-cancel-edit]")?.addEventListener("click", () => {
    ui.editingId = null;
    render();
  });

  document.getElementById("post-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const excerpt = String(formData.get("excerpt") || "").trim();
    const imageInput = String(formData.get("image") || "").trim();
    const tags = String(formData.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const featured = formData.get("featured") === "yes";
    const content = String(formData.get("content") || "").trim();
    const published = formData.get("published") !== "no";

    if (!title || !category || !excerpt || !content) return;

    if (editingArticle) {
      editingArticle.title = title;
      editingArticle.slug = slugify(title);
      editingArticle.category = category;
      editingArticle.excerpt = excerpt;
      editingArticle.image = imageInput || placeholderImage(title, editingArticle.accent || "#0d1b2a");
      editingArticle.tags = tags;
      editingArticle.featured = featured;
      editingArticle.published = published;
      editingArticle.content = content;
      editingArticle.updatedAt = new Date().toISOString();
    } else {
      state.articles.unshift({
        id: crypto.randomUUID(),
        slug: slugify(title),
        title,
        excerpt,
        category,
        accent: "#0d1b2a",
        featured,
        published,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        tags,
        content,
        image: imageInput || placeholderImage(title, "#0d1b2a"),
        comments: []
      });
    }

    ui.editingId = null;
    ui.adminTab = "posts";
    persistAndRender();
  });

  document.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      ui.editingId = button.dataset.edit;
      ui.adminTab = "compose";
      render();
    });
  });

  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const article = getArticleById(button.dataset.delete);
      if (!article) return;
      if (confirm(`"${article.title}" ni o'chirishni tasdiqlaysizmi?`)) {
        state.articles = state.articles.filter((item) => item.id !== article.id);
        if (ui.editingId === article.id) ui.editingId = null;
        persistAndRender();
      }
    });
  });

  document.querySelectorAll("[data-toggle-featured]").forEach((button) => {
    button.addEventListener("click", async () => {
      const article = getArticleById(button.dataset.toggleFeatured);
      if (!article) return;
      article.featured = !article.featured;
      await saveState();
      render();
    });
  });

  document.querySelectorAll("[data-toggle-published]").forEach((button) => {
    button.addEventListener("click", async () => {
      const article = getArticleById(button.dataset.togglePublished);
      if (!article) return;
      article.published = !article.published;
      await saveState();
      render();
    });
  });

  document.querySelectorAll("[data-delete-comment]").forEach((button) => {
    button.addEventListener("click", async () => {
      const [articleId, commentId] = button.dataset.deleteComment.split(":");
      const article = getArticleById(articleId);
      if (!article) return;
      article.comments = (article.comments || []).filter((comment) => comment.id !== commentId);
      await saveState();
      render();
    });
  });
}

function renderAdminPosts() {
  if (!state.articles.length) {
    return `<li class="empty-state">Hali post yo'q.</li>`;
  }

  return [...state.articles]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map(
      (article) => `
        <li class="admin-item">
          <div class="news-meta">
            <span>${article.category}</span>
            <span>${article.published ? "Chop etilgan" : "Yashirin"}</span>
            <span>${article.views} ko'rish</span>
            <span>${articleCommentsCount(article)} izoh</span>
          </div>
          <strong>${escapeHtml(article.title)}</strong>
          <p class="muted">${escapeHtml(article.excerpt)}</p>
          <div class="item-actions">
            <a class="btn btn-secondary" href="#/article/${article.slug}">Ko'rish</a>
            <button class="btn btn-secondary" data-edit="${article.id}">Tahrirlash</button>
            <button class="btn btn-secondary" data-toggle-featured="${article.id}">${article.featured ? "Tanlanganlikdan olish" : "Tanlangan qilish"}</button>
            <button class="btn btn-secondary" data-toggle-published="${article.id}">${article.published ? "Yashirish" : "Chop etish"}</button>
            <button class="btn btn-danger" data-delete="${article.id}">O'chirish</button>
          </div>
        </li>
      `
    )
    .join("");
}

function renderAdminComments() {
  const comments = [];
  for (const article of state.articles) {
    for (const comment of article.comments || []) {
      if (comment.approved !== false) {
        comments.push({ article, comment });
      }
    }
  }

  if (!comments.length) {
    return `<li class="empty-state">Hali izoh yo'q.</li>`;
  }

  return comments
    .sort((a, b) => new Date(b.comment.createdAt) - new Date(a.comment.createdAt))
    .map(
      ({ article, comment }) => `
        <li class="comment-admin-item">
          <div class="news-meta">
            <span>${escapeHtml(article.title)}</span>
            <span>${formatDateTime(comment.createdAt)}</span>
          </div>
          <strong>${escapeHtml(comment.name)}</strong>
          <p>${escapeHtml(comment.text)}</p>
          <div class="item-actions">
            <button class="btn btn-danger" data-delete-comment="${article.id}:${comment.id}">O'chirish</button>
          </div>
        </li>
      `
    )
    .join("");
}

function renderCategory(category) {
  ui.category = category;
  renderHome(category);
}

function setDate() {
  liveDate.textContent = new Intl.DateTimeFormat("uz-UZ", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  }).format(new Date());
}

function route() {
  const hash = location.hash || "#/";
  if (hash.startsWith("#/article/")) {
    renderArticle(decodeURIComponent(hash.replace("#/article/", "")));
    return;
  }
  if (hash.startsWith("#/admin")) {
    renderAdmin();
    return;
  }
  if (hash.startsWith("#/category/")) {
    renderCategory(decodeURIComponent(hash.replace("#/category/", "")));
    return;
  }
  renderHome();
}

function render() {
  ensureSlugs();
  navMarkup();
  renderTicker();
  setDate();
  if (globalSearch && document.activeElement !== globalSearch) {
    globalSearch.value = ui.search;
  }
  route();
}

globalSearch.addEventListener("input", () => {
  ui.search = globalSearch.value;
  render();
});

window.addEventListener("hashchange", render);

async function init() {
  const initialState = await loadState();
  state.articles = initialState.articles;
  ensureSlugs();
  render();
}

init();
