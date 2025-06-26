import Board from '../../gameLogic/board';

// Utility functions for 'place-ships-randomize-event.js'

function convertToUIPlacements(shipPlacements, targetBoard) {
    const uiPlacements = {};
    for (const ship in shipPlacements) {
        if (uiPlacements[ship] === undefined) {
            uiPlacements[ship] = [];
        }
        for (const placement of shipPlacements[ship]) {
            const square = targetBoard.querySelector(
                `#${Board.indexToCoordinate(placement)}`
            );
            uiPlacements[ship].push(square);
        }
    }
    return uiPlacements;
}

export function createRandomizedPlacements(targetBoard) {
    const randomizedBoard = new Board();
    randomizedBoard.randomlyPlaceShips();

    const currentPlacements = randomizedBoard.getCurrentPlacements();
    const uiPlacements = convertToUIPlacements(currentPlacements, targetBoard);

    return uiPlacements;
}
