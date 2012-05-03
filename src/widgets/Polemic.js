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
            "keywords" : [ "++" ],
            "description" : "positif",
            "color" : "#1D973D"
        },
        {
            "keywords" : [ "--" ],
            "description" : "negatif",
            "color" : "#CE0A15"
        },
        {
            "keywords" : [ "==" ],
            "description" : "reference",
            "color" : "#C5A62D"  
        },
        {
            "keywords" : [ "??" ],
            "description" : "question",
            "color" : "#036AAE"
        }
    ],
    requires : [
        {
            type: "Tooltip"
        }
    ]
};

IriSP.Widgets.Polemic.prototype.onSearch = function(searchString) {
    this.searchString = typeof searchString !== "undefined" ? searchString : '';
    var _found = 0,
        _re = IriSP.Model.regexpFromTextOrArray(searchString),
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
                    "opacity" : .5
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
            this.player.popcorn.trigger("IriSP.search.matchFound");
        } else {
            this.player.popcorn.trigger("IriSP.search.noMatchFound");
        }
    }
}

IriSP.Widgets.Polemic.prototype.draw = function() {
    
    this.bindPopcorn("timeupdate", "onTimeupdate");
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
            
            var _x = 0,
                _html = '';
            
            function displayElement(_x, _y, _color, _id, _title) {
                _html += Mustache.to_html(
                    '<div class="Ldt-Polemic-TweetDiv" annotation-id="{{id}}" tweet-title="{{title}}" pos-x="{{posx}}" pos-y="{{top}}" polemic-color="{{color}}"'
                    + ' style="width: {{width}}px; height: {{height}}px; top: {{top}}px; left: {{left}}px; background: {{color}}"></div>',
                {
                    id: _id,
                    title: _title,
                    posx: Math.floor(_x + (_this.element_width - 1) / 2),
                    left: _x,
                    top: _y,
                    color: _color,
                    width: (_this.element_width-1),
                    height: _this.element_height
                });
            }
            
            IriSP._(_slices).forEach(function(_slice) {
                var _y = _this.height;
                _slice.annotations.forEach(function(_annotation) {
                    _y -= _this.element_height;
                    displayElement(_x, _y, _this.defaultcolor, _annotation.id, _annotation.title);
                });
                IriSP._(_slice.polemicStacks).forEach(function(_annotations, _j) {
                    var _color = _this.polemics[_j].color;
                    _annotations.forEach(function(_annotation) {
                        _y -= _this.element_height;
                        displayElement(_x, _y, _color, _annotation.id, _annotation.title);
                    });
                });
                _x += _this.element_width;
            });
            
            this.$zone.append(_html);
            
            this.$tweets = this.$.find(".Ldt-Polemic-TweetDiv");
            
            this.$tweets
                .mouseover(function() {
                    var _el = IriSP.jQuery(this);
                    _this.tooltip.show(_el.attr("pos-x"), _el.attr("pos-y"), _el.attr("tweet-title"), _el.attr("polemic-color"));
                })
                .mouseout(function() {
                    _this.tooltip.hide();
                })
                .click(function() {
                    var _id = IriSP.jQuery(this).attr("annotation-id");
                    _this.player.popcorn.trigger("IriSP.Mediafragment.setHashToAnnotation", _id);
                    _this.player.popcorn.trigger("IriSP.Tweet.show", _id);
                });
            
            this.bindPopcorn("IriSP.search", "onSearch");
            this.bindPopcorn("IriSP.search.closed", "onSearch");
            this.bindPopcorn("IriSP.search.cleared", "onSearch");
            
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
            
        function displayElement(_x, _y, _h, _color, _nums, _begin, _end) {
            _html += Mustache.to_html(
                '<div class="Ldt-Polemic-TweetDiv" pos-x="{{posx}}" pos-y="{{top}}" annotation-counts="{{nums}}" begin-time="{{begin}}" end-time="{{end}}"'
                + ' style="width: {{width}}px; height: {{height}}px; top: {{top}}px; left: {{left}}px; background: {{color}}"></div>',
            {
                nums: _nums,
                posx: Math.floor(_x + (_this.element_width - 1) / 2),
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
                displayElement(_x, _y, _h, _this.defaultcolor, _nums, _slice.begin, _slice.end);
            }
            IriSP._(_slice.polemicStacks).forEach(function(_annotations, _j) {
                if (_annotations.length) {
                    var _color = _this.polemics[_j].color,
                        _h = Math.ceil(_scale * _annotations.length);
                    _y -= _h;
                    displayElement(_x, _y, _h, _color, _nums, _slice.begin, _slice.end);
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
        _this.player.popcorn.currentTime(_this.source.getDuration().getSeconds() * _x / _this.width);
    });
}

IriSP.Widgets.Polemic.prototype.onTimeupdate = function() {
    var _x = Math.floor( this.width * this.player.popcorn.currentTime() / this.source.getDuration().getSeconds());
    this.$elapsed.css({
        width:  _x + "px"
    });
    this.$position.css({
        left: _x + "px"
    })
}
