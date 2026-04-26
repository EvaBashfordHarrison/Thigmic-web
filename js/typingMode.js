function keyPressed() {
  if (mode === "typeTester") {


    // create NEW glyph stems for this character
    let newStems = [];

    // let amount = floor(random(1, 33));
    let n = noise(t);

    let index = floor(map(n, 0, 1, 0, plantReadings.length));

    let currentReading = plantReadings[index];

    let amount = floor(map(currentReading, 0, 100, 1, 33)); 

    for (let a = 0; a < amount; a++) {
      newStems.push({
        path: [{ x: 0, y: 0 }],
        angle: goldenAngle * a,
        x: 0,
        y: 0,
        strokeLen: strokeLenArray[a % strokeLenArray.length],
        glyphId: `${typeX}-${typeY}`
      });
    }

    t+= 0.1;

    // store glyph + position
    typedGlyphs.push({
      x: typeX,
      y: typeY,
      stems: newStems
    });

    // move cursor →
    typeX += charSize + charSpacing;

    // newline logic
    if (typeX > maxGridWidth) {
      typeX = 0;
      typeY += charSize + charSpacing;
    }
  }

  if (keyCode === 32) {
    typedGlyphs.pop();
  }
}