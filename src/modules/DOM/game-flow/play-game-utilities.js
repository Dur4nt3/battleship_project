import Board from '../../gameLogic/board';

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

export function startGameSequence(starter) {
    const indicator = document.querySelector('.game-flow-indicator');
    indicator.classList.remove('hide');

    if (starter === 'player') {
        markCurrentTurn('player');
    } else {
        markCurrentTurn('opponent');
    }
}
