/* HTML player, to be reused in a widget, or elsewhere */

IriSP.htmlPlayer = function (media, jqselector, options) {

    var opts = options || {},
        videoURL = opts.video || media.video;

    if (typeof opts.url_transform === "function") {
        videoURL = opts.url_transform(videoURL);
    }

    var videoEl = IriSP.jQuery('<video>');

    videoEl.attr({
        width : opts.width || undefined,
        height : opts.height || undefined,
        controls : opts.controls || undefined,
        autoplay : opts.autostart || opts.autoplay || undefined,
        preload: "metadata"
    });

    if (typeof videoURL === "string") {
        videoEl.attr("src", videoURL);
    } else {
        for (var i = 0; i < videoURL.length; i++) {
            var _srcNode = IriSP.jQuery('<source>');
            _srcNode.attr({
                src: videoURL[i].src,
                type: videoURL[i].type
            });
            videoEl.append(_srcNode);
        }
    }
    if (opts.subtitle) {
        var _trackNode = IriSP.jQuery('<track>');
        _trackNode.attr({
            label: "Subtitles",
            kind: "subtitles",
            srclang: "fr",
            src: opts.subtitle,
            default: ""
        });
        videoEl.append(_trackNode);
    }
    jqselector.prepend(videoEl);

    var mediaEl = videoEl[0];

    // Binding HTML video functions to media events
    media.on("setcurrenttime", function (_milliseconds) {
        try {
            mediaEl.currentTime = (_milliseconds / 1000);
        } catch (err) {

        }
    });

    media.on("setvolume", function (_vol) {
        media.volume = _vol;
        try {
            mediaEl.volume = _vol;
        } catch (err) {

        }
    });

    media.on("setmuted", function (_muted) {
        media.muted = _muted;
        try {
            mediaEl.muted = _muted;
        } catch (err) {

        }
    });

    media.on("settimerange", function (_timeRange) {
        media.timeRange = _timeRange;
        try {
            if (media.getCurrentTime() > _timeRange[0] || media.getCurrentTime() < _timeRange) {
                mediaEl.currentTime = (_timeRange[0] / 1000);
            }
        } catch (err) {
        }
    });

    media.on("resettimerange", function () {
        media.timeRange = false;
    });

    media.on("setplay", function () {
        try {
            mediaEl.play();
        } catch (err) {

        }
    });

    media.on("setpause", function () {
        try {
            mediaEl.pause();
        } catch (err) {

        }
    });

    // Binding DOM events to media
    function getVolume() {
        media.muted = mediaEl.muted;
        media.volume = mediaEl.volume;
    }

    videoEl.on("loadedmetadata", function () {
        getVolume();
        media.trigger("loadedmetadata");
        media.trigger("volumechange");
    });

    videoEl.on("timeupdate", function () {
        media.trigger("timeupdate", new IriSP.Model.Time(1000 * mediaEl.currentTime));
    });

    videoEl.on("volumechange", function () {
        getVolume();
        media.trigger("volumechange");
    });

    videoEl.on("play", function () {
        media.trigger("play");
    });

    videoEl.on("pause", function () {
        media.trigger("pause");
    });

    videoEl.on("seeking", function () {
        media.trigger("seeking");
    });

    videoEl.on("seeked", function () {
        media.trigger("seeked");
    });

    videoEl.on("click", function () {
        if (mediaEl.paused) {
            media.play();
        } else {
            media.pause();
        };
    });
};
