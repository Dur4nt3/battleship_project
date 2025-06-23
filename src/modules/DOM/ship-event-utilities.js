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
    }
    for (const square of squares) {
        clearChildren(square);
    }
}
