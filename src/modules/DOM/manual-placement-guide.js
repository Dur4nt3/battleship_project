import {
    buildElement,
    buildElementWithText,
    exitModal,
} from '../extra-utilities/dom-manipulator';

// Creates the manual placement method guide

function createManualPlacementGuide() {
    const modalCont = buildElement('div', 'modal');
    modalCont.tabIndex = 0;

    const modalContent = buildElement(
        'div',
        'modal-content',
        'manual-placement-help'
    );

    const title = buildElementWithText(
        'h2',
        'Manual Placement Guide',
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
        'Manual placement allows you to take full control of how you place your ships on the board.',
        'guide-paragraph'
    );
    const section1P2 = buildElementWithText(
        'p',
        'Simply click the ship you want to place to select it, and click a square on the board to place it.',
        'guide-paragraph'
    );
    const section1P3 = buildElementWithText(
        'p',
        'Please note, the square you are clicking will be the starting the square (i.e., the first square your ship occupies).',
        'guide-paragraph'
    );
    section1.append(section1Title, section1P1, section1P2, section1P3);

    const section2 = buildElement('div', 'guide-subsection');

    const section2Title = buildElementWithText(
        'h3',
        'Utilities',
        'guide-subsection-title'
    );
    const section2P1 = buildElementWithText(
        'p',
        'There are several utilities that you can use whilst placing your ships:',
        'guide-paragraph'
    );
    const section2List = buildElement('ul', 'guide-paragraph');
    const section2ListItem1 = buildElementWithText(
        'li',
        'Clicking The Starting Square Of The Ship: Change Alignment (Vertical/Horizontal)',
        'guide-list-item'
    );
    const section2ListItem2 = buildElementWithText(
        'li',
        'Clicking The Middle/End Squares Of The Ship: Change Ship Location',
        'guide-list-item'
    );
    const section2ListItem3 = buildElementWithText(
        'li',
        'Clicking A Ship On The Menu: Remove The Ship From The Board',
        'guide-list-item'
    );
    section2List.append(
        section2ListItem1,
        section2ListItem2,
        section2ListItem3
    );
    section2.append(section2Title, section2P1, section2List);

    const section3 = buildElement('div', 'guide-subsection');

    const section3Title = buildElementWithText(
        'h3',
        'Restrictions',
        'guide-subsection-title'
    );
    const section3P1 = buildElementWithText(
        'p',
        'When placing your ships, ensure to NOT place your ships over each other (you may place them side to side).',
        'guide-paragraph'
    );
    section3.append(section3Title, section3P1);

    guideContent.append(section1, section2, section3);

    const exitButton = buildElementWithText('button', 'Exit', 'exit-modal');

    modalContent.append(title, guideContent, exitButton);
    modalCont.append(modalContent);

    return modalCont;
}

export default function manualPlacementGuide() {
    const modal = createManualPlacementGuide();
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
