export default class Board {
    static #shipTypes = [
        'carrier5',
        'battleship4',
        'destroyer3',
        'submarine3',
        'patrol2',
    ];

    constructor() {
        // Multi-dimensional array that includes 10 array of length 10
        this.grid = Array.from({ length: 10 }).map(() =>
            Array.from({ length: 10 }).map(() => true)
        );
    }

    // Gives the ability to execute a callback on each square
    #callbackOnSquares(callback, ...additionalArgs) {
        for (const rowIndex in this.grid) {
            const row = this.grid[rowIndex];
            for (const squareIndex in row) {
                callback(rowIndex, squareIndex, ...additionalArgs);
            }
        }
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
    static coordinateToIndex(coordinate) {
        return [coordinate.charCodeAt(0) - 97, Number(coordinate.slice(1)) - 1];
    }

    static indexToCoordinate(indexPair) {
        return `${String.fromCharCode(indexPair[0] + 97)}${indexPair[1] + 1}`;
    }

    // Given a ship's size, alignment and starting square
    // extracts all squares the ship will be placed on
    // Returns a collection of indices
    static extractRange(size, alignment, startSquare) {
        let currentSquare = startSquare;
        const range = [startSquare];
        let traverse = size - 1;

        while (traverse > 0) {
            if (alignment === 'v') {
                currentSquare = [currentSquare[0] + 1, currentSquare[1]];
            } else {
                currentSquare = [currentSquare[0], currentSquare[1] + 1];
            }

            range.push(currentSquare);
            traverse -= 1;
        }

        return range;
    }

    // NOTE: the indices SHOULD be free spaces
    placeShip(type, indices) {
        for (const indexPair of indices) {
            this.grid[indexPair[0]][indexPair[1]] = type;
        }
    }

    // Returns an object that includes the locations of all ships on the board
    // Depending on the state of the board the return value might not include all ships
    // The return value IS NOT a valid PlacementInfo object
    // SHOULD NOT be used once a game has started
    getCurrentPlacements() {
        const placements = {
            carrier5: [],
            battleship4: [],
            destroyer3: [],
            submarine3: [],
            patrol2: [],
        };

        const addPlacement = (rowIndex, squareIndex) => {
            const square = this.grid[rowIndex][squareIndex];
            if (square !== true) {
                placements[square].push([
                    Number(rowIndex),
                    Number(squareIndex),
                ]);
            }
        };

        this.#callbackOnSquares(addPlacement);

        return placements;
    }

    // Returns an array of all occupied squares
    // The list returned DOES NOT use the correct format for index pairs
    // The aforementioned pairs are converted to strings for easy comparison
    // SHOULD NOT be used once a game has started
    #occupiedSquares() {
        const occupied = [];

        const addOccupied = (rowIndex, squareIndex) => {
            const square = this.grid[rowIndex][squareIndex];
            if (square !== true) {
                occupied.push(
                    JSON.stringify([Number(rowIndex), Number(squareIndex)])
                );
            }
        };

        this.#callbackOnSquares(addOccupied);

        return occupied;
    }

    // Returns true if all indices are 'true' on the grid
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

    // Remove all instances of the ship from the board
    // SHOULD NOT be used once a game has started
    clearPlacement(type) {
        const clear = (rowIndex, squareIndex) => {
            const square = this.grid[rowIndex][squareIndex];
            if (square === type) {
                this.grid[rowIndex][squareIndex] = true;
            }
        };

        this.#callbackOnSquares(clear);
    }

    // Remove all ships from the board
    // SHOULD NOT be used once a game has started
    clearAll() {
        const clear = (rowIndex, squareIndex) => {
            this.grid[rowIndex][squareIndex] = true;
        };

        this.#callbackOnSquares(clear);
    }

    // Marks a square (given as an index pair) with hit or miss
    // Hit squares are arrays with the following structure '[ship type, hit]'
    markSquare(indexPair) {
        const squareVal = this.grid[indexPair[0]][indexPair[1]];
        if (squareVal === true) {
            this.grid[indexPair[0]][indexPair[1]] = 'miss';
        } else {
            this.grid[indexPair[0]][indexPair[1]] = [squareVal, 'hit'];
        }
    }

    // Returns whether the square is hit, missed, or untouched (free or occupied but not hit)
    // Doesn't reveal information on whether or not the given square is occupied by a ship
    squareState(indexPair) {
        if (this.grid[indexPair[0]][indexPair[1]] === 'miss') {
            return 'miss';
        }
        // Only squares that include a hit ship are converted to an array with the second element indicating a hit
        if (
            Array.isArray(this.grid[indexPair[0]][indexPair[1]]) &&
            this.grid[indexPair[0]][indexPair[1]][1] === 'hit'
        ) {
            return 'hit';
        }
        return null;
    }

    // Checks whether a given ship is destroyed
    isShipDestroyed(type) {
        let count = 0;

        // Get the number of squares that the ship is occupying that aren't hit
        const updateNoHitCount = (rowIndex, squareIndex) => {
            const square = this.grid[rowIndex][squareIndex];
            if (square === type) {
                count += 1;
            }
        };

        this.#callbackOnSquares(updateNoHitCount);

        // Because occupied squares that have been hit are converted to an array
        // If a single occurrence of the ship type is not enclosed within this means that ship wasn't fully destroyed
        return count === 0;
    }

    // Given a destroyed ship
    // Return the squares the ship is placed on
    // Should only be used on ships that are confirmed to be destroyed
    getDestroyedLocation(type) {
        const location = [];

        const logLocation = (rowIndex, squareIndex) => {
            const square = this.grid[rowIndex][squareIndex];
            if (Array.isArray(square)) {
                if (square[0] === type) {
                    location.push([Number(rowIndex), Number(squareIndex)]);
                }
            }
        };

        this.#callbackOnSquares(logLocation);

        return location;
    }

    allDestroyed() {
        let hitCount = 0;

        const updateHitCount = (rowIndex, squareIndex) => {
            const square = this.grid[rowIndex][squareIndex];
            if (Array.isArray(square)) {
                if (square[1] === 'hit') {
                    hitCount += 1;
                }
            }
        };

        this.#callbackOnSquares(updateHitCount);

        // 17 squares are occupied by ships
        // If there are 17 squares that are hit => all ships are destroyed
        return hitCount === 17;
    }

    // Returns an object what moves are already exhausted on a target board
    exhaustedMoves() {
        const moveLog = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
        };

        const updateMoves = (rowIndex, squareIndex) => {
            const indexPair = [Number(rowIndex), Number(squareIndex)];
            if (this.squareState(indexPair) !== null) {
                moveLog[indexPair[0]].push(indexPair[1]);
            }
        };

        this.#callbackOnSquares(updateMoves);

        return moveLog;
    }

    getSinkLog() {
        const notSunk = [];
        const sinkLog = {
            carrier5: false,
            battleship4: false,
            destroyer3: false,
            submarine3: false,
            patrol2: false,
        };

        const updateSinkLog = (rowIndex, squareIndex) => {
            const indexPair = [Number(rowIndex), Number(squareIndex)];
            if (this.squareState(indexPair) === 'hit') {
                const [shipType] = this.grid[indexPair[0]][indexPair[1]];
                if (!notSunk.includes(shipType)) {
                    if (this.isShipDestroyed(shipType)) {
                        if (Array.isArray(sinkLog[shipType])) {
                            sinkLog[shipType].push(indexPair);
                        } else {
                            sinkLog[shipType] = [indexPair];
                        }
                    } else {
                        notSunk.push(shipType);
                    }
                }
            }
        };

        this.#callbackOnSquares(updateSinkLog);

        return sinkLog;
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
    // NOTE: the return value is an array of all possible starting squares for the ship given the current grid configuration
    // Can use the "extractRange" static method to get the exact indices to place the ship on
    getSuitablePlacements(type, alignment) {
        // Valid types always have their size as the last character
        const shipSize = Number(type[type.length - 1]);
        const occupiedSquares = this.#occupiedSquares();
        const possiblePlacements = [];

        const addPossiblePlacements = (rowIndex, squareIndex) => {
            const square = this.grid[rowIndex][squareIndex];
            // Only perform the check on free spaces
            if (square === true) {
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
        };

        this.#callbackOnSquares(addPossiblePlacements);

        return possiblePlacements;
    }

    // Gets a ship type, returns a set of indices on which the ship can be placed on
    randomlyPlaceShips() {
        for (const ship of Board.#shipTypes) {
            const size = Number(ship[ship.length - 1]);
            // Randomly select the alignment
            const alignment =
                // eslint-disable-next-line @stylistic/no-mixed-operators
                Math.floor(Math.random() * 2 + 1) === 1 ? 'v' : 'h';

            // All suitable placements for the ship
            const suitablePlacements = this.getSuitablePlacements(
                ship,
                alignment
            );

            // Randomly select a placement
            const selectedPlacement =
                suitablePlacements[
                    Math.floor(Math.random() * suitablePlacements.length)
                ];

            // Get the indices
            const placementRange = Board.extractRange(
                size,
                alignment,
                selectedPlacement
            );

            this.placeShip(ship, placementRange);
        }
    }
}
