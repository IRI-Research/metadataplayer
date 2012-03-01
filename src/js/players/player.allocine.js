/* To wrap a player the develop should create a new class derived from
the IriSP.PopcornReplacement.player and defining the correct functions */

/** allocine player wrapper */
IriSP.PopcornReplacement.allocine = function(container, options) {
//    console.log("Calling allocine player");
    /* appel du parent pour initialiser les structures communes à tous les players */
    IriSP.PopcornReplacement.player.call(this, container, options);   
    
    var _this = this;

    /* Définition des fonctions de l'API -  */

    this.playerFns = {
        play : function() {
            if (_this.player) {
            //    console.log("ask play _this.player = " + _this.player);
                return _this.player.sendToActionScript("play");
            } else {
                return false;
            }
        },
        pause : function() {
            if (_this.player) {
            //    console.log("ask pause _this.player = " + _this.player);
                return _this.player.sendToActionScript("pause");
            } else {
                return false;
            }
        },
        getPosition : function() {
            if (_this.player) {
                return _this.player.sendToActionScript("getSeek","return");
            } else {
                return 0;
            }
        },
        seek : function(pos) {
            if (_this.player) {
                return _this.player.sendToActionScript("seek",pos);
            } else {
                return false;
            }
        },
        getMute : function() {
            if (_this.player) {
                return _this.player.sendToActionScript("getMute","return");
            } else {
                return false;
            }
        },
        setMute : function(p) {
            if (_this.player) {
                //return p ? _this.player.sendToActionScript("setMute") : _this.player.sendToActionScript("setMute");
            	_this.player.sendToActionScript("setMute");
            } else {
                return false;
            }
        }
    }

    window.onReady = IriSP.wrap(this, this.ready);
    //NOT CALLED window.onAllocineStateChange = IriSP.wrap(this, this.stateHandler);
    window.onTime = IriSP.wrap(this, this.progressHandler);
    
    var _videoUrl = (
        typeof options.directVideoPath == "string"
        ? options.directVideoPath
        : IriSP.get_aliased(IriSP.__jsonMetadata["medias"][0], ["href","url"])
    );
    
    var fv = "streamFMS=true&adVast=false&lg=fr_cinecast&autoPlay=" + options.autoPlay + "&directVideoTitle=&urlAcData=" + options.urlAcData + "&directVideoPath=" + _videoUrl + "&host=http://allocine.fr";
//    console.log("fv = " + fv);
    
    var params = {
        "allowScriptAccess" : "always",
        "wmode": "opaque",
        "flashvars" : fv
    };
    var atts = {
        id : this.container
    };
    swfobject.embedSWF(options.acPlayerUrl, this.container, options.width, options.height, "8", null, null, params, atts);

};

IriSP.PopcornReplacement.allocine.prototype = new IriSP.PopcornReplacement.player("", {});

IriSP.PopcornReplacement.allocine.prototype.ready = function() {
    this.player = document.getElementById(this.container);
    this.player.addEventListener("onStateChange", "onAllocineStateChange");
    this.player.addEventListener("onVideoProgress", "onAllocineVideoProgress");
    this.player.cueVideoByUrl(this._options.video);
    this.callbacks.onReady();
};

IriSP.PopcornReplacement.allocine.prototype.progressHandler = function(progressInfo) {
    this.callbacks.onTime({
        position: progressInfo.mediaTime
    });
}


IriSP.PopcornReplacement.allocine.prototype.stateHandler = function(state) {
    
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

        /*
        case 5:
            this.callbacks.onReady();
            break;
        */
    }
    
};