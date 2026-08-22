class JoinLobbyPage {
  constructor() {
    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.addEventListeners();
  }

  initializeElements() {
    this.container = document.createElement("main");

    // Real brown panel container
    this.content = document.createElement("div");

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

    this.content.className = "join-lobby-content";

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
      this.gameKeyInput,
      this.gameKeyLabel,
      this.joinButton.getElement(),
      this.cancelButton.getElement(),
      this.message
    );

    this.container.append(this.content);
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

      // Room did not exist previously
      if (tile === "X") {
        await resetGame(key);

        this.showMessage("Game does not exist.");
        return;
      }

      // Game already has two players
      if (tile === "[GAME ALREADY STARTED]") {
        this.showMessage( "This game is already in progress. Please enter a different game code.");
        return;
      }

      // Existing room successfully joined
      if (tile === "O") {
        gameKey = key;
        playerTile = tile;

        console.log("Joined game successfully");

        this.showMessage(
          "Joined game successfully. Waiting for the game to start..."
        );

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