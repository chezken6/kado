// Inisialisasi ketika DOM sudah siap
document.addEventListener('DOMContentLoaded', function () {
    const uiSound = document.getElementById("uiSound");
    const controlSound = document.getElementById("controlSound");

    // Pastikan sound elements tersedia
    if (!uiSound || !controlSound) {
        console.error("Audio elements tidak ditemukan!");
        return;
    }

    // Set audio properties untuk full playback
    uiSound.preload = "auto";
    uiSound.volume = 1.0;
    controlSound.preload = "auto";
    controlSound.volume = 1.0;

    // Helper function untuk play UI sound
    function playUISound() {
        if (uiSound) {
            uiSound.currentTime = 0;
            uiSound.play().catch(err => console.error("Error playing UI sound:", err));
        }
    }

    // Helper function untuk play control sound
    function playControlSound() {
        if (controlSound) {
            controlSound.currentTime = 0;
            controlSound.play().catch(err => console.error("Error playing control sound:", err));
        }
    }

    // ===== MENU BUTTONS =====
    const buttons = document.querySelectorAll('.menu-button');
    console.log("Tombol menu ditemukan:", buttons.length);

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            console.log("Tombol menu diklik!");

            uiSound.currentTime = 0;

            const playPromise = uiSound.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log("Suara UI mulai diputar!");

                        // Efek visual
                        this.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            this.style.transform = '';
                        }, 100);

                        // Navigasi setelah suara selesai diputar
                        const link = this.getAttribute('data-link');
                        if (link) {
                            uiSound.addEventListener('ended', function handleEnded() {
                                console.log("Suara selesai diputar!");
                                window.location.href = link;
                                // Hapus event listener setelah digunakan
                                uiSound.removeEventListener('ended', handleEnded);
                            }, { once: true });
                        }
                    })
                    .catch(err => {
                        console.error("Error memutar suara:", err);
                        // Jika gagal memutar, langsung navigasi
                        const link = this.getAttribute('data-link');
                        if (link) {
                            setTimeout(() => {
                                window.location.href = link;
                            }, 100);
                        }
                    });
            }
        });
    });

    // ===== BACK BUTTON =====
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function (e) {
            e.preventDefault();
            playUISound();

            const link = this.getAttribute('data-link');
            if (link) {
                setTimeout(() => {
                    window.location.href = link;
                }, 200);
            }
        });
    }

    // ===== GAME ITEMS =====
    const gameItems = document.querySelectorAll('.game-item');
    if (gameItems.length > 0) {
        gameItems.forEach(item => {
            item.addEventListener('click', function () {
                playUISound();
                const gameName = this.getAttribute('data-game');

                // Navigate to game page
                setTimeout(() => {
                    // Check if we're already in pages folder
                    const isInPagesFolder = window.location.pathname.includes('/pages/');
                    const gameFile = gameName + '.html';
                    const gameUrl = isInPagesFolder ? gameFile : 'pages/' + gameFile;

                    if (gameName === 'snake' || gameName === 'tetris') {
                        window.location.href = gameUrl;
                    } else {
                        alert(`Game "${gameName}" coming soon! 🎮`);
                    }
                }, 200);
            });
        });
    }

    // ===== PHOTO ITEMS =====
    const photoItems = document.querySelectorAll('.photo-item');
    if (photoItems.length > 0) {
        photoItems.forEach((item, index) => {
            item.addEventListener('click', function () {
                playUISound();
                setTimeout(() => {
                    alert(`Melihat foto ${index + 1} 📷`);
                }, 100);
            });
        });
    }

    // ===== MUSIC PLAYER =====
    // Check if we're on the music page to initialize music player
    const isMusicPage = window.location.pathname.includes('musik.html');

    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const musicPlayer = document.getElementById('musicPlayer');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeFill = document.getElementById('volumeFill');
    const musicIcon = document.getElementById('musicIcon');
    const basePath = window.location.pathname.includes('/pages/') ? '../' : './';

    let isPlaying = false;
    let currentSong = 0;

    const songs = [
        { title: 'HBD', src: basePath + 'music/HBD.mp3' },
        { title: 'Girl Like You', src: basePath + 'music/Girls Like You.mp3' },
        { title: 'Happines', src: basePath + 'music/happines.mp3' },
        { title: 'Senorita', src: basePath + 'music/senorita.mp3' },
        { title: 'Stuck With You', src: basePath + 'music/Stuck with U.mp3' },
        { title: 'Youre Still The One', src: basePath + 'music/you\'re Still thee One.mp3' },
    ];

    // Load state from localStorage
    function loadMusicState() {
        const savedSong = localStorage.getItem('currentSong');
        const savedPlaying = localStorage.getItem('isPlaying');
        const savedCurrentTime = localStorage.getItem('currentTime');

        if (savedSong !== null) {
            currentSong = parseInt(savedSong);
        }
        if (savedPlaying === 'true') {
            isPlaying = true;
        }

        if (musicPlayer) {
            musicPlayer.src = songs[currentSong].src;

            // Restore playback position if available
            if (savedCurrentTime !== null) {
                musicPlayer.currentTime = parseFloat(savedCurrentTime);
            }

            musicPlayer.volume = 0.5; // default volume

            // Play automatically if it was playing
            if (isPlaying) {
                const playPromise = musicPlayer.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        console.error('Error playing music:', err);
                        // Auto-play policy might block audio if no interaction yet
                        // This is expected on some browsers until user clicks something
                    });
                }

                if (playBtn) playBtn.textContent = '⏸';
                if (musicIcon) musicIcon.classList.add('playing');
            }
        }

        // Update UI elements if they exist
        if (!isMusicPage) {
            updateNowPlaying(currentSong);
        }
    }

    // Save state to localStorage
    function saveMusicState() {
        localStorage.setItem('currentSong', currentSong);
        localStorage.setItem('isPlaying', isPlaying);
        if (musicPlayer) {
            localStorage.setItem('currentTime', musicPlayer.currentTime);
        }
    }

    function updateNowPlaying(index) {
        const songTitle = document.querySelector('.song-title');
        const songArtist = document.querySelector('.song-artist');

        if (songTitle) {
            songTitle.textContent = songs[index].title;
        }
        if (songArtist) {
            songArtist.textContent = 'SUP Game Console';
        }

        // Update playlist active state if on music page
        if (isMusicPage && playlistItems.length > 0) {
            playlistItems.forEach((item, i) => {
                if (i === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }

    function togglePlay() {
        if (!musicPlayer) return;
        if (isPlaying) {
            musicPlayer.pause();
            if (playBtn) playBtn.textContent = '▶';
            if (musicIcon) musicIcon.classList.remove('playing');
        } else {
            musicPlayer.play().catch(err => console.error('Error playing music:', err));
            if (playBtn) playBtn.textContent = '⏸';
            if (musicIcon) musicIcon.classList.add('playing');
        }
        isPlaying = !isPlaying;
        saveMusicState();
    }

    function previousTrack() {
        currentSong = (currentSong - 1 + songs.length) % songs.length;
        updateNowPlaying(currentSong);
        if (musicPlayer) {
            musicPlayer.src = songs[currentSong].src;
            if (isPlaying) {
                musicPlayer.play().catch(err => console.error('Error playing music:', err));
            }
        }
        saveMusicState();
    }

    function nextTrack() {
        currentSong = (currentSong + 1) % songs.length;
        updateNowPlaying(currentSong);
        if (musicPlayer) {
            musicPlayer.src = songs[currentSong].src;
            if (isPlaying) {
                musicPlayer.play().catch(err => console.error('Error playing music:', err));
            }
        }
        saveMusicState();
    }

    // Event listeners
    if (playBtn && isMusicPage) {
        playBtn.addEventListener('click', function () {
            playUISound();
            togglePlay();
        });
    }

    if (prevBtn && isMusicPage) {
        prevBtn.addEventListener('click', function () {
            playUISound();
            previousTrack();
        });
    }

    if (nextBtn && isMusicPage) {
        nextBtn.addEventListener('click', function () {
            playUISound();
            nextTrack();
        });
    }

    if (playlistItems.length > 0 && isMusicPage) {
        playlistItems.forEach((item, index) => {
            item.addEventListener('click', function () {
                playUISound();
                currentSong = index;
                updateNowPlaying(currentSong);
                if (musicPlayer) {
                    musicPlayer.src = songs[currentSong].src;
                    if (isPlaying) {
                        musicPlayer.play().catch(err => console.error('Error playing music:', err));
                    }
                }
                saveMusicState();
            });
        });
    }

    // Music player events
    if (musicPlayer) {
        musicPlayer.addEventListener('loadedmetadata', function () {
            if (durationEl && isMusicPage) {
                durationEl.textContent = formatTime(musicPlayer.duration);
            }
        });

        musicPlayer.addEventListener('timeupdate', function () {
            if (progressBar && currentTimeEl && isMusicPage) {
                const progress = (musicPlayer.currentTime / musicPlayer.duration) * 100;
                progressBar.style.width = progress + '%';
                currentTimeEl.textContent = formatTime(musicPlayer.currentTime);
            }
            // Save current time periodically to maintain position across page changes
            if (isPlaying) {
                saveMusicState();
            }
        });

        musicPlayer.addEventListener('ended', function () {
            nextTrack();
        });

        if (progressContainer && isMusicPage) {
            progressContainer.addEventListener('click', function (e) {
                const rect = progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const percentage = clickX / width;
                musicPlayer.currentTime = percentage * musicPlayer.duration;
                saveMusicState();
            });
        }

        if (volumeSlider && isMusicPage) {
            volumeSlider.addEventListener('click', function (e) {
                const rect = volumeSlider.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const volume = clickX / width;
                musicPlayer.volume = volume;
                if (volumeFill) {
                    volumeFill.style.width = (volume * 100) + '%';
                }
                saveMusicState();
            });
        }
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    // Load music state on page load
    loadMusicState();

    // Handle page visibility changes to pause/resume music appropriately
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            // Page is hidden, save the current state
            if (musicPlayer) {
                localStorage.setItem('currentTime', musicPlayer.currentTime);
            }
        } else {
            // Page is visible again, restore state if needed
            if (isPlaying) {
                musicPlayer.play().catch(err => console.error('Error resuming music:', err));
                if (playBtn) playBtn.textContent = '⏸';
                if (musicIcon) musicIcon.classList.add('playing');
            }
        }
    });

    // ===== KONTROL BUTTONS (DPAD & ACTION) =====
    // ===== KONTROL BUTTONS (DPAD & ACTION) =====
    // Don't add these listeners on game pages to avoid double sounds/conflicts with game logic
    const isGamePage = window.location.pathname.includes('snake.html') || window.location.pathname.includes('tetris.html');

    if (!isGamePage) {
        const controlButtons = document.querySelectorAll('.dpad-button, .action-btn');
        console.log("Tombol kontrol ditemukan:", controlButtons.length);

        controlButtons.forEach(button => {
            button.addEventListener('click', function () {
                console.log("Tombol kontrol diklik!");

                // Mainkan control sound (klik.mp3)
                playControlSound();

                // Efek visual
                this.style.transform = 'scale(0.90)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            });
        });
    }

    // ===== MUSIC CONTROL FUNCTIONS =====
    // Global functions untuk onclick handlers di musik.html
    window.goBack = function () {
        playUISound();
        setTimeout(() => {
            // Check if we're on a music/pesan/game page and navigate back to index
            if (window.location.pathname.includes('/pages/')) {
                window.location.href = '../index.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 200);
    };

    window.volumeUp = function () {
        if (musicPlayer && musicPlayer.volume < 1) {
            musicPlayer.volume = Math.min(1, musicPlayer.volume + 0.1);
            if (volumeFill) {
                volumeFill.style.width = (musicPlayer.volume * 100) + '%';
            }
            saveMusicState();
        }
    };

    window.volumeDown = function () {
        if (musicPlayer && musicPlayer.volume > 0) {
            musicPlayer.volume = Math.max(0, musicPlayer.volume - 0.1);
            if (volumeFill) {
                volumeFill.style.width = (musicPlayer.volume * 100) + '%';
            }
            saveMusicState();
        }
    };

    console.log("Script siap!");
});