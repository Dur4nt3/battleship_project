import Battleship from '../../gameLogic/battleship';
import { gameStarted } from './game-ui-utilities';
import { generatePCBoard, placementsToBoard, startGameSequence } from './play-game-utilities';

// Handles the flow of the game

let currentGame;

export function initializeGame(playerPlacements) {
    const playerBoard = placementsToBoard(playerPlacements);
    const opponentBoard = generatePCBoard();
    
    currentGame = new Battleship(playerBoard, opponentBoard);
    currentGame.startGame();
    startGameSequence(currentGame.currentTurn);
}

function playGameHandler(event) {
    if (!gameStarted()) {
        return;
    }

    const { target } = event;
}

export default function playGameEvent() {
    const gameInfoCont = document.querySelector('.game-info');
    gameInfoCont.addEventListener('click', playGameHandler);
}
