
export function showGameMessage(message) {
    const gameMessage = document.getElementById("gameMessage");
    gameMessage.textContent = message;
}

export function generateGameKey() {
    return crypto.randomUUID().slice(0, 6).toUpperCase();
}