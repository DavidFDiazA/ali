/**
 * tarro.js
 * Tarro de notas de amor interactivo.
 * Al tocar el tarro, una nota sale volando con un mensaje aleatorio.
 */
(function () {

  // ─── LAS NOTAS ────────────────────────────────────────────────────────────
  const NOTAS = [
    {
      emoji: '💌',
      texto: 'Hola mi reina, estas notitas son para cuando estés pensando en mí y esté un poco ocupado. ¡Aquí estoy siempre, solo para ti!'
    },
    {
      emoji: '💍',
      texto: 'Esposa mía, te adoro con mi vida entera. Jamás dudes del amor que tengo por ti. Nunca, nunca, nunca.'
    },
    {
      emoji: '🏆',
      texto: 'Recuerda, esposa, que eres la mejor. En este mundo somos tú y yo como el mejor equipo del mundo. Nadie nos gana.'
    },
    {
      emoji: '🏠',
      texto: 'Mi reina hermosa, ya quiero que estemos en nuestra casa para poder disfrutarte más tiempo y poder crecer mucho más de lo que lo estamos haciendo. Te aseguro que lo vamos a lograr.'
    },
    {
      emoji: '😘',
      texto: 'Mi vida, no sabes las ganas de comerte a besos que tengo en este momento. Te adoro con mi vida, te amo un montón.'
    },
    {
      emoji: '✨',
      texto: 'Amor, esta es la última notita: eres el amor de todas mis vidas y quiero que nuestros hijos lo sepan. Tenemos una gran misión cuando los traigamos al mundo. ❤️'
    }
  ];

  let ultimaNota = -1;

  function notaAleatoria() {
    let idx;
    do { idx = Math.floor(Math.random() * NOTAS.length); }
    while (idx === ultimaNota && NOTAS.length > 1);
    ultimaNota = idx;
    return NOTAS[idx];
  }

  // ─── MOSTRAR NOTA ─────────────────────────────────────────────────────────
  function mostrarNota() {
    const nota = notaAleatoria();

    // Quitar nota anterior si existe
    const prev = document.getElementById('nota-card');
    if (prev) prev.remove();

    // Animar el tarro
    const jar = document.getElementById('tarro-jar');
    if (jar) {
      jar.classList.remove('tarro-shake');
      void jar.offsetWidth;
      jar.classList.add('tarro-shake');
    }

    // Crear la tarjeta
    const card = document.createElement('div');
    card.id = 'nota-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-label', 'Nota de amor');
    card.innerHTML = `
      <div class="nota-inner">
        <div class="nota-lines" aria-hidden="true"></div>
        <div class="nota-emoji">${nota.emoji}</div>
        <p class="nota-texto">${nota.texto}</p>
        <div class="nota-actions">
          <button class="nota-btn-otra" id="nota-otra">Otra notita 💛</button>
          <button class="nota-btn-cerrar" id="nota-cerrar" aria-label="Cerrar nota">Guardar ✕</button>
        </div>
      </div>
    `;

    // Insertar después del tarro
    const wrapper = document.getElementById('tarro-wrapper');
    if (wrapper) wrapper.appendChild(card);

    // Eventos
    document.getElementById('nota-otra').addEventListener('click', mostrarNota);
    document.getElementById('nota-cerrar').addEventListener('click', () => {
      card.classList.add('nota-saliendo');
      setTimeout(() => card.remove(), 400);
    });

    // Contador de notas vistas
    const counter = document.getElementById('tarro-counter');
    if (counter) {
      const vistas = (parseInt(counter.dataset.count || '0') + 1);
      counter.dataset.count = vistas;
      counter.textContent = `${vistas} nota${vistas === 1 ? '' : 's'} abierta${vistas === 1 ? '' : 's'}`;
    }
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  function init() {
    const btn = document.getElementById('tarro-jar');
    if (!btn) return;
    btn.addEventListener('click', mostrarNota);
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') mostrarNota(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
