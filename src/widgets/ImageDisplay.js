/* This widget displays the image associated to the annotation in the given container */

IriSP.Widgets.ImageDisplay = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
}

IriSP.Widgets.ImageDisplay.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.ImageDisplay.prototype.defaults = {
    annotation_type: "Slides",
    // container: "imageContainer"
}

IriSP.Widgets.ImageDisplay.prototype.template = '<div class="Ldt-ImageDisplay-Container"><img class="Ldt-ImageDisplay-Image" title="" alt="Slide Image" src=""/><div class="Ldt-ImageDisplay-Overlay Ldt-ImageDisplay-Overlay-Left"></div><div class="Ldt-ImageDisplay-Overlay Ldt-ImageDisplay-Overlay-Right"></div></div>';

IriSP.Widgets.ImageDisplay.prototype.annotationTemplate = '';

IriSP.Widgets.ImageDisplay.prototype.update = function(annotation) {
    // Update the widget with data corresponding to the annotation
    console.log(this.image);
    this.image.setAttribute("title", IriSP.textFieldHtml(annotation.title) + " - " + annotation.begin.toString());
    this.image.setAttribute("src", annotation.thumbnail);
};

IriSP.Widgets.ImageDisplay.prototype.draw = function() {    
    var _annotations = this.getWidgetAnnotations().sortBy(function(_annotation) {
        return _annotation.begin;
    });
    var _this = this;
    _this.renderTemplate();
    _this.image = _this.$.find("img")[0];

    _this.$.find(".Ldt-ImageDisplay-Overlay-Left").on("click", function () { _this.navigate(-1); });
    _this.$.find(".Ldt-ImageDisplay-Overlay-Right").on("click", function () { _this.navigate(+1); });

    _annotations.forEach(function(_a) {
        _a.on("enter", function() {
            _this.update(_a);
        });
    });
    if (_annotations.length)
        _this.update(_annotations[0]);
}
