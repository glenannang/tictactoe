class JoinLobbyPage {
    constructor() {
        this.initializeElements();
        this.setAttributes();
        this.appendElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.container = document.createElement("main");

        this.title = document.createElement("h1");

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

        this.title.textContent = "Join Game";

        this.gameKeyLabel.textContent = "Enter Game Code";

        this.gameKeyInput.type = "text";
        this.gameKeyInput.id = "gameKeyInput";
        this.gameKeyInput.placeholder = "Paste game code here";

        this.message.id = "joinMessage";
    }

    appendElements() {
        this.container.append(
            this.title,
            this.gameKeyLabel,
            this.gameKeyInput,
            this.joinButton.getElement(),
            this.cancelButton.getElement(),
            this.message
        );
    }

    getGameKey() {
        return this.gameKeyInput.value.trim();
    }

    showMessage(message) {
        this.message.textContent = message;
    }

    addEventListeners() {
    this.joinButton.onClick(async () => {
        const key = this.getGameKey();

        if (key === "") {
            this.showMessage("Please enter a game code.");
            return;
        }

        const tile = await createOrJoinGame(key);

        console.log("Server returned:", tile);

        //room did not exist previously 
        if (tile === "X") {
            await resetGame(key);

            this.showMessage("Game does not exist.");
            return;
        }
        
        // existing room successfully joined
         if (tile === "O") {
            gameKey = key;
            playerTile = tile;

            console.log("Joined game successfully");
            this.showMessage("Joined game successfully. Waiting for the game to start...");
            waitForGameToStart(key);
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