//define html elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highscore');

// define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


// draw snake, map and food
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// create snake or food
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

//set the position of the snake or the food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}


// draw food function
function drawFood () {
    if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
    }
}

// generate the food
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

// move function for the snake
function move (){
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

//Testing moving
// setInterval(() => {
//     move();
//     draw();
// }, 200);

// start game function
function startGame () {
    gameStarted = true; // keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//keypress eventlistener
function handleKeyPress (event) {
    console.log("is running");
    if (
        ( !gameStarted && event.code === 'Space') ||
        ( !gameStarted && event.key === '')
        ) {
        startGame();
    } else {
        switch (event.key) {
          case "ArrowUp":
            direction = "up";
            break;
          case "ArrowDown":
            direction = "down";
            break;
          case "ArrowLeft":
            direction = "left";
            break;
          case "ArrowRight":
            direction = "right";
            break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

// increase speed function 
function increaseSpeed(){
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
      } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
      } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
      } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
      }

}

// Check collision function checks if the snake goes over the grid coordinates or hits its self
function checkCollision() {
  const head = snake[0]; // reads the snake start as head
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) { // checks if the head is fullfilling one of these statments for the board
    resetGame(); // calls reset function
  }
  for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) { // checks if the head is fullfilling one of these statments for it self
        resetGame(); // calls reset function
    }
  }
}

// reset game function happens when the checkCollision function is registering a collision
function resetGame() {
    updateHighScore(); // updates the High Score
    stopGame(); // calls the StopGame function where clear the interval and more
    snake = [{x: 10, y: 10}]; // resets the snake back to its original position
    food = generateFood(); // food function starts again new random generation 
    direction = "right"; // the direction goes back to original value
    gameSpeedDelay = 200; // Speed resets
    updateScore(); // The score resets to 0

}

// Update score function
function updateScore () {
    const currentScore = snake.length -1; // takes the current snake length as score points
    score.textContent = currentScore.toString().padStart(3, '0'); // registers the score to the element's text
}

// stop game function happens in the reset game function
function stopGame () {
    clearInterval(gameInterval); // resets the parameters that gameInterval has at the moment such as move(), draw(), checkCollision()
    gameStarted = false; // resets the gamstarted variable
    instructionText.style.display = "block"; // the instrunction text and logo reappears
    logo.style.display = "block";
}

// update HighScore function
function updateHighScore () {
    const currentScore = snake.length - 1; // take the length of the snake as a score
    if (currentScore > highScore) { // if currentscore is bigger than highscore
        highScore = currentScore; // replace highscore with the value of current score
        highScoreText.textContent = highScore.toString().padStart(3, '0'); // registers the value of highscore t the element
    }
    highScoreText.style.display = 'block'; // reveals the element of highscore
}