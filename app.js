/* eslint no-lonely-if: 0 */

// game of breakout using JS
const canvas = document.getElementById('myCanvas');

class Ball {
  /*constructor(x, y, radius = 10) {
    this.x = x;
    this.y = y;
    this.dx = 2;
    this.dy = -2;
    this.radius = radius;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }*/
  constructor(x, y, radius = 10) {
    this.angle = Math.random() * (Math.PI * 0.5) + Math.PI * 1.25; // Ensures angle is going upwards
    //this.angle = Math.PI * 1.48;
    this.speed = 5;
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  move() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
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
  constructor(height, width, ctx) {
    this.height = height;
    this.width = width;
    this.x = (ctx.canvas.width - this.width) / 2;
  }

  move(ctx) {
    if (rightPressed && this.x < ctx.canvas.width - this.width) {
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
const paddleWidth = 240;

const ball = new Ball(canvas.width / 2, canvas.height - 30, ballRadius);
const paddle = new Paddle(paddleHeight, paddleWidth, ctx);

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

          // This block determines how the ball bounces when it hits a brick
          if (ball.x < b.x || ball.x > b.x + brickWidth) {
            if (!((Math.cos(ball.angle) > 0 && ball.x > b.x + brickWidth) || (Math.cos(ball.angle) < 0 && ball.x < b.x))) {
              if (ball.angle > Math.PI) {
                ball.angle = Math.PI * 3 - ball.angle;
              } else {
                ball.angle = Math.PI - ball.angle;
              }
            }
          } if (ball.y < b.y || ball.y > b.y + brickHeight) {
            if (!((Math.sin(ball.angle) > 0 && ball.y > b.y + brickHeight) || (Math.sin(ball.angle) < 0 && ball.y < b.y))) {
              ball.angle = Math.PI * 2 - ball.angle;
            }
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

  // if ball.x < 0 + ball.radius past the left egde
  if (ball.angle > Math.PI * 0.5 && ball.angle < Math.PI * 1.5) {
    if (ball.x < ballRadius) {
      if (ball.angle > Math.PI) {
        ball.angle = Math.PI * 3 - ball.angle;
      } else {
        ball.angle = Math.PI - ball.angle;
      }
    }
  } else {
    if (ball.x > canvas.width - ballRadius) {
      if (ball.angle > Math.PI) {
        ball.angle = Math.PI * 3 - ball.angle;
      } else {
        ball.angle = Math.PI - ball.angle;
      }
    }
  }

  if (ball.angle > Math.PI * 1) {
    if (ball.y < ballRadius) {
      ball.angle = Math.PI * 2 - ball.angle;
    }
  } else {
    if (ball.y > canvas.height - ballRadius) {
      if (ball.x > paddle.x && ball.x < paddle.x + paddleWidth) {
        // ball.angle = Math.PI * 2 - ball.angle; // Bounces
        ball.angle = (Math.PI + Math.PI * ((ball.x - paddle.x) / (paddleWidth)));
      } else {
        lives -= 1;
        if (!lives) {
          alert('GAME OVER');
          document.location.reload();
          requestAnimationFrame(draw); // Needed for Chrome to end game
        } else {
          ball.x = canvas.width / 2;
          ball.y = canvas.height - 30;
          ball.angle = Math.random() * (Math.PI * 0.5) + Math.PI * 1.25;
          paddle.x = (canvas.width - paddleWidth) / 2;
        }
      }
    }
  }


  /* if (ball.x + Math.cos(ball.angle) * ball.speed > canvas.width - ballRadius) {
    console.log(ball.x + " " + ball.y)
    if (ball.angle > Math.PI) {
      ball.angle -= (Math.PI * 0.5);
    } else {
      ball.angle += (Math.PI * 0.5);
    }
  } else if (ball.x + Math.cos(ball.angle) * ball.speed < ballRadius) {
    console.log(ball.x + " " + ball.y)
    if (ball.angle > Math.PI) {
      ball.angle += (Math.PI * 0.5);
    } else {
      ball.angle -= (Math.PI * 0.5);
    }
  }
  if (ball.y + Math.sin(ball.angle) * ball.speed < ballRadius) {
    console.log(ball.x + " " + ball.y)
    if (ball.angle > Math.PI) {
      ball.angle -= (Math.PI * 1.5);
    } else {
      ball.angle -= (Math.PI * 0.5);
    }
  } else if (ball.y + Math.sin(ball.angle) * ball.speed > canvas.height - ballRadius) {
    console.log(ball.x + " " + ball.y)
    if (ball.x > paddle.x && ball.x < paddle.x + paddleWidth) {
      if (ball.angle > Math.PI * 0.5) {
        ball.angle += (Math.PI * 0.5);
      } else {
        ball.angle += (Math.PI * 1.5);
      }
    } else {
      lives -= 1;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
        requestAnimationFrame(draw); // Needed for Chrome to end game
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        ball.angle = Math.random() * Math.PI + Math.PI;
        paddle.x = (canvas.width - paddleWidth) / 2;
      }
    }
  } */

  ball.move();
  paddle.move(ctx);


  requestAnimationFrame(draw);
}

draw()

/*class Sprite {
  constructor() {
    this.angle = Math.random() * Math.PI * 2
    this.speed = 10
    this.x = 0
    this.y = 0
  }

  move() {
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed
  }

  render() {

  }
}*/
