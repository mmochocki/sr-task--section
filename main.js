// Lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.gallery__image');
    images.forEach(img => {
        img.loading = 'lazy';
    });

    const observerOptions = {
        root: null,
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in-out';
        observer.observe(img);
    });

    // Modal functionality
    const modal = document.getElementById('videoModal');
    const playButtons = document.querySelectorAll('.gallery__play-button');
    const closeButton = modal.querySelector('.modal__close');
    const videoContainer = modal.querySelector('.modal__video');
    let player = null;
    let lastFocusedElement = null;

    // Trap focus in modal, Accessibility
    const trapFocus = (element) => {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        e.preventDefault();
                        lastFocusableElement.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        e.preventDefault();
                        firstFocusableElement.focus();
                    }
                }
            }
        });
    };

    // Function to embed YouTube video
    const embedVideo = (videoId) => {
        if (player) {
            player.destroy();
        }

        player = new YT.Player('youtube-player', {
            videoId: videoId,
            playerVars: {
                'autoplay': 1,
                'mute': 0,
                'rel': 0,
                'playsinline': 1,
                'modestbranding': 1,
                'fs': 1,
                'controls': 1
            },
            events: {
                'onReady': (event) => {
                    event.target.playVideo();
                    // Sprawdź czy urządzenie jest mobilne
                    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                        // Dostosuj rozmiar playera dla urządzeń mobilnych
                        const videoContainer = document.querySelector('.modal__video-container');
                        const containerWidth = videoContainer.offsetWidth;
                        event.target.setSize(containerWidth, containerWidth * 0.5625);
                    }
                }
            }
        });
    };

    // Open modal
    const openModal = () => {
        lastFocusedElement = document.activeElement;
        videoContainer.innerHTML = '<div id="youtube-player"></div>';
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        embedVideo('x6iyz1AQhuU');

        // Focus the close button after a short delay to ensure it's visible, Accessibility
        setTimeout(() => {
            closeButton.focus();
        }, 100);
    };

    // Close modal
    const closeModal = () => {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        if (player) {
            player.destroy();
            player = null;
        }
        videoContainer.innerHTML = '';

        // Return focus to the element that opened the modal, Accessibility
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };

    // Event Listeners
    playButtons.forEach(button => {
        button.addEventListener('click', openModal);
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal();
            }
        });
    });

    closeButton.addEventListener('click', closeModal);
    closeButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeModal();
        }
    });

    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on ESC key, Accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeModal();
        }
    });

    // Initialize focus trap, Accessibility
    trapFocus(modal);
});
