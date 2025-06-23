import { getShipCont, alreadyPlacing, resetAllUIPlacements } from './ship-event-utilities';

// Defines the behavior of ships (i.e., the ones within the placement container) when attempting to place ships
function placeShipsShipHandler(event) {
    const { target } = event;
    // Don't trigger the event for these elements
    const manualPlacementCont = document.querySelector(
        '.manual-placement-cont'
    );
    if (
        (target.classList.contains('ship-cont') ||
            target.parentNode.classList.contains('ship-cont')) &&
        !target.classList.contains('already-placed') &&
        !target.parentNode.classList.contains('already-placed')
    ) {
        const shipCont = getShipCont(target);
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
        resetAllUIPlacements(manualPlacementCont, document.querySelector('.player-grid'));
    }
}

export default function placeShipsShipEvent() {
    const manualPlacementCont = document.querySelector(
        '.manual-placement-cont'
    );
    manualPlacementCont.addEventListener('click', placeShipsShipHandler);
}
