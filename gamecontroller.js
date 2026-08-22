let rematchInProgress = false;


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

async function handlePlayAgain(waitingModal) {
    // Prevent double click / duplicate rematch requests
    if (rematchInProgress) {
        return;
    }

    rematchInProgress = true;

    try {
        const response = await createOrJoinGame(gameKey);

        console.log("Play Again response:", response);


        // CASE 1:
        // Old game still has both players.
        // This means this player is the first one trying to rematch.
 if (response === "[GAME ALREADY STARTED]") {

    const boardData = await getBoard(gameKey);

    const winner = checkWinner(boardData);
    const draw = checkDraw(boardData);

    // If the current board is already finished,
    // this is still the old game and it is safe to reset.
    if (winner !== null || draw) {

        console.log("Old game finished. Starting rematch.");

        await resetGame(gameKey);

        const newTile = await createOrJoinGame(gameKey);

        console.log("New tile:", newTile);

        playerTile = newTile;
        gameOver = false;

        waitForGameToStart(gameKey);

        return;
    }

        // If the board is not finished, a new match
        // has already started with another player.
        console.log("Another player already joined the game.");
        waitingModal.close();
        showGameAlreadyStartedModal();
    return;
    }


        // CASE 2:
        // The other player already created the new game.
        // This player joined as Player O.
        if (response === "O") {

            console.log("Joined rematch as Player O.");

            playerTile = "O";
            gameOver = false;

            game();

            return;
        }


        // CASE 3:
        // No existing game was found.
        // This player created a new room as Player X.
        // The previous opponent may have left.
        if (response === "X") {

            console.log("Created new room as Player X.");

            playerTile = "X";
            gameOver = false;

            showGameMessage(
                "Your opponent left. Waiting for a new player..."
            );

            waitForGameToStart(gameKey);

            return;
        }


        console.log("Unexpected Play Again response:", response);

    } catch (error) {
        console.error("Play Again failed:", error);

    } finally {
        rematchInProgress = false;
    }
}

