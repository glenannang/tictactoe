const RECORD_BASE_URL ="http://localhost:8080/tic-tac-toe-webservices/rest";


export async function createRoomRecord(roomCode) {
    const response = await fetch(`${RECORD_BASE_URL}/room`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ roomCode })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.msg || "Failed to create room record.");
    }

    return data;
}


export async function createGameRecord(roomCode) {
    const response = await fetch(`${RECORD_BASE_URL}/room/${encodeURIComponent(roomCode)}/games`,
        {
            method: "POST",
            headers: {Accept: "application/json"}
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
        `${RECORD_BASE_URL}/room/${encodeURIComponent(roomCode)}`,
        { headers: {Accept: "application/json"} }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.msg || "Failed to retrieve room.");
    }

    return data;
}

