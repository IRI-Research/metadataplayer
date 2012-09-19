/* this widget displays a small tooltip */
IriSP.Widgets.Tooltip = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Tooltip.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Tooltip.prototype.template = '<div class="Ldt-Tooltip"><div class="Ldt-Tooltip-Inner"><div class="Ldt-Tooltip-Color"></div><div class="Ldt-Tooltip-Text"></div></div></div>';

IriSP.Widgets.Tooltip.prototype.draw = function() {
    _this = this;
    this.$.html(this.template);
    this.$.parent().css({
        "position" : "relative"
    });
    this.$tip = this.$.find(".Ldt-Tooltip");
    this.$.mouseover(function() {
        _this.$tip.hide();
    });
    this.hide();
};

IriSP.Widgets.Tooltip.prototype.show = function(x, y, text, color) {
    
    if (typeof color !== "undefined") {
        this.$.find(".Ldt-Tooltip-Color").show().css("background-color", color);
    } else {
        this.$.find(".Ldt-Tooltip-Color").hide();
    }

    this.$.find(".Ldt-Tooltip-Text").html(text);

    this.$tip.show();
    this.$tip.css({
        "left" : Math.floor(x - this.$tip.outerWidth() / 2) + "px",
        "top" : Math.floor(y - this.$tip.outerHeight()) + "px"
    });
};

IriSP.Widgets.Tooltip.prototype.hide = function() {
    this.$tip.hide();
};
