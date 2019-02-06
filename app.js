// game of breakout using JS
const canvas = document.getElementById('myCanvas');

class Ball {
  constructor(x, y, radius = 10) {
    this.x = x;
    this.y = y;
    this.dx = 2;
    this.dy = -2;
    this.radius = radius;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  }
}

class Paddle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.x = (canvas.width - this.width) / 2;
  }

  move() {
    if (rightPressed && this.x < canvas.width - this.width) {
      this.x += 7;
    } else if (leftPressed && this.x > 0) {
      this.x -= 7;
    }
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    // ctx.arc(this.x, canvas.height + 70, 100, 1.25 * Math.PI, Math.PI * 1.75);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  }
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const statusValue = Math.ceil(Math.random() * brickRowCount);
    this.status = statusValue;
    maxScore += statusValue;
  }
}

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
const ctx = canvas.getContext('2d');
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 100;

const ball = new Ball(canvas.width / 2, canvas.height - 30, ballRadius);
const paddle = new Paddle(paddleHeight, paddleWidth);

// let x = canvas.width / 2;
// let y = canvas.height - 30;
// let dx = -1;
// let dy = -2;
// let angle = Math.PI/4
// let speed = 2
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 6;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let score = 0;
let maxScore = 0;
let lives = 3;

const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    // const statusValue = Math.ceil(Math.random() * brickRowCount);
    const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
    const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
    bricks[c][r] = new Brick(brickX, brickY);
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddleWidth / 2;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status > 0) {
        if (ball.x > b.x - ball.radius && ball.x < b.x + brickWidth + ball.radius && ball.y > b.y - ball.radius && ball.y < b.y + brickHeight + ball.radius) {
          b.status -= 1;
          score += 1;
          if (score === maxScore) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
            requestAnimationFrame(draw); // Needed for Chrome to end game
          }

          if (ball.x < b.x || ball.x > b.x + brickWidth) {
            ball.dx = -ball.dx;
          } else {
            ball.dy = -ball.dy;
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Score: ' + score + '/' + maxScore, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawBall() {
  ball.render(ctx);
}

function drawPaddle() {
  paddle.render(ctx);
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status > 0) {
        ctx.beginPath();
        ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
        ctx.fillStyle = colors[bricks[c][r].status - 1];

        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ballRadius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ballRadius) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddleWidth) {
      ball.dy = -ball.dy;
    } else {
      lives -= 1;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
        requestAnimationFrame(draw); // Needed for Chrome to end game
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        ball.dx = 2;
        ball.dy = -2;
        paddle.x = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  ball.move();
  paddle.move()

  requestAnimationFrame(draw);
}

draw()
