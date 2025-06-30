export function playForBoth(gameObj, indexPair) {
    gameObj.playTurn(indexPair);
    gameObj.logTurn(indexPair);
    gameObj.playTurn(indexPair);
    gameObj.logTurn(indexPair);
}

// Both player and PC attack the carrier
export function initialHits(gameObj) {
    gameObj.playTurn([0, 1]);
    gameObj.logTurn([0, 1]);
    gameObj.playTurn([0, 1]);
    gameObj.logTurn([0, 1]);
}

export function initialMisses(gameObj) {
    gameObj.playTurn([7, 0]);
    gameObj.logTurn([7, 0]);
    gameObj.playTurn([7, 0]);
    gameObj.logTurn([7, 0]);
}

// NOTE: 'currentTurn' will remain the same
export function addMisses(gameObj) {
    gameObj.playTurn([8, 0]);
    gameObj.logTurn([8, 0]);
    gameObj.playTurn([8, 0]);
    gameObj.logTurn([8, 0]);

    gameObj.playTurn([8, 1]);
    gameObj.logTurn([8, 1]);
    gameObj.playTurn([8, 1]);
    gameObj.logTurn([8, 1]);

    gameObj.playTurn([8, 2]);
    gameObj.logTurn([8, 2]);
    gameObj.playTurn([8, 2]);
    gameObj.logTurn([8, 2]);
}

// Destroys the specified ship type for both the player and the opponent
// NOTE: expects a new gameObj (i.e., no turns played)
export function destroyShip(gameObj, ...type) {
    if (type.includes('carrier5')) {
        gameObj.playTurn([0, 0]);
        gameObj.logTurn([0, 0]);
        gameObj.playTurn([0, 0]);
        gameObj.logTurn([0, 0]);

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
    }

    if (type.includes('battleship4')) {
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
    }

    if (type.includes('destroyer3')) {
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
    }

    if (type.includes('submarine3')) {
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
    }

    if (type.includes('patrol2')) {
        gameObj.playTurn([9, 0]);
        gameObj.logTurn([9, 0]);
        gameObj.playTurn([9, 0]);
        gameObj.logTurn([9, 0]);

        gameObj.playTurn([9, 1]);
        gameObj.logTurn([9, 1]);
        gameObj.playTurn([9, 1]);
        gameObj.logTurn([9, 1]);
    }
}

export function hitAllHorizontalCarrier(gameObj) {
    playForBoth(gameObj, [1, 0]);
    playForBoth(gameObj, [1, 1]);
    playForBoth(gameObj, [1, 2]);
    playForBoth(gameObj, [1, 3]);
    playForBoth(gameObj, [1, 4]);
    playForBoth(gameObj, [1, 5]);

    playForBoth(gameObj, [2, 0]);
    playForBoth(gameObj, [2, 1]);
    playForBoth(gameObj, [2, 2]);
    playForBoth(gameObj, [2, 3]);
    playForBoth(gameObj, [2, 4]);
    playForBoth(gameObj, [2, 5]);

    playForBoth(gameObj, [3, 0]);
    playForBoth(gameObj, [3, 1]);
    playForBoth(gameObj, [3, 2]);
    playForBoth(gameObj, [3, 3]);
    playForBoth(gameObj, [3, 4]);
    playForBoth(gameObj, [3, 5]);

    playForBoth(gameObj, [4, 0]);
    playForBoth(gameObj, [4, 1]);
    playForBoth(gameObj, [4, 2]);
    playForBoth(gameObj, [4, 3]);
    playForBoth(gameObj, [4, 4]);
    playForBoth(gameObj, [4, 5]);

    playForBoth(gameObj, [5, 0]);
    playForBoth(gameObj, [5, 1]);
    playForBoth(gameObj, [5, 2]);
    playForBoth(gameObj, [5, 3]);
    playForBoth(gameObj, [5, 4]);
    playForBoth(gameObj, [5, 5]);

    playForBoth(gameObj, [6, 0]);
    playForBoth(gameObj, [6, 1]);
    playForBoth(gameObj, [6, 2]);
    playForBoth(gameObj, [6, 3]);
    playForBoth(gameObj, [6, 4]);
    playForBoth(gameObj, [6, 5]);

    playForBoth(gameObj, [7, 0]);
    playForBoth(gameObj, [7, 1]);
    playForBoth(gameObj, [7, 2]);
    playForBoth(gameObj, [7, 3]);
    playForBoth(gameObj, [7, 4]);
    playForBoth(gameObj, [7, 5]);

    playForBoth(gameObj, [8, 0]);
    playForBoth(gameObj, [8, 1]);
    playForBoth(gameObj, [8, 2]);
    playForBoth(gameObj, [8, 3]);
    playForBoth(gameObj, [8, 4]);
    playForBoth(gameObj, [8, 5]);

    playForBoth(gameObj, [9, 0]);
    playForBoth(gameObj, [9, 1]);
    playForBoth(gameObj, [9, 2]);
    playForBoth(gameObj, [9, 3]);
    playForBoth(gameObj, [9, 4]);
    playForBoth(gameObj, [9, 5]);
}
