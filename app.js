
let playerTile = null; 
let gameKey = null; 
let waitingInterval = null;
//createMainPage(); // Show the main page when the app loads

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

  createLobbyPage.regenerateButton.onClick(function () {
    console.log("Regenerate clicked");
  });

  createLobbyPage.createButton.onClick(function () {
    console.log("Create Game confirmed");
  });

  createLobbyPage.render("app");
});

mainPage.joinButton.onClick(function () {
  console.log("Join clicked");
});

mainPage.render("app");

