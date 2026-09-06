import { Button } from "../components/Button.js";
import { checkWinner, checkDraw } from "../game/gameRules.js";
import { showReplayCompleteModal } from "../ui/gameModals.js";
import { getGameDetails } from "../services/recordService.js";

export class ReplayPage {

    constructor(gameId, moves, playerId, onBack, options = {}) {
        this.gameId = gameId;
        this.moves = Array.isArray(moves) ? moves : [];
        this.playerId = playerId;
        this.onBack = onBack;
        this.options = options || {};
        this.matchHistoryMode = this.options.mode === "match-history";
        this.roomCode = this.options.roomCode || null;
        this.roomGameIds = Array.isArray(this.options.roomGameIds) ? this.options.roomGameIds : [];
        this.currentRoomGameIndex = Number.isInteger(this.options.currentRoomGameIndex)
            ? this.options.currentRoomGameIndex
            : this.roomGameIds.indexOf(this.gameId);
        this.lastProgressMessage = null;
        this.replayTimeout = null;
        this.transitionTimeout = null;
        this.currentMoveIndex = 0;
        this.boardData = Array(9).fill("");
        this.isReplaySequenceActive = this.matchHistoryMode;
        this.matchHistoryFinished = false;

        this.initializeElements();
        this.setAttributes();
        this.appendElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.container = document.createElement("main");
        this.greeting = document.createElement("h1");
        this.roomCodeDisplay = document.createElement("p");
        this.matchProgressDisplay = document.createElement("p");
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
            "Exit Replay",
            "replay-back-button"
        );
        this.actionGroup = document.createElement("div");
        this.actionGroup.className = "replay-action-group";
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
        this.greeting.textContent = this.matchHistoryMode ? "MATCH HISTORY REPLAY" : "GAME REPLAY";

        this.playerMessage.id = "replayPlayerMessage";
        this.playerMessage.textContent = `You played as ${this.getPlayerSymbol()}`;

        this.playerIdDisplay.id = "replayPlayerIdDisplay";
        this.playerIdDisplay.textContent = `Player ID: ${this.playerId || "-"}`;

        this.gameIdDisplay.id = "replayGameIdDisplay";
        this.gameIdDisplay.textContent = `Game ID: ${this.gameId || "-"}`;

        this.progress.id = "replayProgress";
        this.progress.textContent = `Move 0 of ${this.moves.length}`;

        if (this.matchHistoryMode) {
            this.roomCodeDisplay.id = "replayRoomCodeDisplay";
            this.roomCodeDisplay.textContent = `Room Code: ${this.roomCode || "-"}`;
            this.matchProgressDisplay.id = "replayMatchProgressDisplay";
            this.matchProgressDisplay.textContent = this.getMatchProgressText();
        }

        this.updateReplayButtonState();
    }

    appendElements() {
        const elements = [
            this.greeting,
            this.playerMessage,
            this.playerIdDisplay,
            this.gameIdDisplay
        ];

        if (this.matchHistoryMode) {
            elements.push(this.roomCodeDisplay, this.matchProgressDisplay);
        }

        this.actionGroup.append(this.replayButton.getElement(), this.backButton.getElement());
        elements.push(this.board, this.progress, this.actionGroup);
        this.container.append(...elements);
    }

    addEventListeners() {
        this.replayButton.onClick(() => {
            if (this.matchHistoryMode) {
                if (this.isReplaySequenceActive) {
                    return;
                }

                this.startMatchHistoryReplay();
                return;
            }

            this.restartReplay();
        });

        this.backButton.onClick(() => {
            this.stopReplay();
            this.stopTransition();

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
        this.boardData = Array(9).fill("");

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

    stopTransition() {
        if (this.transitionTimeout !== null) {
            clearTimeout(this.transitionTimeout);
            this.transitionTimeout = null;
        }
    }

    getMatchProgressText() {
        if (!this.matchHistoryMode || this.roomGameIds.length === 0) {
            return "Game 0 of 0";
        }

        return `Game ${this.currentRoomGameIndex + 1} of ${this.roomGameIds.length}`;
    }

    updateReplayButtonState() {
        if (!this.matchHistoryMode) {
            this.replayButton.textContent = "Replay";
            this.replayButton.disabled = false;
            return;
        }

        this.replayButton.textContent = "Replay Match History";
        this.replayButton.disabled = this.isReplaySequenceActive;
    }

    showMove(moveIndex) {
        const move = this.moves[moveIndex];
        const location = Number(move.location);
        const cell = this.board.querySelector(`[data-index="${location}"]`);

        if (cell) {
            cell.textContent = move.symbol || "";
            this.boardData[location] = move.symbol || "";
        }

        this.currentMoveIndex = moveIndex + 1;
        this.progress.textContent = `Move ${this.currentMoveIndex} of ${this.moves.length}`;
    }

    async loadMatchHistoryGame(index) {
        if (!this.matchHistoryMode || !this.roomGameIds.length) {
            return;
        }

        this.currentRoomGameIndex = index;
        const gameId = this.roomGameIds[index];

        if (!gameId) {
            this.finishMatchHistoryReplay();
            return;
        }

        try {
            const data = await getGameDetails(gameId);
            this.gameId = gameId;
            this.moves = Array.isArray(data.list) ? data.list : [];
            this.playerMessage.textContent = `You played as ${this.getPlayerSymbol()}`;
            this.gameIdDisplay.textContent = `Game ID: ${this.gameId || "-"}`;
            this.progress.textContent = `Move 0 of ${this.moves.length}`;
            this.matchProgressDisplay.textContent = this.getMatchProgressText();
            this.startReplay();
        } catch (error) {
            console.error("Failed to load match history game:", error);
            this.finishMatchHistoryReplay();
        }
    }

    async advanceMatchHistory() {
        if (!this.matchHistoryMode || !this.roomGameIds.length) {
            return;
        }

        const nextIndex = this.currentRoomGameIndex + 1;

        if (nextIndex >= this.roomGameIds.length) {
            this.finishMatchHistoryReplay();
            return;
        }

        this.isReplaySequenceActive = true;
        this.updateReplayButtonState();
        this.currentRoomGameIndex = nextIndex;
        this.matchProgressDisplay.textContent = this.getMatchProgressText();
        await this.loadMatchHistoryGame(nextIndex);
    }

    finishMatchHistoryReplay() {
        if (!this.matchHistoryMode) {
            return;
        }

        this.stopReplay();
        this.stopTransition();
        this.isReplaySequenceActive = false;
        this.matchHistoryFinished = true;
        this.updateReplayButtonState();
    }

    startMatchHistoryReplay() {
        if (!this.matchHistoryMode || !this.roomGameIds.length) {
            return;
        }

        this.stopReplay();
        this.stopTransition();
        this.matchHistoryFinished = false;
        this.currentRoomGameIndex = 0;
        this.isReplaySequenceActive = true;
        this.updateReplayButtonState();
        this.matchProgressDisplay.textContent = this.getMatchProgressText();
        this.loadMatchHistoryGame(0);
    }

    scheduleNextMove() {
        if (this.currentMoveIndex >= this.moves.length) {
            this.showReplayResult();
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

    showReplayResult() {
        const boardString = this.boardData.join(":");
        const winner = checkWinner(boardString);
        const playerSymbol = this.getPlayerSymbol();

        let result;

        if (winner === playerSymbol) {
            result = "YOU WIN!";
        } else if (winner !== null) {
            result = "YOU LOSE!";
        } else if (checkDraw(boardString)) {
            result = "IT'S A DRAW!";
        } else {
            return;
        }

        if (this.matchHistoryMode) {
            const isFinalGame = this.currentRoomGameIndex + 1 >= this.roomGameIds.length;

            this.stopReplay();
            this.stopTransition();

            showReplayCompleteModal(result, {
                autoClose: !isFinalGame,
                duration: 2000,
                hideCloseButton: !isFinalGame,
                onClose: () => {
                    this.stopTransition();

                    if (isFinalGame) {
                        this.finishMatchHistoryReplay();
                        return;
                    }

                    this.advanceMatchHistory();
                }
            });
            return;
        }

        showReplayCompleteModal(result);
    }

    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.replaceChildren(this.container);

            if (this.matchHistoryMode) {
                this.currentRoomGameIndex = Number.isInteger(this.options.currentRoomGameIndex)
                    ? this.options.currentRoomGameIndex
                    : this.roomGameIds.indexOf(this.gameId);
                this.matchProgressDisplay.textContent = this.getMatchProgressText();
                this.isReplaySequenceActive = true;
                this.updateReplayButtonState();
                this.startMatchHistoryReplay();
                return;
            }

            this.startReplay();
        }
    }
}
