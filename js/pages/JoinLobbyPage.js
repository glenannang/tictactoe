import { Button } from "../components/Button.js";
import { PlayerIdDisplay } from "../components/PlayerIdDisplay.js";
import { gameState } from "../state/gameState.js";
import {
    createOrJoinGame,
    resetGame
} from "../services/gameService.js";
import { waitForGameToStart } from "../game/gameController.js";


export class JoinLobbyPage {

    constructor(onCancel) {
        this.onCancel = onCancel;

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

        this.gameKeyLabel = document.createElement("p");
        this.gameKeyInput = document.createElement("input");

        this.joinButton = new Button(
            "confirm-join-game",
            "Join Game"
        );

        this.cancelButton = new Button(
            "cancel-join-game",
            "Cancel"
        );

        this.message = document.createElement("p");
    }


    setAttributes() {
        this.container.id = "joinLobbyPage";

        this.content.className = "join-lobby-content";
        this.actionButtons.className = "join-lobby-actions";

        this.title.textContent = "Join Game";

        this.gameKeyLabel.textContent = "Enter Game Code";

        this.gameKeyInput.type = "text";
        this.gameKeyInput.id = "gameKeyInput";
        this.gameKeyInput.placeholder = "Paste game code here";

        this.message.id = "joinMessage";
    }


    appendElements() {
        this.content.append(
            this.title,
            this.gameKeyLabel,
            this.gameKeyInput,
            this.actionButtons,
            this.message
        );

        this.actionButtons.append(
            this.joinButton.getElement(),
            this.cancelButton.getElement()
        );

        this.container.append(this.playerIdDisplay.getElement(), this.content);
    }


    getGameKey() {
        return this.gameKeyInput.value.trim();
    }


    showMessage(message) {
        this.message.textContent = message;
    }


    addEventListeners() {

        // Join game
        this.joinButton.onClick(async () => {
            const key = this.getGameKey();

            if (key === "") {
                this.showMessage("Please enter a game code.");
                return;
            }

            const tile = await createOrJoinGame(key);

            console.log("Server returned:", tile);


            // Room did not exist previously.
            // Server temporarily creates it as X,
            // so remove that newly-created room.
            if (tile === "X") {
                await resetGame(key);

                this.showMessage("Game does not exist.");
                return;
            }


            // Game already has two players
            if (tile === "[GAME ALREADY STARTED]") {
                this.showMessage(
                    "This game is already in progress. Please enter a different game code."
                );

                return;
            }


            // Existing room successfully joined
            if (tile === "O") {
                gameState.gameKey = key;
                gameState.playerTile = tile;

                console.log("Joined game successfully");

                this.showMessage(
                    "Joined game successfully. Waiting for the game to start..."
                );

                waitForGameToStart(gameState.gameKey, this.onCancel);
            }
        });


        // Return to Main Page
        this.cancelButton.onClick(() => {
            if (this.onCancel) {
                this.onCancel();
            }
        });
    }


    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.replaceChildren(this.container);
        } else {
            console.error("Target element not found");
        }
    }
}