export class HowToPlayPage {

    constructor() {
        this.initializeElements();
        this.setAttributes();
        this.appendElements();
    }

    // Step 1: Create and initialize variables
    initializeElements() {
        this.container = document.createElement("div");

        this.scroll = document.createElement("div");
        this.content = document.createElement("div");

        this.title = document.createElement("h1");
        this.description = document.createElement("p");

        this.rule1 = document.createElement("p");
        this.rule2 = document.createElement("p");
        this.rule3 = document.createElement("p");
        this.rule4 = document.createElement("p");
        this.rule5 = document.createElement("p");

        this.backButton = document.createElement("button");
    }

    // Step 2: Set attributes and properties
    setAttributes() {
        this.container.id = "howToPlayPage";

        this.scroll.classList.add("how-to-play-scroll");
        this.content.classList.add("how-to-play-content");

        this.title.classList.add("how-to-play-title");
        this.description.classList.add("how-to-play-description");

        this.rule1.classList.add("how-to-play-rule");
        this.rule2.classList.add("how-to-play-rule");
        this.rule3.classList.add("how-to-play-rule");
        this.rule4.classList.add("how-to-play-rule");
        this.rule5.classList.add("how-to-play-rule");

        this.backButton.classList.add("game-button", "back-button");

        this.title.textContent = "HOW TO PLAY";

        this.description.textContent =
            "Deep within a forgotten Egyptian chamber lies an ancient grid—a trial meant for two challengers. Each bears a mark: X or O. Only the first to align three marks will conquer the trial.";

        this.rule1.textContent =
            "1. Enter the trial by creating a game, or join another explorer using their game code.";

        this.rule2.textContent =
            "2. The first explorer to enter the chamber bears the mark X and makes the first move. The second explorer bears O.";

        this.rule3.textContent =
            "3. Take turns placing your mark on an empty space of the ancient grid.";

        this.rule4.textContent =
            "4. Align three of your marks in a row, column, or diagonal to conquer the trial.";

        this.rule5.textContent =
            "5. If the grid is filled and neither explorer succeeds, the trial ends in a draw.";

        this.backButton.textContent = "BACK TO MENU";
    }

    // Step 3: Append elements
    appendElements() {
        // Put all text inside the content container
        this.content.append(
            this.title,
            this.description,
            this.rule1,
            this.rule2,
            this.rule3,
            this.rule4,
            this.rule5
        );

        // Put the content inside the scroll
        this.scroll.append(this.content);

        // Put the scroll and back button inside the page
        this.container.append(
            this.scroll,
            this.backButton
        );
    }

    // Render page
    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.replaceChildren(this.container);
        }
    }
}

