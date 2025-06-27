// Utility functions related to the game

export function gameStarted() {
    return document
        .querySelector('.game-info')
        .classList.contains('game-started');
}

export function gameEnded() {
    return document
        .querySelector('.game-info')
        .classList.contains('game-ended');
}
