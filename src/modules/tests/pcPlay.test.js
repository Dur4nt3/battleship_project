import PCPlay from '../gameLogic/pcPlay';
import Board from '../gameLogic/board';
import Battleship from '../gameLogic/battleship';

import {
    createBoards,
    forcePlayerStart,
    oneTurnFromWin,
} from './utilities/battleship-utilities';
import {
    addMisses,
    destroyShip,
    initialMisses,
    playForBoth,
} from './utilities/pcPlay-utilities';

let gameFlow;

// Initialize gameFlow (performed for all tests)
beforeEach(() => {
    // The boards have a pre-determined placements for the tests (as shown in the 'createBoards' function)
    const { playerBoard, opponentBoard } = createBoards();

    gameFlow = new Battleship(playerBoard, opponentBoard);

    // Ensure the player always starts
    forcePlayerStart(gameFlow);
});

describe('Tests for the PCPlay class', () => {
    test('Can find the most recent hit in a log', () => {
        expect.assertions(3);

        // Fallback when the log is empty
        expect(PCPlay.findRecentHit(gameFlow.opponent.log)).toBeNull();

        initialMisses(gameFlow);

        // Fallback when there are no hits
        expect(PCPlay.findRecentHit(gameFlow.opponent.log)).toBeNull();

        oneTurnFromWin(gameFlow);
        addMisses(gameFlow);

        // Can find a hit
        expect(PCPlay.findRecentHit(gameFlow.opponent.log)).toBe(gameFlow.opponent.log.length - 5);
    });

    test('Can determine wether a square is in the range of a destroyed ship', () => {
        expect.assertions(2);

        oneTurnFromWin(gameFlow);
        addMisses(gameFlow);

        const sinkLog = gameFlow.player.board.getSinkLog();

        expect(PCPlay.inSinkRange(sinkLog, [3, 5])).toBeTruthy();
        expect(PCPlay.inSinkRange(sinkLog, [0, 0])).toBeFalsy();
    });

    test('Can return the largest ship that is not destroyed', () => {
        destroyShip(gameFlow, 'carrier5', 'submarine3');

        const sinkLog = gameFlow.player.board.getSinkLog();

        expect(PCPlay.largestNotDestroyed(sinkLog)).toBe('battleship4');
    });

    test('Can determine the next square to target', () => {
        expect.assertions(2);

        destroyShip(gameFlow, 'carrier5', 'submarine3');

        playForBoth(gameFlow, [0, 5]);
        playForBoth(gameFlow, [0, 6]);
        playForBoth(gameFlow, [0, 7]);
        playForBoth(gameFlow, [0, 8]);

        let sinkLog = gameFlow.player.board.getSinkLog();
        let largestStanding = PCPlay.largestNotDestroyed(sinkLog);
        let movesPerformed = gameFlow.player.board.exhaustedMoves();
        let newBoard = new Board();

        // Works for vertical move assertions
        expect(
            PCPlay.newMove(movesPerformed, largestStanding, newBoard)
        ).toEqual([0, 9]);

        destroyShip(gameFlow, 'battleship4');
        playForBoth(gameFlow, [0, 9]);

        sinkLog = gameFlow.player.board.getSinkLog();
        largestStanding = PCPlay.largestNotDestroyed(sinkLog);
        movesPerformed = gameFlow.player.board.exhaustedMoves();
        newBoard = new Board();

        // Works for horizontal move assertions
        expect(
            PCPlay.newMove(movesPerformed, largestStanding, newBoard)
        ).toEqual([1, 4]);
    });
});
