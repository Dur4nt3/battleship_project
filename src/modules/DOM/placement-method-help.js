import manualPlacementGuide from './manual-placement-guide';
import randomPlacementGuide from './random-placement-guide';
// Handles showing and removing the placement method guides

function manualHelpEvent() {
    const infoIcon = document.querySelector('.manual-placement-guide-icon');

    infoIcon.addEventListener('click', manualPlacementGuide);
}

function randomHelpEvent() {
    const infoIcon = document.querySelector('.random-placement-guide-icon');

    infoIcon.addEventListener('click', randomPlacementGuide);
}

export default function placementMethodHelpEvent() {
    manualHelpEvent();
    randomHelpEvent();
}
