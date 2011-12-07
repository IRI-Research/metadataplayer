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
	  
	var Player_templ = Mustache.to_html(IriSP.player_template, {"share_template" : IriSP.share_template});
  this.selector.append(Player_templ);		
    
	this.selector.children(".Ldt-controler").width(width - 10);
	  		
  this.selector.children(".Ldt-controler").show();
    
  // handle clicks by the user on the video.
  this._Popcorn.listen("play", IriSP.wrap(this, this.playButtonUpdater));
  this._Popcorn.listen("pause", IriSP.wrap(this, this.playButtonUpdater));
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.timeDisplayUpdater));
  this._Popcorn.listen("IriSP.search.matchFound", IriSP.wrap(this, this.searchMatch));
  this._Popcorn.listen("IriSP.search.noMatchFound", IriSP.wrap(this, this.searchNoMatch));
  
  
  this.selector.find(".Ldt-CtrlPlay").click(function() { self.playHandler.call(self); });
  this.selector.find(".Ldt-CtrlNext").click(function() { });
  this.selector.find(".Ldt-CtrlSearch").click(function() { self.searchButtonHandler.call(self); });
  
  this.selector.find('.Ldt-CtrlSound').click(function() { self.muteHandler.call(self); } );

  this.selector.find(".Ldt-CtrlPlay").attr( "style", "background-color:#CD21C24;" );
  
  var searchButtonPos = this.selector.find(".Ldt-CtrlSearch").position();
  var searchBox = Mustache.to_html(IriSP.search_template, {margin_left : searchButtonPos.left + "px"});
  this.selector.append(searchBox);
  
  // trigger an IriSP.PlayerWidget.MouseOver to the widgets that are interested (i.e : sliderWidget)
  this.selector.hover(function() { self._Popcorn.trigger("IriSP.PlayerWidget.MouseOver"); }, 
                      function() { self._Popcorn.trigger("IriSP.PlayerWidget.MouseOut"); });
};

/* Update the elasped time div */
IriSP.PlayerWidget.prototype.timeDisplayUpdater = function() {
  
  if (this._previousSecond === undefined)
    this._previousSecond = this._Popcorn.roundTime();
  
  else {
    /* we're still in the same second, so it's not necessary to update time */
    if (this._Popcorn.roundTime() == this._previousSecond)
      return;
      
  }
  
  // we get it at each call because it may change.
  var duration = +this._serializer.currentMedia().meta["dc:duration"] / 1000; 
  var totalTime = IriSP.secondsToTime(duration);
  var elapsedTime = IriSP.secondsToTime(this._Popcorn.currentTime());
  
  this.selector.find(".Ldt-ElapsedTime").html(elapsedTime.toString());
  this.selector.find(".Ldt-TotalTime").html(totalTime.toString());
  this._previousSecond = this._Popcorn.roundTime();
};

/* update the icon of the button - separate function from playHandler
   because in some cases (for instance, when the user directly clicks on
   the jwplayer window) we have to change the icon without playing/pausing
*/
IriSP.PlayerWidget.prototype.playButtonUpdater = function() {
  var status = this._Popcorn.media.paused;
  
  if ( status == true ){        
    this.selector.find(".Ldt-CtrlPlay").attr("title", "Play");
   
    // we use templToHTML because it has some predefined
    // vars like where to get the images
    var templ = IriSP.templToHTML("url({{img_dir}}/pause_sprite.png)");
    this.selector.find(".Ldt-CtrlPlay").css("background-image", templ);

  } else {
    this.selector.find(".Ldt-CtrlPlay").attr("title", "Pause");

    // we use templToHTML because it has some predefined
    // vars like where to get the images
    var templ = IriSP.templToHTML("url({{img_dir}}/play_sprite.png)");
    this.selector.find(".Ldt-CtrlPlay").css("background-image", templ);
  }  
};


IriSP.PlayerWidget.prototype.playHandler = function() {
  var status = this._Popcorn.media.paused;
  
  this.playButtonUpdater();
  
  if ( status == true ){        
    this._Popcorn.play();   
  } else {
    this._Popcorn.pause();
  }  
};

IriSP.PlayerWidget.prototype.muteHandler = function() {
  if (!this._Popcorn.muted()) {    
      this._Popcorn.mute(true);
      this.selector.find(" .ui-icon-volume-on ").css("background-position", "-130px -160px");    
    } else {
      this._Popcorn.mute(false);
      this.selector.find( ".ui-icon-volume-on" ).css("background-position", "-144px -160px" );
    }
};

IriSP.PlayerWidget.prototype.searchButtonHandler = function() {
    var self = this;

    /* show the search field if it is not shown */
  	if ( this._searchBlockOpen == false ) {      
      this.selector.find( ".ui-icon-search" ).css( "background-position", "-144px -112px" );
      
      this.selector.find(".LdtSearch").show(100);
      
      this.selector.find(".LdtSearchInput").css('background-color','#fff');
      this.selector.find(".LdtSearchInput").focus();
      this.selector.find(".LdtSearchInput").attr('value', this._searchLastValue);      
      this._Popcorn.trigger("IriSP.search", this._searchLastValue); // trigger the search to make it more natural.
      
      this._searchBlockOpen = true;           
      this.selector.find(".LdtSearchInput").bind('keyup', null, function() { self.searchHandler.call(self); } );
      
      // we need this variable because some widget can find a match in
      // their data while at the same time other's don't. As we want the
      // search field to become green when there's a match, we need a 
      // variable to remember that we had one.
      this._positiveMatch = false;

      // tell the world the field is open
      this._Popcorn.trigger("IriSP.search.open");
      
	} else {
      this._searchLastValue = this.selector.find(".LdtSearchInput").attr('value');
      this.selector.find(".LdtSearchInput").attr('value','');
      this.selector.find(".LdtSearch").hide(100);
      
      // unbind the watcher event.
      this.selector.find(".LdtSearchInput").unbind('keypress set');
      this._searchBlockOpen = false;

      this._positiveMatch = false;
      
      this._Popcorn.trigger("IriSP.search.closed");
  }
};

/* this handler is called whenever the content of the search
   field changes */
IriSP.PlayerWidget.prototype.searchHandler = function() {
  this._searchLastValue = this.selector.find(".LdtSearchInput").attr('value');
  this._positiveMatch = false;
  
  // do nothing if the search field is empty, instead of highlighting everything.
  if (this._searchLastValue == "") {
    this._Popcorn.trigger("IriSP.search.cleared");
    this.selector.find(".LdtSearchInput").css('background-color','');
  } else {
    this._Popcorn.trigger("IriSP.search", this._searchLastValue);
  }
};

/*
  handler for the IriSP.search.found message, which is sent by some views when they
  highlight a match.
*/
IriSP.PlayerWidget.prototype.searchMatch = function() {
  this._positiveMatch = true;
  this.selector.find(".LdtSearchInput").css('background-color','#e1ffe1');
}

/* the same, except that no value could be found */
IriSP.PlayerWidget.prototype.searchNoMatch = function() {
  if (this._positiveMatch !== true)
    this.selector.find(".LdtSearchInput").css('background-color', "#d62e3a");
}

