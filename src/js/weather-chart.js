document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('weatherChart').getContext('2d');

  const datasets = [
    {
      label: 'Temperature, °C',
      data: [-2, -3, -2.5, -3, -2.8],
      borderColor: '#FF6B09',
      backgroundColor: '#FF6B09',
      pointBackgroundColor: '#FF6B09',
      pointBorderColor: '#FF6B09',
    },
    {
      label: 'Humidity, %',
      data: [30, 40, 35, 38, 36],
      borderColor: 'blue',
      backgroundColor: '#0906EB',
      pointBackgroundColor: '#0906EB',
      pointBorderColor: '#0906EB',
    },
    {
      label: 'Wind Speed, m/s',
      data: [5, 7, 6, 8, 7],
      borderColor: '#EA9A05',
      backgroundColor: '#EA9A05',
      pointBackgroundColor: '#EA9A05',
      pointBorderColor: '#EA9A05',
    },
    {
      label: 'Atmosphere Pressure, mm',
      data: [300, 422, 261, 263, 761],
      borderColor: '#067806',
      backgroundColor: '#067806',
      pointBackgroundColor: '#067806',
      pointBorderColor: '#067806',
    },
  ];

  // Calculate the maximum value from all datasets
  const allData = datasets.flatMap(dataset => dataset.data);
  const maxValue = Math.max(...allData);

  const weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        'May 15, 2024',
        'May 16, 2024',
        'May 17, 2024',
        'May 18, 2024',
        'May 19, 2024',
      ],
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#ffffff54',
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleColor: '#ffffff54',
          bodyColor: '#ffffff54',
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#ffffff54',
            align: 'start',
          },
          grid: {
            color: 'rgba(255, 255, 255, .15)',
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            beginAtZero: true,
            max: maxValue,
            color: '#ffffff54',
          },
          grid: {
            color: 'rgba(255, 255, 255, .15)',
          },
        },
      },
    },
  });
});
