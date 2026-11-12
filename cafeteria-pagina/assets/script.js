/* ============================================================ */
/* ====================  TEMA CLARO/OSCURO  =================== */
/* ============================================================ */
(function(){
  const html = document.documentElement;
  const STORAGE_KEY = 'punto-encuentro-theme';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    html.setAttribute('data-theme', saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
})();

function initThemeToggle(){
  const html = document.documentElement;
  const STORAGE_KEY = 'punto-encuentro-theme';
  const toggles = document.querySelectorAll('.theme-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}

/* ============================================================ */
/* ====================  MENÚ MÓVIL  ========================== */
/* ============================================================ */
function initMenuMovil(){
  const btn = document.getElementById('btnHamburguesa');
  const menu = document.getElementById('menuMovil');
  const overlay = document.getElementById('overlayMenu');
  const cerrar = document.getElementById('btnCerrarMenu');
  if (!btn || !menu) return;

  function abrir(){
    menu.classList.add('abierto');
    if (overlay) overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function cerrarMenu(){
    menu.classList.remove('abierto');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', abrir);
  if (cerrar) cerrar.addEventListener('click', cerrarMenu);
  if (overlay) overlay.addEventListener('click', cerrarMenu);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarMenu();
  });
}

/* ============================================================ */
/* ====================  BUSCADOR CARTA  ====================== */
/* ============================================================ */
function initBuscadorCarta(){
  const input = document.getElementById('buscadorInput');
  const limpiar = document.getElementById('buscadorLimpiar');
  const sinRes = document.getElementById('sinResultados');
  if (!input) return;

  const items = document.querySelectorAll('.carta-item');
  const secciones = document.querySelectorAll('.carta-seccion');

  function filtrar(){
    const q = input.value.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let visiblesTotal = 0;

    items.forEach(item => {
      const texto = item.querySelector('.nombre').textContent.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (q === '' || texto.includes(q)) {
        item.classList.remove('oculto');
        visiblesTotal++;
      } else {
        item.classList.add('oculto');
      }
    });

    secciones.forEach(sec => {
      const visibles = sec.querySelectorAll('.carta-item:not(.oculto)').length;
      sec.style.display = visibles === 0 ? 'none' : '';
    });

    if (sinRes) {
      sinRes.classList.toggle('visible', visiblesTotal === 0 && q !== '');
    }

    if (limpiar) {
      limpiar.classList.toggle('visible', input.value !== '');
    }
  }

  input.addEventListener('input', filtrar);

  if (limpiar) {
    limpiar.addEventListener('click', () => {
      input.value = '';
      filtrar();
      input.focus();
    });
  }
}

/* ============================================================ */
/* ====================  HORARIO  ============================= */
/* ============================================================ */
function initHorario(){
  const contenedor = document.getElementById('horario');
  if (!contenedor) return;

  const horarioSemana = [
    { nombre: 'Lunes',     abierto: true,  horario: '6:00 – 22:30' },
    { nombre: 'Martes',    abierto: true,  horario: '6:00 – 22:30' },
    { nombre: 'Miércoles', abierto: true,  horario: '6:00 – 22:30' },
    { nombre: 'Jueves',    abierto: true,  horario: '6:00 – 22:30' },
    { nombre: 'Viernes',   abierto: true,  horario: '6:00 – 22:30' },
    { nombre: 'Sábado',    abierto: true,  horario: '7:00 – 22:30' },
    { nombre: 'Domingo',   abierto: false, horario: 'Cerrado' }
  ];

  const hoy = new Date().getDay();
  const indiceHoy = hoy === 0 ? 6 : hoy - 1;

  contenedor.innerHTML = horarioSemana.map((d, i) => `
    <div class="dia ${d.abierto ? '' : 'cerrado'} ${i === indiceHoy ? 'hoy' : ''}">
      <span class="nombre-dia">${d.nombre}</span>
      <span class="hora">${d.horario}</span>
    </div>
  `).join('');
}

/* ============================================================ */
/* ====================  INIT  ================================ */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMenuMovil();
  initBuscadorCarta();
  initHorario();
});