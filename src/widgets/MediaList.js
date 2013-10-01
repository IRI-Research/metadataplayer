IriSP.Widgets.MediaList = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastMedia = false;
};

IriSP.Widgets.MediaList.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.MediaList.prototype.messages = {
    "fr": {
        now_playing: "Vidéo en cours",
        all_media: "Toutes les vidéos",
        other_media: "Autres vidéos"
    },
    "en": {
        now_playing: "Now playing",
        all_media: "All videos",
        other_media: "Other videos"
    }
};

IriSP.Widgets.MediaList.prototype.defaults = {
    default_thumbnail : "http://ldt.iri.centrepompidou.fr/static/site/ldt/css/imgs/video_sequence.png",
    media_url_template : "http://ldt.iri.centrepompidou.fr/ldtplatform/ldt/front/player/{{media}}/",
    default_color : "#000080"
};

IriSP.Widgets.MediaList.prototype.template =
    '<div class="Ldt-MediaList-NowPlaying"><h2>{{l10n.now_playing}}</h2><hr />'
    + '<div class="Ldt-MediaList-NowContainer">'
    + '<div class="Ldt-MediaList-Now-ThumbContainer"><a href="" target="_blank">'
    + '<img class="Ldt-MediaList-Now-Thumbnail" src="" /></a></div>'
    + '<h3 class="Ldt-MediaList-Now-Title"><a href="" target="_blank"></a></h3>'
    + '<p class="Ldt-MediaList-Now-Description"></p><div class="Ldt-MediaList-Now-MediaView"></div></div></div>'
    + '<div class="Ldt-MediaList-Other"><h2></h2><hr /><ul class="Ldt-MediaList-OtherList"></ul></div>';

IriSP.Widgets.MediaList.prototype.mediaViewTemplate =
    '<div class="Ldt-MediaList-MediaView-Background"></div>{{#segments}}<div class="Ldt-MediaList-Segment" style="background: {{color}}; left: {{left}}px; width: {{width}}px;"></div>{{/segments}}';

IriSP.Widgets.MediaList.prototype.mediaTemplate =
    '<li class="Ldt-MediaList-OtherList-li"><div class="Ldt-MediaList-Other-ThumbContainer"><a href="{{url}}" target="_blank">'
    + '<img class="Ldt-MediaList-Other-Thumbnail" src="{{thumbnail}}" /></a></div>'
    + '<h3 class="Ldt-MediaList-Other-Title"><a href="{{url}}" target="_blank">{{title}}</a></h3>'
    + '<p class="Ldt-MediaList-Other-Description">{{description}}</p><div class="Ldt-MediaList-Other-MediaView">'
    + IriSP.Widgets.MediaList.prototype.mediaViewTemplate + '</div></li>';


IriSP.Widgets.MediaList.prototype.onSearch = function(searchString) {
    this.searchString = typeof searchString !== "undefined" ? searchString : '';
    var _n = this.refresh(true);
    if (this.searchString) {
        if (_n) {
            this.player.trigger("search.matchFound");
        } else {
            this.player.trigger("search.noMatchFound");
        }
    }
};

IriSP.Widgets.MediaList.prototype.draw = function() {
    this.$.addClass("Ldt-MediaListWidget")
    this.renderTemplate();
    var _this = this;
    if (typeof this.media.getMedias === "function") {
        this.media.on("enter-annotation", function(_a) {
            _this.redraw(_a.getMedia());
        });
    }
    this.redraw();
};

IriSP.Widgets.MediaList.prototype.getSegments = function(_media) {
    var _this = this,
        _scale = this.$.width()/_media.duration.milliseconds;
    return this.getWidgetAnnotations()
        .filter(function(_annotation) {
            return _annotation.getMedia().id == _media.id;
        })
        .map(function(_a) {
            var _annotation = ( _a.type = "mashedAnnotation" ? _a.annotation : _a );
            return {
                left: _scale * _annotation.begin,
                width: _scale * (_annotation.end - _annotation.begin),
                color: ( typeof _annotation.color !== "undefined" && _annotation.color ? _annotation.color : _this.default_color )
            };
        });
};

IriSP.Widgets.MediaList.prototype.redraw = function(_media) {
    if (typeof _media !== "undefined") {
        this.$.find('.Ldt-MediaList-Other h2').html(this.l10n.other_media);
        this.$.find('.Ldt-MediaList-NowPlaying').show();
        this.$.find('.Ldt-MediaList-Now-Thumbnail').attr("src", _media.thumbnail || this.default_thumbnail);
        this.$.find('.Ldt-MediaList-Now-Title a').html(_media.title);
        this.$.find('.Ldt-MediaList-Now-Description').html(_media.description);
        var _url = _media.url || Mustache.to_html(
                this.media_url_template, {
                    media: _media.id
                });
        this.$.find('.Ldt-MediaList-NowContainer a').attr("href", _url);
        var _mediaView = Mustache.to_html( this.mediaViewTemplate, {
            segments: this.getSegments(_media)
        });
        this.$.find('.Ldt-MediaList-Now-MediaView').html(_mediaView);
    } else {
        this.$.find('.Ldt-MediaList-Other h2').html(this.l10n.all_media);
        this.$.find('.Ldt-MediaList-NowPlaying').hide();
    }
    var _this = this,
        _otherlist = this.source.getMedias().filter(function(_m) {
            return (_m.id !== _this.lastMedia)
        });
    if (_otherlist.length) {
        this.$.find('.Ldt-MediaList-Other').show();
        var _html = _otherlist.map(function(_media) {
            return Mustache.to_html(_this.mediaTemplate, {
                thumbnail: _media.thumbnail || _this.default_thumbnail,
                url: _media.url || Mustache.to_html(
                    _this.media_url_template, {
                        media: _media.id
                    }),
                title: _media.title,
                description: _media.description,
                segments: _this.getSegments(_media)
            });
        }).join("");
        this.$.find('.Ldt-MediaList-OtherList').html(_html);
    } else {
        this.$.find('.Ldt-MediaList-Other').hide();
    }
};
