import { clearChildren } from '../extra-utilities/dom-manipulator';

export function getShipCont(element) {
    if (element.classList.contains('ship-cont')) {
        return element;
    }
    return element.parentNode;
}

export function alreadyPlacing(manualPlacementCont) {
    const children = [...manualPlacementCont.children];
    for (const child of children) {
        if (child.classList.contains('currently-placing')) {
            return child;
        }
    }
    return false;
}
export function resetAllUIPlacements(manualPlacementCont, targetBoard) {
    const manualPlacementChildren = [...manualPlacementCont.children];
    const squares = [...targetBoard.children];
    for (const child of manualPlacementChildren) {
        child.classList.remove('already-placed');
        child.removeAttribute('data-ship-start');
        child.removeAttribute('data-ship-end');
    }
    for (const square of squares) {
        clearChildren(square);
    }
}

export function removeFromBoard(manualPlacementCont, targetBoard, shipType) {
    const manualPlacementChildren = [...manualPlacementCont.children];
    const squares = [...targetBoard.children];
    for (const child of manualPlacementChildren) {
        if (child.dataset.ship === shipType) {
            child.classList.remove('already-placed');
            child.removeAttribute('data-ship-start');
            child.removeAttribute('data-ship-end');
        }
    }
    for (const square of squares) {
        if (square.lastChild !== null) {
            if (square.lastChild.dataset.ship === shipType) {
                square.lastChild.remove();
            }
        }
    }
}

export function markForAdjustment(shipType, manualPlacementCont) {
    const manualPlacementChildren = [...manualPlacementCont.children];
        for (const child of manualPlacementChildren) {
        if (child.dataset.ship === shipType) {
            child.classList.add('currently-placing');
            child.classList.remove('already-placed');
            child.removeAttribute('data-ship-start');
            child.removeAttribute('data-ship-end');
        }
    }
}
