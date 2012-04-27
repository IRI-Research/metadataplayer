/*
 The Slider Widget fits right under the video
 */

IriSP.Widgets.Slider = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.bindPopcorn("timeupdate","onTimeupdate");
    this.bindPopcorn("IriSP.PlayerWidget.MouseOver","onMouseover");
    this.bindPopcorn("IriSP.PlayerWidget.MouseOut","onMouseout");
};

IriSP.Widgets.Slider.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Slider.prototype.defaults = {
    minimized_height : 4,
    maximized_height : 10,
    minimize_timeout : 1500 // time before minimizing slider after mouseout
};

IriSP.Widgets.Slider.prototype.draw = function() {
    
    this.$slider = IriSP.jQuery('<div>')
        .addClass("Ldt-Slider")
        .css(this.calculateSliderCss(this.minimized_height));
    
    this.$.append(this.$slider);
    
    var _this = this;
    
    this.$slider.slider({
        range: "min",
        value: 0,
        min: 0,
        max: this.source.getDuration().getSeconds(),
        slide: function(event, ui) {
            _this.player.popcorn.currentTime(ui.value);
            _this.player.popcorn.trigger("IriSP.Mediafragment.setHashToTime");
        }
    });
    
    this.$handle = this.$slider.find('.ui-slider-handle');
    
    this.$handle.css(this.calculateHandleCss(this.minimized_height));
    
    this.$
        .mouseover(this.functionWrapper("onMouseover"))
        .mouseout(this.functionWrapper("onMouseout"));
    
    this.maximized = false;
    this.timeoutId = false;
};

IriSP.Widgets.Slider.prototype.onTimeupdate = function() {
    var _time = this.player.popcorn.currentTime();
    this.$slider.slider("value",_time);
    this.player.popcorn.trigger("IriSP.Arrow.updatePosition",{widget: this.type, time: 1000 * _time});
}

IriSP.Widgets.Slider.prototype.onMouseover = function() {
    if (this.timeoutId) {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = false;
    }
    if (!this.maximized) {
       this.animateToHeight(this.maximized_height);
       this.maximized = true;
    }
}

IriSP.Widgets.Slider.prototype.onMouseout = function() {
    if (this.timeoutId) {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = false;
    }
    var _this = this;
    this.timeoutId = window.setTimeout(function() {
        if (_this.maximized) {
            _this.animateToHeight(_this.minimized_height);
            _this.maximized = false;
        }
        _this.timeoutId = false;
    }, this.minimize_timeout);
    
}

IriSP.Widgets.Slider.prototype.animateToHeight = function(_height) {
    this.$slider.stop().animate(
        this.calculateSliderCss(_height),
        500,
        function() {
            IriSP.jQuery(this).css("overflow","visible");
        });
    this.$handle.stop().animate(
        this.calculateHandleCss(_height),
        500,
        function() {
            IriSP.jQuery(this).css("overflow","visible");
        });
}

IriSP.Widgets.Slider.prototype.calculateSliderCss = function(_size) {
    return {
        height: _size + "px",
        "margin-top": (this.minimized_height - _size) + "px"
    };
}

IriSP.Widgets.Slider.prototype.calculateHandleCss = function(_size) {
    return {
        height: (2 + _size) + "px",
        width: (2 + _size) + "px",
        "margin-left": -Math.ceil(2 + _size / 2) + "px" 
    }
}