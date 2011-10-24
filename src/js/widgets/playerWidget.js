IriSP.PlayerWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
};

IriSP.PlayerWidget.prototype = new IriSP.Widget();

IriSP.PlayerWidget.prototype.draw = function() {
  var _this = this;
  var width = this.width;
	var height = this.height;
	var heightS = this.height-20;
		
	if (this._config.mode=="radio") {

		//IriSP.jQuery( "#"+this._config.container ).before(IriSP.search_template);
		var radioPlayer = Mustache.to_html(IriSP.radio_template, {"share_template" : IriSP.share_template});
    this.selector.append(radioPlayer);		
    
		// special tricks for IE 7
		if (IriSP.jQuery.browser.msie == true && IriSP.jQuery.browser.version == "7.0"){
			//LdtSearchContainer
			//__IriSP.jQuery("#LdtPlayer").attr("margin-top","50px");
			this.selector.children("#Ldt-Root").css("padding-top","25px");			
		}
	} else if (this._config.mode == "video") {
	
		var videoPlayer = Mustache.to_html(IriSP.video_template, {"share_template" : IriSP.share_template, "heightS" : heightS});
    this.selector.append(videoPlayer);		
	}
	
	this.selector.children("#Ldt-Annotations").width(width - (75 * 2));
	this.selector.children("#Ldt-Show-Arrow-container").width(width - (75 * 2));
	this.selector.children("#Ldt-ShowAnnotation-audio").width(width - 10);
	this.selector.children("#Ldt-ShowAnnotation-video").width(width - 10);
	this.selector.children("#Ldt-SaKeyword").width(width - 10);
	this.selector.children("#Ldt-controler").width(width - 10);
	this.selector.children("#Ldt-Control").attr("z-index", "100");
	this.selector.children("#Ldt-controler").hide();
	
  this.selector.children("#Ldt-ShowAnnotation-audio").append(IriSP.annotation_loading_template);	

	if(this._config.mode=='radio'){
		this.selector.children("#Ldt-load-container").attr("width",this.width);
	}
	  		
  this.selector.children("#Ldt-controler").show();
  //__IriSP.jQuery("#Ldt-Root").css('display','visible');
  this.selector.children("#Ldt-ShowAnnotation").click( function () { 
     //__IriSP.jQuery(this).slideUp(); 
  } );

  var LdtpPlayerY = this.selector.children("#Ldt-PlaceHolder").attr("top");
  var LdtpPlayerX = this.selector.children("#Ldt-PlaceHolder").attr("left");
  
  this.selector.find("#slider-range-min").slider( { //range: "min",
    value: 0,
    min: 1,
    max: this._serializer.currentMedia().meta["dc:duration"]/1000,//1:54:52.66 = 3600+3240+
    step: 0.1,
    slide: function(event, ui) {     
      _this._Popcorn.currentTime(ui.value);
    },
    /* change event is similar to slide, but it happens when the slider position is 
       modified programatically. We use it for unit tests */
    /*   
    change: function(event, ui) {     
      _this._Popcorn.currentTime(ui.value);
    }
    */
  } );
  
  this.selector.children("#amount").val(this.selector.children("#slider-range-min").slider("value")+" s");
  this.selector.children(".Ldt-Control1 button:first").button({
    icons: {
      primary: 'ui-icon-play'
    },
    text: false
  }).click(function() { _this.playHandler.call(_this); })
    .next().button({
    icons: {
      primary: 'ui-icon-seek-next'
    },
     text: false
  });
  this.selector.children(".Ldt-Control2 button:first").button({
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
  }).click(function() { _this.muteHandler.call(_this); } );

  this.selector.children("#ldt-CtrlPlay").attr( "style", "background-color:#CD21C24;" );
  
  this.selector.children("#Ldt-load-container").hide();
  
  if( this._config.mode=="radio" & IriSP.jQuery.browser.msie != true ) {
    IriSP.jQuery( "#Ldtplayer1" ).attr( "height", "0" );
  }

  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.sliderUpdater));
};

IriSP.PlayerWidget.prototype.playHandler = function() {
  var status = this._Popcorn.media.paused;
  
  if ( status == true ){        
    this._Popcorn.play();
    this.selector.children(".ui-icon-play").css( "background-position", "-16px -160px" );
    this.selector.children("#ldt-CtrlPlay").attr("title", "Play");
  } else {
    this._Popcorn.pause();
    this.selector.children(".ui-icon-play").css( "background-position","0px -160px" );
    this.selector.children("#ldt-CtrlPlay").attr("title", "Pause");
  }  
};

IriSP.PlayerWidget.prototype.muteHandler = function() {
  if (!this._Popcorn.muted()) {    
      this._Popcorn.mute(true);
      this.selector.children(" .ui-icon-volume-on ").css("background-position", "-130px -160px");    
    } else {
      this._Popcorn.mute(false);
      this.selector.children( ".ui-icon-volume-on" ).css("background-position", "-144px -160px" );
    }
};

IriSP.PlayerWidget.prototype.sliderUpdater = function() {  
  var currentPosition = this._Popcorn.currentTime();   
	this.selector.find( "#slider-range-min" ).slider( "value", currentPosition);		
};

