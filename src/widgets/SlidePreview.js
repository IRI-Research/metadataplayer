IriSP.Widgets.SlidePreview = function (player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.SlidePreview.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.SlidePreview.prototype.defaults = {
    annotation_type: "Slides"
};

IriSP.Widgets.SlidePreview.prototype.template = '<div class="Ldt-SlidePreview-Container"><div class="Ldt-SlidePreview-Slides"></div></div>';

IriSP.Widgets.SlidePreview.prototype.annotationTemplate = '<div data-id="{{ id }}" data-timecode="{{ ms }}" class="Ldt-SlidePreview-Item"><img title="{{ begin }} - {{ title }}" class="Ldt-AnnotationsList-Thumbnail" src="{{ thumbnail }}"></div>';

IriSP.Widgets.SlidePreview.prototype.draw = function () {
    var _annotations = this.getWidgetAnnotations().sortBy(function (_annotation) {
        return _annotation.begin;
    });
    var _this = this;
    _this.renderTemplate();
    var content = _this.$.find('.Ldt-SlidePreview-Slides');

    this.getWidgetAnnotations().forEach(function (_a) {
        var _data = {
            id : _a.id,
            title : IriSP._.escape(_a.title),
            begin : _a.begin.toString(),
            ms: _a.begin.milliseconds,
            thumbnail: _a.thumbnail
        };
        var _html = Mustache.to_html(_this.annotationTemplate, _data);
        var _el = IriSP.jQuery(_html);
        content.append(_el);
    });
    _this.$.on("click", ".Ldt-SlidePreview-Item", function () {
        _this.media.setCurrentTime(Number(this.dataset.timecode));
    });
};
