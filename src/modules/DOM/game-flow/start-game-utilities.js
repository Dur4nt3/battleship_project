import PlacementInfo from '../../gameLogic/placementInfo';

// Utility functions for 'start-game.js'

// Ensures all ships are placed by checking the number of occupied squares
function checkAllPlaced(playerGrid) {
    const squares = [...playerGrid.children];

    let shipsPlaced = 0;

    for (const square of squares) {
        if (square.lastChild !== null) {
            shipsPlaced += 1;
        }
    }

    return shipsPlaced === 17;
}

function fetchUIPlacements(playerGrid) {
    const squares = [...playerGrid.children];
    const placements = {};

    for (const square of squares) {
        if (square.lastChild !== null) {
            const ship = square.lastChild;

            if (placements[ship.dataset.ship] === undefined) {
                placements[ship.dataset.ship] = [];
            }

            placements[ship.dataset.ship].push(square.id);
        }
    }

    return placements;
}

export function gameStartValidation() {
    const playerGrid = document.querySelector('.player-grid');

    if (!checkAllPlaced(playerGrid)) {
        return false;
    }

    const uiPlacements = fetchUIPlacements(playerGrid);
    for (const ship in uiPlacements) {
        if (
            !PlacementInfo.isValidShipType(ship) ||
            !PlacementInfo.isValidShipSize(uiPlacements[ship].length)
        ) {
            return false;
        }
        for (const coordinate of uiPlacements[ship]) {
            if (!PlacementInfo.isValidCoordinate(coordinate)) {
                return false;
            }
        }

        const shipSize = Number(ship[ship.length - 1]);
        const shipStartEnd = [
            uiPlacements[ship][0],
            uiPlacements[ship][uiPlacements[ship].length - 1],
        ];
        // The ID taken doesn't matter as long as it belongs to the same ship
        const shipAlignment = playerGrid.querySelector(
            `#${uiPlacements[ship][0]}`
        ).lastChild.dataset.alignment;

        if (
            !PlacementInfo.isValidPlacement(
                shipSize,
                shipAlignment,
                shipStartEnd
            )
        ) {
            return false;
        }
    }

    return uiPlacements;
}

export function indicateError(startCont) {
    const errorDescription = startCont.querySelector('.error-description');
    errorDescription.textContent =
        'Invalid Ship Placement. Resolve and Try Again.';
    errorDescription.classList.remove('clear-visibility');

    const errorButton = startCont.querySelector('.start-game');
    errorButton.textContent = 'Error';
    errorButton.classList.add('shake-horizontal');
    errorButton.classList.add('start-error');

    setTimeout(() => {
        errorButton.classList.remove('shake-horizontal');
        errorButton.classList.remove('start-error');
        errorButton.textContent = 'Start';
    }, 625);
}

export function gameStartDOMChanges(startCont) {
    startCont.classList.add('hide');

    const gameInfo = document.querySelector('.game-info');
    gameInfo.classList.add('game-started');

    const shipPlacement = document.querySelector('.ship-placement-cont');
    shipPlacement.classList.add('hide');
}
