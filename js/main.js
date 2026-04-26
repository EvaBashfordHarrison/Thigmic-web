let path = [];
let stems = [];
let x, y;
let angle;
let stepSize = 2;
let minDistance = 6;
let goldenAngle = 137.5;
let amount = 0;
let strokeLen = 50;

let toggleGrid = true;

let t = 0; 

let imagePadding = 20;

let cols;
let rows;
let xPadding = 20;
let yPadding = 40;
let maxGridWidth = 1200; // for multimode and type mode 

let strokeLenArray = [];
let plantReadings = [];

// let mode = "multi" // other: "multi", "single", "typing", "input"
let mode = 'home'; // 'glyphMode', 'typeTester', 'inputMode' 

let singleMode;
let multiMode;
let amountSlider;
let generateButton;
let showGoldenGrid;
let textSizeSlider;
let textWeightSlider; 

// GLOBAL TYPE STYLES 
let h1 = 60;
let h2 = 48;
let h3 = 30;
let h4 = 18
let h5 = 12;

let img1; 
let img2; 
let img3; 
let img4;
let img5; 

// -- setup for typing mode 
let typedGlyphs = [];
let typeX = 0
let typeY = 0
let charSize = 30;
let charSpacing = 20;
let nL; // newLine 
let grenzeMedium;
let grenzeRegular;

function preload() {
  grenzeMedium = loadFont('fonts/Grenze-Medium.ttf');
  grenzeRegular = loadFont('fonts/Grenze-Regular.ttf');

  img1 = loadImage('images/Asset 2@2x.png');
  img2 = loadImage('images/Asset 3@2x.png');
  img3 = loadImage('images/Asset 4@2x.png');
  img4 = loadImage('images/Asset 5@2x.png');
  img5 = loadImage('images/Asset 6@2x.png');

}


function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  pixelDensity(2);

  angleMode(DEGREES);

  textFont(grenzeMedium)
  fill(255);


  /// ----- BUTTONS and SLIDERS HERE ------- 

  singleMode = createButton('Single');
  singleMode.position(480, 150);
  singleMode.mousePressed(() => {
    mode = "single";
    stems = []
    amountSlider.show();
    // generateButton.show();
    generateSingleGlyph();
  });

  multiMode = createButton('View All');
  multiMode.position((width / 5) + 50,150);
  multiMode.mousePressed(() => {
    mode = "glyphMode";
    stems = [];
    // amountSlider.hide();
    // generateButton.hide();
    generateMultiGlyphs();
  });

  amountSlider = createSlider(1, 39, 1);
  amountSlider.position(50, 215);

  textSizeSlider = createSlider(40, 140, 40); 
  textSizeSlider.position(50, 265);
  textSizeSlider.input(() => {
    if (mode === "glyphMode") {
      generateMultiGlyphs();
    }
  });

  textWeightSlider = createSlider(2,20, 5);
  textWeightSlider.position(50, 315);

  generateButton = createButton('regrow');
  generateButton.position(50, 400);
  generateButton.mousePressed(() => {
    generateSingleGlyph();
  });

  showGoldenGrid = createButton('Toggle grid');
  showGoldenGrid.position(width - 150, 150);
  showGoldenGrid.mousePressed(() => {
    toggleGrid = !toggleGrid;
  });

  singleMode.addClass("p5-button-classic");
  multiMode.addClass("p5-button-classic");
  generateButton.addClass("p5-button-classic");
  showGoldenGrid.addClass("p5-button-classic");

  circleMaxSlider = createSlider(0.1, 3.0, 1.5, 0.1);
  circleMaxSlider.position(10, 110);

  circleMinSlider = createSlider(0.1, 3.0, 2.2, 0.1);
  circleMinSlider.position(10, 150);

  varSlider = createSlider(0.1, 1.0, 0.3, 0.1);
  varSlider.position(10, 230);

  // text settings
  leading = createSlider(10, 100, 22);
  leading.position(10, 300);
  kerning = createSlider(10, 100, 48);
  kerning.position(10, 340);

  typeX = kerning.value();
  typeY = leading.value();
  changeMode('home');

  // PUSH RANDOM STROKE LENGTHS 
  for (let i = 0; i < 50; i++) {
    strokeLenArray.push(floor(random(50,100)));
  }

  // PUSH THE ACTUAL GLYPHS based on 'amount' slider 
  for (let a = 0; a < amount; a++) {
    stems.push({
      path: [{ x: 0, y: 0 }],
      angle: goldenAngle * a, 
      x: 0, 
      y: 0,
      strokeLen: strokeLenArray[a],  // each stem gets its own length 
      label: 'T 00: ' + amount,
    })
  }

    // pushing an array of numbers for pseudo plant readings 
  for (let n = 0; n < 33; n++) {
    plantReadings.push(n);
  }
}

/// ------------ ARDUINO SETUP HERE -------------------

function serverConnected() {
 print("Connected to Server");
}

function gotList(ports) {
 print("List of Serial Ports:");
  console.log("Available ports:", ports);
  serial.open('/dev/tty.usbmodem1101'); // replace with correct one from the list
}

function gotOpen() {
 print("Serial Port is Open");
}

function gotClose(){
 print("Serial Port is Closed");
 latestData = "Serial Port is Closed";
}

function gotError(theerror) {
 print(theerror);
}

function gotData() {
  let currentString = serial.readLine();
  if (!currentString) return;

  currentString = currentString.trim();
  latestData = currentString;
  // parse to a number first
  let val = parseFloat(currentString);
  if (isNaN(val)) return;  // guard against garbage serial data

  latestData = val; // store as number

  calculateGlyphSerial(); // trigger a new glyph on each serial reading

  // let mappedDataPos = map(currentString, 0, 330, 1,25);
  // let mappedDataNeg = map(currentString, -330,0, 25,1);
}

/// ------------ ARDUINO SETUP END -------------------


///// ---------- DRAW -----------------

function draw() {
  background(0);
  fill("#161616"); 
  rect(width / 5,115, width, height);

  let textWeightName = '';
  if (textWeightSlider.value() >= 2 && textWeightSlider.value() < 4) {
    textWeightName = "Light";
  } else if (textWeightSlider.value() >= 4 && textWeightSlider.value() < 7) {
    textWeightName = "Regular";
  } else {
    textWeightName = "Bold";
  }
/// ------------------ HOME SCREEN HERE -------------------

  if (mode === 'home') {
    fill("#000000"); 
    rect(width / 5,115, width, height);    
    
    textAlign(LEFT);
    fill(255);
    textSize(h4);
    textFont(grenzeRegular);
    
    text(
      'Thigmic is a written language proving the intelligence of plants. Designed to be read with polygraph technology that is sensitive enough for plant signals, and prints the voltage into glyphs. The language mimics plants growth pattern; following the 137.5° pattern for each new node on a growing plant, each node represents an intensity of voltage that the plant is creating. The shape of the stems is created by root systems and their ability to grow anywhere; using the tip of their root to find space, meaning each glyph is different and reacts to the space it has.\n\nSelect a mode from the menu.', 
      width / 2 + (imagePadding * 2), 150, 750);
    

    image(img1, 50, 130, (width / 4) - imagePadding, (width / 4) - imagePadding);
    image(img2, (width / 4) + (imagePadding * 2), 130, (width / 4) - imagePadding, width / 4 - imagePadding);
    image(img3, (width / 4) + (imagePadding * 2), (width * 0.32), (width / 4) - imagePadding, (width / 4) - imagePadding);
    image(img4, 50, (width * 0.32), (width / 4) - imagePadding, (width / 4) - imagePadding);
    image(img5, (width / 2) + (imagePadding + (imagePadding / 2)), (width * 0.2), 800, 800);
    // ---- BUTTONS TOGGLES 
    singleMode.hide();
    multiMode.hide();
    amountSlider.hide();
    generateButton.hide();
    showGoldenGrid.hide();
    textSizeSlider.hide();
    textWeightSlider.hide();
  // ----- BUTTONS END 

/// ------------------ GLYPH MODE -------------------

  } else if (mode === "glyphMode") { // multi 

    // ---- PANEL TEXT 
    noStroke();
    fill("white");
    textAlign(LEFT);
    textSize(h4);
    // text('Styling', 50, 175)
    textSize(h5);
    
    // text('glyph value: ' + amount, 50, 205);
    // text('text size: '+ textSizeSlider.value(), 50, 255);
    // text('Text Weight: '+ textWeightName, 50, 305);
    // -------- panel text 

    // ---- BUTTONS TOGGLES 
    singleMode.show();
    multiMode.show();
    amountSlider.hide();
    generateButton.hide();
    showGoldenGrid.hide();
    textSizeSlider.hide();
    textWeightSlider.hide();
    // ----- BUTTONS END 

    fill(255);
    textAlign(LEFT)
    noStroke();
    // text('Text Size: ' + textSizeSlider.value(), 50, 145);

    // let gridSize = textSizeSlider.value();
    let gridSize = 100;
    let cellwidth = gridSize + xPadding;
    let cellHeight = gridSize + yPadding; 

    cols = 10;
    rows = 4;

    push();
    translate(width / 5 + 50,200);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        stroke(100);
        noFill();  
        let px = x * cellwidth;
        let py = y * cellHeight;
        rect(px, py, gridSize, gridSize);

        noStroke();
        textSize(10);
        fill(255);
        let id = x + (y * cols) + 1
        text('T 0'+ id, px, py + cellHeight * 0.9)
      }
    }

    let stemL = gridSize / 500
    let circleDiam = map(gridSize, 40,140, 3,7)

    // circle max, circle min, variable rate
    drawGlyph(circleDiam,circleDiam / 2, stemL);
    pop();
  } 

/// ------------------ SINGLE GLYPH MODE -------------------

  else if (mode === "single") {

    // ---- PANEL TEXT 
    noStroke();
    fill("white");
    textAlign(LEFT);
    textSize(h4);
    text('Styling', 50, 175)
    textSize(h5);
    
    text('glyph value: ' + amount, 50, 205);
    text('text size: '+ textSizeSlider.value(), 50, 255);
    text('Text Weight: '+ textWeightName, 50, 305);
    // -------- panel text 
    
    // ---- BUTTONS TOGGLES 
    singleMode.show();
    multiMode.show();
    amountSlider.show();
    generateButton.show();
    showGoldenGrid.show();
    textSizeSlider.show();
    textWeightSlider.show();
  // ----- BUTTONS END 

    amount = amountSlider.value();

    generateButton.show();
    // textSizeSlider.hide();
    amountSlider.show();

    fill(100);
    textSize(h1);
    text('value: ' + amountSlider.value(), 50, 70);
    showGoldenGrid.show()
    multiMode.show();
    singleMode.show();
    // start in the middle 
    push();
    translate((width / 2) + 70, height / 2); 

    if (toggleGrid) {
      showGoldenAngle(); // draw angles 
    } 

    // circle max, circle min, variable rate
    let ts = textWeightSlider.value();
    let stemL = map(textSizeSlider.value(), 40, 140, 0.1, 2);
    drawGlyph(ts,ts / 2, stemL); // draw glyphs 
    stroke("red");
    noFill();
    pop();
  } 

  /// ------------------ TYPING MODE -------------------

  else if (mode === "typeTester") { // typing 

    // ---- PANEL TEXT 
    noStroke();
    fill("white");
    textAlign(LEFT);
    textSize(h4);
    text('Styling', 50, 175)
    textSize(h5);
    
    // text('glyph value: ' + amount, 50, 205);
    text('text size: '+ textSizeSlider.value(), 50, 255);
    text('Text Weight: '+ textWeightName, 50, 305);
    // ---- panel text     

    // ---- BUTTONS TOGGLES 
    singleMode.hide();
    multiMode.hide();
    amountSlider.hide();
    generateButton.hide();
    showGoldenGrid.hide();
    textSizeSlider.hide();
    textWeightSlider.hide();
    // ----- BUTTONS END 

    fill(20);
    // rect(270,160,maxGridWidth + 60,height);

    // push();
    // translate((width / 5) + 50,230);
    stroke(50);
    for (let j = 0; j < 14; j++) { // 14 lines max 
      line((width / 5) + 50, 230 + (50 * j), maxGridWidth + 400, 230 + (50 * j));
    }
    // pop();

    textSize(h4);
    fill(175);
    noStroke();
    text('Press any key to test the language', (width / 5) + 50,160)

    noStroke();
    push();
    translate((width / 5) + 50, 200);

    for (let g of typedGlyphs) {
      push();
      translate(g.x, g.y);

      // TEMP: swap global stems
      let prevStems = stems;
      stems = g.stems;

      // circle max, circle min, variable rate
      drawGlyph(3, 2, 0.1);

      stems = prevStems;
      pop();
    }

    pop();

/// ------------------ INPUT MODE -------------------

  } else if (mode === "inputMode") { //input 

    // ---- PANEL TEXT 
    noStroke();
    fill("white");
    textAlign(LEFT);
    textSize(h4);
    text('Styling', 50, 175)
    textSize(h5);
    
    // text('glyph value: ' + amount, 50, 205);
    text('text size: '+ textSizeSlider.value(), 50, 255);
    text('Text leading: '+ leading.value(), 50, 305);
    // -------- panel text 


    // ---- ellipse bottom left that indicates the reading from the plant 
    fill(150);
    textSize(18);
    ellipse(24, height - 100, map(latestData, 0,700, 10,70));
    text(`current reading: ${latestData}`, 10, height - 48);
    console.log(latestData);

    // ---- BUTTONS TOGGLES 
    singleMode.hide();
    multiMode.hide();
    amountSlider.hide();
    generateButton.hide();
    showGoldenGrid.hide();
    textSizeSlider.hide();
    textWeightSlider.hide();
  // ----- BUTTONS END 
  
    fill(15);
    // rect(xPadding,yPadding,maxGridWidth + 60,height);

    push();
    fill(255);
    translate(300, 200);
    textSize(h4);
    if (latestData < 0) {
      text('No device detected', 150, 50);
    } else {
      
    }

    pop();
  } else {
    // background(100);
    textAlign(CENTER);
    text('Please select a mode... ', width/2, height/2)
  }
}




///// --- CREATE GRID ---- //// 
function showGoldenAngle() {
  let circleDiam = map(textSizeSlider.value(), 40, 140, 40, 450);
  circle(0, 0, circleDiam);

  let g = amountSlider.value();

  strokeWeight(0.5);
  stroke(100);

  let angle = 137.5;
  // let deltaScreen = map(mouseX, -width / 2,width / 2, 1,100);

  for(let i = 0; i < g; i++) {
    push();
    let length = 200;
    rotate(angle * i);
    line(0,0,0,-length);
    pop();
  }
}

function changeMode(newMode) {
  mode = newMode;

  amountSlider.hide();
  textSizeSlider.hide();
  textWeightSlider.hide();
  generateButton.hide();
  showGoldenGrid.hide();
  circleMaxSlider.hide(); 
  circleMinSlider.hide();
  varSlider.hide();
  leading.hide();
  kerning.hide();

  // 1. Reset the data when changing modes
  stems = [];
  typedGlyphs = [];
  typeX = 0;
  typeY = 0;

  // 2. Hide/Show p5 sliders based on the mode
  if (mode === 'glyphMode') {
    textSizeSlider.show();
    generateMultiGlyphs(); // Trigger the initial grid
  } else if (mode === 'inputMode') {
    amountSlider.show();
    generateButton.show();
    inputMode();
  } else {
  }
}