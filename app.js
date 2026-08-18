const createButton = document.getElementById("createButton");
const joinButton = document.getElementById("joinButton");
const gameKeyInput = document.getElementById("gameKey");

createButton.addEventListener("click", async function () {
    const key = gameKeyInput.value.trim();

    if (key === "") {
        console.log("Please enter a game key.");
        return;
    }

    const tile = await createOrJoinGame(key);

    if (tile === "X") {
        console.log("Waiting for Player O...");

        waitForGameToStart(key);
    }
});

joinButton.addEventListener("click", async function () {
    const key = gameKeyInput.value;
     waitForGameToStart(key);
    const tile = await createOrJoinGame(key);

    if (key === "") {
        console.log("Please enter a game key.");
        return;
    }
    if (tile === "X") {
        console.log("This room did not exist, so a new game was created");

    }
    
});


function waitForGameToStart(key) {

    const checkInterval = setInterval(async function () {

        const status = await checkGame(key);

        if (status === "true") {
            showGameMessage("Game is starting!");

            clearInterval(checkInterval);
        }

    }, 1000);
}

function showGameMessage(message) {
    const gameMessage = document.getElementById("message");

    gameMessage.textContent = message;

    // setTimeout(function () {
    //     gameMessage.textContent = "";
    // }, 3000);
}
