function game() {
    const gamePage = new GamePage();

    //event listener for exit button
    gamePage.exitButton.onClick(async function () {
        await resetGame(gameKey);

        clearInterval(boardSyncInterval);

        gameKey = null;
        playerTile = null;
        gameOver = false;

        mainPage.render("app");
    });

    gamePage.render("app");

    addBoardEventListeners();
    syncBoard(gameKey);

}