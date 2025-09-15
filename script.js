// script.js

// Elementos
const modal = document.getElementById("pdfModal");
const openBtn = document.getElementById("openPdfModal");
const closeBtn = document.getElementById("closeModal");
const downloadBtn = document.getElementById("downloadPdf");

// Abrir modal
openBtn.onclick = function() {
  modal.style.display = "block";
}

// Fechar modal
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Baixar PDF (usando biblioteca jsPDF)
downloadBtn.onclick = function() {
  // Importando jsPDF dinamicamente (ou você pode baixar e linkar localmente)
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();
  
  // Adiciona título
  doc.setFontSize(20);
  doc.text("Receita: Ramen Caseiro", 14, 20);
  
  // Adiciona subtítulo
  doc.setFontSize(14);
  doc.text("Ingredientes (材料 - zairyō):", 14, 35);
  
  // Lista de ingredientes
  const ingredients = [
    "豚骨スープ (tonkotsu sūpu) — Caldo de porco",
    "麺 (men) — Macarrão",
    "味噌 (miso) — Pasta de soja fermentada",
    "卵 (tamago) — Ovo cozido"
  ];
  
  let y = 45;
  doc.setFontSize(12);
  ingredients.forEach(ing => {
    doc.text(`• ${ing}`, 14, y);
    y += 8;
  });
  
  // Modo de preparo
  doc.setFontSize(14);
  doc.text("Modo de Preparo (作り方 - tsukurikata):", 14, y += 10);
  
  const steps = [
    "鍋にスープを入れて沸かします。(Nabe ni sūpu o irete wakashimasu.) — Ferva o caldo na panela.",
    "麺を茹でます。(Men o yudemasu.) — Cozinhe o macarrão.",
    "器に盛り付けて、卵をのせます。(Utsuwa ni moritsukete, tamago o nosesmasu.) — Sirva em tigela e coloque o ovo por cima."
  ];
  
  y += 10;
  steps.forEach((step, i) => {
    doc.text(`${i+1}. ${step}`, 14, y);
    y += 8;
  });
  
  // Adiciona rodapé
  doc.setFontSize(10);
  doc.text("Cook & Learn — Aprenda idiomas cozinhando!", 14, y + 20);

  // Salva o PDF
  doc.save("receita-ramen-japones.pdf");
}