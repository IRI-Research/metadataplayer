IriSP.Widgets.H264Player = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.H264Player.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.H264Player.prototype.defaults = {
    mime_type: "video/mp4",
    normal_player: "PopcornPlayer",
    fallback_player: "JwpPlayer"
}

IriSP.Widgets.H264Player.prototype.draw = function() {
    
    if (typeof this.video === "undefined") {
        this.video = this.media.video;
    }
    
    var _props = [ "autostart", "video", "height", "width", "url_transform" ],
        _opts = {},
        _canPlayType = document.createElement('video').canPlayType(this.mime_type);
    
    _opts.type = (_canPlayType == "maybe" || _canPlayType == "probably") ? this.normal_player : this.fallback_player;
    
    for (var i = 0; i < _props.length; i++) {
        if (typeof this[_props[i]] !== "undefined") {
            _opts[_props[i]] = this[_props[i]];
        }
    }

    this.insertSubwidget(this.$, _opts);
    
}