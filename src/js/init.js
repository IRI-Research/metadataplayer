/* init.js - initialization and configuration of Popcorn and the widgets
exemple json configuration:
 
 */

/**
    set up the IriSP.__dataloader instance - 
    we need it because we have to get the metadata
    about the video before that the widget have even
    loaded.
*/
IriSP.setupDataLoader = function() {
  /* we set it up separately because we need to
     get data at the very beginning, for instance when
     setting up the video */
  IriSP.__dataloader = new IriSP.DataLoader();
};

/** do some magic to configure popcorn according to the options object passed.
    Works for html5, jwplayer and youtube videos 
*/
IriSP.configurePopcorn = function (layoutManager, options) {
    var pop;
    var ret = layoutManager.createDiv(); 
    var containerDiv = ret[0];
    
    switch(options.type) {
      /*
        todo : dynamically create the div/video tag which
        will contain the video.
      */
      case "html5":
           var tmpId = Popcorn.guid("video"); 
           IriSP.jQuery("#" + containerDiv).append("<video src='" + options.file + "' id='" + tmpId + "'></video>");

           if (options.hasOwnProperty("width"))
             IriSP.jQuery("#" + containerDiv).css("width", options.width);
           
           if (options.hasOwnProperty("height"))
             IriSP.jQuery("#" + containerDiv).css("height", options.height);

           pop = Popcorn("#" + tmpId);
        break;
        
      case "jwplayer":
          var opts = IriSP.jQuery.extend({}, options);
          delete opts.container;
          delete opts.type;

          if (options.provider === "rtmp") {
            /* exit if we can't access the metadata */
            if (typeof(IriSP.__jsonMetadata) === "undefined") {
                break;
            };


             
            // the json format is totally illogical
            //opts.streamer = IriSP.__jsonMetadata["medias"][0]["meta"]["item"]["value"];
            //var source = IriSP.__jsonMetadata["medias"][0]["href"];

            // the source if a full url but jwplayer wants an url relative to the
            // streamer url, so we've got to remove the common part.
            //opts.file = source.slice(opts.streamer.length);
            
            /* sometimes we get served a file with a wrong path and streamer.
               as a streamer is of the form rtmp://domain/path/ and the media is
               the rest, we uglily do this :
            */
            opts.file = "";
            opts.streamer = "";
            var fullPath = IriSP.__jsonMetadata["medias"][0]["href"];
            var pathSplit = fullPath.split('/');
            
            for (var i = 0; i < pathSplit.length; i++) {
              if (i < 4) {
                 opts.streamer += pathSplit[i] + "/";
              } else {
                 opts.file += pathSplit[i];
                 /* omit the last slash if we're on the last element */
                 if (i < pathSplit.length - 1)
                  opts.file += "/";
              }
            }

          } else {
            /* other providers type, video for instance -
               pass everything as is */
          }

          if (!options.hasOwnProperty("flashplayer")) {
            opts.flashplayer = IriSP.jwplayer_swf_path;
          }

          if (!options.hasOwnProperty("controlbar.position")) {
            opts["controlbar.position"] = "none";
          }

          pop = IriSP.PopcornReplacement.jwplayer("#" + containerDiv, opts);
        break;
      
      case "youtube":
          var opts = IriSP.jQuery.extend({}, options);
          delete opts.container;
          opts.controls = 0;
          opts.autostart = false;
          templ = "width: {{width}}px; height: {{height}}px;";
          var str = Mustache.to_html(templ, {width: opts.width, height: opts.height});    
          // Popcorn.youtube wants us to specify the size of the player in the style attribute of its container div.
          IriSP.jQuery("#" + containerDiv).attr("style", str);
          
          pop = Popcorn.youtube("#" + containerDiv, opts.video, opts);
        break;
        
      default:
        pop = undefined;
    };
    
    return pop;
};

/** Configure the gui and instantiate the widgets passed as parameters
    @param guiOptions the gui object as seen in the examples.
 */
IriSP.configureWidgets = function (popcornInstance, layoutManager, guiOptions) {
 
  var serialFactory = new IriSP.SerializerFactory(IriSP.__dataloader);
  var params = {width: guiOptions.width, height: guiOptions.height};

  var ret_widgets = [];
  var index;
  
  for (index = 0; index < guiOptions.widgets.length; index++) {    
    var widgetConfig = guiOptions.widgets[index];
    var widget = IriSP.instantiateWidget(popcornInstance, serialFactory, layoutManager, widgetConfig);
    ret_widgets.push(widget);
   
  };

  return ret_widgets;
};

/** configure modules. @see configureWidgets */
IriSP.configureModules = function (popcornInstance, modulesList) {
 
  var serialFactory = new IriSP.SerializerFactory(IriSP.__dataloader);
  var ret_modules = [];
  var index;
  
  for (index = 0; index < modulesList.length; index++) {    
    var moduleConfig = modulesList[index];
    
    var serializer = serialFactory.getSerializer(moduleConfig.metadata);
    var module = new IriSP[moduleConfig.type](popcornInstance, moduleConfig, serializer);    
    ret_modules.push(module);
  };

  return ret_modules;
};

/** instantiate a widget - only called by configureWidgets, never by the user. Handles widget 
    dependencies.
    @param popcornInstance popcorn instance the widget will user
    @param serialFactory serializer factory to instantiate the widget with
    @param layoutManager layout manager
    @param widgetConfig configuration options for the widget
 */
IriSP.instantiateWidget = function(popcornInstance, serialFactory, layoutManager, widgetConfig) {

    var arr = IriSP.jQuery.extend({}, widgetConfig);
    
    /* create a div for those widgets who didn't already specify a container; */
    if (!arr.hasOwnProperty("container")) {
      /* create div returns us a container for the widget and a spacer */    
      var ret = layoutManager.createDiv(widgetConfig.type);        
      var container = ret[0];
      var spacer = ret[1];           
      arr.container = container;
      arr.spacer = spacer;
      arr.layoutManager = layoutManager;
    }
    var serializer = serialFactory.getSerializer(widgetConfig.metadata);    
    
    if (typeof serializer == "undefined")   
      debugger;
    
    // instantiate the object passed as a string
    var widget = new IriSP[widgetConfig.type](popcornInstance, arr, serializer);    
    
    if (widgetConfig.hasOwnProperty("requires")) {
      // also create the widgets this one depends on.
      // the dependency widget is available in the parent widget context as
      // this.WidgetName (for instance, this.TipWidget);
      
      var i = 0;
      for(i = 0; i < widgetConfig.requires.length; i++) {
        var widgetName = widgetConfig.requires[i]["type"];
        widget[widgetName] = IriSP.instantiateWidget(popcornInstance, serialFactory, layoutManager, widgetConfig.requires[i]);
      }
    }       
     
    serializer.sync(IriSP.wrap(widget, function() { this.draw(); }));
    return widget;
};
