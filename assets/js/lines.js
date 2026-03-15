// Transit Display & Line Selection Module

class TransitDisplay {
    constructor() {
        // Current and Next station data
        this.currentStationData = {
            current: [
                { id: 1, title: 'Bukit Batok', cddVideo: 'video/toMSP/bukit-batok_cdd_arr.mp4', cldVideo: 'video/toMSP/bukit-batok_cld_arr.mp4', audio: 'announcements/bukit-batok-arr-ann.wav', cddLoop: true, cldLoop: false },
                { id: 2, title: 'Bukit Gombak', cddVideo: 'video/toMSP/bukit-gombak_cdd_arr.mp4', cldVideo: 'video/toMSP/bukit-gombak_cld_arr.mp4', audio: 'announcements/bukit-gombak-arr-ann.wav', cddLoop: true, cldLoop: false },
                { id: 3, title: 'Choa Chu Kang', cddVideo: 'video/toMSP/choa-chu-kang_cdd_arr.mp4', cldVideo: 'video/toMSP/choa-chu-kang_cld_arr.mp4', audio: 'announcements/choa-chu-kang-arr-ann.wav', cddLoop: true, cldLoop: false },
                { id: 4, title: 'Yew Tee', cddVideo: 'video/toMSP/yew-tee_cdd_arr.mp4', cldVideo: 'video/toMSP/yew-tee_cld_arr.mp4', audio: 'announcements/yew-tee-arr-ann.wav', cddLoop: true, cldLoop: false }
            ],
            next: [
                { id: 1, title: 'Bukit Batok', cddVideo: 'video/toMSP/bukit-batok_cdd.mp4', cldVideo: 'video/toMSP/bukit-batok_cld.mp4', audio: 'announcements/bukit-batok-ann.wav', cddLoop: true, cldLoop: false },
                { id: 2, title: 'Bukit Gombak', cddVideo: 'video/toMSP/bukit-gombak_cdd.mp4', cldVideo: 'video/toMSP/bukit-gombak_cld.mp4', audio: 'announcements/bukit-gombak-ann.wav', cddLoop: true, cldLoop: false },
                { id: 3, title: 'Choa Chu Kang', cddVideo: 'video/toMSP/cck_cdd.mp4', cldVideo: 'video/toMSP/cck_cld.mp4', audio: 'announcements/cck-ann.wav', cddLoop: true, cldLoop: false },
                { id: 4, title: 'Yew Tee', cddVideo: 'video/toMSP/yew-tee_cdd.mp4', cldVideo: 'video/toMSP/yew-tee_cld.mp4', audio: 'announcements/yew-tee-ann.wav', cddLoop: true, cldLoop: false }
            ]
        };

        this.currentStation = this.currentStationData.current[0];

        // Message data with associated videos and announcements
        this.messages = {
            alert: [
                { id: 1, title: 'Emergency Button', cddVideo: 'video/Msg_EmgButton_CDD.mp4', cldVideo: 'video/Msg_EmgButton_CLD.mp4', audio: 'announcements/emgButton.wav', cddLoop: true, cddLoop: false },
                { id: 2, title: 'Door Obstruction', cddVideo: 'video/Msg_DoorObstruct_CDD.mp4', cldVideo: 'video/Msg_DoorObstruct_CLD.mp4', audio: 'announcements/door-obstruct-ann.wav', cddLoop: false, cddLoop: false }
            ],
            safety: [
                { id: 1, title: 'Mind the Gap', cldVideo: 'video/Msg_PMTPG_CLD.mp4', audio: 'announcements/pmtpg-ann.wav', cldLoop: false },
                // { id: 2, title: 'Hold the Handrail', cddVideo: 'video/Msg_HoldHandrail_CDD.mp4', cldVideo: 'video/Msg_HoldHandrail_CLD.mp4', audio: 'announcements/safety-handrail-ann.wav', cddLoop: false, cldLoop: false }
            ],
            // service: [
            //     { id: 1, title: 'Maintenance Scheduled', cddVideo: 'video/Msg_MaintenanceScheduled_CDD.mp4', cldVideo: 'video/Msg_MaintenanceScheduled_CLD.mp4', audio: 'announcements/service-maintenance-ann.wav', cddLoop: false, cddLoop: false },
            //     { id: 2, title: 'System Update', cddVideo: 'video/Msg_SystemUpdate_CDD.mp4', cldVideo: 'video/Msg_SystemUpdate_CLD.mp4', audio: 'announcements/service-update-ann.wav', cddLoop: false, cddLoop: false }
            // ],
            info: [
                { id: 1, title: 'Suspicious - ENG', cldVideo: 'video/Msg_SusENG_CLD.mp4', audio: 'announcements/sus-eng-ann.wav', cldLoop: false },
                // { id: 2, title: 'Suspicious - CHN', cldVideo: 'video/Msg_SusCHN_CLD.mp4', audio: 'announcements/sus-chn-ann.wav', cldLoop: false },
                // { id: 3, title: 'Suspicious - MLY', cldVideo: 'video/Msg_SusMLY_CLD.mp4', audio: 'announcements/sus-mly-ann.wav', cldLoop: false },
                { id: 4, title: 'Suspicious - TML', cldVideo: 'video/Msg_SusTML_CLD.mp4', audio: 'announcements/sus-tml-ann.wav', cldLoop: false }
            ]
        };

        this.currentCategory = 'alert';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeStation();
    }

    setupEventListeners() {
        // Control buttons
        const controlButtons = document.querySelectorAll('.control-button');
        controlButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleControlClick(e));
        });

        // Navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleNavigation());
        });

        // Category buttons
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchCategory(e.target.getAttribute('data-category')));
        });
    }

    handleControlClick(event) {
        const button = event.currentTarget;
        const action = button.getAttribute('data-action');

        switch (action) {
            case 'doors':
                this.toggleDoors();
                break;
            case 'prev':
                this.showCurrentStation();
                break;
            case 'next':
                this.showNextStation();
                break;
            case 'messages':
                this.showMessages();
                break;
            case 'line':
                this.lineSelector.showLineSelector();
                break;
        }
    }

    toggleDoors() {
        window.pageController.stopAllVideos();

        const videoContainer = document.querySelector('.video-container');
        let video = videoContainer.querySelector('.station-video-temp');
        const videoCld = document.querySelector('.station-video-cld');

        const blankImg = videoContainer.querySelector('img');
        if (blankImg) blankImg.style.display = 'none';

        // Update video sources and play doors closing
        if (video) {
            video.querySelector('source').src = 'video/DC-CDD.mp4';
            video.style.display = 'block';
            video.loop = false;
            video.load();
            video.play().catch(err => console.log('Video play error:', err));
        }

        if (videoCld) {
            videoCld.querySelector('source').src = 'video/DC-CLD.mp4';
            videoCld.loop = false;
            videoCld.load();
            videoCld.play().catch(err => console.log('Video play error:', err));
        }

        // Play doors closing announcement
        window.pageController.playAudio('announcements/dc-ann.wav');
        window.pageController.showToast('Doors Closing Triggered');
    }

    showCurrentStation() {
        this.currentMessagePrefix = 'Now at:';
        this.currentStationCategory = 'current';
        const modal = document.getElementById('stationsModal');
        if (modal) {
            this.displayStations();
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    showNextStation() {
        this.currentMessagePrefix = 'Next:';
        this.currentStationCategory = 'next';
        const modal = document.getElementById('stationsModal');
        if (modal) {
            this.displayStations();
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    displayStations() {
        const stationsList = document.getElementById('stationsList');
        stationsList.innerHTML = '';

        const stationsToDisplay = this.currentStationCategory === 'current' ?
            this.currentStationData.current :
            this.currentStationData.next;

        stationsToDisplay.forEach(station => {
            const stationBtn = document.createElement('button');
            stationBtn.className = 'station-item';
            stationBtn.innerHTML = `<span>${station.title}</span>`;
            stationBtn.addEventListener('click', () => {
                const messagePrefix = this.currentMessagePrefix || 'Now at:';
                this.playStation(station, messagePrefix);
            });
            stationsList.appendChild(stationBtn);
        });
    }

    playStation(station, messagePrefix = 'Now at:') {
        this.currentStation = station;
        window.pageController.closeAllModals();

        window.pageController.stopAllVideos();

        const videoContainer = document.querySelector('.video-container');
        let video = videoContainer.querySelector('.station-video-temp');
        const videoCld = document.querySelector('.station-video-cld');

        // Update video sources and play
        if (video && station.cddVideo) {
            video.querySelector('source').src = station.cddVideo;
            video.style.display = 'block';
            video.loop = station.cddLoop !== undefined ? station.cddLoop : true;
            const blankImg = videoContainer.querySelector('img');
            if (blankImg) blankImg.style.display = 'none';
            video.load();
            video.play().catch(err => console.log('CDD Video play error:', err));
        }

        if (videoCld && station.cldVideo) {
            videoCld.querySelector('source').src = station.cldVideo;
            videoCld.loop = station.cldLoop !== undefined ? station.cldLoop : true;
            videoCld.load();
            videoCld.play().catch(err => console.log('CLD Video play error:', err));
        }

        // Play announcement audio
        if (station.audio) {
            window.pageController.playAudio(station.audio);
        }

        // Update station name display
        const stationNameElement = document.querySelector('.station-name');
        if (stationNameElement) {
            stationNameElement.textContent = station.title;
            stationNameElement.style.animation = 'none';
            setTimeout(() => {
                stationNameElement.style.animation = 'fadeInOut 0.5s ease';
            }, 10);
        }

        window.pageController.showToast(`${messagePrefix} ${station.title}`);
    }

    showMessages() {
        const modal = document.getElementById('messagesModal');
        if (modal) {
            this.displayMessages(this.currentCategory);
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    switchCategory(category) {
        this.currentCategory = category;
        // Update active button
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            }
        });
        this.displayMessages(category);
    }

    displayMessages(category) {
        const messagesList = document.getElementById('messagesList');
        const categoryMessages = this.messages[category] || [];

        messagesList.innerHTML = '';
        categoryMessages.forEach(msg => {
            const msgBtn = document.createElement('button');
            msgBtn.className = 'message-item';
            msgBtn.innerHTML = `<span>${msg.title}</span>`;
            msgBtn.addEventListener('click', () => this.playMessage(msg));
            messagesList.appendChild(msgBtn);
        });
    }

    playMessage(message) {
        window.pageController.closeAllModals();

        window.pageController.stopAllVideos();

        const videoContainer = document.querySelector('.video-container');
        let video = videoContainer.querySelector('.station-video-temp');
        const videoCld = document.querySelector('.station-video-cld');

        // Update video sources and play
        if (video && message.cddVideo) {
            video.querySelector('source').src = message.cddVideo;
            video.style.display = 'block';
            video.loop = message.cddLoop !== undefined ? message.cddLoop : false;
            const blankImg = videoContainer.querySelector('img');
            if (blankImg) blankImg.style.display = 'none';
            video.load();
            video.play().catch(err => console.log('CDD Video play error:', err));
        } else if (video) {
            // Hide video if no cddVideo is defined
            video.style.display = 'none';
            const blankImg = videoContainer.querySelector('img');
            if (blankImg) blankImg.style.display = 'none';
        }

        if (videoCld && message.cldVideo) {
            videoCld.querySelector('source').src = message.cldVideo;
            videoCld.loop = message.cldLoop !== undefined ? message.cldLoop : false;
            videoCld.load();
            videoCld.play().catch(err => console.log('CLD Video play error:', err));
        }

        // Play announcement audio
        if (message.audio) {
            window.pageController.playAudio(message.audio);
        }

        window.pageController.showToast(`Playing: ${message.title}`);
    }

    handleNavigation() {
        window.pageController.showToast('Navigation pressed');
    }

    initializeStation() {
        console.log(`Transit Display initialized for ${this.currentStation.title}`);
    }
}

class LineSelector {
    constructor(transitDisplay) {
        this.transitDisplay = transitDisplay;
        this.currentLine = null;
        this.currentLineTab = 'current';

        // Line data for current station
        this.currentLines = {
            NSL: {
                toMSP: [
                    { id: 1, line: 'NSL', direction: 'toMSP', title: 'Bukit Batok', cddVideo: 'video/toMSP/bukit-batok_cdd_arr.mp4', cldVideo: 'video/toMSP/bukit-batok_cld_arr.mp4', audio: 'announcements/bukit-batok-arr-ann.wav', cddLoop: true, cldLoop: false },
                    { id: 2, line: 'NSL', direction: 'toMSP', title: 'Bukit Gombak', cddVideo: 'video/toMSP/bukit-gombak_cdd_arr.mp4', cldVideo: 'video/toMSP/bukit-gombak_cld_arr.mp4', audio: 'announcements/bukit-gombak-arr-ann.wav', cddLoop: true, cldLoop: false },
                    { id: 3, line: 'NSL', direction: 'toMSP', title: 'Choa Chu Kang', cddVideo: 'video/toMSP/cck_cdd_arr.mp4', cldVideo: 'video/toMSP/cck_cld_arr.mp4', audio: 'announcements/cck-arr-ann.wav', cddLoop: true, cldLoop: false },
                    // { id: 4, line: 'NSL', direction: 'toMSP', title: 'Yew Tee', cddVideo: 'video/toMSP/yew-tee_cdd_arr.mp4', cldVideo: 'video/toMSP/yew-tee_cld_arr.mp4', audio: 'announcements/yew-tee-arr-ann.wav', cddLoop: true, cldLoop: false }
                ],
                toJUR: [
                    // { id: 3, line: 'NSL', direction: 'toJUR', title: 'Bukit Batok', cddVideo: 'video/toJUR/bukit-batok_cdd_arr.mp4', cldVideo: 'video/toJUR/bukit-batok_cld_arr.mp4', audio: 'announcements/bukit-batok-arr-ann.wav', cddLoop: true, cldLoop: false },
                    // { id: 4, line: 'NSL', direction: 'toJUR', title: 'Jurong East', cddVideo: 'video/toJUR/jurong-east_cdd_arr.mp4', cldVideo: 'video/toJUR/jurong-east_cld_arr.mp4', audio: 'announcements/jurong-east-arr-ann.wav', cddLoop: true, cldLoop: false }
                ]
            }
        };

        // Line data for next station
        this.nextLines = {
            NSL: {
                toMSP: [
                    { id: 1, line: 'NSL', direction: 'toMSP', title: 'Bukit Batok', cddVideo: 'video/toMSP/bukit-batok_cdd.mp4', cldVideo: 'video/toMSP/bukit-batok_cld.mp4', audio: 'announcements/bukit-batok-ann.wav', cddLoop: true, cldLoop: false },
                    { id: 2, line: 'NSL', direction: 'toMSP', title: 'Bukit Gombak', cddVideo: 'video/toMSP/bukit-gombak_cdd.mp4', cldVideo: 'video/toMSP/bukit-gombak_cld.mp4', audio: 'announcements/bukit-gombak-ann.wav', cddLoop: true, cldLoop: false },
                    { id: 3, line: 'NSL', direction: 'toMSP', title: 'Choa Chu Kang', cddVideo: 'video/toMSP/cck_cdd.mp4', cldVideo: 'video/toMSP/cck_cld.mp4', audio: 'announcements/cck-ann.wav', cddLoop: true, cldLoop: false },
                    // { id: 4, line: 'NSL', direction: 'toMSP', title: 'Yew Tee', cddVideo: 'video/toMSP/yew-tee_cdd.mp4', cldVideo: 'video/toMSP/yew-tee_cld.mp4', audio: 'announcements/yew-tee-ann.wav', cddLoop: true, cldLoop: false }
                ],
                toJUR: [
                    // { id: 3, line: 'NSL', direction: 'toJUR', title: 'Bukit Batok', cddVideo: 'video/toJUR/bukit-batok_cdd.mp4', cldVideo: 'video/toJUR/bukit-batok_cld.mp4', audio: 'announcements/bukit-batok-ann.wav', cddLoop: true, cldLoop: false },
                    // { id: 4, line: 'NSL', direction: 'toJUR', title: 'Jurong East', cddVideo: 'video/toJUR/jurong-east_cdd.mp4', cldVideo: 'video/toJUR/jurong-east_cld.mp4', audio: 'announcements/jurong-east-ann.wav', cddLoop: true, cldLoop: false }
                ]
            }
        };

        // Door closing videos for General tab
        this.doorClosingVideos = {
            toMSP: { id: 1, title: 'Doors Closing - to MSP', cddVideo: 'video/toMSP/DC-CDD.mp4', cldVideo: 'video/toMSP/DC-CLD.mp4', audio: 'announcements/dc-ann.wav', cddLoop: false, cldLoop: false },
            toJUR: { id: 2, title: 'Doors Closing - to JUR', cddVideo: 'video/toJUR/DC-CDD.mp4', cldVideo: 'video/toJUR/DC-CLD.mp4', audio: 'announcements/dc-ann.wav', cddLoop: false, cldLoop: false }
        };

        this.currentLine = this.currentLines.NSL.toMSP[0];
        this.setupLineButton();
    }

    setupLineButton() {
        const lineBtn = document.querySelector('[data-action="line"]');
        if (lineBtn) {
            lineBtn.addEventListener('click', () => this.showLineSelector());
        }
    }

    setupTabListeners() {
        const tabBtns = document.querySelectorAll('.line-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchLineTab(btn.getAttribute('data-tab')));
        });
    }

    switchLineTab(tab) {
        this.currentLineTab = tab;
        const tabBtns = document.querySelectorAll('.line-tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tab) {
                btn.classList.add('active');
            }
        });
        this.displayLineCategories();
    }

    showLineSelector() {
        const modal = document.getElementById('linesModal');
        if (modal) {
            this.setupTabListeners();
            this.displayLineCategories();
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    displayLineCategories() {
        const categoriesContainer = document.querySelector('.line-categories');
        if (!categoriesContainer) {
            // Create categories container if it doesn't exist
            return;
        }

        // Handle General tab differently
        if (this.currentLineTab === 'general') {
            categoriesContainer.innerHTML = '';
            // For General tab, display door closing videos directly
            this.displayLines('general');
            return;
        }

        const categoryBtns = categoriesContainer.querySelectorAll('.line-category-btn');
        if (categoryBtns.length === 0) {
            // Initialize categories
            const categories = [{
                    label: 'NSL to MSP',
                    value: 'NSL-toMSP'
                },
                {
                    label: 'NSL to JUR',
                    value: 'NSL-toJUR'
                },
            ];

            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = 'line-category-btn';
                btn.setAttribute('data-category', cat.value);
                btn.textContent = cat.label;
                if (cat.value === 'NSL-toMSP') btn.classList.add('active');
                btn.addEventListener('click', () => this.switchLineCategory(cat.value));
                categoriesContainer.appendChild(btn);
            });
        }

        this.switchLineCategory('NSL-toMSP');
    }

    switchLineCategory(category) {
        const categoryBtns = document.querySelectorAll('.line-category-btn');
        categoryBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            }
        });
        this.displayLines(category);
    }

    displayLines(category) {
        const linesList = document.getElementById('linesList');
        linesList.innerHTML = '';

        // Handle General tab with door closing videos
        if (category === 'general') {
            const doorVideos = [this.doorClosingVideos.toMSP, this.doorClosingVideos.toJUR];
            doorVideos.forEach(video => {
                const lineBtn = document.createElement('button');
                lineBtn.className = 'line-item';
                lineBtn.innerHTML = `<span>${video.title}</span>`;
                lineBtn.addEventListener('click', () => {
                    this.playDoorClosing(video);
                });
                linesList.appendChild(lineBtn);
            });
            return;
        }

        // Select data based on current tab
        const linesData = this.currentLineTab === 'current' ? this.currentLines : this.nextLines;

        let stationsToDisplay = [];

        if (category === 'NSL-toMSP') {
            stationsToDisplay = linesData.NSL.toMSP;
        } else if (category === 'NSL-toJUR') {
            stationsToDisplay = linesData.NSL.toJUR;
        }

        stationsToDisplay.forEach(station => {
            const lineBtn = document.createElement('button');
            lineBtn.className = 'line-item';
            lineBtn.innerHTML = `<span>${station.title}</span>`;
            lineBtn.addEventListener('click', () => {
                this.selectLine(station);
            });
            linesList.appendChild(lineBtn);
        });
    }

    selectLine(station) {
        this.currentLine = station;
        window.pageController.closeAllModals();

        // Stop all existing videos first
        window.pageController.stopAllVideos();

        const videoContainer = document.querySelector('.video-container');
        let video = videoContainer.querySelector('.station-video-temp');
        const videoCld = document.querySelector('.station-video-cld');

        // Update video sources and play
        if (video && station.cddVideo) {
            video.querySelector('source').src = station.cddVideo;
            video.style.display = 'block';
            video.loop = station.cddLoop !== undefined ? station.cddLoop : true;
            const blankImg = videoContainer.querySelector('img');
            if (blankImg) blankImg.style.display = 'none';
            video.load();
            video.play().catch(err => console.log('CDD Video play error:', err));
        }

        if (videoCld && station.cldVideo) {
            videoCld.querySelector('source').src = station.cldVideo;
            videoCld.loop = station.cldLoop !== undefined ? station.cldLoop : true;
            videoCld.load();
            videoCld.play().catch(err => console.log('CLD Video play error:', err));
        }

        // Play announcement audio
        if (station.audio) {
            window.pageController.playAudio(station.audio);
        }

        window.pageController.showToast(`Selected: ${station.line} ${station.direction} - ${station.title}`);
    }

    playDoorClosing(video) {
        window.pageController.closeAllModals();

        // Stop all existing videos first
        window.pageController.stopAllVideos();

        const videoContainer = document.querySelector('.video-container');
        let videoElement = videoContainer.querySelector('.station-video-temp');
        const videoCld = document.querySelector('.station-video-cld');

        // Update video sources and play
        if (videoElement && video.cddVideo) {
            videoElement.querySelector('source').src = video.cddVideo;
            videoElement.style.display = 'block';
            videoElement.loop = video.cddLoop !== undefined ? video.cddLoop : false;
            const blankImg = videoContainer.querySelector('img');
            if (blankImg) blankImg.style.display = 'none';
            videoElement.load();
            videoElement.play().catch(err => console.log('CDD Video play error:', err));
        }

        if (videoCld && video.cldVideo) {
            videoCld.querySelector('source').src = video.cldVideo;
            videoCld.loop = video.cldLoop !== undefined ? video.cldLoop : false;
            videoCld.load();
            videoCld.play().catch(err => console.log('CLD Video play error:', err));
        }

        // Play announcement audio
        if (video.audio) {
            window.pageController.playAudio(video.audio);
        }

        window.pageController.showToast(`Playing: ${video.title}`);
    }
}

// Initialize TransitDisplay and LineSelector when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
        // Wait for PageController to be initialized
        const initTransitDisplay = setInterval(() => {
            if (window.pageController) {
                const transitDisplay = new TransitDisplay();
                transitDisplay.lineSelector = new LineSelector(transitDisplay);
                new TransitLinesSelector(transitDisplay);
                window.transitDisplay = transitDisplay;
                clearInterval(initTransitDisplay);
            }
        }, 100);
    });

    class TransitLinesSelector {
        constructor(transitDisplay) {
            this.transitDisplay = transitDisplay;

            // Define transit lines with redirect URLs
            this.transitLines = [
                { id: 1, name: 'North-South Line', code: 'NSL', url: 'index.html', icon: 'assets/caplets/NSLCap.png' },
                // { id: 2, name: 'East-West Line', code: 'EWL', url: 'ewl.html', icon: 'assets/caplets/EWLCap.png' }
            ];

            this.setupLineButton();
        }

        setupLineButton() {
            const stationBtn = document.querySelector('[data-action="station"]');
            if (stationBtn) {
                stationBtn.addEventListener('click', () => this.showTransitLines());
            }
        }

        showTransitLines() {
            const modal = document.getElementById('transitLinesModal');
            if (modal) {
                this.displayTransitLines();
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        }

        displayTransitLines() {
            const linesList = document.getElementById('transitLinesList');
            linesList.innerHTML = '';

            this.transitLines.forEach(line => {
                const lineBtn = document.createElement('button');
                lineBtn.className = 'transit-line-item';
                lineBtn.innerHTML = `
                <img src="${line.icon}" alt="${line.code}" class="transit-line-icon">
                <div class="transit-line-info">
                    <div class="transit-line-code">${line.code}</div>
                    <div class="transit-line-name">${line.name}</div>
                </div>
            `;
                lineBtn.addEventListener('click', () => this.selectTransitLine(line));
                linesList.appendChild(lineBtn);
            });
        }

        selectTransitLine(line) {
            window.pageController.closeAllModals();
            window.pageController.showToast(`Navigating to ${line.name}...`);

            // Redirect to the line's page
            setTimeout(() => {
                window.location.href = line.url;
            }, 500);
        }
    }