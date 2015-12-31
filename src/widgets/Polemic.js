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
};

IriSP.Widgets.Polemic.prototype.defaults = {
    element_width : 5,
    element_height : 5,
    max_elements: 20,
    annotation_type : "tweet",
    defaultcolor : "#585858",
    foundcolor : "#fc00ff",
    default_version : "1",
    polemics : {
        "1" : [
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
        ],
        "2" : [
            {
                "name" : "OK",
                "keywords" : [ "++" ],
                "color" : "#1D973D"
            },
            {
                "name" : "KO",
                "keywords" : [ "!!" ],
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
    }
};

IriSP.Widgets.Polemic.prototype.getPolemics = function(version) {
    if(typeof(version) === "undefined" || !version) {
        version = this.default_version;
    }
    if(this.polemics.constructor === Array) {
        return this.polemics;
    } else {
        return this.polemics[version];
    }
};

IriSP.Widgets.Polemic.prototype.drawNoStackgraph = function(_max, _slices) {

    var _this = this;
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
            var _htmlAnnot = Mustache.to_html(
                '<div class="Ldt-Polemic-TweetDiv Ldt-TraceMe" trace-info="annotation-id:{{id}}, media-id:{{media_id}}, polemic:{{polemic}}, time:{{time}}" polemic-color="{{color}}"'
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
                title: _annotation.title,
                time: _annotation.begin.toString()
            });
            var _el = IriSP.jQuery(_htmlAnnot);
            _el.mouseover(function() {
                _annotation.trigger("select");
            }).mouseout(function() {
                _annotation.trigger("unselect");
            }).click(function() {
                _annotation.trigger("click");
                return false;
            });
            IriSP.attachDndData(_el, {
                title: _annotation.title,
                description: _annotation.description,
                image: _annotation.thumbnail,
                uri: (typeof _annotation.url !== "undefined"
                    ? _annotation.url
                    : (document.location.href.replace(/#.*$/,'') + '#id='  + _annotation.id)),
            text: '[' + _annotation.begin.toString() + '] ' + _annotation.title
            });
            // test if annotation has several colors.
            var colAr = [];
            var _polemicVersion = (_annotation.content && _annotation.content.polemic_version) || _this.default_version,
                _polemics = _this.getPolemics(_polemicVersion) || [],
                _pol,
                _polKey,
                _polDef,
                _rgxp;

            for(var _j = 0; _j < _polemics.length; _j++) {
                _pol = _polemics[_j];
                _rgxp = IriSP.Model.regexpFromTextOrArray(_pol.keywords);
                if(_rgxp.test(_annotation.description)) {
                    colAr.push(_pol.color);
                }
            }

            // display annotation
            _annotation.on("select", function() {
                if (_this.tooltip) {
                    _this.tooltip.show(
                        + Math.floor(_elx + (_this.element_width - 1) / 2),
                        + _ely,
                        _annotation.title,
                        ( (colAr.length>1) ? colAr : _col )
                    );
                }
                _this.$tweets.each(function() {
                    var _e = IriSP.jQuery(this);
                    _e.css(
                        "opacity",
                        ( _e.attr("annotation-id") == _annotation.id ? 1 : .3 )
                    );
                });
            });
            _annotation.on("unselect", function() {
                if (_this.tooltip) {
                    _this.tooltip.hide();
                }
                _this.$tweets.css("opacity",1);
            });
            _annotation.on("found", function() {
                _el.css({
                    "background" : _this.foundcolor,
                    "opacity" : 1
                });
            });
            _annotation.on("not-found", function() {
                _el.css({
                    "background" : _col,
                    "opacity" : .3
                });
            });
            _this.$zone.append(_el);
        };

        IriSP._(_slices).forEach(function(_slice) {
            var _y = _this.height;
            _slice.annotations.forEach(function(_annotation) {
                _y -= _this.element_height;
                displayAnnotation(_x, _y, "none", _this.defaultcolor, _annotation);
            });
            IriSP._(_slice.polemicStacks).forEach(function(_annotations) {
                var _color = _annotations.polemicDef.color,
                    _polemic = _annotations.polemicDef.name;
                _annotations.annotations.forEach(function(_annotation) {
                    _y -= _this.element_height;
                    displayAnnotation(_x, _y, _polemic, _color, _annotation);
                });
            });
            _x += _this.element_width;
        });

        this.$tweets = this.$.find(".Ldt-Polemic-TweetDiv");

        this.source.getAnnotations().on("search-cleared", function() {
            _this.$tweets.each(function() {
                var _el = IriSP.jQuery(this);
                _el.css({
                    "background" : _el.attr("polemic-color"),
                    "opacity" : 1
                });
            });
        });

    } else {
        this.$zone.hide();
    }
}

IriSP.Widgets.Polemic.prototype.drawStackgraph = function(_max, _slices) {
    this.is_stackgraph = true;

    var _this = this;

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
            _nums = _slice.annotations.length + "|" + _this.defaultcolor + "," + IriSP._(_slice.polemicStacks).map(function(_annotations) {
                return _annotations.annotations.length + "|" + _annotations.polemicDef.color;
            }).join(",");
        if (_slice.annotations.length) {
            var _h = Math.ceil(_scale * _slice.annotations.length);
            _y -= _h;
            displayStackElement(_x, _y, _h, _this.defaultcolor, _nums, _slice.begin, _slice.end, "none");
        }
        IriSP._(_slice.polemicStacks).forEach(function(_annotations) {
            if (_annotations.annotations.length) {
                var _color = _annotations.polemicDef.color,
                    _polemic = _annotations.polemicDef.name,
                    _h = Math.ceil(_scale * _annotations.annotations.length);
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
            _html = IriSP._.reduce(_nums, function(_htmlStr, _countStr) {
                var _components = _countStr.split("|");
                _htmlStr += '<div class="Ldt-Tooltip-AltColor" style="background: ' + _components[1] + '"></div><p>' + _components[0] + _this.l10n._annotations + '</p>';
                return _htmlStr;
            }, _html);
            if (_this.tooltip) {
                _this.tooltip.show(+ _el.attr("pos-x"), + _el.attr("pos-y"), _html);
            }
        })
        .mouseout(function() {
            if (_this.tooltip) {
                _this.tooltip.hide();
            }
        });
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

    // we don't filter with null duration anymore
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
                    return _annotation.begin >= _begin && _annotation.begin < _end;
                }),
                polemicStacks : {}
            };

        _res.annotations = _res.annotations.filter(function(_annotation) {
            var _polemicVersion = (_annotation.content && _annotation.content.polemic_version) || _this.default_version,
                _polemics = _this.getPolemics(_polemicVersion) || [],
                _pol,
                _polKey,
                _polDef,
                _rgxp,
                _notMatched = true;

            for(var _j = 0; _j < _polemics.length; _j++) {
                _pol = _polemics[_j];
                _rgxp = IriSP.Model.regexpFromTextOrArray(_pol.keywords);

                if(_rgxp.test(_annotation.description)) {
                    _polKey = _polemicVersion + "_" + _pol.name;
                    _polDef = _res.polemicStacks[_polKey] || (_res.polemicStacks[_polKey] = { 'polemicDef' : _pol, 'annotations': []});
                    _polDef.annotations.push(_annotation);
                    _notMatched = false;
                    _count++;
                }
            }
            return _notMatched;
        });
        _count += _res.annotations.length;

        _max = Math.max(_max, _count);
        _slices.push(_res);
    }

    if (_max < this.max_elements) {
        this.drawNoStackgraph(_max, _slices);
    } else {
        this.drawStackgraph(_max, _slices);
    }

    this.$position = IriSP.jQuery('<div>').addClass("Ldt-Polemic-Position");

    this.$zone.append(this.$position);

    this.$zone.click(function(_e) {
        var _x = _e.pageX - _this.$zone.offset().left;
        _this.media.setCurrentTime(_this.media.duration * _x / _this.width);
    });

    this.$.append('<div class="Ldt-Polemic-Tooltip"></div>');

    this.insertSubwidget(
        this.$.find(".Ldt-Polemic-Tooltip"),
        {
            type: "Tooltip",
            min_x: 0,
            max_x: this.width
        },
        "tooltip"
    );
};

IriSP.Widgets.Polemic.prototype.onTimeupdate = function(_time) {
    var _x = Math.floor( this.width * _time / this.media.duration);
    this.$elapsed.css({
        width:  _x + "px"
    });
    this.$position.css({
        left: _x + "px"
    });
};
