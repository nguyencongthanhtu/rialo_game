const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

// Basket
let basket = { x: canvas.width / 2 - 40, y: canvas.height - 40, w: 80, h: 20 };

// Images
const coinImg = new Image();
coinImg.src = "assets/logo.png"; // logo RIALO
let coins = [];
let bombs = [];

// Game variables
let score = 0;
let lives = 3;
let level = 1;

// Draw basket
function drawBasket() {
  ctx.fillStyle = "brown";
  ctx.fillRect(basket.x, basket.y, basket.w, basket.h);
}

// Draw coins
function drawCoins() {
  for (let c of coins) {
    ctx.drawImage(coinImg, c.x - 15, c.y - 15, 30, 30);
  }
}

// Draw bombs
function drawBombs() {
  ctx.fillStyle = "red";
  for (let b of bombs) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 15, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Update objects
function updateObjects() {
  for (let c of coins) {
    c.y += c.speed;
    if (c.y > canvas.height) coins.splice(coins.indexOf(c), 1);

    if (
      c.y > basket.y &&
      c.x > basket.x &&
      c.x < basket.x + basket.w
    ) {
      score++;
      coins.splice(coins.indexOf(c), 1);
      if (score % 10 === 0) level++;
    }
  }

  for (let b of bombs) {
    b.y += b.speed;
    if (b.y > canvas.height) bombs.splice(bombs.indexOf(b), 1);

    if (
      b.y > basket.y &&
      b.x > basket.x &&
      b.x < basket.x + basket.w
    ) {
      lives--;
      bombs.splice(bombs.indexOf(b), 1);
    }
  }
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawCoins();
  drawBombs();
  updateObjects();

  // UI
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Lives: " + lives, canvas.width - 80, 20);
  ctx.fillText("Level: " + level, 160, 20);

  if (lives > 0) requestAnimationFrame(gameLoop);
  else {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", 120, canvas.height / 2);
  }
}

// Spawn coins and bombs
function spawnCoin() {
  let x = Math.random() * (canvas.width - 20) + 10;
  coins.push({ x: x, y: 0, speed: 2 + Math.random() * level });
}
function spawnBomb() {
  let x = Math.random() * (canvas.width - 20) + 10;
  bombs.push({ x: x, y: 0, speed: 2 + Math.random() * level });
}

setInterval(spawnCoin, 1000);
setInterval(spawnBomb, 3000);

// Move basket
document.addEventListener("mousemove", (e) => {
  let rect = canvas.getBoundingClientRect();
  basket.x = e.clientX - rect.left - basket.w / 2;
});

// Start game
gameLoop();
