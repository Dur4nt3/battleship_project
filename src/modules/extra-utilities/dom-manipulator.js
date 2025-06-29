// A collection of useful functions that can be used to manipulate (alter) the DOM

// Add the class 'hide' which is set to 'display: none'
export function hide(element) {
    element.classList.add('hide');
}

export function show(element) {
    element.classList.remove('hide');
}

// Faster method of building elements without JSX
export function buildElement(type, ...classNames) {
    const createdElement = document.createElement(type);
    createdElement.classList.add(...classNames);

    return createdElement;
}

// 'buildElement' with support for text content
export function buildElementWithText(type, text, ...classNames) {
    const createdElement = document.createElement(type);
    createdElement.textContent = text;
    createdElement.classList.add(...classNames);

    return createdElement;
}

// Faster method of building image elements
export function buildImgElement(src, alt, ...classNames) {
    const imgElement = buildElement('img', ...classNames);
    imgElement.src = src;
    imgElement.alt = alt;

    return imgElement;
}

// Remove all children of an element
// Might need to change max depth to ensure all children are removed
export function clearChildren(element) {
    // Fail-safe: after 250 iterations exit
    const maxDepth = 250;
    let count = 0;
    while (element.lastChild !== null && count < maxDepth) {
        element.lastChild.remove();
        count += 1;
    }

    if (count === maxDepth) {
        console.error('Forced to exit: max depth reached');
    }
}

// Use to exit a modal that has an exit animation
export function exitModal(modalContent) {
    const modal = modalContent.parentNode;
    modalContent.classList.add('slide-out-top');
    setTimeout(() => {
        modal.remove();
    }, 475);
}