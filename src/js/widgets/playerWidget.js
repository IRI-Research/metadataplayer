/* Internationalization for this widget */

IriSP.i18n.addMessages(
    {
        "en": {
            "play_pause": "Play/Pause",
            "mute_unmute": "Mute/Unmute",
            "play": "Play",
            "pause": "Pause",
            "mute": "Mute",
            "unmute": "Unmute",
            "annotate": "Annotate",
            "search": "Search",
            "elapsed_time": "Elapsed time",
            "total_time": "Total time",
            "volume": "Volume",
            "volume_control": "Volume control"
        },
        "fr": {
            "play_pause": "Lecture/Pause",
            "mute_unmute": "Couper/Activer le son",
            "play": "Lecture",
            "pause": "Pause",
            "mute": "Couper le son",
            "unmute": "Activer le son",
            "annotate": "Annoter",
            "search": "Rechercher",
            "elapsed_time": "Durée écoulée",
            "total_time": "Durée totale",
            "volume": "Niveau sonore",
            "volume_control": "Réglage du niveau sonore"
        }
    }
);


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
	  
	var playerTempl = IriSP.templToHTML(IriSP.player_template, this._config);
  this.selector.append(playerTempl);		
	
  this.selector.children(".Ldt-controler").show();
    
  // handle clicks by the user on the video.
  this._Popcorn.listen("play", IriSP.wrap(this, this.playButtonUpdater));
  this._Popcorn.listen("pause", IriSP.wrap(this, this.playButtonUpdater));
  
  this._Popcorn.listen("volumechange", IriSP.wrap(this, this.volumeUpdater));

  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.timeDisplayUpdater));  
  // update the time display for the first time.
  this._Popcorn.listen("loadedmetadata", IriSP.wrap(this, this.timeDisplayUpdater));
  
  this._Popcorn.listen("IriSP.search.matchFound", IriSP.wrap(this, this.searchMatch));
  this._Popcorn.listen("IriSP.search.noMatchFound", IriSP.wrap(this, this.searchNoMatch));
  this._Popcorn.listen("IriSP.search.triggeredSearch", IriSP.wrap(this, this.triggeredSearch));
  
  
  this.selector.find(".Ldt-CtrlPlay").click(function() { self.playHandler.call(self); });
  this.selector.find(".Ldt-CtrlAnnotate").click(function() 
                                            { self._Popcorn.trigger("IriSP.PlayerWidget.AnnotateButton.clicked"); });
  this.selector.find(".Ldt-CtrlSearch").click(function() { self.searchButtonHandler.call(self); });
  
	var _volctrl = this.selector.find(".Ldt-Ctrl-Volume-Control");
    this.selector.find('.Ldt-CtrlSound')
        .click(function() { self.muteHandler.call(self); } )
        .mouseover(function() {
            _volctrl.show();
        })
        .mouseout(function() {
            _volctrl.hide();
        });
    _volctrl.mouseover(function() {
        _volctrl.show();
    }).mouseout(function() {
        _volctrl.hide();
    });
  
  /*
  var searchButtonPos = this.selector.find(".Ldt-CtrlSearch").position();
  var searchBox = Mustache.to_html(IriSP.search_template, {margin_left : searchButtonPos.left + "px"});
  this.selector.find(".Ldt-CtrlSearch").after(searchBox);
  */
  
  // trigger an IriSP.PlayerWidget.MouseOver to the widgets that are interested (i.e : sliderWidget)
  this.selector.hover(function() { self._Popcorn.trigger("IriSP.PlayerWidget.MouseOver"); }, 
                      function() { self._Popcorn.trigger("IriSP.PlayerWidget.MouseOut"); });
  this.selector.find(".Ldt-Ctrl-Volume-Cursor").draggable({
      axis: "x",
      drag: function(event, ui) {
          var _vol = Math.max(0, Math.min( 1, ui.position.left / (ui.helper.parent().width() - ui.helper.outerWidth())));
          ui.helper.attr("title",IriSP.i18n.getMessage('volume')+': ' + Math.floor(100*_vol) + '%');
          self._Popcorn.volume(_vol);
      },
      containment: "parent"
  });
 
 setTimeout(function() {
     self.volumeUpdater();
 }, 1000); /* some player - jwplayer notable - save the state of the mute button between sessions */
};

/* Update the elasped time div */
IriSP.PlayerWidget.prototype.timeDisplayUpdater = function() {
  
  if (this._previousSecond === undefined) {
    this._previousSecond = this._Popcorn.roundTime();
  }
  else {
    /* we're still in the same second, so it's not necessary to update time */
    if (this._Popcorn.roundTime() == this._previousSecond)
      return;
      
  }
  
  // we get it at each call because it may change.
  var duration = this.getDuration() / 1000; 
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
    /* the background sprite is changed by adding/removing the correct classes */
    this.selector.find(".Ldt-CtrlPlay").attr("title", IriSP.i18n.getMessage('play'));
    this.selector.find(".Ldt-CtrlPlay").removeClass("Ldt-CtrlPlay-PauseState").addClass("Ldt-CtrlPlay-PlayState");
  } else {
    this.selector.find(".Ldt-CtrlPlay").attr("title", IriSP.i18n.getMessage('pause'));
    this.selector.find(".Ldt-CtrlPlay").removeClass("Ldt-CtrlPlay-PlayState").addClass("Ldt-CtrlPlay-PauseState");
  }  

  return;
};


IriSP.PlayerWidget.prototype.playHandler = function() {
  var status = this._Popcorn.media.paused;
  
  if ( status == true ){        
    this._Popcorn.play();   
  } else {
    this._Popcorn.pause();
  }  
};

IriSP.PlayerWidget.prototype.muteHandler = function() {
  this._Popcorn.mute(!this._Popcorn.muted());
};

IriSP.PlayerWidget.prototype.volumeUpdater = function() {
    var _muted = this._Popcorn.muted(),
        _vol = this._Popcorn.volume();
    if (_vol === false) {
        _vol = .5;
    }
    var _soundCtl = this.selector.find(".Ldt-CtrlSound");
    _soundCtl.removeClass("Ldt-CtrlSound-Mute Ldt-CtrlSound-Half Ldt-CtrlSound-Full");
    if (_muted) {        
        _soundCtl.attr("title", IriSP.i18n.getMessage('unmute'))
            .addClass("Ldt-CtrlSound-Mute");    
    } else {
        _soundCtl.attr("title", IriSP.i18n.getMessage('mute'))
            .addClass(_vol < .5 ? "Ldt-CtrlSound-Half" : "Ldt-CtrlSound-Full" )
    }
    var _cursor = this.selector.find(".Ldt-Ctrl-Volume-Cursor");
    _cursor.css({
        "left": ( _muted ? 0 : Math.floor(_vol * (_cursor.parent().width() - _cursor.outerWidth())) ) + "px"
    })
};

IriSP.PlayerWidget.prototype.showSearchBlock = function() {
  var self = this;
  
  if (this._searchBlockOpen == false) {
    this.selector.find(".LdtSearch").show("blind", { direction: "horizontal"}, 100);
    this.selector.find(".LdtSearchInput").css('background-color','#fff');
   
    this._searchBlockOpen = true;           
    this.selector.find(".LdtSearchInput").bind('keyup', null, function() { self.searchHandler.call(self); } );
    this.selector.find(".LdtSearchInput").focus();
    
    // we need this variable because some widget can find a match in
    // their data while at the same time other's don't. As we want the
    // search field to become green when there's a match, we need a 
    // variable to remember that we had one.
    this._positiveMatch = false;

    // tell the world the field is open
    this._Popcorn.trigger("IriSP.search.open");     
	}
};

IriSP.PlayerWidget.prototype.hideSearchBlock = function() {
 if (this._searchBlockOpen == true) {
    this._searchLastValue = this.selector.find(".LdtSearchInput").attr('value');
    this.selector.find(".LdtSearchInput").attr('value','');
    this.selector.find(".LdtSearch").hide("blind", { direction: "horizontal"}, 75);
    
    // unbind the watcher event.
    this.selector.find(".LdtSearchInput").unbind('keypress set');
    this._searchBlockOpen = false;

    this._positiveMatch = false;
    
    this._Popcorn.trigger("IriSP.search.closed");
	}
};

/** react to clicks on the search button */
IriSP.PlayerWidget.prototype.searchButtonHandler = function() {
  var self = this;

  /* show the search field if it is not shown */
  if ( this._searchBlockOpen == false ) {
    this.showSearchBlock();
    this.selector.find(".LdtSearchInput").attr('value', this._searchLastValue);      
    this._Popcorn.trigger("IriSP.search", this._searchLastValue); // trigger the search to make it more natural.
	} else {
    this.hideSearchBlock();
  }
};

/** this handler is called whenever the content of the search
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

/**
  handler for the IriSP.search.found message, which is sent by some views when they
  highlight a match.
*/
IriSP.PlayerWidget.prototype.searchMatch = function() {
  this._positiveMatch = true;
  this.selector.find(".LdtSearchInput").css('background-color','#e1ffe1');
};

/** the same, except that no value could be found */
IriSP.PlayerWidget.prototype.searchNoMatch = function() {
  if (this._positiveMatch !== true)
    this.selector.find(".LdtSearchInput").css('background-color', "#d62e3a");
};

/** react to an IriSP.Player.triggeredSearch - that is, when
    a widget ask the PlayerWidget to do a search on his behalf */
IriSP.PlayerWidget.prototype.triggeredSearch = function(searchString) {
  this.showSearchBlock();
  this.selector.find(".LdtSearchInput").attr('value', searchString);      
  this._Popcorn.trigger("IriSP.search", searchString); // trigger the search to make it more natural.
};

