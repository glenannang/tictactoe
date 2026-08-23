
import { gameState } from "../state/gameState.js";
import { getCurrentTurn } from "../game/gameRules.js";

export function updateGameDisplay(data) {
    const board = data.split(":");
    const cells = document.querySelectorAll(".cell");

    cells.forEach(function (cell, index) {
        cell.textContent = board[index];
    });

    const currentTurn = getCurrentTurn(data);

    if (currentTurn === gameState.playerTile) {
        gameMessage.textContent = "Your Turn";
    } else {
        gameMessage.textContent = "Opponent's Turn";
    }
}

export function generateGameKey() {
    return crypto.randomUUID().slice(0, 6).toUpperCase();
}