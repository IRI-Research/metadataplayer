/* To wrap a player the develop should create a new class derived from
the IriSP.PopcornReplacement.player and defining the correct functions */

/** jwplayer player wrapper */
IriSP.PopcornReplacement.dailymotion = function(container, options) {
    /* Appel du constructeur de la classe parente */
    IriSP.PopcornReplacement.player.call(this, container, options);   
    
    var _this = this;

    /* Définition des fonctions de commande :
     this.playerFns.play, .pause, .getPosition, .seek,
     .getMute, .setMute, .getVolume, .setVolume
     doivent être rattachés aux fonctions du player
     * */

    this.playerFns = {
        play : function() {
            if (_this.player) {
                return _this.player.playVideo();
            } else {
                return false;
            }
        },
        pause : function() {
            if (_this.player) {
                return _this.player.pauseVideo();
            } else {
                return false;
            }
        },
        getPosition : function() {
            if (_this.player) {
                return _this.player.getCurrentTime();
            } else {
                return 0;
            }
        },
        seek : function(pos) {
            if (_this.player) {
                return _this.player.seekTo(pos);
            } else {
                return false;
            }
        },
        getMute : function() {
            if (_this.player) {
                return _this.player.isMuted();
            } else {
                return false;
            }
        },
        setMute : function(p) {
            if (_this.player) {
                if (p) {
                    _this.player.mute();
                }
                else {
                    _this.player.unMute();
                }
            }
        },
        getVolume : function() {
            if (_this.player) {
                return _this.player.getVolume() / 100;
            } else {
                return false;
            }
        },
        setVolume : function(p) {
            if (_this.player) {
                _this.player.setVolume(Math.floor(100 * p));
            }
        },
    }
    
    /* Dailymotion utilise un système de fonctions référencées dans
     * des variables globales pour la gestion des événements.
     */
    
    window.onDailymotionPlayerReady = function() {
        _this.onReady();
    };
    window.onDailymotionStateChange = function(_state) {
        _this.onStateChange(_state);
    }
    window.onDailymotionVideoProgress = function(_progress) {
        _this.onProgress(_progress);
    }

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

IriSP.PopcornReplacement.dailymotion.prototype.onReady = function() {
    
    this.player = document.getElementById(this.container);
    
    this.player.addEventListener("onStateChange", "onDailymotionStateChange");
    this.player.addEventListener("onVideoProgress", "onDailymotionVideoProgress");
    this.player.cueVideoByUrl(this._options.video);
    
    this.trigger("loadedmetadata");
};

IriSP.PopcornReplacement.dailymotion.prototype.onProgress = function(progressInfo) {
    this.trigger("timeupdate");
}

IriSP.PopcornReplacement.dailymotion.prototype.onStateChange = function(state) {
    
    switch(state) {
        case 1:
            this.trigger("play");
            break;

        case 2:
            this.trigger("pause");
            break;

        case 3:
            this.trigger("seeked");
            break;
    }
    
};