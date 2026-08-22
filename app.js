
let playerTile = null; 
let gameKey = null; 
let waitingInterval = null;
let moveInProgress = false;

//window listener
// app.js
window.addEventListener("pagehide", function () {
    resetGame(gameKey, true);
});

const mainPage = new MainPage();

mainPage.createButton.onClick(function () {
  const createLobbyPage = new CreateLobbyPage();

  createLobbyPage.cancelButton.onClick(async function () {

      if (createLobbyPage.gameCreated) {//if a game is already created then cancelled
        await resetGame(gameKey);
        clearInterval(waitingInterval);
        waitingInterval = null;
        gameKey = null;
        playerTile = null;
    }
    mainPage.render("app");
  });


  createLobbyPage.render("app");
});

mainPage.joinButton.onClick(function () {
  const joinLobbyPage = new JoinLobbyPage();
  
  joinLobbyPage.cancelButton.onClick(function () {
        mainPage.render("app");
  });

  joinLobbyPage.render("app");
});

mainPage.render("app");

