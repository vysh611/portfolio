(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    profile: null,
    projects: [],
    filter: "All",
    q: ""
  };

  function prefersLight() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem("theme");
    } catch {
      return null;
    }
  }

  function setTheme(theme) {
    const html = document.documentElement;
    if (theme === "light" || theme === "dark") {
      html.dataset.theme = theme;
      try {
        localStorage.setItem("theme", theme);
      } catch {}
    }
  }

  function initTheme() {
    document.documentElement.classList.remove("no-js");
    const saved = getSavedTheme();
    if (saved) {
      setTheme(saved);
      return;
    }
    setTheme(prefersLight() ? "light" : "dark");
  }

  function toast(msg) {
    const existing = $("#toast");
    if (existing) existing.remove();

    const el = document.createElement("div");
    el.id = "toast";
    el.textContent = msg;
    el.style.position = "fixed";
    el.style.bottom = "18px";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.padding = "10px 12px";
    el.style.borderRadius = "999px";
    el.style.border = "1px solid var(--border)";
    el.style.background = "var(--surface)";
    el.style.color = "var(--text)";
    el.style.boxShadow = "var(--shadow)";
    el.style.zIndex = "999";
    document.body.appendChild(el);

    window.setTimeout(() => {
      el.style.opacity = "0";
      el.style.transition = "opacity 180ms ease";
      window.setTimeout(() => el.remove(), 240);
    }, 1200);
  }

  async function fetchJson(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return await res.json();
  }

  function renderSkills(profile) {
    const root = $("#skillGroups");
    if (!root) return;
    root.innerHTML = "";

    for (const group of profile.skills || []) {
      const wrap = document.createElement("div");
      wrap.className = "skill-group";

      const title = document.createElement("h3");
      title.textContent = group.group;
      wrap.appendChild(title);

      const chips = document.createElement("div");
      chips.className = "skill-chips";

      for (const item of group.items || []) {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = `<span class="dot" aria-hidden="true"></span><span>${escapeHtml(item)}</span>`;
        chips.appendChild(chip);
      }

      wrap.appendChild(chips);
      root.appendChild(wrap);
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function allTags(projects) {
    const set = new Set();
    for (const p of projects) {
      for (const t of p.tags || []) set.add(t);
    }
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }

  function renderFilters(projects) {
    const root = $("#projectFilters");
    if (!root) return;
    const tags = allTags(projects);
    root.innerHTML = "";

    for (const tag of tags) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter-btn";
      btn.textContent = tag;
      btn.setAttribute("aria-pressed", String(tag === state.filter));
      btn.addEventListener("click", () => {
        state.filter = tag;
        renderFilters(state.projects);
        renderProjects();
      });
      root.appendChild(btn);
    }
  }

  function matchesQuery(p, q) {
    if (!q) return true;
    const hay = [
      p.title,
      p.when,
      p.badge,
      p.summary,
      ...(p.tags || []),
      ...(p.highlights || [])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function passesFilter(p) {
    if (state.filter === "All") return true;
    return (p.tags || []).includes(state.filter);
  }

  function projectCard(p) {
    const repo = p.repo ? `<a class="btn btn-secondary btn-sm" href="${p.repo}" target="_blank" rel="noreferrer">
      <span class="icon" aria-hidden="true" data-icon="github"></span><span>Repo</span></a>` : "";

    const highlights =
      (p.highlights || []).length > 0
        ? `<ul class="bullets">${p.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>`
        : "";

    const tags = (p.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");

    const badge = p.badge ? `<span class="badge">${escapeHtml(p.badge)}</span>` : "";

    return `
      <article class="card project">
        <div class="project-head">
          <div>
            <h3 class="project-title">${escapeHtml(p.title)}</h3>
            <div class="muted small">${escapeHtml(p.when || "")}</div>
          </div>
          ${badge}
        </div>
        <p class="project-desc">${escapeHtml(p.summary || "")}</p>
        <div class="tag-row">${tags}</div>
        ${highlights}
        <div class="project-actions">
          ${repo}
          <a class="btn btn-ghost btn-sm" href="#contact">
            <span class="icon" aria-hidden="true" data-icon="mail"></span>
            <span>Discuss</span>
          </a>
        </div>
      </article>
    `;
  }

  function renderProjects() {
    const root = $("#projectGrid");
    if (!root) return;

    const q = state.q.trim();
    const visible = state.projects.filter((p) => passesFilter(p) && matchesQuery(p, q));
    root.innerHTML = visible.map(projectCard).join("");

    if (visible.length === 0) {
      root.innerHTML = `
        <div class="panel" style="grid-column: 1 / -1;">
          <h3>No matches</h3>
          <p>Try clearing filters or searching different keywords (e.g., “Power BI”, “SQL”, “Flask”).</p>
        </div>
      `;
    }
  }

  function wireNav() {
    const toggle = $(".nav-toggle");
    const links = $("#nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
      const isOpen = links.getAttribute("data-open") === "true";
      links.setAttribute("data-open", String(!isOpen));
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });

    $$(".nav-link", links).forEach((a) => {
      a.addEventListener("click", () => {
        links.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (!links.contains(e.target) && !toggle.contains(e.target)) {
        links.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function wireThemeToggle() {
    const btn = $("#themeToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme;
      setTheme(current === "light" ? "dark" : "light");
    });
  }

  function wireSearch() {
    const input = $("#projectSearch");
    if (!input) return;
    input.addEventListener("input", () => {
      state.q = input.value || "";
      renderProjects();
    });
  }

  function wireCopy() {
    $$("button.copy[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const value = btn.getAttribute("data-copy") || "";
        try {
          await navigator.clipboard.writeText(value);
          toast("Copied");
        } catch {
          toast("Copy failed");
        }
      });
    });
  }

  function wireContactForm(profile) {
    const form = $("#contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const message = String(fd.get("message") || "").trim();

      const subject = `Portfolio contact — ${name || "Visitor"}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`;
      const to = profile.email || "gvyshnavi611@gmail.com";
      const href = `mailto:${to}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
    });
  }

  function applyProfileLinks(profile) {
    // Update LinkedIn anchors that were left as placeholders.
    $$('a[href="https://www.linkedin.com/"]').forEach((a) => {
      a.href = profile.linkedin || "https://www.linkedin.com/";
    });
  }

  async function main() {
    initTheme();
    wireNav();
    wireThemeToggle();
    wireSearch();
    wireCopy();
    $("#year").textContent = String(new Date().getFullYear());

    const [profile, projects] = await Promise.all([
      fetchJson("data/profile.json"),
      fetchJson("data/projects.json")
    ]);

    state.profile = profile;
    state.projects = projects;

    applyProfileLinks(profile);
    renderSkills(profile);
    renderFilters(projects);
    renderProjects();
    wireContactForm(profile);
  }

  main().catch(() => {
    const root = $("#projectGrid");
    if (root) {
      root.innerHTML = `
        <div class="panel" style="grid-column: 1 / -1;">
          <h3>Couldn’t load data</h3>
          <p>Please check that <code>data/profile.json</code> and <code>data/projects.json</code> exist and are valid JSON.</p>
        </div>
      `;
    }
  });
})();

