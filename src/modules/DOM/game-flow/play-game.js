import Battleship from '../../gameLogic/battleship';
import { gameStarted } from './game-ui-utilities';
import {
    generatePCBoard,
    placementsToBoard,
    startGameSequence,
    isValidMove,
    endGameUI,
    fullTurnSequence,
} from './play-game-utilities';

// Handles the flow of the game

let currentGame;

export function initializeGame(playerPlacements) {
    const playerBoard = placementsToBoard(playerPlacements);
    const opponentBoard = generatePCBoard();

    // This means the user has already played at least one game
    if (currentGame instanceof Battleship) {
        currentGame.resetGame(playerBoard, opponentBoard);
    } else {
        currentGame = new Battleship(playerBoard, opponentBoard);
    }

    currentGame.startGame();
    startGameSequence(currentGame, currentGame.currentTurn);
}

function playGameHandler(event) {
    if (!gameStarted()) {
        return;
    }

    const { target } = event;
    // No click events should be registered unless it's the player's turn
    if (currentGame.currentTurn === 'player') {
        if (target.parentNode.classList.contains('opponent-grid')) {
            if (isValidMove(target.id, currentGame)) {
                // Player's turn
                if (fullTurnSequence(currentGame, target.id) === false) {
                    endGameUI('player', currentGame);
                    return;
                }

                // PC plays immediately
                if (fullTurnSequence(currentGame) === false) {
                    endGameUI('opponent', currentGame);
                }
            }
        }
    }
}

export default function playGameEvent() {
    const gameInfoCont = document.querySelector('.game-info');
    gameInfoCont.addEventListener('click', playGameHandler);
}
