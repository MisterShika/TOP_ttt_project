function gameBoardModule () {
    const theBoard = [];

    const initBoard = (size) => { 
        for(let x = 0; x < size; x++){
            theBoard[x] = [];
            for(let y = 0; y < size; y++){
                theBoard[x].push(false);
            }
        }
    }

    const winCheck = (x, y, player) => {
        let boardSize = theBoard.length - 1;
        //Horizontal win check
        if (theBoard[y].every(element => element === player)){
            return true;
        }
        //Vertical win check
        for(let i = 0; i <= boardSize; i++){
            if(theBoard[i][x] != player){
                break;
            }else if(i === boardSize){
                return true;
            }
        }
        //Diagonal win check
        if(x === y){
            for(let i = 0; i <= boardSize; i++){
                if(theBoard[i][i] != player){
                    break;
                }else if(i === boardSize){
                    return true;
                }
            }
        }
    }

    const markBoard = (x, y, player) => {
        theBoard[y][x] === false && (theBoard[y][x] = player);
    };
    
    const printBoard = () => theBoard;

    return {initBoard, printBoard, markBoard, winCheck};
}

function playersModule () {
    const player1 = "X";
    const player2 = "O";
    let currentPlayer;
    const randomNumber = Math.floor(Math.random() * 2);

    const getStartPlayer = () => {
        randomNumber > 0 ? currentPlayer = player1 : currentPlayer = player2;
    }

    const switchPlayers = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    }

    const getCurrentPlayer = () => currentPlayer;

    getStartPlayer();

    return {getStartPlayer, switchPlayers, getCurrentPlayer};
}

function guiModule (playerData, lockData) {
    const gameHolder = document.getElementById("gameHolder");
    const players = playerData;
    const lockCheck = lockData;
    
    const markBoard = (square) => {
        square.classList.add(`player-${players.getCurrentPlayer()}`);
    }

    const generateBoard = (size, func) => {
        for(let y = 0; y < size; y++){
            for(let x = 0; x < size; x++){
                let newSquare = document.createElement('div');
                newSquare.setAttribute("x-value", x);
                newSquare.setAttribute("y-value", y);
                newSquare.addEventListener("click", (event) => {
                    if(!lockCheck()){
                        markBoard(event.target);
                        func(event.target.getAttribute("x-value"), event.target.getAttribute("y-value"));
                    }
                });
                gameHolder.appendChild(newSquare);
            }
        }
    }

    return {generateBoard};
}

function gameController (size = 3) {
    const board = gameBoardModule();
    const players = playersModule();
    
    let gameLock = false;
    const lockStatus = () => gameLock;

    const gui = guiModule(players, lockStatus);

    const playTurn = (x, y) => {
        if(gameLock === false){
            board.markBoard(x, y, players.getCurrentPlayer());
            if(board.winCheck(x, y, players.getCurrentPlayer())){
                console.log("Yes");
                gameLock = true;
                console.log(gameLock);
            }else{
                players.switchPlayers();
                console.log(board.printBoard());
            }
        }
    }

    const newGame = (size) => {
        board.initBoard(size);
        players.getStartPlayer();
        console.log(board.printBoard());
        gameLock = false;
    }
  

    board.initBoard(size);
    gui.generateBoard(size, playTurn);

    return {playTurn, newGame};
}

const test = gameController(3);
//console.log(test);