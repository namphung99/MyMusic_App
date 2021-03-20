const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const headerSong = $('header h2');
const headerSinger = $('header h3');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');
const allSong = $$('.song');


const app ={

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Gene',
            singer: 'Binz',
            path: '../assets/music/Gene-BinzTouliver-5961947.mp3',
            img:'https://ss-images.saostar.vn/2019/05/13/5177543/batch_geneartwork.jpg'
        },
        {
            name: 'Dân Chơi Xóm',
            singer: 'JustaTee, RPT MCK',
            path: '../assets/music/justatee_rpt_mck_dan_choi_xom_team_karik_rap_viet_mv_lyrics_-135602791986821408.mp3',
            img:'https://kenh14cdn.com/thumb_w/660/203336854389633024/2020/11/19/hinh24-1605758619816777534288.jpg'
        },
        {
            name: 'Mười Năm',
            singer: 'Đen Vâu',
            path: '../assets/music/MuoiNamLonXon3-DenNgocLinh-5869931.mp3',
            img:'https://image.phunuonline.com.vn/news/2019/20191109/fckimage/168832_6-91838732.jpg'
        },
        {
            name: 'Dusk Till Dawn',
            singer: 'ZAYN & Sia ',
            path: '../assets/music/song1.mp3',
            img:'https://2.bp.blogspot.com/-N8GRUBaG3d0/XV-h49UTmTI/AAAAAAAAAw8/P_eWOyi7TEMrnTe39O9EhC3yhJfXRT9lgCLcBGAs/s1600/46211920684_2208604ec0_k.jpg'
        },
        {
            name: 'Anh Đếch Cần Gì Nhiều Ngoài Em',
            singer: 'Đen Vâu',
            path: '../assets/music/AnhDechCanGiNhieuNgoaiEm-DenVuThanhDong-5749937.mp3',
            img:'https://duyendangvietnam.net.vn/public/uploads/files/Chau%20Chau%205/AVATAR_DEN.png'
        },
        {
            name: 'Hai Triệu Năm',
            singer: 'Đen Vâu',
            path: '../assets/music/HaiTrieuNam-DenBien-6007307.mp3',
            img:'https://review.edu.vn/wp-content/uploads/2019/06/hinh-anh-che-hai-huoc-den-vau-17.jpg'
        },
        {
            name: 'Sao Cũng Được',
            singer: 'Binz',
            path: '../assets/music/SaoCungDuocGuitarVersion-Binz-5411337.mp3',
            img:'https://kenh14cdn.com/2018/4/26/binz-15247461584952012951072.png'
        },
        {
            name: 'SoFar',
            singer: 'Binz',
            path: '../assets/music/SoFar-Binz-5521790.mp3',
            img:'https://i.ytimg.com/vi/_MM1MQgFjRM/maxresdefault.jpg'
        },
        {
            name: 'TheySaid',
            singer: 'Binz',
            path: '../assets/music/TheySaid-TouliverBinz-5302431.mp3',
            img:'https://i.ytimg.com/vi/XdBsAXOxYfo/hqdefault.jpg'
        }
    ],
    render: function(){
        let htmls = this.songs.map((song,index)=>{
            return `<div class="song ${index === this.currentIndex ? 'active':''}" data-id="${index}">
                        <div class="thumb"
                            style="background-image: url('${song.img}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`;
        });
        playList.innerHTML = htmls.join('');
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{ // định nghĩa ra bài hát mặc định khi vào ứng dụng
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // xử lý CD quay và dừng
        const  cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 50000,
            interaction: Infinity
        });

        cdThumbAnimate.pause();

        // Xử lý phóng tp thu nhỏ cd khi scroll
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCDWidth = cdWidth - scrollTop;
            console.log(newCDWidth);
            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px':0;
            cd.style.opacity = newCDWidth / cdWidth;
        }

        // Xử lý click btn play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();  
            }else{
                audio.play();
            }
        }

        // khi song play 
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // khi song pause 
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // timeupdate -- tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Tua
        progress.onchange = function(e){
            const seekTime = audio.duration / 100*e.target.value;
            audio.currentTime = seekTime;
        }

        // handle next
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else {
                _this.nextSong();
                _this.render();
                _this.scrollToActiveSong();
            }
            audio.play();
        }

        // handle prev
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }else {
                _this.prevSong();
                _this.render();
                _this.scrollToActiveSong();
            }
            audio.play();
        }

        // random song
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active',_this.isRandom);
        }

        // xử lý sau khi audio ended
        audio.onended= function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
                _this.render();
                _this.scrollToActiveSong();
            }
        }

        // xử lý phát lại bài hát
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }

        // lắng nghe hành vi click vào playList
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){ // kiểm tra lick vào song và con của nó

                //xử lý khi click vào song
                if(songNode){
                    let newIndex = Number(songNode.getAttribute('data-id'));


                    _this.currentIndex = newIndex;
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                
            }
        }
    },

    scrollToActiveSong: function(){
       setTimeout(() => {
            if(this.currentIndex > 2){
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }else{
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            }
       },200)
    },

    loadCurrentSong: function(){

        headerSong.textContent = this.currentSong.name;
        headerSinger.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;

    },

    nextSong: function(){
        
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function(){
        
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function(){

        // định nghĩa các thuộc tính cho object
        this.defineProperties();

        // xử lý các DOM event
        this.handleEvents();
        // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        this.render();

    }
}

app.start();

