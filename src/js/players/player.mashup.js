/* To wrap a player the develop should create a new class derived from
the IriSP.PopcornReplacement.player and defining the correct functions */

/** jwplayer player wrapper */
IriSP.PopcornReplacement.mashup = function(container, options) {
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
                return _this.player.getVolume() / 2;
            } else {
                return false;
            }
        },
        setVolume : function(p) {
            if (_this.player) {
                _this.player.setVolume(Math.floor(2 * p));
            }
        },
    }
    
    /* Dailymotion utilise un système de fonctions référencées dans
     * des variables globales pour la gestion des événements.
     */
    
    window.onBabPlayerReady = function() {
        _this.onReady();
    };
    window.onBabStateChange = function(_state) {
        _this.onStateChange(_state);
    }
    window.onBabVideoProgress = function(_progress) {
        _this.onProgress(_progress);
    }

    var params = {
        allowScriptAccess : "always",
        wmode: "transparent",
        quality: "high",
        menu: true,
        bgcolor: "#869ca7"
    };
    var atts = {
        id : this.container
    };
    var flashvars = {
        urlData: options.mashup_xml
    };
    swfobject.embedSWF(options.mashup_swf, this.container, options.width, options.height, "8", null, flashvars, params, atts);

};

IriSP.PopcornReplacement.mashup.prototype = new IriSP.PopcornReplacement.player("", {});

IriSP.PopcornReplacement.mashup.prototype.onReady = function() {
    this.player = document.getElementById(this.container);
    this.trigger("loadedmetadata");
};

IriSP.PopcornReplacement.mashup.prototype.onProgress = function(progressInfo) {
    this.trigger("timeupdate");
}

IriSP.PopcornReplacement.mashup.prototype.onStateChange = function(state) {

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