import {
    buildElement,
    buildElementWithText,
    exitModal,
} from '../extra-utilities/dom-manipulator';

// Creates the random placement method guide

function createRandomPlacementGuide() {
    const modalCont = buildElement('div', 'modal');
    modalCont.tabIndex = 0;

    const modalContent = buildElement(
        'div',
        'modal-content',
        'random-placement-help'
    );

    const title = buildElementWithText(
        'h2',
        'Random Placement Guide',
        'guide-title'
    );

    const guideContent = buildElement('div', 'guide-content');

    const section1 = buildElement('div', 'guide-subsection');

    const section1Title = buildElementWithText(
        'h3',
        'Introduction',
        'guide-subsection-title'
    );
    const section1P1 = buildElementWithText(
        'p',
        'Random placements allow you to generate all ship placements in one click of a button.',
        'guide-paragraph'
    );
    const section1P2 = buildElementWithText(
        'p',
        'Simply press the randomize button until you are satisfied with the generated ship placement.',
        'guide-paragraph'
    );
    section1.append(section1Title, section1P1, section1P2);

    const section2 = buildElement('div', 'guide-subsection');

    const section2Title = buildElementWithText(
        'h3',
        'Tip',
        'guide-subsection-title'
    );
    const section2P1 = buildElementWithText(
        'p',
        'You can mix random placements with manual placements.',
        'guide-paragraph'
    );
    const section2P2 = buildElementWithText(
        'p',
        'This allows you to get an initial layout with random placements and fine-tune it using manual placements.',
        'guide-paragraph'
    );
    section2.append(section2Title, section2P1, section2P2);

    guideContent.append(section1, section2);

    const exitButton = buildElementWithText('button', 'Exit', 'exit-modal');

    modalContent.append(title, guideContent, exitButton);
    modalCont.append(modalContent);

    return modalCont;
}

export default function randomPlacementGuide() {
    const modal = createRandomPlacementGuide();
    modal.lastChild.style.visibility = 'hidden';

    document.body.prepend(modal);
    modal.focus();

    modal.lastChild.classList.add('slide-in-top');
    modal.lastChild.style.visibility = 'visible';

    modal.addEventListener('click', (e) => {
        const { target } = e;
        if (target.classList.contains('exit-modal')) {
            exitModal(modal.lastChild);
        }
    });
}
