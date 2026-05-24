initPagination('tbodyInstituciones', 5);

document.getElementById('modalEditar').addEventListener('show.bs.modal', function (event) {
  var btn = event.relatedTarget;
  document.getElementById('editId').value          = btn.dataset.id;
  document.getElementById('editNombre').value      = btn.dataset.nombre;
  document.getElementById('editDireccion').value   = btn.dataset.direccion;
  document.getElementById('editFechaInicio').value = btn.dataset.fechaInicio || '';
  document.getElementById('editFechaFinal').value  = btn.dataset.fechaFinal  || '';
  document.getElementById('editEstado').value      = btn.dataset.estado || 'ACTIVO';
});
