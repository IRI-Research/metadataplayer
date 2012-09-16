IriSP.Widgets.Polemic = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Polemic.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Polemic.prototype.messages = {
    fr: {
        from_: "de ",
        _to_: " à ",
        _annotations: " annotation(s)"
    },
    en: {
        from_: "from ",
        _to_: " to ",
        _annotations: " annotation(s)"
    }
}
IriSP.Widgets.Polemic.prototype.defaults = {
    element_width : 5,
    element_height : 5,
    max_elements : 15,
    annotation_type : "tweet",
    defaultcolor : "#585858",
    foundcolor : "#fc00ff",
    polemics : [
        {
            "name" : "OK",
            "keywords" : [ "++" ],
            "color" : "#1D973D"
        },
        {
            "name" : "KO",
            "keywords" : [ "--" ],
            "color" : "#CE0A15"
        },
        {
            "name" : "REF",
            "keywords" : [ "==", "http://" ],
            "color" : "#C5A62D"  
        },
        {
            "name" : "Q",
            "keywords" : [ "?" ],
            "color" : "#036AAE"
        }
    ]
};

IriSP.Widgets.Polemic.prototype.onSearch = function(searchString) {
    this.searchString = typeof searchString !== "undefined" ? searchString : '';
    var _found = 0,
        _re = IriSP.Model.regexpFromTextOrArray(searchString, true),
        _this = this;
    this.$tweets.each(function() {
        var _el = IriSP.jQuery(this);
        if (_this.searchString) {
            if (_re.test(_el.attr("tweet-title"))) {
                _el.css({
                    "background" : _this.foundcolor,
                    "opacity" : 1
                });
                _found++;
            } else {
                _el.css({
                    "background" : _el.attr("polemic-color"),
                    "opacity" : .3
                });
            }
        } else {
            _el.css({
                "background" : _el.attr("polemic-color"),
                "opacity" : 1
            });
        }
    });
    if (this.searchString) {
        if (_found) {
            this.player.trigger("search.matchFound");
        } else {
            this.player.trigger("search.noMatchFound");
        }
    }
}

IriSP.Widgets.Polemic.prototype.draw = function() {
    
    this.onMediaEvent("timeupdate", "onTimeupdate");
    this.$zone = IriSP.jQuery('<div>');
    this.$zone.addClass("Ldt-Polemic");
    this.$.append(this.$zone);
    
    this.$elapsed = IriSP.jQuery('<div>')
        .css({
            background: '#cccccc',
            position: "absolute",
            top: 0,
            left: 0,
            width: 0,
            height: "100%"
        });
        
    this.$zone.append(this.$elapsed);
    
    var _slices = [],
        _slice_count = Math.floor( this.width / this.element_width ),
        _duration = this.source.getDuration(),
        _max = 0,
        _list = this.getWidgetAnnotations(),
        _this = this;
    
    for (var _i = 0; _i < _slice_count; _i++) {
        var _begin = new IriSP.Model.Time( _i * _duration / _slice_count ),
            _end = new IriSP.Model.Time( ( _i + 1 ) * _duration / _slice_count ),
            _count = 0,
            _res = {
                begin : _begin.toString(),
                end : _end.toString(),
                annotations : _list.filter(function(_annotation) {
                    return _annotation.begin >= _begin && _annotation.end < _end;
                }),
                polemicStacks : []
            }
            
        for (var _j = 0; _j < this.polemics.length; _j++) {
            var _polemic = _res.annotations.searchByDescription(this.polemics[_j].keywords);
            _count += _polemic.length;
            _res.polemicStacks.push(_polemic);
        }
        for (var _j = 0; _j < this.polemics.length; _j++) {
            _res.annotations.removeElements(_res.polemicStacks[_j]);
        }
        _count += _res.annotations.length;
        _max = Math.max(_max, _count);
        _slices.push(_res);
    }
    if (_max < this.max_elements) {
        this.is_stackgraph = false;
        if (_max) {
                    
            this.height = (2 + _max) * this.element_height;
            this.$zone.css({
                width: this.width + "px",
                height: this.height + "px",
                position: "relative"
            });
            
            var _x = 0;
            
            function displayAnnotation(_elx, _ely, _pol, _col, _annotation) {
                var _html = Mustache.to_html(
                    '<div class="Ldt-Polemic-TweetDiv Ldt-TraceMe" trace-info="annotation-id:{{id}}, media-id={{media_id}}, polemic={{polemic}}" polemic-color="{{color}}"'
                    + ' tweet-title="{{title}}" annotation-id="{{id}}" style="width: {{width}}px; height: {{height}}px; top: {{top}}px; left: {{left}}px; background: {{color}}"></div>',
                {
                    id: _annotation.id,
                    media_id: _this.source.currentMedia.id,
                    polemic: _pol,
                    left: _elx,
                    top: _ely,
                    color: _col,
                    width: (_this.element_width-1),
                    height: _this.element_height,
                    title: _annotation.title
                });
                var _el = IriSP.jQuery(_html);
                _el.mouseover(function() {
                    _annotation.trigger("select");
                }).mouseout(function() {
                    _annotation.trigger("unselect");
                }).click(function() {
                    _this.player.trigger("Mediafragment.setHashToAnnotation", _annotation.id);
                    _this.player.trigger("Tweet.show", _annotation.id);
                });
                _annotation.on("select", function() {
                    _this.tooltip.show(
                        Math.floor(_elx + (_this.element_width - 1) / 2),
                        _ely,
                        _annotation.title,
                        _col
                    );
                    _this.$tweets.each(function() {
                        var _e = IriSP.jQuery(this);
                        _e.css(
                            "opacity",
                            ( _e.attr("annotation-id") == _annotation.id ? 1 : .3 )
                        );
                    });
                });
                _annotation.on("unselect", function() {
                    _this.tooltip.hide();
                    _this.$tweets.css("opacity",1);
                });
                _this.$zone.append(_el);
            }
            
            IriSP._(_slices).forEach(function(_slice) {
                var _y = _this.height;
                _slice.annotations.forEach(function(_annotation) {
                    _y -= _this.element_height;
                    displayAnnotation(_x, _y, "none", _this.defaultcolor, _annotation);
                });
                IriSP._(_slice.polemicStacks).forEach(function(_annotations, _j) {
                    var _color = _this.polemics[_j].color,
                        _polemic = _this.polemics[_j].name;
                    _annotations.forEach(function(_annotation) {
                        _y -= _this.element_height;
                        displayAnnotation(_x, _y, _polemic, _color, _annotation);
                    });
                });
                _x += _this.element_width;
            });
            
            this.$zone.append(_html);
            
            this.$tweets = this.$.find(".Ldt-Polemic-TweetDiv");
            
            this.onMdpEvent("search", "onSearch");
            this.onMdpEvent("search.closed", "onSearch");
            this.onMdpEvent("search.cleared", "onSearch");
            
        } else {
            this.$zone.hide();
        }
    } else {
        this.is_stackgraph = true;
        
        this.height = (2 + this.max_elements) * this.element_height;
        this.$zone.css({
            width: this.width + "px",
            height: this.height + "px",
            position: "relative"
        });
        
        var _x = 0,
            _html = '',
            _scale = this.max_elements * this.element_height / _max;
            
        function displayStackElement(_x, _y, _h, _color, _nums, _begin, _end, _polemic) {
            _html += Mustache.to_html(
                '<div class="Ldt-Polemic-TweetDiv Ldt-TraceMe" trace-info="annotation-block, media-id={{media_id}}, polemic={{polemic}}, time:{{begin}}" pos-x="{{posx}}" pos-y="{{top}}" annotation-counts="{{nums}}" begin-time="{{begin}}" end-time="{{end}}"'
                + ' style="width: {{width}}px; height: {{height}}px; top: {{top}}px; left: {{left}}px; background: {{color}}"></div>',
            {
                nums: _nums,
                posx: Math.floor(_x + (_this.element_width - 1) / 2),
                media_id: _this.source.currentMedia.id,
                polemic: _polemic,
                left: _x,
                top: _y,
                color: _color,
                width: (_this.element_width-1),
                height: _h,
                begin: _begin,
                end: _end
            });
        }
        
        IriSP._(_slices).forEach(function(_slice) {
            var _y = _this.height,
                _nums = _slice.annotations.length + "," + IriSP._(_slice.polemicStacks).map(function(_annotations) {
                    return _annotations.length
                }).join(",");
            if (_slice.annotations.length) {
                var _h = Math.ceil(_scale * _slice.annotations.length);
                _y -= _h;
                displayStackElement(_x, _y, _h, _this.defaultcolor, _nums, _slice.begin, _slice.end, "none");
            }
            IriSP._(_slice.polemicStacks).forEach(function(_annotations, _j) {
                if (_annotations.length) {
                    var _color = _this.polemics[_j].color,
                        _polemic = _this.polemics[_j].name,
                        _h = Math.ceil(_scale * _annotations.length);
                    _y -= _h;
                    displayStackElement(_x, _y, _h, _color, _nums, _slice.begin, _slice.end, _polemic);
                }
            });
            _x += _this.element_width;
        });
        
        this.$zone.append(_html);
        
        this.$tweets = this.$.find(".Ldt-Polemic-TweetDiv");
        
        this.$tweets
            .mouseover(function() {
                var _el = IriSP.jQuery(this),
                    _nums = _el.attr("annotation-counts").split(","),
                    _html = '<p>' + _this.l10n.from_ + _el.attr("begin-time") + _this.l10n._to_ + _el.attr("end-time") + '</p>';
                for (var _i = 0; _i <= _this.polemics.length; _i++) {
                    var _color = _i ? _this.polemics[_i - 1].color : _this.defaultcolor;
                    _html += '<div class="Ldt-Tooltip-Color" style="background: ' + _color + '"></div><p>' + _nums[_i] + _this.l10n._annotations + '</p>'
                }
                _this.tooltip.show(_el.attr("pos-x"), _el.attr("pos-y"), _html);
            })
            .mouseout(function() {
                _this.tooltip.hide();
            })
            
    }
    
    this.$position = IriSP.jQuery('<div>').addClass("Ldt-Polemic-Position");
        
    this.$zone.append(this.$position);
    
    this.$zone.click(function(_e) {
        var _x = _e.pageX - _this.$zone.offset().left;
        _this.media.setCurrentTime(_this.media.duration * _x / _this.width);
    });
    
    this.$.append('<div class="Ldt-Polemic-Tooltip"></div>');
    
    this.insertSubwidget(this.$.find(".Ldt-Polemic-Tooltip"), "tooltip", { type: "Tooltip" });
}

IriSP.Widgets.Polemic.prototype.onTimeupdate = function(_time) {
    var _x = Math.floor( this.width * _time / this.media.duration);
    this.$elapsed.css({
        width:  _x + "px"
    });
    this.$position.css({
        left: _x + "px"
    })
}
