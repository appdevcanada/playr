//https://www.npmjs.com/package/cordova-plugin-android-volume
//plugin to retrieve the android system volumes

//https://cordova.apache.org/docs/en/8.x/reference/cordova-plugin-media/index.html
// cordova media plugin

let app = {
    track: {
        src: 'file:///android_asset/www/media/fight-club.mp3',
        title: 'Fight Club Rules',
        volume: 0.5
    },
    media:null,
    status:{
        '0':'MEDIA_NONE',
        '1':'MEDIA_STARTING',
        '2':'MEDIA_RUNNING',
        '3':'MEDIA_PAUSED',
        '4':'MEDIA_STOPPED'
    },
    err:{
        '1':'MEDIA_ERR_ABORTED',
        '2':'MEDIA_ERR_NETWORK',
        '3':'MEDIA_ERR_DECODE',
        '4':'MEDIA_ERR_NONE_SUPPORTED'
    },
    init: function() {
        document.addEventListener('deviceready', app.ready, false);
    },
    ready: function() {
        app.addListeners();
        let src = app.track.src;
        app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
    },
    ftw: function(){
        //success creating the media object and playing, stopping, or recording
        console.log('success doing something');
    },
    wtf: function(err){
        //failure of playback of media object
        console.warn('failure');
        console.error(err);
    },
    statusChange: function(status){
        console.log('media status is now ' + app.status[status] );
    },
    addListeners: function(){
        document.querySelector('#play-btn').addEventListener('click', app.play);
        document.querySelector('#pause-btn').addEventListener('click', app.pause);
        document.querySelector('#up-btn').addEventListener('click', app.volumeUp);
        document.querySelector('#down-btn').addEventListener('click', app.volumeDown);
        document.querySelector('#ff-btn').addEventListener('click', app.ff);
        document.querySelector('#rew-btn').addEventListener('click', app.rew);
        document.addEventListener('pause', ()=>{
            app.media.release();
        });
        document.addEventListener('menubutton', ()=>{
            console.log('clicked the menu button');
        });
        document.addEventListener('resume', ()=>{
            app.media = new Media(src, app.ftw, app.wtf, app.statusChange);
        })
    },
    play: function(){
        app.media.play();
    },
    pause: function(){
        app.media.pause();
    },
    volumeUp: function(){
        vol = parseFloat(app.track.volume);
        console.log('current volume', vol);
        vol += 0.1;
        if(vol > 1){
            vol = 1.0;
        }
        console.log(vol);
        app.media.setVolume(vol);
        app.track.volume = vol;
    },
    volumeDown: function(){
        vol = app.track.volume;
        console.log('current volume', vol);
        vol -= 0.1;
        if(vol < 0){
            vol = 0;
        }
        console.log(vol);
        app.media.setVolume(vol);
        app.track.volume = vol;
    },
    ff: function(){
        app.media.getCurrentPosition((pos)=>{
            let dur = app.media.getDuration();
            console.log('current position', pos);
            console.log('duration', dur);
            pos += 10;
            if(pos < dur){
                app.media.seekTo( pos * 1000 );
            }
        });
    },
    rew: function(){
        app.media.getCurrentPosition((pos)=>{
            pos -= 10;
            if( pos > 0){
                app.media.seekTo( pos * 1000 );
            }else{
                app.media.seekTo(0);
            }
        });
    }
};

app.init();