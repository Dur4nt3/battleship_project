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
        expect.assertions(7);

        expect(Board.isValidIndexPair([0, 0])).toBeTruthy();
        expect(Board.isValidIndexPair([8, 5])).toBeTruthy();

        expect(Board.isValidIndexPair([10, 10])).toBeFalsy();
        expect(Board.isValidIndexPair([3, 10])).toBeFalsy();

        expect(Board.isValidIndexPair([4.5, 6.5])).toBeFalsy();
        expect(Board.isValidIndexPair(['a', 5])).toBeFalsy();
        expect(Board.isValidIndexPair(['1', '5'])).toBeFalsy();
    });

    // An index on the board is a pair of row and column values in the array within the board property
    test('Can translate a coordinate to an index on the board', () => {
        expect.assertions(3);

        expect(Board.coordinateToIndex('a1')).toEqual([0, 0]);
        expect(Board.coordinateToIndex('e5')).toEqual([4, 4]);
        expect(Board.coordinateToIndex('g8')).toEqual([6, 7]);
    });

    test('Can translate an index on the board to a coordinate', () => {
        expect.assertions(3);

        expect(Board.indexToCoordinate([0, 0])).toBe('a1');
        expect(Board.indexToCoordinate([8, 3])).toBe('i4');
        expect(Board.indexToCoordinate([5, 6])).toBe('f7');
    });

    // Don't use 'toEqual' and try to compare to the target array (board) as a whole
    // This will massively bloat the test suite
    test('Can place ships on the board', () => {
        expect.assertions(3);

        gameBoard.placeShip('carrier5', [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
        ]);

        // Should be 5 elements that are equal to 'carrier5'
        let carrierPlacement = [
            gameBoard.grid[0][0],
            gameBoard.grid[0][1],
            gameBoard.grid[0][2],
            gameBoard.grid[0][3],
            gameBoard.grid[0][4],
        ];

        // If all elements are equal to 'carrier5' then the array should be empty
        carrierPlacement = carrierPlacement.filter(
            (element) => element !== 'carrier5'
        );

        expect(carrierPlacement.length).toBe(0);

        gameBoard.placeShip('patrol2', [
            [9, 0],
            [9, 1],
        ]);

        let patrolPlacement = [gameBoard.grid[9][0], gameBoard.grid[9][1]];
        patrolPlacement = patrolPlacement.filter(
            (element) => element !== 'patrol2'
        );

        expect(patrolPlacement.length).toBe(0);

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
        submarinePlacement = submarinePlacement.filter(
            (element) => element !== 'submarine3'
        );

        expect(submarinePlacement.length).toBe(0);
    });

    test('Can check whether certain squares on the board are free or occupied', () => {
        expect.assertions(7);

        gameBoard.placeShip('patrol2', [
            [9, 0],
            [9, 1],
        ]);

        expect(
            gameBoard.isFree([
                [0, 0],
                [0, 1],
            ])
        ).toBeTruthy();

        expect(gameBoard.isFree([[1, 4]])).toBeTruthy();
        expect(gameBoard.isFree([[9, 0]])).toBeFalsy();

        expect(
            gameBoard.isFree([
                [9, 0],
                [9, 1],
            ])
        ).toBeFalsy();
        expect(
            gameBoard.isFree([
                [9, 0],
                [0, 0],
            ])
        ).toBeFalsy();

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

    test.todo('Can clear a particular ship placement');

    test.todo('Can reset all ship placements');
    
    test.todo('Can mark a given square as hit or missed');
    
    test.todo('Can check whether a given square is hit');

    test.todo('Can check whether a given ship is destroyed');

    test.todo('Can check whether all ships are destroyed');

    test.todo('Can check for all possible placements for a ship');

    test.todo('Can randomly place all ships on the grid');
});
