// Transit Display & Line Selection Module

class TransitDisplay {
    constructor() {
        this.currentStation = null;

        // Message data with associated videos and announcements-msg
        this.messages = {
            // alert: [
            //     { id: 1, title: 'Emergency Button', cddVideo: 'video/Msg_EmgButton_CDD.mp4', cldVideo: 'video/Msg_EmgButton_CLD.mp4', audio: 'announcements-msg/emgButton.wav', cddLoop: true, cddLoop: false },
            //     { id: 2, title: 'Door Obstruction', cddVideo: 'video/Msg_DoorObstruct_CDD.mp4', cldVideo: 'video/Msg_DoorObstruct_CLD.mp4', audio: 'announcements-msg/door-obstruct-ann.wav', cddLoop: false, cddLoop: false },
            //     { id: 3, title: 'Train Stopped', cddVideo: 'video/Msg_TrainStopped_CDD.mp4', cldVideo: 'video/Msg_TrainStopped_CLD.mp4', audio: 'announcements-msg/train-stopped-ann.wav', cddLoop: false, cddLoop: false },
            //     { id: 4, title: 'Track Crossing', cldVideo: 'video/Msg_TrackCrossing_CLD.mp4', audio: 'announcements-msg/track-crossing-ann.wav', cddLoop: false, cddLoop: false }
            // ],
            safety: [
                { id: 1, title: 'Mind the Gap', cldVideo: 'video/Msg_PMTPG_CLD.mp4', audio: 'announcements-ccl/pmtpg-ann.wav', cldLoop: false },
                { id: 2, title: 'Courtesy', cldVideo: 'video/Msg_Courtesy_CLD.mp4', audio: 'announcements-ccl/courtesy-ann.wav', cldLoop: false },
            ],
        };

        this.currentCategory = 'safety';
        this.selectedMessage = null;
        this.selectedDoorClosing = null;
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
        // Prevent clicks while init videos are playing
        if (window.pageController && window.pageController.isInitPlaying) {
            return;
        }

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
        window.pageController.setActiveMedia({
            cddVideo: 'video/DC-CDD.mp4',
            cldVideo: 'video/DC-CLD.mp4',
            audio: 'announcements-ccl/dc-ann.wav',
            cddLoop: false,
            cldLoop: false
        });

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
            video.muted = false; // Unmute for audio
            video.play().catch(err => { if (err.name !== 'AbortError') console.log('Video play error:', err); });
        }

        if (videoCld) {
            videoCld.querySelector('source').src = 'video/DC-CLD.mp4';
            videoCld.loop = false;
            videoCld.load();
            videoCld.muted = false; // Unmute for audio
            videoCld.play().catch(err => { if (err.name !== 'AbortError') console.log('Video play error:', err); });
        }

        // Play doors closing announcement
        window.pageController.playAudio('announcements-ccl/dc-ann.wav');
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

        const linesData = this.currentStationCategory === 'current' ?
            this.lineSelector.currentLines :
            this.lineSelector.nextLines;
        const lineCode = this.lineSelector.currentLineCode || Object.keys(linesData)[0];
        const direction = this.lineSelector.currentDirection || Object.keys(linesData[lineCode] || {})[0];
        const stationsToDisplay = linesData[lineCode]?.[direction] || [];

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
        window.pageController.setActiveMedia({
            cddVideo: station.cddVideo,
            cldVideo: station.cldVideo,
            audio: station.audio,
            cddLoop: station.cddLoop !== undefined ? station.cddLoop : true,
            cldLoop: station.cldLoop !== undefined ? station.cldLoop : true
        });

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
            video.muted = false;
            video.play().catch(err => { if (err.name !== 'AbortError') console.log('CDD Video play error:', err); });
        }

        if (videoCld && station.cldVideo) {
            videoCld.querySelector('source').src = station.cldVideo;
            videoCld.loop = station.cldLoop !== undefined ? station.cldLoop : true;
            videoCld.load();
            videoCld.muted = false;
            videoCld.play().catch(err => { if (err.name !== 'AbortError') console.log('CLD Video play error:', err); });
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

        window.pageController?.scheduleMediaPreload(categoryMessages.slice(0, 2));

        messagesList.innerHTML = '';
        categoryMessages.forEach(msg => {
            const msgBtn = document.createElement('button');
            msgBtn.className = 'message-item';
            msgBtn.setAttribute('aria-pressed', String(this.selectedMessage === msg));
            if (this.selectedMessage === msg) msgBtn.classList.add('active');
            msgBtn.innerHTML = `<span>${msg.title}</span>`;
            msgBtn.addEventListener('click', () => this.playMessage(msg));
            messagesList.appendChild(msgBtn);
        });
    }

    playMessage(message) {
        this.selectedMessage = message;
        this.selectedMessage = message;
        this.selectedDoorClosing = null;
        if (this.lineSelector) this.lineSelector.selectedLine = null;
        window.pageController.closeAllModals();

        window.pageController.stopAllVideos();
        window.pageController.setActiveMedia({
            cddVideo: message.cddVideo,
            cldVideo: message.cldVideo,
            audio: message.audio,
            cddLoop: message.cddLoop !== undefined ? message.cddLoop : false,
            cldLoop: message.cldLoop !== undefined ? message.cldLoop : false
        });

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
            video.muted = false;
            video.play().catch(err => { if (err.name !== 'AbortError') console.log('CDD Video play error:', err); });
        } else if (video) {
            // Hide video if no cddVideo is defined
            video.style.display = 'none';
            const blankImg = videoContainer.querySelector('img');
            if (blankImg) blankImg.style.display = 'none';
        }

        if (videoCld && message.cldVideo) {
            const stationDisplay = document.querySelector('.station-display');
            videoCld.querySelector('source').src = message.cldVideo;
            videoCld.style.display = 'block';
            videoCld.loop = message.cldLoop !== undefined ? message.cldLoop : false;
            const blankImg = stationDisplay.querySelector('img');
            if (blankImg) blankImg.style.display = 'none';
            videoCld.load();
            videoCld.muted = false;
            videoCld.play().catch(err => { if (err.name !== 'AbortError') console.log('CLD Video play error:', err); });
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
        // Initialize current station from LineSelector
        if (this.lineSelector) {
            this.currentStation = this.lineSelector.currentLine;
        }
        if (this.currentStation) {
            console.log(`Transit Display initialized for ${this.currentStation.title}`);
        }
    }
}

class LineSelector {
    constructor(transitDisplay, lineData) {
        this.transitDisplay = transitDisplay;
        this.currentLine = null;
        this.currentLineTab = 'current';
        this.selectedLineTab = 'current';
        this.selectedLine = null;

        this.currentLines = lineData.currentLines;
        this.nextLines = lineData.nextLines;
        this.doorClosingVideos = lineData.doorClosingVideos;

        this.currentLineCode = Object.keys(this.currentLines)[0];
        this.currentDirection = Object.keys(this.currentLines[this.currentLineCode] || {})[0];
        this.currentLine = this.currentLines[this.currentLineCode]?.[this.currentDirection]?.[0];
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

        // Handle Doors Closing tab differently
        if (this.currentLineTab === 'doors-closing') {
            categoriesContainer.innerHTML = '';
            // For Doors Closing tab, display door closing videos directly
            this.displayLines('doors-closing');
            return;
        }

        const linesData = this.currentLineTab === 'current' ? this.currentLines : this.nextLines;
        const categories = Object.entries(linesData).flatMap(([lineCode, directions]) =>
            Object.keys(directions).map(direction => ({
                label: `${lineCode} ${this.formatDirection(direction)}`,
                value: `${lineCode}-${direction}`
            }))
        );

        categoriesContainer.innerHTML = '';
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'line-category-btn';
            btn.setAttribute('data-category', category.value);
            btn.textContent = category.label;
            btn.addEventListener('click', () => this.switchLineCategory(category.value));
            categoriesContainer.appendChild(btn);
        });

        const selectedCategory = categories.some(category => category.value === this.currentLineCategory)
            ? this.currentLineCategory
            : categories[0]?.value;
        if (selectedCategory) this.switchLineCategory(selectedCategory);
    }

    formatDirection(direction) {
        const directionMatch = direction.match(/^to([A-Z].*)$/);
        return directionMatch ? `to ${directionMatch[1]}` : direction;
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

        // Handle Doors Closing tab with door closing videos
        if (category === 'doors-closing') {
            const doorVideos = [this.doorClosingVideos.ccl]; // Assuming only one door closing video for CCL
            window.pageController?.scheduleMediaPreload(doorVideos);
            doorVideos.forEach(video => {
                const lineBtn = document.createElement('button');
                lineBtn.className = 'line-item';
                lineBtn.setAttribute('aria-pressed', String(this.isSelectedDoorClosing(video)));
                if (this.isSelectedDoorClosing(video)) lineBtn.classList.add('active');
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

        const separatorIndex = category.indexOf('-');
        const lineCode = category.slice(0, separatorIndex);
        const direction = category.slice(separatorIndex + 1);
        const stationsToDisplay = linesData[lineCode]?.[direction] || [];
        this.currentLineCode = lineCode;
        this.currentDirection = direction;
        this.currentLineCategory = category;

        stationsToDisplay.forEach(station => {
            const lineBtn = document.createElement('button');
            lineBtn.className = 'line-item';
            lineBtn.setAttribute('aria-pressed', String(this.isSelectedStation(station)));
            if (this.isSelectedStation(station)) lineBtn.classList.add('active');
            lineBtn.innerHTML = `<span>${station.title}</span>`;
            lineBtn.addEventListener('click', () => {
                this.selectLine(station);
            });
            linesList.appendChild(lineBtn);
        });

        window.pageController?.scheduleMediaPreload(stationsToDisplay.slice(0, 2));
    }

    isSelectedStation(station) {
        return this.selectedLineTab === this.currentLineTab &&
            this.selectedLine?.line === station.line &&
            this.selectedLine?.direction === station.direction &&
            this.selectedLine?.id === station.id;
    }

    isSelectedDoorClosing(video) {
        return this.selectedDoorClosing?.id === video.id;
    }

    selectLine(station) {
        this.currentLine = station;
        this.selectedLine = station;
        this.selectedLineTab = this.currentLineTab;
        this.transitDisplay.selectedMessage = null;
        this.transitDisplay.selectedDoorClosing = null;
        window.pageController.closeAllModals();

        // Stop all existing videos first
        window.pageController.stopAllVideos();
        window.pageController.setActiveMedia({
            cddVideo: station.cddVideo,
            cldVideo: station.cldVideo,
            audio: station.audio,
            cddLoop: station.cddLoop !== undefined ? station.cddLoop : true,
            cldLoop: station.cldLoop !== undefined ? station.cldLoop : true
        });

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
            video.muted = false;
            video.play().catch(err => { if (err.name !== 'AbortError') console.log('CDD Video play error:', err); });
        }

        if (videoCld && station.cldVideo) {
            const stationDisplay = document.querySelector('.station-display');
            videoCld.querySelector('source').src = station.cldVideo;
            videoCld.style.display = 'block';
            videoCld.loop = station.cldLoop !== undefined ? station.cldLoop : true;
            const blankImg = stationDisplay.querySelector('img');
            if (blankImg) blankImg.style.display = 'none';
            videoCld.load();
            videoCld.muted = false;
            videoCld.play().catch(err => { if (err.name !== 'AbortError') console.log('CLD Video play error:', err); });
        }

        // Play announcement audio
        if (station.audio) {
            window.pageController.playAudio(station.audio);
        }

        window.pageController.showToast(`Selected: ${station.line} ${station.direction} - ${station.title}`);
    }

    playDoorClosing(video) {
        this.selectedDoorClosing = video;
        this.transitDisplay.selectedMessage = null;
        this.transitDisplay.lineSelector.selectedLine = null;
        window.pageController.closeAllModals();

        // Stop all existing videos first
        window.pageController.stopAllVideos();
        window.pageController.setActiveMedia({
            cddVideo: video.cddVideo,
            cldVideo: video.cldVideo,
            audio: video.audio,
            cddLoop: video.cddLoop !== undefined ? video.cddLoop : false,
            cldLoop: video.cldLoop !== undefined ? video.cldLoop : false
        });

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
            videoElement.muted = false;
            videoElement.play().catch(err => { if (err.name !== 'AbortError') console.log('CDD Video play error:', err); });
        }

        if (videoCld && video.cldVideo) {
            const stationDisplay = document.querySelector('.station-display');
            videoCld.querySelector('source').src = video.cldVideo;
            videoCld.style.display = 'block';
            videoCld.loop = video.cldLoop !== undefined ? video.cldLoop : false;
            const blankImg = stationDisplay.querySelector('img');
            if (blankImg) blankImg.style.display = 'none';
            videoCld.load();
            videoCld.muted = false;
            videoCld.play().catch(err => { if (err.name !== 'AbortError') console.log('CLD Video play error:', err); });
        }

        // Play announcement audio
        if (video.audio) {
            window.pageController.playAudio(video.audio);
        }

        window.pageController.showToast(`Playing: ${video.title}`);
    }
}

// Initialize TransitDisplay and LineSelector when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const lineDataResponse = await fetch('assets/data/line-data-ccl.json');
        if (!lineDataResponse.ok) {
            throw new Error(`Unable to load line data: ${lineDataResponse.status}`);
        }
        const lineData = await lineDataResponse.json();

        // Wait for PageController to be initialized
        const initTransitDisplay = setInterval(() => {
            if (window.pageController) {
                const transitDisplay = new TransitDisplay();
                transitDisplay.lineSelector = new LineSelector(transitDisplay, lineData);
                new TransitLinesSelector(transitDisplay, lineData);
                window.transitDisplay = transitDisplay;
                window.pageController.scheduleMediaPreload([
                    transitDisplay.lineSelector.currentLine
                ]);
                clearInterval(initTransitDisplay);
            }
        }, 100);
    } catch (error) {
        console.error('Transit line data failed to load:', error);
    }
});

class TransitLinesSelector {
    constructor(transitDisplay, lineData) {
        this.transitDisplay = transitDisplay;
        const lineCodes = lineData.transitLines || Object.keys(lineData.currentLines || {});
        this.selectedLineCode = Object.keys(lineData.currentLines || {})[0] || null;
        this.transitLines = lineCodes.map((code, index) => ({
            id: index + 1,
            name: this.getLineName(code),
            code,
            url: code === 'NSL' ? './' : `${code.toLowerCase()}.html`,
            icon: `assets/caplets/${code}Cap.png`
        }));

        this.setupLineButton();
    }

    getLineName(code) {
        const lineNames = {
            NSL: 'North-South Line',
            EWL: 'East-West Line',
            CCL: 'Circle Line',
            DTL: 'Downtown Line',
            TEL: 'Thomson-East Coast Line'
        };
        return lineNames[code] || `${code} Line`;
    }

    setupLineButton() {
        const stationBtn = document.querySelector('[data-action="station"]');
        if (stationBtn) {
            stationBtn.addEventListener('click', () => this.showTransitLines());
        }
    }

    showTransitLines() {
        // Prevent action while init videos are playing
        if (window.pageController && window.pageController.isInitPlaying) {
            return;
        }

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
            lineBtn.setAttribute('aria-pressed', String(this.selectedLineCode === line.code));
            if (this.selectedLineCode === line.code) lineBtn.classList.add('active');
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
        this.selectedLineCode = line.code;
        window.pageController.closeAllModals();
        window.pageController.showToast(`Navigating to ${line.name}...`);

        // Redirect to the line's page
        setTimeout(() => {
            window.location.href = line.url;
        }, 500);
    }
}
