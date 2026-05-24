document.querySelectorAll('.puntaje-input').forEach(function (input) {
  input.addEventListener('input', function () {
    var targetId = this.getAttribute('data-target');
    var form = this.closest('form');
    var total = 0;
    form.querySelectorAll('.puntaje-input').forEach(function (i) {
      total += parseInt(i.value || 0) || 0;
    });
    var span = document.getElementById(targetId);
    if (span) span.textContent = total;
  });
});
