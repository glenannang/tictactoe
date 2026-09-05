import { Button } from "../components/Button.js";

export class ReplayPage {

    constructor(gameId, moves, playerId, onBack) {
        this.gameId = gameId;
        this.moves = Array.isArray(moves) ? moves : [];
        this.playerId = playerId;
        this.onBack = onBack;
        this.replayTimeout = null;
        this.currentMoveIndex = 0;

        this.initializeElements();
        this.setAttributes();
        this.appendElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.container = document.createElement("main");
        this.greeting = document.createElement("h1");
        this.playerMessage = document.createElement("p");
        this.playerIdDisplay = document.createElement("p");
        this.gameIdDisplay = document.createElement("p");
        this.board = this.createBoard();
        this.progress = document.createElement("p");
        this.replayButton = new Button(
            "replay-game",
            "Replay",
            "replay-action-button"
        );
        this.backButton = new Button(
            "back-to-player-history",
            "Back to Player History",
            "replay-back-button"
        );
    }

    createBoard() {
        const board = document.createElement("div");

        board.id = "replayBoard";
        board.className = "replay-board";
        board.setAttribute("aria-label", "Read-only game replay board");

        for (let index = 0; index < 9; index++) {
            const cell = document.createElement("button");

            cell.className = "replay-cell";
            cell.type = "button";
            cell.disabled = true;
            cell.dataset.index = index;
            cell.setAttribute("aria-label", `Board cell ${index + 1}`);
            board.append(cell);
        }

        return board;
    }

    setAttributes() {
        this.container.id = "replayPage";
        this.greeting.textContent = "GAME REPLAY";

        this.playerMessage.id = "replayPlayerMessage";
        this.playerMessage.textContent = `You played as ${this.getPlayerSymbol()}`;

        this.playerIdDisplay.id = "replayPlayerIdDisplay";
        this.playerIdDisplay.textContent = `Player ID: ${this.playerId || "-"}`;

        this.gameIdDisplay.id = "replayGameIdDisplay";
        this.gameIdDisplay.textContent = `Game ID: ${this.gameId || "-"}`;

        this.progress.id = "replayProgress";
        this.progress.textContent = `Move 0 of ${this.moves.length}`;
    }

    appendElements() {
        this.container.append(
            this.greeting,
            this.playerMessage,
            this.playerIdDisplay,
            this.gameIdDisplay,
            this.board,
            this.progress,
            this.replayButton.getElement(),
            this.backButton.getElement()
        );
    }

    addEventListeners() {
        this.replayButton.onClick(() => {
            this.restartReplay();
        });

        this.backButton.onClick(() => {
            this.stopReplay();

            if (this.onBack) {
                this.onBack();
            }
        });
    }

    getPlayerSymbol() {
        const playerMove = this.moves.find(move => move.playerid === this.playerId);
        return playerMove?.symbol || "-";
    }

    clearBoard() {
        this.board.querySelectorAll(".replay-cell").forEach(cell => {
            cell.textContent = "";
        });
    }

    stopReplay() {
        if (this.replayTimeout !== null) {
            clearTimeout(this.replayTimeout);
            this.replayTimeout = null;
        }
    }

    showMove(moveIndex) {
        const move = this.moves[moveIndex];
        const location = Number(move.location);
        const cell = this.board.querySelector(`[data-index="${location}"]`);

        if (cell) {
            cell.textContent = move.symbol || "";
        }

        this.currentMoveIndex = moveIndex + 1;
        this.progress.textContent = `Move ${this.currentMoveIndex} of ${this.moves.length}`;
    }

    scheduleNextMove() {
        if (this.currentMoveIndex >= this.moves.length) {
            return;
        }

        this.replayTimeout = setTimeout(() => {
            this.replayTimeout = null;
            this.showMove(this.currentMoveIndex);
            this.scheduleNextMove();
        }, 2000);
    }

    startReplay() {
        this.stopReplay();
        this.clearBoard();
        this.currentMoveIndex = 0;
        this.progress.textContent = `Move 0 of ${this.moves.length}`;

        if (this.moves.length === 0) {
            return;
        }

        this.replayTimeout = setTimeout(() => {
            this.replayTimeout = null;
            this.showMove(0);
            this.scheduleNextMove();
        }, 1000);
    }

    restartReplay() {
        this.startReplay();
    }

    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.replaceChildren(this.container);
            this.startReplay();
        }
    }
}
