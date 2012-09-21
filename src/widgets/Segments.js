// TODO: Trigger IriSP.SegmentsWidget.click

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
    '<div class="Ldt-Segments-List"></div>'
    + '<div class="Ldt-Segments-Position"></div>'
    + '<div class="Ldt-Segments-Tooltip"></div>';

IriSP.Widgets.Segments.prototype.annotationTemplate =
    '<div class="Ldt-Segments-Segment Ldt-TraceMe" trace-info="segment-id:{{id}}, media-id:{{media_id}}" segment-text="{{text}}"'
    + 'style="left:{{left}}px; width:{{width}}px; background:{{color}}"></div>'


IriSP.Widgets.Segments.prototype.draw = function() {
    this.onMdpEvent("search", "onSearch");
    this.onMdpEvent("search.closed", "onSearch");
    this.onMdpEvent("search.cleared", "onSearch");
    this.onMediaEvent("timeupdate", "onTimeupdate");
    
    this.renderTemplate();
    
    var _list = this.getWidgetAnnotations(),
        _this = this,
        _scale = this.width / this.source.getDuration();
    this.$.css({
        width : this.width + "px",
        height : (this.height - 2) + "px",
        margin : "1px 0"
    });
    this.list_$ = this.$.find('.Ldt-Segments-List');
    
    _list.forEach(function(_annotation, _k) {
        var _left = _annotation.begin * _scale,
            _width = ( _annotation.getDuration() ) * _scale,
            _center = Math.floor( _left + _width / 2 ),
            _fulltext = _annotation.title + ( _annotation.description ? ( '<br/>' + _annotation.description ) : '' );
        var _data = {
            color : ( typeof _annotation.color !== "undefined" && _annotation.color ? _annotation.color : _this.colors[_k % _this.colors.length] ),
            text: _fulltext.replace(/(\n|\r|\r\n)/mg,' ').replace(/(^.{120,140})[\s].+$/m,'$1&hellip;'),
            left : Math.floor( _left ),
            width : Math.floor( _width ),
            id : _annotation.id,
            media_id : _annotation.getMedia().id
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
                _annotation.trigger("click");
            })
            .appendTo(_this.list_$)
        _annotation.on("select", function() {
            _this.$segments.removeClass("active").addClass("inactive");
            _this.tooltip.show( _center, 0, _data.text, _data.color );
            _el.removeClass("inactive").addClass("active");
        });
        _annotation.on("unselect", function() {
            _this.tooltip.hide();
            _this.$segments.removeClass("inactive active");
        });
    });
    this.insertSubwidget(this.$.find(".Ldt-Segments-Tooltip"), { type: "Tooltip" }, "tooltip");
    this.$segments = this.$.find('.Ldt-Segments-Segment');
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
            this.player.trigger("search.matchFound");
        } else {
            this.player.trigger("search.noMatchFound");
        }
    } else {
        this.$segments.removeClass("found unfound");
    }
}

IriSP.Widgets.Segments.prototype.onTimeupdate = function(_time) {
    var _x = Math.floor( this.width * _time / this.media.duration);
    this.$.find('.Ldt-Segments-Position').css({
        left: _x + "px"
    })
}