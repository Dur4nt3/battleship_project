export default class PCPlay {
    // Returns the index of the latest hit within a given log
    // 'upperBound' determines how 'recent' the hit should be
    static findRecentHit(log, upperBound = null) {
        upperBound = upperBound === null ? log.length - 1 : upperBound;
        for (let i = upperBound; i >= 0; i -= 1) {
            if (log[i][1] === 'hit') {
                return i;
            }
        }
        return null;
    }

    // Determines whether or not a square is a part of an already destroyed ship
    static inSinkRange(sinkLog, square) {
        for (const ship in sinkLog) {
            // This means the ship is indeed destroyed
            if (sinkLog[ship] !== false) {
                for (const sinkSquare of sinkLog[ship]) {
                    if (JSON.stringify(sinkSquare) === JSON.stringify(square)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Returns the name of the largest ship that isn't destroyed
    static largestNotDestroyed(sinkLog) {
        let type = null;
        let size = 0;
        for (const ship in sinkLog) {
            const tempSize = Number(ship[ship.length - 1]);
            // This means the ship wasn't destroyed
            if (sinkLog[ship] === false) {
                if (tempSize > size) {
                    size = tempSize;
                    type = ship;
                }
            }
        }

        return type;
    }

    // Marks a grid with the moves already performed
    static #markGrid(grid, movesPerformed) {
        for (const rowIndex in grid) {
            const rowNum = Number(rowIndex);
            const row = grid[rowIndex];
            for (const squareIndex in row) {
                const squareNum = Number(squareIndex);
                if (movesPerformed[rowNum].includes(squareNum)) {
                    // Mark the square as already targeted
                    grid[rowNum][squareNum] = false;
                }
            }
        }

        return grid;
    }

    // Given a marked grid, a ship size, a potential alignment and a target square
    // Determines whether the target square can serve as the start square for a target ship
    // If the above is true, this constitutes as a 'potential' move
    static #isPotentialMove(markedGrid, startSquare, size, alignment) {
        // The starting square is always a potential target
        // Therefore, there is no need to check it
        let currentSquare = startSquare;
        let traverse = size - 1;

        while (traverse > 0) {
            if (alignment === 'v') {
                currentSquare = [currentSquare[0] + 1, currentSquare[1]];
            } else {
                currentSquare = [currentSquare[0], currentSquare[1] + 1];
            }

            const squareOnGrid = markedGrid[currentSquare[0]][currentSquare[1]];

            // Already marked or out of range
            if (squareOnGrid === false || squareOnGrid === undefined) {
                return false;
            }

            traverse -= 1;
        }

        return true;
    }

    // Return the index pair that was determined as a 'potential move'
    // NOTE: This function should only be executed when all hit ships are fully destroyed
    // Use 'nextMove' if a ship was hit yet not destroyed
    static newMove(movesPerformed, largestStanding, emptyBoard) {
        const markedGrid = PCPlay.#markGrid(emptyBoard.grid, movesPerformed);
        const standingSize = Number(
            largestStanding[largestStanding.length - 1]
        );

        for (const rowIndex in markedGrid) {
            const rowNum = Number(rowIndex);
            const row = markedGrid[rowIndex];
            for (const squareIndex in row) {
                const squareNum = Number(squareIndex);
                const indexPair = [rowNum, squareNum];
                // A move wasn't performed on this square
                if (markedGrid[rowIndex][squareIndex] === true) {
                    // Can the largest that is still standing fit in that square horizontally?
                    if (
                        PCPlay.#isPotentialMove(
                            markedGrid,
                            indexPair,
                            standingSize,
                            'h'
                        )
                    ) {
                        return indexPair;
                    }
                    // What about vertically?
                    if (
                        PCPlay.#isPotentialMove(
                            markedGrid,
                            indexPair,
                            standingSize,
                            'v'
                        )
                    ) {
                        return indexPair;
                    }
                }
            }
        }
    }
}
