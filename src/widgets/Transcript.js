/* This widget displays annotations as a transcript */

IriSP.Widgets.Transcript = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
}

IriSP.Widgets.Transcript.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Transcript.prototype.defaults = {
    annotation_type: "Caption"
    // container: "transcriptContainer"
}

IriSP.Widgets.Transcript.prototype.template = '<div class="Ldt-TranscriptWidget"></div>';

IriSP.Widgets.Transcript.prototype.annotationTemplate = '<a data-begin="{{ begin }}" data-end="{{ end }}" data-id="{{ id }}" class="Ldt-Transcript-Annotation" href="#{{id}}">{{ content }}</a> ';

IriSP.Widgets.Transcript.prototype.draw = function() {
    var _annotations = this.getWidgetAnnotations();
    var _this = this;
    var content;

    _this.renderTemplate();
    content = _this.$.find('.Ldt-TranscriptWidget');

    _annotations.forEach(function(_a) {
        var _data = {
            id : _a.id,
            content : IriSP.textFieldHtml(_a.title),
            begin : _a.begin.toString(),
            end : _a.end.toString()
        };
        var _html = Mustache.to_html(_this.annotationTemplate, _data);
        var _el = IriSP.jQuery(_html);
        content.append(_el);
    });
};
