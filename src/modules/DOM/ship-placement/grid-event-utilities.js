import PlacementInfo from '../../gameLogic/placementInfo';
import Board from '../../gameLogic/board';

import { buildElement } from '../../extra-utilities/dom-manipulator';

// Utility functions for 'place-ships-grid-event.js'

export function getPlacementRange(shipLength, alignment, startSquare) {
    if (
        !PlacementInfo.isValidShipSize(shipLength) ||
        !PlacementInfo.isValidCoordinate(startSquare.id)
    ) {
        return null;
    }

    const startIndex = Board.coordinateToIndex(startSquare.id);
    const placementRange = Board.extractRange(
        shipLength,
        alignment,
        startIndex
    );

    return placementRange;
}

export function getUIShipAlignment(uiSquares) {
    const firstSquare = [uiSquares[0].dataset.row, uiSquares[0].dataset.column];
    const lastSquare = [
        uiSquares[uiSquares.length - 1].dataset.row,
        uiSquares[uiSquares.length - 1].dataset.column,
    ];
    const modifier = uiSquares.length - 1;
    if (
        firstSquare[0] === lastSquare[0] &&
        Number(firstSquare[1]) + modifier === Number(lastSquare[1])
    ) {
        return 'h';
    }
    if (
        firstSquare[0].charCodeAt(0) + modifier ===
            lastSquare[0].charCodeAt(0) &&
        firstSquare[1] === lastSquare[1]
    ) {
        return 'v';
    }
}

export function canFitUI(uiBoard, targetShip, startSquare, alignment) {
    const shipLength = Number(targetShip.dataset.size);
    if (
        !PlacementInfo.isValidShipSize(shipLength) ||
        !PlacementInfo.isValidCoordinate(startSquare.id) ||
        !PlacementInfo.isValidShipType(targetShip.dataset.ship)
    ) {
        return false;
    }
    const placementRange = getPlacementRange(
        shipLength,
        alignment,
        startSquare
    );

    for (const indexPair of placementRange) {
        if (!Board.isValidIndexPair(indexPair)) {
            return false;
        }
        const square = uiBoard.querySelector(
            `#${Board.indexToCoordinate(indexPair)}`
        );
        // Invalid coordinate
        if (square === null) {
            return false;
        }
        // Square is occupied
        if (square.lastChild !== null) {
            // When changing alignment, the start square is still occupied
            // Therefore, that specific square should be exempt
            if (
                JSON.stringify(Board.coordinateToIndex(square.id)) ===
                JSON.stringify(placementRange[0])
            ) {
                continue;
            }
            return false;
        }
    }

    return placementRange;
}

export function getCurrentlyPlacing() {
    const manualPlacementCont = document.querySelector(
        '.manual-placement-cont'
    );
    const children = [...manualPlacementCont.children];
    for (const child of children) {
        if (child.classList.contains('currently-placing')) {
            return child;
        }
    }
    return null;
}

export function indicesToUISquares(indices) {
    const uiSquares = [];
    for (const indexPair of indices) {
        const squareIndex = Board.indexToCoordinate(indexPair);
        uiSquares.push(document.querySelector(`.player-grid #${squareIndex}`));
    }
    return uiSquares;
}

export function validPlacementHoverEffect(uiSquares, alignment, shipType) {
    const alignmentFull = alignment === 'h' ? 'horizontal' : 'vertical';
    for (const squareIndex in uiSquares) {
        const square = uiSquares[squareIndex];
        const indicator = buildElement('div', 'placement-hover-indicator');
        indicator.dataset.ship = shipType;
        indicator.dataset.size = uiSquares.length;
        indicator.dataset.alignment = alignment;
        if (Number(squareIndex) === 0) {
            indicator.classList.add(`ship-start-${alignmentFull}`);
        } else if (Number(squareIndex) === uiSquares.length - 1) {
            indicator.classList.add(`ship-end-${alignmentFull}`);
        } else {
            indicator.classList.add(`ship-mid-${alignmentFull}`);
        }
        square.append(indicator);
    }
}

export function clearHoverEffects(grid) {
    const children = [...grid.children];
    for (const child of children) {
        if (child.lastChild === null) {
            continue;
        }

        if (child.lastChild.classList.contains('placement-hover-indicator')) {
            child.lastChild.remove();
        }
    }
}

export function placeOnUIBoard(uiSquares, shipType) {
    const alignment = getUIShipAlignment(uiSquares);
    const alignmentFull = alignment === 'h' ? 'horizontal' : 'vertical';
    for (const squareIndex in uiSquares) {
        const square = uiSquares[squareIndex];
        const ship = document.createElement('div');
        ship.dataset.ship = shipType;
        ship.dataset.size = uiSquares.length;
        ship.dataset.alignment = alignment;
        if (Number(squareIndex) === 0) {
            ship.classList.add(`ship-start-${alignmentFull}`);
        } else if (Number(squareIndex) === uiSquares.length - 1) {
            ship.classList.add(`ship-end-${alignmentFull}`);
        } else {
            ship.classList.add(`ship-mid-${alignmentFull}`);
        }
        square.append(ship);
    }
}

export function updateShipsPlaced(
    shipType,
    startCoordinate,
    endCoordinate,
    alignment
) {
    const manualPlacementCont = document.querySelector(
        '.manual-placement-cont'
    );
    const contChildren = [...manualPlacementCont.children];
    for (const child of contChildren) {
        child.classList.remove('currently-placing');
        if (child.dataset.ship === shipType) {
            child.classList.add('already-placed');
            child.dataset.shipStart = startCoordinate;
            child.dataset.shipEnd = endCoordinate;
            child.dataset.alignment = alignment;
        }
    }
}
