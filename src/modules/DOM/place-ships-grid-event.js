import {
    canFitUI,
    getCurrentlyPlacing,
    indicesToUISquares,
    validPlacementHoverEffect,
    clearHoverEffects,
    getPlacementRange,
    placeOnUIBoard,
    updateShipsPlaced,
} from './grid-event-utilities';

import { gameStarted } from './game-ui-utilities';

// Defines the behavior of the grid (the square and ships within it) when attempting to place ships

function placeShipsGridClickHandler(event) {
    // Don't allow ship placement if the game has started
    if (gameStarted()) {
        return;
    }

    const { target } = event;
    const targetParent = target.parentNode;
    const playerGrid = document.querySelector('.player-grid');

    // Click events are only applicable when there's either a placement indicator or a ship present on the square
    if (targetParent.classList.contains('grid-square')) {
        // Trying to place a ship
        // NOTE: This event wouldn't execute if it was possible to place the ship in the clicked square
        if (target.classList.contains('placement-hover-indicator')) {
            const placementRange = getPlacementRange(
                Number(target.dataset.size),
                'h',
                targetParent
            );
            const uiSquares = indicesToUISquares(placementRange);
            clearHoverEffects(playerGrid);
            placeOnUIBoard(uiSquares, target.dataset.ship);
            updateShipsPlaced(target.dataset.ship);
        }
    }
}

function placeShipsGridHoverHandler(event) {
    // Don't allow ship placement if the game has started
    if (gameStarted()) {
        return;
    }

    const { target } = event;
    const playerGrid = document.querySelector('.player-grid');

    // Prevents hovering over already placed ships
    if (target.classList.contains('grid-square')) {
        const currentlyPlacing = getCurrentlyPlacing();
        if (currentlyPlacing !== null) {
            // Initial alignment when hovering is always horizontal
            const canFit = canFitUI(playerGrid, currentlyPlacing, target, 'h');
            if (canFit !== false) {
                const squaresToMark = indicesToUISquares(canFit);
                validPlacementHoverEffect(
                    squaresToMark,
                    'h',
                    currentlyPlacing.dataset.ship
                );
                playerGrid.classList.add('active-placement');
            }
        }
    }
}

function placeShipsGridHoverOutHandler(event) {
    // Don't allow ship placement if the game has started
    if (gameStarted()) {
        return;
    }

    const { target } = event;

    const playerGrid = document.querySelector('.player-grid');
    const currentlyPlacing = getCurrentlyPlacing();

    // Prevents clearing when mouse is moving within the same square (which causes the placement indicator to stutter)
    if (target.lastChild !== null) {
        if (
            target.lastChild.classList.contains('placement-hover-indicator') &&
            (target.lastChild.classList.contains('ship-start-horizontal') ||
                target.lastChild.classList.contains('ship-start-vertical'))
        ) {
            return;
        }
    }

    if (currentlyPlacing !== null) {
        clearHoverEffects(playerGrid);
        playerGrid.classList.add('active-placement');
    }
}

export default function placeShipsGridEvent() {
    const playerGrid = document.querySelector('.player-grid');
    playerGrid.addEventListener('click', placeShipsGridClickHandler);
    playerGrid.addEventListener('mouseover', placeShipsGridHoverHandler);
    playerGrid.addEventListener('mouseout', placeShipsGridHoverOutHandler);
}
