/* Displays Play and Pause buttons, Search Button and Form, Volume Control */

IriSP.Widgets.Controller = function (player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastSearchValue = "";
};

IriSP.Widgets.Controller.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Controller.prototype.defaults = {
    disable_annotate_btn: false,
    disable_search_btn: false,
    disable_ctrl_f: false,
    disable_fullscreen : true,
    always_show_search: false,
    // Selector for the widget that needs to be fullscreened
    fullscreen_widget: undefined,
    enable_quiz_toggle: undefined,
    enable_add_question: false
};

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
    + '{{/disable_search_btn}}'
    + '<div class="Ldt-Ctrl-Search">'
    + '<input placeholder="{{ l10n.search }}" type="search" class="Ldt-Ctrl-SearchInput Ldt-TraceMe"></input>'
    + '</div>'
    + '<div class="Ldt-Ctrl-Quiz-Enable Ldt-TraceMe" title="Activer/Désactiver le quiz"></div>'
    + '<div class="Ldt-Ctrl-Quiz-Create Ldt-TraceMe" ></div>'
    + '</div>'
    + '<div class="Ldt-Ctrl-Right">'
    + '{{^disable_fullscreen}}<div class="Ldt-Ctrl-Fullscreen-Button Ldt-TraceMe" title="Passer le lecteur en plein-écran"></div>{{/disable_fullscreen}}'
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
        total_time: "Total duration",
        volume: "Volume",
        volume_control: "Volume control",
        enable_quiz: "Enable quiz"
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
        elapsed_time: "Temps écoulé",
        total_time: "Durée totale",
        volume: "Niveau sonore",
        volume_control: "Réglage du niveau sonore",
        enable_quiz: "Activer le quiz"
    }
};

IriSP.Widgets.Controller.prototype.draw = function () {
    var _this = this;
    this.renderTemplate();

    // Define blocks
    this.$playButton = this.$.find(".Ldt-Ctrl-Play");
    this.$searchBlock = this.$.find(".Ldt-Ctrl-Search");
    this.$searchInput = this.$.find(".Ldt-Ctrl-SearchInput");
    this.$volumeBar = this.$.find(".Ldt-Ctrl-Volume-Bar");

    // handle events
    this.onMediaEvent("play", "playButtonUpdater");
    this.onMediaEvent("pause", "playButtonUpdater");
    this.onMediaEvent("volumechange", "volumeUpdater");
    this.onMediaEvent("timeupdate", "timeDisplayUpdater");
    this.onMediaEvent("loadedmetadata", "volumeUpdater");

    // handle clicks
    this.$playButton.click(this.functionWrapper("playHandler"));

    if (this.enable_quiz_toggle !== undefined) {
        this.toggleQuiz(null, this.enable_quiz_toggle);
    } else {
        this.$.find(".Ldt-Ctrl-Quiz-Enable").hide();
    }

    this.$.find(".Ldt-Ctrl-Annotate").click(function () {
        _this.player.trigger("CreateAnnotation.toggle");
    });
    this.$.find(".Ldt-Ctrl-SearchBtn").click(this.functionWrapper("searchButtonHandler"));

    this.$searchInput.keyup(this.functionWrapper("searchHandler"));
    this.$searchInput.on("search", this.functionWrapper("searchHandler"));

    // Fullscreen handling
    this.$.find(".Ldt-Ctrl-Fullscreen-Button").click(this.functionWrapper("toggleFullscreen"));
    var fullscreen_event_name = IriSP.getFullscreenEventname();
    if (fullscreen_event_name) {
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
    };

    // Quiz activation
    this.$.find(".Ldt-Ctrl-Quiz-Enable").click(this.functionWrapper("toggleQuiz"));
    this.$.find(".Ldt-Ctrl-Quiz-Create").click(this.functionWrapper("createQuiz"));

    var _volctrl = this.$.find(".Ldt-Ctrl-Volume-Control");
    this.$.find('.Ldt-Ctrl-Sound')
        .click(this.functionWrapper("muteHandler"))
        .mouseover(function () {
            _volctrl.show();
        })
        .mouseout(function () {
            _volctrl.hide();
        });
    _volctrl.mouseover(function () {
        _volctrl.show();
    }).mouseout(function () {
        _volctrl.hide();
    });

    // Handle CTRL-F
    if (!this.disable_ctrl_f) {
        var _fKey = "F".charCodeAt(0),
            _lastCtrlFTime = 0;
        IriSP.jQuery(document).keydown(function (_event) {
            if (_event.keyCode === _fKey && (_event.ctrlKey || _event.metaKey)) {
                var _time = IriSP.jQuery.now();
                if (_time - _lastCtrlFTime > 2000) {
                    _this.searchButtonHandler();
                }
                _lastCtrlFTime = _time;
                return false;
            }
            return undefined;
        });
    }

    // Allow Volume Cursor Dragging
    this.$volumeBar.slider({
        slide: function (event, ui) {
            _this.$volumeBar.attr("title", _this.l10n.volume + ': ' + ui.value + '%');
            _this.media.setVolume(ui.value / 100);
        },
        stop: this.functionWrapper("volumeUpdater")
    });

    // trigger an IriSP.Player.MouseOver to the widgets that are interested (i.e : sliderWidget)
    this.$.hover(
        function () {
            _this.player.trigger("Player.MouseOver");
        },
        function () {
            _this.player.trigger("Player.MouseOut");
        });

    this.timeDisplayUpdater(new IriSP.Model.Time(0));

    var annotations = this.source.getAnnotations();
    annotations.on("search", function (_text) {
        _this.$searchInput.val(_text);
        _this.showSearchBlock();
    });
    annotations.on("found", function (_text) {
        _this.$searchInput.css('background-color', "#e1ffe1");
    });
    annotations.on("not-found", function (_text) {
        _this.$searchInput.css('background-color', "#d62e3a");
    });
    annotations.on("search-cleared", function () {
        _this.hideSearchBlock();
    });
    if (_this.always_show_search) {
        _this.showSearchBlock();
    }
};

/* Update the elasped time div */
IriSP.Widgets.Controller.prototype.timeDisplayUpdater = function (_time) {

    // we get it at each call because it may change.
    var _totalTime = this.media.duration;
    this.$.find(".Ldt-Ctrl-Time-Elapsed").html(_time.toString());
    this.$.find(".Ldt-Ctrl-Time-Total").html(_totalTime.toString());
};

/* update the icon of the button - separate function from playHandler
   because in some cases (for instance, when the user directly clicks on
   the jwplayer window) we have to change the icon without playing/pausing
*/
IriSP.Widgets.Controller.prototype.playButtonUpdater = function () {
    if (this.media.getPaused()) {
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

//FullScreen
IriSP.Widgets.Controller.prototype.toggleFullscreen = function () {
    var widget = IriSP.jQuery(this.fullscreen_widget);
    if (widget.length) {
        if (IriSP.isFullscreen()) {
            IriSP.setFullScreen(widget[0], false);
        } else {
            IriSP.setFullScreen(widget[0], true);
        }
    }
};

//Quiz
IriSP.Widgets.Controller.prototype.createQuiz = function () {
    this.player.trigger("Quiz.hide");
    this.media.pause();
    this.player.trigger("QuizCreator.create");
};

IriSP.Widgets.Controller.prototype.toggleQuiz = function (event, force_state) {
    if (force_state !== undefined) {
        this.enable_quiz_toggle = force_state;
    } else {
        this.enable_quiz_toggle = !this.enable_quiz_toggle;
    }
    if (this.enable_quiz_toggle) {
        $(".Ldt-Ctrl-Quiz-Enable").addClass("Ldt-Ctrl-Quiz-Toggle-Active");
        if (this.enable_add_question) {
            $(".Ldt-Ctrl-Quiz-Create").addClass("Ldt-Ctrl-Quiz-Toggle-Active");
        }
        this.player.trigger("Quiz.activate");
    } else {
        $(".Ldt-Ctrl-Quiz-Enable").removeClass("Ldt-Ctrl-Quiz-Toggle-Active");
        $(".Ldt-Ctrl-Quiz-Create").removeClass("Ldt-Ctrl-Quiz-Toggle-Active");
        this.player.trigger("Quiz.deactivate");
        this.player.trigger("QuizCreator.hide");
    }
};

IriSP.Widgets.Controller.prototype.playHandler = function () {
    if (this.media.getPaused()) {
        this.media.play();
    } else {
        this.media.pause();
    }
};

IriSP.Widgets.Controller.prototype.muteHandler = function () {
    this.media.setMuted(!this.media.getMuted());
};

IriSP.Widgets.Controller.prototype.volumeUpdater = function () {
    var _muted = this.media.getMuted(),
        _vol = this.media.getVolume();
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
            .addClass(_vol < .5 ? "Ldt-Ctrl-Sound-Half" : "Ldt-Ctrl-Sound-Full");
    }
    this.$volumeBar.slider("value", _muted ? 0 : 100 * _vol);
};

IriSP.Widgets.Controller.prototype.showSearchBlock = function () {
    this.$searchBlock.animate({ width:"160px" }, 200);
    this.$searchInput.css('background-color', '#fff');
    this.$searchInput.focus();
};

IriSP.Widgets.Controller.prototype.hideSearchBlock = function () {
    if (!this.always_show_search) {
        this.$searchBlock.animate({ width: 0 }, 200);
    }
};

/** react to clicks on the search button */
IriSP.Widgets.Controller.prototype.searchButtonHandler = function () {
    if (!this.$searchBlock.width()) {
        this.showSearchBlock();
        var _val = this.$searchInput.val();
        if (_val) {
            this.source.getAnnotations().search(_val);
        }
    } else {
        this.hideSearchBlock();
    }
};

/** this handler is called whenever the content of the search
   field changes */
IriSP.Widgets.Controller.prototype.searchHandler = function () {
    if (!this.$searchBlock.width()) {
        this.$searchBlock.css({ width:"160px" });
        this.$searchInput.css('background-color', '#fff');
    }
    var _val = this.$searchInput.val();
    this._positiveMatch = false;

    // do nothing if the search field is empty, instead of highlighting everything.
    if (_val !== this.lastSearchValue) {
        if (_val) {
            this.source.getAnnotations().search(_val);
        } else {
            this.source.getAnnotations().trigger("clear-search");
            this.$searchInput.css('background-color', '');
        }
    }
    this.lastSearchValue = _val;
};
