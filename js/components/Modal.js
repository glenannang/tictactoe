class Modal {
    constructor(title, message) {
        this.titleText = title;
        this.messageText = message;

        this.initializeElements();
        this.setAttributes();
        this.appendElements();
    }

    initializeElements() {
        this.overlay = document.createElement("div");
        this.container = document.createElement("div");

        this.title = document.createElement("h2");
        this.message = document.createElement("p");

        this.buttonContainer = document.createElement("div");
    }

    setAttributes() {
        this.overlay.className = "modal-overlay";
        this.container.className = "modal";

        this.title.textContent = this.titleText;
        this.message.textContent = this.messageText;
    }

    appendElements() {
        this.container.append(
            this.title,
            this.message,
            this.buttonContainer
        );

        this.overlay.append(this.container);
    }

    addButton(button) {
        this.buttonContainer.append(
            button.getElement()
        );
    }

    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.append(this.overlay);
        }
    }

    close() {
        this.overlay.remove();
    }
}