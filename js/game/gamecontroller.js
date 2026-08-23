
import { gameState } from "../state/gameState.js";
import { checkGame, getBoard, createOrJoinGame, resetGame} from "../services/gameService.js";
import { checkWinner, checkDraw,getCurrentTurn} from "./gameRules.js";
import { addBoardEventListeners, displayBoard} from "./board.js";
import { showGameMessage } from "../utils/gameUtils.js";
import { GamePage } from "../pages/GamePage.js";

function game() {
    const gamePage = new GamePage();

    //exit button in gamepage
    gamePage.exitButton.onClick(async function () {
        await resetGame(gameState.gameKey);

        clearTimeout(gameState.boardSyncInterval);
        gameState.boardSyncInterval = null;

        gameState.gameKey = null;
        gameState.playerTile = null;
        gameState.gameOver = false;

        mainPage.render("app");
    });

    gamePage.render("app");

    addBoardEventListeners();
    gameMonitor(gameState.gameKey);

}

function gameMonitor(key) {
    async function sync() {
        // Check if the game room still exists
        const gameRoomStatus = await checkGame(key);

        if (gameRoomStatus === "false") {
            clearTimeout(gameState.boardSyncInterval);
            gameState.boardSyncInterval = null;

            console.log("Opponent exited.");
            showOpponentLeftModal();
            return;
        }

        // Sync the board
        const data = await getBoard(key);

        if (data === "[GAME NOT YET STARTED]") {
            gameState.boardSyncInterval = setTimeout(sync, 1000);
            return;
        }

        console.log("Board received:", data);
        console.log("Current turn:", getCurrentTurn(data));
        console.log("My tile:", gameState.playerTile);

        displayBoard(data);

        // Check for winner
        const winner = checkWinner(data);

        console.log("winner:", winner);
        console.log("gameOver:", gameState.gameOver);

        if (winner !== null && !gameState.gameOver) {
            gameState.gameOver = true;
            gameState.finishedBoard = data;
            clearTimeout(gameState.boardSyncInterval);
            gameState.boardSyncInterval = null;

            showGameMessage(`${winner} wins!`);
            console.log(`${winner} won!`);

            showGameOverModal(`${winner} wins!`,handlePlayAgain);

            return;
        }

        // Check for draw
        if (checkDraw(data) && !gameState.gameOver) {
            gameState.gameOver = true;
            gameState.finishedBoard = data;

            clearTimeout(gameState.boardSyncInterval);
            gameState.boardSyncInterval = null;

            console.log("Game ended in a draw.");

            showGameOverModal("It's a draw!",handlePlayAgain);

            return;
        }

        // Schedule the NEXT sync only after this one is finished
        gameState.boardSyncInterval = setTimeout(sync, 1000);
    }

    // Start the first sync
    sync();
}

export async function handlePlayAgain() {
    // Prevent double click / duplicate rematch requests
    if (gameState.rematchInProgress) {
        return;
    }

    gameState.rematchInProgress = true;

    try {
        const response = await createOrJoinGame(gameState.gameKey);

        console.log("Play Again response:", response);


      
        //CASE 1:
        if (response === "[GAME ALREADY STARTED]") {
            const currentBoard = await getBoard(gameState.gameKey);

            if (currentBoard === gameState.finishedBoard) { // Same old finished game
                await resetGame(gameState.gameKey);

                gameState.playerTile = await createOrJoinGame(gameState.gameKey);
                gameState.gameOver = false;
                showWaitingForOpponentModal();
                waitForGameToStart(gameState.gameKey);
                return;
            }

            // Board changed 
            showGameAlreadyStartedModal();
            return;
        }


        // CASE 2: the game was reset already by the other player
        if (response === "O") { 
            console.log("Joined rematch as Player O.");
            gameState.playerTile = "O";
            gameState.gameOver = false;
            game();
            return;
        }


        // CASE 3: No existing game was found.
        //  The other player either pressed exit on the game over modal or the waiting for another player modal
        if (response === "X") {

            console.log("Created new room as Player X.");

            gameState.playerTile = "X";
            gameState.gameOver = false;
            gameState.finishedBoard = null;
            showOpponentLeftRematchModal();
            waitForGameToStart(gameState.gameKey);

            return;
        }


        console.log("Unexpected Play Again response:", response);

    } catch (error) {
        console.error("Play Again failed:", error);

    } finally {
        gameState.rematchInProgress = false;
    }
}

export function waitForGameToStart(key) {
    async function check() {
        const status = await checkGame(key);

        if (status === "true") {
            gameState.waitingInterval = null;
            game();
            return;
        }
        gameState.waitingInterval = setTimeout(check, 1000);
    }
    check();
}
