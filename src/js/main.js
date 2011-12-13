/* main file */

if ( window.IriSP === undefined && window.__IriSP === undefined ) { 
	var IriSP = {}; 
	var __IriSP = IriSP; /* for backward compatibility */
}

/* crap code will be the first against the wall when the
   revolution comes */
IriSP.loadLibs = function( libs, customCssPath, metadata_url, callback ) {
		// Localize jQuery variable
		IriSP.jQuery = null;

		/* FIXME : to refactor using popcorn.getscript ? */
		/******** Load jQuery if not present *********/
		if ( window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2' ) {
			
			var script_tag = document.createElement( 'script' );
			script_tag.setAttribute( "type", "text/javascript" );
			script_tag.setAttribute( "src", libs.jQuery );
			
			script_tag.onload = scriptLibHandler;
			script_tag.onreadystatechange = function () { // Same thing but for IE
				if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
					scriptLibHandler();					
				}
			};
			
			// Try to find the head, otherwise default to the documentElement
			( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( script_tag );
		} else {
			// The jQuery version on the window is the one we want to use
			 IriSP.jQuery = window.jQuery;
			 scriptLibHandler();
		}

		/******** Called once jQuery has loaded ******/
		function scriptLibHandler() {
			
			var script_jqUi_tooltip = document.createElement( 'script' );
			script_jqUi_tooltip.setAttribute( "type", "text/javascript" );
			script_jqUi_tooltip.setAttribute( "src", libs.jQueryToolTip );
			script_jqUi_tooltip.onload = scriptLoadHandler;
			script_jqUi_tooltip.onreadystatechange = function () { // Same thing but for IE
				if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
					scriptLoadHandler( "jquery.tools.min.js loded" );
				}
			};
			
			var script_swfObj = document.createElement('script');
			script_swfObj.setAttribute( "type","text/javascript" );
			script_swfObj.setAttribute( "src",libs.swfObject );
			script_swfObj.onload = scriptLoadHandler;
			script_swfObj.onreadystatechange = function () { // Same thing but for IE
				if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
					scriptLoadHandler( "swfobject.js loded" );
				}
			};
		
			var script_jqUi = document.createElement( 'script' );
			script_jqUi.setAttribute( "type","text/javascript" );
			script_jqUi.setAttribute( "src",libs.jQueryUI );
			script_jqUi.onload = scriptLoadHandler;
			script_jqUi.onreadystatechange = function () { // Same thing but for IE
				if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
					scriptLoadHandler( "jquery-ui.min.js loded" );
				}
			};
		

			( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( script_jqUi_tooltip);
			( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( script_jqUi );
			( document.getElementsByTagName("head")[0] || document.documentElement ).appendChild( script_swfObj );
			

		};

		/******** Called once all lib are loaded ******/
		var loadLib = 0;
		/* FIXME : ugly */
		function scriptLoadHandler( Mylib ) {
			//alert(Mylib);
			loadLib +=1;
			if( loadLib===3 ) { 
				main(); 			  
			}
		};

		/******** Our main function ********/
		function main() { 
			

			//  Make our own IriSP.jQuery and restore window.jQuery if there was one. 
			IriSP.jQuery = window.jQuery.noConflict( true );
			// Call our Jquery
			IriSP.jQuery( document ).ready( function($) { 
				
				/******* Load CSS *******/
				var css_link_jquery = IriSP.jQuery( "<link>", { 
					rel: "stylesheet", 
					type: "text/css", 
					href: libs.cssjQueryUI,
					'class': "dynamic_css"
				} );
				var css_link_custom = IriSP.jQuery( "<link>", { 
					rel: "stylesheet", 
					type: "text/css", 
					href: customCssPath,
					'class': "dynamic_css"
				} );
				
				css_link_jquery.appendTo( 'head' );
				css_link_custom.appendTo( 'head' );   

				// to see dynamicly loaded css on IE
				if ( $.browser.msie ) {
					$( '.dynamic_css' ).clone().appendTo( 'head' );
				}
        
        IriSP.setupDataLoader();
        IriSP.__dataloader.get(metadata_url, 
            function(data) {
              /* save the data so that we could re-use it to
                 configure the video
              */
              IriSP.__jsonMetadata = data;
              callback.call(window) });
      });
    }
};

