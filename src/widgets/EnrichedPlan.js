/* TODO
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
    annotation_types: [],
    show_controls: true
}

IriSP.Widgets.EnrichedPlan.prototype.template =
      '<div class="Ldt-EnrichedPlan-Container">'
    + '{{#show_controls}}<form class="Ldt-EnrichedPlan-Controls">'
    + ' <input id="{{prefix}}teacher_note_checkbox" class="Ldt-EnrichedPlan-Control-Checkbox Ldt-EnrichedPlan-Note-Teacher" checked type="checkbox">'
    + ' <label for="{{prefix}}teacher_note_checkbox" class="Ldt-EnrichedPlan-Control-Label Ldt-EnrichedPlan-Note-Teacher">Notes Enseignant</label>'
    + ' <input id="{{prefix}}other_note_checkbox" class="Ldt-EnrichedPlan-Control-Checkbox Ldt-EnrichedPlan-Note-Other" checked type="checkbox">'
    + ' <label for="{{prefix}}other_note_checkbox" class="Ldt-EnrichedPlan-Control-Label Ldt-EnrichedPlan-Note-Other">Notes Autres</label>'
    + ' <input id="{{prefix}}simplified_plan_checkbox" class="Ldt-EnrichedPlan-Control-Checkbox Ldt-EnrichedPlan-Note-Own" checked type="checkbox">'
    + ' <label for="{{prefix}}simplified_plan_checkbox" class="Ldt-EnrichedPlan-Control-Label Ldt-EnrichedPlan-Note-Own">Notes perso.</label>'
    + ' <input id="{{prefix}}slide_display_checkbox" class="Ldt-EnrichedPlan-Control-Checkbox Ldt-EnrichedPlan-Slide-Display" checked type="checkbox">'
    + ' <label for="{{prefix}}slide_display_checkbox" class="Ldt-EnrichedPlan-Control-Label Ldt-EnrichedPlan-Slide-Display">Diapo<br/>&nbsp;</label>'
    + ' <input class="Ldt-EnrichedPlan-Search-Input" type="search" incremental placeholder="Recherchez"/>'
    + '</form>{{/show_controls}}'
    + '<div class="Ldt-EnrichedPlan-Content"></div>'
    + '</div>';

IriSP.Widgets.EnrichedPlan.prototype.slideTemplate =
      '<div data-id="{{ id }}" class="Ldt-EnrichedPlan-Slide">'
    + '  <div class="Ldt-EnrichedPlan-SlideTimecode">{{ begin }}</div>'
    + '  <div data-timecode="{{begintc}}" class="Ldt-EnrichedPlan-SlideThumbnail Ldt-EnrichedPlan-Slide-Display"><img title="{{ begin }} - {{ atitle }}" src="{{ thumbnail }}"></div>'
    + '  <div class="Ldt-EnrichedPlan-SlideContent">'
    + '     <div data-timecode="{{begintc}}" class="Ldt-EnrichedPlan-SlideTitle Ldt-EnrichedPlan-SlideTitle{{ level }}">{{ atitle }}</div>'
    + '     <div class="Ldt-EnrichedPlan-SlideNotes">{{{ notes }}}</div>'
    + '  </div>'
    + '</div>';

IriSP.Widgets.EnrichedPlan.prototype.annotationTemplate = '<div title="{{ begin }} - {{ atitle }}" data-id="{{ id }}" data-timecode="{{begintc}}" class="Ldt-EnrichedPlan-Note {{category}}"><span class="Ldt-EnrichedPlan-Note-Text">{{{ text }}}</span> <span class="Ldt-EnrichedPlan-Note-Author">{{ author }}</span></div>';

IriSP.Widgets.EnrichedPlan.prototype.draw = function() {
    var _this = this;
    // Generate a unique prefix, so that ids of input fields
    // (necessary for label association) are unique too.
    _this.prefix = "TODO";
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
    var container = _this.$.find('.Ldt-EnrichedPlan-Container');
    var content = _this.$.find('.Ldt-EnrichedPlan-Content');

    _slides.forEach(function(slide) {
        var _html = Mustache.to_html(_this.slideTemplate, {
            id : slide.id,
            atitle : IriSP.textFieldHtml(slide.title),
            level: slide.content.level || 1,
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
                    atitle: a.title.slice(0, 20),
                    // FIXME: Temporary hack waiting for a proper metadata definition
                    category: a.title.indexOf('Anonyme') < 0 ? "Ldt-EnrichedPlan-Note-Own" : "Ldt-EnrichedPlan-Note-Other"
                });
            }).join("\n")
        });
        var _el = IriSP.jQuery(_html);
        content.append(_el);
    });

    container.on("click", "[data-timecode]", function () {
        _this.media.setCurrentTime(Number(this.dataset.timecode));
    });

    container.on("click", ".Ldt-EnrichedPlan-Control-Checkbox", function () {
        var classname = Array.prototype.slice.call(this.classList).filter( function (s) { return s != "Ldt-EnrichedPlan-Control-Checkbox"; });
        if (classname.length) {
            if ($(this).is(':checked')) {
                content.find(".Ldt-EnrichedPlan-Slide ." + classname[0]).show(300);
                if (classname[0] == 'Ldt-EnrichedPlan-Slide-Display')
                    content.find(".Ldt-EnrichedPlan-SlideContent").removeClass("wide");
            } else {
                content.find(".Ldt-EnrichedPlan-Slide ." + classname[0]).hide(300);
                if (classname[0] == 'Ldt-EnrichedPlan-Slide-Display')
                    content.find(".Ldt-EnrichedPlan-SlideContent").addClass("wide");
             }
        }
    });

    container.find(".Ldt-EnrichedPlan-Search-Input").on("search", function () {
        var q = $(this).val().toLocaleLowerCase();
        if (q === "") {
            // Show all
            content.find(".Ldt-EnrichedPlan-Note").removeClass("non_matching");
        } else {
            $(".Ldt-EnrichedPlan-Note").each( function () {
                var node = $(this);
                if (node.text().toLocaleLowerCase().indexOf(q) > -1) {
                    node.removeClass("non_matching");
                } else {
                    node.addClass("non_matching");
                }
            });
        }
    });
};
