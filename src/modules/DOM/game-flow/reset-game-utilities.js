import { clearChildren, hide, show } from '../../extra-utilities/dom-manipulator';
import addGridSquares from '../generate-ui-squares';

// Utility functions for 'reset-game.js'

function clearBoards() {
    const playerGrid = document.querySelector('.player-grid');
    const opponentGrid = document.querySelector('.opponent-grid');

    clearChildren(playerGrid);
    clearChildren(opponentGrid);

    addGridSquares();
}

function showShipPlacement() {
    const shipPlacementCont = document.querySelector('.ship-placement-cont');

    const indicator = document.querySelector(
        '.game-flow-indicator .currently-playing'
    );

    indicator.textContent = '';
    hide(indicator.parentNode);

    show(shipPlacementCont);
}

function convertToStartButton() {
    const resetButton = document.querySelector('.start-cont').querySelector('.start-game');
    resetButton.classList.remove('reset-game');
    resetButton.textContent = 'Start';
}

export function resetGameSequence() {
    clearBoards();
    showShipPlacement();
    convertToStartButton();

    document.querySelector('.game-info').classList.remove('game-ended');
}
