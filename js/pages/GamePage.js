import { Button } from "../components/Button.js";
import { gameState } from "../state/gameState.js";
import { resetGame } from "../services/gameService.js";

export class GamePage {

    constructor(onExit,onCellClick) {
        this.onExit = onExit;
        this.onCellClick = onCellClick;

        this.initializeElements();
        this.setAttributes();
        this.appendElements();
        this.addEventListeners();
    }


    initializeElements() {
        this.container = document.createElement("main");

        this.greeting = document.createElement("h1");
        this.playerMessage = document.createElement("p");
        this.gameKeyText = document.createElement("p");
        this.turnMessage = document.createElement("p");

        this.board = this.createBoard();

        this.exitButton = new Button(
            "exit-game",
            "Exit"
        );
    }

    createBoard() {
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


    setAttributes() {
        this.container.id = "gamePage";

        this.greeting.textContent = "Hello, Explorer!";

        this.playerMessage.id = "playerMessage";
        this.playerMessage.textContent =
            `You are playing as ${gameState.playerTile}`;

        this.gameKeyText.id = "gameKeyDisplay";
        this.gameKeyText.textContent =
            `Game Code: ${gameState.gameKey}`;

        this.turnMessage.id = "gameMessage";
    }


    appendElements() {
        this.container.append(
            this.greeting,
            this.playerMessage,
            this.gameKeyText,
            this.board,
            this.turnMessage,
            this.exitButton.getElement()
        );
    }


    addEventListeners() { 
        // exit button
        this.exitButton.onClick(async () => {
            await resetGame(gameState.gameKey);

            clearTimeout(gameState.boardSyncInterval);
            gameState.boardSyncInterval = null;

            gameState.gameKey = null;
            gameState.playerTile = null;
            gameState.gameOver = false;
            gameState.finishedBoard = null;

            if (this.onExit) {
                this.onExit();
            }
        });

        //cells 
        const cells = this.board.querySelectorAll(".cell");

        cells.forEach((cell) => {
            cell.addEventListener("click", () => {
                this.onCellClick(cell);
            });
        });
    }


    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.replaceChildren(this.container);
        }
    }
}