let circle;
let isSliced = false;
let sliceStart, sliceEnd;
let slices = [];

function setup() {
  createCanvas(600, 600);
  circle = {
    x: width / 2,
    y: height / 2,
    r: 100
  };
  noLoop();
}

function draw() {
  background(220);
  if (!isSliced) {
    fill(255);
    ellipse(circle.x, circle.y, circle.r * 2);
  } else {
    drawSlices();
  }
}

function mousePressed() {
  sliceStart = createVector(mouseX, mouseY);
}

function mouseReleased() {
  sliceEnd = createVector(mouseX, mouseY);
  if (!isSliced && lineIntersectsCircle(sliceStart, sliceEnd, circle)) {
    isSliced = true;
    createSlices();
    loop(); // Start the animation loop only after the circle has been sliced
  }
}

function lineIntersectsCircle(start, end, circle) {
  let d1 = dist(circle.x, circle.y, start.x, start.y);
  let d2 = dist(circle.x, circle.y, end.x, end.y);
  return d1 < circle.r || d2 < circle.r;
}

function createSlices() {
  // Calculate the angle where the circle is sliced
  let angleStart = atan2(sliceStart.y - circle.y, sliceStart.x - circle.x);
  let angleEnd = atan2(sliceEnd.y - circle.y, sliceEnd.x - circle.x);

  // Ensure angleStart is less than angleEnd
  if (angleStart > angleEnd) {
    [angleStart, angleEnd] = [angleEnd, angleStart];
  }

  // If the slice goes through the circle, adjust the angles to wrap correctly
  if (angleEnd - angleStart > PI) {
    angleStart += TWO_PI;
  }

  // Create two slices as objects
  slices = [
    { start: angleStart, end: angleEnd, velocity: createVector(0, 0.5) },
    { start: angleEnd, end: angleStart + TWO_PI, velocity: createVector(0, 0.5) }
  ];
}

function drawSlices() {
  // Draw each slice
  slices.forEach(slice => {
    fill(150);
    beginShape();
    for (let angle = slice.start; angle <= slice.end; angle += 0.01) {
      let x = circle.x + circle.r * cos(angle);
      let y = circle.y + circle.r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);

    // Apply gravity to slices
    slice.velocity.y += 0.1;
    let gravity = createVector(0, slice.velocity.y);
    let moveX = circle.r / 2 * cos((slice.start + slice.end) / 2);
    let moveY = circle.r / 2 * sin((slice.start + slice.end) / 2);
    circle.x += moveX;
    circle.y += moveY;
    circle.x += gravity.x;
    circle.y += gravity.y;
  });

  // Check if both slices are off-screen
  if (slices.every(s => s.y > height)) {
    noLoop(); // Stop the animation loop
    resetCircle();
  }
}

function resetCircle() {
  // Reset the circle and all related variables
  isSliced = false;
  slices = [];
  circle.x = width / 2;
  circle.y = height / 2;
}
