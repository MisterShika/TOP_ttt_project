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
        //return theBoard[x].every(element => element === checkElement);
        if (theBoard[x].every(element => element === player)){
            console.log("win");
        }
        for(let vert = 0; vert <= boardSize; vert++){
            console.log(`X:${x}, Y:${vert}, Value: ${theBoard[vert][x]}, Expected: ${player}`);
            if(theBoard[vert][x] != player){
                console.log("Non match detected. Breaking.");
                break;
            }else if(vert === boardSize){
                console.log("win")
            }
        }
        //Vertical win check
        // for(let x = 0; x < boardSize; x++){
            
        // }
    }

    const markBoard = (x, y, player) => {
        theBoard[y][x] === false && (theBoard[y][x] = player);
        winCheck(x, y, player);
    };
    
    const printBoard = () => theBoard;

    return {initBoard, printBoard, markBoard};
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

    board.initBoard(size);
    players.getStartPlayer();

    const newGame = (size) => {
        board.initBoard(size);
        players.getStartPlayer();
        console.log(board.printBoard());
    }
        
    const playTurn = (x, y) => {
        board.markBoard(x, y, players.getCurrentPlayer());
        players.switchPlayers();
        console.log(board.printBoard());
    }
  
    return {playTurn, newGame};
}

const test = gameController(3);
console.log(test);