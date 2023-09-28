// JavaScript code for a simple Snake game

const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const pauseButton = document.getElementById('pauseButton');

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let pauseInterval;
let isPaused = false;
let score = 0;
let snakeSpeed = 5;
let growthRate = 1;
let accumulatedScore = 0;
let bonusFoodVisible = false;
let obstacles = []; //make the game challenging with some challenges.
const bonusFoodInterval = 10;

const gulpSound = new Audio("gulp-37759.mp3");

function updateDifficulty() {
    const selectedDifficulty = difficultySelect.value;
    
    switch (selectedDifficulty) {
        case "easy":
            snakeSpeed = 5;
            growthRate = 1;
            
            break;
        case "medium":
            snakeSpeed = 8;
            growthRate = 2;
            break;
        case "hard":
            snakeSpeed = 12;
            growthRate = 3;
            break;
    }
    
    clearInterval(setIntervalId);
    if (!gameOver) {
        clearInterval(pauseInterval);
        setIntervalId = setInterval(initGame, 1000 / snakeSpeed);
    }
}

// JavaScript code to show the start popup and start the game when the button is clicked
const startPopup = document.getElementById("startPopup");
const startGameButton = document.getElementById("startGameButton");

startGameButton.addEventListener("click", () => {
    startPopup.style.display = "none"; // Hide the start popup
    gameOver = false; // Start the game
    isPaused = false; // Reset game pause state
    updateDifficulty(); // Start or restart the game with the selected difficulty.
    intializeObstacles(); //Initialize obstacles
    startGame();
});

// Function to start the game
function startGame() {
    bonusFoodVisible = false; // Reset bonus food visibility
    hidePausePopup(); // Hide the pause popup
    setIntervalId = setInterval(initGame, 1000 / snakeSpeed); // Start the game interval
}



const difficultySelect = document.querySelector('#difficulty-select');
difficultySelect.addEventListener('change', updateDifficulty);

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `HS: ${highScore}`;

let bonusFoodX, bonusFoodY;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}
// function to remove the difficulty selector

function myFunction (){

    if (score === 0){

    difficultySelect.addEventListener('change', updateDifficulty);

    } else {

        difficultySelect.style.display ='none';

    }

    }
const generateBonusFood = () => {
    do {
        bonusFoodX = Math.floor(Math.random() * 30) + 1;
        bonusFoodY = Math.floor(Math.random() * 30) + 1;
    } while (
        (bonusFoodX === foodX && bonusFoodY === foodY) ||
        snakeBody.some(([bodyY, bodyX]) => bodyX === bonusFoodX && bodyY === bonusFoodY)
    );

    // Apply the "bonus-food" class to the bonus food element
    const bonusFoodElement = document.createElement("div");
    bonusFoodElement.classList.add("food", "bonus-food");
    bonusFoodElement.style.gridArea = `${bonusFoodY} / ${bonusFoodX}`;
    playBoard.appendChild(bonusFoodElement);
    bonusFoodVisible = true;
}

// Initialize obstacles
function initializeObstacles() {
    obstacles = [];
    for (let i = 0; i < 10; i++) {
        const obstacleX = Math.floor(Math.random() * 30) + 1;
        const obstacleY = Math.floor(Math.random() * 30) + 1;
        obstacles.push([obstacleY, obstacleX]);
    }
}


const handleGameOver = () => {
    clearInterval(setIntervalId);
    if (!isPaused) {
        clearInterval(pauseInterval);
    }
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const togglePause = (e) => {
    if (gameOver) return;

    if (e.keyCode === 32) {
        isPaused = !isPaused;
        if (isPaused) {
            clearInterval(setIntervalId);
            if (!gameOver) {
                clearInterval(pauseInterval);
                pauseInterval = setInterval(initGame, 1000 / snakeSpeed);
            }
            pauseButton.textContent = 'Resume';
        } else {
            if (!gameOver) {
                clearInterval(pauseInterval);
                pauseInterval = setInterval(initGame, 1000 / snakeSpeed);
            }
            pauseButton.textContent = 'Pause';
        }
    }
}


document.addEventListener("keydown", togglePause);

pauseButton.addEventListener('click', togglePause);

const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (gameOver) return handleGameOver();
    myFunction();
    // Check if the snake collided with an obstacle
    if (obstacles.some(obstacle => obstacle[0] === snakeX && obstacle[1] === snakeY)) {
        return handleGameOver();
    }

    if (gameOver || isPaused) return;
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (!bonusFoodVisible) {
        updateFoodPosition();
        generateBonusFood();
    }

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        generateBonusFood();
        for (let i = 0; i < growthRate; i++) {
            snakeBody.push([foodY, foodX]);
        }
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `HS: ${highScore}`;
        gulpSound.play();
    }

    if (bonusFoodVisible && snakeX === bonusFoodX && snakeY === bonusFoodY) {
        bonusFoodVisible = false;
        score += 5;
        gulpSound.play();
        // Remove the bonus food element from the play board
        playBoard.removeChild(playBoard.querySelector(".bonus-food"));
    }

    snakeX += velocityX;
    snakeY += velocityY;
    
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return handleGameOver();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            return handleGameOver();
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
generateBonusFood();
setIntervalId = setInterval(initGame, 1000 / snakeSpeed);
document.addEventListener("keyup", changeDirection);

updateDifficulty();
