/* Natan & Isadora — convite
   Configure os dados reais aqui. */
(() => {
  "use strict";

  const CONFIG = {
    weddingISO: "2027-04-10T16:00:00-03:00",
    pixKey: "COLE-SUA-CHAVE-PIX-AQUI", // chave PIX real (CPF, e-mail, telefone ou aleatória)
    rsvpUrl: "",                        // link do formulário ou do WhatsApp para confirmar presença
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Abertura do convite ---------- */
  const opening = $("#opening");
  const envelope = $("#envelope");

  // Faíscas que saem do selo quando o convite abre
  const sparkle = () => {
    if (reduce) return;
    const r = envelope.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.58;
    for (let i = 0; i < 24; i++) {
      const p = document.createElement("i");
      p.className = "spark";
      const a = Math.random() * Math.PI * 2;
      const d = 90 + Math.random() * 170;
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      p.style.setProperty("--x", `${(Math.cos(a) * d).toFixed(1)}px`);
      p.style.setProperty("--y", `${(Math.sin(a) * d - 50).toFixed(1)}px`);
      p.style.setProperty("--s", `${(3 + Math.random() * 5).toFixed(1)}px`);
      p.style.animationDelay = `${(Math.random() * 0.3).toFixed(2)}s`;
      opening.appendChild(p);
      setTimeout(() => p.remove(), 2400);
    }
  };

  const openInvite = () => {
    if (opening.classList.contains("is-open")) return;
    opening.classList.add("is-open");
    sparkle();
    document.body.classList.add("ready");
    setTimeout(() => {
      document.body.classList.remove("locked");
      opening.classList.add("gone");
    }, reduce ? 0 : 1700);
  };
  envelope.addEventListener("click", openInvite);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvite(); }
  });

  /* ---------- Nome da capa, letra por letra (acessível: o nome fica no aria-label) ---------- */
  const heroNames = $(".hero-names");
  if (heroNames && !reduce) {
    heroNames.setAttribute("aria-label", heroNames.textContent.replace(/\s+/g, " ").trim());
    let n = 0;
    const splitNode = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) {
              frag.appendChild(document.createTextNode(tok));
              return;
            }
            // Cada palavra fica num bloco sem quebra, para o nome não partir no meio
            const word = document.createElement("span");
            word.className = "w";
            [...tok].forEach((ch) => {
              const i = document.createElement("i");
              i.className = "ch";
              i.setAttribute("aria-hidden", "true");
              i.style.setProperty("--i", n++);
              i.textContent = ch;
              word.appendChild(i);
            });
            frag.appendChild(word);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          splitNode(child);
        }
      });
    };
    splitNode(heroNames);
  }

  /* ---------- Revelação ao rolar (com atraso em grupos) ---------- */
  $$(".stagger").forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty("--d", `${i * 0.14}s`));
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  $$(".rv, .rv-clip").forEach((el) => io.observe(el));

  /* ---------- Contagem regressiva ---------- */
  const target = new Date(CONFIG.weddingISO).getTime();
  const nums = { d: $('[data-k="d"]'), h: $('[data-k="h"]'), m: $('[data-k="m"]'), s: $('[data-k="s"]') };

  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    const parts = {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
    for (const k of Object.keys(parts)) {
      const txt = String(parts[k]).padStart(k === "d" ? 3 : 2, "0");
      const el = nums[k];
      if (el.textContent === txt) continue;
      el.textContent = txt;
      if (!reduce) {
        el.classList.remove("bump");
        void el.offsetWidth; // reinicia a animação
        el.classList.add("bump");
      }
    }
  };
  tick();
  setInterval(tick, 1000);

  /* ---------- Calendário de abril de 2027 ---------- */
  const calGrid = $("#calGrid");
  if (calGrid) {
    const first = new Date(2027, 3, 1).getDay(); // 0 = domingo
    const days = new Date(2027, 4, 0).getDate();
    let html = ["D", "S", "T", "Q", "Q", "S", "S"].map((d) => `<span class="dow">${d}</span>`).join("");
    for (let i = 0; i < first; i++) html += "<span></span>";
    for (let d = 1; d <= days; d++) {
      html += `<span class="${d === 10 ? "hit" : ""}">${d}</span>`;
    }
    calGrid.innerHTML = html;
  }

  /* ---------- Salvar na agenda (.ics gerado no próprio navegador) ---------- */
  const icsEscape = (s) => s.replace(/[\\;,]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
  const icsStamp = () => new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const buildICS = () => [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Natan e Isadora//Convite//PT-BR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:casamento-natan-isadora-20270410@convite",
    `DTSTAMP:${icsStamp()}`,
    "DTSTART:20270410T190000Z", // 16h em Brasília (UTC-3)
    "DTEND:20270411T010000Z",   // até 22h em Brasília
    `SUMMARY:${icsEscape("Casamento de Natan e Isadora")}`,
    `LOCATION:${icsEscape("Paróquia São Geraldo, Teixeiras, Juiz de Fora - MG")}`,
    `DESCRIPTION:${icsEscape("Cerimônia às 16h na Paróquia São Geraldo. Recepção no Gran Jardim, Salvaterra.")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const saveCalendar = () => {
    const url = URL.createObjectURL(new Blob([buildICS()], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "casamento-natan-isadora.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  $$("[data-cal]").forEach((btn) => btn.addEventListener("click", saveCalendar));

  /* ---------- Contribuição por PIX ---------- */
  const pixEl = $("#pixKey");
  const pixStatus = $("#pixStatus");
  const pixBtn = $("#pixCopy");
  pixEl.textContent = CONFIG.pixKey;
  let pixTimer;
  const sayPix = (msg) => {
    pixStatus.textContent = msg;
    clearTimeout(pixTimer);
    pixTimer = setTimeout(() => (pixStatus.textContent = ""), 2800);
  };
  pixBtn.addEventListener("click", async () => {
    const key = CONFIG.pixKey.trim();
    if (key.startsWith("COLE-")) return sayPix("Chave PIX ainda não configurada.");
    try {
      await navigator.clipboard.writeText(key);
      sayPix("Chave copiada. Muito obrigado!");
    } catch (err) {
      sayPix("Não foi possível copiar. Copie a chave manualmente.");
    }
  });

  /* ---------- Confirmação de presença ---------- */
  const rsvpBtn = $("#rsvpBtn");
  const rsvpMsg = $("#rsvpMsg");
  rsvpBtn.addEventListener("click", () => {
    if (CONFIG.rsvpUrl) window.open(CONFIG.rsvpUrl, "_blank", "noopener");
    else rsvpMsg.textContent = "O link de confirmação chega em breve.";
  });

  /* ---------- Brilho que segue o cursor na capa ---------- */
  const hero = $("#inicio");
  if (!reduce) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
      hero.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  }

  /* ---------- Rolagem: progresso, história horizontal, parallax ---------- */
  const progress = $("#progress");
  const story = $("#historia");
  const track = $(".track", story);
  const storyBar = $(".story-bar i", story);
  const parallaxEls = $$("[data-speed]");

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;

    if (!reduce) {
      const r = story.getBoundingClientRect();
      const total = story.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const dist = Math.max(0, track.scrollWidth - innerWidth);
      track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
      storyBar.style.transform = `scaleX(${p.toFixed(4)})`;

      const vh = innerHeight;
      parallaxEls.forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.bottom < 0 || b.top > vh) return;
        const offset = (b.top + b.height / 2 - vh / 2) * parseFloat(el.dataset.speed);
        const img = el.querySelector("img");
        if (img) img.style.transform = `translate3d(0,${offset.toFixed(1)}px,0) scale(1.14)`;
      });
    }
  };

  let ticking = false;
  const requestScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
  };
  addEventListener("scroll", requestScroll, { passive: true });
  addEventListener("resize", requestScroll);
  onScroll();
})();
