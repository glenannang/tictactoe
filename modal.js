// function showWinnerPopup(winner) {

//     const overlay = document.createElement("div");
//     overlay.className = "winner-overlay";

//     const popup = document.createElement("div");
//     popup.className = "winner-popup";

//     const winnerMessage = document.createElement("h2");
//     winnerMessage.textContent = `${winner} wins!`;

//     const rematchButton = document.createElement("button");
//     rematchButton.className = "rematch-button";
//     rematchButton.textContent = "Rematch";

//     rematchButton.addEventListener("click", async function () {
//         const response = await createOrJoinGame(gameKey); // would at least be the third request 

//         if (response ==="O"){ // meaning the game is already recreated 
//             await createOrJoinGame(gameKey)// join 
//             await waitForGameToStart(gameKey);
//         } 
//         if (response === "[GAME ALREADY STARTED]"){ 
//             await resetGame(gameKey);
//             await createOrJoinGame(gameKey); // join the game again
//             await waitForGameToStart(gameKey);
//             // hide the button and show a message saying the game is reset and waiting for the other player to join 
//         }

//     });

//     popup.append(winnerMessage,rematchButton);
//     overlay.appendChild(popup);

//     document.body.appendChild(overlay);
// }

// function showDrawPopup(winner) {

//     const overlay = document.createElement("div");
//     overlay.className = "winner-overlay";

//     const popup = document.createElement("div");
//     popup.className = "winner-popup";

//     const drawMessage = document.createElement("h2");
//     drawMessage.textContent = `It's a draw!`;

//     const rematchButton = document.createElement("button");
//     rematchButton.className = "rematch-button";
//     rematchButton.textContent = "Rematch";

//     rematchButton.addEventListener("click", async function () {
//         const response = await createOrJoinGame(gameKey); // would at least be the third request 

//         if (response ==="O"){ // meaning the game is already recreated 
//             await createOrJoinGame(gameKey)// join 
//             await waitForGameToStart(gameKey);
//         } 
//         if (response === "[GAME ALREADY STARTED]"){ 
//             await resetGame(gameKey);
//             await createOrJoinGame(gameKey); // join the game again
//             await waitForGameToStart(gameKey);
//             // hide the button and show a message saying the game is reset and waiting for the other player to join 
//         }

//     });

//     popup.append(winnerMessage,rematchButton);
//     overlay.appendChild(popup);

//     document.body.appendChild(overlay);
// }


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
        clearTimeout(modalCheckTimer);
        modalCheckTimer = null;
        await handlePlayAgain();
    });

    exitButton.onClick(async () => {
        clearTimeout(modalCheckTimer);
        modalCheckTimer = null;
        await resetGame(gameKey);

        gameKey = null;
        playerTile = null;
        gameOver = false;

        mainPage.render("app");
    });

    modal.render("gamePage");
    watchGameOverRoom();
}