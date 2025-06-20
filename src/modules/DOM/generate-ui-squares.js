import { buildElement } from '../extra-utilities/dom-manipulator';

// Generates the grid within the UI for both the player and the opponent

function getCoordinate(squareNum) {
    const rowNum = String.fromCharCode(97 + Math.floor((squareNum - 1) / 10));

    let columnNum;
    const squareString = String(squareNum);

    if (
        (squareString.length === 2 && squareString[1] === '0') ||
        squareNum === 100
    ) {
        columnNum = 10;
    } else if (squareString.length === 1) {
        columnNum = squareNum;
    } else {
        columnNum = Number(squareString[1]);
    }

    return rowNum + columnNum;
}

function buildGridSquares() {
    const gridSquares = [];
    for (let i = 1; i <= 100; i += 1) {
        const uiSquare = buildElement('div', 'grid-square');
        const squareCoordinate = getCoordinate(i);
        uiSquare.id = squareCoordinate;
        uiSquare.dataset.row = squareCoordinate[0].toUpperCase();
        uiSquare.dataset.column = squareCoordinate.slice(1).toUpperCase();

        if ((i - 1) % 10 === 0) {
            uiSquare.classList.add('row-start');
        }

        if (i >= 91) {
            uiSquare.classList.add('last-row');
        }

        gridSquares.push(uiSquare);
    }

    return gridSquares;
}

export default function addGridSquares() {
    const playerGrid = document.querySelector('.player-grid');
    const opponentGrid = document.querySelector('.opponent-grid');

    // If you don't generate two separate square arrays
    // Only the last append will work
    const playerSquares = buildGridSquares();
    const opponentSquares = buildGridSquares();
    for (const squareIndex in playerSquares) {
        const playerSquare = playerSquares[squareIndex];
        const opponentSquare = opponentSquares[squareIndex];

        playerGrid.append(playerSquare);
        opponentGrid.append(opponentSquare);
    }
}
