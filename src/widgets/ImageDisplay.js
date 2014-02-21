/* This widget displays the image associated to the annotation in the given container */

IriSP.Widgets.ImageDisplay = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
}

IriSP.Widgets.ImageDisplay.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.ImageDisplay.prototype.defaults = {
    annotation_type: "Slides",
    // container: "imageContainer"
}

IriSP.Widgets.ImageDisplay.prototype.template = '';

IriSP.Widgets.ImageDisplay.prototype.annotationTemplate = '<div class="Ldt-ImageDisplay-Container"><h2 class="Ldt-ImageDisplay-Title>{{ htitle }}</h2><a href="#{{id}}"><img class="Ldt-ImageDisplay-Image" title="{{ htitle }} - {{ begin }}" alt="{{ htitle }}" src="{{thumbnail}}"/></a></div>';

IriSP.Widgets.ImageDisplay.prototype.draw = function() {    
    var _annotations = this.getWidgetAnnotations();
    var _this = this;
    if (!_annotations.length) {
        _this.$.hide();
    } else {
        _annotations.forEach(function(_a) {
            _a.on("enter", function() {
                var _data = {
                    id : _a.id,
                    htitle : IriSP.textFieldHtml(_a.title),
                    begin : _a.begin.toString(),
                    end : _a.end.toString(),
                    thumbnail : _a.thumbnail,
                    url : _a.url,
                };
                var _html = Mustache.to_html(_this.annotationTemplate, _data);
                var _el = IriSP.jQuery(_html);
                _this.$.empty();
                _this.$.append(_el);
            })
        });
    }
}
