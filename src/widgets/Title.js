IriSP.Widgets.Title = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Title.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Title.prototype.defaults = {
    media_title: false
};

IriSP.Widgets.Title.prototype.template =
    '<div class="Ldt-TitleWidget"><h2>{{#media_title}}{{media.title}}{{/media_title}}{{^media_title}}{{source.title}}{{/media_title}}</h2></div>';


IriSP.Widgets.Title.prototype.draw = function() {
    this.renderTemplate();
};