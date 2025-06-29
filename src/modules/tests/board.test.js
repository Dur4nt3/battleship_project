import Board from '../gameLogic/board';

// NOTE: placements are static
// The test below expect the following placements (in coordinates):
// Carrier: a1-a5 | Battleship: b1-b4 | Destroyer: d7-f7 | Submarine: d6-f6 | Patrol: j1-j2
import { placeShips } from './utilities/board-utilities';

describe('Tests for the Board class', () => {
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
        // For the sake of the test, don't use the 'placeShips' utility function
        // You can use the utility functions in the rest of the tests
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

    test('Can return an object indicating the placements of all ships on the board', () => {
        placeShips(gameBoard, 'patrol2', 'carrier5');

        expect(gameBoard.getCurrentPlacements()).toEqual({
            carrier5: [
                [0, 0],
                [0, 1],
                [0, 2],
                [0, 3],
                [0, 4],
            ],
            battleship4: [],
            destroyer3: [],
            submarine3: [],
            patrol2: [
                [9, 0],
                [9, 1],
            ],
        });
    });

    test('Can check whether certain squares on the board are free or occupied', () => {
        expect.assertions(2);

        placeShips(gameBoard, 'patrol2', 'carrier5');

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
        expect.assertions(3);

        placeShips(gameBoard, 'patrol2', 'submarine3');

        let submarinePlacement = [
            gameBoard.grid[3][5],
            gameBoard.grid[4][5],
            gameBoard.grid[5][5],
        ];

        submarinePlacement = submarinePlacement.filter(
            (element) => element === true
        );

        // Before clearing
        expect(submarinePlacement.length).toBe(0);

        gameBoard.clearPlacement('submarine3');

        // Re-fetching the contents of the squares
        submarinePlacement = [
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
        expect.assertions(2);

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

        placeShips(gameBoard, 'patrol2', 'submarine3');

        // 5 squares are occupied
        expect(freeSpaces(gameBoard.grid)).toBe(95);

        gameBoard.clearAll();

        // all squares should be free
        expect(freeSpaces(gameBoard.grid)).toBe(100);
    });

    test('Can mark a given square as hit or missed', () => {
        placeShips(gameBoard, 'patrol2', 'submarine3');

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

    test('Can fetch the state (hit/miss/untouched) of a square on the board', () => {
        expect.assertions(4);

        placeShips(gameBoard, 'patrol2');

        gameBoard.markSquare([0, 2]);
        gameBoard.markSquare([9, 1]);

        // Empty no hit
        expect(gameBoard.squareState([0, 0])).toBeNull();
        // Occupied no hit
        expect(gameBoard.squareState([9, 0])).toBeNull();
        // Empty and hit
        expect(gameBoard.squareState([0, 2])).toBe('miss');
        // Occupied and hit
        expect(gameBoard.squareState([9, 1])).toBe('hit');
    });

    test('Can check whether a given ship is destroyed', () => {
        placeShips(gameBoard, 'patrol2', 'submarine3', 'carrier5');

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

        placeShips(
            gameBoard,
            'patrol2',
            'submarine3',
            'carrier5',
            'destroyer3',
            'battleship4'
        );

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

    test('Can return the placement of a destroyed ship', () => {
        placeShips(gameBoard, 'destroyer3');

        gameBoard.markSquare([3, 6]);
        gameBoard.markSquare([4, 6]);
        gameBoard.markSquare([5, 6]);

        expect(gameBoard.getDestroyedLocation('destroyer3')).toEqual([
            [3, 6],
            [4, 6],
            [5, 6],
        ]);
    });

    test('Can return an object with all exhausted moves', () => {
        placeShips(gameBoard, 'patrol2', 'submarine3', 'carrier5');

        gameBoard.markSquare([9, 0]);
        gameBoard.markSquare([9, 1]);
        gameBoard.markSquare([3, 5]);
        gameBoard.markSquare([4, 5]);
        gameBoard.markSquare([0, 2]);
        gameBoard.markSquare([0, 3]);
        gameBoard.markSquare([1, 7]);
        gameBoard.markSquare([8, 5]);

        expect(gameBoard.exhaustedMoves()).toEqual({
            0: [2, 3],
            1: [7],
            2: [],
            3: [5],
            4: [5],
            5: [],
            6: [],
            7: [],
            8: [5],
            9: [0, 1],
        });
    });

    test('Can return an object with the location of sunken ships', () => {
        placeShips(gameBoard, 'patrol2', 'submarine3', 'carrier5');

        gameBoard.markSquare([0,0]);
        gameBoard.markSquare([0,1]);
        gameBoard.markSquare([0,2]);
        gameBoard.markSquare([9, 0]);
        gameBoard.markSquare([9, 1]);
        gameBoard.markSquare([3, 5]);
        gameBoard.markSquare([4, 5]);
        gameBoard.markSquare([5, 5]);
        
        expect(gameBoard.getSinkLog()).toEqual({
            carrier5: false,
            battleship4: false,
            destroyer3: false,
            submarine3: [
                [3, 5],
                [4, 5],
                [5, 5],
            ],
            patrol2: [
                [9, 0],
                [9, 1],
            ],
        });
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

        // Occupying all possible placements for the battleship on row 'a'
        gameBoard.placeShip('carrier5', [
            [0, 3],
            [0, 4],
            [0, 5],
            [0, 6],
            [0, 7],
        ]);

        // Occupying all possible placement for the battleship on row 'b'
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

    test('Can extract a range of squares given a size, alignment and a starting square', () => {
        expect(Board.extractRange(4, 'h', [5, 4])).toEqual([
            [5, 4],
            [5, 5],
            [5, 6],
            [5, 7],
        ]);
    });

    test('Can randomly place all ships on the grid', () => {
        expect.assertions(2);

        // Mocking suitable locations to control the selected location
        jest.spyOn(gameBoard, 'getSuitablePlacements')
            .mockReturnValueOnce([[0, 0]])
            .mockReturnValueOnce([[1, 0]])
            .mockReturnValueOnce([[2, 0]])
            .mockReturnValueOnce([[3, 0]])
            .mockReturnValueOnce([[4, 0]]);

        // Ensure we are always getting a horizontal alignment
        jest.spyOn(Math, 'floor')
            .mockReturnValueOnce('h')
            .mockReturnValueOnce(0)
            .mockReturnValueOnce('h')
            .mockReturnValueOnce(0)
            .mockReturnValueOnce('h')
            .mockReturnValueOnce(0)
            .mockReturnValueOnce('h')
            .mockReturnValueOnce(0)
            .mockReturnValueOnce('h')
            .mockReturnValueOnce(0);

        gameBoard.randomlyPlaceShips();

        let carrierPlacement = [
            gameBoard.grid[0][0],
            gameBoard.grid[0][1],
            gameBoard.grid[0][2],
            gameBoard.grid[0][3],
            gameBoard.grid[0][4],
        ];

        let battleshipPlacement = [
            gameBoard.grid[1][0],
            gameBoard.grid[1][1],
            gameBoard.grid[1][2],
            gameBoard.grid[1][3],
        ];

        let destroyerPlacement = [
            gameBoard.grid[2][0],
            gameBoard.grid[2][1],
            gameBoard.grid[2][2],
        ];

        let submarinePlacement = [
            gameBoard.grid[3][0],
            gameBoard.grid[3][1],
            gameBoard.grid[3][2],
        ];

        let patrolPlacement = [gameBoard.grid[4][0], gameBoard.grid[4][1]];

        carrierPlacement = carrierPlacement.filter(
            (element) => element !== 'carrier5'
        );

        battleshipPlacement = battleshipPlacement.filter(
            (element) => element !== 'battleship4'
        );

        destroyerPlacement = destroyerPlacement.filter(
            (element) => element !== 'destroyer3'
        );

        submarinePlacement = submarinePlacement.filter(
            (element) => element !== 'submarine3'
        );

        patrolPlacement = patrolPlacement.filter(
            (element) => element !== 'patrol2'
        );

        const all = [
            carrierPlacement,
            battleshipPlacement,
            destroyerPlacement,
            submarinePlacement,
            patrolPlacement,
        ];

        expect(all).toEqual([[], [], [], [], []]);

        // Completely random (only check that 17 squares are occupied)
        gameBoard.clearAll();
        gameBoard.randomlyPlaceShips();

        let count = 0;
        gameBoard.grid.forEach((row) =>
            row.forEach((square) => {
                if (square !== true) {
                    count += 1;
                }
            })
        );

        expect(count).toBe(17);
    });
});
