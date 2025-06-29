import { gameEnded } from './game-ui-utilities';
import { resetGameSequence } from './reset-game-utilities';

// Handles resetting the game (which allows the user to play multiple games in a singular session)

function resetGameHandler(event) {
    if (!gameEnded()) {
        return;
    }

    const { target } = event;
    if (target.classList.contains('reset-game')) {
        resetGameSequence();
    }
}

export default function resetGameEvent() {
    const resetButton = document.querySelector('.start-game');
    resetButton.addEventListener('click', resetGameHandler);
}
