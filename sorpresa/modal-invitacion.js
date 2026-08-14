/**
 * modal-invitacion.js
 * Invitación al cine — aparece solo el 13 de agosto de 2026.
 * Una vez aceptada/cerrada, no vuelve a aparecer.
 */
(function () {
  const SHOW_DATE   = '2026-08-13';
  const STORAGE_KEY = 'invitacion_cine_13ago';

  function todayStr() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function shouldShow() {
    return todayStr() === SHOW_DATE && !localStorage.getItem(STORAGE_KEY);
  }

  function markSeen() {
    localStorage.setItem(STORAGE_KEY, '1');
  }

  function closeModal(accepted) {
    const overlay = document.getElementById('cine-overlay');
    if (!overlay) return;
    overlay.classList.add('cine-closing');
    setTimeout(() => overlay.remove(), 500);
    markSeen();

    if (accepted) {
      // Pequeña celebración con confetti dorado
      launchConfetti();
    }
  }

  function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      r: Math.random() * 8 + 4,
      color: ['#c9a84c','#f0d080','#e63946','#ffffff','#ff6b6b'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 4 + 2,
      drift: (Math.random() - 0.5) * 3,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6,
      shape: Math.random() > 0.5 ? 'circle' : 'rect'
    }));

    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speed;
        p.x += p.drift;
        p.rot += p.rotSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r / 2);
        }
        ctx.restore();
      });
      frame++;
      if (frame < 120) requestAnimationFrame(draw);
      else canvas.remove();
    }
    draw();
  }

  function createModal() {
    const overlay = document.createElement('div');
    overlay.id = 'cine-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Invitación al cine');

    overlay.innerHTML = `
      <div class="cine-ticket" id="cine-ticket">

        <!-- Franja superior temática -->
        <div class="cine-top">
          <div class="cine-web-left"  aria-hidden="true"></div>
          <div class="cine-web-right" aria-hidden="true"></div>
          <div class="cine-spider-icon" aria-hidden="true">🕷️</div>
          <div class="cine-badge">INVITACIÓN ESPECIAL</div>
          <h2 class="cine-movie-title">Spider‑Man</h2>
          <p class="cine-movie-sub">La película más esperada</p>
        </div>

        <!-- Perforación -->
        <div class="cine-perforation" aria-hidden="true">
          <span class="cine-circle left"></span>
          <div class="cine-dashes"></div>
          <span class="cine-circle right"></span>
        </div>

        <!-- Cuerpo del ticket -->
        <div class="cine-body">

          <div class="cine-info-row">
            <div class="cine-info-block">
              <span class="cine-info-label">FECHA</span>
              <span class="cine-info-value">Sáb 15 Ago</span>
            </div>
            <div class="cine-info-divider"></div>
            <div class="cine-info-block">
              <span class="cine-info-label">PARA</span>
              <span class="cine-info-value">Mi princesa 👑</span>
            </div>
            <div class="cine-info-divider"></div>
            <div class="cine-info-block">
              <span class="cine-info-label">LUGAR</span>
              <span class="cine-info-value">El mejor cine</span>
            </div>
          </div>

          <p class="cine-message">
            Mi reina, tienes una invitación especial para este sábado.<br/>
            Tú, yo y Spider‑Man 🍿
          </p>

          <div class="cine-barcode" aria-hidden="true">
            <div class="cine-barcode-lines"></div>
            <span class="cine-barcode-text">PRINCESA-∞ • 15AGO2026</span>
          </div>

        </div>

        <!-- Botones -->
        <div class="cine-actions">
          <button class="cine-btn-accept" id="cine-accept">¡Acepto ir! 🕷️</button>
          <button class="cine-btn-close"  id="cine-close" aria-label="Cerrar">Ya lo sé 😏</button>
        </div>

        <!-- X -->
        <button class="cine-x" id="cine-x" aria-label="Cerrar">✕</button>

      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('cine-accept').addEventListener('click', () => closeModal(true));
    document.getElementById('cine-close').addEventListener('click',  () => closeModal(false));
    document.getElementById('cine-x').addEventListener('click',     () => closeModal(false));
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(false); });
    document.addEventListener('keydown', function h(e) {
      if (e.key === 'Escape') { closeModal(false); document.removeEventListener('keydown', h); }
    });
  }

  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      /* ===== OVERLAY ===== */
      #cine-overlay {
        position: fixed;
        inset: 0;
        z-index: 9998;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: rgba(13,6,20,0.85);
        backdrop-filter: blur(10px);
        animation: cine-fade-in 0.5s ease both;
      }
      #cine-overlay.cine-closing { animation: cine-fade-out 0.4s ease forwards; }
      @keyframes cine-fade-in  { from { opacity:0 } to { opacity:1 } }
      @keyframes cine-fade-out { from { opacity:1 } to { opacity:0 } }

      /* ===== TICKET ===== */
      .cine-ticket {
        position: relative;
        width: 100%;
        max-width: 400px;
        background: #0f0a1a;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 25px 70px rgba(0,0,0,0.8), 0 0 0 1px rgba(230,57,70,0.3);
        animation: cine-slide-up 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
      }
      @keyframes cine-slide-up {
        from { opacity:0; transform: translateY(50px) scale(0.88); }
        to   { opacity:1; transform: translateY(0)   scale(1); }
      }

      /* ===== TOP ROJO ===== */
      .cine-top {
        background: linear-gradient(145deg, #8b0000, #e63946 50%, #c1121f);
        padding: 2rem 2rem 1.5rem;
        text-align: center;
        position: relative;
        overflow: hidden;
      }

      /* Telarañas decorativas */
      .cine-web-left, .cine-web-right {
        position: absolute;
        top: 0;
        width: 90px;
        height: 90px;
        opacity: 0.15;
        background:
          repeating-conic-gradient(
            from 0deg at 0% 0%,
            transparent 0deg,
            transparent 8deg,
            rgba(255,255,255,0.8) 8deg,
            rgba(255,255,255,0.8) 9deg
          );
      }
      .cine-web-left  { left: 0;  transform-origin: top left; }
      .cine-web-right { right: 0; transform: scaleX(-1); transform-origin: top right; }

      .cine-spider-icon {
        font-size: 3.2rem;
        margin-bottom: 0.4rem;
        display: block;
        animation: spider-bounce 2s ease-in-out infinite;
        position: relative;
        z-index: 1;
      }
      @keyframes spider-bounce {
        0%,100% { transform: translateY(0) rotate(-5deg); }
        50%      { transform: translateY(-8px) rotate(5deg); }
      }

      .cine-badge {
        font-size: 0.6rem;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.7);
        margin-bottom: 0.4rem;
        position: relative;
        z-index: 1;
      }

      .cine-movie-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 2.2rem;
        font-weight: 400;
        color: #fff;
        text-shadow: 0 0 30px rgba(255,255,255,0.4);
        margin: 0 0 0.2rem;
        position: relative;
        z-index: 1;
      }

      .cine-movie-sub {
        font-size: 0.75rem;
        color: rgba(255,255,255,0.65);
        letter-spacing: 0.1em;
        position: relative;
        z-index: 1;
      }

      /* ===== PERFORACIÓN ===== */
      .cine-perforation {
        display: flex;
        align-items: center;
        background: #0f0a1a;
      }
      .cine-circle {
        display: block;
        width: 22px; height: 22px;
        background: rgba(13,6,20,0.95);
        border-radius: 50%;
        flex-shrink: 0;
        border: 1px solid rgba(230,57,70,0.3);
      }
      .cine-circle.left  { margin-left:  -11px; border-left:  none; }
      .cine-circle.right { margin-right: -11px; border-right: none; }
      .cine-dashes {
        flex: 1;
        height: 1px;
        background: repeating-linear-gradient(
          to right,
          rgba(230,57,70,0.4) 0, rgba(230,57,70,0.4) 8px,
          transparent 8px, transparent 16px
        );
      }

      /* ===== BODY ===== */
      .cine-body {
        padding: 1.6rem 1.8rem 1rem;
      }

      .cine-info-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 1.4rem;
        background: rgba(230,57,70,0.06);
        border: 1px solid rgba(230,57,70,0.15);
        border-radius: 8px;
        padding: 0.9rem 1rem;
      }

      .cine-info-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
        flex: 1;
      }

      .cine-info-label {
        font-size: 0.58rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: rgba(230,57,70,0.7);
      }

      .cine-info-value {
        font-family: 'Cormorant Garamond', serif;
        font-size: 0.95rem;
        color: #f5f0ff;
        text-align: center;
        line-height: 1.2;
      }

      .cine-info-divider {
        width: 1px;
        height: 2rem;
        background: rgba(230,57,70,0.2);
      }

      .cine-message {
        font-family: 'Outfit', sans-serif;
        font-size: 0.95rem;
        font-weight: 200;
        line-height: 1.7;
        color: rgba(245,240,255,0.8);
        text-align: center;
        margin-bottom: 1.4rem;
      }

      /* Código de barras decorativo */
      .cine-barcode {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        margin-bottom: 0.4rem;
      }
      .cine-barcode-lines {
        width: 100%;
        height: 40px;
        background: repeating-linear-gradient(
          to right,
          rgba(245,240,255,0.9) 0, rgba(245,240,255,0.9) 2px,
          transparent 2px, transparent 4px,
          rgba(245,240,255,0.5) 4px, rgba(245,240,255,0.5) 5px,
          transparent 5px, transparent 8px
        );
        border-radius: 2px;
        opacity: 0.25;
      }
      .cine-barcode-text {
        font-size: 0.6rem;
        letter-spacing: 0.15em;
        color: rgba(245,240,255,0.3);
      }

      /* ===== BOTONES ===== */
      .cine-actions {
        display: flex;
        gap: 0.8rem;
        padding: 0 1.8rem 1.8rem;
        flex-wrap: wrap;
      }

      .cine-btn-accept {
        flex: 1;
        padding: 0.85rem 1rem;
        background: linear-gradient(135deg, #e63946, #c1121f);
        border: none;
        border-radius: 8px;
        color: #fff;
        font-family: 'Outfit', sans-serif;
        font-size: 0.9rem;
        font-weight: 400;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 4px 20px rgba(230,57,70,0.4);
      }
      .cine-btn-accept:hover {
        opacity: 0.9;
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(230,57,70,0.6);
      }

      .cine-btn-close {
        padding: 0.85rem 1rem;
        background: transparent;
        border: 1px solid rgba(245,240,255,0.15);
        border-radius: 8px;
        color: rgba(245,240,255,0.5);
        font-family: 'Outfit', sans-serif;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      .cine-btn-close:hover {
        border-color: rgba(245,240,255,0.35);
        color: rgba(245,240,255,0.85);
      }

      /* ===== X ===== */
      .cine-x {
        position: absolute;
        top: 0.8rem; right: 0.8rem;
        background: rgba(0,0,0,0.3);
        border: none;
        color: rgba(255,255,255,0.4);
        font-size: 0.9rem;
        cursor: pointer;
        padding: 0.3rem 0.5rem;
        border-radius: 4px;
        transition: color 0.2s;
        line-height: 1;
      }
      .cine-x:hover { color: rgba(255,255,255,0.9); }

      @media (max-width: 440px) {
        .cine-info-value { font-size: 0.8rem; }
        .cine-movie-title { font-size: 1.8rem; }
      }
    `;
    document.head.appendChild(s);
  }

  if (shouldShow()) {
    injectStyles();
    window.addEventListener('load', () => setTimeout(createModal, 900));
  }
})();
