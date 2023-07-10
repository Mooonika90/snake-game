const gameElement = document.getElementById('snake-1');
const {
	score: scoreElement,
	lives: livesElement,
	arena: arenaElement,
} = [...gameElement.querySelectorAll('[ref]')].reduce((acc, item) => {
	let key = item.getAttribute('ref');
	acc[key] = item;
	return acc;
}, {});
const modal = document.getElementById('modal');
const modalInfo = document.querySelector('.modal-info');

let foodX;
let foodY;
let score = 0;
let lives = 3;
let intervalUID;

let boardSize = 20;

const snakeBody = [{ x: 5, y: 5 }];
let head;
const foodPosition = () => {
	foodX = Math.floor(Math.random() * boardSize) + 1;
	foodY = Math.floor(Math.random() * boardSize) + 1;
};

let deltaX = 0;
let deltaY = 0;
function interval() {
	if (modal.style.display === 'flex') {
		return;
	}
	let html = `<div class="food" style="--food-grid-area: ${foodY} / ${foodX}"></div>`;
	scoreElement.textContent = score;
	livesElement.textContent = lives;
	if (snakeBody[0].y === foodY && snakeBody[0].x === foodX) {
		foodPosition();
		snakeBody.push({ y: foodY, x: foodX });
		score += 1;
	}

	for (let i = snakeBody.length - 1; i > 0; i--) {
		snakeBody[i] = { ...snakeBody[i - 1] };
	}

	snakeBody[0].x += deltaX;
	snakeBody[0].y += deltaY;

	head = snakeBody[0];

	if (head.y <= 0 || head.y > boardSize || head.x <= 0 || head.x > boardSize) {
		lives -= 1;
		showModal();
		return;
	}

	for (let i = 0; i < snakeBody.length; i++) {
		html += `<div class="snake" ref="snake" style="--snake-y: ${snakeBody[i].y}; --snake-x: ${snakeBody[i].x}"></div>`;

		if (
			(i !== 0 && head.y === snakeBody[i].y && head.x === snakeBody[i].x) ||
			lives < 0
		) {
			showModal();
			gameOver();
			return;
		}
	}
	arenaElement.innerHTML = html;
}

function endRound() {
	clearInterval(intervalUID);
	deltaX = 0;
	deltaY = 0;
	snakeBody.length = 1;
	snakeBody[0] = { x: 5, y: 5 };
}

function startGame() {
	intervalUID = setInterval(interval, 100);
	foodPosition();
}

startGame();

function gameOver() {
	if (lives < 0) {
		modalInfo.textContent = 'Game Over - Ready to conquer the next round?';
	}

	score = 0;
	lives = 3;
}
function showModal() {
	modal.style.display = 'flex';
	if (lives > 0) {
		modalInfo.textContent =
			"Your snake took a wrong turn and lost a life. Don't give up!";
	}
	setTimeout(hideModal, 3000);
}

function hideModal() {
	modal.style.display = 'none';
	endRound();
	startGame();
}

window.addEventListener('keydown', (e) => {
	e.preventDefault();
	switch (e.key) {
		case 'ArrowUp':
			if (deltaY !== 1) {
				deltaX = 0;
				deltaY = -1;
			}
			break;
		case 'ArrowDown':
			if (deltaY !== -1) {
				deltaX = 0;
				deltaY = 1;
			}
			break;
		case 'ArrowLeft':
			if (deltaX !== 1) {
				deltaX = -1;
				deltaY = 0;
			}
			break;
		case 'ArrowRight':
			if (deltaX !== -1) {
				deltaX = 1;
				deltaY = 0;
			}
			break;
	}
});
