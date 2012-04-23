IriSP.Widgets.Segments = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Segments.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Segments.prototype.defaults = {
    annotation_type : "chap",
    colors: ["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"],
    requires : [
        {
            type: "Tooltip"
        }
    ],
    height: 10
};

IriSP.Widgets.Segments.prototype.template =
    '<div class="Ldt-Segments-List">{{#segments}}'
    + '<div class="Ldt-Segments-Segment" segment-id="{{id}}" segment-text="{{text}}" segment-color="{{color}}" center-pos="{{center}}" style="left:{{left}}px; width:{{width}}px; background:{{color}}"></div>'
    + '{{/segments}}</div>'
    + '<div class="Ldt-Segments-Position"></div>';

IriSP.Widgets.Segments.prototype.draw = function() {
    var _list = this.annotation_type ? this.source.getAnnotationsByTypeTitle(this.annotation_type) : this.source.getAnnotations(),
        _this = this,
        _scale = this.width / this.source.getDuration();
    this.$.css({
        width : this.width + "px",
        height : this.height + "px"
    });
    this.$.append(Mustache.to_html(this.template, {
        segments : _list.map(function(_annotation, _k) {
            var _left = _annotation.begin * _scale,
                _width = ( _annotation.end - _annotation.begin ) * _scale,
                _center = _left + _width / 2;
            return {
                text : _annotation.title + ( _annotation.description ? '<br />' + _annotation.description.replace(/(^.{120,140})[\s].+$/,'$1&hellip;') : ''),
                color : ( typeof _annotation.color !== "undefined" && _annotation.color ? _annotation.color : _this.colors[_k % _this.colors.length] ),
                left : Math.floor( _left ),
                width : Math.floor( _width ),
                center : Math.floor( _center ),
                id : _annotation.namespacedId.name
            }
        })
    }));
    var _seglist = this.$.find('.Ldt-Segments-Segment');
    
    _seglist.mouseover(function() {
        var _el = IriSP.jQuery(this);
        _seglist.removeClass("active").addClass("inactive");
        _this.tooltip.show( _el.attr("center-pos"), 0, _el.attr("segment-text"), _el.attr("segment-color"));
        _el.removeClass("inactive").addClass("active");
    }).mouseout(function() {
        _seglist.removeClass("inactive active");
    });
}

IriSP.Widgets.Segments.prototype.searchHandler = function(searchString) {
   
}