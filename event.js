var curNum = null;
var curTile = null;

var minutes = 0;
var seconds = 0;

var solved = false;
var difficuty = 2;

setInterval(updateTimer,1000);
setInterval(checkGame,1000);

function updateTimer(){
    if(!solved){
        if(++seconds==60){
            minutes++;
            seconds = 0;
        }
        document.getElementById("timer").innerText = "Time Elapsed: " + formstr(minutes) + ":" + formstr(seconds);
    }
}

function formstr(t){
    var res = t + "";
    if(res.length < 2){
        return "0" + res;
    }
    return res;
}


var empty = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]]

var board = JSON.parse(JSON.stringify(empty));

var solution = null;

window.onload = function() {
    generate(difficuty);
    solution = JSON.parse(JSON.stringify(board));
    solve(solution,0,0);
    setGame();
}

function generate(difficuty){
    for(let i=0; i<3; i++){
        var nums = [1,2,3,4,5,6,7,8,9]
        for(let r=3*i; r<3*i+3; r++){
            for(let c=3*i; c<3*i+3; c++){
                var n = Math.floor(Math.random() * 9);
                while(nums[n]==-1)
                    n = Math.floor(Math.random() * 9);
                board[r][c] = nums[n];
                nums[n] = -1;
            }
        }
    }
    solve(board,0,0);
    var tileToBeRemoved = 0;
    switch(difficuty){
        case 1:
            tileToBeRemoved = Math.floor(Math.random() * 5) + 50;
            break;
        case 2:
            tileToBeRemoved = Math.floor(Math.random() * 5) + 55;
            break;
        case 3:
            tileToBeRemoved = Math.floor(Math.random() * 5) + 57;
            break;
        default:
            alert("An unexpected error hsa occured. Please refresh this page.");
            break;

    }
    for(let i=0; i<tileToBeRemoved; i++){
        do{
            x = Math.floor(Math.random() * 9);
            y = Math.floor(Math.random() * 9);
        }while(board[x][y]==0);
        board[x][y] = 0;
    }
}

function isValid(board,i,j,val){
    i_block = i - i % 3;
    j_block = j - j % 3;
    for(let r=0; r<3; r++){
        for(let c=0; c<3; c++){
            if(board[i_block+r][j_block+c]==val){
                return false;
            }
        }
    }
    for(let r=0; r<9; r++){
        if(board[r][j]==val)
            return false;
    }
    for(let c=0; c<9; c++){
        if(board[i][c]==val)
            return false;
    }
    return true;
}

function setGame() {
    for(let i=1; i<=9; i++){
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.classList.add("number");
        number.addEventListener("click",selectNumber);
        document.getElementById("digits").appendChild(number);
    }

    for(let r=0; r<9; r++){
        for(let c=0; c<9; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if(board[r][c]==0){
                tile.innerText = "";
            }else{
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if(r==2||r==5){
                tile.classList.add("horizontal-line");
            }
            if(c==2||c==5){
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click",selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber(){
    if (curNum != null){
        curNum.classList.remove("number-selected");
    }
    if (curNum == this){
        curNum.classList.remove("number-selected");
        curNum = null;
    }else{
        curNum = this;
        curNum.classList.add("number-selected");
    }
}

function selectTile(){
    if(curNum){
        if(this.classList.contains("tile-start")){
            return;
        }
        if(curTile!=null){
            curTile.classList.remove("tile-selected");
        }
        curTile = this;
        curTile.classList.add("tile-selected")
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        board[r][c] = curNum.id;
        checkWrong(r,c,curNum.id);
        this.innerText = curNum.id;
    }
}

function checkWrong(r,c,val){
    let isWrong = false;
    for(let i=0; i<9; i++){
        if(i==c)
            continue;
        let tile = document.getElementById(r.toString()+"-"+i.toString());
        if((board[r][i]==val)){
            isWrong = true;
            tile.classList.add("tile-wrong");
        }else{
            tile.classList.remove("tile-wrong");
        }
    }

    for(let i=0; i<9; i++){
        if(i==r)
            continue;
        let tile = document.getElementById(i.toString()+"-"+c.toString());
        if((board[i][c]==val)){
            isWrong = true;
            tile.classList.add("tile-wrong");
        }else{
            tile.classList.remove("tile-wrong");
        }
    }

    let ib = r - r % 3; let jb = c - c % 3;
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            let x = i+ib, y = j+jb;
            if((x==r)&&(y==c))
                continue;
            let tile = document.getElementById(x.toString()+"-"+y.toString());
            if((board[x][y]==val)){
                isWrong = true;
                tile.classList.add("tile-wrong");
            }else{
                tile.classList.remove("tile-wrong");
            }
        }
    }
    let tile = document.getElementById(r.toString()+"-"+c.toString());
    if(isWrong){
        tile.classList.add("tile-wrong");
    }else{
        tile.classList.remove("tile-wrong");
    }
}

function solve(board,i,j){
    if(i==8 && j==9)
        return true;
    if(j==9){
        i++;
        j = 0;
    }
    if(board[i][j]!=0)
        return solve(board,i,j+1);
    for(let val=1; val<=9; val++){
        if(isValid(board,i,j,val)){
            board[i][j] = val;
            if(solve(board,i,j+1))
                return true;
           }
           board[i][j] = 0;
        }
    return false;
}

function show_solution(){
    updateBoard(solution,true);
    board = JSON.parse(JSON.stringify(solution));
    endgame();
}

function checkWin(board1,board2){
    for(let r=0; r<9; r++){
        for(let c=0; c<9; c++){
            if(board1[r][c]!=board2[r][c])
                return false;
        }
    }
    return true;
}

function updateBoard(board){
    for(let r=0; r<9; r++){
        for(let c=0; c<9; c++){
            var tile = document.getElementById(r.toString()+"-"+c.toString());
            tile.classList.remove("tile-start","tile-selected","tile-wrong");
            if(board[r][c]!=0){
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }else{
                tile.innerText = "";
            }
        }
    }
}

function endgame(){
    var title = document.getElementById("debug");
    title.innerText = "You have solved the sudoku!";
    solved = true;
}

function restart(){
    board = JSON.parse(JSON.stringify(empty));
    generate(difficuty);
    solution = JSON.parse(JSON.stringify(board));
    solve(solution,0,0);
    updateBoard(board,false);
    document.getElementById("debug").innerText = "Solve the sudoko as fast as you can!";
    solved = false;
    minutes = 0; seconds = 0;
}

function checkGame(){
    if(checkWin(board,solution)){
        endgame();
    }
}

function toggledark(){
    document.body.classList.toggle("dark-mode");
}

function resetboard(){
    for(let r=0; r<9; r++){
        for(let c=0; c<9; c++){
            var tile = document.getElementById(r.toString()+"-"+c.toString());
            tile.classList.remove("tile-selected","tile-wrong");
            if(tile.classList.contains("tile-start")==false){
                board[r][c] = 0;
                tile.innerText = "";
            }
        }
    }

    for(let i=1; i<=9; i++){
        let digit = document.getElementById(i.toString());
        if(digit.classList.contains("number-selected"))
            digit.classList.remove("number-selected");
    }

    if(curTile!=null)
        curTile.classList.remove("tile-selected");
}

function openNav(){
    document.getElementById("dif-menu").style.width = "250px";
}

function closeNav(){
    document.getElementById("dif-menu").style.width = "0";
}

function changeDiff(dif){
    difficuty = dif;
    alert("The difficity has changed. It will be applied starting from the next game.");
}

