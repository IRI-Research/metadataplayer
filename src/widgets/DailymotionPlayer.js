IriSP.Widgets.DailymotionPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.DailymotionPlayer.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.DailymotionPlayer.prototype.defaults = {
    aspect_ratio: 14/9
}

IriSP.Widgets.DailymotionPlayer.prototype.draw = function() {
    
    if (typeof this.video === "undefined") {
        this.video = this.media.video;
    }

    this.height = this.height || Math.floor(this.width / this.aspect_ratio);
    
    var _media = this.media,
        _this = this,
        _pauseState = true;
    
    /* Dailymotion utilise un système de fonctions référencées dans
     * des variables globales pour la gestion des événements.
     */
    
    window.onDailymotionPlayerReady = function() {

        var _player = document.getElementById(_this.container);
        
        _media.getCurrentTime = function() {
            return new IriSP.Model.Time(1000*_player.getCurrentTime());
        }
        _media.getVolume = function() {
            return _player.getVolume() / 100;
        }
        _media.getPaused = function() {
            return _pauseState;
        }
        _media.getMuted = function() {
            return _player.isMuted();
        }
        _media.setCurrentTime = function(_milliseconds) {
            _seekPause = _pauseState;
            return _player.seekTo(_milliseconds / 1000);
        }
        _media.setVolume = function(_vol) {
            return _player.setVolume(Math.floor(_vol*100));
        }
        _media.mute = function() {
            return _player.mute();
        }
        _media.unmute = function() {
            return _player.unMute();
        }
        _media.play = function() {
            return _player.playVideo();
        }
        _media.pause = function() {
            return _player.pauseVideo();
        }
        
        _player.addEventListener("onStateChange", "onDailymotionStateChange");
        _player.addEventListener("onVideoProgress", "onDailymotionVideoProgress");
        
        _player.cueVideoByUrl(_this.video);
        
        _media.trigger("loadedmetadata");
    }
    
    window.onDailymotionStateChange = function(_state) {
        switch(_state) {
            case 1:
                _media.trigger("play");
                _pauseState = false;
                break;
    
            case 2:
                _media.trigger("pause");
                _pauseState = true;
                break;
    
            case 3:
                _media.trigger("seeked");
                break;
        }
    }
    
    window.onDailymotionVideoProgress = function(_progress) {
        _media.trigger("timeupdate", new IriSP.Model.Time(_progress.mediaTime * 1000));
    }
    
    var params = {
        "allowScriptAccess" : "always",
        "wmode": "opaque"
    };
    
    var atts = {
        id : this.container
    };

    swfobject.embedSWF("http://www.dailymotion.com/swf?chromeless=1&enableApi=1", this.container, this.width, this.height, "8", null, null, params, atts);
    
}