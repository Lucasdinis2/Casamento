/* Natan & Isadora — convite
   Configure os dados reais aqui. */
(() => {
  "use strict";

  const CONFIG = {
    pixKey: "02056758679",              // chave PIX
    // Cotas da lista de presentes: cada item é uma contribuição em PIX (valor null = valor livre)
    cotas: [
      { nome: "Lua de mel", texto: "ajude a viagem dos noivos", valor: 300 },
      { nome: "Casa nova", texto: "ajude a montar o nosso lar", valor: 200 },
      { nome: "Contribuição livre", texto: "o valor que você quiser", valor: null },
    ],
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
  $$(".rv").forEach((el) => io.observe(el));

  /* ---------- Brilho que segue o cursor na parte 1 ---------- */
  const part1 = $("#inicio");
  if (!reduce) {
    part1.addEventListener("pointermove", (e) => {
      const r = part1.getBoundingClientRect();
      part1.style.setProperty("--mx", `${e.clientX - r.left}px`);
      part1.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
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
    "DTEND:20270411T010000Z",   // até 22h em Brasília (ajuste se necessário)
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

  /* ---------- Painéis da parte 3: um aberto por vez ---------- */
  const pills = $$(".pill");
  pills.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const willOpen = panel.hidden;
      pills.forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        document.getElementById(other.getAttribute("aria-controls")).hidden = true;
      });
      if (willOpen) {
        panel.hidden = false;
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Lista de presentes: cotas em PIX (contribuições, não produtos) ---------- */
  const cotasEl = $("#cotas");
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  CONFIG.cotas.forEach((c) => {
    const li = document.createElement("li");
    li.className = "cota";
    const info = document.createElement("div");
    const h = document.createElement("h4");
    h.textContent = c.nome;
    const p = document.createElement("p");
    p.className = "desc";
    p.textContent = c.texto;
    info.append(h, p);
    const val = document.createElement("b");
    val.textContent = c.valor == null ? "valor livre" : brl(c.valor);
    li.append(info, val);
    cotasEl.appendChild(li);
  });

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

  /* ---------- Barra de progresso da rolagem ---------- */
  const progress = $("#progress");
  let ticking = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();
})();
