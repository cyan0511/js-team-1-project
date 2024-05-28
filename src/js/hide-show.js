const divContainer = document.querySelector('#more-info-data');

let isClicked = true;

function hideShow(event) {
  if (isClicked) {
    divContainer.style.display = 'block';
    isClicked = false;
  } else {
    divContainer.style.display = 'none';
    isClicked = true;
  }
}

// Chart Display Toggle
export function setupToggleChart() {
  const showChartButton = document.querySelector('.show-chart');
  const hideChartButton = document.querySelector('.hide-chart');
  const chartContainer = document.querySelector('.chart-container');
  const weatherChart = document.querySelector('#weatherChart');

  const toggleChart = show => {
    if (show) {
      chartContainer.classList.add('show');
      chartContainer.classList.remove('hide');
      setTimeout(() => {
        chartContainer.style.display = 'block';
        weatherChart.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      showChartButton.style.display = 'none';
    } else {
      chartContainer.classList.add('hide');
      chartContainer.classList.remove('show');
      chartContainer.style.display = 'none';
      showChartButton.style.display = 'flex';
    }
  };

  showChartButton.addEventListener('click', () => toggleChart(true));
  hideChartButton.addEventListener('click', () => toggleChart(false));
}
