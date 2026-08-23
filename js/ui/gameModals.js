
function showGameOverModal(message) {
    const modal = new Modal(
        "Game Over",
        message
    );

    const playAgainButton = new Button(
        "play-again",
        "Play Again"
    );

    const exitButton = new Button(
        "modal-exit",
        "Exit"
    );

    modal.addButton(playAgainButton);
    modal.addButton(exitButton);

    playAgainButton.onClick(async () => {
        // Close Game Over modal
        modal.close();       
        await handlePlayAgain();
    });

    exitButton.onClick(async () => {
        const currentBoard = await getBoard(gameKey);
        if (currentBoard === finishedBoard) {
        // finished match is still there
        await resetGame(gameKey);
        }

        gameKey = null;
        playerTile = null;
        gameOver = false;
        finishedBoard = null;

        mainPage.render("app");
    });

    modal.render("gamePage");
   
}

function showOpponentLeftModal() {
    const modal = new Modal(
        "Opponent Left",
        "Your opponent left the game."
    );

    const exitButton = new Button(
        "opponent-left-exit",
        "Exit"
    );

    modal.addButton(exitButton);

    exitButton.onClick(() => {
        gameKey = null;
        playerTile = null;
        gameOver = false;

        mainPage.render("app");
    });

    modal.render("gamePage");
}

function showOpponentLeftRematchModal() {
    const modal = new Modal(
        "Opponent Left",
        "Your opponent left. Waiting for a new player..."
    );

    const exitButton = new Button(
        "opponent-left-exit",
        "Exit"
    );

    modal.addButton(exitButton);

    exitButton.onClick(() => {
        gameKey = null;
        playerTile = null;
        gameOver = false;

        mainPage.render("app");
    });

    modal.render("gamePage");
}

function showWaitingForOpponentModal() {
    const modal = new Modal(
        "Waiting for Opponent",
        "Waiting for another player to join..."
    );

    const exitButton = new Button(
        "waiting-exit",
        "Exit"
    );

    modal.addButton(exitButton);

    exitButton.onClick(async () => {
        clearTimeout(waitingInterval);
        waitingInterval = null;

        await resetGame(gameKey);

        gameKey = null;
        playerTile = null;
        gameOver = false;

        mainPage.render("app");
    });

    modal.render("gamePage");

    return modal;
}


function showGameAlreadyStartedModal() {
    const modal = new Modal(
        "Oops... Too Late!",
        "Another explorer has already entered the chamber and begun the challenge."
    );

    const exitButton = new Button(
        "game-started-exit",
        "Exit"
    );

    modal.addButton(exitButton);

    exitButton.onClick(() => {
        gameKey = null;
        playerTile = null;
        gameOver = false;

        mainPage.render("app");
    });

    modal.render("gamePage");
}

