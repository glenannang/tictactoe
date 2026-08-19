const BASE_URL = "http://localhost:8080/tictactoe/tictactoeserver";

function createOrJoinGame(key) {
    return fetch(`${BASE_URL}/createGame?key=${key}`)
        .then(response => response.text())
        .then(data => {
            console.log("createGame response:", data);
            return data;
        })
        .catch(error => {
            console.error("createGame error:", error);
        });
}


function checkGame(key) {
    return fetch(`${BASE_URL}/check?key=${key}`)
        .then(response => response.text())
        .then(data => {
            console.log("check response:", data);
            return data;
        })
        .catch(error => {
            console.error("check error:", error);
        });
}


function move(key, tile, y, x) {
    return fetch(`${BASE_URL}/move?key=${key}&tile=${tile}&y=${y}&x=${x}`)
        .then(response => response.text())
        .then(data => {
            console.log("Move response:", data);
        })
        .catch(error => {
            console.error("Move error:", error);
        });
}

function getBoard(key) {
     return fetch(`${BASE_URL}/board?key=${key}`)
        .then(response => response.text())
        .then(data => {
            console.log("Board status:", data);
            return data;
        })
        .catch(error => {
            console.error("Board error:", error);
        });
}

// to reset the game

function resetGame(key) {
    return fetch(`${BASE_URL}/reset?key=${key}`)
        .then(response => response.text())
        .then(data => {
            console.log("Reset response:", data);
        })
        .catch(error => {
            console.error("Reset error:", error);
        });
}




