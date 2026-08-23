import { gameState } from "../state/gameState.js";

import {
    checkGame,
    getBoard,
    createOrJoinGame,
    resetGame
} from "../services/gameService.js";

import {
    checkWinner,
    checkDraw,
    getCurrentTurn
} from "./gameRules.js";

import {
    addBoardEventListeners,
    displayBoard
} from "./board.js";

import { showGameMessage } from "../utils/gameUtils.js";
import { GamePage } from "../pages/GamePage.js";

import {
    showGameOverModal,
    showOpponentLeftModal,
    showOpponentLeftRematchModal,
    showWaitingForOpponentModal,
    showGameAlreadyStartedModal
} from "../ui/gameModals.js";


function game(onExit) {
    const gamePage = new GamePage(onExit);

    gamePage.render("app");

    addBoardEventListeners();

    gameMonitor(
        gameState.gameKey,
        onExit
    );
}


function gameMonitor(key, onExit) {

    async function sync() {

        // Check if the game room still exists
        const gameRoomStatus = await checkGame(key);

        if (gameRoomStatus === "false") {
            clearTimeout(gameState.boardSyncInterval);
            gameState.boardSyncInterval = null;

            console.log("Opponent exited.");

            showOpponentLeftModal(onExit);

            return;
        }


        // Sync the board
        const data = await getBoard(key);

        if (data === "[GAME NOT YET STARTED]") {
            gameState.boardSyncInterval =
                setTimeout(sync, 1000);

            return;
        }


        console.log("Board received:", data);
        console.log(
            "Current turn:",
            getCurrentTurn(data)
        );
        console.log(
            "My tile:",
            gameState.playerTile
        );

        displayBoard(data);


        // Check for winner
        const winner = checkWinner(data);

        console.log("winner:", winner);
        console.log(
            "gameOver:",
            gameState.gameOver
        );


        if (
            winner !== null &&
            !gameState.gameOver
        ) {
            gameState.gameOver = true;
            gameState.finishedBoard = data;

            clearTimeout(
                gameState.boardSyncInterval
            );

            gameState.boardSyncInterval = null;

            showGameMessage(
                `${winner} wins!`
            );

            console.log(`${winner} won!`);

            showGameOverModal(
                `${winner} wins!`,
                () => handlePlayAgain(onExit),
                onExit
            );

            return;
        }


        // Check for draw
        if (
            checkDraw(data) &&
            !gameState.gameOver
        ) {
            gameState.gameOver = true;
            gameState.finishedBoard = data;

            clearTimeout(
                gameState.boardSyncInterval
            );

            gameState.boardSyncInterval = null;

            console.log(
                "Game ended in a draw."
            );

            showGameOverModal(
                "It's a draw!",
                () => handlePlayAgain(onExit),
                onExit
            );

            return;
        }


        // Schedule the next sync only
        // after this one is finished
        gameState.boardSyncInterval =
            setTimeout(sync, 1000);
    }


    // Start first sync
    sync();
}


export async function handlePlayAgain(onExit) {

    // Prevent duplicate rematch requests
    if (gameState.rematchInProgress) {
        return;
    }

    gameState.rematchInProgress = true;


    try {
        const response =
            await createOrJoinGame(
                gameState.gameKey
            );

        console.log(
            "Play Again response:",
            response
        );


        // CASE 1:
        // The old finished game still exists
        if (
            response ===
            "[GAME ALREADY STARTED]"
        ) {
            const currentBoard =
                await getBoard(
                    gameState.gameKey
                );


            // Same old finished game
            if (
                currentBoard ===
                gameState.finishedBoard
            ) {
                await resetGame(
                    gameState.gameKey
                );

                gameState.playerTile =
                    await createOrJoinGame(
                        gameState.gameKey
                    );

                gameState.gameOver = false;

                showWaitingForOpponentModal(
                    onExit
                );

                waitForGameToStart(
                    gameState.gameKey,
                    onExit
                );

                return;
            }


            // Board changed
            showGameAlreadyStartedModal(
                onExit
            );

            return;
        }


        // CASE 2:
        // Other player already reset the game
        if (response === "O") {

            console.log(
                "Joined rematch as Player O."
            );

            gameState.playerTile = "O";
            gameState.gameOver = false;

            game(onExit);

            return;
        }


        // CASE 3:
        // No existing game was found.
        // Create a new room and wait.
        if (response === "X") {

            console.log(
                "Created new room as Player X."
            );

            gameState.playerTile = "X";
            gameState.gameOver = false;
            gameState.finishedBoard = null;

            showOpponentLeftRematchModal(
                onExit
            );

            waitForGameToStart(
                gameState.gameKey,
                onExit
            );

            return;
        }


        console.log(
            "Unexpected Play Again response:",
            response
        );


    } catch (error) {

        console.error(
            "Play Again failed:",
            error
        );

    } finally {

        gameState.rematchInProgress = false;
    }
}


export function waitForGameToStart(
    key,
    onExit
) {

    async function check() {

        const status =
            await checkGame(key);


        if (status === "true") {

            gameState.waitingInterval = null;

            game(onExit);

            return;
        }


        gameState.waitingInterval =
            setTimeout(check, 1000);
    }


    check();
}