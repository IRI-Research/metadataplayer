/* ui.js - ui related functions */

/* FIXME: get rid of the chrome here	
 * INTERFACE : SLIDER ( CONTROL BAR ) | BUTTON ()   */
IriSP.createInterface = function( width, height, duration ) {
		
		IriSP.jQuery( "#Ldt-controler" ).show();
		//__IriSP.jQuery("#Ldt-Root").css('display','visible');
		IriSP.trace( "__IriSP.createInterface" , width+","+height+","+duration+"," );
		
		IriSP.jQuery( "#Ldt-ShowAnnotation").click( function () { 
			 //__IriSP.jQuery(this).slideUp(); 
		} );

		var LdtpPlayerY = IriSP.jQuery("#Ldt-PlaceHolder").attr("top");
		var LdtpPlayerX = IriSP.jQuery("#Ldt-PlaceHolder").attr("left");
		
		IriSP.jQuery( "#slider-range-min" ).slider( { //range: "min",
			value: 0,
			min: 1,
			max: duration/1000,//1:54:52.66 = 3600+3240+
			step: 0.1,
			slide: function(event, ui) {
				
				//__IriSP.jQuery("#amount").val(ui.value+" s");
				//player.sendEvent('SEEK', ui.value)
				IriSP.MyApiPlayer.seek(ui.value);
				//changePageUrlOffset(ui.value);
				//player.sendEvent('PAUSE')
			}
		} );
		
		IriSP.trace("__IriSP.createInterface","ICI");
		IriSP.jQuery("#amount").val(IriSP.jQuery("#slider-range-min").slider("value")+" s");
		IriSP.jQuery(".Ldt-Control1 button:first").button({
			icons: {
				primary: 'ui-icon-play'
			},
			text: false
		}).next().button({
			icons: {
				primary: 'ui-icon-seek-next'
			},
			 text: false
		});
		IriSP.jQuery(".Ldt-Control2 button:first").button({
			icons: {
				primary: 'ui-icon-search'//,
				//secondary: 'ui-icon-volume-off'
			},
			text: false
		}).next().button({
			icons: {
				primary: 'ui-icon-volume-on'
			},
			 text: false
		});

		// /!\ PB A MODIFIER 
		//__IriSP.MyTags.draw();
		IriSP.trace("__IriSP.createInterface","ICI2");
		IriSP.jQuery( "#ldt-CtrlPlay" ).attr( "style", "background-color:#CD21C24;" );
		
		IriSP.jQuery( "#Ldt-load-container" ).hide();
		
		if( IriSP.config.gui.mode=="radio" & IriSP.jQuery.browser.msie != true ) {
			IriSP.jQuery( "#Ldtplayer1" ).attr( "height", "0" );
		}
		IriSP.trace( "__IriSP.createInterface" , "3" );

		IriSP.trace( "__IriSP.createInterface", "END" );
		
	};
