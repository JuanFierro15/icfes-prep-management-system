initPagination('tbodySimulacros', 5);

function abrirModalCrear() {
  var txt = document.getElementById('i18n-modal-new').textContent;
  document.getElementById('modalTitulo').innerHTML = '<i class="bi bi-file-earmark-plus me-2"></i>' + txt;
  document.getElementById('modalBotonTexto').textContent = document.getElementById('i18n-btn-save').textContent;
  document.getElementById('modalId').value = '';
  document.getElementById('modalTituloInput').value = '';
  document.getElementById('modalDescripcion').value = '';
  document.getElementById('modalFecha').value = '';
}

function abrirModalEditar(btn) {
  var txt = document.getElementById('i18n-modal-edit').textContent;
  document.getElementById('modalTitulo').innerHTML = '<i class="bi bi-pencil-square me-2"></i>' + txt;
  document.getElementById('modalBotonTexto').textContent = document.getElementById('i18n-btn-update').textContent;
  document.getElementById('modalId').value = btn.dataset.id;
  document.getElementById('modalTituloInput').value = btn.dataset.titulo;
  document.getElementById('modalDescripcion').value = btn.dataset.descripcion;
  document.getElementById('modalFecha').value = btn.dataset.fecha;
}
