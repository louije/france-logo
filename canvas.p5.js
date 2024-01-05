let centerX, centerY;

function setup() {
  createCanvas(200, 200);
  colorMode(HSB, 360, 100, 100, 1);
  centerX = width / 2;
  centerY = height / 2;
  frameRate(8);
}

function draw() {
  background(100);
  let points = [];
  points = points.concat(centerPoint());
  points = points.concat(innerPoints());
  points = points.concat(noisyPoints());
  points = points.concat(outerPoints());
  points.forEach(drawPoint);
}

function drawPoint(p, i) {
  stroke(p.color);
  strokeWeight(p.weight);
  point(noisify(p.x, i, 4), noisify(p.y, i, 4));
}

function outerPoints() {
  const p = hexVertices(80, centerX, centerY).map((v, i) => {
    const w = noisify(32, i, 4);
    return {
      x: v.x,
      y: v.y,
      weight: w,
      color: color(220, 100, noisify(66, i, 25))
    };
  });
  return p;
}

function innerPoints() {
  const p = hexVertices(40, centerX, centerY).map((v, idx) => {
    const h = noise(idx, frameCount) > 0.5 ? 330 : 220;
    const n = noise(idx) * 50 - 25;
    return {
      x: v.x,
      y: v.y,
      weight: noisify(25, idx, 10),
      color: color(h + n, 80, 75)
    };
  });
  return p;
}

function centerPoint() {
  return [
    {
      x: centerX,
      y: centerY,
      weight: 40,
      color: color(220, 100, noisify(66, 0, 60))
    }
  ]
}

function noisyPoints() {
  const p = hexVertices(noisify(60, 0, 20), centerX, centerY, noisify(0, 0, TWO_PI / 6)).map((v, idx) => {
    const h = noisify(128, idx, 360);
    return {
      x: noisify(v.x, idx, 20),
      y: noisify(v.y, idx, 20),
      weight: noisify(16, idx, 6),
      color: color(h, 80, 75)
    };
  });
  return p;
}

function hexVertices(radius, centerX, centerY, startAngle = PI / 6) {
  let vertices = [];
  const angle = TWO_PI / 6;
  for (let a = startAngle; a < TWO_PI; a += angle) {
    const sx = centerX + cos(a) * radius;
    const sy = centerY + sin(a) * radius;
    vertices.push(createVector(sx, sy));
  }
  return vertices;
}

function noisify(value, index, level) {
  return value + noise(index, frameCount) * level - level / 2;
}