
function board() {


syncBoard(gameKey); //gameKey is a global variable for now 


const board = document.createElement("div");
board.id = "board";
board.className = "board";

for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
        const cell = document.createElement("button");
        cell.className = "cell";
        cell.dataset.x = x;
        cell.dataset.y = y;
        board.appendChild(cell);
    }
}

document.body.appendChild(board);



// Event Listener for each cell
const cells = document.querySelectorAll(".cell");

cells.forEach(function (cell) {

    cell.addEventListener("click", async function () {
        let boardData = await getBoard(gameKey);
        const currentTurn = getCurrentTurn(boardData);

        if (playerTile !== currentTurn) {
            console.log("Not your turn");
            return;
        }

        const x = cell.dataset.x;
        const y = cell.dataset.y;

       

        console.log("Tile:", playerTile);
        console.log("Clicked:", x, y);

        await move(gameKey, playerTile, y, x); 
        cell.textContent = playerTile;
        boardData = await getBoard(gameKey);
        
       // console.log("Board before winner check:", boardData);
        let winner = checkWinner(boardData); //check if there is a winner already
        console.log(`${winner} won!`);
       



    });

});

}


function syncBoard(key) {  // responsible for syncing the board 
    setInterval(async function () {
        const data = await (getBoard(key));
        displayBoard(data);
        // Update the board every second
    }, 1000);
}




