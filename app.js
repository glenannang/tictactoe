
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

