import { Button } from "../components/Button.js";
import { PlayerIdDisplay } from "../components/PlayerIdDisplay.js";
import { gameState } from "../state/gameState.js";
import { createOrJoinGame, resetGame } from "../services/gameService.js";
import { generateGameKey } from "../utils/gameUtils.js";
import { waitForGameToStart } from "../game/gameController.js";
import { createRoomRecord } from "../services/recordService.js";


export class CreateLobbyPage {

    constructor(onCancel) {
        this.onCancel = onCancel; //callback used to return to main page
        this.gameCreated = false;
        this.initializeElements();
        this.setAttributes();
        this.appendElements();
        this.addEventListeners();
    }


    initializeElements() {
        this.container = document.createElement("main");
        this.content = document.createElement("div");
        this.actionButtons = document.createElement("div");
        this.title = document.createElement("h1");
        this.playerIdDisplay = new PlayerIdDisplay();

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
        this.actionButtons.className = "create-lobby-actions";

        this.title.className = "create-lobby-title";
        this.title.textContent = "Create Your Game";

        this.codeLabel.className = "game-code-label";
        this.codeLabel.textContent = "Room Code";

        this.codeText.className = "game-code-display";
        this.codeText.textContent = this.gameKey;
        this.codeText.id = "gameCode";
    }


    appendElements() {
        this.content.append(
            this.title,
            this.codeLabel,
            this.codeText,
            this.regenerateButton.getElement(),
            this.actionButtons
        );

        this.actionButtons.append(
            this.createButton.getElement(),
            this.cancelButton.getElement()
        );

        this.container.append(this.playerIdDisplay.getElement(), this.content);
    }


    addEventListeners() {

        // Generate a new game code
        this.regenerateButton.onClick(() => {
            this.gameKey = generateGameKey();
            this.codeText.textContent = this.gameKey;
        });


        // Create a game room
        this.createButton.onClick(async () => {

            // prevents double click while request is still running

            if (this.createInProgress || this.gameCreated) {
                return;
            }

            this.createInProgress = true;

            try {
                
                const tile = await createOrJoinGame(this.gameKey); //create a room record

                if (tile === "X") {
                    gameState.gameKey = this.gameKey;
                    gameState.playerTile = tile;

                    this.gameCreated = true;

                    const result = await createRoomRecord(this.gameKey);
                    console.log(result.msg);

                    this.showWaitingState();
                    waitForGameToStart(gameState.gameKey,this.onCancel);
                }

            } catch (error) {
                console.error("Failed to initialize room:", error);
                // INSERT ERROR HANDLING UI HERE
            } finally {
                this.createInProgress = false;
            }
        });


        // Cancel 
        this.cancelButton.onClick(async () => {

            // prevent cancel while game creation request is still running
            if (this.createInProgress) {
                return;
            }

            // A game has already been created
            if (this.gameCreated) {
                await resetGame(gameState.gameKey);

                clearTimeout(gameState.waitingInterval);
                gameState.waitingInterval = null;

                gameState.gameKey = null;
                gameState.playerTile = null;
            }

            
            // If no room has been created yet
            if (this.onCancel) {
                this.onCancel();
            }
        });
    }


    showWaitingState() {
        this.container.classList.add("waiting-state");

        this.title.textContent = "Game Created";

        const copyButton = new Button("copy-code","Copy Code");

        copyButton.getElement().classList.add("lobby-button","copy-code-button");

        const waitingMessage = document.createElement("p");

        waitingMessage.className = "waiting-message";
        waitingMessage.textContent = "Waiting for another player to join...";

        copyButton.onClick(async () => {
            await navigator.clipboard.writeText(this.gameKey);
        });

        this.content.replaceChildren(
            this.title,
            this.codeLabel,
            this.codeText,
            copyButton.getElement(),
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