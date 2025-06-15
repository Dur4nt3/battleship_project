export default class Board {
    constructor() {
        // Multi-dimensional array that includes 10 array of length 10
        this.grid = Array.from({ length: 10 }).map(() =>
            Array.from({ length: 10 }).map(() => true)
        );
    }

    // Check if a given index pair can represent a square on the 10x10 grid
    static isValidIndexPair(indexPair) {
        if (
            !Number.isInteger(indexPair[0]) ||
            !Number.isInteger(indexPair[1])
        ) {
            return false;
        }

        return (
            indexPair[0] >= 0 &&
            indexPair[0] <= 9 &&
            indexPair[1] >= 0 &&
            indexPair[1] <= 9
        );
    }

    // Translates a given coordinate to an index on the board
    // Return value is an array of two numbers (0-9)
    // The first value is the row, the second is the column
    // Coordinate is assumed to be valid and can be validated through 'PlacementInfo.isValidCoordinate'
    static coordinateToIndex(coordinate) {
        return [coordinate.charCodeAt(0) - 97, Number(coordinate.slice(1)) - 1];
    }

    static indexToCoordinate(indexPair) {
        return `${String.fromCharCode(indexPair[0] + 97)}${indexPair[1] + 1}`;
    }

    // Expects type and indices to be valid (which can be done through 'PlacementInfo' methods and the methods above)
    // Furthermore, expects the indices to NOT override occupied spaces
    placeShip(type, indices) {
        for (const indexPair of indices) {
            this.grid[indexPair[0]][indexPair[1]] = type;
        }
    }

    // Returns an array of all occupied squares
    // The list returned DOES NOT use the correct format for index pairs
    // The aforementioned pairs are converted to strings for easy comparison
    // SHOULD NOT be used once a game has started
    #occupiedSquares() {
        const occupied = [];

        for (const rowNum in this.grid) {
            const row = this.grid[rowNum];
            for (const squareIndex in row) {
                const square = row[squareIndex];
                if (square !== true) {
                    occupied.push(
                        JSON.stringify([Number(rowNum), Number(squareIndex)])
                    );
                }
            }
        }

        return occupied;
    }

    // Returns true if all indices are 'true' on the grid
    // Expects indices to be valid
    // SHOULD NOT be used once a game has started
    isFree(indices) {
        const occupied = this.#occupiedSquares();
        for (const indexPair of indices) {
            if (occupied.includes(JSON.stringify(indexPair))) {
                return false;
            }
        }

        return true;
    }

    // Receive a ship type (assumed to valid, can be validated through "PlacementInfo.isValidShipType")
    // Remove all instances of the ship from the board
    // SHOULD NOT be used once a game has started
    clearPlacement(type) {
        for (const row of this.grid) {
            for (const squareIndex in row) {
                if (row[squareIndex] === type) {
                    row[squareIndex] = true;
                }
            }
        }
    }

    // Remove all ships from the board
    // SHOULD NOT be used once a game has started
    clearAll() {
        for (const row of this.grid) {
            for (const squareIndex in row) {
                row[squareIndex] = true;
            }
        }
    }

    // Marks a square (given as an index pair) with hit or miss
    // Expects the given index pair to be valid
    // Hit squares are arrays with the following structure '[ship type, hit]'
    markSquare(indexPair) {
        const squareVal = this.grid[indexPair[0]][indexPair[1]];
        if (squareVal === true) {
            this.grid[indexPair[0]][indexPair[1]] = 'miss';
        } else {
            this.grid[indexPair[0]][indexPair[1]] = [squareVal, 'hit'];
        }
    }

    // Returns true if a given square is hit
    // Expect a valid index pair
    isHit(indexPair) {
        // Only occupied squares that have been hit may be an array
        return (
            Array.isArray(this.grid[indexPair[0]][indexPair[1]]) &&
            this.grid[indexPair[0]][indexPair[1]][1] === 'hit'
        );
    }

    // Checks whether a given ship is destroyed
    // Expects a valid ship type
    isShipDestroyed(type) {
        let count = 0;
        for (const row of this.grid) {
            for (const square of row) {
                if (square === type) {
                    count += 1;
                }
            }
        }

        // Because occupied squares that have been hit are converted to an array
        // If a single occurrence of the ship type is not enclosed within this means that ship wasn't fully destroyed
        return count === 0;
    }

    allDestroyed() {
        let hitCount = 0;

        for (const row of this.grid) {
            for (const square of row) {
                if (Array.isArray(square)) {
                    if (square[1] === 'hit') {
                        hitCount += 1;
                    }
                }
            }
        }

        // 17 squares are occupied by ships
        // If there are 17 squares that are hit => all ships are destroyed
        return hitCount === 17;
    }

    // Checks if a ship can be place on the grid starting from a given square and a given alignment
    // NOTE: 'startSquare' is always valid and free:
    // 1) its pulled directly from the grid via the loop in 'getSuitablePlacements' => VALID
    // 2) Execution of this private method isn't possible unless the square is free => FREE
    static #isValidPlacement(startSquare, size, alignment, occupiedSquares) {
        let currentSquare = startSquare;
        let traverse = size - 1;
        const range = [startSquare];
        while (traverse > 0) {
            if (alignment === 'v') {
                currentSquare = [currentSquare[0] + 1, currentSquare[1]];
            } else {
                currentSquare = [currentSquare[0], currentSquare[1] + 1];
            }

            // Square is valid and free
            if (
                Board.isValidIndexPair(currentSquare) &&
                !occupiedSquares.includes(JSON.stringify(currentSquare))
            ) {
                range.push(currentSquare);
            }
            traverse -= 1;
        }

        // Are there are enough valid and free spaces to accommodate the ship
        return range.length === size;
    }

    // Gets all suitable locations to place a ship on the grid
    // Expects a valid type and alignment
    getSuitablePlacements(type, alignment) {
        // Valid types always have their size as the last character
        const shipSize = Number(type[type.length - 1]);
        const occupiedSquares = this.#occupiedSquares();
        const possiblePlacements = [];

        // Iterate through the entire grid
        for (const rowIndex in this.grid) {
            const row = this.grid[rowIndex];
            for (const squareIndex in row) {
                const square = row[squareIndex];

                // Skip occupied squares
                if (square !== true) {
                    continue;
                }

                if (
                    Board.#isValidPlacement(
                        [Number(rowIndex), Number(squareIndex)],
                        shipSize,
                        alignment,
                        occupiedSquares
                    )
                ) {
                    possiblePlacements.push([
                        Number(rowIndex),
                        Number(squareIndex),
                    ]);
                }
            }
        }

        return possiblePlacements;
    }
}
