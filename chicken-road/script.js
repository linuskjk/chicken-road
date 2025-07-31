let currentPosition = 0;
let currentMultiplier = 1.0;
let totalMoves = 0;
let maxMoves = 20;
let balance = 0;
let bet = 1;
let runActive = false;
let originalBet = 0;

function getBurnChance(difficulty) {
  // Burning chance per move
  return { easy: 0.25, medium: 0.35, hard: 0.50 }[difficulty];
}

function getMultipliers(difficulty) {
  // Start low, increase faster for harder modes
  if (difficulty === "easy") {
    return [1.1, 1.15, 1.2, 1.3, 1.4, 1.5, 2.0, 2.25, 2.4, 2.55, 2.75, 3.0, 3.25, 3.5, 3.8, 4.0, 4.5, 5.5, 7.0, 10.0];
    } else if (difficulty === "medium") {
    return [1.2, 1.35, 1.5, 1.7, 1.9, 2.1, 2.5, 3.0, 3.5, 4.0, 4.7, 5.5, 6.3, 7.2, 8.2, 10.0, 13.0, 16.0, 20.0, 25.0];
    } else { // hard
    return [1.3, 1.5, 1.7, 2.0, 2.3, 2.7, 3.2, 4.0, 5.0, 6.2, 7.5, 9.0, 11.0, 14.0, 17.0, 21.0, 26.0, 32.0, 40.0, 50.0];
  }
}

function updateBurnChanceDisplay() {
  const difficulty = document.getElementById('difficulty').value;
  const burnChance = getBurnChance(difficulty);
  document.getElementById('burnChanceDisplay').textContent = `🔥 Burn chance: ${Math.round(burnChance * 100)}%`;
}

function setupRoad() {
  const road = document.getElementById('road');
  road.innerHTML = '';
  currentPosition = 0;
  totalMoves = 0;
  currentMultiplier = 1.0;
  runActive = false;
  originalBet = 0;
  bet = parseFloat(document.getElementById('betAmount').value) || 1;

  const difficulty = document.getElementById('difficulty').value;
  const multipliers = getMultipliers(difficulty);
  window.multipliers = multipliers; // So makeMove can use it
  window.maxMoves = multipliers.length;

  updateBurnChanceDisplay();

  for (let i = 0; i < multipliers.length; i++) {
    const lane = document.createElement('div');
    lane.className = 'lane';
    lane.dataset.index = i;

    const multi = document.createElement('div');
    multi.className = 'multiplier';
    if (i === 0) {
      multi.textContent = 'START';
    } else {
      multi.textContent = `${multipliers[i].toFixed(2)}x`;
    }
    lane.appendChild(multi);

    road.appendChild(lane);
  }

  chickenEl = document.createElement('div');
  chickenEl.className = 'chicken';
  chickenEl.innerHTML = '🐔';
  road.children[0].appendChild(chickenEl);

  document.querySelector('.cashoutBtn').disabled = true;
  document.querySelector('.goBtn').disabled = false;
}

function makeMove() {
  if (totalMoves >= maxMoves) return;

  bet = parseFloat(document.getElementById('betAmount').value) || 1;
  if (!runActive) {
    if (balance < bet) {
      alert("Not enough balance!");
      return;
    }

    if( bet <= 0) {
      alert("Bet must be greater than 0!");
      return;
    }
    balance -= bet;
    originalBet = bet;
    runActive = true;
    document.getElementById('moneyDisplay').innerText = `$${balance.toFixed(2)}`;
    document.getElementById('difficulty').disabled = true;
    document.querySelector('.cashoutBtn').disabled = false;
    document.querySelector('.goBtn').disabled = false;
  }

  const difficulty = document.getElementById('difficulty').value;
  const odds = getBurnChance(difficulty);
  const lose = Math.random() < odds;

  totalMoves++;
  currentPosition++;
  currentMultiplier = multipliers[currentPosition] || currentMultiplier;

  const road = document.getElementById('road');
  if (road.children[currentPosition]) {
    road.children[currentPosition].appendChild(chickenEl);
    chickenEl.style.left = "50%";
  }

  if (lose) {
    document.querySelector('.cashoutBtn').disabled = true;
    document.querySelector('.goBtn').disabled = true;
    runActive = false;

    // Change chicken to skull
    if (chickenEl) chickenEl.innerHTML = '☠️';

    showConfetti();

    fetch("php/save_money.php", {
      method: "POST",
      body: new URLSearchParams({ user: document.getElementById('username').value, money: balance })
    });

    setTimeout(() => {
      setupRoad();
      document.getElementById('moneyDisplay').innerText = `$${balance.toFixed(2)}`;
      document.getElementById('difficulty').disabled = false;
      document.querySelector('.cashoutBtn').disabled = true;
      document.querySelector('.goBtn').disabled = false;
    }, 1500); // Wait 3 seconds before resetting
  }
}

function cashOut() {
  if (!runActive) return;
  // Disable buttons immediately to prevent double cash out
  document.querySelector('.cashoutBtn').disabled = true;
  document.querySelector('.goBtn').disabled = true;
  runActive = false;

  const win = +(originalBet * currentMultiplier).toFixed(2);
  balance += win;

  fetch("php/save_money.php", {
    method: "POST",
    body: new URLSearchParams({ user: document.getElementById('username').value, money: balance })
  });

  document.getElementById('moneyDisplay').innerText = `$${balance.toFixed(2)}`;
  setupRoad();
  document.getElementById('difficulty').disabled = false;
  document.querySelector('.cashoutBtn').disabled = true;
  document.querySelector('.goBtn').disabled = false;
}

function register() {
  const user = document.getElementById('regUsername').value;
  const pass = document.getElementById('regPassword').value;
  fetch("php/register.php", {
    method: "POST",
    body: new URLSearchParams({ user, pass })
  }).then(res => res.json())
    .then(data => {
      if (data.status === 'ok') {
        alert('Registration successful! You can now log in.');
      } else {
        alert(data.error);
      }
    });
}

function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  fetch("php/login.php", {
    method: "POST",
    body: new URLSearchParams({ user, pass })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'ok') {
        balance = parseFloat(data.money);
        document.getElementById('userDisplay').textContent = `Logged in as ${user}`;
        document.getElementById('moneyDisplay').innerText = `$${balance.toFixed(2)}`;
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('gameUI').style.display = '';
        setupRoad();
      } else {
        alert(data.error);
      }
    });
}

function showConfetti() {
  // Create overlay
  let overlay = document.getElementById('confettiOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'confettiOverlay';
    overlay.style.position = 'fixed';
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = 9999;
    document.body.appendChild(overlay);
  }

  for (let i = 0; i < 30; i++) {
    const conf = document.createElement('span');
    conf.textContent = Math.random() > 0.5 ? '🔥' : '🍗';
    conf.style.position = 'absolute';
    conf.style.left = (Math.random() * 100) + 'vw';
    conf.style.top = (Math.random() * 60 + 20) + 'vh';
    conf.style.fontSize = '15em';
    conf.style.opacity = '0.9';
    conf.style.transition = 'transform 2.2s, opacity 2.2s';
    conf.style.transform = `translateY(0) scale(1) rotate(${Math.random()*2000}deg)`;
    overlay.appendChild(conf);

    setTimeout(() => {
      conf.style.transform = `translateY(${80 + Math.random()*60}px) scale(0.7) rotate(${Math.random()*2000}deg)`;
      conf.style.opacity = '0';
    }, 50);

    setTimeout(() => {
      conf.remove();
      // Remove overlay if no confetti left
      if (!overlay.hasChildNodes()) overlay.remove();
    }, 1400);
  }
}

document.getElementById('difficulty').addEventListener('change', setupRoad);
