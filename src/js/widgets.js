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

IriSP.PlayerWidget.prototype = new IriSP.Widget;

IriSP.PlayerWidget.prototype.draw = function() {
  var _this = this;
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
  
  IriSP.jQuery("#amount").val(IriSP.jQuery("#slider-range-min").slider("value")+" s");
  IriSP.jQuery(".Ldt-Control1 button:first").button({
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
  }).click(function() { _this.muteHandler.call(_this); } );

  // /!\ PB A MODIFIER 
  //__IriSP.MyTags.draw();
  IriSP.jQuery( "#ldt-CtrlPlay" ).attr( "style", "background-color:#CD21C24;" );
  
  IriSP.jQuery( "#Ldt-load-container" ).hide();
  
  if( this._config.gui.mode=="radio" & IriSP.jQuery.browser.msie != true ) {
    IriSP.jQuery( "#Ldtplayer1" ).attr( "height", "0" );
  }

  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.sliderUpdater));
};

IriSP.PlayerWidget.prototype.playHandler = function() {
  var status = this._Popcorn.media.paused;
  
  if ( status == true ){        
    this._Popcorn.play();
    IriSP.jQuery( ".ui-icon-play" ).css( "background-position", "-16px -160px" );
    IriSP.jQuery( "#ldt-CtrlPlay" ).attr("title", "Play");
  } else {
    this._Popcorn.pause();
    IriSP.jQuery( ".ui-icon-play" ).css( "background-position","0px -160px" );
    IriSP.jQuery( "#ldt-CtrlPlay" ).attr("title", "Pause");
  }  
};

IriSP.PlayerWidget.prototype.muteHandler = function() {
  if (!this._Popcorn.muted()) {    
      this._Popcorn.mute(true);
      IriSP.jQuery(" .ui-icon-volume-on ").css("background-position", "-130px -160px");    
    } else {
      this._Popcorn.mute(false);
      IriSP.jQuery( ".ui-icon-volume-on" ).css("background-position", "-144px -160px" );
    }
};

IriSP.PlayerWidget.prototype.sliderUpdater = function() {  
  var currentPosition = this._Popcorn.currentTime();   
	IriSP.jQuery( "#slider-range-min" ).slider( "value", currentPosition);		
};


IriSP.AnnotationsWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  
};


IriSP.AnnotationsWidget.prototype = new IriSP.Widget;

IriSP.AnnotationsWidget.prototype.clear = function() {
    IriSP.jQuery("#Ldt-SaTitle").text("");
    IriSP.jQuery("#Ldt-SaDescription").text("");
    IriSP.jQuery("#Ldt-SaKeywordText").text("");
};

IriSP.AnnotationsWidget.prototype.displayAnnotation = function(annotation) {
    var title = annotation.content.title;
    var description = annotation.content.description;
    var keywords =  "" // FIXME;
    var begin = +annotation.begin;
    var end = +annotation.end;
    var duration = +this._serializer.currentMedia().meta["dc:duration"];

    IriSP.jQuery("#Ldt-SaTitle").text(title);
    IriSP.jQuery("#Ldt-SaDescription").text(description);
    IriSP.jQuery("#Ldt-SaKeywordText").text("Mots clefs : "+ keywords);
		var startPourcent = parseInt(Math.round((begin*1+(end*1-begin*1)/2) / (duration*1)) / 100); 
		IriSP.jQuery("#Ldt-Show-Arrow").animate({left:startPourcent+'%'},1000);
		//IriSP.jQuery("#"+annotationTempo.id).animate({alpha:'100%'},1000);

};

IriSP.AnnotationsWidget.prototype.draw = function() {
  var _this = this;

  var annotationMarkup = Mustache.to_html(IriSP.annotationWidget_template, {"share_template" : IriSP.share_template});
	IriSP.jQuery("#Ldt-Ligne").append(annotationMarkup);
  console.dir(this._serializer);
  
  var annotations = this._serializer._data.annotations;
	for (i in annotations) {    
    var annotation = annotations[i];
    var begin = Math.round((+ annotation.begin) / 1000);
    var end = Math.round((+ annotation.end) / 1000);

    this._Popcorn = this._Popcorn.code({start: begin, end: end, 
                                        onStart: 
                                          function(annotation) { return function() { _this.displayAnnotation(annotation); } }(annotation) });                                             
  }
};
