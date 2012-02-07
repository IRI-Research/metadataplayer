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
            return _this.player.playVideo();
        },
        pause : function() {
            return _this.player.pauseVideo();
        },
        getPosition : function() {
            return _this.player.getCurrentTime();
        },
        seek : function(pos) {
            return _this.player.seekTo(pos);
        },
        getMute : function() {
            return _this.player.isMuted();
        },
        setMute : function(p) {
            return p ? _this.player.mute() : _this.player.unMute();
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
            this.callbacks.onSeek();
            break;

        case 5:
            this.callbacks.onReady();
            break;
    }
    
};
