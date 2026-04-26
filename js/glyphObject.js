function drawGlyph(_circleMax,_circleMin, varStem) {

  for (let s of stems) {

    let stemLength = floor(s.strokeLen * varStem);

    // --- get current position ---
    let current = s.path[s.path.length - 1];

    if (s.path.length >= stemLength) {
    } else {

    // --- predict next ---
    let nextAngle = s.angle + random(-20, 20);
    let nextX = current.x + cos(nextAngle) * stepSize;
    let nextY = current.y + sin(nextAngle) * stepSize;

    let tooClose = false;

    for (let other of stems) {
      if (other.glyphId !== s.glyphId) continue;  // ← only check own glyph
      if (other.path.length < 5) continue;  // ← skip short paths

      for (let i = 0; i < other.path.length - 5; i++) {
        let p = other.path[i];
        let d = dist(nextX, nextY, p.x, p.y);

        if (d < minDistance) {
          tooClose = true;
          break;
        }
      }
      if (tooClose) break;
    }

    // --- decide ---
    if (!tooClose) {
      s.angle = nextAngle;
      s.x = nextX;
      s.y = nextY;
      s.path.push({ x: nextX, y: nextY });  // ← not createVector
    } else {
      s.angle += random(-40, 40);
    }
  }

    fill(255);
    noStroke();
    let start = max(0, floor(s.path.length - stemLength));
    for (let i = start; i < s.path.length; i++) {
      let circleSize = map(i,start,s.path.length,_circleMax,_circleMin);

      let p = s.path[i];
      let last = s.path[s.path.length - 1];
      circle(p.x, p.y, circleSize)

      circle(last.x, last.y, _circleMax * 1.2);
    }
  }
}