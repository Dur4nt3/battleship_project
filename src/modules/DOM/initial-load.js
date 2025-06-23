import viewStatsEvent from './view-stats';
import addGridSquares from './generate-ui-squares';
import selectPlacementMethodEvent from './select-placement-method';
import placementMethodHelpEvent from './placement-method-help';
import placeShipsShipEvent from './place-ships-ship-event';
import placeShipsGridEvent from './place-ships-grid-event';

// Barrels functions to execute immediately on page load

export default function initialLoad() {
    viewStatsEvent();
    addGridSquares();
    selectPlacementMethodEvent();
    placementMethodHelpEvent();
    placeShipsShipEvent();
    placeShipsGridEvent();
}
