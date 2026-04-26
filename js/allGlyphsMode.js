//  GENERATE GLYPGS IN MULTI MODE 
/// only generate the glyphs not the boxes 
function generateMultiGlyphs() {

  stems = []; // clear first

  // let gridSize = gridSizeSlider.value();
  let gridSize = 100;
  let cellHeight = gridSize + yPadding;
  let cellWidth = gridSize + xPadding;

  // cols = floor((maxGridWidth + xPadding) / cellWidth);
  cols = 10;
  // rows = floor(map(gridSize, 40, 140, 3, 8));
  rows = 4;

  let glyphCount = 1;

  for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {

      let px = x * cellWidth;
      let py = y * cellHeight;

      // let amount = floor(random(1, 12)); // stems per glyph
      let amount = glyphCount;

      stroke(255);
      noFill();

      for (let a = 0; a < amount; a++) {
        stems.push({
          path: [{ x: px + gridSize / 2, y: py + gridSize / 2 }], // start at cell centre
          angle: goldenAngle * a,
          x: px + gridSize / 2,
          y: py + gridSize / 2,
          // strokeLen: floor(random(20, 60)),
          strokeLen: strokeLenArray[a % strokeLenArray.length], // ← reuse same array, % prevents out of bounds
          glyphId: `${x}-${y}`,  // ← unique id per cell
          label: 'T 00: ' + amount,
        });
      }
      glyphCount++; // count up 

      fill(255);
      noStroke();
      textSize(20);
      textAlign(LEFT, BOTTOM)
    //   text('Thigmic ID:' + amount, px, py + cellHeight)
    }
  }
}
