let unitLength = 10; //格子大小，數值越大則全canvas格子數越少
let columns; /* To be determined by window width*/
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let slider;
let canvasColor = "#222222";
let boxClickColor = "#ff5959";
let enemyStrokeColor = "#49160b";
let digimonPixelColors = [
    "", // 0 blank, no life
    "", // 1 agumon fire
    "", // 2 gabumon fire
    "#000000", // 3 black x
    "#FDFF00", // 4 light yellow y
    "#FEC100", // 5 yellow Y
    "#E26B09", // 6 orange o
    "#e1e154", // 7 yellow Y
    "#00B050", // 8 green g
    "#B8CDE3", // 9 azure blue b
    "#376092", // 10 navy blue B
    "#90CEDB", // 11 teal t
    "#7F63A2", // 12 purple p
    "#913B39", // 13 wine red R
    "#000000", // 14 strong white w
];

function patternToArray(pattern) {
    let lines = pattern.split('\n');//每行成為一個array element
    lines.pop(); //移除尾行空位
    lines.shift(); //移除首行空位  
    //switch公式轉化為不同顏色之後在currentBoard計neighbor
    //要加if去判定若不是白色，neighbor加一
    lines = lines.map((line, x) => //array內每行的char字元未分成獨立的element，因此要map內再split map
        line.split('').map((c, y) => { //每行每個char字元成為一個array element
            switch (c) {
                case '-':
                    return 0; //white
                case 'x':
                    return 2; //black
                case 'b':
                    return 3; //light blue
                case 'i':
                    return 4; //strong blue
                case 'B':
                    return 5; //green
                case 'g':
                    return 6; //yellow
                case 'y':
                    return 7; //orange
                case 'o':
                    return 8; //strong orange
                case 'O':
                    return 9; //purple
                case 'p':
                    return 10; //coffee brown
                case 'c':
                    return 11; //deep green
                case 'd':
                    return 12; //strong brown
                case 's':
                    return 13; //lake blue
                case 'L':
                    return 14; //red
                case 'r':
                    return 15; //strong white
                case 'w':
                    return alert(`error co-ordinate [${x}][${y}] at ${pattern}`);
            }
        }),
    );
    return lines;
}

let achimsp = `
......................................O
......................................OO........OO
.......................................OO.......OO
..........OO..OO..................OO..OO
`;

let agumon = ` 
-------xxxx-xx--------
------xYYyyxYxxx------
-----xYYxxYyYYYYx-----
----xYYxgwxYyyyyyxx---
----xYYxgxxYYYyyyyYxx-
---xoYYxwxxYYYYYYYyyYx
---xoYYyxxYYYYYYYbYYbb
---xoYYYyyyYYYYYYoYYob
---xoYYYYbYYYYYYYYYYYb
----xoYYYoxwxxYYYYYwx-
----xoYYYYYYYxwxxxwxx-
-----xYYYYYYYYYYYYYx--
-----xoYYYYYYYYxxxx---
-----xYooYYYoox-------
----xYYoYYYYox--------
----xYYoooYYxox-------
---xoYoooYYYxYxxx-----
---xYYYbboYYYxYYYxx---
-xxoYYyyyxxYYxoYwwwx--
xYxooYYwwwwxoxowxwxwx-
xooxowwxwxwxYYxxwwxwx-
-xooxxwxwxxooYxwxxxx--
--xxxoxxxxoooxx-------
---xoooYYYxxoYYxx-----
---xoowwYwYwxoowwx----
----xxxxxxxxxxxxx-----
`

let gabumon = `
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
xxRbxxxxyxRxiiiixyyx-------
-xxxwxwyyxxxRxRxyyyyx------
---xxxxxxxxxxwxwwxwyx------
------------xxxxxxxx-------  `