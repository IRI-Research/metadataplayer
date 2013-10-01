IriSP.Widgets.HtmlPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.HtmlPlayer.prototype = new IriSP.Widgets.Widget();


IriSP.Widgets.HtmlPlayer.prototype.defaults = {
};

IriSP.Widgets.HtmlPlayer.prototype.draw = function() {

    IriSP.htmlPlayer(this.media, this.$, this);
    
};