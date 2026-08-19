
const createButton = document.getElementById("createButton");
const joinButton = document.getElementById("joinButton");
const gameKeyInput = document.getElementById("gameKey");


let playerTile = null; 
let gameKey = null; 

window.addEventListener("pagehide", async function () {
    await resetGame(gameKey);
});

createButton.addEventListener("click", async function () {
    const key = gameKeyInput.value.trim();

    if (key === "") {
        console.log("Please enter a game key.");
        return;
    }

    const tile = await createOrJoinGame(key);

    if (tile === "X" ) {
        console.log("Waiting for Player O...");
        waitForGameToStart(key);
        playerTile = tile;
        gameKey = key;
    }
    if (tile === "O") {
        console.log("Game already exists. Joined the game instead.");
        waitForGameToStart(key);
        playerTile = tile;
        gameKey = key;
    }
});

joinButton.addEventListener("click", async function () {
    const key = gameKeyInput.value;
    
    if (key === "") {
        console.log("Please enter a game key.");
        return;
    }

    const tile = await createOrJoinGame(key);
    
    if (tile === "X") {
        console.log("This room does not exist");
        await resetGame(key); //later change to deleting the game craeated and prompt to create one instead
        console.log("deleting game room");
        return;
    }
    
    if (tile === "O") {
        playerTile = tile;
        gameKey = key;
        console.log("Joined game as Player O");
        waitForGameToStart(key);
    }

});


function waitForGameToStart(key) {

    const checkInterval = setInterval(async function () {

        const status = await checkGame(key);
        if (status === "true") { 
            clearInterval(checkInterval);
            showGameMessage("Game is starting!");
            game(); // Start the game board
            
        }

    }, 1000);
}

function showGameMessage(message) {
    const gameMessage = document.getElementById("message");
    gameMessage.textContent = message;

}
