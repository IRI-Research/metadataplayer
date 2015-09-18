IriSP.Widgets.AutoPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.AutoPlayer.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.AutoPlayer.prototype.defaults = {
    default_type: "JwpPlayer"
};

IriSP.Widgets.AutoPlayer.prototype.draw = function() {
    
    if (typeof this.video === "undefined") {
        this.video = this.media.video;
    }
    
    var _props = [ "live", "provider", "autostart", "streamer", "video", "height", "width", "url_transform" ],
        _opts = {},
        _types = [
            {
                regexp: /^rtmp:\/\//,
                type: "JwpPlayer"
            },
            {
                regexp: /\.(mp4|m4v)$/,
                type: "AdaptivePlayer"
            },
            {
                regexp: /\.(ogg|ogv|webm)$/,
                type: "HtmlPlayer"
            },
            {
                regexp: /^(https?:\/\/)?(www\.)?youtube\.com/,
                type: "PopcornPlayer"
            },
            {
                regexp: /^(https?:\/\/)?(www\.)?vimeo\.com/,
                type: "PopcornPlayer"
            },
            {
                regexp: /^(https?:\/\/)?(www\.)?dailymotion\.com/,
                type: "DailymotionPlayer"
            }
        ],
        _rtmprgx = /^rtmp:\/\//;
    
    for (var i = 0; i < _types.length; i++) {
        if (_types[i].regexp.test(this.video)) {
            _opts.type =  _types[i].type;
            break;
        }
    }
    
    if (typeof _opts.type === "undefined") {
        _opts.type = this.default_type;
    }
    
    if (_opts.type === "AdaptivePlayer") {
        var _canPlayType = document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01E"');
        _opts.type = (_canPlayType !== "no") ? "HtmlPlayer" : "JwpPlayer";
    }
    
    if (_rtmprgx.test(this.video)) {
        _opts.provider = "rtmp";
        _opts.live = true;
    }
    
    for (var i = 0; i < _props.length; i++) {
        if (typeof this[_props[i]] !== "undefined") {
            _opts[_props[i]] = this[_props[i]];
        }
    }

    this.insertSubwidget(this.$, _opts);
    
};