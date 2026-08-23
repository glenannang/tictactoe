let gameOver = false;
let boardSyncInterval;
let finishedBoard = null;
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





