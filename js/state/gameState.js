
function getOrCreatePlayerId() {
    const storageKey = "ticTacToePlayerId";
    let playerId = localStorage.getItem(storageKey);

    if (!playerId) {
        playerId = crypto.randomUUID();
        localStorage.setItem(storageKey, playerId);
    }

    return playerId;
}



export const gameState = {
    playerId: getOrCreatePlayerId(),
    currentGameId:null,

    playerTile: null,
    gameKey: null,

    waitingInterval: null,
    boardSyncInterval: null,

    moveInProgress: false,
    gameOver: false,
    finishedBoard: null,
    rematchInProgress: false
};