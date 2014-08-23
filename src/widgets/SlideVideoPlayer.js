IriSP.Widgets.SlideVideoPlayer = function(player, config) {
    IriSP.loadCss(IriSP.getLib("cssSplitter"));
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.SlideVideoPlayer.prototype = new IriSP.Widgets.Widget();


IriSP.Widgets.SlideVideoPlayer.prototype.defaults = {
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
                type: "HtmlPlayer",
                video: _this.video,
                width: '100%',
                url_transform: _this.url_transform
            },
            "player"
        );
    // FIXME: this should be better implemented through a signal sent
    // when widgets are ready (and not just loaded)
    window.setTimeout(function () {
        _this.$.find(".Ldt-SlideVideoPlayer").split({ orientation: 'vertical' });
    }, 1000);
}
