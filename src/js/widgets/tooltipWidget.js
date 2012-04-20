/* this widget displays a small tooltip */
IriSP.TooltipWidget = function(Popcorn, config, Serializer) {
    IriSP.Widget.call(this, Popcorn, config, Serializer);
};

IriSP.TooltipWidget.prototype = new IriSP.Widget();

IriSP.TooltipWidget.prototype.draw = function() {
    var _html = Mustache.to_html(IriSP.tooltipWidget_template),
        _this = this;
    this.$.parent().css({
        "position" : "relative"
    });
    this.$.append(_html);
    this.$tip = this.$.find(".Ldt-Tooltip");
    this.$.mouseover(function() {
        _this.$tip.hide();
    });
    this.hide();
};

IriSP.TooltipWidget.prototype.show = function(x, y, text, color) {
    
    if (typeof color !== "undefined") {
        this.$.find(".Ldt-Tooltip-Color").show().css("background-color", color);
    } else {
        this.$.find(".Ldt-Tooltip-Color").hide();
    }
    
    this.$.find(".Ldt-Tooltip-Text").html(text);

    this.$tip.show();
    this.$tip.css({
        "left" : Math.floor(x - this.$tip.outerWidth() / 2) + "px",
        "top" : Math.floor(y - this.$tip.outerHeight() - 5) + "px"
    });
};

IriSP.TooltipWidget.prototype.hide = function() {
    this.$tip.hide();
};
