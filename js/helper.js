

function waitForGameToStart(key) {

    async function check() {
        const status = await checkGame(key);

        if (status === "true") {
            waitingInterval = null;
            game();
            return;
        }

        waitingInterval = setTimeout(check, 1000);
    }

    check();
}

function showGameMessage(message) {
    const gameMessage = document.getElementById("gameMessage");
    gameMessage.textContent = message;
}

function generateGameKey() {
    return crypto.randomUUID().slice(0, 6).toUpperCase();
}