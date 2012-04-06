IriSP.StackGraphWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
}

IriSP.StackGraphWidget.prototype = new IriSP.Widget();

IriSP.StackGraphWidget.prototype.draw = function() {
    var _ = IriSP._;
    this.height =  this._config.height || 50;
    this.width = this.selector.width();
    this.slices = this._config.slices || ~~(this.width/(this.streamgraph ? 20 : 5));
    _(this.tags).each(function(_a) {
        _a.regexp = new RegExp(_(_a.keywords).map(function(_k) {
            return _k.replace(/([\W])/gm,'\\$1');
        }).join("|"),"im")
    });
    this.paper = new Raphael(this.selector[0], this.width, this.height);
    this.groups = [];
    this.duration = this.getDuration();
    
    var _annotationType = this._serializer.getTweets(),
        _sliceDuration = ~~ ( this.duration / this.slices),
        _annotations = this._serializer._data.annotations,
        _groupedAnnotations = _(_.range(this.slices)).map(function(_i) {
            return _(_annotations).filter(function(_a){
                return (_a.begin <= (1 + _i) * _sliceDuration) && (_a.end >= _i * _sliceDuration)
            });
        }),
        _max = IriSP._(_groupedAnnotations).max(function(_g) {
            return _g.length
        }).length,
        _scale = this.height / _max,
        _width = this.width / this.slices,
        _showTitle = !this._config.excludeTitle,
        _showDescription = !this._config.excludeDescription;
    
    
    var _paths = _(this.tags).map(function() {
        return [];
    });
    _paths.push([]);
    
    for (var i = 0; i < this.slices; i++) {
        var _group = _groupedAnnotations[i];
        if (_group) {
            var _vol = _(this.tags).map(function() {
                return 0;
            });
            for (var j = 0; j < _group.length; j++){
           var _txt = (_showTitle ? _group[j].content.title : '') + ' ' + (_showDescription ? _group[j].content.description : '')
                var _tags = _(this.tags).map(function(_tag) {
                        return (_txt.search(_tag.regexp) == -1 ? 0 : 1)
                    }),
                    _nbtags = _(_tags).reduce(function(_a,_b) {
                        return _a + _b;
                    }, 0);
                if (_nbtags) {
                    IriSP._(_tags).each(function(_v, _k) {
                        _vol[_k] += (_v / _nbtags);
                    });
                }
            }
            var _nbtags = _(_vol).reduce(function(_a,_b) {
                    return _a + _b;
                }, 0),
                _nbneutre = _group.length - _nbtags,
                _h = _nbneutre * _scale,
                _base = this.height - _h;
            if (!this.streamgraph) {
                this.paper.rect(i * _width, _base, _width - 1, _h ).attr({
                    "stroke" : "none",
                    "fill" : this.defaultcolor
                });
            }
           _paths[0].push(_base);
            for (var j = 0; j < this.tags.length; j++) {
                _h = _vol[j] * _scale;
                _base = _base - _h;
                if (!this.streamgraph) {
                    this.paper.rect(i * _width, _base, _width - 1, _h ).attr({
                        "stroke" : "none",
                        "fill" : this.tags[j].color
                    });
                }
                _paths[j+1].push(_base);
            }
            this.groups.push(_(_vol).map(function(_v) {
                return _v / _group.length;
            }))
        } else {
            for (var j = 0; j < _paths.length; j++) {
                _paths[j].push(this.height);
            }
            this.groups.push(_(this.tags).map(function() {
                return 0;
            }));
        }
    }
    
    if (this.streamgraph) {
        for (var j = _paths.length - 1; j >= 0; j--) {
            var _d = _(_paths[j]).reduce(function(_memo, _v, _k) {
               return _memo + ( _k
                   ? 'C' + (_k * _width) + ' ' + _paths[j][_k - 1] + ' ' + (_k * _width) + ' ' + _v + ' ' + ((_k + .5) * _width) + ' ' + _v
                   : 'M0 ' + _v + 'L' + (.5*_width) + ' ' + _v )
            },'') + 'L' + this.width + ' ' + _paths[j][_paths[j].length - 1] + 'L' + this.width + ' ' + this.height + 'L0 ' + this.height;
            this.paper.path(_d).attr({
                "stroke" : "none",
                "fill" : (j ? this.tags[j-1].color : this.defaultcolor)
            });
        }
    }
    this.rectangleFocus = this.paper.rect(0,0,_width,this.height)
        .attr({
            "stroke" : "none",
            "fill" : "#ff00ff",
            "opacity" : 0
        })
    this.rectangleProgress = this.paper.rect(0,0,0,this.height)
        .attr({
            "stroke" : "none",
            "fill" : "#808080",
            "opacity" : .3
        });
    this.ligneProgress = this.paper.path("M0 0L0 "+this.height).attr({"stroke":"#ff00ff", "line-width" : 2})
    
    this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.timeUpdateHandler));
    var _this = this;
    this.selector
        .click(IriSP.wrap(this, this.clickHandler))
        .mousemove(function(_e) {
            _this.updateTooltip(_e);
            // Trace
            var relX = _e.pageX - _this.selector.offset().left;
            var _duration = _this.getDuration();
            var _time = parseInt((relX / _this.width) * _duration);
            _this._Popcorn.trigger("IriSP.TraceWidget.MouseEvents", {
                "widget" : "StackGraphWidget",
                "type": "mousemove",
                "x": _e.pageX,
                "y": _e.pageY,
                "time": _time
            });

        })
        .mouseout(function() {
            _this.TooltipWidget.hide();
            _this.rectangleFocus.attr({
                "opacity" : 0
            })
        })
}

IriSP.StackGraphWidget.prototype.timeUpdateHandler = function() {
    var _currentTime = this._Popcorn.currentTime(),
        _x = (1000 * _currentTime / this.duration) * this.width;
    this.rectangleProgress.attr({
        "width" : _x
    });
    this.ligneProgress.attr({
        "path" : "M" + _x + " 0L" + _x + " " + this.height
    })
}

IriSP.StackGraphWidget.prototype.clickHandler = function(event) {
  /* Ctrl-C Ctrl-V'ed from another widget
  */

  var relX = event.pageX - this.selector.offset().left;
  var newTime = ((relX / this.width) * this.duration/1000).toFixed(2);
  this._Popcorn.trigger("IriSP.StackGraphWidget.clicked", newTime);
  this._Popcorn.currentTime(newTime);                                 
};

IriSP.StackGraphWidget.prototype.updateTooltip = function(event) {
    var _segment = Math.max(0,Math.min(this.groups.length - 1, Math.floor(this.slices * (event.pageX - this.selector.offset().left)/this.width))),
        _valeurs = this.groups[_segment],
        _width = this.width / this.slices,
        _html = '<ul style="list-style: none; margin: 0; padding: 0;">' + IriSP._(this.tags).map(function(_tag, _i) {
            return '<li style="clear: both;"><span style="float: left; width: 10px; height: 10px; margin: 2px; background: '
                + _tag.color
                + ';"></span>'
                + ~~(100 * _valeurs[_i])
                + '% de '
                + _tag.description
                + '</li>';
        }).join('') + '</ul>';
    this.TooltipWidget._shown = false; // Vraiment, on ne peut pas ouvrir le widget s'il n'est pas encore ouvert ?
    this.TooltipWidget.show('','',(_segment + .5)* this.width / this.slices, 0);
    this.TooltipWidget.selector.find(".tip").html(_html);
    this.rectangleFocus.attr({
        "x" : _segment * _width,
        "opacity" : .4
    })
}

