/* TODO
- integrate control toggles (teacher, simplified TOC, image)
- add callbacks
 */

IriSP.Widgets.EnrichedPlan = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
}

IriSP.Widgets.EnrichedPlan.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.EnrichedPlan.prototype.defaults = {
    // Main type for slide segmentation
    annotation_type: "Slides",
    // If no annotation type list is specified, use all other types
    annotation_types: []
}

IriSP.Widgets.EnrichedPlan.prototype.template = '<div class="Ldt-EnrichedPlan-Container"></div>';

IriSP.Widgets.EnrichedPlan.prototype.slideTemplate =
      '<div data-id="{{ id }}" class="Ldt-EnrichedPlan-Slide">'
    + '  <div class="Ldt-EnrichedPlan-SlideTimecode">{{ begin }}</div>'
    + '  <div data-timecode="{{begintc}}" class="Ldt-EnrichedPlan-SlideThumbnail"><img title="{{ begin }} - {{ atitle }}" src="{{ thumbnail }}"></div>'
    + '  <div class="Ldt-EnrichedPlan-SlideContent">'
    + '     <div data-timecode="{{begintc}}" class="Ldt-EnrichedPlan-SlideTitle Ldt-EnrichedPlan-SlideTitle{{ level }}">{{ atitle }}</div>'
    + '     <div class="Ldt-EnrichedPlan-SlideNotes">{{{ notes }}}</div>'
    + '  </div>'
    + '</div>';

IriSP.Widgets.EnrichedPlan.prototype.annotationTemplate = '<div title="{{ begin }} - {{ atitle }}" data-id="{{ id }}" data-timecode="{{begintc}}" class="Ldt-EnrichedPlan-Note"><span class="Ldt-EnrichedPlan-Note-Text">{{ text }}</span> <span class="Ldt-EnrichedPlan-Note-Author">{{ author }}</span></div>';

IriSP.Widgets.EnrichedPlan.prototype.draw = function() {
    var _this = this;
    // slides content: title, level (for toc)
    var _slides = this.getWidgetAnnotations().sortBy(function(_annotation) {
        return _annotation.begin;
    });
    // All other annotations
    var _annotations = this.media.getAnnotations().filter( function (a) {
        return a.getAnnotationType().title != _this.annotation_type;
    }).sortBy(function(_annotation) {
        return _annotation.begin;
    });

    // Reference annotations in each slide: assume that end time is
    // correctly set.
    _slides.forEach( function (slide) {
        slide.annotations = _annotations.filter( function (a) {
            return a.begin >= slide.begin && a.begin <= slide.end;
        });
    });

    _this.renderTemplate();
    var content = _this.$.find('.Ldt-EnrichedPlan-Container');

    _slides.forEach(function(slide) {
        var _html = Mustache.to_html(_this.slideTemplate, {
            id : slide.id,
            atitle : IriSP.textFieldHtml(slide.title),
            level: slide.level || 1,
            begin : slide.begin.toString(),
            begintc: slide.begin.milliseconds,
            thumbnail: slide.thumbnail,
            notes: slide.annotations.map( function (a) {
                return Mustache.to_html(_this.annotationTemplate, {
                    id: a.id,
                    text: IriSP.textFieldHtml(a.description || a.title),
                    author: a.creator,
                    begin: a.begin.toString(),
                    begintc: a.begin.milliseconds,
                    atitle: a.title.slice(0, 20)
                });
            }).join("\n")
        });
        var _el = IriSP.jQuery(_html);
        content.append(_el);
    });

    content.on("click", "[data-timecode]", function () {
        _this.media.setCurrentTime(Number(this.dataset.timecode));
    });
};
