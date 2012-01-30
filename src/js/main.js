/* main file */


if ( window.IriSP === undefined && window.__IriSP === undefined ) { 
  /**
    @class
    the object under which everything goes.        
  */
	IriSP = {}; 
  
  /** Alias to IriSP for backward compatibility */
	__IriSP = IriSP;
}

/* underscore comes bundled with the player and we need 
   it ASAP, so load it that way
*/

IriSP._ = window._.noConflict();
IriSP.underscore = IriSP._;

IriSP.loadLibs = function( libs, config, metadata_url, callback ) {
    // Localize jQuery variable
		IriSP.jQuery = null;
    var $L = $LAB.script(libs.jQuery).script(libs.swfObject).wait()
                .script(libs.jQueryUI);
                                   
    if (config.player.type === "jwplayer") {
      // load our popcorn.js lookalike
      $L = $L.script(libs.jwplayer);
    } else {
      // load the real popcorn
      $L = $L.script(libs.popcorn).script(libs["popcorn.code"]);
      if (config.player.type === "youtube") {
        $L = $L.script(libs["popcorn.youtube"]);
      } 
      if (config.player.type === "vimeo")
        $L = $L.script(libs["popcorn.vimeo"]);
      
      /* do nothing for html5 */
    }       
    
    /* widget specific requirements */
    for (var idx in config.gui.widgets) {
      if (config.gui.widgets[idx].type === "PolemicWidget" ||
          config.gui.widgets[idx].type === "StackGraphWidget") {        
        $L.script(libs.raphael);
      }

      if (config.gui.widgets[idx].type === "SparklineWidget") {
        $L.script(libs.jquery_sparkline);
      }
    }
    
    // same for modules
    /*
    for (var idx in config.modules) {
      if (config.modules[idx].type === "PolemicWidget")
        $L.script(libs.raphaelJs);
    }
    */

    $L.wait(function() {
      IriSP.jQuery = window.jQuery.noConflict( true );
      
      var css_link_jquery = IriSP.jQuery( "<link>", { 
        rel: "stylesheet", 
        type: "text/css", 
        href: libs.cssjQueryUI,
        'class': "dynamic_css"
      } );
      var css_link_custom = IriSP.jQuery( "<link>", { 
        rel: "stylesheet", 
        type: "text/css", 
        href: config.gui.css,
        'class': "dynamic_css"
      } );
      
      css_link_jquery.appendTo('head');
      css_link_custom.appendTo('head');
          
      IriSP.setupDataLoader();
      IriSP.__dataloader.get(metadata_url, 
          function(data) {
            /* save the data so that we could re-use it to
               configure the video
            */
            IriSP.__jsonMetadata = data;
            callback.call(window) });
    });
};