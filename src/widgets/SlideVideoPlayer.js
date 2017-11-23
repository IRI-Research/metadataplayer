IriSP.Widgets.SlideVideoPlayer = function(player, config) {
    IriSP.loadCss(IriSP.getLib("cssSplitter"));
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.SlideVideoPlayer.prototype = new IriSP.Widgets.Widget();


IriSP.Widgets.SlideVideoPlayer.prototype.defaults = {
    playerModule: "HtmlPlayer",
    // mode is either "sidebyside", "pip" or "videoonly"
    mode: "sidebyside"
};

IriSP.Widgets.SlideVideoPlayer.prototype.template = '<div class="Ldt-SlideVideoPlayer">\
  <div class="Ldt-SlideVideoPlayer-slide Ldt-SlideVideoPlayer-panel">\
  </div>\
  <div class="Ldt-SlideVideoPlayer-video Ldt-SlideVideoPlayer-panel">\
  </div>\
</div>';

IriSP.Widgets.SlideVideoPlayer.prototype.draw = function() {
    var _this = this;

    _this.renderTemplate();
    this.insertSubwidget(
        _this.$.find(".Ldt-SlideVideoPlayer-panel.Ldt-SlideVideoPlayer-slide"),
            {
                type: "ImageDisplay",
                annotation_type: _this.annotation_type
            },
            "slide"
        );
    this.insertSubwidget(
        _this.$.find(".Ldt-SlideVideoPlayer-panel.Ldt-SlideVideoPlayer-video"),
            {
                type: _this.playerModule,
                video: _this.video,
                width: '100%',
                url_transform: _this.url_transform
            },
            "player"
    );

    if (_this.mode == 'pip') {
        _this.$.find(".Ldt-SlideVideoPlayer-panel").each(function () {
            IriSP.jQuery(this).append('<div class="Ldt-SlideVideoPlayer-pip-menu-toggle" data-position="br"></div><div class="Ldt-SlideVideoPlayer-pip-menu-toggle" data-position="tr"></div><div class="Ldt-SlideVideoPlayer-pip-menu-toggle" data-position="tl"></div><div class="Ldt-SlideVideoPlayer-pip-menu-toggle" data-position="bl"></div><div class="Ldt-SlideVideoPlayer-pip-menu-toggle" data-position="main">');
        });
        _this.$.find(".Ldt-SlideVideoPlayer-pip-menu-toggle").each(function() {
            IriSP.jQuery(this).addClass("Ldt-SlideVideoPlayer-pip-menu-toggle-" + this.dataset.position);
        });
        _this.$.on("click", ".Ldt-SlideVideoPlayer-pip-menu-toggle", function () {
            _this.setPipPosition(this.dataset.position);
        });
        window.setTimeout(function () {
            _this.setMainDisplay('video', true);
        }, 1500);
    } else if (_this.mode == 'videoonly') {
        this.$.find(".Ldt-SlideVideoPlayer-panel.Ldt-SlideVideoPlayer-slide").addClass("Ldt-SlideVideoPlayer-hidden");
        this.$.find(".Ldt-SlideVideoPlayer-panel.Ldt-SlideVideoPlayer-video").addClass('Ldt-SlideVideoPlayer-pip-main');
    } else {
        // Default : side by side
        // FIXME: this should be better implemented through a signal sent
        // when widgets are ready (and not just loaded)
        window.setTimeout(function () {
            _this.$.find(".Ldt-SlideVideoPlayer").touchSplit({ orientation: (screen.height > screen.width) ? 'vertical' : 'horizontal',
                                                               leftMin: 20,
                                                               topMin: 20
                                                             });
        }, 1500);
    }
};

IriSP.Widgets.SlideVideoPlayer.prototype.toggleMainDisplay = function() {
    if (this.$.find(".Ldt-SlideVideoPlayer-panel.Ldt-SlideVideoPlayer-video").hasClass("Ldt-SlideVideoPlayer-pip-main")) {
        this.setMainDisplay('slides');
    } else {
        this.setMainDisplay('video');
    }
};

// Set main display (in case of a "switch" display mode)
// main is either 'video' or 'slides'
IriSP.Widgets.SlideVideoPlayer.prototype.setMainDisplay = function(video_or_slides, initial_display) {
    var main = this.$.find(".Ldt-SlideVideoPlayer-panel.Ldt-SlideVideoPlayer-video");
    var pip = this.$.find(".Ldt-SlideVideoPlayer-panel.Ldt-SlideVideoPlayer-slide");
    if (video_or_slides == 'slides') {
        var temp = main;
        main = pip;
        pip = temp;
    };
    main.removeClass('Ldt-SlideVideoPlayer-pip-pip').addClass('Ldt-SlideVideoPlayer-pip-main');
    pip.removeClass('Ldt-SlideVideoPlayer-pip-main').addClass('Ldt-SlideVideoPlayer-pip-pip');
    if (initial_display) {
        // Specify initial position
        pip.addClass('Ldt-SlideVideoPlayer-pip-br');
    }
};

IriSP.Widgets.SlideVideoPlayer.prototype.setPipPosition = function(position) {
    if (position == 'main') {
        this.toggleMainDisplay();
        return;
    };
    var pip = this.$.find(".Ldt-SlideVideoPlayer-pip-pip");
    pip.removeClass('Ldt-SlideVideoPlayer-pip-tl Ldt-SlideVideoPlayer-pip-tr Ldt-SlideVideoPlayer-pip-bl Ldt-SlideVideoPlayer-pip-br')
        .addClass('Ldt-SlideVideoPlayer-pip-' + position);
};
