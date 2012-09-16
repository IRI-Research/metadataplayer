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
    live_update : true,
        /* Shall the bounds change each time
        the Annotation Widget sends an update (true)
        or only when "show" is triggered (false) ?
        - true is to be recommended when the widget is permanently displayed.
        */
    override_bounds : true
        /* Can the Annotation Widget bounds be overriden ? */
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
            _this.player.trigger("Arrow.updatePosition",{
                widget:_this.type,
                time:Math.floor((ui.values[0]+ui.values[1])/2)
            });
            _this.player.trigger("Slice.boundsChanged",[ui.values[0], ui.values[1]]);
        },
        start: function() {
            _this.sliding = true;
            if (!_this.media.getPaused) {
                _this.media.pause();
            }
            _currentTime = _this.media.getCurrentTime();
        },
        slide: function(event, ui) {
            if (!_this.override_bounds && (ui.value < _this.min || ui.value > _this.max)) {
                return false;
            }
            _this.media.setCurrentTime(ui.value);
        },
        stop: function() {
            _this.sliding = false;
            _this.media.setCurrentTime(_currentTime);
        }
    });
    this.$slider.find(".ui-slider-handle:first").addClass("Ldt-Slice-left-handle");
    this.$slider.find(".ui-slider-handle:last").addClass("Ldt-Slice-right-handle");
    if (this.start_visible) {
        this.show();
    } else {
        this.hide();
    }
    this.onMdpEvent("Slice.show","show");
    this.onMdpEvent("Slice.hide","hide");
    this.onMdpEvent("Annotation.boundsChanged","storeBounds");
    this.player.trigger("Annotation.getBounds");
};

IriSP.Widgets.Slice.prototype.show = function() {
    this.$slider.show();
    this.player.trigger("Arrow.takeover",this.type);
    this.$slider.slider("values", [this.min, this.max]);
}

IriSP.Widgets.Slice.prototype.hide = function() {
    this.$slider.hide();
    this.player.trigger("Arrow.release");
}

IriSP.Widgets.Slice.prototype.storeBounds = function(_values) {
    if (!this.media.getPaused() && (this.min != _values[0] || this.max != _values[1])) {
        this.min = _values[0];
        this.max = _values[1];
        if (this.live_update && !this.sliding) {
            this.$slider.slider("values", [this.min, this.max]);
        }
    }
}