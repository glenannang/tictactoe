function createMainPage() {

    const app = document.getElementById("app")
    // Main page container
    const mainPage = document.createElement("div");
    mainPage.id = "mainPage";

    // Title
    const title = document.createElement("h1");
    title.textContent = "Tic Tac Toe GAME";

    // Game key input
    const gameKeyInput = document.createElement("input");
    gameKeyInput.type = "text";
    gameKeyInput.id = "gameKey";
    gameKeyInput.placeholder = "Enter game key";

    // Create Game button
    const createButton = document.createElement("button");
    createButton.id = "createButton";
    createButton.textContent = "Create Game";

    // Join Game button
    const joinButton = document.createElement("button");
    joinButton.id = "joinButton";
    joinButton.textContent = "Join Game";

    // Message
    const message = document.createElement("p");
    message.id = "message";


    //EVENT LISTENERS FOR CREATE AND JOIN BUTTONS
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

    // Build the page
    mainPage.append(
        title,
        gameKeyInput,
        createButton,
        joinButton,
        message
    );

    app.replaceChildren(mainPage);
}


