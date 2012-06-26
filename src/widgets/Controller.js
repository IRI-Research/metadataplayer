/* Displays Play and Pause buttons, Search Button and Form, Volume Control */

IriSP.Widgets.Controller = function(player, config) {
  IriSP.Widgets.Widget.call(this, player, config);
  
  this._searchLastValue = "";
};

IriSP.Widgets.Controller.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Controller.prototype.defaults = {
    disable_annotate_btn: false,
    disable_search_btn: false
}

IriSP.Widgets.Controller.prototype.template =
    '<div class="Ldt-Ctrl">'
    + '<div class="Ldt-Ctrl-Left">'
    + '<div class="Ldt-Ctrl-button Ldt-Ctrl-Play Ldt-Ctrl-Play-PlayState Ldt-TraceMe" title="{{l10n.play_pause}}"></div>'
    + '<div class="Ldt-Ctrl-spacer"></div>'
    + '{{^disable_annotate_btn}}'
    + '<div class="Ldt-Ctrl-button Ldt-Ctrl-Annotate Ldt-TraceMe" title="{{l10n.annotate}}"></div>'
    + '<div class="Ldt-Ctrl-spacer"></div>'
    + '{{/disable_annotate_btn}}'
    + '{{^disable_search_btn}}'
    + '<div class="Ldt-Ctrl-button Ldt-Ctrl-SearchBtn Ldt-TraceMe" title="{{l10n.search}}"></div>'
    + '<div class="Ldt-Ctrl-spacer"></div>'
    + '{{/disable_search_btn}}'
    + '<div class="Ldt-Ctrl-Search">'
    + '<input class="Ldt-Ctrl-SearchInput Ldt-TraceMe"></input>'
    + '</div>'
    + '</div>'
    + '<div class="Ldt-Ctrl-Right">'
    + '<div class="Ldt-Ctrl-spacer"></div>'
    + '<div class="Ldt-Ctrl-Time">'
    + '<div class="Ldt-Ctrl-Time-Elapsed" title="{{l10n.elapsed_time}}">00:00</div>'
    + '<div class="Ldt-Ctrl-Time-Separator">/</div>'
    + '<div class="Ldt-Ctrl-Time-Total" title="{{l10n.total_time}}">00:00</div>'
    + '</div>'
    + '<div class="Ldt-Ctrl-spacer"></div>'
    + '<div class="Ldt-Ctrl-button Ldt-Ctrl-Sound Ldt-Ctrl-Sound-Full Ldt-TraceMe" title="{{l10n.mute_unmute}}"></div>'
    + '</div>'
    + '<div class="Ldt-Ctrl-Volume-Control" title="{{l10n.volume_control}}">'
    + '<div class="Ldt-Ctrl-Volume-Bar"></div>'
    + '</div>'
    + '</div>';

IriSP.Widgets.Controller.prototype.messages = {
    en: {
        play_pause: "Play/Pause",
        mute_unmute: "Mute/Unmute",
        play: "Play",
        pause: "Pause",
        mute: "Mute",
        unmute: "Unmute",
        annotate: "Annotate",
        search: "Search",
        elapsed_time: "Elapsed time",
        total_time: "Total time",
        volume: "Volume",
        volume_control: "Volume control"
    },
    fr: {
        play_pause: "Lecture/Pause",
        mute_unmute: "Couper/Activer le son",
        play: "Lecture",
        pause: "Pause",
        mute: "Couper le son",
        unmute: "Activer le son",
        annotate: "Annoter",
        search: "Rechercher",
        elapsed_time: "Durée écoulée",
        total_time: "Durée totale",
        volume: "Niveau sonore",
        volume_control: "Réglage du niveau sonore"
    }
};

IriSP.Widgets.Controller.prototype.draw = function() {
    var _this = this;
    this.renderTemplate();
    
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
    this.bindPopcorn("loadedmetadata","volumeUpdater");
    this.bindPopcorn("IriSP.search.matchFound","searchMatch");
    this.bindPopcorn("IriSP.search.noMatchFound","searchNoMatch");
    this.bindPopcorn("IriSP.search.triggeredSearch","triggeredSearch");
    
    // handle clicks
    this.$playButton.click(this.functionWrapper("playHandler"));
    
    this.$.find(".Ldt-Ctrl-Annotate").click(function() {
        _this.player.popcorn.trigger("IriSP.CreateAnnotation.toggle");
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
            _this.$volumeBar.attr("title",_this.l10n.volume+': ' + ui.value + '%');
            _this.player.popcorn.volume(ui.value / 100);
        },
        stop: this.functionWrapper("volumeUpdater")
    });

    // trigger an IriSP.Player.MouseOver to the widgets that are interested (i.e : sliderWidget)
    this.$.hover(
        function() {
            _this.player.popcorn.trigger("IriSP.Player.MouseOver");
        }, 
        function() {
            _this.player.popcorn.trigger("IriSP.Player.MouseOut");
        });
    /* some players - including jwplayer - save the state of the mute button between sessions */

    window.setTimeout(this.functionWrapper("volumeUpdater"), 1000);
   
};

/* Update the elasped time div */
IriSP.Widgets.Controller.prototype.timeDisplayUpdater = function() {
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
IriSP.Widgets.Controller.prototype.playButtonUpdater = function() {
    
    var status = this.player.popcorn.media.paused;
  
    if (status) {
    /* the background sprite is changed by adding/removing the correct classes */
        this.$playButton
            .attr("title", this.l10n.play)
            .removeClass("Ldt-Ctrl-Play-PauseState")
            .addClass("Ldt-Ctrl-Play-PlayState");
    } else {
        this.$playButton
            .attr("title", this.l10n.pause)
            .removeClass("Ldt-Ctrl-Play-PlayState")
            .addClass("Ldt-Ctrl-Play-PauseState");
    }
};


IriSP.Widgets.Controller.prototype.playHandler = function() {
    
    var status = this.player.popcorn.media.paused;
  
    if (status) {        
        this.player.popcorn.play();   
    } else {
        this.player.popcorn.pause();
    }  
};

IriSP.Widgets.Controller.prototype.muteHandler = function() {
    this.player.popcorn.muted(!this.player.popcorn.muted());
};

IriSP.Widgets.Controller.prototype.volumeUpdater = function() {
    var _muted = this.player.popcorn.muted(),
        _vol = this.player.popcorn.volume();
    if (_vol === false) {
        _vol = .5;
    }
    var _soundCtl = this.$.find(".Ldt-Ctrl-Sound");
    _soundCtl.removeClass("Ldt-Ctrl-Sound-Mute Ldt-Ctrl-Sound-Half Ldt-Ctrl-Sound-Full");
    if (_muted) {        
        _soundCtl.attr("title", this.l10n.unmute)
            .addClass("Ldt-Ctrl-Sound-Mute");    
    } else {
        _soundCtl.attr("title", this.l10n.mute)
            .addClass(_vol < .5 ? "Ldt-Ctrl-Sound-Half" : "Ldt-Ctrl-Sound-Full" )
    }
    this.$volumeBar.slider("value", _muted ? 0 : 100 * _vol);
};

IriSP.Widgets.Controller.prototype.showSearchBlock = function() {
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

IriSP.Widgets.Controller.prototype.hideSearchBlock = function() {
    this._searchLastValue = this.$searchInput.val();
    this.$searchInput.val('');
    this.$searchBlock.hide("blind", { direction: "horizontal"}, 75);

    this._positiveMatch = false;
    
    this.player.popcorn.trigger("IriSP.search.closed");
};

/** react to clicks on the search button */
IriSP.Widgets.Controller.prototype.searchButtonHandler = function() {
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
IriSP.Widgets.Controller.prototype.searchHandler = function() {
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
IriSP.Widgets.Controller.prototype.searchMatch = function() {
    this._positiveMatch = true;
    this.$searchInput.css('background-color','#e1ffe1');
};

/** the same, except that no value could be found */
IriSP.Widgets.Controller.prototype.searchNoMatch = function() {
    if (this._positiveMatch !== true) {
        this.$searchInput.css('background-color', "#d62e3a");
    }
};

/** react to an IriSP.Player.triggeredSearch - that is, when
    a widget ask the.Player to do a search on his behalf */
IriSP.Widgets.Controller.prototype.triggeredSearch = function(searchString) {
    this.showSearchBlock();
    this.$searchInput.attr('value', searchString);      
    this.player.popcorn.trigger("IriSP.search", searchString); // trigger the search to make it more natural.
};


