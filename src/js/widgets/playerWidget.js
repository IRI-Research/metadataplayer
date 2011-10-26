IriSP.PlayerWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  
  this._searchBlockOpen = false;
  this._searchLastValue = "";
};

IriSP.PlayerWidget.prototype = new IriSP.Widget();

IriSP.PlayerWidget.prototype.draw = function() {
  var self = this;
  var width = this.width;
	var height = this.height;
	var heightS = this.height-20;
	
  var searchBox = Mustache.to_html(IriSP.search_template);
  this.selector.append(searchBox);
  
	if (this._config.mode=="radio") {
		var radioPlayer = Mustache.to_html(IriSP.radio_template, {"share_template" : IriSP.share_template});
    this.selector.append(radioPlayer);		
    
		// special tricks for IE 7
		if (IriSP.jQuery.browser.msie == true && IriSP.jQuery.browser.version == "7.0"){
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
      self._Popcorn.currentTime(ui.value);
    },
    /* change event is similar to slide, but it happens when the slider position is 
       modified programatically. We use it for unit tests */       
    change: function(event, ui) {      
      self._Popcorn.trigger("test.fixture", ui.value);
    }
    
  } );
  
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.sliderUpdater));
  this.selector.children("#amount").val(this.selector.children("#slider-range-min").slider("value")+" s");
  this.selector.children(".Ldt-Control1 button:first").button({
    icons: {
      primary: 'ui-icon-play'
    },
    text: false
  }).click(function() { self.playHandler.call(self); })
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
  }).click(function() { self.searchButtonHandler.call(self); })
    .next().button({
    icons: {
      primary: 'ui-icon-volume-on'
    },
     text: false
  }).click(function() { self.muteHandler.call(self); } );

  this.selector.children("#ldt-CtrlPlay").attr( "style", "background-color:#CD21C24;" );
  
  this.selector.children("#Ldt-load-container").hide();
  
  if( this._config.mode=="radio" & IriSP.jQuery.browser.msie != true ) {
    IriSP.jQuery( "#Ldtplayer1" ).attr( "height", "0" );
  }


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

/* updates the slider as time passes */
IriSP.PlayerWidget.prototype.sliderUpdater = function() {  
  var currentPosition = this._Popcorn.currentTime();   
	this.selector.find( "#slider-range-min" ).slider( "value", currentPosition);		
};

IriSP.PlayerWidget.prototype.searchButtonHandler = function() {
    var self = this;

    /* show the search field if it is not shown */
  	if ( this._searchBlockOpen == false ) {
      this.selector.find( ".ui-icon-search" ).css( "background-position", "-144px -112px" );
      
      this.selector.find("#LdtSearch").show(100);
      
      this.selector.find("#LdtSearchInput").css('background-color','#fff');
      this.selector.find("#LdtSearchInput").focus();
      this.selector.find("#LdtSearchInput").attr('value', this._searchLastValue);      
      this._Popcorn.trigger("IriSP.search", this._searchLastValue); // trigger the search to make it more natural.
      
      this._searchBlockOpen = true;           
      this.selector.find("#LdtSearchInput").bind('keyup', null, function() { self.searchHandler.call(self); } );
      
      // tell the world the field is open
      this._Popcorn.trigger("IriSP.search.open");
      
	} else {
      this._searchLastValue = this.selector.find("#LdtSearchInput").attr('value');
      this.selector.find("#LdtSearchInput").attr('value','');
      this.selector.find(".ui-icon-search").css("background-position","-160px -112px");
      this.selector.find("#LdtSearch").hide(100);
      
      // unbind the watcher event.
      this.selector.find("#LdtSearchInput").unbind('keypress set');
      this._searchBlockOpen = false;
      
      this._Popcorn.trigger("IriSP.search.closed");
  }
};

/* this handler is called whenever the content of the search
   field changes */
IriSP.PlayerWidget.prototype.searchHandler = function() {

  this._searchLastValue = this.selector.find("#LdtSearchInput").attr('value');
  this._Popcorn.trigger("IriSP.search", this._searchLastValue);
};

/*
  handler for the IriSP.search.found message, which is sent by some views when they
  highlight a match.
*/
IriSP.PlayerWidget.prototype.searchMatch = function() {
  this.selector.find("#LdtSearchInput").css('background-color','#e1ffe1');
}

/* the same, except that no value could be found */
IriSP.PlayerWidget.prototype.searchNoMatch = function() {
  this.selector.find("#LdtSearchInput").css('background-color','#e1ffe1');
}

