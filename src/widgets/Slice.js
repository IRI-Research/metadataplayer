/*
 The Slider Widget shows time position and allows seek
 */

IriSP.Widgets.Slice = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.sliding = false;
};

IriSP.Widgets.Slice.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Slice.prototype.defaults = {
    start_visible : false,
    live_update : true
        /* Shall the bounds change each time
        the Annotation Widget sends an update (true)
        or only when "show" is triggered (false) ?
        - true is to be recommended when the widget is permanently displayed.
        */
};

IriSP.Widgets.Slice.prototype.draw = function() {
    
    this.$slider = IriSP.jQuery('<div>')
        .addClass("Ldt-Slice")
    
    this.$.append(this.$slider);
    
    this.min = 0;
    this.max = this.source.getDuration().valueOf();
    
    var _this = this,
        _currentTime;
    
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
        },
        start: function() {
            _this.sliding = true;
            if (!_this.player.popcorn.media.paused) {
                _this.player.popcorn.pause();
            }
            _currentTime = _this.player.popcorn.currentTime();
        },
        slide: function(event, ui) {
            _this.player.popcorn.currentTime(ui.value / 1000);
        },
        stop: function() {
            _this.sliding = false;
            _this.player.popcorn.currentTime(_currentTime);
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
    this.trigger("IriSP.Annotation.getBounds");
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
    if (!this.sliding && !this.player.popcorn.media.paused && (this.min != _values[0] || this.max != _values[1])) {
        this.min = _values[0];
        this.max = _values[1];
        if (this.live_update) {
            this.$slider.slider("values", [this.min, this.max]);
        }
    }
}