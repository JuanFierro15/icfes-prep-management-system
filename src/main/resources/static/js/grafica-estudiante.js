(function () {
  var canvas = document.getElementById('graficaSimulacro');
  if (!canvas) return;
  var ds = canvas.dataset;
  var titulo = ds.simTitulo ? (ds.lblResults + ' ' + ds.simTitulo) : ds.lblAll;
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: [ds.lblSociales, ds.lblNaturales, ds.lblMatematicas, ds.lblLectura, ds.lblIngles],
      datasets: [
        {
          label: ds.lblScore,
          data: [
            parseFloat(ds.sociales)    || 0,
            parseFloat(ds.naturales)   || 0,
            parseFloat(ds.matematicas) || 0,
            parseFloat(ds.lectura)     || 0,
            parseFloat(ds.ingles)      || 0
          ],
          backgroundColor: ['#4e79a7', '#59a14f', '#f28e2b', '#e15759', '#76b7b2'],
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: ds.lblMax,
          data: [100, 100, 100, 100, 100],
          type: 'line',
          borderColor: '#adb5bd',
          backgroundColor: 'transparent',
          borderDash: [6, 4],
          pointRadius: 0,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: titulo, font: { size: 14 } },
        legend: { display: false }
      },
      scales: {
        y: { min: 0, max: 100, ticks: { stepSize: 20 } }
      }
    }
  });
})();
