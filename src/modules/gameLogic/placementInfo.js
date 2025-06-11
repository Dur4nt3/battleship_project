export default class PlacementInfo {
    static #shipTypes = [
        'carrier5',
        'battleship4',
        'destroyer3',
        'submarine3',
        'patrol2',
    ];

    constructor() {
        this.carrier5 = null;
        this.battleship4 = null;
        this.destroyer3 = null;
        this.submarine3 = null;
        this.patrol2 = null;
    }

    // Ship sizes must be an integer between 2 and 5 (including)
    static isValidShipSize(size) {
        if (size < 2 || size > 5 || !Number.isInteger(size)) {
            return false;
        }
        return true;
    }

    // ship type must be equal to one of the properties created in the instance
    static isValidShipType(type) {
        return PlacementInfo.#shipTypes.includes(type);
    }

    // Checks whether a string is a valid coordinates on a 10x10 board
    // A valid coordinate is a string where
    // 1) the first character is any letter between 'a' and 'j'
    // 2) the remainder is any number between 1 and 10
    static isValidCoordinate(string) {
        const coordinateChar = string.charCodeAt(0);
        const coordinateNum = Number(string.slice(1));

        return (
            coordinateChar >= 97 &&
            coordinateChar <= 106 &&
            !Number.isNaN(coordinateNum) &&
            Number.isInteger(coordinateNum) &&
            coordinateNum >= 1 &&
            coordinateNum <= 10
        );
    }

    // Checks whether a given placement (alignment, size, start and finish squares) is valid
    static isValidPlacement(size, alignment, squareRange) {
        const modifier = size - 1;

        // Character persists, number changes
        if (alignment === 'h') {
            return (
                Number(squareRange[0].slice(1)) + modifier ===
                    Number(squareRange[1].slice(1)) &&
                squareRange[0][0] === squareRange[1][0]
            );
        }
        // Number persists, character changes
        if (alignment === 'v') {
            return (
                squareRange[0].charCodeAt(0) + modifier ===
                    squareRange[1].charCodeAt(0) &&
                squareRange[0].slice(1) === squareRange[1].slice(1)
            );
        }

        return false;
    }

    // Extracts all the squares from a given range
    static #extractRange(squareRange) {
        const squares = [];
        let [currentSquare] = squareRange;

        // Vertical alignment
        if (squareRange[0][0] !== squareRange[1][0]) {
            while (currentSquare !== squareRange[1]) {
                squares.push(currentSquare);
                // Move one character up
                currentSquare =
                    String.fromCharCode(currentSquare[0].charCodeAt(0) + 1) +
                    currentSquare.slice(1);
            }
            squares.push(currentSquare);
        } else {
            while (currentSquare !== squareRange[1]) {
                squares.push(currentSquare);
                // Move one number up
                currentSquare =
                    currentSquare[0] + (Number(currentSquare.slice(1)) + 1);
            }
            squares.push(currentSquare);
        }
        return squares;
    }

    // Checks whether or not a given square range is free (i.e., a ship can be place in that range)
    isFree(squareRange) {
        const occupiedSquares = [];
        const targetSquares = PlacementInfo.#extractRange(squareRange);
        for (const ship in this) {
            if (this[ship] !== null) {
                occupiedSquares.push(...this[ship].squares);
            }
        }

        for (const square of targetSquares) {
            if (occupiedSquares.includes(square)) {
                return false;
            }
        }

        return true;
    }

    // Sets the given placement on the instance
    setPlacement(type, alignment, squareRange) {
        this[type] = {
            alignment,
            squares: PlacementInfo.#extractRange(squareRange),
        };
    }

    // Reverts all placements to null
    clear() {
        for (const ship in this) {
            this[ship] = null;
        }
    }
}
