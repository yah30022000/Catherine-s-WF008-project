let enemySpectrum = [
    "", //0 blank
    "", //1 blank
    "#000000", //2 black b
    "#76cccd", //3 light blue i
    "#0f97ff", //4 strong blue B
    "#50ad51", //5 green g
    "#e1e154", //6 yellow Y
    "#f99542", //7 orange o
    "#d4722d", //8 strong orange O
    "#69659d", //9 purple p
    "#8d4c1c", //10 coffee color c
    "#315865", //11 deep green d
    "#8b3c38", //12 strong brown s
    "#9fcbda", //13 lake blue L
    "#FF0000", //14 red r
    "#000000", //15 strong white w
]

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

let agumon = ` 
-------bbbb-bb--------
------booyybobbb------
-----boobboyoooob-----
----boobg-boyyyyybb---
----boobgbboooyyyyobb-
---bOoob-bboooooooyyob
---bOooybboooooooboobb
---bOoooyyyooooooOooOb
---bOoooobooooooooooob
----bOoooOb-bbooooo-b-
----bOooooooob-bbb-bb-
-----booooooooooooob--
-----bOoooooooobbbb---
-----boOOoooOOb-------
----booOooooOb--------
----booOOOoobOb-------
---bOoOOOooobobbb-----
---booobbOooobooobb---
-bbOooyyybboobOo---b--
bobOOoo----bObO-b-b-b-
bOObO--b-b-boobb--b-b-
-bOObb-b-bbOOob-bbbb--
--bbbObbbbOOObb-------
---bOOOooobbOoobb-----
---bOO--o-o-bOO--b----
----bbbbbbbbbbbbb-----
`

let gabumon = `
--b------------------------
--bb----bbb----------------
--byb--bBBbb---------------
---byb-bib------bbb--------
---byybib-----bbiBBbb------
----byybbbb--biibbbbbb-----
----bybBBBBbbibb-----------
---bibBiiiiiBb-------------
--bBBBiBbbBBiBb------------
-bbbBiib-ObiiiBb-----------
bBBiiibb-coBBiiBBb---------
biiiiiBiiBiiiBBiBb---------
biiiiiBBiBBiiiiiBb---------
-bbbbb-b-b-iiiiBiBb--------
-bbbbb-b-b-iiiiBiBb--------
--byyybybybbiiiiiBb--bbbbb-
---bbyyyyyybBBibBiibbyyyybb
-----bbbbyyybiibiiBiyyyyb--
-----bBbdLLybiiibBBibyyb---
----bibbLpLbiiBBbiisbyb----
--bbBbybpLpbiiiibbsbbyb----
-biiBbyybpbBBBiibybybb-----
bsbiibyyyb-iiiiibyyyb------
bbsibbbbybsbiiiibyyb-------
-bbb-b-yybbbsbsbyyyyb------
---bbbbbbbbbb-b--b-yb------
------------bbbbbbbb-------
`

let fball = `
--------O--O------------
-----rrr----------------
---rrOOOr--rrrr---------
--rOOOrrrrrOOOOr--------
-rOOOOOOwrOOOrrr--------
-rOOwwwwwwwwOOOOr-------
rOOOwwwwwwwwwwOOOOO-----
rOOwwwwwwwwwwwwwOwwwOw--
-rOwwwwwwwwwwwwwwOOOOOOO
rOOOwwwwOwwwwOOOOrrrr---
rOOOOwwOOOOOOOrOr-------
-rrOOOwOOrOOOOOr--------
--rOOOOOOOrOOOr---------
---rOOOOrrOrrrrr--------
----rrrr--r-------------
`

let bfball = `
--------i--i------------
-----BBB----------------
---BBiiiB--BBBB---------
--BiiiBBBBBiiiiB--------
-BiiiiiiwBiiiBBB--------
-BiiwwwwwwwwiiiiB-------
Biiiwwwwwwwwwwiiiii-----
Biiwwwwwwwwwwwwwiwwwiw--
-Biwwwwwwwwwwwwwwiiiiiii
BiiiwwwwiwwwwiiiiBBBB---
BiiiiwwiiiiiiiBiB-------
-BBiiiwiiBiiiiiB--------
--BiiiiiiiBiiiB---------
---BiiiiBBiBBBBB--------
----BBBB--B-------------
`