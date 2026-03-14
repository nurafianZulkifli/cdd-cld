// Core Page Functions - Main Controller

class PageController {
    constructor() {
        this.init();
    }

    init() {
        this.setupCoreEventListeners();
        this.setupStyles();
        console.log('Page Controller initialized');
    }

    setupCoreEventListeners() {
        // Modal close buttons
        const modalCloseButtons = document.querySelectorAll('.modal-close');
        modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Close modal on background click
        const messagesModal = document.getElementById('messagesModal');
        if (messagesModal) {
            messagesModal.addEventListener('click', (e) => {
                if (e.target === messagesModal) this.closeAllModals();
            });
        }

        // Close stations modal on background click
        const stationsModal = document.getElementById('stationsModal');
        if (stationsModal) {
            stationsModal.addEventListener('click', (e) => {
                if (e.target === stationsModal) this.closeAllModals();
            });
        }

        // Close lines modal on background click
        const linesModal = document.getElementById('linesModal');
        if (linesModal) {
            linesModal.addEventListener('click', (e) => {
                if (e.target === linesModal) this.closeAllModals();
            });
        }

        // Close transit lines modal on background click
        const transitLinesModal = document.getElementById('transitLinesModal');
        if (transitLinesModal) {
            transitLinesModal.addEventListener('click', (e) => {
                if (e.target === transitLinesModal) this.closeAllModals();
            });
        }

        // Setup mobile video fullscreen
        this.setupMobileVideoFullscreen();
    }

    setupMobileVideoFullscreen() {
        // Only on mobile devices
        if (!this.isMobileDevice()) return;

        const videoContainer = document.querySelector('.video-container');
        const stationDisplay = document.querySelector('.station-display');

        if (videoContainer) {
            const video = videoContainer.querySelector('.station-video-temp');
            if (video) {
                video.style.cursor = 'pointer';
                video.addEventListener('click', () => this.requestVideoFullscreen(videoContainer, video));
            }
        }

        if (stationDisplay) {
            const video = stationDisplay.querySelector('.station-video-cld');
            if (video) {
                video.style.cursor = 'pointer';
                video.addEventListener('click', () => this.requestVideoFullscreen(stationDisplay, video));
            }
        }
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    }

    requestVideoFullscreen(container, video) {
        if (container.requestFullscreen) {
            container.requestFullscreen({ navigationUI: 'hide' }).then(() => {
                // Request landscape orientation
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(err => console.log('Orientation lock failed:', err));
                }
            }).catch(err => console.log('Fullscreen request failed:', err));
        }
    }

    stopAllVideos() {
        const videoContainer = document.querySelector('.video-container');
        let video = videoContainer.querySelector('.station-video-temp');
        const videoCld = document.querySelector('.station-video-cld');
        
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        
        if (videoCld) {
            videoCld.pause();
            videoCld.currentTime = 0;
        }
    }

    playAudio(audioPath) {
        const audio = document.getElementById('doorsAudio');
        if (!audio) return;
        
        // Stop any currently playing audio
        audio.pause();
        audio.currentTime = 0;
        
        // Update source
        const source = audio.querySelector('source');
        if (source) {
            source.src = audioPath;
        }
        
        // Load and play
        audio.load();
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => console.log('Audio play error:', err));
        }
    }

    closeAllModals() {
        const messagesModal = document.getElementById('messagesModal');
        const stationsModal = document.getElementById('stationsModal');
        const linesModal = document.getElementById('linesModal');
        const transitLinesModal = document.getElementById('transitLinesModal');
        
        if (messagesModal && !messagesModal.classList.contains('hidden')) {
            messagesModal.classList.add('hidden');
        }
        
        if (stationsModal && !stationsModal.classList.contains('hidden')) {
            stationsModal.classList.add('hidden');
        }
        
        if (linesModal && !linesModal.classList.contains('hidden')) {
            linesModal.classList.add('hidden');
        }
        
        if (transitLinesModal && !transitLinesModal.classList.contains('hidden')) {
            transitLinesModal.classList.add('hidden');
        }
        
        document.body.style.overflow = 'auto';
    }

    showToast(message) {
        const toast = document.getElementById('statusToast');
        if (toast) {
            toast.textContent = message;
            toast.classList.remove('hidden');
            
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
    }

    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize page controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.pageController = new PageController();
});
