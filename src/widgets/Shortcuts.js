IriSP.Widgets.Shortcuts = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

/**
 * Keyboard shortcuts widget
 * This widgets add global shortcuts for common actions.
 * The default shortcuts are:
 * - Control-space for play/pause
 * - Control-left for rewind (+shift to go faster)
 * - Control-right for forward (+shift to go faster)
 */
IriSP.Widgets.Shortcuts.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Shortcuts.prototype.defaults =  {
    // Time increment, in ms, for backward/forward navigation
    time_increment: 2000
};

IriSP.Widgets.Shortcuts.prototype.draw = function() {
    var  _this = this;

    /* Standard shortcuts */
    Mousetrap.bindGlobal("ctrl+space", function (e) {
        e.preventDefault();
        if (!_this.media.getPaused()) {
            _this.media.pause();
        } else {
            _this.media.play();
        }
        return false;
    });
    Mousetrap.bindGlobal("ctrl+left", function (e) {
        // Backward
        e.preventDefault();
        _this.media.setCurrentTime(Math.max(0, _this.media.getCurrentTime() - _this.time_increment));
        return false;
    });
    Mousetrap.bindGlobal("ctrl+shift+left", function (e) {
        // Backward
        e.preventDefault();
        _this.media.setCurrentTime(Math.max(0, _this.media.getCurrentTime() - 5 * _this.time_increment));
        return false;
    });
    Mousetrap.bindGlobal("ctrl+right", function (e) {
        // Forward
        e.preventDefault();
        _this.media.setCurrentTime(Math.min(_this.media.duration, _this.media.getCurrentTime() + _this.time_increment));
        return false;
    });
    Mousetrap.bindGlobal("ctrl+shift+right", function (e) {
        // Forward
        e.preventDefault();
        _this.media.setCurrentTime(Math.min(_this.media.duration, _this.media.getCurrentTime() + 5 * _this.time_increment));
        return false;
    });
    Mousetrap.bindGlobal("ctrl+a", function (e) {
        // Annotate
        e.preventDefault();
        _this.player.trigger("CreateAnnotation.toggle");
        return false;
    });
};
