IriSP.Widgets.JwpPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.JwpPlayer.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.JwpPlayer.prototype.defaults = {
}

IriSP.Widgets.JwpPlayer.prototype.draw = function() {

    var _opts = {},
        _player = jwplayer("#" + this.container),
        _seekPause = false,
        _pauseState = true,
        _props = [ "live", "provider", "autostart" ];
    
    if (typeof this.video === "undefined") {
        this.video = this.media.video;
    }
    
    if (typeof this.streamer === "function") {
        this.streamer = this.streamer(this.video);
    }

    if (typeof this.streamer === "string") {
        this.video = this.video.replace(this.streamer,"");
        _opts.streamer = this.streamer;
    }
        
    _opts.file = this.video;
    _opts.flashplayer = IriSP.getLib("jwPlayerSWF");
    _opts["controlbar.position"] = "none";
    
    for (var i = 0; i < _props.length; i++) {
        if (typeof this[_props[i]] !== "undefined") {
            _opts[_props[i]] = this[_props[i]];
        }
    }
    
    if (this.autostart) {
        _pauseState = false;
        this.media.trigger("play");
    }
    // Binding functions to jwplayer

    this.media.getCurrentTime = function() {
        return new IriSP.Model.Time(1000*_player.getPosition());
    }
    this.media.getVolume = function() {
        return _player.getVolume() / 100;
    }
    this.media.getPaused = function() {
        return _pauseState;
    }
    this.media.getMuted = function() {
        return _player.getMute();
    }
    this.media.setCurrentTime = function(_milliseconds) {
        _seekPause = _pauseState;
        return _player.seek(_milliseconds / 1000);
    }
    this.media.setVolume = function(_vol) {
        return _player.setVolume(Math.floor(_vol*100));
    }
    this.media.mute = function() {
        return _player.setMute(true);
    }
    this.media.unmute = function() {
        return _player.setMute(false);
    }
    this.media.play = function() {
        return _player.play(true);
    }
    this.media.pause = function() {
        return _player.pause(true);
    }
    
    // Binding jwplater events to media
    
    var _media = this.media;
    
    _opts.events = {
        onReady: function() {
            _media.trigger("loadedmetadata");
        },
        onTime: function() {
            if (_seekPause) {
                _player.pause(true);
                _seekPause = false;
            } else {
                if (_pauseState && _player.getState() === "PLAYING") {
                    _pauseState = false;
                    _media.trigger("play");
                }
            }
            _this.trigger("timeupdate", _media.getCurrentTime());
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
        }
    }
    console.log("Before Setup", _opts);
    _player.setup(_opts);
    
    console.log("OK");
    
    this.jwplayer = _player;
    
}