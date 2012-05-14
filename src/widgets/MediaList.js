IriSP.Widgets.MediaList = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastMedia = false;
};

IriSP.Widgets.MediaList.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.MediaList.prototype.messages = {
    "fr": {
        now_playing: "Média en cours",
        all_media: "Tous les medias",
        other_media: "Autres médias"
    },
    "en": {
        now_playing: "Now playing",
        all_media: "All media",
        other_media: "Other media"
    }
}

IriSP.Widgets.MediaList.prototype.defaults = {
    annotation_type: false,
    default_thumbnail : "http://ldt.iri.centrepompidou.fr/static/site/ldt/css/imgs/video_sequence.png",
    media_url_template : "http://ldt.iri.centrepompidou.fr/ldtplatform/ldt/front/player/{{media}}/"
};

IriSP.Widgets.MediaList.prototype.template =
    '<div class="Ldt-MediaList-NowPlaying"><h2>{{l10n.now_playing}}</h2><hr />'
    + '<div class="Ldt-MediaList-NowContainer">'
    + '<div class="Ldt-MediaList-Now-ThumbContainer"><a href="" target="_blank">'
    + '<img class="Ldt-MediaList-Now-Thumbnail" src="" /></a></div>'
    + '<h3 class="Ldt-MediaList-Now-Title"><a href="" target="_blank"></a></h3>'
    + '<p class="Ldt-MediaList-Now-Description"></p></div>'
    + '<div class="Ldt-MediaList-Other"><h2></h2><hr /><ul class="Ldt-MediaList-OtherList"></ul></div></div>';

IriSP.Widgets.MediaList.prototype.mediaTemplate =
    '<li class="Ldt-MediaList-OtherList-li"><div class="Ldt-MediaList-Other-ThumbContainer"><a href="{{url}}" target="_blank">'
    + '<img class="Ldt-MediaList-Other-Thumbnail" src="{{thumbnail}}" /></a></div>'
    + '<h3 class="Ldt-MediaList-Other-Title"><a href="{{url}}" target="_blank">{{title}}</a></h3>'
    + '<p class="Ldt-MediaList-Other-Description">{{description}}</p></li>'

IriSP.Widgets.MediaList.prototype.onSearch = function(searchString) {
    this.searchString = typeof searchString !== "undefined" ? searchString : '';
    var _n = this.refresh(true);
    if (this.searchString) {
        if (_n) {
            this.player.popcorn.trigger("IriSP.search.matchFound");
        } else {
            this.player.popcorn.trigger("IriSP.search.noMatchFound");
        }
    }
}

IriSP.Widgets.MediaList.prototype.draw = function() {
    this.bindPopcorn("timeupdate","onTimeupdate");
    this.$.addClass("Ldt-MediaListWidget")
    this.renderTemplate();
    this.redraw();
};

IriSP.Widgets.MediaList.prototype.redraw = function() {
    var _media = this.lastMedia ? this.source.getElement(this.lastMedia) : undefined;
    if (typeof _media !== "undefined") {
        this.$.find('.Ldt-MediaList-Other h2').html(this.l10n.other_media);
        this.$.find('.Ldt-MediaList-NowPlaying').show();
        this.$.find('.Ldt-MediaList-Now-Thumbnail').attr("src", _media.thumbnail || this.default_thumbnail);
        this.$.find('.Ldt-MediaList-Now-Title a').html(_media.title);
        this.$.find('.Ldt-MediaList-Now-Description').html(_media.description);
        var _url = _media.url || Mustache.to_html(
                this.media_url_template, {
                    media: _media.namespacedId.name
                });
        this.$.find('.Ldt-MediaList-NowContainer a').attr("href", _url);
    } else {
        this.$.find('.Ldt-MediaList-Other h2').html(this.l10n.all_media);
        this.$.find('.Ldt-MediaList-NowPlaying').hide();
    }
    var _this = this,
        _otherlist = this.source.getMedias().filter(function(_media) {
            return (_media.id !== _this.lastMedia)
        });
    if (_otherlist.length) {
        this.$.find('.Ldt-MediaList-Other').show();
        var _html = _otherlist.map(function(_media) {
            return Mustache.to_html(_this.mediaTemplate, {
                thumbnail: _media.thumbnail || _this.default_thumbnail,
                url: _media.url || Mustache.to_html(
                    _this.media_url_template, {
                        media: _media.namespacedId.name
                    }),
                title: _media.title,
                description: _media.description
            })
        }).join("");
        this.$.find('.Ldt-MediaList-OtherList').html(_html);
    } else {
        this.$.find('.Ldt-MediaList-Other').hide();
    }
};

IriSP.Widgets.MediaList.prototype.onTimeupdate = function() {
    var _time = Math.floor(this.player.popcorn.currentTime() * 1000),
        _list = this.getWidgetAnnotations().filter(function(_annotation) {
            return _annotation.begin <= _time && _annotation.end > _time;
        });
    if (_list.length) {
        var _media = _list[0].getMedia();
        if (_media.id !== this.lastMedia) {
            this.lastMedia = _media.id;
            this.redraw();
        }
    }
}
