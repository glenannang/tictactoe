let gameOver = false;
let boardSyncInterval;

function createBoard() {
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

    return board;
}

function addBoardEventListeners() {
    const cells = document.querySelectorAll(".cell");

    cells.forEach(function (cell) {

        cell.addEventListener("click", async function () {

            // Block clicks if game is over
            // or another move is still being processed
            if (gameOver || moveInProgress) {
                return;
            }

            moveInProgress = true;

            try {
                let boardData = await getBoard(gameKey);

                // Check if game already has a winner
                const existingWinner = checkWinner(boardData);

                if (existingWinner !== null) {
                    gameOver = true;
                    return;
                }

                // Check if it is this player's turn
                const currentTurn = getCurrentTurn(boardData);

                if (playerTile !== currentTurn) {
                    console.log("Not your turn");
                    return;
                }

                // Get clicked cell coordinates
                const x = cell.dataset.x;
                const y = cell.dataset.y;

                // Check if the cell is already occupied
                const board = boardData.split(":");
                const index = Number(y) * 3 + Number(x);

                if (board[index] !== "") {
                    console.log("Cell is already occupied");
                    return;
                }

                // Show the move immediately
                // so the UI doesn't feel slow
                //cell.textContent = playerTile;

                // Send move to server
                await move(gameKey, playerTile, y, x);

                // Get the actual board from the server
                boardData = await getBoard(gameKey);

                // Make sure UI matches the server
                displayBoard(boardData);

            } finally {
                // Unlock after request finishes,
                // even if something goes wrong
                moveInProgress = false;
            }
        });
    });
}





function syncBoard(key) {

    async function sync() {

        // Check if the game room still exists
        const gameRoomStatus = await checkGame(key);

        if (gameRoomStatus === "false") {
            clearTimeout(boardSyncInterval);
            boardSyncInterval = null;

            console.log("Game room no longer exists.");
            return;
        }

        // Sync the board
        const data = await getBoard(key);

        if (data === "[GAME NOT YET STARTED]") {
            boardSyncInterval = setTimeout(sync, 1000);
            return;
        }

        console.log("Board received:", data);
        console.log("Current turn:", getCurrentTurn(data));
        console.log("My tile:", playerTile);

        displayBoard(data);

        // Check for winner
        const winner = checkWinner(data);

        console.log("winner:", winner);
        console.log("gameOver:", gameOver);

        if (winner !== null && !gameOver) {
            gameOver = true;

            clearTimeout(boardSyncInterval);
            boardSyncInterval = null;

            showGameMessage(`${winner} wins!`);
            console.log(`${winner} won!`);

            showGameOverModal(`${winner} wins!`);

            return;
        }

        // Check for draw
        if (checkDraw(data) && !gameOver) {
            gameOver = true;

            clearTimeout(boardSyncInterval);
            boardSyncInterval = null;

            showGameMessage("It's a draw!");
            console.log("Game ended in a draw.");

            showGameOverModal("It's a draw!");

            return;
        }

        // Schedule the NEXT sync only after this one is finished
        boardSyncInterval = setTimeout(sync, 1000);
    }

    // Start the first sync
    sync();
}

function displayBoard(data) {
    const board = data.split(":");
    const cells = document.querySelectorAll(".cell");

    cells.forEach(function (cell, index) {
        cell.textContent = board[index];
    });

    const currentTurn = getCurrentTurn(data);

    if (currentTurn === playerTile) {
        showGameMessage("Your Turn");
    } else {
        showGameMessage("Opponent's Turn");
    }
}

function clearBoard() {
    const cells = document.querySelectorAll(".cell");

    cells.forEach(function (cell) {
        cell.textContent = "";
    });

}





