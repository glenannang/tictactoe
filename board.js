let gameOver = false;
let boardSyncInterval;
function board() {

syncBoard(gameKey); //gameKey is a global variable for now 


//Construction of the board
const board = document.createElement("div");
board.id = "board";
board.className = "board";

for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
        const cell = document.createElement("button");
        cell.className = "cell";
        cell.dataset.x = x;
        cell.dataset.y = y;
        board.appendChild(cell);
    }
}

document.body.appendChild(board);

//construction of the exit button 
const exitButton = document.createElement("button");
exitButton.id = "exitButton";
exitButton.textContent = "Exit Game";

exitButton.addEventListener("click", async function () {
    await resetGame(gameKey); 

});

document.body.appendChild(exitButton);



//Event Listener for each cell
const cells = document.querySelectorAll(".cell");

cells.forEach(function (cell) {

    cell.addEventListener("click", async function () {
        let boardData = await getBoard(gameKey);
        
        //check if there is already an existing winner
        const existingWinner = checkWinner(boardData);

        if (existingWinner !== null) {
            console.log(`${existingWinner} already won!`);
            gameOver = true;
            return;
        }
        
        // for blocking the move if not the players turn
        const currentTurn = getCurrentTurn(boardData);

        if (playerTile !== currentTurn) {
            console.log("Not your turn");
            return;
        }

        const x = cell.dataset.x;
        const y = cell.dataset.y;

        console.log("Tile:", playerTile);
        console.log("Clicked:", x, y);

        await move(gameKey, playerTile, y, x); 

        boardData = await getBoard(gameKey);
        cell.textContent = playerTile;

       // console.log("Board before winner check:", boardData);
        // const winner = checkWinner(boardData); //check if move created a winner
        
        // if (winner !== null) {
        //     console.log(`${winner} won!`);
        //     gameOver = true;
        //     //clearBoard();
        //     return;
        // }
       
    });

});

}


function syncBoard(key) {  // responsible for syncing the board 
        boardSyncInterval = setInterval(async function () {
        
        // check game room status 
        const gameRoomStatus = await checkGame(key);

        if (gameRoomStatus === "false") {
            clearInterval(boardSyncInterval);
            console.log("Game room no longer exists.");
            return;
        }

        // to sync the board 
        const data = await (getBoard(key));
        displayBoard(data);

        //checking for a winner 
        const winner = checkWinner(data);

        if (winner !== null) {
            gameOver = true;
            console.log(`${winner} won!`);
            clearInterval(boardSyncInterval);
            showWinnerPopup(winner);
        }
        
    }, 1000);
}


function displayBoard(data) {
    const board = data.split(":");
    const cells = document.querySelectorAll(".cell");

    cells.forEach(function (cell, index) {
        cell.textContent = board[index];
    });
}


function clearBoard() {
    const cells = document.querySelectorAll(".cell");

    cells.forEach(function (cell) {
        cell.textContent = "";
    });

}





