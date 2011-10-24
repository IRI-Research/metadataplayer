/* init.js - initialization and configuration of Popcorn and the widgets
exemple json configuration:
  
  var config = {						
						gui:{
							width:650,
							height:480,							
							container:'LdtPlayer',
							css:'../../src/css/LdtPlayer.css',
              widgets: [
                {type: "IriSP.PlayerWidget", // please note that type refers directly to the constructor of the widget.
                 metadata:{
                  format:'cinelab',
                  src:'test.json',
                  load:'json'}
                },
               {type: "IriSP.SegmentsWidget", 
                 metadata:{
                  format:'cinelab',
                  src:'test.json',
                  load:'json'}
                },
               {type: "IriSP.AnnotationsWidget",                
                 metadata:{
                  format:'cinelab',
                  src:'test.json',
                  load:'json'}
                },
              ]
						player:{
							type:'jwplayer', // player type
              container: '#PopcornContainer'
              // the rest is player-dependent configuration options.
              file : "video/franceculture/franceculture_retourdudimanche20100620.flv", 
              streamer: "rtmp://media.iri.centrepompidou.fr/ddc_player/", 
              flashplayer : '../libs/player.swf',
              live: true, 
              "controlbar.position" : "none", 
              height: 300, 
              width: 200, 
              provider: "rtmp" 
            }
	};
 */

IriSP.configurePopcorn = function (options) {
    var pop;
    
    switch(options.type) {
      /*
        todo : dynamically create the div/video tag which
        will contain the video.
      */
      case "html5":
           pop = Popcorn(options.container);
        break;
        
      case "jwplayer":
          var opts = IriSP.jQuery.extend({}, options);
          delete opts.container;
          pop = Popcorn.jwplayer(options.container, "", opts);
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
  
  var ret_widgets = [];
  
  for (index in guiOptions.widgets) {    
    var widget = guiOptions.widgets[index];
    var container = lay.createDiv();
        
    var arr = IriSP.jQuery.extend({}, widget);
    arr.container = container;
    
    var serializer = serialFactory.getSerializer(widget.metadata);

    // instantiate the object passed as a string
    var widget = new IriSP[widget.type](popcornInstance, widget, serializer);    
    serializer.sync(function() { widget.draw() });
    ret_widgets.push(widget);
  };
  
  return ret_widgets;
};