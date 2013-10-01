IriSP.Widgets.JwpPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.JwpPlayer.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.JwpPlayer.prototype.defaults = {
};

IriSP.Widgets.JwpPlayer.prototype.draw = function() {
    
    var _opts = {},
        _player = jwplayer(this.$[0]),
        _seekPause = false,
        _pauseState = true;
    
    if (typeof this.video === "undefined") {
        this.video = this.media.video;
    }
        
    _opts.file = this.video;
    _opts.flashplayer = IriSP.getLib("jwPlayerSWF");
    _opts.primary = "flash";
    _opts.fallback = false;
    _opts.controls = false;
    _opts.width = this.width;
    if (this.height) {
        _opts.height = this.height;
    }
    
    if (this.autostart) { // There seems to be an autostart bug
        //_opts.autostart = true;
        //_pauseState = false;
        //this.media.trigger("play");
    }
    
    if (this.url_transform) {
        _opts.file = this.url_transform(_opts.file);
    }

    // Binding functions to jwplayer

    var _media = this.media;
    
    _media.on("setcurrenttime", function(_milliseconds) {
        _seekPause = _pauseState;
        _player.seek(_milliseconds / 1000);
    });
    
    _media.on("setvolume", function(_vol) {
        _player.setVolume(Math.floor(_vol*100));
        _media.volume = _vol;
    });
    
    _media.on("setmuted", function(_muted) {
        _player.setMute(_muted);
        _media.muted = _muted;
    });
    
    _media.on("setplay", function() {
        _player.play(true);
        _media.paused = false;
    });
    
    _media.on("setpause", function() {
        _player.pause(true);
        _media.paused = true;
    });
    
    // Binding jwplater events to media
    
    function getVolume() {
        _media.muted = _player.getMute();
        _media.volume = _player.getVolume() / 100;
    }
    
    _opts.events = {
        onReady: function() {
            getVolume();
            _media.currentTime = new IriSP.Model.Time(1000*_player.getPosition() || 0);
            _media.trigger("loadedmetadata");
        },
        onTime: function(_progress) {
            if (_seekPause) {
                _player.pause(true);
                _seekPause = false;
            } else {
                if (_pauseState && _player.getState() === "PLAYING") {
                    _pauseState = false;
                    _media.trigger("play");
                }
            }
            _media.trigger("timeupdate", new IriSP.Model.Time(_progress.position * 1000));
        },
        onPlay: function() {
            if (!_seekPause) {
                _pauseState = false;
                _media.trigger("play");
            }
        },
        onPause: function() {
            _pauseState = true;
            _media.trigger("pause");
        },
        onSeek: function() {
            _media.trigger("seeked");
        },
        onMute: function(_event) {
            _media.muted = _event.mute;
            _media.trigger("volumechange");
        },
        onVolume: function(_event) {
            _media.volume = _event.volume / 100;
            _media.trigger("volumechange");
        }
    };
    
    _player = _player.setup(_opts);
    
    this.jwplayer = _player;
    
};