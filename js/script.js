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

        //Draw check
        let allCellsFilled = true;
        for (let i = 0; i <= boardSize; i++) {
            for (let j = 0; j <= boardSize; j++) {
                if (theBoard[i][j] === false) {
                    allCellsFilled = false;
                    break;
                }
            }
            if (!allCellsFilled) {
                break;
            }
        }
        if (allCellsFilled) {
            return 'draw';
        }
        
    }

    //Testing function
    const printBoard = () => theBoard;

    //Mark spot if it's empty. Otherwise do nothing.
    const markBoard = (x, y, player) => {
        theBoard[y][x] === false && (theBoard[y][x] = player);
    };
    
    

    return {initBoard, printBoard, markBoard, winCheck};
}

function playersModule () {
    const player1 = "X";
    const player2 = "O";
    
    //On initialization randomizes the starting player.
    let currentPlayer;

    const getStartPlayer = () => {
        let randomNumber = Math.floor(Math.random() * 2);
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
    //Establish HTML elements to display data.
    const gameHolder = document.getElementById("gameHolder");
    const promptHolder = document.getElementById("promptOverlay");
    const player1Holder = document.getElementById("player1Info");
    const player2Holder = document.getElementById("player2Info");
    const player1Box = document.getElementById("player1Area");
    const player2Box = document.getElementById("player2Area");
    const player1ScoreHolder = document.getElementById("player1ScoreInfo");
    const player2ScoreHolder = document.getElementById("player2ScoreInfo");
    //Player data (specifically for current player)
    //and game data (specifically if game is locked)
    //passed to GUI.
    let player1Name;
    let player2Name;
    let player1Score = 0;
    let player2Score = 0;
    const players = playerData;
    const lockCheck = lockData;
    
    const markBoard = (square) => {
        square.classList.add(`player-${players.getCurrentPlayer()}`);
    }

    const wipeBoard = () => {
        gameHolder.innerHTML = '';
    }

    const deletePrompt = () => {
        promptHolder.classList.remove('display');
    }

    const playerNameUpdate = (location, playerName) => {
        location.innerHTML = playerName;
    }

    //Updates current player in the GUI.
    const markCurrentPlayer = (player) => {
        if(player === "X"){
            player1Box.classList.add('current');
            player2Box.classList.remove('current');
        }else{
            player2Box.classList.add('current');
            player1Box.classList.remove('current');
        }
    }

    //Updates player score.
    const updatePlayerScore = (player) => {
        if(player === "X"){
            player1Score++;
            player1ScoreHolder.innerHTML = player1Score;
        }else{
            player2Score++;
            player2ScoreHolder.innerHTML = player2Score;
        }
    }

    //Gets player name to display in messages.
    const getPlayerName = (player) => {
        if(player === "X"){
            return player1Name;
        }
        return player2Name;
    }

    //Generates board via size. Also passed is turn handling/execution
    //from the main game handler.
    const generateBoard = (size, func) => {
        wipeBoard();
        for(let y = 0; y < size; y++){
            for(let x = 0; x < size; x++){
                let newSquare = document.createElement('div');
                //Sets X/Y data to each square so on click that data can be used to mark/score.
                newSquare.setAttribute("x-value", x);
                newSquare.setAttribute("y-value", y);
                newSquare.style.height = `${100 / size}%`;
                newSquare.style.width = `${100 / size}%`;
                newSquare.addEventListener("click", (event) => {
                    if(!lockCheck() && (event.target.classList.length === 0)){
                        markBoard(event.target);
                        func(event.target.getAttribute("x-value"), event.target.getAttribute("y-value"));
                    }
                });
                gameHolder.appendChild(newSquare);
            }
        }
    }

    //Initial prompt to generate game.
    const createPrompt = (func, turn) => {
        promptHolder.classList.add('display');
        let newPrompt = document.createElement('div');
        newPrompt.innerHTML = `
            <form action="#" method="post" id="createGameForm">
                <div class="formContent">
                    <h2>Would you like to play a game?</h2>
                    <div class="infoHolder">
                        <label for="player1Name">Player 1:</label>
                        <input type="text" name="player1Name" id="player1Name" required/>
                    </div>
                    <div class="infoHolder">
                        <label for="player2Name">Player 2:</label>
                        <input type="text" name="player2Name" id="player2Name" required/>
                    </div>
                    <div class="infoHolder">
                        <label for="gameSize">Board Size:</label>
                        <input type="number" name="gameSize" id="gameSize" required/>
                    </div>
                    <button id="submitButton">Create Game</button>
                </div>
            </form>
        `;
        const submitHandler = (event) => {
            //Initializes game, takes form data to display names and gives each generated
            //game the functions it needs to pass turns.
            event.preventDefault();
            player1ScoreHolder.innerHTML = player1Score;
            player2ScoreHolder.innerHTML = player2Score;
            let gameSize = document.getElementById('gameSize').value; 
            player1Name = document.getElementById('player1Name').value;
            player2Name = document.getElementById('player2Name').value;
            playerNameUpdate(player1Holder, player1Name);
            playerNameUpdate(player2Holder, player2Name);
            func(gameSize);
            generateBoard(gameSize, turn);
            deletePrompt();
            promptHolder.removeEventListener('submit', submitHandler);
        };
        //Upon completion, event listener deletes itself.
        promptHolder.addEventListener('submit', submitHandler);
        promptHolder.appendChild(newPrompt);
    }

    const createAgainPrompt = (func, turn, unlock, playerUpdate, draw) => {
        promptHolder.innerHTML = '';
        promptHolder.classList.add('display');
        let newPrompt = document.createElement('div');
        let message;
        if(draw === true){
            message = `<h2>Draw! Play again?</h2>`;
        }else{
            message = `<h2>Congratulations, ${getPlayerName(players.getCurrentPlayer())}, play again?</h2>`;
        }
        newPrompt.innerHTML = `
            <form action="#" method="post" id="newGameForm">
                <div class="formContent">
                    ${message}
                    <div class="infoHolder">
                        <label for="gameSize">Board Size:</label>
                        <input type="number" name="gameSize" id="gameSize" required/>
                    </div>
                    <button id="submitButton">Create Game</button>
                </div>
            </form>
        `;
        const submitEventListener = (event) => {
            //Initializes game, takes form data to display names and gives each generated
            //game the functions it needs to pass turns.
            event.preventDefault();
            let gameSize = document.getElementById('gameSize').value; 
            func(gameSize);
            unlock();
            generateBoard(gameSize, turn);
            markCurrentPlayer(playerUpdate());
            deletePrompt();

            // Remove the event listener after it has been used
            promptHolder.removeEventListener('submit', submitEventListener);
        };
        promptHolder.addEventListener('submit', submitEventListener);
        promptHolder.appendChild(newPrompt);
    }

    return {generateBoard, createPrompt, createAgainPrompt, wipeBoard, updatePlayerScore, markCurrentPlayer};
}

function gameController (size = 3) {
    const board = gameBoardModule();
    const players = playersModule();
    
    //Game is initially unlocked and a function to properly return it from the main state.
    let gameLock = false;
    const lockStatus = () => gameLock;
    const unlockGame = () => gameLock = false;

    //GUI initialized and player and lock data passed to it.
    const gui = guiModule(players, lockStatus);

    //Turn function. Places pieces and checks victory conditions. Switches player after placement.
    const playTurn = (x, y) => {
        if(gameLock === false){
            board.markBoard(x, y, players.getCurrentPlayer());
            if(board.winCheck(x, y, players.getCurrentPlayer()) == true){
                //If somebody wins, display "play again?" message, lock game, and randomize next person.
                console.log("Win");
                gui.createAgainPrompt(board.initBoard, playTurn, unlockGame, players.getCurrentPlayer);
                gui.updatePlayerScore(players.getCurrentPlayer());
                gameLock = true;
                players.getStartPlayer();
            }else if(board.winCheck(x, y, players.getCurrentPlayer()) === "draw"){
                //If draw, same thing, but don't update score.
                console.log("Draw checked");
                gui.createAgainPrompt(board.initBoard, playTurn, unlockGame, players.getCurrentPlayer, true);
                gameLock = true;
                players.getStartPlayer();
            }else{
                //Normal turn
                players.switchPlayers();
                gui.markCurrentPlayer(players.getCurrentPlayer());
            }
        }
    }

    const createGame = () => {
        gui.createPrompt(board.initBoard, playTurn);
        gui.markCurrentPlayer(players.getCurrentPlayer());
    }

    return {playTurn, createGame};
}

const theGame = gameController();
theGame.createGame();