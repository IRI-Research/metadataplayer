/* the widget classes and definitions */

IriSP.Widget = function(Popcorn, config, Serializer) {
  this._Popcorn = Popcorn;
  this._config = config;  
  this._serializer = Serializer;
};

IriSP.Widget.prototype.draw = function() {
  /* implemented by "sub-classes" */  
};

IriSP.Widget.prototype.redraw = function() {
  /* implemented by "sub-classes" */  
};

IriSP.PlayerWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  
};

IriSP.PlayerWidget.prototype = IriSP.Widget;

IriSP.PlayerWidget.prototype.draw = function() {
  var width = this._config.gui.width;
	var height = this._config.gui.height;
	var heightS = this._config.gui.height-20;
		
	if( this._config.gui.mode=="radio" ){

		//IriSP.jQuery( "#"+this._config.gui.container ).before(IriSP.search_template);
		var radioPlayer = Mustache.to_html(IriSP.radio_template, {"share_template" : IriSP.share_template});    
		IriSP.jQuery(radioPlayer).appendTo("#"+this._config.gui.container);
    
		// special tricks for IE 7
		if (IriSP.jQuery.browser.msie==true && IriSP.jQuery.browser.version=="7.0"){
			//LdtSearchContainer
			//__IriSP.jQuery("#LdtPlayer").attr("margin-top","50px");
			IriSP.jQuery("#Ldt-Root").css("padding-top","25px");			
		}
	} else if(this._config.gui.mode=="video") {
	
		var videoPlayer = Mustache.to_html(IriSP.video_template, {"share_template" : IriSP.share_template, "heightS" : heightS});
		IriSP.jQuery(videoPlayer).appendTo("#"+this._config.gui.container);
	}
	
	IriSP.jQuery("#Ldt-Annotations").width(width-(75*2));
	IriSP.jQuery("#Ldt-Show-Arrow-container").width(width-(75*2));
	IriSP.jQuery("#Ldt-ShowAnnotation-audio").width(width-10);
	IriSP.jQuery("#Ldt-ShowAnnotation-video").width(width-10);
	IriSP.jQuery("#Ldt-SaKeyword").width(width-10);
	IriSP.jQuery("#Ldt-controler").width(width-10);
	IriSP.jQuery("#Ldt-Control").attr("z-index","100");
	IriSP.jQuery("#Ldt-controler").hide();
	
	IriSP.jQuery(IriSP.annotation_loading_template).appendTo("#Ldt-ShowAnnotation-audio");

	if(this._config.gui.mode=='radio'){
		IriSP.jQuery("#Ldt-load-container").attr("width",this._config.gui.width);
	}
	// Show or not the output
	if(this._config.gui.debug===true){
		IriSP.jQuery("#Ldt-output").show();
	} else {
		IriSP.jQuery("#Ldt-output").hide();
	}
	  		
  IriSP.jQuery( "#Ldt-controler" ).show();
  //__IriSP.jQuery("#Ldt-Root").css('display','visible');
  IriSP.jQuery( "#Ldt-ShowAnnotation").click( function () { 
     //__IriSP.jQuery(this).slideUp(); 
  } );

  var LdtpPlayerY = IriSP.jQuery("#Ldt-PlaceHolder").attr("top");
  var LdtpPlayerX = IriSP.jQuery("#Ldt-PlaceHolder").attr("left");
  
  IriSP.jQuery( "#slider-range-min" ).slider( { //range: "min",
    value: 0,
    min: 1,
    max: this._serializer.currentMedia().meta["dc:duration"]/1000,//1:54:52.66 = 3600+3240+
    step: 0.1,
    slide: function(event, ui) {
      
      //__IriSP.jQuery("#amount").val(ui.value+" s");
      //player.sendEvent('SEEK', ui.value)
      IriSP.MyApiPlayer.seek(ui.value);
      //changePageUrlOffset(ui.value);
      //player.sendEvent('PAUSE')
    }
  } );
  
  IriSP.jQuery("#amount").val(IriSP.jQuery("#slider-range-min").slider("value")+" s");
  IriSP.jQuery(".Ldt-Control1 button:first").button({
    icons: {
      primary: 'ui-icon-play'
    },
    text: false
  }).click(IriSP.wrap(this, this.playEvent))
    .next().button({
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
  IriSP.jQuery( "#ldt-CtrlPlay" ).attr( "style", "background-color:#CD21C24;" );
  
  IriSP.jQuery( "#Ldt-load-container" ).hide();
  
  if( this._config.gui.mode=="radio" & IriSP.jQuery.browser.msie != true ) {
    IriSP.jQuery( "#Ldtplayer1" ).attr( "height", "0" );
  }
  IriSP.trace( "__IriSP.createInterface" , "3" );

  IriSP.trace( "__IriSP.createInterface", "END" );
  
  
};

IriSP.PlayerWidget.prototype.playEvent = function() {
   var status = this._Popcorn.media.paused;
      
  if ( status == true ){        
    this._Popcorn.play();
  } else {
    this._Popcorn.pause();
  }
  
  this._Popcorn.trigger("mulz");
};