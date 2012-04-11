/** @class The constructor for the sparkline widget */
IriSP.SparklineWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);

  this._oldAnnotation = null;
  this._results = [];
  
  this.slices = this._config.slices || Math.floor(this.width/20);
  if (!this.width) {
      this.width = this.selector.width();
  }
  if (!this.height) {
      this.height = 40;
  }
  this.selector.css("height", this.height + "px");
  if (this._config.background) {
      this.selector.css("background", this._config.background);
  }
};


IriSP.SparklineWidget.prototype = new IriSP.Widget();

IriSP.SparklineWidget.prototype.clear = function() {

};

/** draw the sparkline using jquery sparkline */
IriSP.SparklineWidget.prototype.draw = function() {
    this.duration = this.getDuration();
    this.paper = new Raphael(this.selector[0], this.width, this.height);
    var _this = this;
  
  var views = this._serializer._data.views;
  var stat_view;
  if (!IriSP.null_or_undefined(views)) {
    for (var i = 0; i < views.length; i++) {
      var view = views[i];
      if (view.id === "stat") {
          stat_view = view;
          break;
      }
    }
  }
  
    var _ = IriSP.underscore;
  // If we've found the correct view, feed the directly the data from the view
  // to jquery sparkline. Otherwise, compute it ourselves.
    if (!IriSP.null_or_undefined(stat_view)) {
        //console.log("sparklinewidget : using stats embedded in the json");
        var _results = stat_view.meta.stat.split(",");      
    } else {
        var _annotations = this._serializer._data.annotations;
        if (this.cinecast_version) {
            _annotations = _(_annotations).filter(function(_a) {
                return _a.type !== "cinecast:MovieExtract";
            });
        }
        var _sliceDuration = Math.floor( this.duration / this.slices),
            _results = _(_.range(this.slices)).map(function(_i) {
                return _(_annotations).filter(function(_a){
                    return (_a.begin <= (1 + _i) * _sliceDuration) && (_a.end >= _i * _sliceDuration)
                }).length;
            });
    }
    var _max = Math.max(1, _(_results).max()),
        _h = this.height,
        _scale = (_h - this.lineWidth) / _max,
        _width = this.width / this.slices,
        _y = _(_results).map(function(_v) {
            return _h - (_scale * _v);
        }),
        _d = _(_y).reduce(function(_memo, _v, _k) {
               return _memo + ( _k
                   ? 'C' + (_k * _width) + ' ' + _y[_k - 1] + ' ' + (_k * _width) + ' ' + _v + ' ' + ((_k + .5) * _width) + ' ' + _v
                   : 'M0 ' + _v + 'L' + (.5*_width) + ' ' + _v )
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
  // save the results in an array so that we can re-use them when a new annotation
  // is added.
  this._results = _results;
  
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.timeUpdateHandler));
//  this._Popcorn.listen("IriSP.createAnnotationWidget.addedAnnotation", IriSP.wrap(this, this.handleNewAnnotation));
  
  this.selector.click(IriSP.wrap(this, this.clickHandler));  
};

/** react to a timeupdate event */
IriSP.SparklineWidget.prototype.timeUpdateHandler = function() {
    var _currentTime = this._Popcorn.currentTime(),
        _x = (1000 * _currentTime / this.duration) * this.width;
    this.rectangleProgress.attr({
        "width" : _x
    });
    this.ligneProgress.attr({
        "path" : "M" + _x + " 0L" + _x + " " + this.height
    });
                                  
}

/** handle clicks on the widget */
IriSP.SparklineWidget.prototype.clickHandler = function(event) {
  var relX = event.pageX - this.selector.offset().left;
  var newTime = ((relX / this.width) * this.duration/1000).toFixed(2);
    
  this._Popcorn.trigger("IriSP.SparklineWidget.clicked", newTime);
  this._Popcorn.currentTime(newTime);
};

/** react when a new annotation is added */
IriSP.SparklineWidget.prototype.handleNewAnnotation = function(annotation) {
//  var num_columns = this._results.length;
//  var duration = this._serializer.getDuration();
//  var time_step = Math.round(duration / num_columns); /* the time interval between two columns */
//  var begin = +annotation.begin;
//  var end = +annotation.end;
//  
//  /* increment all the values between the beginning and the end of the annotation */
//  var index_begin = Math.floor(begin / time_step);
//  var index_end = Math.floor(end / time_step);
//  
//  for (var i = index_begin; i < Math.min(index_end, this._results.length); i++) {
//    this._results[i]++;
//  }
//  
//  this.selector.find(".Ldt-sparkLine").sparkline(this._results, {lineColor: "#7492b4", fillColor: "#aeaeb8",
//                                                           spotColor: "#b70056",
//                                                           width: this.width, height: this.height});
};