import { gameStartValidation, indicateError, gameStartDOMChanges } from './start-game-utilities';
import { initializeGame } from './play-game';
import { gameEnded } from './game-ui-utilities';

// Handles validation before starting the game

function startGameHandler(event) {
    // Don't trigger the event if the game has ended but wasn't reset
    if (gameEnded()) {
        return;
    }

    const startButton = event.target;
    const startCont = startButton.parentNode;

    const gameStart = gameStartValidation();

    if (gameStart !== false) {
        gameStartDOMChanges(startCont);
        initializeGame(gameStart);
    } else {
        indicateError(startCont);
    }
}

export default function startGameEvent() {
    const startButton = document.querySelector('.start-game');

    startButton.addEventListener('click', startGameHandler);
}
