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


IriSP.PlayerWidget = function(player, config) {
  IriSP.Widget.call(this, player, config);
  
  this._searchLastValue = "";
};

IriSP.PlayerWidget.prototype = new IriSP.Widget();

IriSP.PlayerWidget.prototype.draw = function() {
    var _this = this,
        _html = IriSP.templToHTML(IriSP.player_template, this);
    
    this.$.append(_html);
    
    // Define blocks
    this.$playButton = this.$.find(".Ldt-Ctrl-Play");
    this.$searchBlock = this.$.find(".Ldt-Ctrl-Search");
    this.$searchInput = this.$.find(".Ldt-Ctrl-SearchInput");
    this.$volumeBar = this.$.find(".Ldt-Ctrl-Volume-Bar");
    
    // handle events
    this.bindPopcorn("play","playButtonUpdater");
    this.bindPopcorn("pause","playButtonUpdater");
    this.bindPopcorn("volumechange","volumeUpdater");
    this.bindPopcorn("timeupdate","timeDisplayUpdater");
    this.bindPopcorn("loadedmetadata","timeDisplayUpdater");
    this.bindPopcorn("IriSP.search.matchFound","searchMatch");
    this.bindPopcorn("IriSP.search.noMatchFound","searchNoMatch");
    this.bindPopcorn("IriSP.search.triggeredSearch","triggeredSearch");
    
    // handle clicks
    this.$playButton.click(this.functionWrapper("playHandler"));
    
    this.$.find(".Ldt-Ctrl-Annotate").click(function() {
        _this.player.popcorn.trigger("IriSP.PlayerWidget.AnnotateButton.clicked");
    });
    this.$.find(".Ldt-Ctrl-SearchBtn").click(this.functionWrapper("searchButtonHandler"));
    
    this.$searchInput.keyup(this.functionWrapper("searchHandler") );
  
	var _volctrl = this.$.find(".Ldt-Ctrl-Volume-Control");
    this.$.find('.Ldt-Ctrl-Sound')
        .click(this.functionWrapper("muteHandler"))
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
  
    
    // Allow Volume Cursor Dragging
    this.$volumeBar.slider({
        slide: function(event, ui) {
            _this.$volumeBar.attr("title",IriSP.i18n.getMessage('volume')+': ' + ui.value + '%');
            _this.player.popcorn.volume(ui.value / 100);
        },
        stop: this.functionWrapper("volumeUpdater")
    });

    // trigger an IriSP.PlayerWidget.MouseOver to the widgets that are interested (i.e : sliderWidget)
    this.$.hover(
        function() {
            _this.player.popcorn.trigger("IriSP.PlayerWidget.MouseOver");
        }, 
        function() {
            _this.player.popcorn.trigger("IriSP.PlayerWidget.MouseOut");
        });
    setTimeout(this.functionWrapper("volumeUpdater"), 1000);
    /* some players - including jwplayer - save the state of the mute button between sessions */
};

/* Update the elasped time div */
IriSP.PlayerWidget.prototype.timeDisplayUpdater = function() {
    var _curTime = this.player.popcorn.roundTime();
    if (typeof this._previousSecond !== "undefined" && _curTime === this._previousSecond) {
        return;
    }
  
    // we get it at each call because it may change.
    var _totalTime = this.source.getDuration(),
        _elapsedTime = new IriSP.Model.Time();
        
    _elapsedTime.setSeconds(_curTime);
  
    this.$.find(".Ldt-Ctrl-Time-Elapsed").html(_elapsedTime.toString());
    this.$.find(".Ldt-Ctrl-Time-Total").html(_totalTime.toString());
    this._previousSecond = _curTime;
};

/* update the icon of the button - separate function from playHandler
   because in some cases (for instance, when the user directly clicks on
   the jwplayer window) we have to change the icon without playing/pausing
*/
IriSP.PlayerWidget.prototype.playButtonUpdater = function() {
    
    var status = this.player.popcorn.media.paused;
  
    if (status) {
    /* the background sprite is changed by adding/removing the correct classes */
        this.$playButton
            .attr("title", IriSP.i18n.getMessage('play'))
            .removeClass("Ldt-Ctrl-Play-PauseState")
            .addClass("Ldt-Ctrl-Play-PlayState");
    } else {
        this.$playButton
            .attr("title", IriSP.i18n.getMessage('pause'))
            .removeClass("Ldt-Ctrl-Play-PlayState")
            .addClass("Ldt-Ctrl-Play-PauseState");
    }
};


IriSP.PlayerWidget.prototype.playHandler = function() {
    
    var status = this.player.popcorn.media.paused;
  
    if (status) {        
        this.player.popcorn.play();   
    } else {
        this.player.popcorn.pause();
    }  
};

IriSP.PlayerWidget.prototype.muteHandler = function() {
    this.player.popcorn.mute(!this.player.popcorn.muted());
};

IriSP.PlayerWidget.prototype.volumeUpdater = function() {
    var _muted = this.player.popcorn.muted(),
        _vol = this.player.popcorn.volume();
    if (_vol === false) {
        _vol = .5;
    }
    var _soundCtl = this.$.find(".Ldt-Ctrl-Sound");
    _soundCtl.removeClass("Ldt-Ctrl-Sound-Mute Ldt-Ctrl-Sound-Half Ldt-Ctrl-Sound-Full");
    if (_muted) {        
        _soundCtl.attr("title", IriSP.i18n.getMessage('unmute'))
            .addClass("Ldt-Ctrl-Sound-Mute");    
    } else {
        _soundCtl.attr("title", IriSP.i18n.getMessage('mute'))
            .addClass(_vol < .5 ? "Ldt-Ctrl-Sound-Half" : "Ldt-Ctrl-Sound-Full" )
    }
    this.$volumeBar.slider("value", _muted ? 0 : 100 * _vol);
};

IriSP.PlayerWidget.prototype.showSearchBlock = function() {
    this.$searchBlock.show("blind", { direction: "horizontal"}, 100);
    this.$searchInput.css('background-color','#fff');
   
    this.$searchInput.focus();
    
    // we need this variable because some widgets can find a match in
    // their data while at the same time others don't. As we want the
    // search field to become green when there's a match, we need a 
    // variable to remember that we had one.
    this._positiveMatch = false;

    // tell the world the field is open
    this.player.popcorn.trigger("IriSP.search.open");
};

IriSP.PlayerWidget.prototype.hideSearchBlock = function() {
    this._searchLastValue = this.$searchInput.val();
    this.$searchInput.val('');
    this.$searchBlock.hide("blind", { direction: "horizontal"}, 75);

    this._positiveMatch = false;
    
    this.player.popcorn.trigger("IriSP.search.closed");
};

/** react to clicks on the search button */
IriSP.PlayerWidget.prototype.searchButtonHandler = function() {
    if ( this.$searchBlock.is(":hidden") ) {
        this.showSearchBlock();
        this.$searchInput.val(this._searchLastValue);      
        this.player.popcorn.trigger("IriSP.search", this._searchLastValue); // trigger the search to make it more natural.
	} else {
        this.hideSearchBlock();
    }
};

/** this handler is called whenever the content of the search
   field changes */
IriSP.PlayerWidget.prototype.searchHandler = function() {
    this._searchLastValue = this.$searchInput.val();
    this._positiveMatch = false;
  
    // do nothing if the search field is empty, instead of highlighting everything.
    if (this._searchLastValue == "") {
        this.player.popcorn.trigger("IriSP.search.cleared");
        this.$searchInput.css('background-color','');
    } else {
        this.player.popcorn.trigger("IriSP.search", this._searchLastValue);
    }
};

/**
  handler for the IriSP.search.found message, which is sent by some views when they
  highlight a match.
*/
IriSP.PlayerWidget.prototype.searchMatch = function() {
    this._positiveMatch = true;
    this.$searchInput.css('background-color','#e1ffe1');
};

/** the same, except that no value could be found */
IriSP.PlayerWidget.prototype.searchNoMatch = function() {
    if (this._positiveMatch !== true) {
        this.$searchInput.css('background-color', "#d62e3a");
    }
};

/** react to an IriSP.Player.triggeredSearch - that is, when
    a widget ask the PlayerWidget to do a search on his behalf */
IriSP.PlayerWidget.prototype.triggeredSearch = function(searchString) {
    this.showSearchBlock();
    this.$searchInput.attr('value', searchString);      
    this.player.popcorn.trigger("IriSP.search", searchString); // trigger the search to make it more natural.
};


