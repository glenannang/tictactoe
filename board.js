
const cells = document.querySelectorAll(".cell");

cells.forEach(function (cell) {

    cell.addEventListener("click", function () {
        cell.textContent = playerTile;
        const x = cell.dataset.x;
        const y = cell.dataset.y;

        console.log("Tile:", playerTile);
        console.log("Clicked:", x, y);

        move(gameKey, playerTile, y, x); 

    });

});






