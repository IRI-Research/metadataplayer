IriSP.PolemicWidget = function(player, config) {
    IriSP.Widget.call(this, player, config);
    this.bindPopcorn("IriSP.search", "searchHandler");
    this.bindPopcorn("IriSP.search.closed", "searchHandler");
    this.bindPopcorn("IriSP.search.cleared", "searchHandler");
    this.bindPopcorn("timeupdate", "onTimeupdate");
    this.sliceCount = Math.floor( this.width / this.element_width );
    this.$zone = IriSP.jQuery('<div>');
    this.$.append(this.$zone);
};

IriSP.PolemicWidget.prototype = new IriSP.Widget();

IriSP.PolemicWidget.prototype.searchHandler = function(searchString) {
    this.searchString = typeof searchString !== "undefined" ? searchString : '';
    var _found = 0,
        _re = IriSP.Model.regexpFromTextOrArray(searchString)
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

IriSP.PolemicWidget.prototype.draw = function() {
    var _slices = [],
        _duration = this.source.getDuration(),
        _max = 0,
        _list = this.annotation_type ? this.source.getAnnotationsByTypeTitle(this.annotation_type) : this.source.getAnnotations();
    
    for (var _i = 0; _i < this.sliceCount; _i++) {
        var _begin = new IriSP.Model.Time(_i*_duration/this.sliceCount),
            _end = new IriSP.Model.Time((_i+1)*_duration/this.sliceCount),
            _count = 0,
            _res = {
                annotations : _list.filter(function(_annotation) {
                    return _annotation.begin >= _begin && _annotation.end < _end;
                }),
                polemicStacks : []
            }
            
        for (var _j = 0; _j < this.tags.length; _j++) {
            var _polemic = _res.annotations.searchByDescription(this.tags[_j].keywords);
            _count += _polemic.length;
            _res.polemicStacks.push(_polemic);
        }
        for (var _j = 0; _j < this.tags.length; _j++) {
            _res.annotations.removeElements(_res.polemicStacks[_j]);
        }
        _count += _res.annotations.length;
        _max = Math.max(_max, _count);
        _slices.push(_res);
    }
    this.height = (_max ? (_max + 2) * this.element_height : 0);
    this.$zone.css({
        width: this.width + "px",
        height: this.height + "px",
        position: "relative"
    });
    
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
    
    var _x = 0,
        _this = this;
    
    function displayElement(_x, _y, _color, _id, _title) {
        var _el = IriSP.jQuery('<div>')
            .attr({
                "tweet-title" : _title,
                "pos-x" : Math.floor(_x + (_this.element_width - 1) / 2),
                "pos-y" : _y,
                "polemic-color" : _color,
                "annotation-id" : _id
            })
            .css({
                position: "absolute",
                width: (_this.element_width-1) + "px",
                height: _this.element_height + "px",
                left: _x + "px",
                top: _y + "px",
                background: _color
            })
            .addClass("Ldt-Polemic-TweetDiv");
        _this.$zone.append(_el);
        return _el;
    }
    
    IriSP._(_slices).forEach(function(_slice) {
        var _y = _this.height;
        _slice.annotations.forEach(function(_annotation) {
            _y -= _this.element_height;
            displayElement(_x, _y, _this.defaultcolor, _annotation.namespacedId.name, _annotation.title);
        });
        IriSP._(_slice.polemicStacks).forEach(function(_annotations, _j) {
            var _color = _this.tags[_j].color;
            _annotations.forEach(function(_annotation) {
                _y -= _this.element_height;
                displayElement(_x, _y, _color, _annotation.namespacedId.name, _annotation.title);
            });
        });
        _x += _this.element_width;
    });
    
    this.$tweets = this.$.find(".Ldt-Polemic-TweetDiv");
    
    this.$position = IriSP.jQuery('<div>')
        .css({
            background: '#fc00ff',
            position: "absolute",
            top: 0,
            left: "-1px",
            width: "2px",
            height: "100%"
        });
        
    this.$zone.append(this.$position);
    
    this.$tweets
        .mouseover(function() {
            var _el = IriSP.jQuery(this);
            _this.TooltipWidget.show(_el.attr("pos-x"), _el.attr("pos-y"), _el.attr("tweet-title"), _el.attr("polemic-color"));
        })
        .mouseout(function() {
            _this.TooltipWidget.hide();
        });
    
    //TODO: Display Tweet in Tweet Widget on click
    
    this.$zone.click(function(_e) {
        var _x = _e.pageX - _this.$zone.offset().left;
        _this.player.popcorn.currentTime(_this.source.getDuration().getSeconds() * _x / _this.width);
    });
}

IriSP.PolemicWidget.prototype.onTimeupdate = function() {
    var _x = Math.floor( this.width * this.player.popcorn.currentTime() / this.source.getDuration().getSeconds());
    this.$elapsed.css({
        width:  _x + "px"
    });
    this.$position.css({
        left: (_x - 1) + "px"
    })
}
