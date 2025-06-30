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
    hitAllHorizontalCarrier,
    initialHits,
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
        expect(PCPlay.findRecentHit(gameFlow.opponent.log)).toBe(
            gameFlow.opponent.log.length - 5
        );
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

    test('Can find a new square to target', () => {
        expect.assertions(2);

        gameFlow.player.board.clearPlacement('carrier5');
        gameFlow.player.board.placeShip('carrier5', [
            [0, 9],
            [1, 9],
            [2, 9],
            [3, 9],
            [4, 9],
        ]);

        playForBoth(gameFlow, [0, 0]);
        playForBoth(gameFlow, [0, 1]);
        playForBoth(gameFlow, [0, 2]);
        playForBoth(gameFlow, [0, 3]);
        playForBoth(gameFlow, [0, 4]);
        playForBoth(gameFlow, [0, 5]);

        let sinkLog = gameFlow.player.board.getSinkLog();
        let largestStanding = PCPlay.largestNotDestroyed(sinkLog);
        let movesPerformed = gameFlow.player.board.exhaustedMoves();
        let newBoard = new Board();

        // Prioritizes horizontal placements
        expect(
            PCPlay.newMove(movesPerformed, largestStanding, newBoard)
        ).toEqual([1, 0]);

        // Hitting all remaining possible horizontal placements
        hitAllHorizontalCarrier(gameFlow);

        sinkLog = gameFlow.player.board.getSinkLog();
        largestStanding = PCPlay.largestNotDestroyed(sinkLog);
        movesPerformed = gameFlow.player.board.exhaustedMoves();
        newBoard = new Board();

        // Can still give vertical suggestions
        expect(
            PCPlay.newMove(movesPerformed, largestStanding, newBoard)
        ).toEqual([0, 6]);
    });

    test('Can determine the next move to make', () => {
        expect.assertions(2);

        initialMisses(gameFlow);

        let sinkLog = gameFlow.player.board.getSinkLog();
        let movesPerformed = gameFlow.player.board.exhaustedMoves();
        let newBoard = new Board();

        // There is a fallback when there are no recent hits
        expect(
            PCPlay.nextMove(
                gameFlow.opponent.log,
                movesPerformed,
                sinkLog,
                newBoard
            )
        ).toBeNull();

        initialHits(gameFlow);

        sinkLog = gameFlow.player.board.getSinkLog();
        movesPerformed = gameFlow.player.board.exhaustedMoves();
        newBoard = new Board();

        expect(
            PCPlay.nextMove(
                gameFlow.opponent.log,
                movesPerformed,
                sinkLog,
                newBoard
            )
        ).toEqual([0, 2]);
    });
});
