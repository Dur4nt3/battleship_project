import {
    canFitUI,
    getCurrentlyPlacing,
    indicesToUISquares,
    validPlacementHoverEffect,
    clearHoverEffects,
    getPlacementRange,
    placeOnUIBoard,
    updateShipsPlaced,
    getUIShipAlignment,
} from './grid-event-utilities';

import {
    alreadyPlacing,
    markForAdjustment,
    removeFromBoard,
} from './ship-event-utilities';

import { gameStarted } from '../game-flow/game-ui-utilities';

// Defines the behavior of the grid (the square and ships within it) when attempting to place ships

function placeShipsGridClickHandler(event) {
    // Don't allow ship placement if the game has started
    if (gameStarted()) {
        return;
    }

    const { target } = event;
    const targetParent = target.parentNode;
    const playerGrid = document.querySelector('.player-grid');
    const manualPlacementCont = document.querySelector(
        '.manual-placement-cont'
    );

    // Click events are only applicable when there's either a placement indicator or a ship present on the square
    if (targetParent.classList.contains('grid-square')) {
        // Trying to place a ship
        // NOTE: This event wouldn't execute if it was possible to place the ship in the clicked square
        if (target.classList.contains('placement-hover-indicator')) {
            let alignment = target.dataset.alignment === 'v' ? 'v' : 'h';

            const placementRange = getPlacementRange(
                Number(target.dataset.size),
                alignment,
                targetParent
            );
            const uiSquares = indicesToUISquares(placementRange);

            clearHoverEffects(playerGrid);
            placeOnUIBoard(uiSquares, target.dataset.ship);

            alignment = getUIShipAlignment(uiSquares);
            updateShipsPlaced(
                target.dataset.ship,
                uiSquares[0].id,
                uiSquares[uiSquares.length - 1].id,
                alignment
            );
        } else if (
            target.classList.contains('ship-start-horizontal') ||
            target.classList.contains('ship-start-vertical')
        ) {
            // Don't change alignment if the user is trying to place a ship
            if (alreadyPlacing(manualPlacementCont)) {
                return;
            }
            const futureAlignment = target.classList.contains(
                'ship-start-horizontal'
            )
                ? 'v'
                : 'h';

            const canFit = canFitUI(
                playerGrid,
                target,
                targetParent,
                futureAlignment
            );

            if (canFit !== false) {
                removeFromBoard(
                    manualPlacementCont,
                    playerGrid,
                    target.dataset.ship
                );

                const placementRange = getPlacementRange(
                    Number(target.dataset.size),
                    futureAlignment,
                    targetParent
                );
                const uiSquares = indicesToUISquares(placementRange);

                placeOnUIBoard(uiSquares, target.dataset.ship);
                updateShipsPlaced(
                    target.dataset.ship,
                    uiSquares[0].id,
                    uiSquares[uiSquares.length - 1].id,
                    futureAlignment
                );
            }
        } else {
            // Will only execute when the mid/end parts of the ship are clicked

            // Don't change alignment if the user is trying to place a ship
            if (alreadyPlacing(manualPlacementCont)) {
                return;
            }
            removeFromBoard(
                manualPlacementCont,
                playerGrid,
                target.dataset.ship
            );
            markForAdjustment(
                target.dataset.ship,
                target.dataset.alignment,
                manualPlacementCont
            );
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
            // If the data attribute isn't defined the alignment is horizontal (default)
            const alignment =
                currentlyPlacing.dataset.alignment === 'v' ? 'v' : 'h';

            const canFit = canFitUI(
                playerGrid,
                currentlyPlacing,
                target,
                alignment
            );

            if (canFit !== false) {
                const squaresToMark = indicesToUISquares(canFit);

                validPlacementHoverEffect(
                    squaresToMark,
                    alignment,
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
