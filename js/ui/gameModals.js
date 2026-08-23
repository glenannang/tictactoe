import { Button } from "../components/Button.js";
import { Modal } from "../components/Modal.js";
import { gameState } from "../state/gameState.js";
import { getBoard, resetGame } from "../services/gameService.js";


export function showGameOverModal(message, onPlayAgain, onExit) {
    const modal = new Modal(
        "Game Over",
        message
    );

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
            await resetGame(gameState.gameKey);
        }

        gameState.gameKey = null;
        gameState.playerTile = null;
        gameState.gameOver = false;
        gameState.finishedBoard = null;

        onExit();
    });


    modal.render("gamePage");
}


export function showOpponentLeftModal(onExit) {
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

        onExit();
    });


    modal.render("gamePage");
}


export function showOpponentLeftRematchModal(onExit) {
    const modal = new Modal(
        "Opponent Left",
        "Your opponent left. Waiting for a new player..."
    );

    const exitButton = new Button(
        "opponent-left-exit",
        "Exit"
    );

    modal.addButton(exitButton);


    exitButton.onClick(async () => {
        // Stop waiting for another player
        clearTimeout(gameState.waitingInterval);
        gameState.waitingInterval = null;

        // remove the newly-created room
        await resetGame(gameState.gameKey);

        gameState.gameKey = null;
        gameState.playerTile = null;
        gameState.gameOver = false;
        gameState.finishedBoard = null;

        onExit();
    });


    modal.render("gamePage");
}


export function showWaitingForOpponentModal(onExit) {
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

        onExit();
    });


    modal.render("gamePage");

    return modal;
}


export function showGameAlreadyStartedModal(onExit) {
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

        onExit();
    });


    modal.render("gamePage");
}