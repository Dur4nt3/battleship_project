import Board from '../gameLogic/board';
import Battleship from '../gameLogic/battleship';

import {
    forcePlayerStart,
    createBoards,
    oneTurnFromWin,
    playerWin,
} from './utilities/battleship-utilities';

let gameFlow;

// Initialize gameFlow (performed for all tests)
beforeEach(() => {
    // The boards have a pre-determined placements for the tests (as shown in the 'createBoards' function)
    const { playerBoard, opponentBoard } = createBoards();

    gameFlow = new Battleship(playerBoard, opponentBoard);
});

describe('Tests for Battleship class', () => {
    test('Can create instances of Battleship', () => {
        expect(gameFlow instanceof Battleship).toBeTruthy();
    });

    test('Instances are constructed with the correct properties and values', () => {
        expect.assertions(7);

        expect(gameFlow.player.board instanceof Board).toBeTruthy();
        expect(gameFlow.player.log).toEqual([]);

        expect(gameFlow.opponent.board instanceof Board).toBeTruthy();
        expect(gameFlow.opponent.log).toEqual([]);

        expect(gameFlow.gameStatus).toBeNull();
        expect(gameFlow.currentTurn).toBeNull();
        expect(gameFlow.stats).toEqual({ wins: 0, losses: 0 });
    });

    test('Can start a game, initializing gameStatus and currentTurn', () => {
        expect.assertions(2);

        gameFlow.startGame();

        expect(gameFlow.gameStatus).toBe('ongoing');
        // Either the player or the opponent should start (decision is random)
        expect(
            ['player', 'opponent'].includes(gameFlow.currentTurn)
        ).toBeTruthy();
    });
});

describe('Additional tests for Battleship class (player start is forced)', () => {
    // Ensure the player always starts
    beforeEach(() => {
        forcePlayerStart(gameFlow);
    });

    test('Can play a turn', () => {
        expect.assertions(2);

        gameFlow.playTurn([9, 0]);
        expect(gameFlow.opponent.board.grid[9][0]).toEqual(['patrol2', 'hit']);
        expect(gameFlow.currentTurn).toBe('opponent');
    });

    test('Can log what occurred on the previous turn', () => {
        expect.assertions(3);

        gameFlow.playTurn([9, 0]);
        gameFlow.logTurn([9, 0]);

        // Can log hits
        expect(gameFlow.player.log[0]).toEqual([[9, 0], 'hit']);

        gameFlow.playTurn([9, 2]);
        gameFlow.logTurn([9, 2]);

        // Can log misses
        expect(gameFlow.opponent.log[0]).toEqual([[9, 2], 'miss']);

        gameFlow.playTurn([9, 1]);
        gameFlow.logTurn([9, 1]);

        // Can log ship destruction
        expect(gameFlow.player.log[gameFlow.player.log.length - 1]).toEqual([
            'patrol2',
            [
                [9, 0],
                [9, 1],
            ],
        ]);
    });

    test('Can end the game', () => {
        expect.assertions(4);

        oneTurnFromWin(gameFlow);

        // Logging is unimportant for this test
        // Therefore, the 'logTurn' method isn't used
        gameFlow.playTurn([0, 0]);

        // Opponent lost
        expect(gameFlow.opponent.board.allDestroyed()).toBeTruthy();

        gameFlow.endGame('player');

        expect(gameFlow.stats).toEqual({ wins: 1, losses: 0 });
        expect(gameFlow.gameStatus).toBe('win');
        expect(gameFlow.currentTurn).toBeNull();
    });

    test('Can reset the game', () => {
        expect.assertions(4);

        playerWin(gameFlow);
        // Unnecessary for the test, done for the sake of integrity (reset executing only after the game has finished)
        gameFlow.endGame('player');

        const { playerBoard, opponentBoard } = createBoards();

        gameFlow.resetGame(playerBoard, opponentBoard);

        let playerValidSquares = 0;

        gameFlow.player.board.grid.forEach((row) =>
            row.forEach((square) => {
                // Indicates that the board has not been played on
                if (square !== 'miss' || !Array.isArray(square)) {
                    playerValidSquares += 1;
                }
            })
        );

        let opponentValidSquares = 0;

        gameFlow.opponent.board.grid.forEach((row) =>
            row.forEach((square) => {
                if (square !== 'miss' || !Array.isArray(square)) {
                    opponentValidSquares += 1;
                }
            })
        );

        expect(playerValidSquares).toBe(100);
        expect(opponentValidSquares).toBe(100);
        expect(gameFlow.player.log).toEqual([]);
        expect(gameFlow.opponent.log).toEqual([]);
    });
});
