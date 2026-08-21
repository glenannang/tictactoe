class Button {
  constructor(id, text, className) {
    this.id = id;
    this.text = text;
    this.className = className;

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.button = document.createElement("button");
  }

  setAttributes() {
    this.button.id = this.id;
    this.button.textContent = this.text;

    if (this.className) {
      this.button.className = this.className;
    }
  }

  appendElements() {}

  onClick(callback) {
    this.button.addEventListener("click", callback);
  }

  getElement() {
    return this.button;
  }

  render(target) {
    target.appendChild(this.button);
  }
}
