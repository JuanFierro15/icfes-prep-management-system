var instSelect     = document.getElementById('institucionSelect');
var filtroSalon    = document.getElementById('filtroSalon');
var salonSelect    = document.getElementById('salonSelect');
var tablaContainer = document.getElementById('tablaContainer');
var hint           = document.getElementById('filtroHint');
var hintMsg        = document.getElementById('filtroHintMsg');
var sinResultados  = document.getElementById('sinResultadosRow');
var filas          = document.querySelectorAll('#tablaContainer tbody tr:not(#sinResultadosRow)');

if (tablaContainer.querySelector('.alert')) {
  tablaContainer.style.display = 'block';
  hint.style.display = 'none';
}

function aplicarPaginacionFiltrada(matchingRows) {
  var existingNav = document.getElementById('pag-estudiantesTable');
  if (existingNav) existingNav.closest('nav').remove();

  var pageSize = 5;
  if (matchingRows.length <= pageSize) {
    matchingRows.forEach(function (r) { r.style.display = ''; });
    return;
  }

  var totalPages = Math.ceil(matchingRows.length / pageSize);
  var nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Paginación');
  nav.className = 'mt-3';
  nav.innerHTML = '<ul class="pagination pagination-sm justify-content-center mb-0" id="pag-estudiantesTable"></ul>';
  tablaContainer.querySelector('.table-responsive').insertAdjacentElement('afterend', nav);

  function renderPage(page) {
    matchingRows.forEach(function (row, i) {
      row.style.display = (i >= (page - 1) * pageSize && i < page * pageSize) ? '' : 'none';
    });
    var ul = document.getElementById('pag-estudiantesTable');
    ul.innerHTML = '';
    addPageBtn(ul, '&laquo;', page - 1, page === 1, false);
    for (var p = 1; p <= totalPages; p++) {
      addPageBtn(ul, String(p), p, false, p === page);
    }
    addPageBtn(ul, '&raquo;', page + 1, page === totalPages, false);
  }

  function addPageBtn(ul, html, tp, disabled, active) {
    var li = document.createElement('li');
    li.className = 'page-item' + (disabled ? ' disabled' : '') + (active ? ' active' : '');
    var a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.innerHTML = html;
    if (!disabled) {
      (function (t) {
        a.addEventListener('click', function (e) { e.preventDefault(); renderPage(t); });
      })(tp);
    }
    li.appendChild(a);
    ul.appendChild(li);
  }

  renderPage(1);
}

if (instSelect) {
  instSelect.addEventListener('change', function () {
    var instId = this.value;
    salonSelect.value = '';
    filtroSalon.classList.toggle('d-none', !instId);
    tablaContainer.style.display = 'none';
    hint.style.display = 'block';
    hintMsg.textContent = instId ? hintMsg.dataset.hint2 : hintMsg.dataset.hint1;
    var existingNav = document.getElementById('pag-estudiantesTable');
    if (existingNav) existingNav.closest('nav').remove();
  });

  salonSelect.addEventListener('change', function () {
    var instId = instSelect.value;
    var salon  = this.value;
    if (!instId || !salon) return;
    tablaContainer.style.display = 'block';
    hint.style.display = 'none';
    filas.forEach(function (fila) { fila.style.display = 'none'; });
    var matching = Array.from(filas).filter(function (fila) {
      return fila.dataset.institucion === instId && fila.dataset.salon === salon;
    });
    sinResultados.style.display = matching.length === 0 ? '' : 'none';
    if (matching.length > 0) aplicarPaginacionFiltrada(matching);
  });
}
