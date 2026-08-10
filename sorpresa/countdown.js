/**
 * countdown.js
 * Cuenta atrás al Sábado 14 de agosto de 2026, medianoche hora local.
 * ⚠️  Ajusta la fecha/hora abajo si quieres cambiar el objetivo.
 */

(function () {
  // ─── TARGET ───────────────────────────────────────────────────────────────
  // Sábado 14 de agosto de 2026, a las 00:00:00 hora local
  const TARGET = new Date('2026-08-15T00:00:00');
  // ──────────────────────────────────────────────────────────────────────────

  const elDays    = document.getElementById('days');
  const elHours   = document.getElementById('hours');
  const elMinutes = document.getElementById('minutes');
  const elSeconds = document.getElementById('seconds');
  const elArrived = document.getElementById('arrived-message');
  const elGrid    = document.getElementById('countdown-grid');
  const elSubtitle = document.querySelector('.subtitle');
  const elDate     = document.querySelector('.target-date');
  const elCta      = document.getElementById('cta-diary');

  // Cache de últimos valores para animación de flip
  const prev = { days: null, hours: null, minutes: null, seconds: null };

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function animateFlip(el) {
    el.classList.remove('flip');
    // force reflow
    void el.offsetWidth;
    el.classList.add('flip');
  }

  function setUnit(el, key, value) {
    const str = pad(value);
    if (str !== prev[key]) {
      el.textContent = str;
      animateFlip(el);
      prev[key] = str;
    }
  }

  function tick() {
    const now  = new Date();
    const diff = TARGET - now;

    if (diff <= 0) {
      // ¡Llegó el día!
      if (elGrid)    elGrid.classList.add('hidden');
      if (elSubtitle) elSubtitle.classList.add('hidden');
      if (elDate)    elDate.classList.add('hidden');
      if (elCta)     elCta.classList.add('hidden');
      if (elArrived) elArrived.classList.remove('hidden');
      return; // Detenemos el contador
    }

    const totalSeconds = Math.floor(diff / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    setUnit(elDays,    'days',    d);
    setUnit(elHours,   'hours',   h);
    setUnit(elMinutes, 'minutes', m);
    setUnit(elSeconds, 'seconds', s);
  }

  // Corremos inmediatamente y luego cada segundo
  tick();
  setInterval(tick, 1000);
})();
