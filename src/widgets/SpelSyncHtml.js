IriSP.Widgets.SpelSyncHtml = function(player, config) {
    console.log("Calling IriSP.Widget's constructor from IriSP.HelloWorldWidget");
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.SpelSyncHtml.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.SpelSyncHtml.prototype.defaults = {
    src: "about:blank"
};

IriSP.Widgets.SpelSyncHtml.prototype.template =
    '<div class="Ldt-SpelSyncHtml"><iframe src="{{src}}" {{#width}}width="{{width}}"{{/width}} {{#height}}height="{{height}}"{{/height}}</div>';

IriSP.Widgets.SpelSyncHtml.prototype.draw = function() {
    this.renderTemplate();
    var frame = this.$.find("iframe")[0],
        basesrc = this.src.replace(/#.*$/,'');
    this.getWidgetAnnotations().forEach(function(a) {
        a.on("enter", function() {
            if (a.content && a.content.data && a.content.data.ref_text) {
                frame.src = basesrc + '#' + a.content.data.ref_text;
            }
        });
    });
};