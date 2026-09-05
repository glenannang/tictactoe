import { gameState } from "./state/gameState.js";
import { MainPage } from "./pages/MainPage.js";
import { resetGame } from "./services/gameService.js";
import { getOrCreatePlayerId } from "./utils/playerUtils.js";

// Initialize player ID (browser identity)
getOrCreatePlayerId();

//window
window.addEventListener("pagehide", function () {
    resetGame(gameState.gameKey, true);
});

//load mainpage 
const mainPage = new MainPage();
mainPage.render("app");