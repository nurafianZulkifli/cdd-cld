// Core Page Functions - Main Controller

class PageController {
    constructor() {
        this.isInitPlaying = true; // Flag to prevent button clicks during init
        this.init();
    }

    init() {
        this.setupCoreEventListeners();
        this.setupStyles();
        // Delay init video playback slightly to ensure DOM is fully ready
        setTimeout(() => this.playInitVideos(), 100);
    }

    setupCoreEventListeners() {
        // Disable right-click context menu
        document.addEventListener('contextmenu', (e) => e.preventDefault());

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
                // Listen for fullscreen exit
                document.addEventListener('fullscreenchange', () => this.handleFullscreenExit(video));
            }
        }

        if (stationDisplay) {
            const video = stationDisplay.querySelector('.station-video-cld');
            if (video) {
                video.style.cursor = 'pointer';
                video.addEventListener('click', () => this.requestVideoFullscreen(stationDisplay, video));
                // Listen for fullscreen exit
                document.addEventListener('fullscreenchange', () => this.handleFullscreenExit(video));
            }
        }
    }

    handleFullscreenExit(video) {
        // When fullscreen exits, remove inline styles
        if (!document.fullscreenElement) {
            if (video) {
                video.style.width = '';
                video.style.height = '';
                video.style.objectFit = '';
            }
            // Unlock orientation if possible
            if (screen.orientation && typeof screen.orientation.unlock === 'function') {
                try {
                    const unlockResult = screen.orientation.unlock();
                    if (unlockResult && typeof unlockResult.catch === 'function') {
                        unlockResult.catch(err => console.log('Orientation unlock failed:', err));
                    }
                } catch (err) {
                    // Silently handle errors on devices that don't support orientation unlocking
                }
            }
        }
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    }

    requestVideoFullscreen(container, video) {
        // Try to request fullscreen on video element first, fall back to container
        const elementToFullscreen = video || container;
        
        if (elementToFullscreen.requestFullscreen) {
            elementToFullscreen.requestFullscreen({ navigationUI: 'hide' }).then(() => {
                // Request landscape orientation
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(err => console.log('Orientation lock failed:', err));
                }
                // Ensure video fills screen
                if (video) {
                    video.style.width = '100vw';
                    video.style.height = '100vh';
                    video.style.objectFit = 'contain';
                }
            }).catch(err => {
                // Fall back to container if video fullscreen fails
                if (container && video !== container && container.requestFullscreen) {
                    container.requestFullscreen({ navigationUI: 'hide' }).catch(e => console.log('Container fullscreen failed:', e));
                }
            });
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
            playPromise.catch(err => { if (err.name !== 'AbortError') console.log('Audio play error:', err); });
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
            
            .control-button:disabled {
                opacity: 0.5 !important;
                cursor: not-allowed !important;
                pointer-events: none !important;
                background: #393e53 !important;
                color: var(--text-primary) !important;
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.233), 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                border-color: #2b2b2b33 !important;
                transform: none !important;
            }
            
            .control-button:disabled:hover {
                border-color: #2b2b2b33 !important;
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.233), 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    setButtonsDisabled(disabled) {
        const buttons = document.querySelectorAll('.control-button');
        buttons.forEach(btn => {
            btn.disabled = disabled;
        });
    }

    playInitVideos() {
        const videoContainer = document.querySelector('.video-container');
        const stationDisplay = document.querySelector('.station-display');
        
        let videoCdd = videoContainer?.querySelector('.station-video-temp');
        let videoCld = stationDisplay?.querySelector('.station-video-cld');
        
        if (!videoCdd || !videoCld) {
            console.error('Init videos: One or both video elements not found');
            return;
        }
        
        // Disable all buttons during playback
        this.setButtonsDisabled(true);
        
        let videosFinished = 0;
        const totalVideos = 2;
        
        const checkIfBothFinished = () => {
            videosFinished++;
            if (videosFinished === totalVideos) {
                // Re-enable buttons when both videos finish
                this.isInitPlaying = false;
                this.setButtonsDisabled(false);
            }
        };
        
        // Set up the CDD video (station-video-temp)
        videoCdd.style.display = 'block';
        let sourceCdd = videoCdd.querySelector('source') || document.createElement('source');
        sourceCdd.src = 'video/toMSP/CDD_Init.mp4';
        sourceCdd.type = 'video/mp4';
        if (!videoCdd.contains(sourceCdd)) {
            videoCdd.appendChild(sourceCdd);
        }
        videoCdd.load();
        
        videoCdd.addEventListener('ended', () => {
            // Keep the init video displayed until user plays a different video
            checkIfBothFinished();
        }, { once: true });
        
        // Set up the CLD video (station-video-cld)
        let sourceCld = videoCld.querySelector('source') || document.createElement('source');
        sourceCld.src = 'video/toMSP/CLD_Init.mp4';
        sourceCld.type = 'video/mp4';
        if (!videoCld.contains(sourceCld)) {
            videoCld.appendChild(sourceCld);
        }
        videoCld.load();
        
        videoCld.addEventListener('ended', () => {
            checkIfBothFinished();
        }, { once: true });
        
        // Play both videos
        const playCdd = videoCdd.play();
        if (playCdd && typeof playCdd.then === 'function') {
            playCdd.catch(err => {
                console.error('CDD video play error:', err);
                checkIfBothFinished();
            });
        }
        
        const playCld = videoCld.play();
        if (playCld && typeof playCld.then === 'function') {
            playCld.catch(err => {
                console.error('CLD video play error:', err);
                checkIfBothFinished();
            });
        }
    }
}

// Initialize page controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.pageController = new PageController();
});
