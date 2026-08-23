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

async function handlePlayAgain() {
    // Prevent double click / duplicate rematch requests
    if (rematchInProgress) {
        return;
    }

    rematchInProgress = true;

    try {
        const response = await createOrJoinGame(gameKey);

        console.log("Play Again response:", response);


      
        //CASE 1:
        if (response === "[GAME ALREADY STARTED]") {
            const currentBoard = await getBoard(gameKey);

            if (currentBoard === finishedBoard) { // Same old finished game
                await resetGame(gameKey);

                playerTile = await createOrJoinGame(gameKey);
                gameOver = false;
                showWaitingForOpponentModal();
                waitForGameToStart(gameKey);
                return;
            }

            // Board changed 
            showGameAlreadyStartedModal();
            return;
        }


        // CASE 2: the game was reset already by the other player
        if (response === "O") { 
            console.log("Joined rematch as Player O.");
            playerTile = "O";
            gameOver = false;
            game();
            return;
        }


        // CASE 3: No existing game was found.
        //  The other player either pressed exit on the game over modal or the waiting for another player modal
        if (response === "X") {

            console.log("Created new room as Player X.");

            playerTile = "X";
            gameOver = false;
            finishedBoard = null;
            showOpponentLeftRematchModal();
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
