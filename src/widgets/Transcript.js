/* This widget displays annotations as a transcript */

IriSP.Widgets.Transcript = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
}

IriSP.Widgets.Transcript.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Transcript.prototype.defaults = {
    annotation_type: "Caption",
    use_vtt_track: false
}

IriSP.Widgets.Transcript.prototype.template = '<div class="Ldt-TranscriptWidget"></div>';

IriSP.Widgets.Transcript.prototype.annotationTemplate = '<span data-begin="{{ begin }}" data-end="{{ end }}" data-id="{{ id }}" class="Ldt-Transcript-Annotation">{{ content }}</span>  ';

IriSP.Widgets.Transcript.prototype.draw = function() {
    var _annotations = this.getWidgetAnnotations();
    var _this = this;
    var content;

    _this.renderTemplate();
    content = _this.$.find('.Ldt-TranscriptWidget');

    if (_this.use_vtt_track) {
        // Use webvtt track. It will only work with native video player.
        var widgets =  _this.player.widgets.filter(function (w) { return w.type == "HtmlPlayer"; });
        if (widgets) {
            var v = widgets[0].$.find("video")[0];
            // FIXME: allow to specify the used track
            v.addEventListener("loadedmetadata", function () {
                var track = v.textTracks[0];
                var cues = track.cues;
                var i = 1;
                Array.prototype.forEach.apply(cues, [ function(_c) {
                    _c.id = "cue" + i;
                    var _html = Mustache.to_html(_this.annotationTemplate, {
                        id : _c.id,
                        content : _c.text,
                        begin : 1000 * _c.startTime,
                        end : 1000 * _c.endTime
                    });
                    i += 1;
                    var _el = IriSP.jQuery(_html);
                    content.append(_el);
                } ]);
                track.addEventListener("cuechange", function () {
                    var acues = track.activeCues;
                    if (acues.length > 0) {
                        // Update attributes for active cues
                        _this.$.find(".Ldt-Transcript-Annotation.active").removeClass("active");
                        Array.prototype.forEach.apply(acues, [ function(_c) {
                            _this.$.find("#" + _c.id).addClass("active");
                        } ]);
                    }
                }, false);
                content.on("click", ".Ldt-Transcript-Annotation", function () {
                    _this.media.setCurrentTime(this.dataset.begin);
                });
            });
        } else {
            console.log("cannot find a video object");
        }
    } else {
        // Populate with annotation data
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
};
