class CreateLobbyPage {
  constructor() {
    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.addEventListeners();
  }

  initializeElements() {
    this.container = document.createElement("main");

    this.title = document.createElement("h1");
    
    this.gameKey = generateGameKey();

    this.codeLabel = document.createElement("p");
    this.codeText = document.createElement("h2");

    this.regenerateButton = new Button(
      "regenerate-code",
      "Regenerate Code"
    );

    this.createButton = new Button(
      "confirm-create-game",
      "Create Game"
    );

    this.cancelButton = new Button(
      "cancel-create-game",
      "Cancel"
    );
  }

  setAttributes() {
    this.container.id = "createLobbyPage";
    this.title.textContent = "Create Game";

    this.codeLabel.textContent = "Game Code";
    this.codeText.textContent = this.gameKey;

    // placeholder muna
    this.codeText.textContent = "ABC123";
    this.codeText.id = "gameCode";
  }

  appendElements() {
    this.container.append(
      this.title,
      this.codeLabel,
      this.codeText,
      this.regenerateButton.getElement(),
      this.createButton.getElement(),
      this.cancelButton.getElement()
    );
  }

  addEventListeners() {
        this.regenerateButton.onClick(() => {
            this.gameKey = generateGameKey();
            this.codeText.textContent = this.gameKey;
        });
  }

  render(target) {
    const parent = document.getElementById(target);

    if (parent) {
      parent.replaceChildren(this.container);
    }
  }
}