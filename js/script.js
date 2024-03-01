function gameBoardModule () {
    const theBoard = [];

    //Generate board rows and cells. Each cell starts as false.
    //Can scale from 3x3 to any number.
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

    //Mark spot if it's empty. Otherwise do nothing.
    const markBoard = (x, y, player) => {
        theBoard[y][x] === false && (theBoard[y][x] = player);
    };
    
    const printBoard = () => theBoard;

    return {initBoard, printBoard, markBoard, winCheck};
}

function playersModule () {
    const player1 = "X";
    const player2 = "O";
    
    //On initialization randomizes the starting player.
    let currentPlayer;
    const randomNumber = Math.floor(Math.random() * 2);

    const getStartPlayer = () => {
        randomNumber > 0 ? currentPlayer = player1 : currentPlayer = player2;
    }

    const switchPlayers = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    }

    const getCurrentPlayer = () => currentPlayer;

    //Randomizes starting player on launch.
    getStartPlayer();

    return {getStartPlayer, switchPlayers, getCurrentPlayer};
}

function guiModule (playerData, lockData) {
    const gameHolder = document.getElementById("gameHolder");
    //Player data (specifically for current player)
    //and game data (specifically if game is locked)
    //passed to GUI.
    const players = playerData;
    const lockCheck = lockData;
    
    const markBoard = (square) => {
        square.classList.add(`player-${players.getCurrentPlayer()}`);
    }

    //Generates board via size. Also passed is turn handling/execution
    //from the main game handler.
    const generateBoard = (size, func) => {
        for(let y = 0; y < size; y++){
            for(let x = 0; x < size; x++){
                let newSquare = document.createElement('div');
                //Sets X/Y data to each square so on click that data can be used to mark/score.
                newSquare.setAttribute("x-value", x);
                newSquare.setAttribute("y-value", y);
                newSquare.style.height = `${100 / size}%`;
                newSquare.style.width = `${100 / size}%`;
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
    
    //Game is initially unlocked and a function to properly return it from the main state.
    let gameLock = false;
    const lockStatus = () => gameLock;

    //GUI initialized and player and lock data passed to it.
    const gui = guiModule(players, lockStatus);

    //Turn function. Places pieces and checks victory conditions. Switches player after placement.
    const playTurn = (x, y) => {
        if(gameLock === false){
            board.markBoard(x, y, players.getCurrentPlayer());
            if(board.winCheck(x, y, players.getCurrentPlayer())){
                console.log("Win");
                gameLock = true;
            }else{
                players.switchPlayers();
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
