import { Button } from "../components/button.js";
import { Modal } from "../components/Modal.js";
import { gameState } from "../state/gameState.js";
import { getBoard, resetGame } from "../services/gameService.js";
import { showMainPage } from "../navigation.js";


export function showGameOverModal(message, onPlayAgain) {
    const modal = new Modal("Game Over", message);

    const playAgainButton = new Button(
        "play-again",
        "Play Again"
    );

    const exitButton = new Button(
        "modal-exit",
        "Exit"
    );

    modal.addButton(playAgainButton);
    modal.addButton(exitButton);

    playAgainButton.onClick(async () => {
        modal.close();
        await onPlayAgain();
    });

    exitButton.onClick(async () => {
        const currentBoard = await getBoard(gameState.gameKey);

        if (currentBoard === gameState.finishedBoard) {
            // Finished match is still on the server
            await resetGame(gameState.gameKey);
        }

        gameState.gameKey = null;
        gameState.playerTile = null;
        gameState.gameOver = false;
        gameState.finishedBoard = null;

        showMainPage();
    });

    modal.render("gamePage");
}


export function showOpponentLeftModal() {
    const modal = new Modal(
        "Opponent Left",
        "Your opponent left the game."
    );

    const exitButton = new Button(
        "opponent-left-exit",
        "Exit"
    );

    modal.addButton(exitButton);

    exitButton.onClick(() => {
        gameState.gameKey = null;
        gameState.playerTile = null;
        gameState.gameOver = false;

        showMainPage();
    });

    modal.render("gamePage");
}


export function showOpponentLeftRematchModal() {
    const modal = new Modal(
        "Opponent Left",
        "Your opponent left. Waiting for a new player..."
    );

    const exitButton = new Button(
        "opponent-left-exit",
        "Exit"
    );

    modal.addButton(exitButton);

    exitButton.onClick(() => {
        gameState.gameKey = null;
        gameState.playerTile = null;
        gameState.gameOver = false;

        showMainPage();
    });

    modal.render("gamePage");
}


export function showWaitingForOpponentModal() {
    const modal = new Modal(
        "Waiting for Opponent",
        "Waiting for another player to join..."
    );

    const exitButton = new Button(
        "waiting-exit",
        "Exit"
    );

    modal.addButton(exitButton);

    exitButton.onClick(async () => {
        clearTimeout(gameState.waitingInterval);
        gameState.waitingInterval = null;

        await resetGame(gameState.gameKey);

        gameState.gameKey = null;
        gameState.playerTile = null;
        gameState.gameOver = false;

        showMainPage();
    });

    modal.render("gamePage");

    return modal;
}


export function showGameAlreadyStartedModal() {
    const modal = new Modal(
        "Oops... Too Late!",
        "Another explorer has already entered the chamber and begun the challenge."
    );

    const exitButton = new Button(
        "game-started-exit",
        "Exit"
    );

    modal.addButton(exitButton);

    exitButton.onClick(() => {
        gameState.gameKey = null;
        gameState.playerTile = null;
        gameState.gameOver = false;

        showMainPage();
    });

    modal.render("gamePage");
}