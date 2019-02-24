// Author: Luis Souza
// PLAYR App - just a simple app that loads 5 musics
// and play them sequentially or by being tapped.

let app = {
    track: [{
        id: 1,
        src: 'file:///android_asset/www/media/Believer.mp3',
        img: 'file:///android_asset/www/img/img1.png',
        volume: 0.5,
        title: 'Believer',
        artist: "Imagine Dragons"
    },
    {
        id: 2,
        src: 'file:///android_asset/www/media/Hallelujah.mp3',
        img: 'file:///android_asset/www/img/img2.png',
        volume: 0.5,
        title: 'Hallelujah',
        artist: "Pentatonix"
    },
    {
        id: 3,
        src: 'file:///android_asset/www/media/Imagine.mp3',
        img: 'file:///android_asset/www/img/img3.png',
        volume: 0.5,
        title: 'I Can Only Imagine',
        artist: "Mercy Me"
    },
    {
        id: 4,
        src: 'file:///android_asset/www/media/Shape.mp3',
        img: 'file:///android_asset/www/img/img4.png',
        volume: 0.5,
        title: 'Shape of You',
        artist: "Ed Sheeran"
    },
    {
        id: 5,
        src: 'file:///android_asset/www/media/whistle.mp3',
        img: 'file:///android_asset/www/img/img5.png',
        volume: 0.5,
        title: 'Whistle',
        artist: "50 by 1"
    }],
    media: null,
    pages: [],
    tracksel: -1,
    musicStatus: 0,
    m_dur: -1,
    ended: false,
    status: {
        '0': 'MEDIA_NONE',
        '1': 'MEDIA_STARTING',
        '2': 'MEDIA_RUNNING',
        '3': 'MEDIA_PAUSED',
        '4': 'MEDIA_STOPPED'
    },
    err: {
        '1': 'MEDIA_ERR_ABORTED',
        '2': 'MEDIA_ERR_NETWORK',
        '3': 'MEDIA_ERR_DECODE',
        '4': 'MEDIA_ERR_NONE_SUPPORTED'
    },
    init: function () {
        document.addEventListener('deviceready', app.ready, false);
    },
    ready: function () {
        app.addListeners();
    },
    ftw: function () {
        //success creating the media object and playing or stopping
        if (app.musicStatus == Media.MEDIA_STOPPED && app.ended) {
            app.tracksel++;
            if (app.tracksel == 5) app.tracksel = 0;
            app.media.release();
            app.media = new Media(app.track[app.tracksel].src, app.ftw, app.wtf, app.statusChange);
            app.media.play();
        };
    },
    wtf: function (err) {
        //failure of playback of media object
        console.warn('failure');
        console.error(err);
    },
    statusChange: function (status) {
        console.log('media status is now ' + app.status[status]);
        app.musicStatus = status;
        if (status == Media.MEDIA_RUNNING) app.ended = true;
    },
    addListeners: function () {
        document.querySelector('#play-btn').addEventListener('click', app.play);
        document.querySelector('#pause-btn').addEventListener('click', app.pause);
        document.querySelector('#stop-btn').addEventListener('click', app.stop);
        document.querySelector('#up-btn').addEventListener('click', app.volumeUp);
        document.querySelector('#down-btn').addEventListener('click', app.volumeDown);
        document.querySelector('#ff-btn').addEventListener('click', app.ff);
        document.querySelector('#rew-btn').addEventListener('click', app.rew);
        document.addEventListener('pause', () => {
            app.media.release();
        });
        document.addEventListener('menubutton', () => {
            console.log('clicked the menu button');
        });
        document.addEventListener('resume', () => {
            app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
        });
        let arrayItems = document.querySelectorAll('.music-item');
        arrayItems.forEach(function (item) {
            item.addEventListener("click", app.play);
        });
        let arrayDetails = document.querySelectorAll('.music-details');
        arrayDetails.forEach(function (det) {
            det.addEventListener("click", app.detail);
        });
        document.querySelector('#back-btn').addEventListener('click', app.back);
    },
    play: function (e) {
        if (!e.target.id) {
            app.tracksel = e.target.parentElement.id - 1;
        } else {
            app.tracksel = e.target.id - 1;
        };
        if (app.tracksel == -1) {
            let src = app.track[0].src;
            app.tracksel = 0;
            app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
        } else {
            if (e.target.id > 0 || e.target.parentElement.id > 0) {
                if (app.musicStatus == Media.MEDIA_RUNNING || app.musicStatus == Media.MEDIA_PAUSED) {
                    app.ended = false;
                    app.media.stop();
                    app.media.release();
                };
                let src = app.track[app.tracksel].src;
                app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
            };
        };
        app.media.play();
    },
    pause: function () {
        app.media.pause();
    },
    stop: function () {
        app.media.stop();
        app.ended = false;
    },
    volumeUp: function () {
        vol = app.track[app.tracksel].volume;
        console.log('current volume UP', vol);
        vol += 0.1;
        if (vol > 1) {
            vol = 1.0;
        };
        console.log('current volume UP', vol);
        app.media.setVolume(vol);
        app.track[app.tracksel].volume = vol;
    },
    volumeDown: function () {
        vol = parseFloat(app.track[app.tracksel].volume);
        console.log('current volume DOWN', vol);
        vol -= 0.1;
        if (vol < 0) {
            vol = 0;
        };
        console.log('current volume DOWN', vol);
        app.media.setVolume(vol);
        app.track[app.tracksel].volume = vol;
    },
    ff: function () {
        app.media.getCurrentPosition((pos) => {
            let dur = app.media.getDuration();
            console.log('current position', pos);
            console.log('duration', dur);
            pos += 10;
            if (pos < dur) {
                app.media.seekTo(pos * 1000);
            };
        });
    },
    rew: function () {
        app.media.getCurrentPosition((pos) => {
            pos -= 10;
            if (pos > 0) {
                app.media.seekTo(pos * 1000);
            } else {
                app.media.seekTo(0);
            }
        });
    },
    detail: function (e) {
        e.stopPropagation();
        pages = document.querySelectorAll(".pages");
        pages[0].classList.toggle("hide");
        pages[1].classList.toggle("hide");
        if (app.tracksel != e.target.id - 1) {
            if (app.musicStatus == Media.MEDIA_RUNNING || app.musicStatus == Media.MEDIA_PAUSED) {
                app.ended = false;
                app.media.stop();
                app.media.release();
            }
            app.tracksel = e.target.id - 1;
            let src = app.track[app.tracksel].src;
            app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
            app.media.play();
        }
        document.querySelector("#m-img").src = app.track[app.tracksel].img;
        document.querySelector("#m-img").alt = app.track[app.tracksel].title;
        document.querySelector("#m-artist").textContent = app.track[app.tracksel].artist;
        document.querySelector("#m-title").textContent = app.track[app.tracksel].title;
        let inter = setInterval(() => {
            if (app.m_dur == -1) {
                app.m_dur = app.media.getDuration();
            } else {
                clearInterval(inter);
                let date = new Date(null);
                date.setSeconds(parseInt(app.m_dur));
                app.m_dur = date.toISOString().substr(14, 5);
                document.querySelector("#m-duration").textContent = app.m_dur;
                app.m_dur = -1;
            }
        }, 100);
    },
    back: function (e) {
        e.stopPropagation();
        pages = document.querySelectorAll(".pages");
        pages[0].classList.toggle("hide");
        pages[1].classList.toggle("hide");
    }
};

app.init();