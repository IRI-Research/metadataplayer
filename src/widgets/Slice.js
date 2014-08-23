/*
 The Slider Widget shows time position and allows seek
 */

IriSP.Widgets.Slice = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.sliding = false;
};

IriSP.Widgets.Slice.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Slice.prototype.defaults = {
    show_arrow: false
};

IriSP.Widgets.Slice.prototype.template =
    '<div class="Ldt-Slice"></div>'
    + '{{#show_arrow}}<div class="Ldt-Slice-Arrow"></div>{{/show_arrow}}';

IriSP.Widgets.Slice.prototype.draw = function() {
    
    this.renderTemplate();
    
    this.$slider = this.$.find(".Ldt-Slice");
    
    if (this.show_arrow) {
        this.insertSubwidget(this.$.find(".Ldt-Slice-Arrow"), { type: "Arrow" },"arrow");
    }
    
    this.min = 0;
    this.max = this.media.duration.valueOf();
    
    var _this = this,
        _currentTime;
    
    this.$slider.slider({
        range: true,
        values: [0, this.max],
        min: 0,
        max: this.max,
        change: function(event, ui) {
            if (_this.arrow) {
                _this.arrow.moveToTime((ui.values[0]+ui.values[1])/2);
            }
            if (_this.onBoundsChanged) {
                _this.onBoundsChanged(ui.values[0],ui.values[1]);
            }
        },
        start: function() {
            _this.sliding = true;
            if (!_this.media.getPaused()) {
                _this.media.pause();
            }
            _currentTime = _this.media.getCurrentTime();
        },
        slide: function(event, ui) {
            _this.media.setCurrentTime(ui.value);
        },
        stop: function() {
            _this.sliding = false;
            _this.media.setCurrentTime(_currentTime);
        }
    });
    
    this.$slider.find(".ui-slider-handle:first").addClass("Ldt-Slice-left-handle");
    this.$slider.find(".ui-slider-handle:last").addClass("Ldt-Slice-right-handle");
    
    this.getWidgetAnnotations().forEach(function(_a) {
        _a.on("enter", function() {
            _this.setBounds(_a.begin, _a.end);
        });
    });
    this.player.on("annotation-click", function(_a) {
        _this.setBounds(_a.begin, _a.end);
    });
};

IriSP.Widgets.Slice.prototype.setBounds = function(begin, end) {
    this.$slider.slider("values", [ begin, end ]);
};

IriSP.Widgets.Slice.prototype.show = function() {
    this.$slider.show();
};

IriSP.Widgets.Slice.prototype.hide = function() {
    this.$slider.hide();
};
