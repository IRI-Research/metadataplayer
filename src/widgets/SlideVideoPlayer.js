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
<div class="Ldt-SlideVideoPlayer-video Ldt-SlideVideoPlayer-panel"></div>\
</div>';

IriSP.Widgets.SlideVideoPlayer.prototype.draw = function() {
    var _this = this;

    _this.renderTemplate();
    this.insertSubwidget(
        _this.$.find(".Ldt-SlideVideoPlayer-panel.Ldt-SlideVideoPlayer-slide"),
            {
                type: "ImageDisplay",
                annotation_type: _this.annotation_type,
                width: '100%'
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
    main.css({
        position: 'relative',
        width: '100%',
        height: '100%',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        "z-index": 1
    });
    pip.css({
        position: 'absolute',
        width: '30%',
        height: '30%',
        right: '2px',
        bottom: '2px',
        "z-index": 3
    });
}
