import { Chart, registerables } from 'chart.js';
import { Notify } from 'notiflix';

Chart.register(...registerables);

let weatherChart;

export async function initializeWeatherChart(data) {
  const ctx = document.getElementById('weatherChart').getContext('2d');

  try {
    // Extract the data for the next 5 days
    const filteredData = data.list
      .filter((item, index) => index % 8 === 0)
      .slice(0, 5);

    if (filteredData.length === 0) {
      throw new Error('No filtered data available');
    }

    const labels = filteredData.map(item => {
      const date = new Date(item.dt * 1000);
      return date.toLocaleDateString();
    });

    const temperatureData = filteredData.map(item => item.main.temp);
    const humidityData = filteredData.map(item => item.main.humidity);
    const windSpeedData = filteredData.map(item => item.wind.speed);
    const pressureData = filteredData.map(item => item.main.pressure);

    const datasets = [
      {
        label: 'Temperature, °C',
        data: temperatureData,
        borderColor: '#FF6B09',
        backgroundColor: '#FF6B09',
        pointBackgroundColor: '#FF6B09',
        pointBorderColor: '#FF6B09',
      },
      {
        label: 'Humidity, %',
        data: humidityData,
        borderColor: 'blue',
        backgroundColor: '#0906EB',
        pointBackgroundColor: '#0906EB',
        pointBorderColor: '#0906EB',
        hidden: true,
      },
      {
        label: 'Wind Speed, m/s',
        data: windSpeedData,
        borderColor: '#EA9A05',
        backgroundColor: '#EA9A05',
        pointBackgroundColor: '#EA9A05',
        pointBorderColor: '#EA9A05',
        hidden: true,
      },
      {
        label: 'Atmosphere Pressure, mm',
        data: pressureData,
        borderColor: '#067806',
        backgroundColor: '#067806',
        pointBackgroundColor: '#067806',
        pointBorderColor: '#067806',
        hidden: true,
      },
    ];

    // Calculate the maximum value from all datasets
    const allData = datasets.flatMap(dataset => dataset.data);
    const maxValue = Math.max(...allData);

    // Remove the previous chart instance if it exists
    if (weatherChart) {
      weatherChart.destroy();
    }

    weatherChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
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
              boxWidth: 15,
            },
            onClick: function (e, legendItem) {
              const index = legendItem.datasetIndex;
              const ci = this.chart;
              const meta = ci.getDatasetMeta(index);

              // See if the dataset is already hidden or not
              meta.hidden =
                meta.hidden === null ? !ci.data.datasets[index].hidden : null;

              // Update the chart
              ci.update();
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
            title: {
              display: true,
              text: 'Value of Indicators',
              color: '#ffffff54',
              font: {
                size: 14,
                lineHeight: 3,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    Notify.failure(`Failed to initialize weather chart: ${error.message}`);
  }
}
