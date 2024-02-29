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
        if (theBoard[x].every(element => element === player)){
            return true;
        }
        //Vertical win check
        for(let i = 0; i <= boardSize; i++){
            if(theBoard[i][x] != player){
                break;
            }else if(i === boardSize){
                console.log("win")
                return true;
            }
        }
        //Diagonal win check
        if(x === y){
            for(let i = 0; i <= boardSize; i++){
                if(theBoard[i][i] != player){
                    break;
                }else if(i === boardSize){
                    console.log("win")
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

    return {getStartPlayer, switchPlayers, getCurrentPlayer};
}

function gameController (size = 3) {
    const board = gameBoardModule();
    const players = playersModule();
    const gameHolder = document.getElementById("gameHolder");
    let gameLock = false;

    board.initBoard(size);
    players.getStartPlayer();
        
    const playTurn = (x, y) => {
        if(gameLock === false){
            board.markBoard(x, y, players.getCurrentPlayer());
            if(board.winCheck(x, y, players.getCurrentPlayer())){
                gameLock = true;
            }else{
                players.switchPlayers();
                
            }
            console.log(board.printBoard());
        }
    }

    const createGui = (size) => {
        for(let i = 0; i <= size; i++){
            for(let n = 0; i <= size; n++){
                let newSquare = document.createElement('div');
                newSquare.className = "boxes";
                //newSquare.id = `x${x}y${y}`;
                newSquare.addEventListener("onclick", (event) => {
                    board.playTurn();
                });
                gameHolder.appendChild(newSquare);
            }
        }
    }

    const newGame = (size) => {
        board.initBoard(size);
        players.getStartPlayer();
        console.log(board.printBoard());
        gameLock = false;
    }
  
    return {playTurn, newGame};
}

const test = gameController(3);
//console.log(test);