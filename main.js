// Renders the site from content.js. You shouldn't need to edit this file.
(function () {
  const P = window.PORTFOLIO || {};
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tags = (list) =>
    list && list.length ? `<div class="tags">${list.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : "";
  const meta = (...parts) => parts.filter(Boolean).map(esc).join(" · ");

  // ---------- Header / about ----------
  document.title = P.name ? `${P.name} · Portfolio` : "Portfolio";
  $("brand").textContent = P.name || "Portfolio";
  $("name").textContent = P.name || "";
  $("tagline").textContent = P.tagline || "";
  $("about").textContent = P.about || "";
  $("footer-name").textContent = P.name || "";
  $("year").textContent = new Date().getFullYear();
  if (P.photo) { $("photo").src = P.photo; $("photo").alt = P.name || ""; $("photo").hidden = false; }

  const L = P.links || {};
  const linkButtons = [
    L.cv && `<a class="btn primary" href="${esc(L.cv)}" target="_blank" rel="noopener">CV</a>`,
    L.email && `<a class="btn" href="mailto:${esc(L.email)}">Email</a>`,
    L.linkedin && `<a class="btn" href="${esc(L.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`,
    L.github && `<a class="btn" href="${esc(L.github)}" target="_blank" rel="noopener">GitHub</a>`,
  ].filter(Boolean).join("");
  $("hero-links").innerHTML = linkButtons;
  $("contact-links").innerHTML = linkButtons || `<p class="empty">Add your contact links in content.js.</p>`;

  // Hides a section and its menu link (used when a list in content.js is empty).
  function hideSection(id) {
    $(id).hidden = true;
    const link = document.querySelector(`.topbar nav a[href="#${id}"]`);
    if (link) link.hidden = true;
  }

  // ---------- Semester projects / Other projects / itch.io ----------
  // An itch.io entry can be just { itch: "https://name.itch.io/game" }: the title, cover and tags
  // are then fetched from itch.io. Anything written in content.js wins over what itch.io reports.
  const itchUrl = (u) => (/^https:\/\/[\w-]+\.itch\.io\/[\w-]+\/?$/.test(String(u || "")) ? String(u).replace(/\/+$/, "") : "");
  const webUrl = (u) => (/^https?:\/\//.test(String(u || "")) ? String(u) : "");
  function projectButtons(p, itch, url) {
    const btn = (href, label, primary) =>
      `<a class="btn${primary ? " primary" : ""}" href="${esc(href)}" target="_blank" rel="noopener">${label}</a>`;
    const list = [
      url && btn(url, itch ? "Play on itch.io" : "Open project", true),
      p.report && btn(p.report, "Read report", !url),
    ].filter(Boolean);
    return list.length ? `<div class="link-row">${list.join("")}</div>` : "";
  }

  // --- Semester and other projects: everything is laid out openly on the page. ---
  // Each project shows its title and summary, then every entry in "slides" as its own
  // block with a picture (or video) beside the text. Nothing needs to be clicked to be seen.
  const paragraphs = (t) => String(t || "").split(/\n\s*\n/).filter(Boolean).map((x) => `<p>${esc(x)}</p>`).join("");
  function partMedia(s) {
    if (s.video && youtubeId(s.video))
      return `<iframe src="https://www.youtube-nocookie.com/embed/${youtubeId(s.video)}" title="${esc(s.title)}" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    if (s.video) return `<video controls preload="metadata" src="${esc(s.video)}"></video>`;
    if (s.image) return `<img src="${esc(s.image)}" alt="${esc(s.title)}" loading="lazy">`;
    return "image" in s ? `<div class="placeholder">picture coming soon</div>` : "";
  }
  function showcase(p) {
    const parts = Array.isArray(p.slides) ? p.slides : [];
    // Project video if there is one, else the cover; no box at all when neither line is in content.js
    const top = p.video || "cover" in p ? partMedia({ title: p.title, video: p.video, image: p.cover }) : "";
    return `
      <header class="showcase-head${top ? " has-media" : ""}">
        <div>
          <div class="meta">${meta(p.semester, p.role, p.year)}</div>
          <h3>${esc(p.title || "Untitled project")}</h3>
          ${p.description ? `<p class="lead">${esc(p.description)}</p>` : ""}
          ${tags(p.tags)}
          ${projectButtons(p, "", webUrl(p.link))}
        </div>
        ${top ? `<div class="part-media">${top}</div>` : ""}
      </header>
      ${parts.map((s, i) => {
        const m = partMedia(s);
        return `
        <div class="part${m ? "" : " text-only"}">
          ${m ? `<div class="part-media">${m}</div>` : ""}
          <div class="part-text">
            <div class="meta">${String(i + 1).padStart(2, "0")}</div>
            ${s.title ? `<h4>${esc(s.title)}</h4>` : ""}
            ${paragraphs(s.text)}
          </div>
        </div>`;
      }).join("")}`;
  }
  function renderShowcases(list, sectionId, listId) {
    if (!list.length) { hideSection(sectionId); return; }
    $(listId).innerHTML = list.map((p) => `<article class="showcase">${showcase(p)}</article>`).join("");
  }

  // --- itch.io: compact cards in the sideways-scrolling row. ---
  function projectCard(p, loading) {
    const itch = itchUrl(p.itch);
    const url = itch || webUrl(p.link);
    const title = p.title || (itch ? itch.split("/").pop().replace(/-/g, " ") : "Untitled project");
    const cover = p.cover
      ? `<img class="cover" src="${esc(p.cover)}" alt="" loading="lazy">`
      : `<div class="cover placeholder">${loading ? "loading from itch.io…" : "cover coming soon"}</div>`;
    return `
      ${url ? `<a class="cover-link" href="${esc(url)}" target="_blank" rel="noopener" aria-label="${esc(title)}">${cover}</a>` : cover}
      <div class="card-body">
        <h3>${esc(title)}</h3>
        <div class="meta">${meta(p.role, p.year)}</div>
        ${p.description ? `<p class="desc">${esc(p.description)}</p>` : ""}
        ${tags((p.tags || []).slice(0, 6))}
        ${projectButtons(p, itch, url)}
      </div>`;
  }
  function renderProjects(list, sectionId, listId) {
    if (!list.length) { hideSection(sectionId); return; }
    const box = $(listId);
    box.innerHTML = list
      .map((p) => `<article class="card project">${projectCard(p, !!itchUrl(p.itch))}</article>`)
      .join("");
    list.forEach((p, i) => {
      const itch = itchUrl(p.itch);
      if (!itch) return;
      const card = box.children[i];
      const show = (d) => {
        card.innerHTML = projectCard({
          ...p,
          title: p.title || d.title,
          cover: p.cover || d.cover_image,
          tags: p.tags && p.tags.length ? p.tags : d.tags,
        });
      };
      // Show the copy remembered from the last visit straight away, then refresh it from itch.io.
      const saved = recall(itch);
      if (saved) show(saved);
      itchData(itch)
        .then((d) => { remember(itch, d); show(d); })
        .catch(() => { if (!saved) card.innerHTML = projectCard(p); }); // itch.io unreachable: show what content.js has
    });
  }
  // itch.io occasionally refuses a request, so try a few times before giving up.
  function itchData(itch, tries = 3) {
    return fetch(itch + "/data.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .catch((e) => (tries > 1
        ? new Promise((done) => setTimeout(done, 1200)).then(() => itchData(itch, tries - 1))
        : Promise.reject(e)));
  }
  function recall(itch) {
    try { return JSON.parse(localStorage.getItem("itch:" + itch)); } catch (e) { return null; }
  }
  function remember(itch, d) {
    try {
      localStorage.setItem("itch:" + itch, JSON.stringify({ title: d.title, cover_image: d.cover_image, tags: d.tags }));
    } catch (e) { /* private window or storage blocked: fine, just no remembered copy */ }
  }
  renderShowcases(P.semesterProjects || [], "semester", "semester-list");
  renderShowcases(P.otherProjects || [], "other", "other-list");
  renderProjects(P.itch || [], "itch", "itch-list");

  // Sideways-scrolling row: arrows page through it and hide at either end.
  (function () {
    const row = $("itch-list");
    const prev = document.querySelector(".row-prev");
    const next = document.querySelector(".row-next");
    function update() {
      const max = row.scrollWidth - row.clientWidth;
      prev.hidden = row.scrollLeft <= 4;
      next.hidden = row.scrollLeft >= max - 4;
    }
    const page = (dir) => row.scrollBy({ left: dir * row.clientWidth * 0.85, behavior: "smooth" });
    prev.addEventListener("click", () => page(-1));
    next.addEventListener("click", () => page(1));
    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  // ---------- Footer: social logo links ----------
  // Only the links that are filled in under "links" in content.js are shown.
  // Brand logo shapes are from the Simple Icons set (simpleicons.org, CC0); the email logo is Gmail's.
  (function () {
    const svg = (attrs, inner) => `<svg viewBox="0 0 24 24" width="22" height="22" ${attrs} aria-hidden="true">${inner}</svg>`;
    const brand = (d) => svg(`fill="currentColor"`, `<path d="${d}"/>`);
    const SOCIAL = [
      ["email", "Email", brand("M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"), "#EA4335"],
      ["linkedin", "LinkedIn", brand("M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"), "#0A66C2"],
      ["instagram", "Instagram", brand("M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"), "#FF0069"],
      ["github", "GitHub", brand("M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"), "#FFFFFF"],
      ["youtube", "YouTube", brand("M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"), "#FF0000"],
      ["itch", "itch.io", brand("M3.13 1.338C2.08 1.96.02 4.328 0 4.95v1.03c0 1.303 1.22 2.45 2.325 2.45 1.33 0 2.436-1.102 2.436-2.41 0 1.308 1.07 2.41 2.4 2.41 1.328 0 2.362-1.102 2.362-2.41 0 1.308 1.137 2.41 2.466 2.41h.024c1.33 0 2.466-1.102 2.466-2.41 0 1.308 1.034 2.41 2.363 2.41 1.33 0 2.4-1.102 2.4-2.41 0 1.308 1.106 2.41 2.435 2.41C22.78 8.43 24 7.282 24 5.98V4.95c-.02-.62-2.082-2.99-3.13-3.612-3.253-.114-5.508-.134-8.87-.133-3.362 0-7.945.053-8.87.133zm6.376 6.477a2.74 2.74 0 0 1-.468.602c-.5.49-1.19.795-1.947.795a2.786 2.786 0 0 1-1.95-.795c-.182-.178-.32-.37-.446-.59-.127.222-.303.412-.486.59a2.788 2.788 0 0 1-1.95.795c-.092 0-.187-.025-.264-.052-.107 1.113-.152 2.176-.168 2.95v.005l-.006 1.167c.02 2.334-.23 7.564 1.03 8.85 1.952.454 5.545.662 9.15.663 3.605 0 7.198-.21 9.15-.664 1.26-1.284 1.01-6.514 1.03-8.848l-.006-1.167v-.004c-.016-.775-.06-1.838-.168-2.95-.077.026-.172.052-.263.052a2.788 2.788 0 0 1-1.95-.795c-.184-.178-.36-.368-.486-.59-.127.22-.265.412-.447.59a2.786 2.786 0 0 1-1.95.794c-.76 0-1.446-.303-1.948-.793a2.74 2.74 0 0 1-.468-.602 2.738 2.738 0 0 1-.463.602 2.787 2.787 0 0 1-1.95.794h-.16a2.787 2.787 0 0 1-1.95-.793 2.738 2.738 0 0 1-.464-.602zm-2.004 2.59v.002c.795.002 1.5 0 2.373.953.687-.072 1.406-.108 2.125-.107.72 0 1.438.035 2.125.107.873-.953 1.578-.95 2.372-.953.376 0 1.876 0 2.92 2.934l1.123 4.028c.832 2.995-.266 3.068-1.636 3.07-2.03-.075-3.156-1.55-3.156-3.025-1.124.184-2.436.276-3.748.277-1.312 0-2.624-.093-3.748-.277 0 1.475-1.125 2.95-3.156 3.026-1.37-.004-2.468-.077-1.636-3.072l1.122-4.027c1.045-2.934 2.545-2.934 2.92-2.934zM12 12.714c-.002.002-2.14 1.964-2.523 2.662l1.4-.056v1.22c0 .056.56.033 1.123.007.562.026 1.124.05 1.124-.008v-1.22l1.4.055C14.138 14.677 12 12.713 12 12.713z"), "#FA5C5C"],
      ["x", "X", brand("M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"), "#FFFFFF"],
      ["facebook", "Facebook", brand("M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"), "#0866FF"],
      ["tiktok", "TikTok", brand("M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"), "#FFFFFF"],
      ["website", "Website", svg(`fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`, `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`)],
    ];
    // GitHub, X and TikTok are black marks; on this dark page their official white versions are used.
    const html = SOCIAL.map(([key, label, icon, color]) => {
      const tint = color ? ` style="--brand:${color}"` : "";
      const value = String(L[key] || "").trim();
      if (!value) return "";
      if (key === "email")
        return `<a href="mailto:${esc(value)}" aria-label="${label}" title="${label}"${tint}>${icon}</a>`;
      if (!webUrl(value)) return ""; // must be a full http(s) link
      return `<a href="${esc(value)}" target="_blank" rel="noopener" aria-label="${label}" title="${label}"${tint}>${icon}</a>`;
    }).join("");
    $("social").innerHTML = html;
    $("social").hidden = !html;
    $("social").classList.toggle("brand", P.brandColors !== false);
  })();

  // ---------- Videos ----------
  function youtubeId(url) {
    const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : "";
  }
  function vimeoId(url) {
    const m = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? m[1] : "";
  }
  function videoMedia(v) {
    const title = esc(v.title);
    if (v.youtube && youtubeId(v.youtube))
      return `<div class="media"><iframe src="https://www.youtube-nocookie.com/embed/${youtubeId(v.youtube)}" title="${title}" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
    if (v.vimeo && vimeoId(v.vimeo))
      return `<div class="media"><iframe src="https://player.vimeo.com/video/${vimeoId(v.vimeo)}" title="${title}" loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    if (v.file)
      return `<div class="media"><video controls preload="metadata"${v.thumb ? ` poster="${esc(v.thumb)}"` : ""}><source src="${esc(v.file)}" type="video/mp4"></video></div>`;
    return `<div class="media placeholder">Video coming soon</div>`;
  }
  const videos = P.videos || [];
  $("video-list").innerHTML = videos.length
    ? videos.map((v) => `
      <article class="card">
        ${videoMedia(v)}
        <div class="card-body">
          <h3>${esc(v.title)}</h3>
          <div class="meta">${meta(v.year)}</div>
          ${v.description ? `<p class="desc">${esc(v.description)}</p>` : ""}
          ${tags(v.tags)}
        </div>
      </article>`).join("")
    : `<p class="empty">No videos yet.</p>`;

  // ---------- Papers ----------
  const papers = P.papers || [];
  $("paper-list").innerHTML = papers.length
    ? papers.map((p, i) => `
      <article class="card paper">
        <h3>${esc(p.title)}</h3>
        <div class="meta">${meta(p.authors, p.venue, p.year)}</div>
        ${p.abstract ? `<p class="abstract">${esc(p.abstract)}</p>` : ""}
        <div class="link-row">
          ${p.file
            ? `<button class="btn primary" data-pdf="${i}">Read</button>
               <a class="btn" href="${esc(p.file)}" download>Download PDF</a>`
            : `<span class="meta">PDF coming soon</span>`}
          ${p.link ? `<a class="btn" href="${esc(p.link)}" target="_blank" rel="noopener">Publisher page</a>` : ""}
        </div>
        ${tags(p.tags)}
      </article>`).join("")
    : `<p class="empty">No papers yet.</p>`;

  const pdfViewer = $("pdfviewer");
  const isPhone = () => window.matchMedia("(max-width: 640px)").matches;
  $("paper-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-pdf]");
    if (!btn) return;
    const file = papers[+btn.dataset.pdf].file;
    // Phones can't show PDFs inside a page well, so open them in a new tab instead.
    if (isPhone()) { window.open(file, "_blank", "noopener"); return; }
    $("pdf-frame").src = file;
    pdfViewer.hidden = false;
  });
  function closePdf() { pdfViewer.hidden = true; $("pdf-frame").src = "about:blank"; }
  pdfViewer.querySelector(".lb-close").addEventListener("click", closePdf);
  pdfViewer.addEventListener("click", (e) => { if (e.target === pdfViewer) closePdf(); });

  // ---------- Images ----------
  const images = P.images || [];
  if (!images.length) hideSection("images");
  $("image-list").innerHTML = images.length
    ? images.map((img, i) => `
      <article class="card image-card" data-img="${i}" tabindex="0">
        ${img.file
          ? `<img class="thumb" src="${esc(img.file)}" alt="${esc(img.title)}" loading="lazy">`
          : `<div class="thumb placeholder">Image coming soon</div>`}
        <div class="card-body">
          <h3>${esc(img.title)}</h3>
          ${tags(img.tags)}
        </div>
      </article>`).join("")
    : `<p class="empty">No images yet.</p>`;

  const lb = $("lightbox");
  const shown = images.map((img, i) => ({ ...img, i })).filter((img) => img.file);
  let current = 0;
  function showImage(pos) {
    if (!shown.length) return;
    current = (pos + shown.length) % shown.length;
    const img = shown[current];
    $("lb-img").src = img.file;
    $("lb-img").alt = img.title || "";
    $("lb-cap").textContent = [img.title, img.caption].filter(Boolean).join(" — ");
    lb.hidden = false;
  }
  function openFromCard(card) {
    const pos = shown.findIndex((s) => s.i === +card.dataset.img);
    if (pos >= 0) showImage(pos);
  }
  $("image-list").addEventListener("click", (e) => {
    const card = e.target.closest("[data-img]");
    if (card) openFromCard(card);
  });
  $("image-list").addEventListener("keydown", (e) => {
    const card = e.target.closest("[data-img]");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openFromCard(card); }
  });
  lb.querySelector(".lb-close").addEventListener("click", () => (lb.hidden = true));
  lb.querySelector(".lb-prev").addEventListener("click", () => showImage(current - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => showImage(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.hidden = true; });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { lb.hidden = true; closePdf(); }
    if (!lb.hidden && e.key === "ArrowLeft") showImage(current - 1);
    if (!lb.hidden && e.key === "ArrowRight") showImage(current + 1);
  });
})();
