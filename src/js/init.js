/* init.js - initialization and configuration of Popcorn and the widgets
exemple json configuration:
 
 */

IriSP.configurePopcorn = function (layoutManager, options) {
    var pop;
    var containerDiv = layoutManager.createDiv();
    
    switch(options.type) {
      /*
        todo : dynamically create the div/video tag which
        will contain the video.
      */
      case "html5":
           var tmpId = Popcorn.guid("video"); 
           IriSP.jQuery("#" + containerDiv).append("<video src='" + options.file + "' id='" + tmpId + "'></video>");
           pop = Popcorn("#" + tmpId);
        break;
        
      case "jwplayer":
          var opts = IriSP.jQuery.extend({}, options);
          delete opts.container;
          pop = Popcorn.jwplayer("#" + containerDiv, "", opts);
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
    var widget = guiOptions.widgets[index];
    var container = layoutManager.createDiv();
        
    var arr = IriSP.jQuery.extend({}, widget);
    arr.container = container;

    var serializer = serialFactory.getSerializer(widget.metadata);    

    // instantiate the object passed as a string
    var widget = new IriSP[widget.type](popcornInstance, arr, serializer);
    
    serializer.sync(IriSP.wrap(widget, function() { this.draw(); }));
    ret_widgets.push(widget);
   
  };

  return ret_widgets;
};