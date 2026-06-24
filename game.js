const COLORS = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#be2edd', '#ff6b81'];
let level = 1, moves = 0, selectedTube = null, tubes = [];

function initGame() {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();

    moves = 0;
    updateStats();
    generateLevel();
    renderTubes();
}

function generateLevel() {
    tubes = [];
    let numColors = Math.min(3 + level, 6);
    let ballsPerColor = 4;
    let allBalls = [];

    for(let i = 0; i < numColors; i++) {
        for(let j = 0; j < ballsPerColor; j++) {
            allBalls.push(COLORS[i]);
        }
    }

    // Shuffle
    allBalls.sort(() => Math.random() - 0.5);

    // Fill tubes
    for(let i = 0; i < numColors; i++) {
        tubes.push(allBalls.slice(i * ballsPerColor, (i + 1) * ballsPerColor));
    }

    // Add 2 empty tubes
    tubes.push([]);
    tubes.push([]);
}

function renderTubes() {
    const container = document.getElementById('tubes-container');
    container.innerHTML = '';

    tubes.forEach((tube, idx) => {
        const tubeEl = document.createElement('div');
        tubeEl.className = 'tube';
        tubeEl.onclick = () => selectTube(idx);

        tube.forEach(color => {
            const ball = document.createElement('div');
            ball.className = 'ball';
            ball.style.backgroundColor = color;
            tubeEl.appendChild(ball);
        });

        container.appendChild(tubeEl);
    });
}

function selectTube(idx) {
    const tubesEl = document.querySelectorAll('.tube');

    if(selectedTube === null) {
        if(tubes[idx].length === 0) return;
        selectedTube = idx;
        tubesEl[idx].classList.add('selected');
    } else {
        if(selectedTube === idx) {
            tubesEl[selectedTube].classList.remove('selected');
            selectedTube = null;
            return;
        }

        moveBall(selectedTube, idx);
        tubesEl[selectedTube].classList.remove('selected');
        selectedTube = null;
    }
}

function moveBall(from, to) {
    if(tubes[from].length === 0) return;
    if(tubes[to].length >= 4) return;

    let ball = tubes[from][tubes[from].length - 1];
    if(tubes[to].length > 0 && tubes[to][tubes[to].length - 1]!== ball) return;

    tubes[from].pop();
    tubes[to].push(ball);
    moves++;
    updateStats();
    renderTubes();
    checkWin();
}

function checkWin() {
    let won = tubes.every(tube =>
        tube.length === 0 || (tube.length === 4 && tube.every(b => b === tube[0]))
    );

    if(won) {
        setTimeout(() => {
            Telegram.WebApp.showAlert(`Level ${level} Complete! Moves: ${moves}`);
            level++;
            initGame();
            showNativeAd(); // Level complete pe ad dikhao
        }, 300);
    }
}

function updateStats() {
    document.getElementById('level').textContent = level;
    document.getElementById('moves').textContent = moves;
}

document.getElementById('restart-btn').onclick = initGame;
document.getElementById('hint-btn').onclick = () => showRewardedAd('hint');
document.getElementById('extra-tube-btn').onclick = () => showRewardedAd('tube');

initGame();
