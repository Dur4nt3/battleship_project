import { resetAllUIPlacements } from './ship-event-utilities';
import {
    placeOnUIBoard,
    updateShipsPlaced,
    getUIShipAlignment,
} from './grid-event-utilities';
import { createRandomizedPlacements } from './randomize-event-utilities';
import { gameStarted } from '../game-flow/game-ui-utilities';

// Handles random ship placement on the player's board

function placeShipRandomizeHandler() {
    if (gameStarted()) {
        return;
    }

    const manualPlacementCont = document.querySelector(
        '.manual-placement-cont'
    );
    const playerGrid = document.querySelector('.player-grid');

    resetAllUIPlacements(manualPlacementCont, playerGrid);
    const randomizedPlacements = createRandomizedPlacements(playerGrid);
    for (const ship in randomizedPlacements) {
        const uiSquares = randomizedPlacements[ship];
        const alignment = getUIShipAlignment(uiSquares);

        placeOnUIBoard(uiSquares, ship);
        updateShipsPlaced(
            ship,
            uiSquares[0].id,
            uiSquares[uiSquares.length - 1].id,
            alignment
        );
    }
}

export default function placeShipsRandomizeEvent() {
    const randomizeButton = document.querySelector('.place-randomly');

    randomizeButton.addEventListener('click', placeShipRandomizeHandler);
}
