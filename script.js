/* Isadora & Natan — convite
   Configure os dados reais aqui. */
(() => {
  "use strict";

  const CONFIG = {
    pixKey: "02056758679",            // chave PIX
    pixNome: "Isadora e Natan",       // nome de quem recebe; vai dentro do código PIX (até 25 letras)
    pixCidade: "Juiz de Fora",        // cidade de quem recebe (até 15 letras)
    // Confirmação de presença: URL do "app da Web" do Google Apps Script (termina em /exec).
    // Passo a passo em apps-script/confirmacoes.gs. Vazio = o formulário avisa que abre em breve.
    rsvpEndpoint: "https://script.google.com/macros/s/AKfycbwWVQu_2k3IecxDOhi5NdDflB1Gj7St0Gzil-P0zt37P0ziwkPnPmY_iP5nwrCMGRFgNw/exec",
    rsvpPrazo: "",                    // ex.: "10 de março de 2027"; vazio = não mostra prazo

    // Lista de presentes. Cada presente é pago por PIX direto para os noivos.
    // valor: em reais (null = valor livre) · cat: cozinha, casa, lua-de-mel, divertidos ou livre
    // icone: um dos nomes de ICONES, logo abaixo
    presentes: [
      { nome: "Air fryer", texto: "batata frita sem culpa", valor: 450, cat: "cozinha", icone: "airfryer" },
      { nome: "Cafeteira expresso", texto: "o primeiro café da casa nova", valor: 650, cat: "cozinha", icone: "cafe" },
      { nome: "Jogo de panelas", texto: "para os jantares a dois", valor: 600, cat: "cozinha", icone: "panela" },
      { nome: "Batedeira planetária", texto: "bolo de domingo garantido", valor: 550, cat: "cozinha", icone: "batedeira" },
      { nome: "Liquidificador", texto: "sucos, vitaminas e caipirinhas", valor: 250, cat: "cozinha", icone: "liquidificador" },
      { nome: "Micro-ondas", texto: "para esquentar a marmita", valor: 700, cat: "cozinha", icone: "microondas" },
      { nome: "Aparelho de jantar", texto: "para receber os amigos", valor: 450, cat: "cozinha", icone: "prato" },
      { nome: "Aspirador robô", texto: "ele limpa, a gente descansa", valor: 1300, cat: "casa", icone: "robo" },
      { nome: "Jogo de cama", texto: "noites bem dormidas", valor: 350, cat: "casa", icone: "cama" },
      { nome: "Kit de toalhas", texto: "macias e felpudas", valor: 220, cat: "casa", icone: "toalha" },
      { nome: "Jogo de taças", texto: "para brindar a vida a dois", valor: 200, cat: "casa", icone: "tacas" },
      { nome: "Passagem da lua de mel", texto: "um pedacinho da viagem", valor: 500, cat: "lua-de-mel", icone: "aviao" },
      { nome: "Jantar romântico", texto: "uma noite especial na viagem", valor: 300, cat: "lua-de-mel", icone: "jantar" },
      { nome: "Drinks ao pôr do sol", texto: "um brinde na beira do mar", valor: 150, cat: "lua-de-mel", icone: "tacas" },
      { nome: "Primeira pizza da casa", texto: "a gente promete dividir", valor: 120, cat: "divertidos", icone: "pizza" },
      { nome: "Um ano de streaming", texto: "maratonas a dois", valor: 300, cat: "divertidos", icone: "tv" },
      { nome: "Kit pós-festa", texto: "água de coco, café e descanso", valor: 90, cat: "divertidos", icone: "cafe" },
      { nome: "Contribuição livre", texto: "o valor que você quiser", valor: null, cat: "livre", icone: "presente" },
    ],
  };

  // Ícones de traço fino (24×24), na cor do texto ao redor
  const ICONES = {
    airfryer: '<rect x="6" y="3" width="12" height="18" rx="3"/><circle cx="12" cy="7.5" r="1.6"/><path d="M8.5 12.5h7v5.5h-7z"/><path d="M10.5 15h3"/>',
    cafe: '<path d="M5 9h11v4.5a5.5 5.5 0 0 1-11 0z"/><path d="M16 10.5h1.3a2.3 2.3 0 0 1 0 4.6H16"/><path d="M8.5 3.5c-.9 1 .9 1.9 0 3M11.5 3.5c-.9 1 .9 1.9 0 3"/><path d="M4 21h14"/>',
    panela: '<path d="M5 11h14v5.5a3.5 3.5 0 0 1-3.5 3.5h-7A3.5 3.5 0 0 1 5 16.5z"/><path d="M2.5 12.5H5M19 12.5h2.5"/><path d="M4 8.5h16"/><path d="M10.5 6h3"/>',
    batedeira: '<path d="M5 21h14"/><path d="M16.5 21V9.5"/><rect x="6" y="4.5" width="13" height="5" rx="2.5"/><path d="M8 13.5h6.5l-1 4.5H9z"/><path d="M11.2 9.5v4"/>',
    liquidificador: '<path d="M7 3h10l-1.5 10h-7z"/><path d="M8 13h8l1 7H7z"/><circle cx="12" cy="16.5" r="1"/>',
    microondas: '<rect x="3" y="5" width="18" height="13" rx="1.5"/><rect x="5.5" y="7.5" width="9.5" height="8" rx=".5"/><path d="M18 8.5h.01M18 11h.01M17.5 14h1"/>',
    robo: '<circle cx="12" cy="12" r="8.5"/><path d="M5.2 9.5h13.6"/><circle cx="12" cy="14.5" r="1.8"/>',
    cama: '<path d="M3 19V6"/><path d="M3 15h18v4"/><path d="M21 15v-2.5a2.5 2.5 0 0 0-2.5-2.5H11v5"/><circle cx="7" cy="12" r="1.8"/>',
    toalha: '<path d="M4 5h16"/><path d="M7 5v14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5"/><path d="M7 15h10"/><path d="M10 9h4"/>',
    prato: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
    tacas: '<path d="M4.5 3.5H10l-.4 4.2a2.35 2.35 0 0 1-4.7 0z"/><path d="M7.25 10.1V18M5.2 18h4.1"/><path d="M14 3.5h5.5l-.4 4.2a2.35 2.35 0 0 1-4.7 0z"/><path d="M16.75 10.1V18M14.7 18h4.1"/>',
    aviao: '<path d="M21 3 3 10.5l6.5 2.5L12 20z"/><path d="M21 3 9.5 13"/>',
    jantar: '<path d="M6 3v6a2.5 2.5 0 0 0 5 0V3"/><path d="M8.5 3v18"/><path d="M17.5 21V3c-2 1.4-3 4-3 7.5h3"/>',
    pizza: '<path d="M12 21 3.5 6a17 17 0 0 1 17 0z"/><path d="M5.6 9.6a13 13 0 0 1 12.8 0"/><circle cx="12" cy="12.5" r="1"/><circle cx="9.6" cy="11" r=".8"/><circle cx="14.4" cy="11.2" r=".8"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M8.5 21h7M12 17v4"/><path d="M10.5 8.8l4 2.2-4 2.2z"/>',
    presente: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18v-3H3z"/><path d="M12 6v14"/><path d="M12 6c-1.6-3-5-3-5-.9 0 1.6 2.4 1.7 5 .9zM12 6c1.6-3 5-3 5-.9 0 1.6-2.4 1.7-5 .9z"/>',
  };
  const svgIcone = (nome) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nome] || ICONES.presente}</svg>`;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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
    "PRODID:-//Isadora e Natan//Convite//PT-BR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:casamento-natan-isadora-20270410@convite",
    `DTSTAMP:${icsStamp()}`,
    "DTSTART:20270410T190000Z", // 16h em Brasília (UTC-3)
    "DTEND:20270411T010000Z",   // até 22h em Brasília (ajuste se necessário)
    `SUMMARY:${icsEscape("Casamento de Isadora Diniz e Natan Delgado")}`,
    `LOCATION:${icsEscape("Paróquia São Geraldo, Teixeiras, Juiz de Fora - MG")}`,
    `DESCRIPTION:${icsEscape("Cerimônia às 16h na Paróquia São Geraldo. Recepção às 18h no Gran Jardim, Salvaterra.")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const saveCalendar = () => {
    const url = URL.createObjectURL(new Blob([buildICS()], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "casamento-isadora-natan.ics";
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

  /* ---------- Código PIX copia e cola (padrão BR Code do Banco Central) ---------- */
  const tlv = (id, valor) => id + String(valor.length).padStart(2, "0") + valor;
  const semAcento = (s, max) => s.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "").toUpperCase().trim().slice(0, max);
  const crc16 = (s) => {
    let crc = 0xffff;
    for (let i = 0; i < s.length; i++) {
      crc ^= s.charCodeAt(i) << 8;
      for (let b = 0; b < 8; b++) crc = (crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1) & 0xffff;
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  };
  const pixCopiaECola = (valor) => {
    let p = tlv("00", "01")
      + tlv("26", tlv("00", "br.gov.bcb.pix") + tlv("01", CONFIG.pixKey.trim()))
      + tlv("52", "0000")
      + tlv("53", "986");
    if (valor) p += tlv("54", valor.toFixed(2));
    p += tlv("58", "BR")
      + tlv("59", semAcento(CONFIG.pixNome, 25))
      + tlv("60", semAcento(CONFIG.pixCidade, 15))
      + tlv("62", tlv("05", "***"))
      + "6304";
    return p + crc16(p);
  };

  const copiar = async (texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch (err) {
      return false;
    }
  };

  /* ---------- Janela de presente ---------- */
  const pay = $("#pay");
  const payCode = $("#payCode");
  const payStatus = $("#payStatus");
  $("#payKey").textContent = CONFIG.pixKey;
  let codigoAtual = "";
  let payTimer;
  const sayPay = (msg) => {
    payStatus.textContent = msg;
    clearTimeout(payTimer);
    payTimer = setTimeout(() => (payStatus.textContent = ""), 5000);
  };

  const abrirPresente = (g) => {
    $("#payTitle").textContent = g.nome;
    $("#payVal").textContent = g.valor == null ? "valor livre" : brl(g.valor);
    $("#payIco").innerHTML = svgIcone(g.icone);
    $("#payStep3").textContent = g.valor == null
      ? "Digite o valor que quiser e confirme."
      : "Confira o valor e confirme.";
    codigoAtual = pixCopiaECola(g.valor);
    payCode.value = codigoAtual;
    payCode.hidden = true;
    payStatus.textContent = "";
    if (typeof pay.showModal === "function") pay.showModal();
    else pay.setAttribute("open", "");
  };

  $("#payCopy").addEventListener("click", async () => {
    if (await copiar(codigoAtual)) {
      sayPay("Código copiado. Agora é só colar no app do banco. Muito obrigado!");
    } else {
      payCode.hidden = false;
      payCode.select();
      sayPay("Não deu para copiar sozinho. Selecione o código acima e copie.");
    }
  });
  $("#payKeyCopy").addEventListener("click", async () => {
    if (await copiar(CONFIG.pixKey)) sayPay("Chave copiada. Muito obrigado!");
    else sayPay(`Não foi possível copiar. A chave é ${CONFIG.pixKey}.`);
  });
  // Toque fora da janela fecha
  pay.addEventListener("click", (e) => { if (e.target === pay) pay.close(); });

  /* ---------- Lista de presentes ---------- */
  const giftsEl = $("#gifts");
  CONFIG.presentes.forEach((g) => {
    const li = document.createElement("li");
    li.className = "gift";
    li.dataset.cat = g.cat;
    const ico = document.createElement("span");
    ico.className = "g-ico";
    ico.innerHTML = svgIcone(g.icone);
    const h = document.createElement("h4");
    h.textContent = g.nome;
    const t = document.createElement("p");
    t.className = "g-txt";
    t.textContent = g.texto;
    const v = document.createElement("p");
    v.className = "g-val";
    v.textContent = g.valor == null ? "valor livre" : brl(g.valor);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "g-btn";
    b.textContent = "presentear";
    b.setAttribute("aria-label", `Presentear: ${g.nome}`);
    b.addEventListener("click", () => abrirPresente(g));
    li.append(ico, h, t, v, b);
    giftsEl.appendChild(li);
  });

  // Filtros por categoria (a contribuição livre aparece sempre)
  const chips = $$(".chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      const cat = chip.dataset.cat;
      $$(".gift", giftsEl).forEach((li) => {
        li.hidden = !(cat === "todos" || li.dataset.cat === cat || li.dataset.cat === "livre");
      });
    });
  });

  /* ---------- Confirmação de presença: formulário → planilha do Google ---------- */
  // Links por família (opcional): ...?convite=Família Silva&lugares=4
  const form = $("#rsvpForm");
  const rsvpMsg = $("#rsvpMsg");
  const rsvpSend = $("#rsvpSend");
  const ifSim = $("#ifSim");
  const ifMais = $("#ifMais");
  const pessoasSel = $("#rsvpPessoas");
  const params = new URLSearchParams(location.search);
  const convite = (params.get("convite") || "").trim().slice(0, 60);
  const lugaresParam = parseInt(params.get("lugares"), 10);
  const lugares = Math.min(10, Math.max(1, lugaresParam || 6));

  for (let n = 1; n <= lugares; n++) {
    const opt = document.createElement("option");
    opt.value = String(n);
    opt.textContent = n === 1 ? "só eu" : `${n} pessoas`;
    pessoasSel.appendChild(opt);
  }
  if (convite) {
    const c = $("#rsvpConvite");
    c.textContent = `Convite: ${convite}${lugaresParam ? ` · até ${lugares} ${lugares > 1 ? "pessoas" : "pessoa"}` : ""}`;
    c.hidden = false;
  }
  if (CONFIG.rsvpPrazo) {
    const pz = $("#rsvpPrazo");
    pz.textContent = `Por favor, responda até ${CONFIG.rsvpPrazo}.`;
    pz.hidden = false;
  }

  const atualizarCampos = () => {
    const vai = form.elements.vai.value === "sim";
    ifSim.hidden = !vai;
    ifMais.hidden = !(vai && Number(pessoasSel.value) > 1);
  };
  form.addEventListener("change", atualizarCampos);

  const avisar = (msg, campo) => {
    rsvpMsg.textContent = msg;
    if (campo) campo.focus();
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = new FormData(form);
    const nome = String(dados.get("nome") || "").trim();
    const vai = dados.get("vai");
    if (nome.length < 3) return avisar("Escreva seu nome completo, por favor.", form.elements.nome);
    if (!vai) return avisar("Conte pra gente se você vai.");
    if (!CONFIG.rsvpEndpoint) return avisar("A confirmação abre em breve. Tente de novo mais tarde.");

    const corpo = new URLSearchParams();
    for (const [k, v] of dados) corpo.append(k, String(v).trim());
    if (vai !== "sim") {
      corpo.set("pessoas", "0");
      corpo.delete("acompanhantes");
      corpo.delete("restricao");
    } else if (Number(dados.get("pessoas")) <= 1) {
      corpo.delete("acompanhantes");
    }
    corpo.append("convite", convite);

    rsvpSend.disabled = true;
    avisar("Enviando…");
    try {
      // Envio simples (form-urlencoded), aceito pelo Google sem pré-checagem de CORS
      const resp = await fetch(CONFIG.rsvpEndpoint, { method: "POST", body: corpo });
      const out = await resp.json();
      if (!out.ok) throw new Error(out.erro || "erro");
      const primeiro = nome.split(/\s+/)[0];
      $("#rsvpOkMsg").textContent = vai === "sim"
        ? `${primeiro}, sua presença está confirmada. Até o dia 10 de abril!`
        : `${primeiro}, obrigado por avisar. Vamos sentir sua falta!`;
      form.hidden = true;
      $("#rsvpOk").hidden = false;
      rsvpMsg.textContent = "";
    } catch (err) {
      avisar("Não conseguimos enviar agora. Confira sua internet e tente de novo.");
    } finally {
      rsvpSend.disabled = false;
    }
  });

  // Outra pessoa da família pode responder em seguida
  $("#rsvpAgain").addEventListener("click", () => {
    form.reset();
    atualizarCampos();
    $("#rsvpOk").hidden = true;
    form.hidden = false;
    form.elements.nome.focus();
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
