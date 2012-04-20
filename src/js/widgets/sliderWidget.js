/*
 The Slider Widget fits right under the video
 */

IriSP.SliderWidget = function(player, config) {
    IriSP.Widget.call(this, player, config);
    this.bindPopcorn("timeupdate","onTimeupdate");
    this.bindPopcorn("IriSP.PlayerWidget.MouseOver","onMouseover");
    this.bindPopcorn("IriSP.PlayerWidget.MouseOut","onMouseout");
};

IriSP.SliderWidget.prototype = new IriSP.Widget();

IriSP.SliderWidget.prototype.draw = function() {
    
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

IriSP.SliderWidget.prototype.onTimeupdate = function() {
    this.$slider.slider("value",this.player.popcorn.currentTime());
}

IriSP.SliderWidget.prototype.onMouseover = function() {
    if (this.timeoutId) {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = false;
    }
    if (!this.maximized) {
       this.animateToHeight(this.maximized_height);
       this.maximized = true;
    }
}

IriSP.SliderWidget.prototype.onMouseout = function() {
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

IriSP.SliderWidget.prototype.animateToHeight = function(_height) {
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

IriSP.SliderWidget.prototype.calculateSliderCss = function(_size) {
    return {
        height: _size + "px",
        "margin-top": (this.minimized_height - _size) + "px"
    };
}

IriSP.SliderWidget.prototype.calculateHandleCss = function(_size) {
    return {
        height: (2 + _size) + "px",
        width: (2 + _size) + "px",
        "margin-left": -Math.ceil(2 + _size / 2) + "px" 
    }
}