import { Button } from "../components/button.js";
import { gameState } from "../state/gameState.js";
import { createOrJoinGame, resetGame } from "../services/gameService.js";
import { generateGameKey } from "../utils/gameUtils.js";
import { waitForGameToStart } from "../game/gameController.js";


export class CreateLobbyPage {

    constructor(onCancel) {
        this.onCancel = onCancel;
        this.gameCreated = false;

        this.initializeElements();
        this.setAttributes();
        this.appendElements();
        this.addEventListeners();
    }


    initializeElements() {
        this.container = document.createElement("main");
        this.content = document.createElement("div");
        this.title = document.createElement("h1");

        this.gameKey = generateGameKey();

        this.codeLabel = document.createElement("p");
        this.codeText = document.createElement("h2");

        this.regenerateButton = new Button(
            "regenerate-code",
            "Regenerate",
            "lobby-button regenerate-button"
        );

        this.createButton = new Button(
            "confirm-create-game",
            "Create",
            "lobby-button confirm-create-button"
        );

        this.cancelButton = new Button(
            "cancel-create-game",
            "Cancel",
            "lobby-button cancel-create-button"
        );
    }


    setAttributes() {
        this.container.id = "createLobbyPage";

        this.content.className = "create-lobby-content";

        this.title.className = "create-lobby-title";
        this.title.textContent = "Create Your Game";

        this.codeLabel.className = "game-code-label";
        this.codeLabel.textContent = "Game Code";

        this.codeText.className = "game-code-display";
        this.codeText.textContent = this.gameKey;
        this.codeText.id = "gameCode";
    }


    appendElements() {
        this.content.append(
            this.title,
            this.codeText,
            this.regenerateButton.getElement(),
            this.codeLabel,
            this.createButton.getElement(),
            this.cancelButton.getElement()
        );

        this.container.append(this.content);
    }


    addEventListeners() {

        // Generate a new game code
        this.regenerateButton.onClick(() => {
            this.gameKey = generateGameKey();
            this.codeText.textContent = this.gameKey;
        });


        // Create game room
        this.createButton.onClick(async () => {
            console.log("Creating game with:", this.gameKey);

            const tile = await createOrJoinGame(this.gameKey);

            console.log("Server returned:", tile);

            if (tile === "X") {
                gameState.gameKey = this.gameKey;
                gameState.playerTile = tile;

                console.log("Game created successfully");

                this.gameCreated = true;

                this.showWaitingState();

                waitForGameToStart(gameState.gameKey,this.onCancel);
            }
        });


        // Cancel / return to Main Page
        this.cancelButton.onClick(async () => {

            // CASE 1:
            // A room has already been created.
            // Delete the room and stop waiting.
            if (this.gameCreated) {
                await resetGame(gameState.gameKey);

                clearTimeout(gameState.waitingInterval);
                gameState.waitingInterval = null;

                gameState.gameKey = null;
                gameState.playerTile = null;
            }

            // CASE 2:
            // If no room has been created yet,
            // there is nothing to delete.
            if (this.onCancel) {
                this.onCancel();
            }
        });
    }


    showWaitingState() {
        this.container.classList.add("waiting-state");

        this.title.textContent = "Game Created";

        const copyButton = new Button(
            "copy-code",
            "Copy Code"
        );

        copyButton.getElement().classList.add(
            "lobby-button",
            "copy-code-button"
        );

        const waitingMessage = document.createElement("p");

        waitingMessage.className = "waiting-message";
        waitingMessage.textContent =
            "Waiting for another player to join...";

        copyButton.onClick(async () => {
            await navigator.clipboard.writeText(this.gameKey);

            console.log("Copied:", this.gameKey);
        });

        this.content.replaceChildren(
            this.title,
            this.codeText,
            copyButton.getElement(),
            this.codeLabel,
            waitingMessage,
            this.cancelButton.getElement()
        );
    }


    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.replaceChildren(this.container);
        }
    }
}