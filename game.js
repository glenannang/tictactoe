
function game(){
    let currentPlayer = null;
    board();
    

}



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


function checkWinner(data){

    const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]
    ];

    const board = data.split(":");

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