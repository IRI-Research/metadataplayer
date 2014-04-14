IriSP.Widgets.Highlighter = function(player, config) {
    var _this = this;
    IriSP.Widgets.Widget.call(this, player, config);
    this.throttledRefresh = IriSP._.throttle(function() {
        console.log("highlighter Refresh");
        _this.update();
    }, 800);
};

/**
 * Highlighter widget
 * This widgets highlights the current annotations by setting the
 * .activeAnnotation class on appropriate .Ldt-Highlighter-Annotation
 * elements. These elements *must* have data-begin and data-end properties specifying their bounds (in ms) (and data-media specifying the media-id)
 */
IriSP.Widgets.Highlighter.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Highlighter.prototype.defaults =  {
}

IriSP.Widgets.Highlighter.prototype.update = function() {
    var  _this = this;
    var _currentTime = _this.media.getCurrentTime();
    _this.$.find(".Ldt-Highlighter-Annotation", document).toggleClass("currentAnnotation", function () {
        return (this.dataset.media === _this.media.id && this.dataset.begin <= _currentTime && _currentTime < this.dataset.end);
    });
    console.log(_this.$.find(".currentAnnotation"));
    return false;
};

IriSP.Widgets.Highlighter.prototype.draw = function() {
    var  _this = this;
    
    var _events = [
        "timeupdate",
        "seeked",
        "loadedmetadata"
    ];
    for (var _i = 0; _i < _events.length; _i++) {
        _this.onMediaEvent(_events[_i], _this.throttledRefresh);
    }
    _this.throttledRefresh();
};
