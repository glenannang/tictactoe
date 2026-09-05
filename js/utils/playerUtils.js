

const PLAYER_ID_KEY = "ticTacToePlayerId";

export function getOrCreatePlayerId() {
    let playerId = localStorage.getItem(PLAYER_ID_KEY);

    if (!playerId) {
        playerId = crypto.randomUUID();
        localStorage.setItem(PLAYER_ID_KEY, playerId);
    }

    return playerId;
}