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
            return _this.apiCall("play");
        },
        pause : function() {
            return _this.apiCall("pause");
        },
        getPosition : function() {
            return _this.apiCall("getSeek","return") || 0;
        },
        seek : function(pos) {
            return _this.apiCall("seek",pos);
        },
        getMute : function() {
            return _this.apiCall("getMute","return");
        },
        setMute : function(p) {
            return _this.apiCall("setMute", p);
        }
    }

    window.onReady = function() {
        _this.ready();
    };
    window.onAllocineStateChange = function(_state) {
        _this.stateHandler(_state)
    }
    window.onTime = function(_progress) {
        _this.progressHandler(_progress)
    };
    
    var _flashVars = {
        "streamFMS" : true,
        "adVast" : false,
        "lg" : "fr_cinecast",
        "autoPlay" : options.autoPlay,
        "directVideoTitle" : "",
        "urlAcData" : options.urlAcData,
        "directVideoPath" : options.video,
        "host" : "http://allocine.fr"
    }
    
    if (typeof IriSP.__jsonMetadata["medias"][0].meta == "object" && typeof IriSP.__jsonMetadata["medias"][0].meta.subtitles == "string") {
        _flashVars.subTitlePath = IriSP.__jsonMetadata["medias"][0].meta.subtitles;
    }
    

    var params = {
        "allowScriptAccess" : "always",
        "wmode": "opaque",
        "flashvars" : IriSP.jQuery.param(_flashVars),
        "allowfullscreen" : true
    };
    var atts = {
        id : this.container
    };
    swfobject.embedSWF(options.acPlayerUrl, this.container, options.width, options.height, "10", null, null, params, atts);

};

IriSP.PopcornReplacement.allocine.prototype = new IriSP.PopcornReplacement.player("", {});

IriSP.PopcornReplacement.allocine.prototype.ready = function() {
    this.player = document.getElementById(this.container);
    this.player.addEventListener("onStateChange", "onAllocineStateChange");
    this.player.cueVideoByUrl(this._options.video);
    this.trigger("loadedmetadata");
};

IriSP.PopcornReplacement.allocine.prototype.progressHandler = function(progressInfo) {
    this.trigger("timeupdate");
}


IriSP.PopcornReplacement.allocine.prototype.apiCall = function(_method, _arg) {
    if (this.player) {
        try {
            if (typeof _arg == "undefined") {
                return this.player.sendToActionScript(_method);
            } else {
                return this.player.sendToActionScript(_method, _arg);
            }
        } catch(e) {
            console.error('Exception while requesting AcPlayer for "' + _method + (typeof _arg == "undefined" ? '' : '" with argument "' + _arg ) + '"\n', e);
            return false;
        }
    } else {
        return false;
    }
}

IriSP.PopcornReplacement.allocine.prototype.stateHandler = function(state) {
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