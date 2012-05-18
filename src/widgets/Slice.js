/*
 The Slider Widget shows time position and allows seek
 */

IriSP.Widgets.Slice = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Slice.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Slice.prototype.defaults = {
    start_visible : false
};

IriSP.Widgets.Slice.prototype.draw = function() {
    
    this.$slider = IriSP.jQuery('<div>')
        .addClass("Ldt-Slice")
    
    this.$.append(this.$slider);
    
    this.min = 0;
    this.max = this.source.getDuration().valueOf();
    
    var _this = this;
    
    this.$slider.slider({
        range: true,
        values: [0, 0],
        min: 0,
        max: this.max,
        change: function(event, ui) {
            _this.player.popcorn.trigger("IriSP.Arrow.updatePosition",{
                widget:_this.type,
                time:Math.floor((ui.values[0]+ui.values[1])/2)
            });
            _this.player.popcorn.trigger("IriSP.Slice.boundsChanged",[ui.values[0], ui.values[1]]);
        }
    });
    this.$slider.find(".ui-slider-handle:first").addClass("Ldt-Slice-left-handle");
    this.$slider.find(".ui-slider-handle:last").addClass("Ldt-Slice-right-handle");
    if (this.start_visible) {
        this.show();
    } else {
        this.hide();
    }
    this.bindPopcorn("IriSP.Slice.show","show");
    this.bindPopcorn("IriSP.Slice.hide","hide");
    this.bindPopcorn("IriSP.Annotation.boundsChanged","storeBounds");
};

IriSP.Widgets.Slice.prototype.show = function() {
    this.$slider.show();
    this.player.popcorn.trigger("IriSP.Arrow.takeover",this.type);
    this.$slider.slider("values", [this.min, this.max]);
}

IriSP.Widgets.Slice.prototype.hide = function() {
    this.$slider.hide();
    this.player.popcorn.trigger("IriSP.Arrow.release");
}

IriSP.Widgets.Slice.prototype.storeBounds = function(_values) {
    this.min = _values[0];
    this.max = _values[1];
}