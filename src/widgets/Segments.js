// TODO: Trigger IriSP.SegmentsWidget.click and IriSP.Mediafragment.showAnnotation

IriSP.Widgets.Segments = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Segments.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Segments.prototype.defaults = {
    annotation_type : "chap",
    colors: ["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"],
    height: 10
};

IriSP.Widgets.Segments.prototype.template =
    '<div class="Ldt-Segments-List">{{#segments}}'
    + '<div class="Ldt-Segments-Segment Ldt-TraceMe" trace-info="segment-id:{{id}}" segment-id="{{id}}" segment-text="{{text}}" segment-color="{{color}}" center-pos="{{center}}" begin-seconds="{{beginseconds}}"'
    + 'style="left:{{left}}px; width:{{width}}px; background:{{color}}"></div>'
    + '{{/segments}}</div>'
    + '<div class="Ldt-Segments-Position"></div>'
    + '<div class="Ldt-Segments-Tooltip"></div>';

IriSP.Widgets.Segments.prototype.draw = function() {
    this.bindPopcorn("IriSP.search", "onSearch");
    this.bindPopcorn("IriSP.search.closed", "onSearch");
    this.bindPopcorn("IriSP.search.cleared", "onSearch");
    this.bindPopcorn("timeupdate", "onTimeupdate");
    
    var _list = this.getWidgetAnnotations(),
        _this = this,
        _scale = this.width / this.source.getDuration();
    this.$.css({
        width : this.width + "px",
        height : (this.height - 2) + "px",
        margin : "1px 0"
    });
    this.$.append(Mustache.to_html(this.template, {
        segments : _list.map(function(_annotation, _k) {
            var _left = _annotation.begin * _scale,
                _width = ( _annotation.end - _annotation.begin ) * _scale,
                _center = _left + _width / 2,
                _fulltext = _annotation.title + ( _annotation.description ? ( '<br/>' + _annotation.description ) : '' );
            return {
                text : _fulltext.replace(/(^.{120,140})[\s].+$/,'$1&hellip;'),
                color : ( typeof _annotation.color !== "undefined" && _annotation.color ? _annotation.color : _this.colors[_k % _this.colors.length] ),
                beginseconds : _annotation.begin.getSeconds() ,
                left : Math.floor( _left ),
                width : Math.floor( _width ),
                center : Math.floor( _center ),
                id : _annotation.id
            }
        })
    }));
    this.insertSubwidget(this.$.find(".Ldt-Segments-Tooltip"), "tooltip", { type: "Tooltip" });
    this.$segments = this.$.find('.Ldt-Segments-Segment');
    
    this.$segments.mouseover(function() {
        var _el = IriSP.jQuery(this);
        _this.$segments.removeClass("active").addClass("inactive");
        _this.tooltip.show( _el.attr("center-pos"), 0, _el.attr("segment-text"), _el.attr("segment-color"));
        _el.removeClass("inactive").addClass("active");
    })
    .mouseout(function() {
        _this.tooltip.hide();
        _this.$segments.removeClass("inactive active");
    })
    .click(function() {
        var _el = IriSP.jQuery(this);
        _this.player.popcorn.currentTime(_el.attr("begin-seconds"));
        _this.player.popcorn.trigger("IriSP.Mediafragment.setHashToAnnotation", _el.attr("segment-id"));
    });
}

IriSP.Widgets.Segments.prototype.onSearch = function(searchString) {
    this.searchString = typeof searchString !== "undefined" ? searchString : '';
    var _found = 0,
        _re = IriSP.Model.regexpFromTextOrArray(searchString, true);
    if (this.searchString) {
        this.$segments.each(function() {
            var _el = IriSP.jQuery(this);
            if (_re.test(_el.attr("segment-text"))) {
                _el.removeClass("unfound").addClass("found");
                _found++;
            } else {
                _el.removeClass("found").addClass("unfound");
            }
        });
        if (_found) {
            this.player.popcorn.trigger("IriSP.search.matchFound");
        } else {
            this.player.popcorn.trigger("IriSP.search.noMatchFound");
        }
    } else {
        this.$segments.removeClass("found unfound");
    }
}

IriSP.Widgets.Segments.prototype.onTimeupdate = function() {
    var _x = Math.floor( this.width * this.player.popcorn.currentTime() / this.source.getDuration().getSeconds());
    this.$.find('.Ldt-Segments-Position').css({
        left: _x + "px"
    })
}