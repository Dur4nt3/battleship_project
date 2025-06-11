import Board from '../../gameLogic/board';

export function forcePlayerStart(gameObj) {
    jest.spyOn(Math, 'floor').mockReturnValueOnce(1);
    gameObj.startGame();
}

// Creates two boards instances with all ships placed
export function createBoards() {
    const playerBoard = new Board();
    const opponentBoard = new Board();

    playerBoard.placeShip('carrier5', [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
    ]);

    playerBoard.placeShip('battleship4', [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
    ]);

    playerBoard.placeShip('destroyer3', [
        [3, 6],
        [4, 6],
        [5, 6],
    ]);

    playerBoard.placeShip('submarine3', [
        [3, 5],
        [4, 5],
        [5, 5],
    ]);

    playerBoard.placeShip('patrol2', [
        [9, 0],
        [9, 1],
    ]);

    opponentBoard.placeShip('carrier5', [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
    ]);

    opponentBoard.placeShip('battleship4', [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
    ]);

    opponentBoard.placeShip('destroyer3', [
        [3, 6],
        [4, 6],
        [5, 6],
    ]);

    opponentBoard.placeShip('submarine3', [
        [3, 5],
        [4, 5],
        [5, 5],
    ]);

    opponentBoard.placeShip('patrol2', [
        [9, 0],
        [9, 1],
    ]);

    return { playerBoard, opponentBoard };
}

// Puts both the player and the opponent one turn away from winning
// The first player to strike [0,0] (a1) wins
// Player's turn
// DEPENDENT on same the board configuration as 'createBoards'
export function oneTurnFromWin(gameObj) {
    gameObj.playTurn([0, 1]);
    gameObj.logTurn([0, 1]);
    gameObj.playTurn([0, 1]);
    gameObj.logTurn([0, 1]);

    gameObj.playTurn([0, 2]);
    gameObj.logTurn([0, 2]);
    gameObj.playTurn([0, 2]);
    gameObj.logTurn([0, 2]);

    gameObj.playTurn([0, 3]);
    gameObj.logTurn([0, 3]);
    gameObj.playTurn([0, 3]);
    gameObj.logTurn([0, 3]);

    gameObj.playTurn([0, 4]);
    gameObj.logTurn([0, 4]);
    gameObj.playTurn([0, 4]);
    gameObj.logTurn([0, 4]);

    gameObj.playTurn([1, 0]);
    gameObj.logTurn([1, 0]);
    gameObj.playTurn([1, 0]);
    gameObj.logTurn([1, 0]);

    gameObj.playTurn([1, 1]);
    gameObj.logTurn([1, 1]);
    gameObj.playTurn([1, 1]);
    gameObj.logTurn([1, 1]);

    gameObj.playTurn([1, 2]);
    gameObj.logTurn([1, 2]);
    gameObj.playTurn([1, 2]);
    gameObj.logTurn([1, 2]);

    gameObj.playTurn([1, 3]);
    gameObj.logTurn([1, 3]);
    gameObj.playTurn([1, 3]);
    gameObj.logTurn([1, 3]);

    gameObj.playTurn([3, 6]);
    gameObj.logTurn([3, 6]);
    gameObj.playTurn([3, 6]);
    gameObj.logTurn([3, 6]);

    gameObj.playTurn([4, 6]);
    gameObj.logTurn([4, 6]);
    gameObj.playTurn([4, 6]);
    gameObj.logTurn([4, 6]);

    gameObj.playTurn([5, 6]);
    gameObj.logTurn([5, 6]);
    gameObj.playTurn([5, 6]);
    gameObj.logTurn([5, 6]);

    gameObj.playTurn([3, 5]);
    gameObj.logTurn([3, 5]);
    gameObj.playTurn([3, 5]);
    gameObj.logTurn([3, 5]);

    gameObj.playTurn([4, 5]);
    gameObj.logTurn([4, 5]);
    gameObj.playTurn([4, 5]);
    gameObj.logTurn([4, 5]);

    gameObj.playTurn([5, 5]);
    gameObj.logTurn([5, 5]);
    gameObj.playTurn([5, 5]);
    gameObj.logTurn([5, 5]);

    gameObj.playTurn([9, 0]);
    gameObj.logTurn([9, 0]);
    gameObj.playTurn([9, 0]);
    gameObj.logTurn([9, 0]);

    gameObj.playTurn([9, 1]);
    gameObj.logTurn([9, 1]);
    gameObj.playTurn([9, 1]);
    gameObj.logTurn([9, 1]);
}

export function playerWin(gameObj) {
    oneTurnFromWin(gameObj);
    gameObj.playTurn([0,0]);
}