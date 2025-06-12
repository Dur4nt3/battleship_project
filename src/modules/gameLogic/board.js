export default class Board {
    constructor() {
        this.grid = Array.from({ length: 10 }).map(() =>
            Array.from({ length: 10 }).map(() => true)
        );
    }

    // Check if a given index pair can represent a square on the grid
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

    // Translates a given algebraic notation to an index on the board
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

    // Marks a square with hit or miss
    // Hit squares are arrays with the following structure '[ship type, hit]'

    // Returns true if a given square is hit
    // Expect a valid index pair
}
