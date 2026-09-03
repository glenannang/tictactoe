const RECORD_BASE_URL ="http://localhost:8080/tic-tac-toe-webservices/rest";


export async function createGameRecord(roomCode) {
    const response = await fetch(`${RECORD_BASE_URL}/rooms/${encodeURIComponent(roomCode)}/games`,
        {
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.msg || "Failed to create game record.");
    }

    return data;
}

export async function getRoomRecord(roomCode) {
    const response = await fetch(
        `${RECORD_BASE_URL}/getRoom/${encodeURIComponent(roomCode)}`,
        {
            headers: {
                Accept: "application/json"
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.msg || "Failed to retrieve room.");
    }

    return data;
}

