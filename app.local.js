// Client-only copy of app.js that uses localStorage (no server required)
// Use this file for GitHub Pages (static hosting). Update index.html to load app.local.js instead of app.js

const STORAGE_KEY = "mironuz-state-v1";
const ADMIN_KEY = "mironuz-admin-v1";
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

const state = loadState();

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

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = { articles: seedArticles };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed.articles?.length) {
      parsed.articles = seedArticles;
    }
    return parsed;
  } catch {
    const initial = { articles: seedArticles };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function persistAndRender() {
  saveState();
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
  if (changed) saveState();
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

// --- rest of the rendering code is identical to app.js ---

// To keep this file concise in the repository, you can copy the rest of the code
// from your existing `app.js` starting from `function navMarkup()` through the end.
// For convenience, the easiest approach is to copy the remaining functions verbatim
// so the local-only app behaves the same as the original.

// Note: When you publish to GitHub Pages, update `index.html` script to:
// <script type="module" src="app.local.js" defer></script>

// End of client-only stub
