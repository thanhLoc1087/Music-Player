const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const app = {
        currIndex: 0,
        isPlaying: false,

        songs: [
            {
                name: 'Queen Of Disaster',
                singer: 'Lana Del Rey',
                path: './asset/songs/QueenOfDisaster.mp3',
                img: './asset/images/Lana_Del_Rey.jpg'
            },
            {
                name: 'Wanna Go Home',
                singer: 'Akane, Sosu, Sora',
                path: './asset/songs/WannaGoHome.mp3',
                img: './asset/images/home.JPG'
            },
            {
                name: 'Church Girl',
                singer: 'Beyonce',
                path: './asset/songs/CHURCHGIRL.mp3',
                img: './asset/images/beyonce.jpg'
            },
            {
                name: 'Cuff It',
                singer: 'Beyonce',
                path: './asset/songs/CUFFIT.mp3',
                img: './asset/images/beyonce.jpg'
            },
            {
                name: 'I Like You (A Happier Song)',
                singer: 'Post Malone ft.Doja Cat',
                path: './asset/songs/ILikeYou.mp3',
                img: './asset/images/postmalone.jpg'
            },
            {
                name: 'Say So (MTV 2020)',
                singer: 'Doja Cat',
                path: 'asset/songs/SaySo.mp3',
                img: 'asset/images/dojacat.jpg'
            },
            {
                name: 'Oxytocin',
                singer: 'Billie Eilish',
                path: './asset/songs/oxytocin.mp3',
                img: './asset/images/billieeilish.jpg'
            },
        ],
        
        render: function() {
            const html = this.songs.map(song => {
                return `<div class="song">
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
            const thumb = $('.cd-thumb');

            // Thu/phong cd
            const cd = $('.cd');
            const cdWidth = cd.offsetWidth;

            document.onscroll = function() {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newCDWidth = cdWidth - scrollTop;
                cd.style.width = newCDWidth > 0 ? newCDWidth + 'px': 0;
                cd.style.opacity = newCDWidth/cdWidth;
            }

            // Play music
            const playBtn = $('.control .btn-toggle-play');
            const player = $('.player');
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
            const progress = $('.progress');
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
        },

        loadCurrentSong: function() {
            const songName = $('header h2');
            const thumb = $('.cd-thumb');
            const audio = $('#audio');
            const background = $('.background');

            songName.textContent = this.currentSong.name;
            thumb.style.backgroundImage = `url('${this.currentSong.img}')`
            audio.src = this.currentSong.path;
            background.style.backgroundImage = `url('${this.currentSong.img}')`
        },

        start: function () {
            //Object definition
            this.defineProperties();
            // Events Listener / Handler
            this.handleEvents();
            // Load first song of playlist into Dashboard
            this.loadCurrentSong();
            // Playlists Rendering
            this.render();
        },
    }
    
    app.start();
