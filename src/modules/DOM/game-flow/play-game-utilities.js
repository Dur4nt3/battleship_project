import Board from '../../gameLogic/board';
import PlacementInfo from '../../gameLogic/placementInfo';
import { show } from '../../extra-utilities/dom-manipulator';
import PCPlay from '../../gameLogic/pcPlay';
// Utility functions for 'play-game.js'

export function generatePCBoard() {
    const board = new Board();
    board.randomlyPlaceShips();
    return board;
}

export function placementsToBoard(placements) {
    const board = new Board();
    for (const ship in placements) {
        const indices = [];
        for (const coordinate of placements[ship]) {
            indices.push(Board.coordinateToIndex(coordinate));
        }
        board.placeShip(ship, indices);
    }
    return board;
}

function markCurrentTurn(currentTurn) {
    const currentlyPlaying = document.querySelector(
        '.game-flow-indicator .currently-playing'
    );
    const playerSide = document.querySelector('.player-side');
    const opponentSide = document.querySelector('.opponent-side');

    if (currentTurn === 'player') {
        opponentSide.classList.add('attacked');
        playerSide.classList.remove('attacked');

        currentlyPlaying.classList.add('player-move');
        currentlyPlaying.classList.remove('opponent-move');
        currentlyPlaying.textContent = 'Your Move';
    } else {
        playerSide.classList.add('attacked');
        opponentSide.classList.remove('attacked');

        currentlyPlaying.classList.add('opponent-move');
        currentlyPlaying.classList.remove('player-move');
        // eslint-disable-next-line quotes
        currentlyPlaying.textContent = "Opponent's Move";
    }
}

function pcPossibleMoves(playerBoard) {
    const possibleMoves = [];

    for (let i = 0; i <= 9; i += 1) {
        for (let j = 0; j <= 9; j += 1) {
            const currentIndex = [i, j];
            if (playerBoard.squareState(currentIndex) === null) {
                possibleMoves.push(currentIndex);
            }
        }
    }

    return possibleMoves;
}

function generatePCMove(gameObj, method) {
    if (method === 'calculated') {
        const pcLog = gameObj.opponent.log;
        const movesPerformed = gameObj.player.board.exhaustedMoves();
        const sinkLog = gameObj.player.board.getSinkLog();
        const emptyBoard = new Board();

        const nextMove = PCPlay.nextMove(
            pcLog,
            movesPerformed,
            sinkLog,
            emptyBoard
        );

        if (nextMove !== null) {
            return Board.indexToCoordinate(nextMove);
        }

        const largestStanding = PCPlay.largestNotDestroyed(sinkLog);

        const newMove = PCPlay.newMove(
            movesPerformed,
            largestStanding,
            emptyBoard
        );

        return Board.indexToCoordinate(newMove);
    }

    if (method === 'random') {
        const possibleMoves = pcPossibleMoves(gameObj.player.board);
        const chosenMove =
            possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return Board.indexToCoordinate(chosenMove);
    }
}

function getTurnResults(gameObj) {
    // Opponent played the previous turn
    if (gameObj.currentTurn === 'player') {
        return gameObj.opponent.log[gameObj.opponent.log.length - 1];
    }
    return gameObj.player.log[gameObj.player.log.length - 1];
}

// Adds start and finish classes to the start and finish of destroyed ships
function updateOpponentShipIndicators(opponentGrid, gameObj) {
    const shipSunken = gameObj.opponent.board.getSinkLog();
    for (const ship in shipSunken) {
        if (shipSunken[ship] !== false) {
            const startCoordinate = Board.indexToCoordinate(
                shipSunken[ship][0]
            );
            const endCoordinate = Board.indexToCoordinate(
                shipSunken[ship][shipSunken[ship].length - 1]
            );

            // Horizontal alignment
            if (startCoordinate[0] === endCoordinate[0]) {
                opponentGrid
                    .querySelector(`#${startCoordinate}`)
                    .classList.add('ship-start-horizontal');
                opponentGrid
                    .querySelector(`#${endCoordinate}`)
                    .classList.add('ship-end-horizontal');
            } else {
                opponentGrid
                    .querySelector(`#${startCoordinate}`)
                    .classList.add('ship-start-vertical');
                opponentGrid
                    .querySelector(`#${endCoordinate}`)
                    .classList.add('ship-end-vertical');
            }
        }
    }
}

function displayTurnResults(results, affectedParty, gameObj = null) {
    const playerGrid = document.querySelector('.player-grid');
    const opponentGrid = document.querySelector('.opponent-grid');

    if (results[1] === 'miss') {
        const coordinate = Board.indexToCoordinate(results[0]);

        if (affectedParty === 'player') {
            playerGrid.querySelector(`#${coordinate}`).classList.add('miss');
            return;
        }
        opponentGrid.querySelector(`#${coordinate}`).classList.add('miss');
        return;
    }

    if (results[1] === 'hit') {
        const coordinate = Board.indexToCoordinate(results[0]);

        if (affectedParty === 'player') {
            playerGrid
                .querySelector(`#${coordinate}`)
                .lastChild.classList.add('player-ship-hit');
            return;
        }
        opponentGrid
            .querySelector(`#${coordinate}`)
            .classList.add('opponent-ship-hit');
        return;
    }

    // Ship Destruction
    for (const index of results[1]) {
        const coordinate = Board.indexToCoordinate(index);
        // When a ship is destroyed 2 occurrences are logged
        // Therefore we need to make sure all ships are marked as hit
        // That is because we only get the latest occurrence (skipping the latest hit)
        if (affectedParty === 'player') {
            playerGrid
                .querySelector(`#${coordinate}`)
                .lastChild.classList.add('player-ship-hit', 'ship-destroyed');
        } else {
            opponentGrid
                .querySelector(`#${coordinate}`)
                .classList.add('opponent-ship-hit', 'ship-destroyed');
            updateOpponentShipIndicators(opponentGrid, gameObj);
        }
    }
}

export function isValidMove(coordinate, gameObj) {
    if (!PlacementInfo.isValidCoordinate(coordinate)) {
        return false;
    }

    const moveIndex = Board.coordinateToIndex(coordinate);
    const targetBoard =
        gameObj.currentTurn === 'player' ? 'opponent' : 'player';
    if (gameObj[targetBoard].board.squareState(moveIndex) === null) {
        return true;
    }
    return false;
}

function playTurn(gameObj, coordinate) {
    if (!PlacementInfo.isValidCoordinate(coordinate)) {
        return;
    }
    const moveIndex = Board.coordinateToIndex(coordinate);
    gameObj.playTurn(moveIndex);
    gameObj.logTurn(moveIndex);
}

export function startGameSequence(gameObj, starter) {
    const indicator = document.querySelector('.game-flow-indicator');
    indicator.classList.remove('hide');

    if (starter === 'player') {
        markCurrentTurn('player');
    } else {
        markCurrentTurn('opponent');
        // PC plays immediately - first turn is always random
        playTurn(gameObj, generatePCMove(gameObj, 'random'));
        displayTurnResults(getTurnResults(gameObj), 'player');
        markCurrentTurn(gameObj.currentTurn);
    }
}

function gameOverUIChanges(winner) {
    const indicator = document.querySelector(
        '.game-flow-indicator .currently-playing'
    );
    indicator.classList.remove('player-move');
    indicator.classList.remove('opponent-move');

    const gameInfo = document.querySelector('.game-info');
    const playerSide = document.querySelector('.player-side');
    const opponentSide = document.querySelector('.opponent-side');

    const resetCont = document.querySelector('.start-cont');
    const resetButton = resetCont.querySelector('.start-game');

    gameInfo.classList.remove('game-started');
    gameInfo.classList.add('game-ended');
    playerSide.classList.remove('attacked');
    opponentSide.classList.remove('attacked');

    if (winner === 'player') {
        indicator.classList.add('player-move');
        indicator.textContent = 'You Win!';
    } else {
        indicator.classList.add('opponent-move');
        indicator.textContent = 'You Lose...';
    }

    show(resetCont);
    resetCont
        .querySelector('.error-description')
        .classList.add('clear-visibility');
    resetButton.classList.add('reset-game');
    resetButton.textContent = 'Reset';
}

function updateStatistics(gameObj) {
    const statsCont = document.querySelector('.stats-cont');
    const winCount = statsCont.querySelector('.win-count');
    const loseCount = statsCont.querySelector('.lose-count');

    winCount.textContent = gameObj.stats.wins;
    loseCount.textContent = gameObj.stats.losses;
}

export function endGameUI(winner, gameObj) {
    gameObj.endGame(winner);

    gameOverUIChanges(winner);
    updateStatistics(gameObj);
}

function isGameOver(gameObj) {
    if (gameObj.player.board.allDestroyed()) {
        return 'opponent';
    }
    if (gameObj.opponent.board.allDestroyed()) {
        return 'player';
    }
    return false;
}

function pcFallback(gameObj) {
    if (gameObj.currentTurn === 'opponent') {
        console.log('FALLBACK INITIATED!');
        playTurn(gameObj, generatePCMove(gameObj, 'random'));
        displayTurnResults(getTurnResults(gameObj), 'player');
        markCurrentTurn(gameObj.currentTurn);
    }
}

export function fullTurnSequence(gameObj, targetMove = null) {
    if (gameObj.currentTurn === 'player') {
        playTurn(gameObj, targetMove);
        displayTurnResults(getTurnResults(gameObj), 'opponent', gameObj);
        markCurrentTurn(gameObj.currentTurn);
    } else {
        playTurn(gameObj, generatePCMove(gameObj, 'calculated'));
        displayTurnResults(getTurnResults(gameObj), 'player');
        markCurrentTurn(gameObj.currentTurn);
        pcFallback(gameObj);
    }

    if (isGameOver(gameObj) !== false) {
        return false;
    }
    // Game continues
    return true;
}
