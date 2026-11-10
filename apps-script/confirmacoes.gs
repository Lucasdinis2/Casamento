/**
 * Confirmação de presença — Isadora & Natan
 * Recebe as respostas do formulário do site e grava numa planilha do Google.
 *
 * COMO ATIVAR (uma vez só, uns 10 minutos):
 *  1. Entre na conta Google dos noivos e abra https://sheets.new
 *     Dê um nome à planilha, por exemplo "Confirmações — Casamento".
 *  2. No menu, clique em Extensões > Apps Script.
 *  3. Apague o que estiver no editor, cole TODO este arquivo e clique em Salvar (ícone de disquete).
 *  4. Clique em Implantar > Nova implantação.
 *     - Em "Selecionar tipo" (ícone de engrenagem), escolha "App da Web".
 *     - Executar como: Eu.
 *     - Quem pode acessar: Qualquer pessoa.
 *     - Clique em Implantar e autorize o acesso à planilha.
 *       O Google avisa que o app "não foi verificado" porque é um script de vocês mesmos:
 *       clique em "Avançado" e depois em "Acessar ... (não seguro)".
 *  5. Copie a "URL do app da Web" (termina em /exec).
 *  6. Abra essa URL no navegador. Deve aparecer "Confirmação de presença ativa" e a planilha
 *     ganha as abas "Confirmações" e "Resumo".
 *  7. Cole a URL em script.js, em CONFIG.rsvpEndpoint (ou mande para quem cuida do site).
 *
 * Se mudar este código depois: Implantar > Gerenciar implantações > lápis (editar) >
 * Versão: "Nova versão" > Implantar. Assim a URL continua a mesma.
 *
 * Abas criadas:
 *  - "Confirmações": uma linha por resposta.
 *  - "Resumo": total de pessoas confirmadas e de respostas, para o buffet e a cerimonialista.
 */

// ID da planilha: o trecho entre /d/ e /edit no endereço dela
const PLANILHA_ID = "1nEPzNrWyKIOHua8fK9FkhU0s9toskNGhlNpUmvafe3I";
const ABA = "Confirmações";
const CABECALHO = ["Data", "Nome", "Vai?", "Pessoas", "Acompanhantes", "Restrição alimentar", "WhatsApp", "Recado", "Convite"];

function doPost(e) {
  const p = (e && e.parameter) || {};
  // Campo escondido do formulário: só robôs preenchem
  if (p.site) return resposta({ ok: true });

  const nome = limpar(p.nome, 120);
  if (nome.length < 3) return resposta({ ok: false, erro: "nome" });
  const vai = p.vai === "sim";
  const pessoas = vai ? Math.min(10, Math.max(1, parseInt(p.pessoas, 10) || 1)) : 0;

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    abaConfirmacoes().appendRow([
      new Date(),
      nome,
      vai ? "Sim" : "Não",
      pessoas,
      limpar(p.acompanhantes, 500),
      limpar(p.restricao, 300),
      limpar(p.telefone, 40),
      limpar(p.recado, 1000),
      limpar(p.convite, 60),
    ]);
  } finally {
    lock.releaseLock();
  }
  return resposta({ ok: true });
}

// Abrir a URL no navegador confirma que está funcionando e já cria as abas
function doGet() {
  abaConfirmacoes();
  return resposta({ ok: true, mensagem: "Confirmação de presença ativa." });
}

function abaConfirmacoes() {
  const planilha = SpreadsheetApp.openById(PLANILHA_ID);
  let aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA, 0);
    aba.appendRow(CABECALHO);
    aba.setFrozenRows(1);
    aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight("bold");
    criarResumo(planilha);
  }
  return aba;
}

function criarResumo(planilha) {
  if (planilha.getSheetByName("Resumo")) return;
  const r = planilha.insertSheet("Resumo");
  const ref = "'" + ABA + "'!";
  r.getRange("A1:A4").setValues([
    ["Pessoas confirmadas"],
    ["Respostas \"vou\""],
    ["Respostas \"não vou\""],
    ["Total de respostas"],
  ]);
  const formulas = (s) => [
    ["=SUMIF(" + ref + "C:C" + s + "\"Sim\"" + s + ref + "D:D)"],
    ["=COUNTIF(" + ref + "C:C" + s + "\"Sim\")"],
    ["=COUNTIF(" + ref + "C:C" + s + "\"Não\")"],
    ["=COUNTA(" + ref + "B2:B)"],
  ];
  // Algumas planilhas em português só aceitam ";" entre os argumentos: tenta "," e confere
  r.getRange("B1:B4").setFormulas(formulas(","));
  SpreadsheetApp.flush();
  if (String(r.getRange("B1").getDisplayValue()).charAt(0) === "#") {
    r.getRange("B1:B4").setFormulas(formulas(";"));
  }
  r.getRange("A1:A4").setFontWeight("bold");
  r.autoResizeColumn(1);
}

// Apaga e recria a aba "Resumo" (rode pelo editor se as fórmulas derem erro)
function refazerResumo() {
  const planilha = SpreadsheetApp.openById(PLANILHA_ID);
  const r = planilha.getSheetByName("Resumo");
  if (r) planilha.deleteSheet(r);
  criarResumo(planilha);
}

// Corta o tamanho e impede que um texto vire fórmula na planilha
function limpar(valor, max) {
  const v = String(valor || "").trim().slice(0, max);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
