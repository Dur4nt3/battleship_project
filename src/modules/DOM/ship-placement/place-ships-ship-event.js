import {
    getShipCont,
    alreadyPlacing,
    resetAllUIPlacements,
    removeFromBoard,
} from './ship-event-utilities';

import { gameStarted } from '../game-flow/game-ui-utilities';

// Defines the behavior of ships (i.e., the ones within the placement container) when attempting to place ships

function placeShipsShipHandler(event) {
    if (gameStarted()) {
        return;
    }

    const { target } = event;

    const manualPlacementCont = document.querySelector(
        '.manual-placement-cont'
    );
    const playerGrid = document.querySelector('.player-grid');
    if (
        target.classList.contains('ship-cont') ||
        target.parentNode.classList.contains('ship-cont')
    ) {
        const shipCont = getShipCont(target);

        if (
            target.classList.contains('already-placed') ||
            target.parentNode.classList.contains('already-placed')
        ) {
            removeFromBoard(
                manualPlacementCont,
                playerGrid,
                shipCont.dataset.ship
            );
            return;
        }

        const currentlyPlacing = alreadyPlacing(manualPlacementCont);

        if (currentlyPlacing === shipCont) {
            shipCont.classList.remove('currently-placing');
            return;
        }

        if (currentlyPlacing !== false) {
            currentlyPlacing.classList.remove('currently-placing');
            shipCont.classList.add('currently-placing');
        } else {
            shipCont.classList.add('currently-placing');
        }
    }

    if (
        target.classList.contains('reset-placements-utility') ||
        target.parentNode.classList.contains('reset-placements-utility')
    ) {
        resetAllUIPlacements(manualPlacementCont, playerGrid);
    }
}

export default function placeShipsShipEvent() {
    const manualPlacementCont = document.querySelector(
        '.manual-placement-cont'
    );
    manualPlacementCont.addEventListener('click', placeShipsShipHandler);
}
