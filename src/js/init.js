/* init.js - initialization and configuration of Popcorn and the widgets
exemple json configuration:
 
 */

IriSP.configurePopcorn = function (options) {
    var pop;
    
    switch(options.type) {
      /*
        todo : dynamically create the div/video tag which
        will contain the video.
      */
      case "html5":
           pop = Popcorn("#" + options.container);
        break;
        
      case "jwplayer":
          var opts = IriSP.jQuery.extend({}, options);
          delete opts.container;
          pop = Popcorn.jwplayer("#" + options.container, "", opts);
        break;
        
      default:
        pop = undefined;
    };
    
    return pop;
};

IriSP.configureWidgets = function (popcornInstance, guiOptions) {

  var dt = new IriSP.DataLoader();
  var serialFactory = new IriSP.SerializerFactory(dt);
  
  var params = {width: guiOptions.width, height: guiOptions.height};
  var lay = new IriSP.LayoutManager(params);
  lay.setPopcornInstance(popcornInstance);
  
  var ret_widgets = [];
  var index;
  
  for (index = 0; index < guiOptions.widgets.length; index++) {    
    var widget = guiOptions.widgets[index];
    var container = lay.createDiv();
        
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