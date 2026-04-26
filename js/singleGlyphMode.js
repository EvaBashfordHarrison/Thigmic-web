//// GENERATE GLYPHS IN SINGLE MODE 
function generateSingleGlyph() {
  stems = [];

  let amount = amountSlider.value();

  for (let a = 0; a < amount; a++) {
    stems.push({
      path: [{ x: 0, y: 0 }], 
      angle: goldenAngle * a,
      x: 0,
      y: 0,
      strokeLen: strokeLenArray[a],
    })
  }
}