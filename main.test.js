// basic tests
const { JSDOM } = require('jsdom');

describe('Modal tests', () => {
    let dom;
    let document;
    let modal;

    beforeEach(() => {
        // prepare DOM environment before each test
        dom = new JSDOM(`
            <button class="modal__close" aria-label="Close modal" type="button">
                <img src="assets/close.webp" alt="" class="modal__close-icon" aria-hidden="true">
            </button>
        `);
        document = dom.window.document;
        modal = document.getElementById('videoModal');
    });

    // check if modal is closed
    test('Modal should be closed', () => {
        expect(modal.classList.contains('is-active')).toBe(false);
        expect(modal.getAttribute('aria-hidden')).toBe('true');
    });

    // check if modal has close button
    test('Modal should have close button', () => {
        const closeButton = modal.querySelector('.modal__close');
        expect(closeButton).not.toBeNull();
        expect(closeButton.textContent).toBe('Close');
    });
});