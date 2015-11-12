// TODO: Trigger IriSP.SegmentsWidget.click

IriSP.Widgets.Segments = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Segments.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Segments.prototype.defaults = {
    annotation_type : "chap",
    colors: ["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"],
    line_height: 8,
    background: "#e0e0e0",
    overlap: .25,
    found_color: "#FF00FC",
    faded_found_color: "#ff80fc",
    selected_color: "#74d600",
    faded_selected_color: "#baf9b5",
    no_tooltip: false,
    use_timerange: false,
    scale_to_parent: true
};

IriSP.Widgets.Segments.prototype.template =
    '<div class="Ldt-Segments-List"></div>'
    + '<div class="Ldt-Segments-Position"></div>'
    + '<div class="Ldt-Segments-Tooltip"></div>';

IriSP.Widgets.Segments.prototype.annotationTemplate =
    '<div class="Ldt-Segments-Segment Ldt-TraceMe" trace-info="segment-id:{{id}}, media-id:{{media_id}}, from:{{from}}, to:{{to}}" segment-text="{{text}}"'
    + 'style="top:{{top}}px; height:{{height}}px; left:{{left}}px; width:{{width}}px; background:{{medcolor}}" data-base-color="{{color}}" data-low-color="{{lowcolor}}" data-medium-color="{{medcolor}}"></div>';


IriSP.Widgets.Segments.prototype.do_draw = function (isRedraw) {
    if (this.width != this.$.parent().width() && this.scale_to_parent) {
        // Reset width
        this.width = this.$.parent().width();
        this.$.css({ width : this.width + "px" });
    }
    var _this = this,
        _list = this.getWidgetAnnotations().filter(function(_ann) {
            return _ann.getDuration() > 0 && _ann.getMedia().id == _this.media.id;
        }),
        _scale = this.width / this.source.getDuration(),
        list_$ = this.$.find('.Ldt-Segments-List'),
        lines = [],
        zindex = 1,
        searching = false;
    
    function saturate(r, g, b, s) {
        function satcomp(c) {
            return Math.floor(240 * (1 - s) + c * s);
        }
        var res = ( 0x10000 * satcomp(r) + 0x100 * satcomp(g) + satcomp(b)).toString(16);
        while (res.length < 6) {
            res = "0" + res;
        }
        return "#" + res;
    }

    if (isRedraw) {
        // Remove all previous elements before recreating them. Not very efficient.
        this.$.find('.Ldt-Segments-Segment').remove();
    }
    _list.forEach(function(_annotation, _k) {
        var _left = _annotation.begin * _scale,
            _width = ( _annotation.getDuration() ) * _scale,
            _center = Math.floor( _left + _width / 2 ),
            _fulltext = _annotation.title + ( _annotation.description ? ( '<br/>' + _annotation.description ) : '' ),
            line = IriSP._(lines).find(function(line) {
                return !IriSP._(line.annotations).find(function(a) {
                    return a.begin < _annotation.end && a.end > _annotation.begin;
                });
            });
        if (!line) {
            line = { index: lines.length, annotations: []};
            lines.push(line); 
        }
        line.annotations.push(_annotation);
        var _top = ((1 - _this.overlap) * line.index) * _this.line_height,
            color = ( typeof _annotation.color !== "undefined" && _annotation.color ? _annotation.color : _this.colors[_k % _this.colors.length] ),
            r = parseInt(color.substr(1,2),16),
            g = parseInt(color.substr(3,2),16),
            b = parseInt(color.substr(5,2),16),
            medcolor = saturate(r, g, b, .5),
            lowcolor = saturate(r, g, b, .2);
        var _data = {
            color : color,
            medcolor: medcolor,
            lowcolor: lowcolor,
            text: (_annotation.creator ? (_annotation.creator + " : ") : "" ) + _fulltext.replace(/(\n|\r|\r\n)/mg,' ').replace(/(^.{120,140})[\s].+$/m,'$1&hellip;'),
            left : _left,
            width : _width,
            top: _top,
            height: _this.line_height - 1,
            id : _annotation.id,
            media_id : _annotation.getMedia().id,
            from: _annotation.begin.toString(),
            to: _annotation.end.toString()
        };
        var _html = Mustache.to_html(_this.annotationTemplate, _data),
            _el = IriSP.jQuery(_html);
        _el.mouseover(function() {
                _annotation.trigger("select");
            })
            .mouseout(function() {
                _annotation.trigger("unselect");
            })
            .click(function() {
                if(_this.use_timerange){
                    if(!_this.media.getTimeRange()){
                        _this.media.setCurrentTime(_annotation.begin);
                        _this.media.setTimeRange(_annotation.begin, _annotation.end);
                        _this.media.play();
                        _this.$segments.each(function(){
                            var _segment = IriSP.jQuery(this);
                            _segment.css("background", lowcolor).removeClass("selected");
                        })
                        _el.css("background", _this.selected_color).addClass("selected");
                    }
                    else if (_this.media.getTimeRange()[0]==_annotation.begin || _this.media.getTimeRange()[1]==_annotation.end){
                        _this.media.resetTimeRange();
                        _this.$segments.each(function(){
                            var _segment = IriSP.jQuery(this);
                            _segment.css("background", lowcolor).removeClass("selected");
                            _annotation.trigger("select");
                        })
                    }
                    else {
                        _this.media.setCurrentTime(_annotation.begin);
                        _this.media.setTimeRange(_annotation.begin, _annotation.end);
                        _this.media.play();
                        _this.$segments.each(function(){
                            var _segment = IriSP.jQuery(this);
                            _segment.css("background", lowcolor).removeClass("selected");
                        })
                        _el.css("background", _this.selected_color).addClass("selected");
                    }
                }
                _annotation.trigger("click");
            })
            .appendTo(list_$);
        IriSP.attachDndData(_el, {
        	title: _annotation.title,
        	description: _annotation.description,
        	uri: (typeof _annotation.url !== "undefined" 
                ? _annotation.url
                : (document.location.href.replace(/#.*$/,'') + '#id='  + _annotation.id)),
            image: _annotation.thumbnail,
            text: '[' + _annotation.begin.toString() + '] ' + _annotation.title
        });
        _annotation.on("select", function() {
            _this.$segments.each(function() {
                var _segment = IriSP.jQuery(this);
                _segment.css({
                    background: _segment.hasClass("found") ? _this.faded_found_color : _segment.attr("data-low-color")
                });
                _segment.css({
                    background: _segment.hasClass("selected") ? _this.faded_selected_color : _segment.attr("data-low-color")
                })
            });
            _el.css({
                background: _el.hasClass("found") ? _this.found_color: color,
                background: _el.hasClass("selected") ? _this.selected_color: color,
                "z-index": ++zindex
            });
            if (_this.tooltip) {
                _this.tooltip.show( _center, _top, _data.text, _data.color );
            }
        });
        _annotation.on("unselect", function() {
            if (_this.tooltip) {
                _this.tooltip.hide();
            }
            _this.$segments.each(function() {
                var _segment = IriSP.jQuery(this);
                _segment.css("background", _segment.hasClass("found") ? _this.found_color : _segment.attr(searching ? "data-low-color" : "data-medium-color"));
                _segment.css("background", _segment.hasClass("selected") ? _this.selected_color : _segment.attr(searching ? "data-low-color" : "data-medium-color"));
            });
        });
        _annotation.on("found", function() {
            _el.css("background", _this.found_color).addClass("found");
        });
        _annotation.on("not-found", function() {
            _el.css("background", lowcolor).removeClass("found");
        });
    });
    
    this.onMediaEvent("resettimerange", function(){
        
        _this.$segments.each(function(){
            var _segment = IriSP.jQuery(this);
            _segment.removeClass("selected");
        })
    });
    
    this.$.css({
        width : this.width + "px",
        height : (((1 - this.overlap) * lines.length + this.overlap) * this.line_height) + "px",
        background : this.background,
        margin: "1px 0"
    });
    this.$segments = this.$.find('.Ldt-Segments-Segment');
};

IriSP.Widgets.Segments.prototype.draw = function() {
    var widget = this;
    widget.onMediaEvent("timeupdate", "onTimeupdate");
    widget.renderTemplate();
    widget.do_draw();
    if (!this.no_tooltip) {
        widget.insertSubwidget(
            widget.$.find(".Ldt-Segments-Tooltip"),
            {
                type: "Tooltip",
                min_x: 0,
                max_x: this.width
            },
            "tooltip"
        );
    };
    widget.source.getAnnotations().on("search", function() {
        searching = true;
    });
    widget.source.getAnnotations().on("search-cleared", function() {
        searching = false;
        _this.$segments.each(function() {
            var _segment = IriSP.jQuery(this);
            _segment.css("background", _segment.attr("data-medium-color")).removeClass("found");
        });
    });
    this.$.on("resize", function () { widget.do_draw(true); });
};

IriSP.Widgets.Segments.prototype.onTimeupdate = function(_time) {    
    var _x = Math.floor( this.width * _time / this.media.duration);
    this.$.find('.Ldt-Segments-Position').css({
        left: _x + "px"
    });
};

