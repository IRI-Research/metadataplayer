/* Displays Play and Pause buttons, Search Button and Form, Volume Control */

IriSP.Widgets.CocoController = function (player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.CocoController.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.CocoController.prototype.defaults = {
    // Selector for the widget that needs to be fullscreened
    fullscreen_widget: undefined
};

IriSP.Widgets.CocoController.prototype.template =
    '<div class="Ldt-CocoCtrl">'
    + '<div class="Ldt-CocoCtrl-button Ldt-CocoCtrl-Play Ldt-CocoCtrl-Play-PlayState Ldt-TraceMe" title="{{l10n.play_pause}}"></div>'
    + '<div class="Ldt-CocoCtrl-Time">'
    + '  <div class="Ldt-CocoCtrl-Time-Elapsed" title="{{l10n.elapsed_time}}">--:--</div>'
    + '  <div class="Ldt-CocoCtrl-Time-Separator">/</div>'
    + '  <div class="Ldt-CocoCtrl-Time-Total" title="{{l10n.total_time}}">--:--</div>'
    + '</div>'
    + '<div class="Ldt-CocoCtrl-Right">'
    + '   <div class="Ldt-CocoCtrl-Social">'
    + '       <div class="Ldt-CocoCtrl-button Ldt-CocoCtrl-Twitter-Button Ldt-TraceMe" title="{{l10n.share_twitter}}"></div>'
    + '       <div class="Ldt-CocoCtrl-button Ldt-CocoCtrl-Facebook-Button Ldt-TraceMe" title="{{l10n.share_facebook}}"></div>'
    + '   </div>'
    + '   <div class="Ldt-CocoCtrl-button Ldt-CocoCtrl-Fullscreen-Button Ldt-TraceMe" title="{{l10n.fullscreen}}"></div>'
    + '   <div class="Ldt-CocoCtrl-button Ldt-CocoCtrl-Sound">'
    + '   </div>'
    + '</div>'
    + '</div>';

IriSP.Widgets.CocoController.prototype.messages = {
    en: {
        play_pause: "Play/Pause",
        play: "Play",
        pause: "Pause",
        mute: "Mute",
        unmute: "Unmute",
        elapsed_time: "Elapsed time",
        total_time: "Total duration",
        fullscreen: "Fullscreen mode"
    },
    fr: {
        play_pause: "Lecture/Pause",
        play: "Lecture",
        pause: "Pause",
        elapsed_time: "Temps écoulé",
        total_time: "Durée totale",
        fullscreen: "Mode plein écran"
    }
};

IriSP.Widgets.CocoController.prototype.draw = function () {
    var _this = this;
    this.renderTemplate();
    var fullscreenButton = this.$.find(".Ldt-CocoCtrl-Fullscreen-Button");

    // Define blocks
    this.$playButton = this.$.find(".Ldt-CocoCtrl-Play");
    this.$searchBlock = this.$.find(".Ldt-CocoCtrl-Search");
    this.$searchInput = this.$.find(".Ldt-CocoCtrl-SearchInput");
    this.$timeElapsed = this.$.find(".Ldt-CocoCtrl-Time-Elapsed");
    this.$timeTotal = this.$.find(".Ldt-CocoCtrl-Time-Total");

    // handle events
    this.onMediaEvent("play", "playButtonUpdater");
    this.onMediaEvent("pause", "playButtonUpdater");
    this.onMediaEvent("volumechange", "volumeUpdater");
    this.onMediaEvent("timeupdate", "timeDisplayUpdater");
    this.onMediaEvent("loadedmetadata", "volumeUpdater");

    // handle clicks
    this.$playButton.click(this.functionWrapper("playHandler"));

    // Fullscreen handling
    var fullscreen_event_name = IriSP.getFullscreenEventname();
    if (fullscreen_event_name) {
        fullscreenButton.on("click touchstart", function (e) {
            e.stopPropagation();
            e.preventDefault();
            _this.toggleFullscreen();
        });
        document.addEventListener(fullscreen_event_name, function () {
            var widget = IriSP.jQuery(_this.fullscreen_widget);
            if (widget.length) {
                if (IriSP.isFullscreen() && IriSP.getFullscreenElement() == widget[0]) {
                    widget.addClass("Ldt-Fullscreen-Element");
                } else {
                    widget.removeClass("Ldt-Fullscreen-Element");
                }
            };
        });
    } else {
        fullscreenButton.addClass("Ldt-CocoCtrl-Disabled");
    }

    this.$.on("click touchstart", ".Ldt-CocoCtrl-Twitter-Button", function (e) {
        _this.player.trigger("Player.tweet");
    });
    this.$.on("click touchstart", ".Ldt-CocoCtrl-Facebook-Button", function (e) {
        _this.player.trigger("Player.facebook");
    });
    this.$.on("click touchstart", ".Ldt-CocoCtrl-Sound", function (e) {
        e.stopPropagation();
        e.preventDefault();
        _this.media.setMuted(!_this.media.getMuted());
    });

    this.timeDisplayUpdater(new IriSP.Model.Time(0));
};

/* Update the elapsed time div */
IriSP.Widgets.CocoController.prototype.timeDisplayUpdater = function (_time) {
    var _totalTime = this.media.duration;
    this.$timeElapsed.html(_time.toString());
    this.$timeTotal.html(_totalTime.toString());
};

/* update the icon of the button - separate function from playHandler
   because in some cases (for instance, when the user directly clicks on
   the jwplayer window) we have to change the icon without playing/pausing
*/
IriSP.Widgets.CocoController.prototype.playButtonUpdater = function () {
    if (this.media.getPaused()) {
        /* the background sprite is changed by adding/removing the correct classes */
        this.$playButton
            .attr("title", this.l10n.play)
            .removeClass("Ldt-CocoCtrl-Play-PauseState")
            .addClass("Ldt-CocoCtrl-Play-PlayState");
    } else {
        this.$playButton
            .attr("title", this.l10n.pause)
            .removeClass("Ldt-CocoCtrl-Play-PlayState")
            .addClass("Ldt-CocoCtrl-Play-PauseState");
    }
};

//FullScreen
IriSP.Widgets.CocoController.prototype.toggleFullscreen = function () {
    var widget = IriSP.jQuery(this.fullscreen_widget);
    if (widget.length) {
        if (IriSP.isFullscreen()) {
            IriSP.setFullScreen(widget[0], false);
        } else {
            IriSP.setFullScreen(widget[0], true);
        }
    }
};

IriSP.Widgets.CocoController.prototype.playHandler = function () {
    if (this.media.getPaused()) {
        this.media.play();
    } else {
        this.media.pause();
    }
};

IriSP.Widgets.CocoController.prototype.volumeUpdater = function () {
    var _muted = this.media.getMuted(),
        _vol = this.media.getVolume();
    if (_vol === false) {
        _vol = .5;
    }
    var _soundCtl = this.$.find(".Ldt-CocoCtrl-Sound");
    _soundCtl.removeClass("Ldt-CocoCtrl-Sound-Mute Ldt-CocoCtrl-Sound-Half Ldt-CocoCtrl-Sound-Full");
    if (_muted) {
        _soundCtl.attr("title", this.l10n.unmute)
            .addClass("Ldt-CocoCtrl-Sound-Mute");
    } else {
        _soundCtl.attr("title", this.l10n.mute)
            .addClass(_vol < .5 ? "Ldt-CocoCtrl-Sound-Half" : "Ldt-CocoCtrl-Sound-Full");
    }
};
