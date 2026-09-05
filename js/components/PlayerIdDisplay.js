import { playerId } from "../state/playerState.js";

export class PlayerIdDisplay {
    constructor() {
        this.element = document.createElement("p");
        this.element.className = "player-id-display";
        this.element.textContent = `Player ID: ${playerId}`;
    }

    getElement() {
        return this.element;
    }
}
