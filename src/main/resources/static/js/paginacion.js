function initPagination(containerId, pageSize) {
  pageSize = pageSize || 5;
  var container = document.getElementById(containerId);
  if (!container) return;

  var isTable = container.tagName === 'TBODY';
  var items = isTable
    ? Array.from(container.querySelectorAll('tr'))
    : Array.from(container.children);

  if (items.length <= pageSize) return;

  var totalPages = Math.ceil(items.length / pageSize);

  var nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Paginación');
  nav.className = 'mt-3';
  nav.innerHTML = '<ul class="pagination pagination-sm justify-content-center mb-0" id="pag-' + containerId + '"></ul>';

  var anchor = isTable
    ? (container.closest('.table-responsive') || container.closest('table'))
    : container;
  anchor.insertAdjacentElement('afterend', nav);

  function render(page) {
    items.forEach(function(item, i) {
      item.style.display = (i >= (page - 1) * pageSize && i < page * pageSize) ? '' : 'none';
    });
    buildControls(page);
  }

  function buildControls(page) {
    var ul = document.getElementById('pag-' + containerId);
    ul.innerHTML = '';
    addBtn(ul, '&laquo;', page - 1, page === 1, false);
    for (var p = 1; p <= totalPages; p++) {
      addBtn(ul, String(p), p, false, p === page);
    }
    addBtn(ul, '&raquo;', page + 1, page === totalPages, false);
  }

  function addBtn(ul, html, targetPage, disabled, active) {
    var li = document.createElement('li');
    li.className = 'page-item' + (disabled ? ' disabled' : '') + (active ? ' active' : '');
    var a = document.createElement('a');
    a.className = 'page-link';
    a.href = '#';
    a.innerHTML = html;
    if (!disabled) {
      (function(tp) {
        a.addEventListener('click', function(e) { e.preventDefault(); render(tp); });
      })(targetPage);
    }
    li.appendChild(a);
    ul.appendChild(li);
  }

  render(1);
}
