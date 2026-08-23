import { gameState } from "../state/gameState.js";
import { getBoard, move } from "../services/gameService.js";
import { checkWinner, getCurrentTurn } from "./gameRules.js";
import { showGameMessage } from "../utils/gameUtils.js";



export function displayBoard(data) {
    const board = data.split(":");
    const cells =
        document.querySelectorAll(".cell");

    cells.forEach(function (cell, index) {
        cell.textContent = board[index];
    });


    const currentTurn =
        getCurrentTurn(data);

    if (
        currentTurn ===
        gameState.playerTile
    ) {
        showGameMessage("Your Turn");
    } else {
        showGameMessage("Opponent's Turn");
    }
}
