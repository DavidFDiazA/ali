/**
 * modal-cupon.js
 * Muestra un cupón sorpresa solo el 11 de agosto de 2026.
 * Una vez cerrado, no vuelve a aparecer ese día (localStorage).
 */
(function () {
  const SHOW_DATE  = '2026-08-11'; // Solo aparece este día
  const STORAGE_KEY = 'cupon_visto_11ago';

  function todayStr() {
    const d = new Date();
    return d.toISOString().slice(0, 10); // "2026-08-11"
  }

  function shouldShow() {
    return todayStr() === SHOW_DATE && !localStorage.getItem(STORAGE_KEY);
  }

  function markSeen() {
    localStorage.setItem(STORAGE_KEY, '1');
  }

  function closeModal() {
    const overlay = document.getElementById('cupon-overlay');
    if (!overlay) return;
    overlay.classList.add('cupon-closing');
    setTimeout(() => overlay.remove(), 500);
    markSeen();
  }

  function createModal() {
    // ---- Overlay ----
    const overlay = document.createElement('div');
    overlay.id = 'cupon-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Cupón sorpresa');

    overlay.innerHTML = `
      <div class="cupon-card" id="cupon-card">

        <!-- Cabecera -->
        <div class="cupon-header">
          <span class="cupon-badge">✦ EXCLUSIVO ✦</span>
          <div class="cupon-icon">🎟️</div>
          <h2 class="cupon-title">¡Tienes un cupón!</h2>
        </div>

        <!-- Separador perforado -->
        <div class="cupon-perforation" aria-hidden="true">
          <span class="cupon-circle left"></span>
          <div class="cupon-dashes"></div>
          <span class="cupon-circle right"></span>
        </div>

        <!-- Cuerpo del cupón -->
        <div class="cupon-body">
          <p class="cupon-text">
            Oye, ¡felicidades! 🎉<br/><br/>
            Tienes un cupón para gastarlo en <strong>lo que quieras</strong>, mi vida.<br/><br/>
            Guárdalo bien para que lo redimamos cuando quieras. ❤️
          </p>

          <div class="cupon-code">
            <span class="cupon-code-label">Tu cupón</span>
            <span class="cupon-code-value">PRINCESA-∞</span>
          </div>
        </div>

        <!-- Botón cerrar -->
        <button class="cupon-btn" id="cupon-close-btn" aria-label="Guardar cupón y cerrar">
          Guardar mi cupón 💛
        </button>

        <!-- X pequeña -->
        <button class="cupon-x" id="cupon-x-btn" aria-label="Cerrar">✕</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Eventos de cierre
    document.getElementById('cupon-close-btn').addEventListener('click', closeModal);
    document.getElementById('cupon-x-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    // Accesibilidad: cerrar con Escape
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', handler); }
    });
  }

  // Inyectar estilos
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* ====== OVERLAY ====== */
      #cupon-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: rgba(13, 6, 20, 0.82);
        backdrop-filter: blur(8px);
        animation: cupon-fade-in 0.5s ease-out both;
      }

      #cupon-overlay.cupon-closing {
        animation: cupon-fade-out 0.45s ease-in forwards;
      }

      @keyframes cupon-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      @keyframes cupon-fade-out {
        from { opacity: 1; }
        to   { opacity: 0; }
      }

      /* ====== TARJETA ====== */
      .cupon-card {
        position: relative;
        width: 100%;
        max-width: 420px;
        background: linear-gradient(160deg, #1a0a28 0%, #0d0614 100%);
        border: 1px solid rgba(201, 168, 76, 0.45);
        border-radius: 12px;
        overflow: hidden;
        box-shadow:
          0 0 0 1px rgba(201,168,76,0.1),
          0 20px 60px rgba(0,0,0,0.7),
          0 0 80px rgba(201,168,76,0.08);
        animation: cupon-slide-up 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      }

      @keyframes cupon-slide-up {
        from { opacity: 0; transform: translateY(40px) scale(0.92); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }

      /* ====== HEADER ====== */
      .cupon-header {
        background: linear-gradient(135deg, #1e0d32, #2d1854);
        padding: 2rem 2rem 1.5rem;
        text-align: center;
        border-bottom: 1px solid rgba(201,168,76,0.15);
      }

      .cupon-badge {
        display: inline-block;
        font-size: 0.62rem;
        letter-spacing: 0.3em;
        color: #c9a84c;
        text-transform: uppercase;
        margin-bottom: 0.8rem;
        opacity: 0.9;
      }

      .cupon-icon {
        font-size: 3rem;
        margin-bottom: 0.6rem;
        animation: cupon-bounce 2s ease-in-out infinite;
      }

      @keyframes cupon-bounce {
        0%, 100% { transform: translateY(0) rotate(-3deg); }
        50%       { transform: translateY(-6px) rotate(3deg); }
      }

      .cupon-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.8rem;
        font-weight: 300;
        font-style: italic;
        color: #f0d080;
        text-shadow: 0 0 20px rgba(201,168,76,0.4);
        margin: 0;
      }

      /* ====== PERFORACIÓN ====== */
      .cupon-perforation {
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 0;
        overflow: visible;
      }

      .cupon-circle {
        display: block;
        width: 22px;
        height: 22px;
        background: #0d0614;
        border-radius: 50%;
        flex-shrink: 0;
        position: relative;
        z-index: 2;
      }

      .cupon-circle.left  { margin-left: -11px; border: 1px solid rgba(201,168,76,0.3); border-left: none; }
      .cupon-circle.right { margin-right: -11px; border: 1px solid rgba(201,168,76,0.3); border-right: none; }

      .cupon-dashes {
        flex: 1;
        height: 1px;
        background: repeating-linear-gradient(
          to right,
          rgba(201,168,76,0.4) 0px,
          rgba(201,168,76,0.4) 8px,
          transparent 8px,
          transparent 16px
        );
      }

      /* ====== BODY ====== */
      .cupon-body {
        padding: 1.8rem 2rem 1.2rem;
        text-align: center;
      }

      .cupon-text {
        font-family: 'Outfit', sans-serif;
        font-size: 1rem;
        font-weight: 200;
        line-height: 1.75;
        color: rgba(245, 240, 255, 0.85);
        margin-bottom: 1.5rem;
      }

      .cupon-text strong {
        color: #f0d080;
        font-weight: 400;
      }

      /* Código del cupón */
      .cupon-code {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;
        padding: 0.8rem 2rem;
        border: 1px dashed rgba(201,168,76,0.5);
        border-radius: 6px;
        background: rgba(201,168,76,0.05);
      }

      .cupon-code-label {
        font-size: 0.65rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: rgba(245,240,255,0.5);
      }

      .cupon-code-value {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.5rem;
        font-weight: 300;
        letter-spacing: 0.15em;
        color: #f0d080;
        text-shadow: 0 0 15px rgba(201,168,76,0.5);
      }

      /* ====== BOTÓN ====== */
      .cupon-btn {
        display: block;
        width: calc(100% - 4rem);
        margin: 0 2rem 2rem;
        padding: 0.9rem 1.5rem;
        background: linear-gradient(135deg, #c9a84c, #f0d080);
        border: none;
        border-radius: 6px;
        color: #0d0614;
        font-family: 'Outfit', sans-serif;
        font-size: 0.9rem;
        font-weight: 400;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 4px 20px rgba(201,168,76,0.3);
      }

      .cupon-btn:hover {
        opacity: 0.92;
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(201,168,76,0.5);
      }

      .cupon-btn:active { transform: translateY(0); }

      /* ====== X CERRAR ====== */
      .cupon-x {
        position: absolute;
        top: 0.8rem;
        right: 0.8rem;
        background: transparent;
        border: none;
        color: rgba(245,240,255,0.35);
        font-size: 1rem;
        cursor: pointer;
        padding: 0.3rem 0.5rem;
        transition: color 0.2s ease;
        line-height: 1;
      }

      .cupon-x:hover { color: rgba(245,240,255,0.8); }

      /* ====== RESPONSIVE ====== */
      @media (max-width: 480px) {
        .cupon-card { border-radius: 10px; }
        .cupon-header { padding: 1.5rem 1.5rem 1.2rem; }
        .cupon-body { padding: 1.5rem 1.5rem 1rem; }
        .cupon-btn { width: calc(100% - 3rem); margin: 0 1.5rem 1.5rem; }
      }
    `;
    document.head.appendChild(style);
  }

  // Punto de entrada
  if (shouldShow()) {
    injectStyles();
    // Pequeño delay para que la página cargue primero
    window.addEventListener('load', function () {
      setTimeout(createModal, 800);
    });
  }
})();
