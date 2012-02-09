/* To wrap a player the develop should create a new class derived from
the IriSP.PopcornReplacement.player and defining the correct functions */

/** jwplayer player wrapper */
IriSP.PopcornReplacement.dailymotion = function(container, options) {
    console.log("Calling");
    /* appel du parent pour initialiser les structures communes à tous les players */
    IriSP.PopcornReplacement.player.call(this, container, options);   
    
    var _this = this;

    /* Définition des fonctions de l'API -  */

    this.playerFns = {
        play : function() {
            if (_this.player) {
                return _this.player.playVideo();
            } else {
                console.log("Play on undefined player");
                return false;
            }
        },
        pause : function() {
            if (_this.player) {
                return _this.player.pauseVideo();
            } else {
                console.log("Pause on undefined player");
                return false;
            }
        },
        getPosition : function() {
            if (_this.player) {
                return _this.player.getCurrentTime();
            } else {
                console.log("getPosition on undefined player");
                return 0;
            }
        },
        seek : function(pos) {
            if (_this.player) {
                return _this.player.seekTo(pos);
            } else {
                console.log("seek on undefined player");
                return false;
            }
        },
        getMute : function() {
            if (_this.player) {
                return _this.player.isMuted();
            } else {
                console.log("getMute on undefined player");
                return false;
            }
        },
        setMute : function(p) {
            if (_this.player) {
                return p ? _this.player.mute() : _this.player.unMute();
            } else {
                console.log("setMute on undefined player");
                return false;
            }
        }
    }

    window.onDailymotionPlayerReady = IriSP.wrap(this, this.ready);
    window.onDailymotionStateChange = IriSP.wrap(this, this.stateHandler);
    window.onDailymotionVideoProgress = IriSP.wrap(this, this.progressHandler);

    var params = {
        "allowScriptAccess" : "always",
        "wmode": "opaque"
    };
    var atts = {
        id : this.container
    };
    swfobject.embedSWF("http://www.dailymotion.com/swf?chromeless=1&enableApi=1", this.container, options.width, options.height, "8", null, null, params, atts);

};

IriSP.PopcornReplacement.dailymotion.prototype = new IriSP.PopcornReplacement.player("", {});

IriSP.PopcornReplacement.dailymotion.prototype.ready = function() {
    
    this.player = document.getElementById(this.container);
    
    this.player.addEventListener("onStateChange", "onDailymotionStateChange");
    this.player.addEventListener("onVideoProgress", "onDailymotionVideoProgress");
    this.player.cueVideoByUrl(this._options.video);
};

IriSP.PopcornReplacement.dailymotion.prototype.progressHandler = function(progressInfo) {
    
    this.callbacks.onTime({
        position: progressInfo.mediaTime
    });
}

IriSP.PopcornReplacement.dailymotion.prototype.stateHandler = function(state) {
    
    switch(state) {
        case 1:
            this.callbacks.onPlay();
            break;

        case 2:
            this.callbacks.onPause();
            break;

        case 3:
            this.callbacks.onSeek({
                position: this.player.getCurrentTime()
            });
            break;

        case 5:
            this.callbacks.onReady();
            break;
    }
    
};