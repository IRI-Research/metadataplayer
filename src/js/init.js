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
    console.log("Loading Libs");
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
        if(this.config.gui.widgets[_i].type === "PolemicWidget" || this.config.gui.widgets[_i].type === "StackGraphWidget" || this.config.gui.widgets[_i].type === "SparklineWidget") {
            $L.script(IriSP.getLib("raphael"));
        }
        if(this.config.gui.widgets[_i].type === "TraceWidget") {
            $L.script(IriSP.getLib("tracemanager"))
        }
    }
    
    var _this = this;
    
    $L.wait(function() {
        console.log("jQuery is loaded");
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
        console.log('Appending CSS');

        css_link_jquery.appendTo('head');
        css_link_custom.appendTo('head');
        
        console.log(_this);
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
    console.log(_metadataInfo);
    if (typeof _metadataInfo.url !== "undefined" && typeof _metadataInfo.serializer !== "undefined") {
        return this.sourceManager.remoteSource(_metadataInfo);
    } else {
        return this.sourceManager.newLocalSource(_metadataInfo);
    }
}

IriSP.Metadataplayer.prototype.onLibsLoaded = function() {
    console.log("Libs Loaded");
    this.videoData = this.loadMetadata(this.video_metadata);
    console.log(this.videoData);
    this.$ = IriSP.jQuery('#' + this.config.gui.container);
    this.$.css({
        "width": this.config.gui.width,
        "clear": "both"
    });
    if (typeof this.config.gui.height !== "undefined") {
        this.$.css("height", this.config.gui.height);
    }
      
    var _this = this;
    console.log("calling OnLoad");
    this.videoData.onLoad(function() {
        _this.onVideoDataLoaded();
    });
}

IriSP.Metadataplayer.prototype.onVideoDataLoaded = function() {
    console.log("Video Data Loaded");
    if (typeof this.videoData !== "undefined" && typeof this.config.player.video === "undefined") {
        var _media = this.videoData.currentMedia;
        if (typeof _media !== "undefined") {
            config.player.video = _media.video;
            if (typeof _media.streamer !== "undefined") {
                config.player.streamer = _media.streamer;
                config.player.video = _media.video.replace(_media.streamer,'');
            }
        }
        
    }
    this.configurePopcorn(config.player);
    this.widgets = [];
    for(var i = 0; i < this.config.gui.widgets.length; i++) {
        this.widgets.push(new IriSP.Widgets[_config.type](this, this.config.gui.widgets[i]));
    };
    this.$('.Ldt-loader').detach();
}

IriSP.Metadataplayer.prototype.configurePopcorn = function() {
    var pop,
        ret = this.layoutDivs(),
        containerDiv = ret[0],
        spacerDiv = ret[1];

    /* insert one pixel of margin between the video and the first widget,
     * using the spacer.
     */
    IriSP.jQuery("#" + spacerDiv).css("height", Math.max(1, this.config.gui.spacer_div_height) + "px");

    switch(options.type) {
        /*
         todo : dynamically create the div/video tag which
         will contain the video.
         */
        case "html5":
            var tmpId = Popcorn.guid("video");
            IriSP.jQuery("#" + containerDiv).append("<video src='" + options.video + "' id='" + tmpId + "'></video>");

            if(options.hasOwnProperty("width"))
                IriSP.jQuery("#" + containerDiv).css("width", options.width);

            if(options.hasOwnProperty("height"))
                IriSP.jQuery("#" + containerDiv).css("height", options.height);
            pop = Popcorn("#" + tmpId);
            break;

        case "jwplayer":
            var opts = IriSP.jQuery.extend({}, options);
            delete opts.container;
            delete opts.type;
            opts.file = opts.video;
            delete opts.video;

            if(!options.hasOwnProperty("flashplayer")) {
                opts.flashplayer = IriSP.jwplayer_swf_path;
            }

            if(!options.hasOwnProperty("controlbar.position")) {
                opts["controlbar.position"] = "none";
            }
            pop = new IriSP.PopcornReplacement.jwplayer("#" + containerDiv, opts);
            break;

        case "youtube":
            var opts = IriSP.jQuery.extend({}, options);
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
            pop = new IriSP.PopcornReplacement.dailymotion("#" + containerDiv, options);
            break;

        case "allocine":
            /* pass the options as-is to the allocine player and let it handle everything */
            pop = new IriSP.PopcornReplacement.allocine("#" + containerDiv, options);
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
    var newDiv = IriSP.guid(this.container + "_widget_" + _name + "_"),
        spacerDiv = IriSP.guid("LdtPlayer_spacer_"),
        divTempl = "<div id='{{id}}' style='width: {{width}}px; position: relative; clear: both;'></div>",
        spacerTempl = "<div id='{{spacer_id}}' style='width: {{width}}px; position: relative; height: {{spacer_div_height}}px;'></div>",
        divHtml = Mustache.to_html( divTempl,
            {
                id: newDiv,
                width: this.config.gui.width
            }),
        spacerHtml = Mustache.to_html( spacerTempl,
            {
                spacer_id: spacerDiv,
                width: this.config.gui.width,
                spacer_div_height: this.config.gui.height
            });
            
    this.$.append(divCode);
    this.$.append(spacerCode);

    return [newDiv, spacerDiv];
};
