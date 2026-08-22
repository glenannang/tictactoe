function getCurrentTurn(boardData) { // returns an X or O
    const board = boardData.split(":");

    let xCount = 0;
    let oCount = 0;

    board.forEach(cell => {
        if (cell === "X") {
            xCount++;
        }

        if (cell === "O") {
            oCount++;
        }
    });

    if (xCount === oCount) {
        return "X";
    }

    return "O";
}

function checkWinner(data){ // returns X or O

    
    const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
    ];

    const parts = data.split(":");

    // Invalid response: not enough cells for a board
    if (parts.length < 9) {
        return null;
    }

    const board = parts.slice(0, 9);

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            console.log("Winning combination:", combination);
            console.log("Winning tile:", board[a]);
            return board[a]; // returns X or O
        }
    }
    return null;

}

function checkDraw(data) {
    console.log("checkDraw received:", data);
    const parts = data.split(":");

    
    if (parts.length < 9) { //since data can return [Game not yet started] instead of baord data
        return false;
    }

    const board = parts.slice(0, 9); // Only consider the first 9 elements for the board

    // If someone won, it's not a draw
    if (checkWinner(data) !== null) {
        console.log("Not draw: someone won");
        return false;
    }

    // If there's still an empty cell, game isn't finished
    for (const cell of board) {
        if (cell === "") {
            console.log("There is still an empty cell:");
            return false;
        }
    }

    // Board is full + no winner
    console.log("A draw has occurred.");
    return true;
}

function waitForGameToStart(key) {

    async function check() {
        const status = await checkGame(key);

        if (status === "true") {
            waitingInterval = null;
            game();
            return;
        }

        waitingInterval = setTimeout(check, 1000);
    }

    check();
}

function showGameMessage(message) {
    const gameMessage = document.getElementById("gameMessage");
    gameMessage.textContent = message;
}

function generateGameKey() {
    return crypto.randomUUID();
}