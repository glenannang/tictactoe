import { Button } from "../components/Button.js";


export class HistoryPage {

    constructor(onBack) {
        this.onBack = onBack;

        this.initializeElements();
        this.setAttributes();
        this.appendElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.container = document.createElement("main");
        this.content = document.createElement("div");
        this.title = document.createElement("h1");
        this.description = document.createElement("p");
        this.options = document.createElement("div");

        this.playerOption = document.createElement("div");
        this.playerHistoryButton = new Button(
            "player-history",
            "Player History",
            "history-option-button player-history-button"
        );
        this.playerDescription = document.createElement("p");

        this.roomOption = document.createElement("div");
        this.roomHistoryButton = new Button(
            "room-match-history",
            "Room Match History",
            "history-option-button room-history-button"
        );
        this.roomDescription = document.createElement("p");

        this.backButton = new Button(
            "history-back",
            "Back to Menu",
            "game-button history-back-button"
        );
    }

    setAttributes() {
        this.container.id = "historyPage";
        this.content.className = "history-content";
        this.title.className = "history-title";
        this.description.className = "history-description";
        this.options.className = "history-options";
        this.playerOption.className = "history-option";
        this.roomOption.className = "history-option";
        this.playerDescription.className = "history-option-description";
        this.roomDescription.className = "history-option-description";

        this.title.textContent = "HISTORY";
        this.description.textContent =
            "Choose the ancient record you wish to consult.";
        this.playerDescription.textContent =
            "View recorded games associated with a player.";
        this.roomDescription.textContent =
            "View recorded matches played within a room.";
    }

    appendElements() {
        this.playerOption.append(
            this.playerHistoryButton.getElement(),
            this.playerDescription
        );

        this.roomOption.append(
            this.roomHistoryButton.getElement(),
            this.roomDescription
        );

        this.options.append(this.playerOption, this.roomOption);
        this.content.append(this.title, this.description, this.options);
        this.container.append(this.content, this.backButton.getElement());
    }

    addEventListeners() {
        this.playerHistoryButton.onClick(() => {
            console.log("Player History selected");
        });

        this.roomHistoryButton.onClick(() => {
            console.log("Room Match History selected");
        });

        this.backButton.onClick(() => {
            if (this.onBack) {
                this.onBack();
            }
        });
    }

    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.replaceChildren(this.container);
        }
    }
}