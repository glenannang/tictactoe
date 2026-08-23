import { gameState } from "../state/gameState.js";
import { getBoard, move } from "../services/gameService.js";
import { checkWinner, getCurrentTurn } from "./gameRules.js";
import { showGameMessage } from "../utils/gameUtils.js";


export function createBoard() {
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


export function addBoardEventListeners() {
    const cells = document.querySelectorAll(".cell");

    cells.forEach(function (cell) {

        cell.addEventListener("click", async function () {

            // Block clicks if game is over
            // or another move is still being processed
            if (
                gameState.gameOver ||
                gameState.moveInProgress
            ) {
                return;
            }

            gameState.moveInProgress = true;

            try {
                let boardData =
                    await getBoard(gameState.gameKey);


                // Check if game already has a winner
                const existingWinner =
                    checkWinner(boardData);

                if (existingWinner !== null) {
                    gameState.gameOver = true;
                    return;
                }


                // Check if it is this player's turn
                const currentTurn =
                    getCurrentTurn(boardData);

                if (
                    gameState.playerTile !==
                    currentTurn
                ) {
                    console.log("Not your turn");
                    return;
                }


                // Get clicked cell coordinates
                const x = cell.dataset.x;
                const y = cell.dataset.y;


                // Check if cell is already occupied
                const board = boardData.split(":");

                const index =
                    Number(y) * 3 + Number(x);

                if (board[index] !== "") {
                    console.log(
                        "Cell is already occupied"
                    );

                    return;
                }


                // Send move to server
                await move(
                    gameState.gameKey,
                    gameState.playerTile,
                    y,
                    x
                );


                // Get actual board from server
                boardData =
                    await getBoard(gameState.gameKey);


                // Make UI match server
                displayBoard(boardData);

            } finally {

                gameState.moveInProgress = false;
            }
        });
    });
}


export function displayBoard(data) {
    const board = data.split(":");
    const cells =
        document.querySelectorAll(".cell");

    cells.forEach(function (cell, index) {
        cell.textContent = board[index];
    });


    const currentTurn =
        getCurrentTurn(data);

    if (
        currentTurn ===
        gameState.playerTile
    ) {
        showGameMessage("Your Turn");
    } else {
        showGameMessage("Opponent's Turn");
    }
}


export function clearBoard() {
    const cells =
        document.querySelectorAll(".cell");

    cells.forEach(function (cell) {
        cell.textContent = "";
    });
}