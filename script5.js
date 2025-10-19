// === Sidebar Toggle ===
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');

menuBtn.addEventListener('click', () => sidebar.classList.add('active'));
closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));

// === LOCAL STORAGE SETUP ===
let balance = parseInt(localStorage.getItem('balance')) || 0;
document.getElementById('balanceValue').textContent = balance;

// === SAVE BALANCE ===
document.getElementById('saveBalance').addEventListener('click', () => {
  const newBalance = parseInt(document.getElementById('balanceInput').value);
  if (!isNaN(newBalance)) {
    balance = newBalance;
    localStorage.setItem('balance', balance);
    document.getElementById('balanceValue').textContent = balance;
    updateChart();
  }
});

// contoh update manual:
function updateChart(days, values) {
  progressChart.data.labels = days;   // misal [1, 2, 3, 4]
  progressChart.data.datasets[0].data = values; // misal [1000, 2000, 1500, 3000]
  progressChart.update();
}

// contoh update manual:




// === DAY DATA MANAGEMENT ===
const dayCards = document.querySelectorAll('.card');
dayCards.forEach(card => {
  const day = card.dataset.day;
  const incomeInput = card.querySelector('.income');
  const expenseInput = card.querySelector('.expense');
  const totalEl = card.querySelector('.total');
  const savedData = JSON.parse(localStorage.getItem(`day${day}`)) || { income: 0, expense: 0 };

  // load saved
  incomeInput.value = savedData.income;
  expenseInput.value = savedData.expense;
  totalEl.textContent = savedData.income - savedData.expense;

  card.querySelector('.save-day').addEventListener('click', () => {
    const income = parseInt(incomeInput.value) || 0;
    const expense = parseInt(expenseInput.value) || 0;
    localStorage.setItem(`day${day}`, JSON.stringify({ income, expense }));
    totalEl.textContent = income - expense;
    updateChart();
  });
});

// === CHART.JS ===
// === Membuat Chart Harian (tanpa interpolasi) ===
const ctx = document.getElementById('progressChart').getContext('2d');
const progressChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [1, 2, 3, 4, 5, 6], // nanti diisi hari ke-1, ke-2, dst
    datasets: [{
      label: 'Saldo (Rp)',
      data: [],
      borderColor: '#00ff88',
      backgroundColor: 'rgba(0,255,136,0.1)',
      fill: true,
      tension: 0,         // 🔹 Hilangkan kurva halus (garis lurus antar titik)
      pointRadius: 5,     // 🔹 Perbesar titik data
      pointBackgroundColor: '#00ff88'
    }]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hari ke-',
          color: '#0f0'
        },
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255,255,255,0.1)'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Saldo (Rp)',
          color: '#0f0'
        },
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255,255,255,0.1)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff'
        }
      }
    }
  }
});

// === PROGRESS GOAL ===
const progressList = document.getElementById('progressList');
const addGoalBtn = document.getElementById('addGoal');
const goalTitle = document.getElementById('goalTitle');

function renderGoals() {
  const goals = JSON.parse(localStorage.getItem('goals')) || [];
  progressList.innerHTML = goals.map(goal =>
    `<div class="report-card"><h3>${goal}</h3><p>Progress aktif</p></div>`
  ).join('');
}

addGoalBtn.addEventListener('click', () => {
  const newGoal = goalTitle.value.trim();
  if (newGoal !== "") {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    goals.push(newGoal);
    localStorage.setItem('goals', JSON.stringify(goals));
    goalTitle.value = "";
    renderGoals();
  }
});

renderGoals();
updateChart();
