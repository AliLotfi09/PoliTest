export const createPersonalityChart = (canvas, userTraits, leaderTraits, labels) => {
  const { Chart } = require('chart.js');
  
  return new Chart(canvas, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'شما',
          data: userTraits,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(0, 0, 0, 0.8)',
          borderWidth: 2
        },
        {
          label: 'رهبر منتخب',
          data: leaderTraits,
          backgroundColor: 'rgba(100, 100, 100, 0.1)',
          borderColor: 'rgba(100, 100, 100, 0.6)',
          borderWidth: 2,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true
        }
      }
    }
  });
};