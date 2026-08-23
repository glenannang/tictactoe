
function showGameMessage(message) {
    const gameMessage = document.getElementById("gameMessage");
    gameMessage.textContent = message;
}

function generateGameKey() {
    return crypto.randomUUID().slice(0, 6).toUpperCase();
}