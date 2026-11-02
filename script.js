/* Builds the card from config.js. No framework, no build step. */
const P = {
  phone:
    '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  down: '<path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  brief:
    '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  share:
    '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
  nfc: '<path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17"/>',
};
const ic = (k, c = "i") =>
  `<svg class="${c}" viewBox="0 0 24 24" aria-hidden="true">${P[k]}</svg>`;
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const ext = (h) =>
  /^https?:/.test(h) ? ' target="_blank" rel="noopener noreferrer"' : "";
const row = (k, label, text, href) =>
  `<li><a class="row" href="${esc(href)}"${ext(href)}><span class="ib">${ic(k)}</span><div><b>${esc(label)}</b><span>${esc(text)}</span></div></a></li>`;
const pretty = (p) => p.replace(/^\+63(\d{3})(\d{3})(\d{4})$/, "+63 $1 $2 $3");
const full = `${me.first} ${me.last}`;
const sloganHtml = esc(me.slogan || "").replace(/\bweb\b/i, "<em>$&</em>");
document.title = `${full} | Digital Business Card`;

/* ---------- theme: your accent color, with readable text picked automatically ---------- */
const root = document.documentElement;
root.dataset.card = me.theme === "light" ? "light" : "dark"; // own attribute, so the host page can’t switch our look
(function () {
  const n = parseInt((me.accent || "#ffb400").replace("#", ""), 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  root.style.setProperty("--accent", me.accent);
  root.style.setProperty("--on-accent", lum > 150 ? "#12151c" : "#ffffff");
})();

/* ---------- opening hours in your own time zone ---------- */
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const to12 = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}${m ? ":" + String(m).padStart(2, "0") : ""} ${h < 12 ? "AM" : "PM"}`;
};
function hoursInfo() {
  let d, min;
  try {
    const f = new Intl.DateTimeFormat("en-US", {
      timeZone: me.hours.tz,
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date());
    const g = (t) => f.find((p) => p.type === t).value;
    d = DAYS.indexOf(g("weekday"));
    min = (+g("hour") % 24) * 60 + +g("minute");
  } catch (e) {
    const n = new Date();
    d = n.getDay();
    min = n.getHours() * 60 + n.getMinutes();
  }
  const t = me.hours.week[d],
    c = (x) => x.split(":").reduce((a, b) => a * 60 + +b);
  const on = !!t && min >= c(t[0]) && min < c(t[1]);
  return {
    d,
    on,
    label: on ? `Open now, closes ${to12(t[1])}` : "Closed right now",
  };
}
const hi = me.hours ? hoursInfo() : null;

/* ---------- quick actions (max 4) ---------- */
const quick = [
  me.phone && ["phone", "Call", "tel:" + me.phone],
  me.phone && ["chat", "Text", "sms:" + me.phone],
  me.whatsapp && ["chat", "WhatsApp", "https://wa.me/" + me.whatsapp],
  me.viber && ["chat", "Viber", "viber://chat?number=%2B" + me.viber],
  me.email && ["mail", "Email", "mailto:" + me.email],
]
  .filter(Boolean)
  .slice(0, 4);

/* "Ask about this" link for each service: WhatsApp if you have it, otherwise email */
const ask = (s) => {
  const msg = `Hi ${me.first}, I’m interested in: ${s.name}`;
  return me.whatsapp
    ? "https://wa.me/" + me.whatsapp + "?text=" + encodeURIComponent(msg)
    : "mailto:" + me.email + "?subject=" + encodeURIComponent(msg);
};

/* ---------- tab content ---------- */
const tabs = [
  [
    "about",
    "About",
    `
    <div class="c wide">${me.headline ? `<p class="lead">${esc(me.headline)}</p>` : ""}<p class="bio">${esc(me.bio)}</p></div>
    ${me.skills.length ? `<div class="c"><h3>Skills</h3><ul class="tags">${me.skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>` : ""}
    ${me.links.length ? `<div class="c"><h3>Find me online</h3><ul class="list">${me.links.map((l) => row("link", l.label, l.url.replace(/^https?:\/\/(www\.)?/, ""), l.url)).join("")}</ul></div>` : ""}`,
  ],
  me.services.length && [
    "services",
    "Services",
    `<h2 class="sec">What I offer</h2>${me.services
      .map(
        (s, i) => `
    <div class="c svc-c"><span class="n">0${i + 1}</span><div><div class="top"><b>${esc(s.name)}</b>${s.price ? `<span class="price">${esc(s.price)}</span>` : ""}</div><p>${esc(s.desc)}</p>
    <a class="ask" href="${esc(ask(s))}"${ext(ask(s))}>Ask about this →</a></div></div>`,
      )
      .join("")}`,
  ],
  [
    "contact",
    "Contact",
    `
    <div class="c"><h3>Get in touch</h3><ul class="list">
      ${me.phone ? row("phone", "Mobile", pretty(me.phone), "tel:" + me.phone) : ""}
      ${me.email ? row("mail", "Email", me.email, "mailto:" + me.email) : ""}
      ${me.website ? row("globe", "Website", me.websiteLabel || me.website.replace(/^https?:\/\//, ""), me.website) : ""}
      ${me.address ? row("pin", "Address", me.address, "https://maps.google.com/?q=" + encodeURIComponent(me.address)) : ""}</ul></div>
    ${
      hi
        ? `<div class="c"><h3>Working hours</h3><p class="open ${hi.on ? "" : "off"}"><i></i>${hi.label}</p>
      <table class="hours">${[1, 2, 3, 4, 5, 6, 0]
        .map((d) => {
          const t = me.hours.week[d];
          return `<tr class="${d === hi.d ? "today" : ""}"><td>${DAYS[d]}</td><td>${t ? to12(t[0]) + " – " + to12(t[1]) : "Closed"}</td></tr>`;
        })
        .join("")}</table></div>`
        : ""
    }
    <div class="c wide"><h3>Send me your details</h3>
      <form id="xf"><label>Your name<input name="n" autocomplete="name" required></label>
        <label>Your phone or email<input name="c" autocomplete="email" required></label>
        <label>Message (optional)<textarea name="m"></textarea></label>
        <button class="btn primary" type="submit">Send my details</button></form></div>`,
  ],
  [
    "share",
    "Share",
    `<div class="c wide"><h2>Share this card</h2>
    <div class="qrwrap"><div id="qr" role="img" aria-label="QR code for this card"></div><p>Scan to open my card. Works on any phone, even without NFC.</p></div>
    <div class="btns"><button class="btn" id="share" type="button">Share</button><button class="btn" id="copy" type="button">Copy link</button></div></div>`,
  ],
].filter(Boolean);

const TI = {
  about: "user",
  services: "brief",
  contact: "phone",
  share: "share",
};

/* ---------- render ---------- */
document.getElementById("app").innerHTML = `
<div class="app"><div class="layout">
  <div class="left">
    <header class="face card-trigger">
      <div class="face-top">
        <div class="av">${me.photo ? `<button class="avatar photo-trigger" id="photo-trigger" type="button" aria-label="View larger photo of ${esc(full)}"><img src="${esc(me.photo)}" alt="${esc(full)}"></button>` : `<div class="avatar">${(me.first[0] + (me.last[0] || "")).toUpperCase()}</div>`}</div>
        ${ic("nfc", "nfc").replace("<svg ", '<svg fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" ')}
      </div>
      <h1>${esc(me.first)}<br>${esc(me.last)}</h1>
      <p class="role">${esc(me.title)}</p>
      <p class="co">${esc(me.company)}</p>
      ${me.slogan ? `<div class="face-slogan">${me.available ? `<span><i></i>${esc(me.available)}</span>` : ""}<p>${sloganHtml}</p></div>` : ""}
      <div class="face-foot"><span>${esc(pretty(me.phone || ""))}</span><button class="save-mini" id="save" type="button">${ic("down")}Save contact</button></div>
    </header>
    <nav class="quick" aria-label="Quick contact">${quick.map((q) => `<a href="${esc(q[2])}"${ext(q[2])}>${ic(q[0])}${q[1]}</a>`).join("")}</nav>
  </div>
  <div class="right">
    <div class="tabs" role="tablist" aria-label="Card sections"><span class="ind" aria-hidden="true"></span>${tabs.map((t) => `<button role="tab" id="t-${t[0]}" aria-controls="p-${t[0]}" aria-selected="false" tabindex="-1" data-id="${t[0]}">${ic(TI[t[0]])}<span>${t[1]}</span></button>`).join("")}</div>
    ${tabs.map((t) => `<section class="panel" role="tabpanel" id="p-${t[0]}" aria-labelledby="t-${t[0]}" hidden>${t[2]}</section>`).join("")}
  </div>
</div>${me.madeBy ? `<footer>Designed by ${esc(me.madeBy)}</footer>` : ""}</div>
<dialog class="card-modal" id="card-modal" aria-label="Business card preview"><button class="card-close" type="button" aria-label="Close card preview">Close</button><button class="card-flip" type="button" aria-label="Flip business card">Flip card</button><div class="business-card-scene"><div class="business-card-inner"><section class="business-card-side business-card-front"><div class="bc-brand-row"><span>${esc(me.company)}</span><i></i></div><div class="bc-front-main"><div class="bc-photo">${me.photo ? `<img src="${esc(me.photo)}" alt="${esc(full)}">` : `<span>${(me.first[0] + (me.last[0] || "")).toUpperCase()}</span>`}</div><div class="bc-identity"><p>${esc(me.title)}</p><h2>${esc(full)}</h2><div class="bc-rule"></div><ul><li>${esc(pretty(me.phone || ""))}</li><li>${esc(me.email || "")}</li><li>${esc(me.websiteLabel || "")}</li></ul></div></div></section><section class="business-card-side business-card-back"><div class="bc-monogram">${esc((me.first[0] + (me.last[0] || "")).toUpperCase())}</div><h2>${esc(me.company)}</h2><p>${esc(me.headline || me.title)}</p><span>${esc(me.websiteLabel || me.website.replace(/^https?:\/\//, ""))}</span></section></div></div></dialog>
${me.photo ? `<dialog class="photo-modal" id="photo-modal" aria-label="Larger profile photo"><button class="photo-close" type="button" aria-label="Close photo">×</button><img src="${esc(me.photo)}" alt="${esc(full)}"></dialog>` : ""}`;

const photoTrigger = document.getElementById("photo-trigger");
const profileCard = document.querySelector(".card-trigger");
const cardModal = document.getElementById("card-modal");
const openCard = () => { cardModal.classList.remove("is-flipped"); if (!cardModal.open) cardModal.showModal(); };
profileCard.addEventListener("click", openCard);
cardModal.querySelector(".card-close").addEventListener("click", () => cardModal.close());
cardModal.querySelector(".card-flip").addEventListener("click", () => cardModal.classList.toggle("is-flipped"));
cardModal.addEventListener("click", (e) => { if (e.target === cardModal) cardModal.close(); });

const photoModal = document.getElementById("photo-modal");
if (photoTrigger && photoModal) {
  const openPhoto = () => { if (!photoModal.open) photoModal.showModal(); };
  photoTrigger.addEventListener("click", (e) => { e.preventDefault(); e.stopImmediatePropagation(); openPhoto(); });
  photoModal.querySelector(".photo-close").addEventListener("click", () => photoModal.close());
  photoModal.addEventListener("click", (e) => {
    if (e.target === photoModal) photoModal.close();
  });
}

/* ---------- tabs (keyboard friendly, remembered in the link as #contact etc.) ---------- */
const tabEls = [...document.querySelectorAll('[role="tab"]')];
function show(id, focus, scroll) {
  if (!tabs.some((t) => t[0] === id)) id = tabs[0][0];
  tabEls.forEach((b) => {
    const on = b.dataset.id === id;
    b.setAttribute("aria-selected", on);
    b.tabIndex = on ? 0 : -1;
    if (on && focus) b.focus();
  });
  document
    .querySelectorAll(".panel")
    .forEach((p) => (p.hidden = p.id !== "p-" + id));
  moveInd();
  try {
    history.replaceState(null, "", "#" + id);
  } catch (e) {}
  if (scroll && matchMedia("(max-width:959px)").matches)
    document
      .getElementById("p-" + id)
      .scrollIntoView({ behavior: "smooth", block: "start" });
}
document.querySelector(".tabs").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b) {
    if (navigator.vibrate) navigator.vibrate(8);
    show(b.dataset.id, false, true);
  }
});
document.querySelector(".tabs").addEventListener("keydown", (e) => {
  const i = tabEls.findIndex((b) => b.getAttribute("aria-selected") === "true");
  const next = {
    ArrowRight: i + 1,
    ArrowLeft: i - 1,
    Home: 0,
    End: tabEls.length - 1,
  }[e.key];
  if (next !== undefined) {
    e.preventDefault();
    show(tabEls[(next + tabEls.length) % tabEls.length].dataset.id, true);
  }
});
const tabsEl = document.querySelector(".tabs"),
  ind = document.querySelector(".ind");
function moveInd() {
  // slide the highlight under the selected tab
  const sel = tabEls.find((b) => b.getAttribute("aria-selected") === "true");
  if (!sel) return;
  ind.style.setProperty("--x", sel.offsetLeft + "px");
  ind.style.setProperty("--w", sel.offsetWidth + "px");
}
addEventListener("resize", moveInd);
if (document.fonts) document.fonts.ready.then(moveInd);
show(location.hash.slice(1));
requestAnimationFrame(() =>
  requestAnimationFrame(() => tabsEl.classList.add("ready")),
);

/* ---------- toast ---------- */
const toastEl = document.getElementById("toast");
let tt;
const toast = (m) => {
  toastEl.textContent = m;
  toastEl.classList.add("show");
  clearTimeout(tt);
  tt = setTimeout(() => toastEl.classList.remove("show"), 3200);
};

/* ---------- contact file (vCard) ---------- */
const tz = (s) =>
  String(s)
    .replace(/[,;\\]/g, (m) => "\\" + m)
    .replace(/\n/g, "\\n");
const vcf = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  `N:${tz(me.last)};${tz(me.first)};;;`,
  `FN:${tz(full)}`,
  me.company && `ORG:${tz(me.company)}`,
  me.title && `TITLE:${tz(me.title)}`,
  me.phone && `TEL;TYPE=CELL,VOICE:${me.phone}`,
  me.email && `EMAIL;TYPE=INTERNET,WORK:${me.email}`,
  me.website && `URL:${me.website}`,
  ...me.links.map((l) => `URL;TYPE=${l.label.replace(/\W/g, "")}:${l.url}`),
  me.address && `ADR;TYPE=WORK:;;${tz(me.address)};;;;`,
  me.bio && `NOTE:${tz(me.bio)}`,
  "END:VCARD",
]
  .filter(Boolean)
  .join("\r\n");

document.getElementById("save").addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const file = new File([vcf], full.replace(/\s+/g, "-") + ".vcf", {
    type: "text/vcard",
  });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    // Opens the phone’s native contact/share sheet without downloading a file.
    try {
      await navigator.share({ files: [file], title: full });
      return;
    } catch (e) {
      if (e.name === "AbortError") return;
    }
  }
  toast("Open this card in a mobile browser to save the contact.");
});

/* ---------- share, copy, form, QR ---------- */
document.getElementById("share").addEventListener("click", async () => {
  try {
    await navigator.share({
      title: full,
      text: `${full}, ${me.title}`,
      url: location.href.split("#")[0],
    });
  } catch (e) {
    if (e.name !== "AbortError")
      toast("Sharing isn’t available here. Use Copy link.");
  }
});
document.getElementById("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(location.href.split("#")[0]);
    toast("Link copied");
  } catch (e) {
    toast("Couldn’t copy. Copy it from the address bar.");
  }
});
document.getElementById("xf").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `Hi ${me.first},\n\nMy name is ${f.get("n")}.\nReach me at: ${f.get("c")}\n\n${f.get("m") || ""}`;
  location.href = `mailto:${me.email}?subject=${encodeURIComponent("Nice to meet you, " + f.get("n"))}&body=${encodeURIComponent(body)}`;
});
function drawQR() {
  // called once the QR library has loaded
  try {
    const q = qrcode(0, "M");
    q.addData(location.href.split("#")[0]);
    q.make();
    document.getElementById("qr").innerHTML = q.createSvgTag({
      cellSize: 4,
      margin: 0,
      scalable: true,
    });
  } catch (e) {
    document.querySelector(".qrwrap").style.display = "none";
  }
}
if (window.qrcode) drawQR();

/* ---------- search engine data ---------- */
const ld = document.createElement("script");
ld.type = "application/ld+json";
ld.textContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: full,
  jobTitle: me.title,
  worksFor: { "@type": "Organization", name: me.company },
  email: me.email,
  telephone: me.phone,
  url: me.website,
  sameAs: me.links.map((l) => l.url),
});
document.head.appendChild(ld);

/* ---------- subtle 3D tilt on the card face (mouse devices only) ---------- */
if (
  matchMedia("(hover:hover) and (pointer:fine)").matches &&
  !matchMedia("(prefers-reduced-motion:reduce)").matches
) {
  const face = document.querySelector(".face");
  face.addEventListener("pointermove", (e) => {
    const r = face.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    face.style.setProperty("--ry", x * 7 + "deg");
    face.style.setProperty("--rx", -y * 7 + "deg");
  });
  face.addEventListener("pointerleave", () => {
    face.style.setProperty("--ry", "0deg");
    face.style.setProperty("--rx", "0deg");
  });
}
