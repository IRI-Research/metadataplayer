/* init.js - initialization and configuration of Popcorn and the widgets
exemple json configuration:

*/

/** do some magic to configure popcorn according to the options object passed.
 Works for html5, jwplayer and youtube videos
 */
IriSP.configurePopcorn = function(layoutManager, options) {
    var pop;
    var ret = layoutManager.createDiv();
    var containerDiv = ret[0];
    var spacerDiv = ret[1];

    /* insert one pixel of margin between the video and the first widget, using the
     spacer.
     */
    IriSP.jQuery("#" + spacerDiv).css("height", "1px");

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

    return pop;
};
/** Configure the gui and instantiate the widgets passed as parameters
 @param guiOptions the gui object as seen in the examples.
 */
IriSP.configureWidgets = function(popcornInstance, layoutManager, guiOptions) {

    var serialFactory = new IriSP.SerializerFactory(IriSP.__dataloader);
    var params = {
        width : guiOptions.width,
        height : guiOptions.height
    };

    var default_options = guiOptions.default_options;
    if(IriSP.null_or_undefined(default_options))
        default_options = {};

    var ret_widgets = [];
    var index;

    for( index = 0; index < guiOptions.widgets.length; index++) {
        var widget = IriSP.instantiateWidget(popcornInstance, serialFactory, layoutManager, guiOptions.widgets[index], default_options);

        ret_widgets.push(widget);
    };

    return ret_widgets;
};
/** configure modules. @see configureWidgets */
IriSP.configureModules = function(popcornInstance, modulesList) {
/*    if(IriSP.null_or_undefined(modulesList))
        return;

    var serialFactory = new IriSP.SerializerFactory(IriSP.__dataloader);
    var ret_modules = [];
    var index;

    for( index = 0; index < modulesList.length; index++) {
        var moduleConfig = modulesList[index];

        var serializer = serialFactory.getSerializer(moduleConfig.metadata);
        var module = new IriSP[moduleConfig.type](popcornInstance, moduleConfig, serializer);
        ret_modules.push(module);
    };

    return ret_modules; */
};
/** instantiate a widget - only called by configureWidgets, never by the user. Handles widget
 dependencies.
 @param popcornInstance popcorn instance the widget will user
 @param serialFactory serializer factory to instantiate the widget with
 @param layoutManager layout manager
 @param widgetConfig configuration options for the widget
 @param defaultOptions a dictionnary with some options defined for every widget.
 */
IriSP.instantiateWidget = function(popcornInstance, serialFactory, layoutManager, widgetConfig, defaultOptions) {

    if(IriSP.null_or_undefined(defaultOptions))
        defaultOptions = {};
    widgetConfig = IriSP.underscore.defaults(widgetConfig, defaultOptions);

    var arr = IriSP.jQuery.extend({}, widgetConfig);

    /* create a div for those widgets who didn't already specify a container; */
    if(!arr.hasOwnProperty("container")) {
        /* create div returns us a container for the widget and a spacer */
        var ret = layoutManager.createDiv(widgetConfig.type);
        var container = ret[0];
        var spacer = ret[1];
        arr.container = container;
        arr.spacer = spacer;
        arr.layoutManager = layoutManager;
    }
    var serializer = serialFactory.getSerializer(widgetConfig.metadata);

    if( typeof serializer == "undefined")
        debugger;

    // instantiate the object passed as a string
    var widget = new IriSP[widgetConfig.type](popcornInstance, arr, serializer);

    if(widgetConfig.hasOwnProperty("requires")) {
        // also create the widgets this one depends on.
        // the dependency widget is available in the parent widget context as
        // this.WidgetName (for instance, this.TipWidget);

        var i = 0;
        for( i = 0; i < widgetConfig.requires.length; i++) {
            var widgetName = widgetConfig.requires[i]["type"], _configobj = IriSP.jQuery.extend({}, widgetConfig.requires[i]), _div = document.createElement('div'), _container = IriSP.guid(arr.container + '_' + widgetName + '_');
            _configobj.container = _container;
            _div.id = _container;
            widget.selector.append(_div);
            widget[widgetName] = IriSP.instantiateWidget(popcornInstance, serialFactory, layoutManager, _configobj, defaultOptions);
        }
    }

    serializer.sync(IriSP.wrap(widget, function() {
        this.draw();
    }));
    return widget;
};
/** single point of entry for the metadataplayer */
IriSP.initPlayer = function(config, metadata_url, format) {
    document.getElementById(config.gui.container).innerHTML = IriSP.templToHTML(IriSP.loading_template, config.gui);
    IriSP.loadLibs(config, metadata_url, format, function() {

        var layoutManager = new IriSP.LayoutManager(config.gui);
        
        if (typeof IriSP._videoData !== "undefined" && typeof config.player.video === "undefined") {
            var _media = IriSP._videoData.currentMedia;
            if (typeof _media !== "undefined") {
                config.player.video = _media.video;
                if (typeof _media.streamer !== "undefined") {
                    config.player.streamer = _media.streamer;
                    config.player.video = _media.video.replace(_media.streamer,'');
                }
            }
            
        }
        
        var pop = IriSP.configurePopcorn(layoutManager, config.player);

        IriSP._widgets = IriSP.configureWidgets(pop, layoutManager, config.gui);
        IriSP.jQuery('#Ldt-loader').detach();
    });
};
