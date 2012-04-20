/* init.js - initialization and configuration of Popcorn and the widgets
exemple json configuration:
*/

/* The Metadataplayer Object, single point of entry, replaces IriSP.init_player */

IriSP.Metadataplayer = function(config, video_metadata) {
    IriSP._.defaults(config.gui, IriSP.guiDefaults);
    var _container = document.getElementById(config.gui.container);
    _container.innerHTML = IriSP.templToHTML(IriSP.loading_template, config.gui);
    this.video_metadata = video_metadata;
    this.sourceManager = new IriSP.Model.Directory();
    this.config = config;
    this.loadLibs();
}

IriSP.Metadataplayer.prototype.toString = function() {
    return 'A Metadataplayer in DIV #' + this.config.gui.container;
}

IriSP.Metadataplayer.prototype.loadLibs = function() {
    // Localize jQuery variable
    IriSP.jQuery = null;
    var $L = $LAB.script(IriSP.getLib("jQuery")).script(IriSP.getLib("swfObject")).wait().script(IriSP.getLib("jQueryUI"));

    if(this.config.player.type === "jwplayer" || this.config.player.type === "allocine" || this.config.player.type === "dailymotion") {
        // load our popcorn.js lookalike
        $L.script(IriSP.getLib("jwplayer"));
    } else {
        // load the real popcorn
        $L.script(IriSP.getLib("popcorn")).script(IriSP.getLib("popcorn.code"));
        // load plugins if necessary
        if(this.config.player.type === "youtube") {
            $L.script(IriSP.getLib("popcorn.youtube"));
        }
        if(this.config.player.type === "vimeo"){
            $L.script(IriSP.getLib("popcorn.vimeo"));
        }
    }

    /* widget specific requirements */
    for(var _i = 0; _i < this.config.gui.widgets.length; _i++) {
        if(this.config.gui.widgets[_i].type === "StackGraphWidget" || this.config.gui.widgets[_i].type === "SparklineWidget") {
            $L.script(IriSP.getLib("raphael"));
        }
        if(this.config.gui.widgets[_i].type === "TraceWidget") {
            $L.script(IriSP.getLib("tracemanager"))
        }
    }
    
    var _this = this;
    
    $L.wait(function() {
        IriSP.jQuery = window.jQuery.noConflict(true);

        var css_link_jquery = IriSP.jQuery("<link>", {
            rel : "stylesheet",
            type : "text/css",
            href : IriSP.getLib("cssjQueryUI")
        });
        var css_link_custom = IriSP.jQuery("<link>", {
            rel : "stylesheet",
            type : "text/css",
            href : _this.config.gui.css
        });

        css_link_jquery.appendTo('head');
        css_link_custom.appendTo('head');
        
        _this.onLibsLoaded();
        
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

IriSP.Metadataplayer.prototype.onLibsLoaded = function() {
    this.videoData = this.loadMetadata(this.video_metadata);
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
    for(var i = 0; i < this.config.gui.widgets.length; i++) {
        var _widget = this.config.gui.widgets[i];
        if (typeof IriSP[_widget.type] !== "undefined") {
            this.widgets.push(new IriSP[_widget.type](this, _widget));
        } else {
            console.log("Error, Call to Undefined Widget Type : "+_widget.type);
        }
    };
    this.$.find('.Ldt-loader').detach();
}

IriSP.Metadataplayer.prototype.configurePopcorn = function() {
    var pop,
        ret = this.layoutDivs("video"),
        containerDiv = ret[0],
        spacerDiv = ret[1];

    switch(this.config.player.type) {
        /*
         todo : dynamically create the div/video tag which
         will contain the video.
         */
        case "html5":
            var tmpId = Popcorn.guid("video");
            IriSP.jQuery("#" + containerDiv).append("<video src='" + this.config.player.video + "' id='" + tmpId + "'></video>");

            if(options.hasOwnProperty("width"))
                IriSP.jQuery("#" + containerDiv).css("width", this.config.player.width);

            if(options.hasOwnProperty("height"))
                IriSP.jQuery("#" + containerDiv).css("height", this.config.player.height);
            pop = Popcorn("#" + tmpId);
            break;

        case "jwplayer":
            var opts = IriSP.jQuery.extend({}, this.config.player);
            delete opts.container;
            delete opts.type;
            opts.file = opts.video;
            delete opts.video;

            if(!opts.hasOwnProperty("flashplayer")) {
                opts.flashplayer = IriSP.jwplayer_swf_path;
            }

            if(!opts.hasOwnProperty("controlbar.position")) {
                opts["controlbar.position"] = "none";
            }
            pop = new IriSP.PopcornReplacement.jwplayer("#" + containerDiv, opts);
            break;

        case "youtube":
            var opts = IriSP.jQuery.extend({}, this.config.player);
            delete opts.container;
            opts.controls = 0;
            opts.autostart = false;
            // Popcorn.youtube wants us to specify the size of the player in the style attribute of its container div.
            IriSP.jQuery("#" + containerDiv).css({
                width : opts.width + "px",
                height : opts.height + "px"
            })
            pop = Popcorn.youtube("#" + containerDiv, opts.video, opts);
            break;

        case "dailymotion":
            pop = new IriSP.PopcornReplacement.dailymotion("#" + containerDiv, this.config.player);
            break;

        case "allocine":
            /* pass the options as-is to the allocine player and let it handle everything */
            pop = new IriSP.PopcornReplacement.allocine("#" + containerDiv, this.config.player);
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
IriSP.Metadataplayer.prototype.layoutDivs = function(_name) {
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
            
    this.$.append(divHtml);
    this.$.append(spacerHtml);

    return [newDiv, spacerDiv];
};
