IriSP.Widgets.DailymotionPlayer = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.DailymotionPlayer.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.DailymotionPlayer.prototype.defaults = {
    aspect_ratio: 14/9
};

IriSP.Widgets.DailymotionPlayer.prototype.draw = function() {

    if (typeof this.video === "undefined") {
        this.video = this.media.video;
    }

    this.height = this.height || Math.floor(this.width / this.aspect_ratio);

    var _media = this.media,
        videoid = null,
        _this = this,
        state = {
            pause: true,
            apiready: false,
            volume: 0,
            time: 0,
            duration: 0
        };

    var m = this.video.match(/www.dailymotion.com\/video\/(.+)/);
    if (m) {
        videoid = m[1];
    }

    var player_url = Mustache.to_html('{{ protocol }}//www.dailymotion.com/embed/video/{{ videoid }}', {
        protocol: document.location.protocol.search('http') == 0 ? document.location.protocol : 'http:',
        videoid: videoid
    });
    var params = {
        'api': 'postMessage',
        'chromeless': 1,
        'id': 'dm_player',
        'related': 0,
        'autoplay': 1
    };

    _this.$.html(Mustache.to_html('<iframe id="{{ id }}" src="{{ player_url }}?{{ params }}" width="{{ width }}" height="{{ height }}" frameborder="0"></iframe>', {
        player_url: player_url,
        params: Object.keys(params).reduce(function(a,k){a.push(k+'='+encodeURIComponent(params[k]));return a;},[]).join('&'),
        width: this.width,
        height: this.height,
        id: params.id
    }));

    function setup_media_methods () {
        var dest = _this.$.find("#" + params.id)[0].contentWindow;
        var execute = function(c, v) {
            if (v !== undefined)
                c = c + "=" + v;
            dest.postMessage(c, "*");
        };

        _media.getCurrentTime = function() {
            return state.time;
        };
        _media.getVolume = function() {
            return state.volume;
        };
        _media.getPaused = function() {
            return state.pause;
        };
        _media.getMuted = function() {
            return state.muted;
        };
        _media.setCurrentTime = function(_milliseconds) {
            execute("seek", _milliseconds / 1000);
        };
        _media.setVolume = function(_vol) {
            execute("volume", _vol * 100);
        };
        _media.mute = function() {
            execute("muted", 1);
        };
        _media.unmute = function() {
            execute("muted", 0);
        };
        _media.play = function() {
            execute("play");
        };
        _media.pause = function() {
            execute("pause");
        };
    };

    window.addEventListener("message", function (event) {
        // Parse event.data (query-string for to object)

        // Duck-checking if event.data is a string
        if (event.data.split === undefined)
            return;

        var info = event.data.split("&").map( function(s) { return s.split("="); }).reduce( function(o, v) { o[v[0]] = decodeURIComponent(v[1]); return o; }, {});

        switch (info.event) {
        case "apiready":
            state.apiready = true;
            setup_media_methods();
            break;
        //case "canplay":
        //    break;
        case "durationchange":
            if (info.duration.slice(-2) == "sc") {
                state.duration = 1000 * Number(info.duration.slice(0, -2));
                _media.setDuration(state.duration);
            }
            break;
        case "ended":
            state.pause = true;
            break;
        case "loadedmetadata":
            _media.trigger("loadedmetadata");
            break;
        case "pause":
            state.pause = true;
            _media.trigger("pause");
            break;
        case "play":
            state.pause = false;
            _media.trigger("play");
            break;
            //case "playing":
            //    break;
            //case "progress":
            //  Loading progress
            //    break;
        case "seeked":
            state.time = new IriSP.Model.Time(1000 * Number(info.time));
            _media.trigger("seeked");            
            break;
        case "timeupdate":
            state.time = new IriSP.Model.Time(1000 * Number(info.time));
            _media.trigger("timeupdate", state.time);
            break;
        case "volumechange":
            state.muted = (info.muted == "true");
            state.volume = Number(info.volume) / 100;
            break;
        }
    }, false);
};
