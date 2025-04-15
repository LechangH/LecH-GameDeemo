//https://p5js.org/examples/games-circle-clicker/ reference game

let circles = [];
let circleMaximumRadius;
let score = 0;
let highScore;
let gameState = "menu";
let currentShrinkSpeed = 1;
let bombGenerationEnabled = false;
let circleTransparency = 100;

// let Bubbles = {
//   active: false,
//   x: 0,
//   y: 600,
//   size: 100,
//   alpha: 20,
//   speed: -2
// };
const FloatBubbles = {
  Rate: 0.05,
  Count: 5,
  Speed: -2.5,
  size: [75, 150],
  alpha: [25, 30],
  hue: [180, 220]
};
let Bubbles = [];


function setup() {
 let canvas = createCanvas(900, 600);
 canvas.parent("theGame")
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  ellipseMode(RADIUS);
  textSize(36);
  highScore = getItem('high_score') || 0;
}

function draw() {
  background(20);
  // https://editor.p5js.org/esztvi/sketches/yuvIkGYR3
  switch (gameState) {
    case "menu": drawMainMenu(); break;
    case "playing": drawGameScreen(); break;
    case "gameover": drawGameOver(); break;
  }
}

// Main menu
function drawMainMenu() {
  // GameTitle
  textAlign(CENTER, CENTER);
  fill(200, 80, 80);
  textSize(64);
  text("CIRCLE CLICKER", width / 2, 150);
  //https://editor.p5js.org/Maho/sketches/DqXu3rb-j 
  // Startbutton
  const start = drawButton(width / 2 - 100, 300, 200, 60, "START");
  if (start && mouseIsPressed) {
    startGame();
  }

  // RuleButton
  const rule = drawButton(width / 2 - 100, 400, 200, 60, "Rules");
  if (rule) {
    showRuleFrame();
  }

  //reset highest score
  const reset = drawButton(width / 2 - 100, 500, 200, 60, "Reset Score");
  if (reset && mouseIsPressed) {
    highScore = 0;
    storeItem('high_score', 0);
  }

  text(`HIGH SCORE: ${highScore}`, width / 1.23, 30);

}


// GameScreen
function drawGameScreen() {
  stroke(150);
  line(0, 550, 900, 550);
  noStroke();

  if (circles.length > 0) {
    updateDifficulty();
    updateCircles();
    drawProgressBar();
    drawScore();
  } else {
    endGame();
  }

  //   if (Bubbles.active) {
  //     fill(200, 80, 80, Bubbles.alpha);
  //     ellipse(Bubbles.x, Bubbles.y, Bubbles.size);
  //   }

  Bubbles.forEach(bubble => {
    fill(bubble.hue, 80, 80, bubble.alpha);
    ellipse(bubble.x, bubble.y, bubble.size);
  })
}


// Button
function drawButton(x, y, w, h, label) {
  const hover = mouseX > x && mouseX < x + w &&
    mouseY > y && mouseY < y + h;

  fill(hover ? 180 : 200, 80, hover ? 80 : 60);
  rect(x, y, w, h, 10);

  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);
  text(label, x + w / 2, y + h / 2);

  return hover;
}

// RulesFrame
function showRuleFrame() {
  push();
  fill(0, 0, 100, 200);
  rect(150, 200, 600, 300, 20);

  // Rules
  //https://creative-coding.decontextualize.com/text-and-type/ text adjustment
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text(
    "HOW TO PLAY:\n" +
    "1. Click colored circles for score\n" +
    "2. White circles are BOMBS\n" +
    "3. Difficulty increases:\n" +
    "   - 25pts: Smaller size + floating bubbles\n" +
    "   - 50pts: Bombs appear\n" +
    "   - 75pts: Transparency\n" +
    "   - 100pts: Faster shrink",
    170, 230
  );
  pop();
}

// InitializeGame
function startGame() {
  score = 0;
  gameState = "playing";
  circleMaximumRadius = 270 * 0.75;
  Bubbles = [];
  // Bubbles = {
  //   active: false,
  //   x: 0,
  //   y: 600 + Bubbles.size,
  //   size: 50,
  //   alpha: 20,
  //   speed: -2
  // };

  resetCircles();
  loop();
}

// ResetCircles
function resetCircles() {
  circles = [];

  // MainCircles
  circles.push({
    x: random(circleMaximumRadius, 900 - circleMaximumRadius),
    y: random(circleMaximumRadius, 550 - circleMaximumRadius),
    radius: circleMaximumRadius,
    color: color(
      random(240, 360),
      random(40, 80),
      random(50, 90),
      circleTransparency
    ),
    isBomb: false
  });

  // CirclesBomb
  if (bombGenerationEnabled) {
    circles.push({
      x: random(circleMaximumRadius, 900 - circleMaximumRadius),
      y: random(circleMaximumRadius, 550 - circleMaximumRadius),
      radius: circleMaximumRadius - 30,
      color: color(0, 0, 100, circleTransparency),
      isBomb: true
    });
  }
}

// Levels
function updateDifficulty() {
  const originalMax = 270;
  circleMaximumRadius = originalMax * 0.75;
  currentShrinkSpeed = 1;
  bombGenerationEnabled = false;
  circleTransparency = 100;

  if (score >= 25) handle25PointLevel(originalMax);
  if (score >= 50) handle50PointLevel();
  if (score >= 75) handle75PointLevel();
  if (score >= 100) handle100PointLevel();

  circleMaximumRadius = max(circleMaximumRadius, 15);
}

// 25 points
function handle25PointLevel(originalMax) {
  if (score <= 100) {
    const progress = (score - 25) / 75;
    circleMaximumRadius = originalMax * (0.75 - 0.25 * progress);
    // Bubbles.active = true;
    // Bubbles.size = 50;
    // Bubbles.x = map(sin(frameCount * 0.03), -1, 1, 100, 800);

    if (random() < FloatBubbles.Rate &&
      Bubbles.length < FloatBubbles.Count) {
      Bubbles.push({
        x: random(100, 800),
        y: height + 100,
        size: random(...FloatBubbles.size),
        speed: random(FloatBubbles.Speed - 0.5, FloatBubbles.Speed + 1),
        hue: random(...FloatBubbles.hue),
        alpha: random(...FloatBubbles.alpha)
      });
    }


  } else {
    circleMaximumRadius = originalMax * 0.5;
  }
}

// 50 points
function handle50PointLevel() {
  bombGenerationEnabled = true;
}

// 75 points
function handle75PointLevel() {
  circleTransparency = 70;
}

// 100 points
function handle100PointLevel() {
  currentShrinkSpeed = 2;
}

// updateCircles
function updateCircles() {
  circles = circles.filter(circle => circle.radius > 0);

  // if (Bubbles.active) {
  //   Bubbles.y += Bubbles.speed;
  //   if (Bubbles.y < -Bubbles.size * 2) {
  //     Bubbles.y = 600 + Bubbles.size;
  //   }
  // }

  Bubbles = Bubbles.filter(bubble => {
    bubble.y += bubble.speed;
    return bubble.y > -bubble.size * 2;
  });



  circles.forEach(circle => {
    circle.radius -= currentShrinkSpeed;

    fill(circle.color);
    ellipse(circle.x, circle.y, circle.radius);

    if (circle.isBomb) {
      stroke(10, 80, 80);
      noFill();
      ellipse(circle.x, circle.y, circle.radius);
      noStroke();
    }
  });
}

// LevelProgressBar (0-100)
function drawProgressBar() {
  const progressWidth = map(constrain(score, 0, 100), 0, 100, 0, 900);
  fill(200, 80, 80);
  rect(0, 560, progressWidth, 30);
}

// Scoure
function drawScore() {
  fill(220);
  noStroke();
  textAlign(RIGHT, TOP);
  textSize(36);
  text(score, 880, 20);
}

// END
function endGame() {
  if (gameState === "playing") {
    gameState = "gameover";
    highScore = max(highScore, score);
    storeItem('high_score', highScore);
  }
}

// EndScreen
function drawGameOver() {
  textAlign(CENTER, CENTER);
  fill(220);
  textSize(40);
  text("GAME OVER", width / 2, 150);

  textSize(30);
  text(`SCORE: ${score}`, width / 2, 220);
  text(`HIGH SCORE: ${highScore}`, width / 2, 280);

  drawButton(330, 350, 240, 60, "RETRY");
  drawButton(330, 450, 240, 60, "MENU");
}

// mouse function
function mousePressed() {
  if (gameState === "playing") {
    if (mouseY > 550) return;

    circles.forEach(circle => {
      const distance = dist(mouseX, mouseY, circle.x, circle.y);
      if (distance < circle.radius) {
        if (circle.isBomb) {
          endGame();
        } else {
          score += 1;
          resetCircles();
        }
      }
    });
  }
  else if (gameState === "gameover") {
    if (mouseX > 330 && mouseX < 330 + 240 &&
      mouseY > 350 && mouseY < 350 + 60) {
      startGame();
    }
    else if (mouseX > 330 && mouseX < 330 + 240 &&
      mouseY > 450 && mouseY < 450 + 60) {
      gameState = "menu";
      loop();
    }
  }
}