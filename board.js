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
            //dont allow moves if game is over
            if (gameOver) {
                return;
            }
            let boardData = await getBoard(gameKey);

            // Check if game already has a winner
            const existingWinner = checkWinner(boardData);

            if (existingWinner !== null) {
                console.log(`${existingWinner} already won!`);
                gameOver = true;
                return;
            }

            // Check whose turn it is
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
        });

    });
}

function syncBoard(key) {
    boardSyncInterval = setInterval(async function () {

        const gameRoomStatus = await checkGame(key);

        if (gameRoomStatus === "false") {
            clearInterval(boardSyncInterval);
            console.log("Game room no longer exists.");
            return;
        }

        const data = await getBoard(key);
        displayBoard(data);

        const winner = checkWinner(data);

        if (winner !== null && !gameOver) {
            gameOver = true;

            //clearInterval(boardSyncInterval);

            showGameMessage(`${winner} wins!`);
            console.log(`${winner} won!`);

            showGameOverModal(`${winner} wins!`);

            return;
        }

        if (checkDraw(data) && !gameOver) {
            gameOver = true;

            //clearInterval(boardSyncInterval);

            showGameMessage("It's a draw!");
            console.log("Game ended in a draw.");

            showGameOverModal("It's a draw!");

            return;
        }

    }, 1000);
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





