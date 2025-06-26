import { hide, show } from '../../extra-utilities/dom-manipulator';

// Allows switching between placement methods

function selectPlacementMethodHandler(event) {
    const { target } = event;
    const alreadySelected = target.classList.contains('selected-method');

    const manualPlacementSelector = document.querySelector('.manual-placement');
    const randomPlacementSelector = document.querySelector('.random-placement');

    const manualPlacementTool = document.querySelector('.manual-placement-cont');
    const randomPlacementTool = document.querySelector('.random-placement-cont');

    if (alreadySelected) {
        return;
    }

    if (target === manualPlacementSelector) {
        hide(randomPlacementTool);
        randomPlacementSelector.classList.remove('selected-method');

        show(manualPlacementTool);
        target.classList.add('selected-method');
    } else if (target === randomPlacementSelector) {
        hide(manualPlacementTool);
        manualPlacementSelector.classList.remove('selected-method');

        show(randomPlacementTool);
        target.classList.add('selected-method');
    }
}

export default function selectPlacementMethodEvent() {
    const placementMethodSelector = document.querySelector('.placement-method');

    placementMethodSelector.addEventListener(
        'click',
        selectPlacementMethodHandler
    );
}
