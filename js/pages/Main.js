class MainPage {
    constructor() {
        this.initializeElements();
        this.setAttributes();
        this.appendElements();
    }

    initializeElements() {
        this.container = document.createElement("main");
        this.title = document.createElement("h1");

        this.createButton = new Button("create-game", "Create Game");
        this.joinButton = new Button("join-game", "Join Game");
    }

    setAttributes() {
        this.container.id = "mainPage";
        this.title.textContent = "Tic Tac Toe";
    }

    appendElements() {
        this.container.append(
            this.title,
            this.createButton.getElement(),
            this.joinButton.getElement()
        );
    }

    render(target) {
        const targetElement = document.getElementById(target);

        if (targetElement) {
            targetElement.replaceChildren(this.container);
        }
    }
}