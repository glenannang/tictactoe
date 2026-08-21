function createGamePage() {
    const app = document.getElementById("app");

    const gamePage = document.createElement("div");
    gamePage.id = "gamePage";

    const message = document.createElement("p");
    message.id = "message";

    // create board
    const board = createBoard();

    //create board event listeners
    const exitButton = document.createElement("button");
    exitButton.id = "exitButton";
    exitButton.textContent = "Exit Game";

    exitButton.addEventListener("click", async function () {
        await resetGame(gameKey);

        clearInterval(boardSyncInterval);

        gameOver = false;
        gameKey = null;
        playerTile = null;

        createMainPage();
    });

    //build game page
    gamePage.append(
        message,
        board,
        exitButton
    );

    app.replaceChildren(gamePage);

    addBoardEventListeners();
}