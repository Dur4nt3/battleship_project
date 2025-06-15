import Board from '../gameLogic/board';

describe('Tests for Board class', () => {
    let gameBoard;

    // Initialize gameBoard before every test (fresh object)
    beforeEach(() => {
        gameBoard = new Board();
    });

    test('Can create instance of Board', () => {
        expect(gameBoard instanceof Board).toBeTruthy();
    });

    test('Instances are constructed with the correct properties and values', () => {
        expect(gameBoard).toEqual({
            grid: [
                [true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true, true, true, true],
            ],
        });
    });

    test('Can validate that a given array is a valid index pair on the grid', () => {
        expect.assertions(6);

        expect(Board.isValidIndexPair([8, 5])).toBeTruthy();

        // Out of board range
        expect(Board.isValidIndexPair([10, 10])).toBeFalsy();
        expect(Board.isValidIndexPair([3, 10])).toBeFalsy();

        // Invalid index pair
        expect(Board.isValidIndexPair([4.5, 6.5])).toBeFalsy();
        expect(Board.isValidIndexPair(['a', 5])).toBeFalsy();
        expect(Board.isValidIndexPair(['1', '5'])).toBeFalsy();
    });

    // An index on the board is a pair of row and column values in the array within the board property
    test('Can translate a coordinate to an index on the board', () => {
        expect(Board.coordinateToIndex('g8')).toEqual([6, 7]);
    });

    test('Can translate an index on the board to a coordinate', () => {
        expect(Board.indexToCoordinate([5, 6])).toBe('f7');
    });

    // Don't use 'toEqual' and try to compare to the target array (board) as a whole
    // This will massively bloat the test suite
    test('Can place ships on the board', () => {
        gameBoard.placeShip('submarine3', [
            [3, 5],
            [4, 5],
            [5, 5],
        ]);

        let submarinePlacement = [
            gameBoard.grid[3][5],
            gameBoard.grid[4][5],
            gameBoard.grid[5][5],
        ];

        // If all elements are equal to 'submarine3' the ship was placed correctly
        submarinePlacement = submarinePlacement.filter(
            (element) => element !== 'submarine3'
        );

        expect(submarinePlacement.length).toBe(0);
    });

    test('Can check whether certain squares on the board are free or occupied', () => {
        expect.assertions(2);

        gameBoard.placeShip('patrol2', [
            [9, 0],
            [9, 1],
        ]);

        gameBoard.placeShip('carrier5', [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
        ]);

        expect(
            gameBoard.isFree([
                [0, 5],
                [0, 6],
                [0, 7],
                [0, 8],
            ])
        ).toBeTruthy();

        expect(
            gameBoard.isFree([
                [0, 1],
                [0, 2],
                [0, 3],
            ])
        ).toBeFalsy();
    });

    test('Can clear a particular ship placement', () => {
        expect.assertions(2);

        gameBoard.placeShip('submarine3', [
            [3, 5],
            [4, 5],
            [5, 5],
        ]);

        gameBoard.placeShip('patrol2', [
            [9, 0],
            [9, 1],
        ]);

        gameBoard.clearPlacement('submarine3');

        let submarinePlacement = [
            gameBoard.grid[3][5],
            gameBoard.grid[4][5],
            gameBoard.grid[5][5],
        ];

        let patrolPlacement = [gameBoard.grid[9][0], gameBoard.grid[9][1]];

        submarinePlacement = submarinePlacement.filter(
            (element) => element === true
        );

        patrolPlacement = patrolPlacement.filter((element) => element === true);

        // Cleared the placement of the submarine
        expect(submarinePlacement.length).toBe(3);

        // Didn't clear the placement of the patrol
        expect(patrolPlacement.length).toBe(0);
    });

    test('Can reset all ship placements', () => {
        const freeSpaces = (grid) => {
            let counter = 0;
            for (const row of grid) {
                for (const square of row) {
                    if (square === true) {
                        counter += 1;
                    }
                }
            }
            return counter;
        };

        gameBoard.placeShip('submarine3', [
            [3, 5],
            [4, 5],
            [5, 5],
        ]);

        gameBoard.placeShip('patrol2', [
            [9, 0],
            [9, 1],
        ]);

        gameBoard.clearAll();

        expect(freeSpaces(gameBoard.grid)).toBe(100);
    });

    test('Can mark a given square as hit or missed', () => {
        gameBoard.placeShip('submarine3', [
            [3, 5],
            [4, 5],
            [5, 5],
        ]);

        gameBoard.placeShip('patrol2', [
            [9, 0],
            [9, 1],
        ]);

        // Hits
        gameBoard.markSquare([3, 5]);
        gameBoard.markSquare([4, 5]);
        gameBoard.markSquare([9, 1]);

        // Misses
        gameBoard.markSquare([9, 2]);
        gameBoard.markSquare([3, 6]);
        gameBoard.markSquare([6, 5]);

        const hitMiss = [
            gameBoard.grid[3][5],
            gameBoard.grid[4][5],
            gameBoard.grid[9][1],
            gameBoard.grid[9][2],
            gameBoard.grid[3][6],
            gameBoard.grid[6][5],
        ];

        expect(hitMiss).toEqual([
            ['submarine3', 'hit'],
            ['submarine3', 'hit'],
            ['patrol2', 'hit'],
            'miss',
            'miss',
            'miss',
        ]);
    });

    test('Can check whether a given square is hit', () => {
        gameBoard.placeShip('carrier5', [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
        ]);

        gameBoard.placeShip('patrol2', [
            [9, 0],
            [9, 1],
        ]);

        gameBoard.markSquare([0, 2]);
        gameBoard.markSquare([9, 2]);

        const hits = [
            // Hit
            gameBoard.isHit([0, 2]),
            // Marked as a miss
            gameBoard.isHit([9, 2]),
            // Not occupied and not missed
            gameBoard.isHit([3, 8]),
            // Occupied but not hit
            gameBoard.isHit([0, 3]),
        ];

        expect(hits).toEqual([true, false, false, false]);
    });

    test('Can check whether a given ship is destroyed', () => {
        gameBoard.placeShip('carrier5', [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
        ]);

        gameBoard.placeShip('submarine3', [
            [3, 5],
            [4, 5],
            [5, 5],
        ]);

        gameBoard.placeShip('patrol2', [
            [9, 0],
            [9, 1],
        ]);

        gameBoard.markSquare([9, 0]);
        gameBoard.markSquare([9, 1]);

        gameBoard.markSquare([3, 5]);
        gameBoard.markSquare([4, 5]);

        const shipsDestroyed = [
            // Patrol - Destroyed
            gameBoard.isShipDestroyed('patrol2'),
            // Submarine - Partially Destroyed
            gameBoard.isShipDestroyed('submarine3'),
            // Carrier - Not Hit
            gameBoard.isShipDestroyed('carrier5'),
        ];

        expect(shipsDestroyed).toEqual([true, false, false]);
    });

    test('Can check whether all ships are destroyed', () => {
        expect.assertions(2);

        gameBoard.placeShip('carrier5', [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
        ]);

        gameBoard.placeShip('battleship4', [
            [1, 0],
            [1, 1],
            [1, 2],
            [1, 3],
        ]);

        gameBoard.placeShip('destroyer3', [
            [3, 6],
            [4, 6],
            [5, 6],
        ]);

        gameBoard.placeShip('submarine3', [
            [3, 5],
            [4, 5],
            [5, 5],
        ]);

        gameBoard.placeShip('patrol2', [
            [9, 0],
            [9, 1],
        ]);

        gameBoard.markSquare([3, 5]);
        gameBoard.markSquare([4, 5]);
        gameBoard.markSquare([5, 5]);

        gameBoard.markSquare([9, 0]);
        gameBoard.markSquare([9, 1]);

        expect(gameBoard.allDestroyed()).toBeFalsy();

        gameBoard.markSquare([3, 6]);
        gameBoard.markSquare([4, 6]);
        gameBoard.markSquare([5, 6]);

        gameBoard.markSquare([0, 0]);
        gameBoard.markSquare([0, 1]);
        gameBoard.markSquare([0, 2]);
        gameBoard.markSquare([0, 3]);
        gameBoard.markSquare([0, 4]);

        gameBoard.markSquare([1, 0]);
        gameBoard.markSquare([1, 1]);
        gameBoard.markSquare([1, 2]);
        gameBoard.markSquare([1, 3]);

        expect(gameBoard.allDestroyed()).toBeTruthy();
    });

    test('Can check for all possible placements for a ship', () => {
        expect.assertions(2);

        let rowsAndColumns = [];
        let possiblePlacements = gameBoard.getSuitablePlacements(
            'carrier5',
            'h'
        );
        for (const placement of possiblePlacements) {
            const coordinate = Board.indexToCoordinate(placement);
            if (!rowsAndColumns.includes(coordinate[0])) {
                rowsAndColumns.push(coordinate[0]);
            }

            if (!rowsAndColumns.includes(coordinate.slice(1))) {
                rowsAndColumns.push(coordinate.slice(1));
            }
        }

        // Squares available should be [a-j][1-6]
        expect(rowsAndColumns).toEqual([
            'a',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
        ]);

        // Occupying all possible placements for the carrier on row 'a'
        gameBoard.placeShip('carrier5', [
            [0, 3],
            [0, 4],
            [0, 5],
            [0, 6],
            [0, 7],
        ]);

        gameBoard.placeShip('destroyer3', [
            [1, 3],
            [1, 4],
            [1, 5],
        ]);

        gameBoard.placeShip('patrol2', [
            [1, 6],
            [1, 7],
        ]);

        rowsAndColumns = [];
        possiblePlacements = gameBoard.getSuitablePlacements(
            'battleship4',
            'h'
        );
        for (const placement of possiblePlacements) {
            const coordinate = Board.indexToCoordinate(placement);
            if (!rowsAndColumns.includes(coordinate[0])) {
                rowsAndColumns.push(coordinate[0]);
            }

            if (!rowsAndColumns.includes(coordinate.slice(1))) {
                rowsAndColumns.push(coordinate.slice(1));
            }
        }

        // Squares available should be [c-j][1-7]
        expect(rowsAndColumns).toEqual([
            'c',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
        ]);
    });

    test.todo('Can randomly place all ships on the grid');
});
