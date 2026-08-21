
let playerTile = null; 
let gameKey = null; 

//createMainPage(); // Show the main page when the app loads

const mainPage = new MainPage();

mainPage.createButton.onClick(function () {
  const createLobbyPage = new CreateLobbyPage();

  createLobbyPage.cancelButton.onClick(function () {
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

