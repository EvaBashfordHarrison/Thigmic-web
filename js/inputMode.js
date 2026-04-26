// arduino... 
let serial;
let latestSerial = ""; 
// let port;
let writer;
let serialConnected = false;
let reader;
let latestData = "";
let lastSentCatIndex = null;
let readBuffer = "";
let startButton;
let data;
let value;
let prevData = 0;

let scrollOffset = 0;

let leading;
let kerning;

// let circleMaxSlider;
// let circleMinSlider;
// let glyphSizeSlider;


function inputMode() {
  // get serial number 
  // type new letter at new serial number / aka 1s 
  
  noStroke();
  push();
  translate(224, 90 - scrollOffset);

  let gs = kerning.value();
  let kern = kerning.value();
  let lead = leading.value();
  let lineHeight = gs + lead;

  let curX = 0;
  let curY = 0;

  for (let g of typedGlyphs) {
    g.x = curX;
    g.y = curY;

    curX += gs + kern;

    if (curX > maxGridWidth - 224) {
      curX = 0;
      curY += lineHeight;
    }
  }

  // if cursor has gone past the canvas, scroll up one line
  let canvasHeight = height - 90; // account for your translate(224, 90)
  if (curY - scrollOffset > canvasHeight - lineHeight) {
    scrollOffset += lineHeight;
  }

  // ---- cursor flashing...
  if (frameCount % 60 < 30) {
    stroke(200);
  } else {
    stroke(0);
  }

  push();
  translate(curX - 30, curY);
  let cursorHeight = 30;
  let cursorWidth = 3;
  scale(1);
  //   stroke(0);
  strokeWeight(2);
  noFill();
  strokeCap(ROUND);
  line(0, -cursorHeight, 0, cursorHeight);
  line(-cursorWidth, -cursorHeight, cursorWidth, -cursorHeight);
  line(-cursorWidth, cursorHeight, cursorWidth, cursorHeight);

  pop();

  for (let g of typedGlyphs) {
    push();
    translate(g.x, g.y);

    // TEMP: swap global stems
    let prevStems = stems;
    stems = g.stems;

    drawGlyph(cMax, cMin, varVal);

    stems = prevStems;
    pop();
  }

  pop();

}


function calculateGlyphSerial() {
  // create NEW glyph stems for this character

  // inside the arduino code, the 'baseline' is 330v, so prints to the console 330v as 0. 

  let newStems = [];

  let noiseSupress = 30;
  let spikeThreshold = 100;

  let amount = map(serialNumber, 0, 4.9, 1,50)

  // let previousData = latestData - 1;

  if (abs(latestData - prevData) < spikeThreshold) {
    prevData = latestData;
    return; // probably a spike
  }

  // if (latestData > -noiseSupress && latestData < noiseSupress) {
  //   return;
  // }


  if (latestData >= 30 && latestData <= 330) {
    amount = floor(map(latestData, noiseSupress, 330, 1, 25));
  } else {
    amount = floor(map(latestData, -330, -noiseSupress, 25, 1));
  }

  // amount = constrain(amount, 1, 50); // safety clamp

  // let amount = floor(random(1, 50));
  // serial goes from 0 to 330 (baseline) and up to 700
  // value will be serial / 10 for translation

  let gs = kerning.value();
  let kern = kerning.value();
  let lead = leading.value();

  // derive current cursor from last glyph
  if (typedGlyphs.length > 0) {
    let last = typedGlyphs[typedGlyphs.length - 1];
    typeX = last.x + gs + kern;
    if (typeX > maxGridWidth - 224) {
      typeX = 0;
      typeY = last.y + gs + lead;
    } else {
      typeY = last.y;
    }
  } else {
    typeX = 0;
    typeY = 0;
  }

  for (let a = 0; a < amount; a++) {
    newStems.push({
      path: [{ x: 0, y: 0 }],
      angle: goldenAngle * a,
      x: 0,
      y: 0,
      strokeLen: strokeLenArray[a % strokeLenArray.length],
      glyphId: `${typeX}-${typeY}`,
    });
  }

  typedGlyphs.push({
    index: typedGlyphs.length, // just its place in sequence
    stems: newStems,
  });

}