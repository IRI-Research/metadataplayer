IriSP.Widgets.Sparkline = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Sparkline.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Sparkline.prototype.defaults = {
   lineColor : "#7492b4",
   fillColor : "#aeaeb8",
   lineWidth : 2,
   slice_count : 20,
   height : 50,
   margin : 5
};

IriSP.Widgets.Sparkline.prototype.draw = function() {
    var _slices = [],
        _duration = this.source.getDuration(),
        _max = 0,
        _list = this.getWidgetAnnotations();
    for (var _i = 0; _i < this.slice_count; _i++) {
        var _begin = (_i*_duration/this.slice_count),
            _end = ((_i+1)*_duration/this.slice_count),
            _volume = 0;
            _list.forEach(function(_annotation) {
                if (_annotation.begin < _end && _annotation.end >= _begin) {
                    var _d = _annotation.getDuration().milliseconds;
                    if (!_d) {
                        _volume += 1;
                    } else {
                        _volume += (Math.min(_annotation.end, _end) - Math.max(_annotation.begin, _begin)) / _d;
                    }
                }
            });
            _max = Math.max(_max, _volume);
        _slices.push(_volume);
    }
    if (!_max) {
        return;
    }
    this.paper = new Raphael(this.$[0], this.width, this.height);
    var _scale = (this.height - this.margin) / _max,
        _width = this.width / this.slice_count,
        _this = this,
        _y = IriSP._(_slices).map(function(_v) {
            return _this.margin + _this.height - (_scale * _v);
        }),
        _d = IriSP._(_y).reduce(function(_memo, _v, _k) {
               return _memo + ( _k
                   ? 'C' + (_k * _width) + ' ' + _y[_k - 1] + ' ' + (_k * _width) + ' ' + _v + ' ' + ((_k + .5) * _width) + ' ' + _v
                   : 'M0 ' + _v + 'L' + (.5*_width) + ' ' + _v );
            },'') + 'L' + this.width + ' ' + _y[_y.length - 1],
        _d2 = _d + 'L' + this.width + ' ' + this.height + 'L0 ' + this.height;
    
    this.paper.path(_d2).attr({
        "stroke" : "none",
        "fill" : this.fillColor
    });
         
    this.paper.path(_d).attr({
        "fill" : "none",
        "stroke" : this.lineColor,
        "stroke-width" : this.lineWidth
    });
    
    this.rectangleProgress = this.paper.rect(0,0,0,this.height)
        .attr({
            "stroke" : "none",
            "fill" : "#808080",
            "opacity" : .3
        });
        
    this.ligneProgress = this.paper.path("M0 0L0 "+this.height).attr({"stroke":"#ff00ff", "line-width" : 2});
   
    this.$.click(function(_e) {
        var _x = _e.pageX - _this.$.offset().left;
        _this.media.setCurrentTime(_this.media.duration * _x / _this.width);
    });
    
    this.onMediaEvent("timeupdate","onTimeupdate");
};

IriSP.Widgets.Sparkline.prototype.onTimeupdate = function(_time) {
    var _x = Math.floor( this.width * _time / this.media.duration);
    this.rectangleProgress.attr({
        "width" : _x
    });
    this.ligneProgress.attr({
        "path" : "M" + _x + " 0L" + _x + " " + this.height
    });
};
