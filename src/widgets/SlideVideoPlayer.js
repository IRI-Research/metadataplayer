IriSP.Widgets.SlideVideoPlayer = function(player, config) {
    IriSP.loadCss(IriSP.getLib("cssSplitter"));
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.SlideVideoPlayer.prototype = new IriSP.Widgets.Widget();


IriSP.Widgets.SlideVideoPlayer.prototype.defaults = {
    playerModule: "HtmlPlayer",
    // mode is either "sidebyside" or "pip"
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
        _this.$.find(".Ldt-SlideVideoPlayer-panel").append('<div class="Ldt-SlideVideoPlayer-pip-menu"><div class="Ldt-SlideVideoPlayer-pip-menu-toggle"></div></div>');
        _this.$.on("click", ".Ldt-SlideVideoPlayer-pip-menu-toggle", function () {
            _this.toggleMainDisplay();
        });
        window.setTimeout(function () {
            _this.setMainDisplay('video');
        }, 1500);
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
IriSP.Widgets.SlideVideoPlayer.prototype.setMainDisplay = function(video_or_slides) {
    var main = this.$.find(".Ldt-SlideVideoPlayer-panel.Ldt-SlideVideoPlayer-video");
    var pip = this.$.find(".Ldt-SlideVideoPlayer-panel.Ldt-SlideVideoPlayer-slide");
    if (video_or_slides == 'slides') {
        var temp = main;
        main = pip;
        pip = temp;
    };
    main.removeClass('Ldt-SlideVideoPlayer-pip-pip').addClass('Ldt-SlideVideoPlayer-pip-main');
    pip.removeClass('Ldt-SlideVideoPlayer-pip-main').addClass('Ldt-SlideVideoPlayer-pip-pip');
}
