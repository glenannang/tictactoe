import { gameState } from "../state/gameState.js";
import { checkGame,getBoard,createOrJoinGame,resetGame,move} from "../services/gameService.js";
import {checkWinner,checkDraw,getCurrentTurn} from "./gameRules.js";
import { updateGameDisplay } from "../utils/gameUtils.js";
import { GamePage } from "../pages/GamePage.js";
import {showGameOverModal,showOpponentLeftModal,showOpponentLeftRematchModal,showWaitingForOpponentModal,showGameAlreadyStartedModal} from "../ui/gameModals.js";
import {createGameRecord,getRoomRecord,saveMoveRecord} from "../services/recordService.js";
import { playerId } from "../state/playerState.js";

export async function waitForGameToStart(key,onExit) { //wait until the server says the game has both players and is ready to start
    const room = await getRoomRecord(key);
    const gameIds = room.gameIds || [];

    const previousGameId =
    gameIds.length > 0
        ? gameIds[gameIds.length - 1]
        : null;
    
    async function check() {
        const status = await checkGame(key);
        if (status === "true") {
            gameState.waitingInterval = null;
            game(onExit, previousGameId);
            return;
        }
        gameState.waitingInterval = setTimeout(check, 1000);
    }
    check();
}

//initialize game record for the current game session
async function initializeGameRecord(previousGameId) {
    
    if (gameState.playerTile === "X") {
        const response = await createGameRecord(gameState.gameKey);

        gameState.currentGameId = response.gameId;
        console.log("Created game record:", response.gameId);
        return;
    }

    // Player O waits for player X to create the record.
    for (let attempt = 0; attempt < 20; attempt++) {
        const room = await getRoomRecord(gameState.gameKey);
        const gameIds = room.gameIds || [];
        const latestGameId = gameIds[gameIds.length - 1];

        if (latestGameId && latestGameId !== previousGameId) {
            gameState.currentGameId = latestGameId;
            console.log("Retrieved game record:", latestGameId);
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    throw new Error("Game record was not created.");
}



async function game(onExit,previousGameId = gameState.currentGameId) {
    try {
        await initializeGameRecord(previousGameId);

        const gamePage = new GamePage(onExit, handleCellClick);

        gamePage.render("app");
        gameMonitor(gameState.gameKey, onExit);

    } catch (error) {
        console.error(
            "Failed to initialize game record:",
            error
        );
    }
}

function gameMonitor(key, onExit) {

    async function sync() {

        const gameRoomStatus = await checkGame(key); // check if the game room still exists

        if (gameRoomStatus === "false") { //game room doesn't exist anymore
            clearTimeout(gameState.boardSyncInterval);
            gameState.boardSyncInterval = null;
            showOpponentLeftModal(onExit);
            return;
        }


        // to sync the board
        const data = await getBoard(key);

        // prevents invalid server response from being displayed as board data
        if (data === "[GAME NOT YET STARTED]") {
            gameState.boardSyncInterval = setTimeout(sync, 1000);
            return;
        }
 
        updateGameDisplay(data);

        // Check for winner
        const winner = checkWinner(data);

        if (winner !== null &&!gameState.gameOver) {
            gameState.gameOver = true;
            gameState.finishedBoard = data;
            clearTimeout(gameState.boardSyncInterval);
            gameState.boardSyncInterval = null;

            let message;
            if (winner === gameState.playerTile) {
                message = "YOU WIN!";
            } else {
                message = "YOU LOSE!";
            }


            setTimeout(() => {showGameOverModal( message, () => handlePlayAgain(onExit), onExit);}, 300);
            return;
        }

        // Check for draw
        if ( checkDraw(data) && !gameState.gameOver) {
            gameState.gameOver = true;
            gameState.finishedBoard = data;
            clearTimeout(gameState.boardSyncInterval);
            gameState.boardSyncInterval = null;

            showGameOverModal( "It's a draw!",() => handlePlayAgain(onExit), onExit);
            return;
        }

        gameState.boardSyncInterval = setTimeout(sync, 1000);
    }

    sync();
}

export async function handlePlayAgain(onExit) {
    // prevents duplicate rematch requests
    if (gameState.rematchInProgress) {
        return;
    }

    gameState.rematchInProgress = true;


    try {
        const response = await createOrJoinGame(gameState.gameKey);

        // RESPONSE 1:
        if ( response === "[GAME ALREADY STARTED]") {
            const currentBoard = await getBoard(gameState.gameKey);

            // same old finished game
            if ( currentBoard === gameState.finishedBoard) {
                await resetGame(gameState.gameKey);
                gameState.playerTile = await createOrJoinGame(gameState.gameKey);
                gameState.gameOver = false;
                showWaitingForOpponentModal(onExit);

                waitForGameToStart(gameState.gameKey, onExit);
                return;
            }

            // board changed
            showGameAlreadyStartedModal(onExit);
            return;
        }


        // RESPONSE 2: other player already reset the game
        if (response === "O") {
            gameState.playerTile = "O";
            gameState.gameOver = false;
            game(onExit);
            return;
        }

        // RESPONSE 3: No existing game was found. Create a new room and wait.
        if (response === "X") {
            gameState.playerTile = "X";
            gameState.gameOver = false;
            gameState.finishedBoard = null;

            showOpponentLeftRematchModal(onExit);

            waitForGameToStart(gameState.gameKey, onExit);
            return;
        }

    } catch (error) {
        console.error("Play Again failed:",error);

    } finally {
        gameState.rematchInProgress = false;
    }
}

async function handleCellClick(cell) {

    if (gameState.gameOver ||gameState.moveInProgress) {
        return;}

    gameState.moveInProgress = true;

    try {
        let boardData = await getBoard(gameState.gameKey);

        // Check if game already ended
        const existingWinner = checkWinner(boardData);

        if (existingWinner !== null) {
            gameState.gameOver = true;
            return;
        }

        // Check if it is this player's turn
        const currentTurn = getCurrentTurn(boardData);

        if (gameState.playerTile !== currentTurn) {
            return;
        }

        // Get clicked cell coordinates
        const x = cell.dataset.x;
        const y = cell.dataset.y;

        // Check if cell is already occupied
        const board = boardData.split(":");
        const index = Number(y) * 3 + Number(x); //converts from coordinates to index

        //If cell is occupied
        if (board[index] !== "") {
            return;
        }

        // Send move to server
        await move(gameState.gameKey,gameState.playerTile,y,x);

        //Record the successful move
        await saveMoveRecord({
            gameid: gameState.currentGameId,
            playerid: playerId,
            symbol: gameState.playerTile,
            location: index
        });
        console.log("MOVE DEBUG", {
    room: gameState.gameKey,
    gameId: gameState.currentGameId,
    playerId,
    tile: gameState.playerTile
});

        // Get latest board after the move
        boardData = await getBoard(gameState.gameKey);

        // Update board UI
        updateGameDisplay(boardData);

    } finally {
        gameState.moveInProgress = false;
    }
}


