class GamePage {
    constructor() {
        this.initializeElements();
        this.setAttributes();
        this.appendElements();
    }

    initializeElements() {
        this.container = document.createElement("main");

        this.greeting = document.createElement("h1");
        this.playerMessage = document.createElement("p");
        this.gameKeyText = document.createElement("p");
        this.turnMessage = document.createElement("p");

        this.board = createBoard();

        this.exitButton = new Button(
            "exit-game",
            "Exit"
        );
    }

    setAttributes() {
        this.container.id = "gamePage";

        this.greeting.textContent = "Hello, Explorer!";

        this.playerMessage.id = "playerMessage";
        this.playerMessage.textContent = `You are playing as ${playerTile}`;
        this.turnMessage.id = "gameMessage";

        this.gameKeyText.id = "gameKeyDisplay";
        this.gameKeyText.textContent = `Game Code: ${gameKey}`;

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

    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.replaceChildren(this.container);
        }
    }
}