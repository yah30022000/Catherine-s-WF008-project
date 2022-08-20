let unitLength = 15; //格子大小，數值越大則全canvas格子數越少
let columns; /* To be determined by window width*/
let rows; /* To be determined by window height */
let currentBoard; //今世的格子佈局，在generate中計算，在draw中填入格子及顏色
let nextBoard; //下世的格子佈局，在generate中計算，在draw中填入格子及顏色
let slider; //slider bar (framerate)

let blueTheme = {
  canvasColor: "#003366", //canvas背景
  emptyStrokeColor: "#2c2c2c", //無生命邊界顏色
  strokeColor: "#A1CAF1", //有生命邊界顏色
  boxColor: "#F8F8FF", //格子顏色黑白透明度，數值越大則透明，最大值255(背景白色)
  boxClickColor: "#CCCCFF", //mouse按入格子顏色
  stableBoxColor: "#002FA7", //穩定有生命格子顏色
  spectrum: [
    "#5B92E5",
    "#A1CAF1",
    "#99BADD",
    "#71A6D2",
    "#6495ED",
    "#007FFF",
    "#1560BD",
    "#0047AB",
  ],
  //未穩定有生命時的顏色，會配合random達到隨機變色
};

let forestTheme = {
  canvasColor: "#38592C",
  emptyStrokeColor: "#9A9249",
  strokeColor: "#B9C384",
  boxColor: "#B3BB66",
  boxClickColor: "#AAA04E",
  stableBoxColor: "#4F6F5A",
  spectrum: [
    "#9F5000",
    "#831212",
    "#5C0100",
    "#B46805",
    "#DC9714",
    "#244710",
    "#223216",
    "#a3562f",
  ],
};

let spaceTheme = {
  canvasColor: "#2c2c2c",
  emptyStrokeColor: "#082032",
  strokeColor: "#002366",
  boxColor: "#334756",
  boxClickColor: "#FFFFF0",
  stableBoxColor: "#518abc",
  spectrum: [
    "#062c43",
    "#054569",
    "#5591a9",
    "#9ccddc",
    "#ced7e0",
    "#f8bc04",
    "#530f1e",
    "#7b337d",
  ],
};

let digimonPixelColors = [
  "", // 0 blank, no life
  "#f7a427", // 1 agumon fire
  "#54c0ff", // 2 gabumon fire
  "#000000", // 3 black x
  "#FDFF00", // 4 light yellow y
  "#FEC100", // 5 yellow Y
  "#E26B09", // 6 orange o
  "#00B050", // 7 green g
  "#B8CDE3", // 8 azure blue b
  "#376092", // 9 navy blue B
  "#90CEDB", // 10 teal t
  "#7F63A2", // 11 purple p
  "#913B39", // 12 wine red R
  "#FFFFFF", // 13 strong white w
];

let defaultTheme = blueTheme; //配合按鍵轉color theme，一併改為另一種顏色

let pause = document.querySelector("#pause");
let pauseStatus = 0; //default不是pause，pauseStatus為1時同時noLoop，在mouseRelease()定義

function windowResized() {
  //window resize時重新setup()鋪設canvas同board
  unitLength = height / 30;
  resizeCanvas(windowWidth, windowHeight);
  setup();
}

function setup() {
  /* Set the canvas to be under the element #canvas*/
  //createCanvas鋪設大背景，背景顏色會受下面background()影響
  const canvas = createCanvas(windowWidth, windowHeight - 100);
  canvas.parent(document.querySelector("#canvas")); //把canvas放回html div內

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength); //e.g.
  rows = floor(height / unitLength);

  /*鋪設格仔，Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }
  // Now both currentBoard and nextBoard are array of array of undefined values.
  // 例如currentBoard[0][1, 2, 3]即指第一列有三格子

  let sliderArr = document.querySelectorAll("#slider");
  if (sliderArr.length > 0) {
    removeElements("#slider");
  }
  slider = createSlider(0, 60, 10);
  slider.parent(document.querySelector("#slider"));

  init(); // Set the initial values of the currentBoard and nextBoard
}

function init() {
  //Initialize/reset the board state
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
  pauseStatus = 0;

  let agumon = new Digimon(
    100,
    20,
    20,
    "agumon",
    "rookie",
    agumonPattern,
    attackPattern1,
    null
  );
  let gabumon = new Digimon(
    100,
    20,
    20,
    "gabumon",
    "rookie",
    gabumonPattern,
    attackPattern1.replaceAll("#", "@"),
    // attackPattern1.replaceAll("#", "@").split("\n").map((item)=>item.split("").reverse().join("")).join("\n"),
    null
  );
  agumon.spawn();
  gabumon.spawn();

}


function draw() {
  //p5.js自建function，setup()後自動while loop per frame，除非有noLoop()停止
  background(defaultTheme.canvasColor); //格仔盤後面canvas背景

  generate(); //計算next Generation
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        // 亞古獸火球
        fill(digimonPixelColors[1]);
        noStroke();
        rect(i * unitLength, j * unitLength, unitLength, unitLength);
      } else if (currentBoard[i][j] == 2) {
        // 加布獸火球
        fill(digimonPixelColors[2]);
        noStroke();
        rect(i * unitLength, j * unitLength, unitLength, unitLength);
      } else if (
        currentBoard[i][j] > 2 &&
        currentBoard[i][j] == nextBoard[i][j]
      ) {    
        fill(digimonPixelColors[currentBoard[i][j]]);
        noStroke();
        rect(i * unitLength, j * unitLength, unitLength, unitLength);
      } else {
        fill(defaultTheme.boxColor); //無生命色
        // stroke(defaultTheme.emptyStrokeColor);
        noStroke();
      }
      //rect描繪正方形／長方形
      
      //for loop出全圖方格，佈滿整board
    }
  }

  let val = slider.value();
  frameRate(val);
}

function generate() {
  //計算next Generation
  let vulnerability =
    document.getElementsByTagName("option")[
      document.getElementById("vulnerability").selectedIndex
    ].value;
  let fertility =
    document.getElementsByTagName("option")[
      document.getElementById("fertility").selectedIndex
    ].value;

  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let agumonFireNeighbors = 0;
      let gabumonFireNeighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i === 0 && j === 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // %以餘數作為currentBoard坐標用於防止超邊框
          // 經i和j求出的currentBoard值只會是1或0
          // i和j的for loop會加齊所有8格，視乎格仔currentBoard[x][y]是1或0影響life變化
          // 例如62%60，會出2，currentBoard[2][2]，是currentBoard[1][1]的右下角neighbor
          // ******currentBoard[60][60]的右下角neighbor越過board盡頭，等於全圖左上角currentBoard
          if (
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows] ==
              1 &&
            (x + i + columns) % columns != 0 &&
            (y + j + rows) % rows != 0
          ) {
            agumonFireNeighbors += 1;
          } else if (
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows] ==
              2 &&
            (x + i + columns) % columns != 0 &&
            (y + j + rows) % rows != 0
          ) {
            gabumonFireNeighbors += 1;
          }
        }
      }
      // Rules of Life: Agumon
      if (currentBoard[x][y] == 1 && agumonFireNeighbors < vulnerability) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && agumonFireNeighbors > fertility) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && agumonFireNeighbors == fertility) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;

        // Rules of Life: Gabumon
      } else if (
        currentBoard[x][y] == 2 &&
        gabumonFireNeighbors < vulnerability
      ) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 2 && gabumonFireNeighbors > fertility) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && gabumonFireNeighbors == fertility) {
        // New life due to Reproduction
        nextBoard[x][y] = 2;
      } else {
        // Stasis不變
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

document
  .querySelector("#reset-game") //reset button
  .addEventListener("click", function () {
    init();
  });

// document
//   .querySelector("#random-reset") //random button
//   .addEventListener("click", function () {
//     initRandom();
//   });

pause.addEventListener("click", function () {
  //pause button
  let pauseImg = document.querySelector("#pause-img");
  if (pauseStatus == 0) {
    noLoop();
    pauseImg.classList.remove("fa-pause");
    pause.classList.remove("pause-style");
    pauseImg.classList.add("fa-play");
    pause.classList.add("play-style");
    pauseStatus = 1;
  } else {
    //resume button
    loop();
    pauseImg.classList.add("fa-pause");
    pause.classList.add("pause-style");
    pauseImg.classList.remove("fa-play");
    pause.classList.remove("play-style");
    pauseStatus = 0;
  }
});

document.querySelector("#blue").addEventListener("click", function () {
  defaultTheme = blueTheme; //change to blue theme
});

document.querySelector("#forest").addEventListener("click", function () {
  defaultTheme = forestTheme; //change to forest theme
});

document.querySelector("#space").addEventListener("click", function () {
  defaultTheme = spaceTheme; //change to space theme
});

// function mousePressed() {
//   //When mouse is pressed
//   if (!mouseX > unitLength * columns || !mouseY > unitLength * rows) {
//     noLoop();
//   }

//   mouseDragged();
// }

// function mouseReleased() {
//   //When mouse is released
//   if (pauseStatus == 0) {
//     loop();
//   } else {
//     noLoop();
//   }
// }

// function mouseDragged() {
//   // When mouse is dragged
//   const x = Math.floor(mouseX / unitLength);
//   const y = Math.floor(mouseY / unitLength);

//   //If the mouse coordinate is outside the board
//   if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
//     return;
//   }
//     //即正常拖拉mouse放box
//     currentBoard[x][y] = 1;
//     fill(defaultTheme.boxClickColor);
//     stroke(defaultTheme.strokeColor);
//     rect(x * unitLength, y * unitLength, unitLength, unitLength);
// }

function patternToArray(pattern) {
  let lines = pattern.split("\n"); //每行成為一個array element
  lines.pop(); //移除尾行空位
  lines.shift(); //移除首行空位
  //switch公式轉化為不同顏色之後在currentBoard計neighbor
  //要加if去判定若不是白色，neighbor加一
  lines = lines.map(
    (
      line,
      x //array內每行的char字元未分成獨立的element，因此要map內再split map
    ) =>
      line.split("").map((c, y) => {
        //每行每個char字元成為一個array element
        switch (c) {
          case "-":
            return 0; // white
          case "#":
            return 1; // agumon fire
          case "@":
            return 2; // gabumon fire
          case "x":
            return 3; // black
          case "y":
            return 4; // light yellow
          case "Y":
            return 5; // yellow
          case "o":
            return 6; // orange
          case "g":
            return 7; // green
          case "b":
            return 8; // azure blue
          case "B":
            return 9; // navy blue
          case "t":
            return 10; // teal
          case "p":
            return 11; // purple
          case "R":
            return 12; // wine red
          case "w":
            return 13; // strong white
          default:
            return alert(`error co-ordinate [${x}][${y}] at ${pattern}`);
        }
      })
  );
  console.log('lines: ', lines)
  return lines;
}

/**
 * @param {Digimon} digimon includes ---xxx---
 * @param {string} placeMode e.g. placeLeft, placeRight,
 *  moveUp, moveDown, moveLeft, moveRight, attackLeft, attackRight
 * @returns
 */
function stagePlacePattern(digimon, placeMode) {
  let validPlaceModes = [
    "placeLeft",
    "placeRight",
    "moveUp",
    "moveDown",
    "moveLeft",
    "moveRight",
    "attackLeft",
    "attackRight",
  ];

  // cancel if invalid place modes
  if (!digimon || !validPlaceModes.includes(placeMode)) {
    return;
  }

  // attack pattern must exist for attack moves
  if (
    (placeMode === "attackLeft" || placeMode === "attackRight") &&
    digimon.attackPattern1String == null
  ) {
    return;
  }

  let pat = patternToArray(digimon.patternString); //把現有pattern圖變成array
  let attackPattern =
    placeMode == "attackLeft" || placeMode == "attackRight"
      ? patternToArray(digimon.attackPattern1String)
      : [];

  let placeLocationWidth = 1; // 闊度除開的分母，越大，pattern放越上方位置
  let placeLocationHeight = 1; // 長度除開的分母，越大，pattern放越左方位置
  let moveCellDistance = 2; // 移動格數

  // e.g. 亞古獸放左
  if (placeMode === "placeLeft") {
    placeLocationWidth = 6;
    placeLocationHeight = 6;
    // e.g. 加布獸放右
  } else if (placeMode === "placeRight") {
    placeLocationWidth = 1.5;
    placeLocationHeight = 6;
  }

  let x = floor(windowWidth / unitLength / placeLocationWidth); //全圖的x軸
  let y = floor(windowHeight / unitLength / placeLocationHeight); //全圖的y軸

  if (digimon.currentPosition != null) {
    x = digimon.currentPosition.x;
    y = digimon.currentPosition.y;
  }

  let topLeftCoordinate = { x: x, y: y };
  let topRightCoordinate = { x: x + pat[0].length, y: y };
  let bottomLeftCoordinate = { x: x, y: y + pat.length };
  let bottomRightCoordinate = { x: x + pat[0].length, y: y + pat.length };

    console.log(
        "topLeftCoordinate: ",
        topLeftCoordinate,
        "topRightCoordinate: ",
        topRightCoordinate,
        "bottomLeftCoordinate: ",
        bottomLeftCoordinate,
        "bottomRightCoordinate: ",
        bottomRightCoordinate
    );

  if (
    (placeMode === "moveUp" &&
      (topLeftCoordinate.y - moveCellDistance <= 0 ||
        topRightCoordinate.y - moveCellDistance <= 0)) ||
    (placeMode === "moveDown" &&
      (bottomLeftCoordinate.y + moveCellDistance >= rows ||
        bottomRightCoordinate.y + moveCellDistance >= rows)) ||
    (placeMode === "moveLeft" &&
      (topLeftCoordinate.x - moveCellDistance <= 0 ||
        bottomLeftCoordinate.x - moveCellDistance <= 0)) ||
    (placeMode === "moveRight" &&
      (topRightCoordinate.x + moveCellDistance >= columns ||
        bottomRightCoordinate.x + moveCellDistance >= columns))
  ) {
    return;
  }

  if (placeMode === "attackRight") {
    let attackPatternTopLeftX = topRightCoordinate.x + 2;
    let attackPatternTopLeftY =
      (topRightCoordinate.y + bottomRightCoordinate.y) / 3;

    for (let patY = 0; patY < attackPattern.length; patY++) {
      //先走Y軸
      for (let patX = 0; patX < attackPattern[patY].length; patX++) {
        //再走X軸
        currentBoard[(attackPatternTopLeftX + patX + columns) % columns][
          (attackPatternTopLeftY + patY + rows) % rows
        ] = attackPattern[patY][patX]; //填入mouse所指向的格
        fill(digimonPixelColors[attackPattern[patY][patX]]); //填入顏色
        // stroke(150); //填入邊框顏色
        // rect( 
        //   (attackPatternTopLeftX + patY) * unitLength,
        //   (attackPatternTopLeftY + patX) * unitLength,
        //   unitLength,
        //   unitLength
        // );
      }
    }
    return;
  } else if (placeMode === "attackLeft") {
    
    let attackPatternTopRightX = topLeftCoordinate.x - 2;
    let attackPatternTopRightY =
      (topLeftCoordinate.y + bottomLeftCoordinate.y) / 3;
      console.log("attackPatternTopRightX: ", attackPatternTopRightX);
      console.log("attackPatternTopRightY: ", attackPatternTopRightY);
      console.log("attackPattern: ", attackPattern);

    for (let patY = 0; patY < attackPattern.length; patY++) {
      //先走Y軸
      for (let patX = 0; patX < attackPattern[patY].length; patX++) {
        //再走X軸
        currentBoard[(attackPatternTopRightX - patX + columns) % columns][
          (attackPatternTopRightY - patY + rows) % rows
        ] = attackPattern[patY][patX]; //填入mouse所指向的格
        fill(digimonPixelColors[attackPattern[patY][patX]]); //填入顏色
        // stroke(150); //填入邊框顏色
        // rect(
        //   (attackPatternTopRightX + patY) * unitLength,
        //   (attackPatternTopRightY + patX) * unitLength,
        //   unitLength,
        //   unitLength
        // );
      }
    }
    
    return;
  } else if (placeMode !== "placeLeft" || placeMode !== "placeRight") {
    // 先清走，下面再系新坐標刷新digimon pattern
    for (let patY = 0; patY < pat.length; patY++) {
      //先走Y軸
      for (let patX = 0; patX < pat[patY].length; patX++) {
        //再走X軸
        currentBoard[(x + patX + columns) % columns][
          (y + patY + rows) % rows
        ] = 0; //填入mouse所指向的格
        noFill(); //填入顏色
        // stroke(150); //填入邊框顏色
        rect(
          (x + patY) * unitLength,
          (y + patX) * unitLength,
          unitLength,
          unitLength
        );
      }
    }
  }

  switch (placeMode) {
    case "moveUp":
      y -= moveCellDistance;
      break;
    case "moveDown":
      y += moveCellDistance;
      break;
    case "moveLeft":
      x -= moveCellDistance;
      break;
    case "moveRight":
      x += moveCellDistance;
      break;
    default:
      break;
  }

  //   console.log("digimon: ", digimon, "placeMode: ", placeMode);

  for (let patY = 0; patY < pat.length; patY++) {
    //先走Y軸
    for (let patX = 0; patX < pat[patY].length; patX++) {
      //再走X軸
      currentBoard[(x + patX + columns) % columns][(y + patY + rows) % rows] =
        pat[patY][patX]; //填入mouse所指向的格
    //   fill(digimonPixelColors[pwdat[patY][patX]]); //填入顏色
      noStroke(); //填入邊框顏色
    //   rect(
    //     (x + patY) * unitLength,
    //     (y + patX) * unitLength,
    //     unitLength,
    //     unitLength
    //   );
    }
  }

  return (digimon.currentPosition = { x: x, y: y });
}

let agumonPattern = ` 
-------xxxx-xx--------
------xYYyyxYxxx------
-----xYYxxYyYYYYx-----
----xYYxgwxYyyyyyxx---
----xYYxgxxYYYyyyyYxx-
---xoYYxwxxYYYYYYYyyYx
---xoYYyxxYYYYYYYxYYxx
---xoYYYyyyYYYYYYoYYox
---xoYYYYxYYYYYYYYYYYx
----xoYYYoxwxxYYYYYwx-
----xoYYYYYYYxwxxxwxx-
-----xYYYYYYYYYYYYYx--
-----xoYYYYYYYYxxxx---
-----xYooYYYoox-------
----xYYoYYYYox--------
----xYYoooYYxox-------
---xoYoooYYYxYxxx-----
---xYYYxxoYYYxYYYxx---
-xxoYYyyyxxYYxoYwwwx--
xYxooYYwwwwxoxowxwxwx-
xooxowwxwxwxYYxxwwxwx-
-xooxxwxwxxooYxwxxxx--
--xxxoxxxxoooxx-------
---xoooYYYxxoYYxx-----
---xoowwYwYwxoowwx----
----xxxxxxxxxxxxx-----
`;

let gabumonPattern = `
--x------------------------
--xx----xxx----------------
--xyx--xBBxx---------------
---xyx-xbx------xxx--------
---xyyxbx-----xxbBBxx------
----xyyxxxx--xbbxxxxxx-----
----xyxBBBBxxbxx-----------
---xbxBbbbbbBx-------------
--xBBBbBxxBBbBx------------
-xxxBbbxwoxbbbBx-----------
xBBbbbxxRoBBbbBBx----------
xbbbbbBbbBbbbBBbBx---------
xbbbbbBBbBBbbbbbBx---------
-xxxxxxwxwxwbbbbBbBx-------
--xyyyxyxyxxbbbbbBx--xxxxx-
---xxyyyyyyxBBbxBbbxxyyyyxx
-----xxxxyyyxbbxbbBxyyyyx--
-----xBxgttyxbbbxBBbxyyx---
----xbxxtptxbbBBxbbRxyx----
--xxBxyxptpxbbbbxxRxxyx----
-xbbBxyyxpxBBBbbxyxyxx-----
xRxbbxyyybwbbbbbxyyyx------
xxRbxxxxyxRxbbbbxyyx-------
-xxxwxwyyxxxRxRxyyyyx------
---xxxxxxxxxxwxwwxwyx------
------------xxxxxxxx-------
`;

let attackPattern1 = `
-#-------
#-#------
#--#-----
--#------
####-----
-#-##-#--
###----##
-------##
###----##
-#-##-#--
####-----
--#------
#--#-----
#-#------
-#-------
`;

class Digimon {
  hp;
  atk;
  def;
  name;
  evolutionState; // optional, 成長期 Rookie, 成熟期 champion, 完全體 Ultimate, 究極體 Mega
  patternString;
  attackPattern1String;
  currentPosition; // e.g. {x: 20, y: 40}

  constructor(
    hp,
    atk,
    def,
    name,
    evolutionState,
    patternString,
    attackPattern1String,
    currentPosition
  ) {
    this.hp = hp;
    this.atk = atk;
    this.def = def;
    this.name = name;
    this.evolutionState = evolutionState;
    this.patternString = patternString;
    this.attackPattern1String = attackPattern1String;
    this.currentPosition = currentPosition;
  }

  spawn() {
    if (this.name === "agumon") {
      stagePlacePattern(this, "placeLeft");
    } else if (this.name === "gabumon") {
      stagePlacePattern(this, "placeRight");
    }

    this.move();
    this.attack();
  }

  move() {
    if (this.name === "agumon") {
      document.addEventListener("keydown", (event) => {
        switch (event.key) {
          case "w":
            // up
            stagePlacePattern(this, "moveUp");
            break;
          case "s":
            // down
            stagePlacePattern(this, "moveDown");
            break;
          case "a":
            // left
            stagePlacePattern(this, "moveLeft");
            break;
          case "d":
            // right
            stagePlacePattern(this, "moveRight");
            break;
          default:
            break;
        }
      });
    } else if (this.name === "gabumon") {
      document.addEventListener("keydown", (event) => {
        switch (event.key) {
          case "ArrowUp":
            // up
            stagePlacePattern(this, "moveUp");
            break;
          case "ArrowDown":
            // down
            stagePlacePattern(this, "moveDown");
            break;
          case "ArrowLeft":
            // left
            stagePlacePattern(this, "moveLeft");
            break;
          case "ArrowRight":
            // right
            stagePlacePattern(this, "moveRight");
            break;
          default:
            break;
        }
      });
    }
  }

  attack() {
    if (this.name === "agumon") {
      document.addEventListener("keydown", (event) => {
        switch (event.key) {
          case "f":
            stagePlacePattern(this, "attackRight");
          break;
        }
      });
    }else if (this.name === "gabumon") {
      document.addEventListener("keydown", (event) => {
        switch (event.key) {
          case "/":
            stagePlacePattern(this, "attackLeft");
          break;
        }
      });
    }
  }
}
