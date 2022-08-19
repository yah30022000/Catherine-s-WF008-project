let unitLength  =  30; //格子大小，數值越大則全canvas格子數越少
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
    spectrum: ["#5B92E5", "#A1CAF1", "#99BADD", "#71A6D2", "#6495ED", "#007FFF", "#1560BD", "#0047AB"]
    //未穩定有生命時的顏色，會配合random達到隨機變色
}

let forestTheme = {
    canvasColor: "#38592C",
    emptyStrokeColor: "#9A9249",
    strokeColor: "#B9C384",
    boxColor: "#B3BB66",
    boxClickColor: "#AAA04E",
    stableBoxColor: "#4F6F5A",
    spectrum: ["#9F5000","#831212","#5C0100","#B46805","#DC9714","#244710","#223216","#a3562f"]
}

let spaceTheme = {
    canvasColor: "#2c2c2c",
    emptyStrokeColor: "#082032",
    strokeColor: "#002366",
    boxColor: "#334756",
    boxClickColor: "#FFFFF0",
    stableBoxColor: "#518abc",
    spectrum: ["#062c43", "#054569", "#5591a9", "#9ccddc", "#ced7e0", "#f8bc04", "#530f1e", "#7b337d"]
}

let defaultTheme = blueTheme; //配合按鍵轉color theme，一併改為另一種顏色

let pause = document.querySelector('#pause');
let pauseStatus = 0; //default不是pause，pauseStatus為1時同時noLoop，在mouseRelease()定義

function windowResized(){ //window resize時重新setup()鋪設canvas同board
    resizeCanvas(windowWidth, windowHeight);
    setup();  
}

function setup(){ /* Set the canvas to be under the element #canvas*/
    //createCanvas鋪設大背景，背景顏色會受下面background()影響
    const canvas = createCanvas(windowWidth, windowHeight - 100);
    canvas.parent(document.querySelector('#canvas')); //把canvas放回html div內

    /*Calculate the number of columns and rows */
    columns = floor(width/ unitLength); //e.g.
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
    if(sliderArr.length > 0){
        removeElements('#slider');
    }
    slider = createSlider(0, 60, 10);
    slider.parent(document.querySelector("#slider"));

    init();  // Set the initial values of the currentBoard and nextBoard
}

function  init() { //Initialize/reset the board state
    for (let  i  =  0; i  <  columns; i++) {
        for (let  j  =  0; j  <  rows; j++) {
            currentBoard[i][j] =  0;
            nextBoard[i][j] =  0;
        }
    }
    pauseStatus = 0;
}

function  initRandom() { //initialize with random state of currentBoard
    for (let  i  =  0; i  <  columns; i++) {
        for (let  j  =  0; j  <  rows; j++) {
            currentBoard[i][j] = random() > 0.8? 1: 0;
            //each box if get random number larger than 0.8, value will be 1 (have life)
            //so 20% have life, 80% no life
            nextBoard[i][j] = 0;
        }
    }
}

function draw() { //p5.js自建function，setup()後自動while loop per frame，除非有noLoop()停止
    background(defaultTheme.canvasColor); //格仔盤後面canvas背景

    generate(); //計算next Generation
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1){ //如果格子有life，填色
                if(currentBoard[i][j] == nextBoard[i][j]){ //**generate把上世下世轉換，現在nextboard是上世
                    fill(defaultTheme.stableBoxColor);
                    noStroke(); 
                }else{
                    let randomNum = Math.floor(random(0, 8)); //非穩定生命時變8種隨機色
                    fill(defaultTheme.spectrum[randomNum]);
                    noStroke(); 
                }
            }else{
                fill(defaultTheme.boxColor); //無生命色
                stroke(defaultTheme.emptyStrokeColor);
            } 
            //rect描繪正方形／長方形
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
            //for loop出全圖方格，佈滿整board
        }
    }

    let val = slider.value();
    frameRate(val);
    
}

function generate() { //計算next Generation
    let vulnerability = document.getElementsByTagName("option")[document.getElementById('vulnerability').selectedIndex].value;
    let fertility = document.getElementsByTagName("option")[document.getElementById('fertility').selectedIndex].value;
    
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if( i=== 0 && j ===0 ){
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // %以餘數作為currentBoard坐標用於防止超邊框
                    // 經i和j求出的currentBoard值只會是1或0
                    // i和j的for loop會加齊所有8格，視乎格仔currentBoard[x][y]是1或0影響life變化
                    // 例如62%60，會出2，currentBoard[2][2]，是currentBoard[1][1]的右下角neighbor
                    // ******currentBoard[60][60]的右下角neighbor越過board盡頭，等於全圖左上角currentBoard
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }
            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < vulnerability) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > fertility) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == fertility) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            }else {
                // Stasis不變
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}



function mousePressed() { //When mouse is pressed
    if(!mouseX > unitLength * columns || !mouseY > unitLength * rows){
        noLoop();
    }
    
    
    if(spawmAchimspAllow == 1){ //允許放pattern
        placePattern(achimsp);
    }else{
        mouseDragged();
    }
}

function mouseReleased() { //When mouse is released
    if (pauseStatus == 0){
        loop();
    }else{
        noLoop();
    }
}

document.querySelector('#reset-game') //reset button
    .addEventListener('click',function(){
        init();
    });

document.querySelector('#random-reset') //random button
    .addEventListener('click',function(){
        initRandom();
    });

pause.addEventListener('click', function(){ //pause button
    let pauseImg = document.querySelector('#pause-img');
    if(pauseStatus == 0){
        noLoop();
        pauseImg.classList.remove("fa-pause");
        pause.classList.remove("pause-style");
        pauseImg.classList.add("fa-play");
        pause.classList.add("play-style");
        pauseStatus = 1;
    }else{ //resume button
        loop();
        pauseImg.classList.add("fa-pause");
        pause.classList.add("pause-style");
        pauseImg.classList.remove("fa-play");
        pause.classList.remove("play-style");
        pauseStatus = 0;
    }
})

document.querySelector('#blue').addEventListener('click', function(){
    defaultTheme = blueTheme; //change to blue theme
})

document.querySelector('#forest').addEventListener('click', function(){
    defaultTheme = forestTheme; //change to forest theme
})

document.querySelector('#space').addEventListener('click', function(){
    defaultTheme = spaceTheme; //change to space theme
})

function mouseDragged() { // When mouse is dragged
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    
    //If the mouse coordinate is outside the board
    if(mouseX > unitLength * columns || mouseY > unitLength * rows){
        return;
    }
    if(spawmAchimspAllow == 0){ //即正常拖拉mouse放box
        currentBoard[x][y] = 1;
        fill(defaultTheme.boxClickColor);
        stroke(defaultTheme.strokeColor);
        rect(x * unitLength, y * unitLength, unitLength, unitLength);
    }
}

function patternToArray(pattern){
    let lines = pattern.trim().split('\n');//每行成為一個array element
    // lines.pop(); //移除尾行空位
    // lines.shift(); //移除首行空位  
    //switch公式轉化為不同顏色之後在currentBoard計neighbor
    //要加if去判定若不是白色，neighbor加一
    lines = lines.map((line, x) => //array內每行的char字元未分成獨立的element，因此要map內再split map
        line.split('').map((c, y) => { //每行每個char字元成為一個array element
                switch (c) {
                case '-':
                    return 0;
                case 'x':
                    return 1;
                default:
                    return alert(`error co-ordinate [${x}][${y}] at ${pattern}`);
            }
        }),
    );
    return lines;
}

// let patternToArray = pattern.trim().split('\n').map((line, x) => line.split('').map((c, y) => c == '-' ? 0 : c == 'x' ? 1 : alert(`error co-ordinate [${x}][${y}] at ${pattern}`)));

function placePattern(arrPattern){ //放pattern的function
    const x = Math.floor(mouseX / unitLength); //全圖的x軸
    const y = Math.floor(mouseY / unitLength); //全圖的y軸

    if(mouseX > unitLength * columns || mouseY > unitLength * rows){
        return;
    }
    let pat = patternToArray(arrPattern); //把現有pattern圖變成array
    for(let patY = 0; patY < pat.length; patY++){ //先走Y軸
        for(let patX = 0; patX < pat[patY].length; patX++){ //再走Y軸
            if(pat[patX][patY] == 1){ //當有1的值
                currentBoard[(x + patX + columns) % columns][(y + patY + rows) % rows] = 1; //填入mouse所指向的格
                fill(defaultTheme.boxClickColor); //填入顏色
                stroke(defaultTheme.strokeColor); //填入邊框顏色
                rect((x + patY) * unitLength, (y + patX) * unitLength, unitLength, unitLength);
            } //rect也是必須，注意pattern的X與Y值相反加入
        }
    }
    return;
}

let achimsp = `
..............OO
..............OO

............OOOO
...........O....O....OO
............O.OOO.....O
.........OOO.OO.....O
........O....OO....O.OOOO
........OOO.O......O.O..O
............O.OO..OO
........OO.O..O..O..O.O
........OO.O.O..O..O...O
..OO........O.OOO....O..O
..O.O........O.....OO.OOO
...O..........OOO..O
.....O.O........OOO..OO
.OOOOOO............O.O
O...............OO.O.O
.OOOOOO.........OO.OO
.....O.O
...O
..O.O
..OO
........OO.O
........OO.OOO
..............O
........OO.OOO
......O..O.O
......OO
`;

let spawnAchimspBtn = document.querySelector('#spawn-achimsp');
let spawmAchimspAllow = 0; //允許放pattern開關

spawnAchimspBtn.addEventListener('click', function(){
    if(spawmAchimspAllow == 0){
        spawmAchimspAllow = 1;
        spawnAchimspBtn.classList.add("spawn-btn-style");
        spawnAchimspBtn.innerText = 'Spawn achimsp: On';
    }else{
        spawmAchimspAllow = 0;
        spawnAchimspBtn.classList.remove("spawn-btn-style");
        spawnAchimspBtn.innerText = 'Spawn achimsp: Off';
    }
})

function codeToLink(){ //input code to jump to next page
    let code = "game"; //指定passcode
    let input = []; //user input, default empty
    let inputTimer; //timer for input
    let codeChecker = document.querySelector('#code-checker');
    //codeChecker: link to HTML page to show whether if input successful or not

    document.addEventListener('keydown', (event)=>{
        input.push(event.key); //push each keyboard key into input array
    })
    clearTimeout(inputTimer);
    codeChecker.innerHTML = "";
    inputTimer = setTimeout(function(){ //perform check procedure after 4 secs of codeToLink is running
        let joinedInput = input.join('');
        if(code == joinedInput){
            console.log(joinedInput); //successful input
            codeChecker.innerHTML = `<span class = "text-success">Code correct</span>`
            setTimeout(function(){ //jump to next page in 2 secs
                window.location.href = "game-of-catch.html";
            }, 2000);
        }else if(joinedInput == ""){ //empty input, show on console
            console.log('code log empty, try input something');
        }else{ //unmatched input
            codeChecker.innerHTML = `<span class = "text-danger">Code not match</span>`
        }
    }, 4000)
}

codeToLink(); //run once at html onload
setInterval(codeToLink, 5000); //run the program again per 5 secs

////old neon function
// var headerTexts = document.querySelectorAll('#header-container span');

// function switchHeaderColor() {
//     for(let headerText of headerTexts){
//         if (headerText.title == 1) {
//         headerText.className = "neon-red";
//         headerText.title = 2;
//    }
//    else if (headerText.title == 2){
//         headerText.className = "neon-blue";
//         headerText.title = 3;
//    }else{
//         headerText.className = "neon-green";
//         headerText.title = 1;
//    }
//     }
   
// }

// switchHeaderColor();

// setInterval(switchHeaderColor, 500);
