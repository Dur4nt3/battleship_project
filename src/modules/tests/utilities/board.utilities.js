export function placeShips(board, ...type) {
    if (type.includes('carrier5')) {
        board.placeShip('carrier5', [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
        ]);
    }

    if (type.includes('battleship4')) {
        board.placeShip('battleship4', [
            [1, 0],
            [1, 1],
            [1, 2],
            [1, 3],
        ]);
    }

    if (type.includes('destroyer3')) {
        board.placeShip('destroyer3', [
            [3, 6],
            [4, 6],
            [5, 6],
        ]);
    }

    if (type.includes('submarine3')) {
        board.placeShip('submarine3', [
            [3, 5],
            [4, 5],
            [5, 5],
        ]);
    }

    if (type.includes('patrol2')) {
        board.placeShip('patrol2', [
            [9, 0],
            [9, 1],
        ]);
    }
}
