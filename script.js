// script.js — Atualizado para múltiplos modais e PDFs dinâmicos

document.addEventListener('DOMContentLoaded', function() {

  // ABRIR MODAL
  document.querySelectorAll('.openPdfModal').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const modal = document.getElementById(targetId);
      if (modal) modal.style.display = "block";
    });
  });

  // FECHAR MODAL (X)
  document.querySelectorAll('.close').forEach(span => {
    span.addEventListener('click', () => {
      const targetId = span.getAttribute('data-target');
      const modal = document.getElementById(targetId);
      if (modal) modal.style.display = "none";
    });
  });

  // FECHAR MODAL AO CLICAR FORA
  window.addEventListener('click', (event) => {
    document.querySelectorAll('.modal').forEach(modal => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // BAIXAR PDF — GERA PDF DINÂMICO COM BASE NO CONTEÚDO DO MODAL ATIVO
  document.querySelectorAll('.download').forEach(button => {
    button.addEventListener('click', () => {
      // Importa jsPDF dinamicamente (certifique-se de ter o script no HTML!)
      if (typeof window.jspdf === 'undefined') {
        alert('Biblioteca jsPDF não carregada. Verifique se o script está no HTML.');
        return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Encontra o modal pai do botão clicado
      const modalContent = button.closest('.modal-content');
      if (!modalContent) return;

      // Obtém o título da receita
      const titleElement = modalContent.querySelector('h2');
      const title = titleElement ? titleElement.innerText : 'Receita';

      // Define o nome do arquivo PDF
      const fileName = button.getAttribute('data-pdf') || 'receita.pdf';

      // Adiciona título principal
      doc.setFontSize(20);
      doc.text(title, 14, 20);

      let y = 35;

      // Função auxiliar para adicionar seções (ingredientes ou modo de preparo)
      function addSection(doc, title, items, startY) {
        let currentY = startY;
        doc.setFontSize(14);
        doc.text(title, 14, currentY);
        currentY += 10;
        doc.setFontSize(12);
        items.forEach(item => {
          // Quebra texto automaticamente se for muito longo
          const lines = doc.splitTextToSize(`• ${item}`, 180);
          lines.forEach(line => {
            if (currentY > 280) { // Nova página se necessário
              doc.addPage();
              currentY = 20;
            }
            doc.text(line, 14, currentY);
            currentY += 8;
          });
        });
        return currentY + 5;
      }

      // Extrai ingredientes
      const ingredientsSection = modalContent.querySelector('.recipe-text h3:nth-of-type(1)');
      const ingredientsList = modalContent.querySelectorAll('.recipe-text ul li');
      if (ingredientsSection && ingredientsList.length > 0) {
        const ingredientsTitle = ingredientsSection.innerText;
        const ingredients = Array.from(ingredientsList).map(li => li.innerText);
        y = addSection(doc, ingredientsTitle, ingredients, y);
      }

      // Extrai modo de preparo
      const stepsSection = modalContent.querySelector('.recipe-text h3:nth-of-type(2)');
      const stepsList = modalContent.querySelectorAll('.recipe-text ol li');
      if (stepsSection && stepsList.length > 0) {
        const stepsTitle = stepsSection.innerText;
        const steps = Array.from(stepsList).map(li => li.innerText);
        y = addSection(doc, stepsTitle, steps, y);
      }

      // Rodapé
      if (y > 270) doc.addPage();
      doc.setFontSize(10);
      doc.text("Cook & Learn — Aprenda idiomas cozinhando!", 14, y + 20);

      // Salva o PDF
      doc.save(fileName);
    });
  });

});