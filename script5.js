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
const ctx = document.getElementById('progressChart').getContext('2d');
const getTotals = () => [1,2,3,4,5].map(i => {
  const data = JSON.parse(localStorage.getItem(`day${i}`)) || { income: 0, expense: 0 };
  return data.income - data.expense;
});

let progressChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['1 Day','2 Day','3 Day','4 Day','5 Day'],
    datasets: [{
      label: 'Saldo Harian (Rp)',
      data: getTotals(),
      borderColor: '#00ff88',
      backgroundColor: 'rgba(0,255,136,0.2)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#00ff88'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#e0e0e0' } } },
    scales: {
      x: { ticks: { color: '#ccc' }, grid: { color: '#333' } },
      y: { ticks: { color: '#ccc' }, grid: { color: '#333' } }
    }
  }
});

function updateChart() {
  progressChart.data.datasets[0].data = getTotals();
  progressChart.update();
}

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
