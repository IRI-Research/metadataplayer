IriSP.Widgets.Arrow = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.current_pilot_widget = this.pilot_widget
};

IriSP.Widgets.Arrow.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Arrow.prototype.defaults = {
    arrow_height : 12,
    arrow_width : 20,
    base_height : 0,
    base_curve : 0,
    fill_url: IriSP.widgetsDir + '/img/pinstripe.png',
    fill_color: "#ffffff", //Gradients can be used, e.g. "90-#000-#fff" for vertical white-to-black
    stroke_color: "#b7b7b7",
    stroke_width: 1.5,
    animation_speed: 20
};

IriSP.Widgets.Arrow.prototype.draw = function() {
    this.height = this.arrow_height + this.base_height;
    this.$.addClass("Ldt-Arrow").css({
        height: (1+this.height) + "px",
        "margin-top": "1px",
        overflow: "hidden"
    });
    this.paper = new Raphael(this.container, this.width, 1+this.height );
    window.myArrow = this;
    this.svgArrow = this.paper.path('M0,' + this.height + 'L' + this.width + ',' + this.height);
    this.svgArrow.attr({
        stroke: this.stroke_color,
        "stroke-width": this.stroke_width,
        fill: this.fill_url ? ( 'url(' + this.fill_url + ')' ) : this.fill_color
    });
    this.moveToX(0);
};

IriSP.Widgets.Arrow.prototype.drawAt = function(_x) {
    _x = Math.max(0, Math.min(_x, this.width));
    var _d = 'M0,' + this.height
        + 'L0,' + Math.min( this.height, this.arrow_height + this.base_curve)
        + 'Q0,' + this.arrow_height
        + ' ' + Math.max(0, Math.min(this.base_curve, _x - this.arrow_width / 2)) + ',' + this.arrow_height
        + 'L' + Math.max(0, _x - this.arrow_width / 2) + ',' + this.arrow_height
        + 'L' + Math.max(0, _x - this.arrow_width / 2) + ',' + Math.min(this.arrow_height, 2 * this.arrow_height * _x / this.arrow_width)
        + 'L' + _x + ',0'
        + 'L' + Math.min(this.width, _x + this.arrow_width / 2) + ',' + Math.min(this.arrow_height, 2 * this.arrow_height * ( this.width - _x ) / this.arrow_width)
        + 'L' + Math.min(this.width, _x + this.arrow_width / 2) + ',' + this.arrow_height
        + 'L' + Math.min(this.width, Math.max(this.width - this.base_curve, _x + this.arrow_width / 2)) + ',' + this.arrow_height
        + 'Q' + this.width + ',' + this.arrow_height
        + ' ' + this.width + ',' + Math.min( this.height, this.arrow_height + this.base_curve)
        + 'L' + this.width + ',' + this.height;
    this.svgArrow.attr({
        path: _d
    });
};

IriSP.Widgets.Arrow.prototype.moveToX = function(_x) {
    this.targetX = Math.max(0, Math.min(_x, this.width));
    if (typeof this.animInterval === "undefined") {
        this.animInterval = window.setInterval(
            this.functionWrapper("increment"),
            40
        );
    }
    this.increment();
};

IriSP.Widgets.Arrow.prototype.moveToTime = function(_t) {
    this.moveToX(this.width * _t / this.media.duration);
};

IriSP.Widgets.Arrow.prototype.increment = function() {
    if (typeof this.currentX === "undefined") {
        this.currentX = this.targetX;
    }
    if (this.currentX < this.targetX) {
        this.currentX = Math.min(this.targetX, this.currentX + this.animation_speed);
    }
    if (this.currentX > this.targetX) {
        this.currentX = Math.max(this.targetX, this.currentX - this.animation_speed);
    }
    if (this.currentX === this.targetX) {
        window.clearInterval(this.animInterval);
        this.animInterval = undefined;
    }
    this.drawAt(this.currentX);
};
