let player;
let computer;
let ball;

function setup() {
  createCanvas(600, 400);
  player = new Paddle(true);
  computer = new Paddle(false);
  ball = new Ball();
}

function draw() {
  background(0);
  player.show();
  player.update(mouseY);
  computer.update(ball.y);
  computer.show();
  ball.update(player, computer);
  ball.show();
}

class Paddle {
  constructor(isPlayer) {
    this.w = 10;
    this.h = 80;
    this.y = height / 2 - this.h / 2;
    this.isPlayer = isPlayer;
    if (this.isPlayer) {
      this.x = 20;
    } else {
      this.x = width - 30;
    }
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }

  update(newY) {
    this.y = constrain(newY - this.h / 2, 0, height - this.h); // Garante que a raquete permaneça dentro dos limites da tela
  }
}

class Ball {
  constructor() {
    this.diameter = 10; // Diâmetro da bola
    this.maxSpeedX = 18; // Velocidade máxima horizontal
    this.maxSpeedY = 15; // Velocidade máxima vertical
    this.initialSpeedX = 6; // Velocidade horizontal inicial
    this.initialSpeedY = 5; // Velocidade vertical inicial
    this.reset();
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.xSpeed = random(-this.initialSpeedX, this.initialSpeedX);
    this.ySpeed = random(-this.initialSpeedY, this.initialSpeedY);
    if (abs(this.xSpeed) < 3) {
      this.xSpeed = this.xSpeed < 0 ? -3 : 3;
    }

    if (abs(this.ySpeed) < 3) {
      this.ySpeed = this.ySpeed < 0 ? -3 : 3;
    }
  }

  update(player, computer) {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.y < 0 || this.y > height) {
      this.ySpeed *= -1;
    }

    // Verifica colisão com raquete do jogador
    if (
      this.x - this.diameter / 2 < player.x + player.w &&
      this.x + this.diameter / 2 > player.x &&
      this.y + this.diameter / 2 > player.y &&
      this.y - this.diameter / 2 < player.y + player.h
    ) {
      let relativeY = (this.y - player.y - player.h / 2) / (player.h / 2);
      let angle = map(relativeY, -1, 1, -PI / 4, PI / 4);
      this.x = player.x + player.w + this.diameter / 2;
      let magnitude = Math.sqrt(
        this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed
      );
      this.xSpeed = cos(angle) * magnitude;
      this.ySpeed = sin(angle) * magnitude;
      this.increaseSpeed();
    }

    // Verifica colisão com raquete do computador
    if (
      this.x + this.diameter / 2 > computer.x &&
      this.x - this.diameter / 2 < computer.x + computer.w &&
      this.y + this.diameter / 2 > computer.y &&
      this.y - this.diameter / 2 < computer.y + computer.h
    ) {
      let relativeY = (this.y - computer.y - computer.h / 2) / (computer.h / 2);
      let angle = map(relativeY, -1, 1, -PI / 4, PI / 4);
      this.x = computer.x - this.diameter / 2;
      let magnitude = Math.sqrt(
        this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed
      );

      this.xSpeed = -cos(angle) * magnitude;
      this.ySpeed = sin(angle) * magnitude;
      this.increaseSpeed();
    }

    // Verifica se a bola atingiu as bordas laterais da tela
    if (this.x < 0 || this.x > width) {
      this.reset();
    }
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

  increaseSpeed() {
    // Aumenta a velocidade da bola, mas limita a velocidade máxima
    if (abs(this.xSpeed) < this.maxSpeedX) {
      this.xSpeed += this.xSpeed > 0 ? 0.5 : -0.5;
    }
    if (abs(this.ySpeed) < this.maxSpeedY) {
      this.ySpeed += this.ySpeed > 0 ? 0.5 : -0.5;
    }
  }
}
