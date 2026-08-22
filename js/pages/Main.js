class MainPage {
    constructor() {
        this.initializeElements();
        this.setAttributes();
        this.appendElements();
    }

    initializeElements() {
        this.container = document.createElement("main");
        this.backgroundVideo = document.createElement("video");
        this.title = document.createElement("img");
        this.menuActions = document.createElement("div");

        this.createButton = new Button("create-game","Create Game","game-button create-button");

        this.joinButton = new Button("join-game","Join Game","game-button join-button");
    }

    setAttributes() {
        this.container.id = "mainPage";
        this.backgroundVideo.src = "assets/Videos/Main Menu Background.mp4";
        this.backgroundVideo.className = "main-background-video";
        this.backgroundVideo.autoplay = true;
        this.backgroundVideo.muted = true;
        this.backgroundVideo.loop = true;
        this.backgroundVideo.playsInline = true;
        this.title.src = "assets/images/Title.png";
        this.title.className = "main-title-image";
        this.title.alt = "Tic Tac Toe: The Ancient Trial";
        this.menuActions.className = "main-menu-actions";
    }

    appendElements() {
        this.menuActions.append(
            this.createButton.getElement(),
            this.joinButton.getElement()
        );

        this.container.append(
            this.backgroundVideo,
            this.title,
            this.menuActions
        );
    }

    render(target) {
        const targetElement = document.getElementById(target);

        if (targetElement) {
            targetElement.replaceChildren(this.container);
        }
    }
}