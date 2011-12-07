/* init.js - initialization and configuration of Popcorn and the widgets
exemple json configuration:
 
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

           pop = Popcorn("#" + tmpId).mediafragment({start : 0});
        break;
        
      case "jwplayer":
          // Popcorn.noConflict(true); /* remove current popcorn instance */
          Popcorn = PopcornReplacement;
          var opts = IriSP.jQuery.extend({}, options);
          delete opts.container;
          pop = Popcorn.jwplayer("#" + containerDiv, opts);
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
          
          pop = Popcorn.youtube("#" + containerDiv, opts.video, opts).mediafragment({start : 0});
        break;
        
      default:
        pop = undefined;
    };
    
    return pop;
};

IriSP.configureWidgets = function (popcornInstance, layoutManager, guiOptions) {

  var dt = new IriSP.DataLoader();
  var serialFactory = new IriSP.SerializerFactory(dt);
  
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

IriSP.instantiateWidget = function(popcornInstance, serialFactory, layoutManager, widgetConfig) {
    /* create div returns us a container for the widget and a spacer */
    var ret = layoutManager.createDiv(widgetConfig.type);        
    var container = ret[0];
    var spacer = ret[1];

    var arr = IriSP.jQuery.extend({}, widgetConfig);
    arr.container = container;
    arr.spacer = spacer;
    
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
