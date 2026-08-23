import { Button } from "../components/Button.js";
import { CreateLobbyPage } from "./CreateLobbyPage.js";
import { JoinLobbyPage } from "./JoinLobbyPage.js";
import { HowToPlayPage } from "./HowToPlayPage.js";


export class MainPage {
    constructor() {
        this.initializeElements();
        this.setAttributes();
        this.appendElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.container = document.createElement("main");
        this.backgroundVideo = document.createElement("video");
        this.title = document.createElement("img");
        this.menuActions = document.createElement("div");

        this.createButton = new Button(
            "create-game",
            "Create Game",
            "game-button create-button"
        );

        this.joinButton = new Button(
            "join-game",
            "Join Game",
            "game-button join-button"
        );

        this.howToPlayButton = new Button(
            "how-to-play",
            "How to Play",
            "game-button how-to-play-button"
        );
    }

    setAttributes() {
        this.container.id = "mainPage";

        this.backgroundVideo.src =
            "assets/Videos/Main Menu Background.mp4";

        this.backgroundVideo.className =
            "main-background-video";

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
            this.joinButton.getElement(),
            this.howToPlayButton.getElement()
        );

        this.container.append(
            this.backgroundVideo,
            this.title,
            this.menuActions
        );
    }

    addEventListeners() {

        //CREATE BUTTON
        this.createButton.onClick(() => {
            const createLobbyPage = new CreateLobbyPage(() => {
                const mainPage = new MainPage();
                mainPage.render("app");
            });

            createLobbyPage.render("app");
        });

        //JOIN BUTTON
        this.joinButton.onClick(() => {
            const joinLobbyPage = new JoinLobbyPage(() => {
                const mainPage = new MainPage();
                mainPage.render("app");
            });

            joinLobbyPage.render("app");
        });

        // HOW TO PLAY 
        this.howToPlayButton.onClick(() => {
            const howToPlayPage = new HowToPlayPage(() => {
                const mainPage = new MainPage();
                mainPage.render("app");
            });

            howToPlayPage.render("app");
        });

    }

    render(target) {
        const targetElement = document.getElementById(target);

        if (targetElement) {
            targetElement.replaceChildren(this.container);
        }
    }
}