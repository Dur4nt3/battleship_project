import viewStatsEvent from './view-stats';
import addGridSquares from './generate-ui-squares';
import selectPlacementMethodEvent from './ship-placement/select-placement-method';
import placementMethodHelpEvent from './guides/placement-method-help';
import placeShipsShipEvent from './ship-placement/place-ships-ship-event';
import placeShipsGridEvent from './ship-placement/place-ships-grid-event';
import placeShipsRandomizeEvent from './ship-placement/place-ships-randomize-event';

// Barrels functions to execute immediately on page load

export default function initialLoad() {
    viewStatsEvent();
    addGridSquares();
    selectPlacementMethodEvent();
    placementMethodHelpEvent();
    placeShipsShipEvent();
    placeShipsGridEvent();
    placeShipsRandomizeEvent();
}
