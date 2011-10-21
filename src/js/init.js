/* init.js - initialization and configuration of Popcorn and the widgets
exemple json configuration:
  
  var config = {						
						gui:{
							width:650,
							height:480,							
							container:'LdtPlayer',
							css:'../../src/css/LdtPlayer.css',
              widgets: [
                {type: IriSP.PlayerWidget, // please note that type refers directly to the constructor of the widget.
                 metadata:{
                  format:'cinelab',
                  src:'test.json',
                  load:'json'}
                },
               {type: IriSP.SegmentsWidget, 
                 metadata:{
                  format:'cinelab',
                  src:'test.json',
                  load:'json'}
                },
               {type: IriSP.AnnotationsWidget, 
                 metadata:{
                  format:'cinelab',
                  src:'test.json',
                  load:'json'}
                },
              ]
						player:{
							type:'jwplayer', // player type
              
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
    
    switch(options.player.type) {
      /*
        todo : dynamically create the div/video tag which
        will contain the video.
      */
      case "html5":
           //pop = Popcorn(
        break;
    };
};

IriSP.configureWidgets = function (guiOptions) {

  var dt = new IriSP.DataLoader();
  
  var params = {width: guiOptions.width, height: guiOptions.height, 
  var lay = new LayoutManager(params);
  
  for (widget in widgets) {
    var container = lay.createDiv();
    
  };
};

IriSP.initInstance = function ( config ) {		
		if ( config === null ) {
			config = IriSP.configDefault;
		
    } else {			
		

			if (.config.player.params == null ) {
				config.player.params = IriSP.configDefault.player.params;
			}
			
			if ( config.player.flashvars == null ) {
				config.player.flashvars = IriSP.configDefault.player.flashvars;
			}
			
			if ( config.player.attributes == null ) {
				config.player.attributes = IriSP.configDefault.player.attributes;
			}
		}
		
		var metadataSrc 		 = config.metadata.src;
		var guiContainer		 = config.gui.container;
		var guiMode				 = config.gui.mode;
			
    IriSP.loadLibs(IriSP.lib, IriSP.config.gui.css, function() {
    	IriSP.createPlayerChrome();			
      /******* Load Metadata *******/
      IriSP.getMetadata();	
    });
	
    
};