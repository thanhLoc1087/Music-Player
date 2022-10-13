const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = 'Player';

const dashboard = $('.dashboard');
const playlist = $('.playlist');
const thumb = $('.cd-thumb');
const cd = $('.cd');
const playBtn = $('.control .btn-toggle-play');
const player = $('.player');
const songName = $('header h2');
const audio = $('#audio');
const background = $('.background');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const progress = $('.progress');
const rdnBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const optionView = $('.option-view');
const optionViewBody = $('.option-view-body');
const closeBtn = $('.btn-close')

const app = {
    currIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeated: false,

    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    songs: [
        {
            name: 'Billie Jean',
            singer: 'Michael Jackson',
            path: './asset/songs/BillieJean.mp3',
            img: './asset/images/billiejean.PNG',
            year: ''
        },
        {
            name: 'Queen Of Disaster',
            singer: 'Lana Del Rey',
            path: './asset/songs/QueenOfDisaster.mp3',
            img: './asset/images/Lana_Del_Rey.JPG',
            year: ''
        },
        {
            name: 'Wanna Go Home',
            singer: 'Akane, Sosu, Sora',
            path: './asset/songs/WannaGoHome.mp3',
            img: './asset/images/home.JPG',
            year: '2013'
        },
        {
            name: 'Church Girl',
            singer: 'Beyonce',
            path: './asset/songs/CHURCHGIRL.mp3',
            img: './asset/images/beyonce.JPG',
            year: '2022'
        },
        {
            name: 'Cuff It',
            singer: 'Beyonce',
            path: './asset/songs/CUFFIT.mp3',
            img: './asset/images/beyonce.JPG',
            year: '2022'
        },
        {
            name: 'I Like You (A Happier Song)',
            singer: 'Post Malone ft.Doja Cat',
            path: './asset/songs/ILikeYou.mp3',
            img: './asset/images/postmalone.JPG',
            year: '2022'
        },
        {
            name: 'Say So (MTV 2020)',
            singer: 'Doja Cat',
            path: './asset/songs/SaySo.mp3',
            img: './asset/images/dojacat.JPG',
            year: '2020'
        },
        {
            name: 'Oxytocin',
            singer: 'Billie Eilish',
            path: './asset/songs/Oxytocin.mp3',
            img: './asset/images/billieeilish.JPG',
            year: '2021'
        },
    ],
    
    render: function() {
        const html = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currIndex ? 'active' : ''}" data-index=${index}>
                    <div class="thumb" style="background-image: url('${song.img}')">
                    </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        $('.playlist').innerHTML = html.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currIndex];
            }
        })
    },

    handleEvents: function() {
        const _this = this;

        // Thu/phong cd
        const cdWidth = cd.offsetWidth;

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCDWidth = cdWidth - scrollTop;
            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px': 0;
            cd.style.opacity = newCDWidth/cdWidth;
            dashboard.style.marginTop = newCDWidth/cdWidth * 4 + 'px';
        }

        // Play music
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        // Vinyl CD
        const cdThumbAnimate = thumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 30000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // When song is played
        audio.onplay = function() {
            playBtn.title = 'Pause';
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // When song is paused
        audio.onpause = function() {
            playBtn.title = 'Play';
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Progress bar
        audio.ontimeupdate = function() {
            if (audio.currentTime) {
                const progressPercent = (audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }

        // Skip part of song 
        progress.onchange = function(e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // Next Song 
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandom();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToACtiveSong();
        }
        // Prev Song 
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandom();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToACtiveSong();
        }

        //Random songs
        rdnBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            rdnBtn.classList.toggle('active', _this.isRandom);
            _this.setConfig("isRandom", _this.isRandom);
        }

        // Auto move on
        audio.onended = function() {
            if (_this.isRepeated) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Repeat song
        repeatBtn.onclick = function() {
            _this.isRepeated = !_this.isRepeated;
            repeatBtn.classList.toggle('active', _this.isRepeated);
            _this.setConfig("isRepeated", _this.isRepeated);
        }

        // Play selected song
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode && !e.target.closest('.option')) {
                _this.currIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                _this.render();
                audio.play();
            }
            if (e.target.closest('.option')) {
                let index = Number(e.target.closest('.song').dataset.index);
                optionViewBody.innerHTML = `
                    <h2>${_this.songs[index].name}</h2>
                    <h4>${_this.songs[index].singer}</h4>
                    <span>Year: ${_this.songs[index].year}</span>
                    `;
                optionView.style.visibility = 'visible';
            }
        }

        closeBtn.onclick = function() {
            optionView.style.visibility = 'hidden';
        }
        optionView.onclick = function() {
            optionView.style.visibility = 'hidden';
        }
    },

    scrollToACtiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 500)
    },

    loadCurrentSong: function() {

        songName.textContent = this.currentSong.name;
        thumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path;
        background.style.backgroundImage = `url('${this.currentSong.img}')`
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeated = this.config.isRepeated;
    },

    nextSong: function() {
        this.currIndex++;
        if (this.currIndex >= this.songs.length) {
            this.currIndex = 0;
        }
        this.loadCurrentSong();
    },
    
    prevSong: function() {
        this.currIndex--;
        if (this.currIndex < 0) {
            this.currIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandom: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currIndex)
        this.currIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        //Object definition
        this.defineProperties();
        // Events Listener / Handler
        this.handleEvents();
        // Load first song of playlist into Dashboard
        this.loadCurrentSong();
        // Playlists Rendering
        this.render();

        // Load config
        this.loadConfig();
        rdnBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeated);
    },
}

app.start();