
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

    cell.addEventListener("click", function () {
        const x = cell.dataset.x;
        const y = cell.dataset.y;
        cell.textContent = playerTile;
        console.log("Tile:", playerTile);
        console.log("Clicked:", x, y);

        move(gameKey, playerTile, y, x); 

    });

});

}


function syncBoard(key) {  // responsible for syncing the board 
    setInterval(function () {
        getBoard(key);
    }, 1000);
}



