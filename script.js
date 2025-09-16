document.addEventListener('DOMContentLoaded', function () {

  // ==================== ÁUDIO ====================
  const audio = document.getElementById('bg-music');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeLabel = document.getElementById('volumeLabel');

  if (audio && playPauseBtn && volumeSlider) {
    audio.volume = volumeSlider.value;

    function updateVolumeLabel() {
      if (volumeLabel) {
        volumeLabel.textContent = `Volume: ${Math.round(audio.volume * 100)}%`;
      }
    }
    updateVolumeLabel();

    // Começa em 1:23
    audio.addEventListener('loadedmetadata', () => {
      audio.currentTime = 83;
    });

    // Tenta autoplay
    audio.play().catch(e => {
      console.log('Autoplay bloqueado pelo navegador.');
    });
    audio.muted = false;

    playPauseBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(e => {
          console.log('Erro ao tentar tocar:', e);
          alert('Seu navegador bloqueou o autoplay. Clique novamente ou interaja com a página.');
        });
        playPauseBtn.textContent = '⏸️';
        playPauseBtn.setAttribute('aria-label', 'Pausar música');
      } else {
        audio.pause();
        playPauseBtn.textContent = '▶️';
        playPauseBtn.setAttribute('aria-label', 'Tocar música');
      }
    });

    audio.addEventListener('ended', () => {
      playPauseBtn.textContent = '▶️';
      playPauseBtn.setAttribute('aria-label', 'Tocar música');
    });

    volumeSlider.addEventListener('input', () => {
      audio.volume = volumeSlider.value;
      updateVolumeLabel();
    });

    playPauseBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        playPauseBtn.click();
      }
    });
  }

  // ==================== MODAIS + VÍDEOS ====================
  function pauseVideosInModal(modal) {
    const iframes = modal.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      const src = iframe.src;
      iframe.src = '';
      iframe.src = src;
    });
  }

  document.querySelectorAll('.openPdfModal').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.style.display = "block";
        const firstFocusable = modal.querySelector('.close');
        if (firstFocusable) firstFocusable.focus();
      }
    });
  });

  document.querySelectorAll('.close').forEach(span => {
    span.addEventListener('click', () => {
      const targetId = span.getAttribute('data-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        pauseVideosInModal(modal);
        modal.style.display = "none";
      }
    });
  });

  window.addEventListener('click', (event) => {
    document.querySelectorAll('.modal').forEach(modal => {
      if (event.target === modal) {
        pauseVideosInModal(modal);
        modal.style.display = "none";
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        if (modal.style.display === 'block') {
          pauseVideosInModal(modal);
          modal.style.display = 'none';
        }
      });
    }
  });

  // ==================== PDF ====================
  document.querySelectorAll('.download').forEach(button => {
    button.addEventListener('click', () => {
      if (typeof window.jspdf === 'undefined') {
        alert('Biblioteca jsPDF não carregada.');
        return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const modalContent = button.closest('.modal-content');
      if (!modalContent) return;

      const titleElement = modalContent.querySelector('h2');
      const title = titleElement ? titleElement.innerText : 'Receita';
      const fileName = button.getAttribute('data-pdf') || 'receita.pdf';

      doc.setFontSize(20);
      doc.text(title, 14, 20);

      let y = 35;

      function addSection(doc, title, items, startY) {
        let currentY = startY;
        doc.setFontSize(14);
        doc.text(title, 14, currentY);
        currentY += 10;
        doc.setFontSize(12);
        items.forEach(item => {
          const lines = doc.splitTextToSize(`• ${item}`, 180);
          lines.forEach(line => {
            if (currentY > 280) {
              doc.addPage();
              currentY = 20;
            }
            doc.text(line, 14, currentY);
            currentY += 8;
          });
        });
        return currentY + 5;
      }

      const ingredientsSection = modalContent.querySelector('.recipe-text h3:nth-of-type(1)');
      const ingredientsList = modalContent.querySelectorAll('.recipe-text ul li');
      if (ingredientsSection && ingredientsList.length > 0) {
        const ingredientsTitle = ingredientsSection.innerText;
        const ingredients = Array.from(ingredientsList).map(li => li.innerText);
        y = addSection(doc, ingredientsTitle, ingredients, y);
      }

      const stepsSection = modalContent.querySelector('.recipe-text h3:nth-of-type(2)');
      const stepsList = modalContent.querySelectorAll('.recipe-text ol li');
      if (stepsSection && stepsList.length > 0) {
        const stepsTitle = stepsSection.innerText;
        const steps = Array.from(stepsList).map(li => li.innerText);
        y = addSection(doc, stepsTitle, steps, y);
      }

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Página ${i} de ${pageCount}`, 14, 290);
        doc.text('© Descubra Sabores do Mundo', 14, 295);
      }

      doc.save(fileName);
    });
  });

  // ==================== ACESSIBILIDADE ====================
  document.querySelector('.skip-link').addEventListener('click', function(e) {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
    }
  });

  // ==================== SCROLL SUAVE ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth'
        });
        
        if (href.startsWith('#modal')) {
          setTimeout(() => {
            const modal = document.querySelector(href);
            if (modal) modal.style.display = 'block';
          }, 500);
        }
      }
    });
  });

  // ==================== BOTÃO VOLTAR AO TOPO ====================
  const backToTopButton = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==================== ANIMAÇÃO DOS CARDS ====================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card-ramen').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

  // ==================== BUSCA ====================
  const searchInput = document.getElementById('searchInput');
  const cards = document.querySelectorAll('.card-ramen');

  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    cards.forEach(card => {
      const title = card.querySelector('h1').innerText.toLowerCase();
      card.style.display = title.includes(query) ? 'block' : 'none';
    });
  });

  // ==================== MODO ESCURO ====================
  const themeToggle = document.getElementById('themeToggle');

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    if (document.body.getAttribute('data-theme') === 'dark') {
      document.body.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
    } else {
      document.body.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
    }
  });

});