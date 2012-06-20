/* init.js - initialization and configuration of Popcorn and the widgets
*/

if (typeof window.IriSP === "undefined") {
    IriSP = {};
}

/* The Metadataplayer Object, single point of entry, replaces IriSP.init_player */

IriSP.Metadataplayer = function(config) {
    IriSP.log("IriSP.Metadataplayer constructor");
    for (var key in IriSP.guiDefaults) {
        if (IriSP.guiDefaults.hasOwnProperty(key) && !config.gui.hasOwnProperty(key)) {
            config.gui[key] = IriSP.guiDefaults[key]
        }
    }
    var _container = document.getElementById(config.gui.container);
    _container.innerHTML = '<h3 class="Ldt-Loader">Loading... Chargement...</h3>';
    this.sourceManager = new IriSP.Model.Directory();
    this.config = config;
    this.callbackQueue = [];
    this.isLoaded = false;
    this.loadLibs();
}

IriSP.Metadataplayer.prototype.toString = function() {
    return 'Metadataplayer in #' + this.config.gui.container;
}

IriSP.Metadataplayer.prototype.deferCallback = function(_callback) {
    var _this = this;
    IriSP._.defer(function() {
        _callback.call(_this);
    });
}

IriSP.Metadataplayer.prototype.handleCallbacks = function() {
    this.isLoaded = true;
    while (this.callbackQueue.length) {
        this.deferCallback(this.callbackQueue.splice(0,1)[0]);
    }
}

IriSP.Metadataplayer.prototype.onLoad = function(_callback) {
    if (this.isLoaded) {
        this.deferCallback(_callback);
    } else {
        this.callbackQueue.push(_callback);
    }
}

IriSP.Metadataplayer.prototype.loadLibs = function() {
    IriSP.log("IriSP.Metadataplayer.prototype.loadLibs");
    var $L = $LAB
        .script(IriSP.getLib("underscore"))
        .script(IriSP.getLib("Mustache"))
        .script(IriSP.getLib("jQuery"))
        .script(IriSP.getLib("swfObject"));
    
    if (typeof JSON == "undefined") {
        $L.script(IriSP.getLib("json"));
    }
    
    $L.wait()
        .script(IriSP.getLib("jQueryUI"));

    if (this.config.player.type === "jwplayer" || this.config.player.type === "auto") {
        $L.script(IriSP.getLib("jwplayer"));
    }
    
    if (this.config.player.type !== "jwplayer" && this.config.player.type !== "allocine" && this.config.player.type !== "dailymotion") {
        $L.script(IriSP.getLib("popcorn"));
    }

    /* widget specific requirements */
    for(var _i = 0; _i < this.config.gui.widgets.length; _i++) {
        var _t = this.config.gui.widgets[_i].type;
        if (typeof IriSP.widgetsRequirements[_t] !== "undefined" && typeof IriSP.widgetsRequirements[_t].requires !== "undefined") {
            $L.script(IriSP.getLib(IriSP.widgetsRequirements[_t].requires));
        }
    }
    
    var _this = this;
    IriSP.log($L);
    $L.wait(function() {
        _this.onLibsLoaded();
    });
}

IriSP.Metadataplayer.prototype.onLibsLoaded = function() {
    IriSP.log("IriSP.Metadataplayer.prototype.onLibsLoaded");
    if (typeof IriSP.jQuery === "undefined" && typeof window.jQuery !== "undefined") {
        IriSP.jQuery = window.jQuery.noConflict();
    }
    if (typeof IriSP._ === "undefined" && typeof window._ !== "undefined") {
        IriSP._ = window._.noConflict();
    }
    IriSP.loadCss(IriSP.getLib("cssjQueryUI"));
    IriSP.loadCss(this.config.gui.css);
    
    this.videoData = this.loadMetadata(this.config.player.metadata);
    this.$ = IriSP.jQuery('#' + this.config.gui.container);
    this.$.css({
        "width": this.config.gui.width,
        "clear": "both"
    });
    if (typeof this.config.gui.height !== "undefined") {
        this.$.css("height", this.config.gui.height);
    }
      
    var _this = this;
    this.videoData.onLoad(function() {
        _this.onVideoDataLoaded();
    });
}

IriSP.Metadataplayer.prototype.loadMetadata = function(_metadataInfo) {
    if (typeof _metadataInfo.serializer === "undefined" && typeof _metadataInfo.format !== "undefined") {
        _metadataInfo.serializer = IriSP.serializers[_metadataInfo.format];
    }
    if (typeof _metadataInfo.url === "undefined" && typeof _metadataInfo.src !== "undefined") {
        _metadataInfo.url = _metadataInfo.src;
    }
    if (typeof _metadataInfo.url !== "undefined" && typeof _metadataInfo.serializer !== "undefined") {
        return this.sourceManager.remoteSource(_metadataInfo);
    } else {
        return this.sourceManager.newLocalSource(_metadataInfo);
    }
}

IriSP.Metadataplayer.prototype.onVideoDataLoaded = function() {
    if (typeof this.videoData !== "undefined" && typeof this.config.player.video === "undefined") {
        var _media = this.videoData.currentMedia;
        if (typeof _media !== "undefined") {
            this.config.player.video = _media.video;
            if (typeof _media.streamer !== "undefined") {
                this.config.player.streamer = _media.streamer;
                this.config.player.video = _media.video.replace(_media.streamer,'');
            }
        }
        
    }
    this.configurePopcorn();
    this.widgets = [];
    var _this = this;
    for(var i = 0; i < this.config.gui.widgets.length; i++) {
        this.loadWidget(this.config.gui.widgets[i], function(_widget) {
            _this.widgets.push(_widget)
        });
    };
    this.$.find('.Ldt-Loader').detach();
    this.handleCallbacks();
}

IriSP.Metadataplayer.prototype.loadWidget = function(_widgetConfig, _callback) {
    /* Creating containers if needed */
    if (typeof _widgetConfig.container === "undefined") {
        var _divs = this.layoutDivs(_widgetConfig.type);
        _widgetConfig.container = _divs[0];
    }
    
    var _this = this;
    
    if (typeof IriSP.Widgets[_widgetConfig.type] !== "undefined") {
        IriSP._.defer(function() {
            _callback(new IriSP.Widgets[_widgetConfig.type](_this, _widgetConfig));
        });
    } else {
        /* Loading Widget CSS */
        if (typeof IriSP.widgetsRequirements[_widgetConfig.type] === "undefined" || typeof IriSP.widgetsRequirements[_widgetConfig.type].noCss === "undefined" || !IriSP.widgetsRequirements[_widgetConfig.type].noCss) {
            IriSP.loadCss(IriSP.widgetsDir + '/' + _widgetConfig.type + '.css');
        }
        /* Loading Widget JS    */
        $LAB.script(IriSP.widgetsDir + '/' + _widgetConfig.type + '.js').wait(function() {
            _callback(new IriSP.Widgets[_widgetConfig.type](_this, _widgetConfig));
        });
    }
}

IriSP.Metadataplayer.prototype.configurePopcorn = function() {
    IriSP.log("IriSP.Metadataplayer.prototype.configurePopcorn");
    var pop,
        ret = this.layoutDivs("video",this.config.player.height || undefined),
        containerDiv = ret[0],
        spacerDiv = ret[1],
        _this = this,
        _types = {
            "html5" : /\.(ogg|ogv|webm)$/,
            "youtube" : /^(https?:\/\/)?(www\.)?youtube\.com/,
            "dailymotion" : /^(https?:\/\/)?(www\.)?dailymotion\.com/
        };
    
    if (this.config.player.type === "auto") {
        this.config.player.type = "jwplayer";
        IriSP._(_types).each(function(_v, _k) {
            if (_v.test(_this.config.player.video)) {
                _this.config.player.type = _k
            }
        });
    }

    switch(this.config.player.type) {
        /*
         todo : dynamically create the div/video tag which
         will contain the video.
         */
        case "html5":
            var _tmpId = Popcorn.guid("video"),
                _videoEl = IriSP.jQuery('<video>');
            
            _videoEl.attr({
                "src" : this.config.player.video,
                "id" : _tmpId
            })

            if(this.config.player.hasOwnProperty("width")) {
                _videoEl.attr("width", this.config.player.width);
            }
            if(this.config.player.hasOwnProperty("height")) {
                _videoEl.attr("height", this.config.player.height);
            }
            IriSP.jQuery("#" + containerDiv).append(_videoEl);
            pop = Popcorn("#" + _tmpId);
            break;

        case "html5-audio":
            var _tmpId = Popcorn.guid("audio"),
                _videoEl = IriSP.jQuery('<audio>');
            
            _videoEl.attr({
                "src" : this.config.player.video,
                "id" : _tmpId
            })

            if(this.config.player.hasOwnProperty("width")) {
                _videoEl.attr("width", this.config.player.width);
            }
            if(this.config.player.hasOwnProperty("height")) {
                _videoEl.attr("height", this.config.player.height);
            }
            IriSP.jQuery("#" + containerDiv).append(_videoEl);
            pop = Popcorn("#" + _tmpId);
            break;

        case "jwplayer":
            var opts = IriSP.jQuery.extend({}, this.config.player);
            delete opts.container;
            delete opts.type;
            opts.file = opts.video;
            delete opts.video;

            if(!opts.hasOwnProperty("flashplayer")) {
                opts.flashplayer = IriSP.getLib("jwPlayerSWF");
            }

            if(!opts.hasOwnProperty("controlbar.position")) {
                opts["controlbar.position"] = "none";
            }
            pop = new IriSP.PopcornReplacement.jwplayer("#" + containerDiv, opts);
            break;

        case "youtube":
            // Popcorn.youtube wants us to specify the size of the player in the style attribute of its container div.
            IriSP.jQuery("#" + containerDiv).css({
                width : this.config.player.width + "px",
                height : this.config.player.height + "px"
            });
            var _urlparts = this.config.player.video.split(/[?&]/),
                _params = {};
            for (var _j = 1; _j < _urlparts.length; _j++) {
                var _ppart = _urlparts[_j].split('=');
                _params[_ppart[0]] = decodeURIComponent(_ppart[1]);
            }
            _params.controls = 0;
            _params.modestbranding = 1;
            _url = _urlparts[0] + '?' + IriSP.jQuery.param(_params);
            pop = Popcorn.youtube("#" + containerDiv, _url);
            break;

        case "dailymotion":
            pop = new IriSP.PopcornReplacement.dailymotion("#" + containerDiv, this.config.player);
            break;

        case "mashup":
            pop = new IriSP.PopcornReplacement.mashup("#" + containerDiv, this.config.player);
            break;
            
        case "allocine":
            /* pass the options as-is to the allocine player and let it handle everything */
            pop = new IriSP.PopcornReplacement.allocine("#" + containerDiv, this.config.player);
            break;
        
        case "mashup-html":
            pop = new IriSP.PopcornReplacement.htmlMashup("#" + containerDiv, this.config.player, this.videoData);
            break;
        
        default:
            pop = undefined;
    };

    this.popcorn = pop;
}

/** create a subdiv with an unique id, and a spacer div as well.
    @param widgetName the name of the widget.
    @return an array of the form [createdivId, spacerdivId].
*/
IriSP.Metadataplayer.prototype.layoutDivs = function(_name, _height) {
    if (typeof(_name) === "undefined") {
       _name = "";
    }
    var newDiv = IriSP._.uniqueId(this.config.gui.container + "_widget_" + _name + "_"),
        spacerDiv = IriSP._.uniqueId("LdtPlayer_spacer_"),
        divHtml = IriSP.jQuery('<div>')
            .attr("id",newDiv)
            .css({
                width: this.config.gui.width + "px",
                position: "relative",
                clear: "both"
            }),
        spacerHtml = IriSP.jQuery('<div>')
            .attr("id",spacerDiv)
            .css({
                width: this.config.gui.width + "px",
                height: this.config.gui.spacer_div_height + "px",
                position: "relative",
                clear: "both"
            });
    if (typeof _height !== "undefined") {
        divHtml.css("height", _height);
    }
            
    this.$.append(divHtml);
    this.$.append(spacerHtml);

    return [newDiv, spacerDiv];
};
