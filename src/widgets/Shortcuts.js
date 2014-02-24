IriSP.Widgets.Shortcuts = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Shortcuts.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Shortcuts.prototype.defaults =  {
    // Time increment, in ms, for backward/forward navigation
    time_increment: 2000
}

IriSP.Widgets.Shortcuts.prototype.draw = function() {
    var  _this = this;
    
    /* Standard shortcuts */
    Mousetrap.bindGlobal(["esc", "ctrl+d"], function (e) {
        e.preventDefault();
        if (_this.media.getPaused())
            _this.media.play();
        else
            _this.media.pause();
        return false;
    });
    Mousetrap.bindGlobal("ctrl+s", function (e) {
        // Backward
        e.preventDefault();
        _this.media.setCurrentTime(Math.max(0, _this.media.getCurrentTime() - time_increment));
        return false;
    });
    Mousetrap.bindGlobal("ctrl+f", function (e) {
        // Forward
        e.preventDefault();
        _this.media.setCurrentTime(Math.min(_this.media.duration, _this.media.getCurrentTime() + time_increment));
        return false;
    });

};
