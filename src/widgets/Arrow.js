IriSP.Widgets.Arrow = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Arrow.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Arrow.prototype.defaults = {
    arrow_height : 16,
    arrow_width : 24,
    base_height : 2,
    base_curve : 0,
    fill_url: IriSP.widgetsDir + '/img/pinstripe.png',
    fill_color: "#ffffff",
    inner_stroke_color: "#ffffff",
    inner_stroke_width: 4,
    outer_stroke_color: "#B6B8B8",
    outer_stroke_width: 1,
    animation_speed: 20,
    follow_current_time: false,
    annotation_type: "chap"
}

IriSP.Widgets.Arrow.prototype.draw = function() {
    this.height = this.arrow_height + this.base_height;
    this.$.addClass("Ldt-Arrow").css("height", this.height + "px");
    this.paper = new Raphael(this.container, this.width, this.height );
    window.myArrow = this;
    this.innerArrow = this.paper.path('M0,' + this.height + 'L' + this.width + ',' + this.height);
    this.outerArrow = this.paper.path('M0,' + this.height + 'L' + this.width + ',' + this.height);
    this.innerArrow.attr({
        stroke: this.inner_stroke_color,
        "stroke-width": this.inner_stroke_width,
        fill: this.fill_url ? ( 'url(' + this.fill_url + ')' ) : this.fill_color
    });
    this.outerArrow.attr({
        stroke: this.outer_stroke_color,
        "stroke-width": this.outer_stroke_width,
        fill: "none"
    });
    this.moveTo(0);
    this.bindPopcorn("timeupdate","onTimeupdate");
}

IriSP.Widgets.Arrow.prototype.drawAt = function(_x) {
    _x = Math.floor(Math.max(0, Math.min(_x, this.width)));
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
    this.innerArrow.attr({
        path: _d
    });
    this.outerArrow.attr({
        path: _d
    });
}

IriSP.Widgets.Arrow.prototype.moveTo = function(_x) {
    this.targetX = Math.floor(Math.max(0, Math.min(_x, this.width)));
    if (typeof this.animInterval === "undefined") {
        this.animInterval = window.setInterval(
            this.functionWrapper("increment"),
            40
        )
    }
    this.increment();
}

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
}

IriSP.Widgets.Arrow.prototype.onTimeupdate = function() {
    var _list = [],
        _time = Math.floor(this.player.popcorn.currentTime() * 1000);
    if (!this.follow_current_time) {
        _list = this.getWidgetAnnotations().filter(function(_annotation) {
            return _annotation.begin <= _time && _annotation.end > _time;
        });
    }
    if (_list.length) {
        _time = ( _list[0].begin + _list[0].end ) / 2;
    }
    var _x = this.width * _time / this.source.getDuration();
    this.moveTo(_x);
}
