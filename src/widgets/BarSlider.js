/*
 The BarSlider Widget fits right under the video
 */

IriSP.Widgets.BarSlider = function (player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.BarSlider.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.BarSlider.prototype.defaults = {
    annotation_types: "Slides"
};

IriSP.Widgets.BarSlider.prototype.template =
    '<div class="Ldt-BarSlider">'
    + ' <div class="Ldt-BarSlider-sliderbar"></div>'
    + ' <div class="Ldt-BarSlider-currentbar"></div>'
    + ' <div class="Ldt-BarSlider-currentbarhead rightarrow"></div>'
//    + ' <div class="Ldt-BarSlider-barmark"></div>'
    + ' <div class="Ldt-BarSlider-Time">00:00</div>'
    + '</div>';

IriSP.Widgets.BarSlider.prototype.draw = function () {
    var _this = this;

    this.renderTemplate();
    this.$time = this.$.find(".Ldt-BarSlider-Time");
    this.$slider = this.$.find(".Ldt-BarSlider");
    this.$currentbar = this.$.find(".Ldt-BarSlider-currentbar");
    this.$currentbarhead = this.$.find(".Ldt-BarSlider-currentbarhead");

    this.$slider.slider({
        range: "min",
        value: 0,
        min: 0,
        max: this.source.getDuration().milliseconds,
        slide: function (event, ui) {
            _this.media.setCurrentTime(ui.value);
            _this.player.trigger("Mediafragment.setHashToTime");
        }
    });

    this.$handle = this.$slider.find('.ui-slider-handle');

    this.onMediaEvent("timeupdate", "onTimeupdate");
    this.onMdpEvent("Player.MouseOut", "onMouseout");

    this.$slider
        .mouseover(function () {
            _this.$time.show();
        })
        .mouseout(this.functionWrapper("onMouseout"))
        .mousemove(function (_e) {
            var _x = _e.pageX - _this.$.offset().left,
                _t = new IriSP.Model.Time(_this.media.duration * _x / _this.width);
            _this.$time.text(_t.toString()).css("left", _x);
        });
};

IriSP.Widgets.BarSlider.prototype.onTimeupdate = function (_time) {
    var _this = this,
        pos = 100 * _time / _this.media.duration;
    this.$slider.slider("value", _time);
    // Update bar position
    this.$currentbar.css("width", pos + "%");
    this.$currentbarhead.css("left", "calc(" + pos + "% + 4px)");
};

IriSP.Widgets.BarSlider.prototype.onMouseout = function () {
    this.$time.hide();
};
