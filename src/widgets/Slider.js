/*
 The Slider Widget fits right under the video
 */

IriSP.Widgets.Slider = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Slider.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Slider.prototype.defaults = {
    minimized_height : 4,
    maximized_height : 4,
    minimize_timeout : 1500 /*  time before minimizing slider after mouseout,
                                set to zero for fixed slider */
};

IriSP.Widgets.Slider.prototype.template =
    '<div class="Ldt-Slider"></div><div class="Ldt-Slider-Time">00:00</div>';

IriSP.Widgets.Slider.prototype.draw = function() {

    this.renderTemplate();

    this.$time = this.$.find(".Ldt-Slider-Time");

    this.$slider = this.$.find(".Ldt-Slider");

    var _this = this;

    this.$slider.slider({
        range: "min",
        value: 0,
        min: 0,
        max: this.source.getDuration().milliseconds,
        slide: function(event, ui) {
            _this.media.setCurrentTime(ui.value);
            _this.player.trigger("Mediafragment.setHashToTime");
        }
    });

    this.$handle = this.$slider.find('.ui-slider-handle');

    this.onMediaEvent("timeupdate","onTimeupdate");
    this.onMdpEvent("Player.MouseOver","onMouseover");
    this.onMdpEvent("Player.MouseOut","onMouseout");

    if (this.minimize_timeout) {
        this.$slider.css(this.calculateSliderCss(this.minimized_height));
        this.$handle.css(this.calculateHandleCss(this.minimized_height));

        this.maximized = false;
        this.timeoutId = false;
    }

    this.$slider
        .mouseover(function() {
            _this.$time.show();
            _this.onMouseover();
        })
        .mouseout(this.functionWrapper("onMouseout"))
        .mousemove(function(_e) {
            var _x = _e.pageX - _this.$.offset().left,
                _t = new IriSP.Model.Time(_this.media.duration * _x / _this.width);
            _this.$time.text(_t.toString()).css("left",_x);
        });
};

IriSP.Widgets.Slider.prototype.onTimeupdate = function(_time) {
    this.$slider.slider("value",_time);
    this.player.trigger("Arrow.updatePosition",{widget: this.type, time: _time});
};

IriSP.Widgets.Slider.prototype.onMouseover = function() {
    if (this.minimize_timeout) {
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = false;
        }
        if (!this.maximized) {
           this.animateToHeight(this.maximized_height);
           this.maximized = true;
        }
    }
};

IriSP.Widgets.Slider.prototype.onMouseout = function() {
    this.$time.hide();
    if (this.minimize_timeout) {
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
};

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
};

IriSP.Widgets.Slider.prototype.calculateSliderCss = function(_size) {
    return {
        height: _size + "px",
        "margin-top": (this.minimized_height - _size) + "px"
    };
};

IriSP.Widgets.Slider.prototype.calculateHandleCss = function(_size) {
    return {
        height: (2 + _size) + "px",
        width: (2 + _size) + "px",
        "margin-left": -Math.ceil(2 + _size / 2) + "px"
    };
};
