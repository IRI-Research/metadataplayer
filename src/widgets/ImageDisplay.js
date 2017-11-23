/* This widget displays the image associated to the annotation in the given container */

IriSP.Widgets.ImageDisplay = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.ImageDisplay.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.ImageDisplay.prototype.defaults = {
    annotation_type: "Slides"
    // container: "imageContainer"
};

IriSP.Widgets.ImageDisplay.prototype.template = '<div class="Ldt-ImageDisplay-Container"><div class="Ldt-ImageDisplay-Overlay Ldt-ImageDisplay-Overlay-Left"></div><div class="Ldt-ImageDisplay-Overlay Ldt-ImageDisplay-Overlay-Right"></div></div>';

IriSP.Widgets.ImageDisplay.prototype.annotationTemplate = '';

IriSP.Widgets.ImageDisplay.prototype.update = function(annotation) {
    // Update the widget with data corresponding to the annotation
    this.image.css("background-image", "url(" + annotation.thumbnail + ")");
    this.image.attr("title", IriSP.textFieldHtml(annotation.title) + " - " + annotation.begin.toString());
};

IriSP.Widgets.ImageDisplay.prototype.draw = function() {
    var _annotations = this.getWidgetAnnotations().sortBy(function(_annotation) {
        return _annotation.begin;
    });
    var _this = this;
    _this.renderTemplate();
    _this.image = _this.$.find(".Ldt-ImageDisplay-Container");

    _this.$.find(".Ldt-ImageDisplay-Overlay-Left").on("click", function () { _this.navigate(-1); });
    _this.$.find(".Ldt-ImageDisplay-Overlay-Right").on("click", function () { _this.navigate(+1); });
    _this.$.find(".Ldt-ImageDisplay-Container").on("click", function () {
        if (_this.media.getPaused()) {
            _this.media.play();
        } else {
            _this.media.pause();
        }
    });

    _annotations.forEach(function(_a) {
        _a.on("enter", function() {
            _this.update(_a);
        });
    });
    if (_annotations.length) {
        _this.update(_annotations[0]);
    }
};

