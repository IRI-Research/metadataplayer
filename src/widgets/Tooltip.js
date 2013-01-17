/* this widget displays a small tooltip */
IriSP.Widgets.Tooltip = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Tooltip.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Tooltip.prototype.defaults = {
    
};

IriSP.Widgets.Tooltip.prototype.template =
    '<div class="Ldt-Tooltip"><div class="Ldt-Tooltip-Main"><div class="Ldt-Tooltip-Corner-NW"></div>'
    + '<div class="Ldt-Tooltip-Border-Top"></div><div class="Ldt-Tooltip-Corner-NE"></div>'
    + '<div class="Ldt-Tooltip-Border-Left"></div><div class="Ldt-Tooltip-Border-Right"></div>'
    + '<div class="Ldt-Tooltip-Corner-SW"></div><div class="Ldt-Tooltip-Border-SW"></div>'
    + '<div class="Ldt-Tooltip-Tip"></div><div class="Ldt-Tooltip-Border-SE"></div>'
    + '<div class="Ldt-Tooltip-Corner-SE"></div><div class="Ldt-Tooltip-Inner">'
    + '<div class="Ldt-Tooltip-Color"></div><p class="Ldt-Tooltip-Text"></p></div></div></div>';

IriSP.Widgets.Tooltip.prototype.draw = function() {
    _this = this;
    this.renderTemplate();
    this.$.parent().css({
        "position" : "relative"
    });
    this.$tooltip = this.$.find(".Ldt-Tooltip");
    this.$tip = this.$.find(".Ldt-Tooltip-Tip");
    this.$sw = this.$.find(".Ldt-Tooltip-Border-SW");
    this.$se = this.$.find(".Ldt-Tooltip-Border-SE");
    this.__halfWidth = Math.floor(this.$.find(".Ldt-Tooltip-Main").width()/2);
    this.__borderWidth = this.$.find(".Ldt-Tooltip-Border-Left").width();
    this.__tipDelta = this.__halfWidth - Math.floor(this.$tip.width()/2);
    this.__maxShift = this.__tipDelta - this.__borderWidth;
    this.$.mouseover(function() {
        _this.$tooltip.hide();
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

    this.$tooltip.show();
    
    var shift = 0;
    
    if (typeof this.min_x !== "undefined" && (x - this.__halfWidth < this.min_x)) {
        shift = Math.max(x - this.__halfWidth - this.min_x, - this.__maxShift);
    }
    
    if (typeof this.max_x !== "undefined" && (+x + this.__halfWidth > this.max_x)) {
        shift = Math.min(+ x + this.__halfWidth - this.max_x, this.__maxShift);
    }
    
    this.$tooltip.css({
        "left" : (x - shift) + "px",
        "top" : y + "px"
    });
    this.$tip.css({
        "left": (this.__tipDelta + shift) + "px"
    });
    this.$sw.css({
        "width": (this.__tipDelta + shift - this.__borderWidth) + "px"
    });
    this.$se.css({
        "width": (this.__tipDelta - shift - this.__borderWidth) + "px"
    });
};

IriSP.Widgets.Tooltip.prototype.hide = function() {
    this.$tooltip.hide();
};
