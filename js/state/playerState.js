import { generatePlayerId } from "../utils/playerUtils.js";

const PLAYER_ID_STORAGE_KEY = "tictactoe.playerId";

function getPlayerId() {
    try {
        const navigationEntry = performance.getEntriesByType("navigation")[0];

        const isReload = navigationEntry?.type === "reload";

        // Refresh: keep the existing player ID
        if (isReload) {
            const storedPlayerId = sessionStorage.getItem(PLAYER_ID_STORAGE_KEY);

            if (storedPlayerId) {
                return storedPlayerId;
            }
        }

        // create a new player ID if new tab or duplicated tab 
        const newPlayerId = generatePlayerId();
        sessionStorage.setItem(PLAYER_ID_STORAGE_KEY, newPlayerId);

        return newPlayerId;

    } catch {
        return generatePlayerId();
    }
}

export const playerId = getPlayerId();

export const playerState = {
    playerId
};