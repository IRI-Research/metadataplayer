IriSP.Widgets.Tweet = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastAnnotation = false;
};

IriSP.Widgets.Tweet.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Tweet.prototype.defaults = {
    hide_timeout: 5000,
    polemics : [
        {
            "keywords" : [ "++" ],
            "color" : "#30d765"
        },
        {
            "keywords" : [ "--" ],
            "color" : "#f51123"
        },
        {
            "keywords" : [ "==" ],
            "color" : "#f1e24a"  
        },
        {
            "keywords" : [ "??" ],
            "color" : "#05aae6"
        }
    ],
    pin_at_start: false
}

IriSP.Widgets.Tweet.prototype.messages = {
    "fr": {
        retweet: "Retweeter",
        reply: "Répondre",
        keep_visible: "Garder visible",
        dont_keep_visible: "Permettre la fermeture automatique",
        close_widget: "Fermer l'affichage du tweet",
        original_time: "Heure d'envoi&nbsp;: ",
        video_time: "Temps de la vidéo&nbsp;: ",
        show_original: "Voir l'original"
    },
    "en": {
        retweet: "Retweet",
        reply: "Reply",
        keep_visible: "Keep visible",
        dont_keep_visible: "Don't keep visible",
        close_widget: "Close tweet display",
        original_time: "Tweet sent at: ",
        video_time: "Video time: ",
        show_original: "Show original"
    }
}

IriSP.Widgets.Tweet.prototype.template =
    '<div class="Ldt-Tweet-Widget"><div class="Ldt-Tweet-Inner"><div class="Ldt-Tweet-PinClose-Buttons">'
    + '<a href="#" class="Ldt-Tweet-Pin Ldt-TraceMe{{#pin_at_start}} active" title="{{l10n.dont_keep_visible}}{{/pin_at_start}}{{^pin_at_start}}" title="{{l10n.keep_visible}}{{/pin_at_start}}"></a>'
    + '<a href="#" class="Ldt-Tweet-Close Ldt-TraceMe" title="{{l10n.close_widget}}"></a>'
    + '</div><div class="Ldt-Tweet-AvatarContainer"><a href="#" class="Ldt-Tweet-ProfileLink" target="_blank">'
    + '<img src="" class="Ldt-Tweet-Avatar"/></a></div><h3><a href="#" class="Ldt-Tweet-ProfileLink Ldt-Tweet-ScreenName" target="_blank">'
    + '</a> (<span class="Ldt-Tweet-FullName"></span>)</h3><p class="Ldt-Tweet-Contents"></p><div class="Ldt-Tweet-Bottom">'
    + '<span class="Ldt-Tweet-Time"></span>'
    + '<a class="Ldt-Tweet-Original" href="" target="_blank">{{l10n.show_original}}</a>'
    + '<a href="" target="_blank" class="Ldt-Tweet-Retweet"><div class="Ldt-Tweet-Icon"></div>{{l10n.retweet}}</a>'
    + '<a href="" target="_blank" class="Ldt-Tweet-Reply"><div class="Ldt-Tweet-Icon"></div>{{l10n.reply}}</a></div></div></div>';
    

IriSP.Widgets.Tweet.prototype.draw = function() {
    this.renderTemplate();
    this.onMdpEvent("Tweet.show","show");
    this.pinned = this.pin_at_start;
    var _this = this;
    this.$.find(".Ldt-Tweet-Pin").click(function() {
        _this.pinned = !_this.pinned;
        var _el = IriSP.jQuery(this)
        if (_this.pinned) {
            _el.addClass("active").attr("title",_this.l10n.dont_keep_visible);
            _this.cancelTimeout();
        } else {
            _el.removeClass("active").attr("title",_this.l10n.keep_visible);
            _this.hideTimeout();
        }
    });
    this.$.find(".Ldt-Tweet-Close").click(function() {
        _this.hide();
    });
    this.$.hide();
}

IriSP.Widgets.Tweet.prototype.show = function(_id) {
    var _tweet = this.source.getElement(_id);
    if (typeof _tweet !== "undefined" && typeof _tweet.source !== "undefined") {
        var _entities = [];
        for (var _i = 0; _i < _tweet.source.entities.hashtags.length; _i++) {
            var _hash = _tweet.source.entities.hashtags[_i];
            _entities.push({
                is_link: true,
                text: '#' + _hash.text,
                url: 'http://twitter.com/search?q=%23' + encodeURIComponent(_hash.text),
                indices: _hash.indices
            });
        }
        for (var _i = 0; _i < _tweet.source.entities.urls.length; _i++) {
            var _url = _tweet.source.entities.urls[_i],
                _displayurl = (typeof _url.display_url !== "undefined" && _url.display_url !== null ? _url.display_url : _url.url),
                _linkurl = (typeof _url.expanded_url !== "undefined" && _url.expanded_url !== null ? _url.expanded_url : _url.url);
            _displayurl = _displayurl.replace(/^\w+:\/\//,'');
            if (!/^\w+:\/\//.test(_linkurl)) {
                _linkurl = 'http://' + _linkurl;
            }
            _entities.push({
                is_link: true,
                text: _displayurl,
                url: _linkurl,
                indices: _url.indices
            });
        }
        for (var _i = 0; _i < _tweet.source.entities.user_mentions.length; _i++) {
            var _user = _tweet.source.entities.user_mentions[_i];
            _entities.push({
                is_link: true,
                text: '@' + _user.screen_name,
                url: 'http://twitter.com/' + encodeURIComponent(_user.screen_name),
                indices: _user.indices
            });
        }
        for (var _i = 0; _i < this.polemics.length; _i++) {
            for (var _j = 0; _j < this.polemics[_i].keywords.length; _j++) {
                var _p = _tweet.source.text.indexOf(this.polemics[_i].keywords[_j]);
                while (_p !== -1) {
                    var _end = (_p + this.polemics[_i].keywords[_j].length);
                    _entities.push({
                        is_link: false,
                        text: this.polemics[_i].keywords[_j],
                        color: this.polemics[_i].color,
                        indices: [_p, _end]
                    });
                    _p = _tweet.source.text.indexOf(this.polemics[_i].keywords[_j], _end);
                }
            }
        }
        _entities = IriSP._(_entities).sortBy(function(_entity) {
            return _entity.indices[0];
        });
        var _currentPos = 0,
            _txt = '';
        for (var _i = 0; _i < _entities.length; _i++) {
            if (_entities[_i].indices[0] >= _currentPos) {
                _txt += _tweet.source.text.substring(_currentPos, _entities[_i].indices[0]);
                _currentPos = _entities[_i].indices[1];
                if (_entities[_i].is_link) {
                    _txt += '<a href="' + _entities[_i].url + '" target="_blank">';
                } else {
                    _txt += '<span style="background:' + _entities[_i].color + '">';
                }
                _txt += _entities[_i].text;
                if (_entities[_i].is_link) {
                    _txt += '</a>';
                } else {
                    _txt += '</span>';
                }
            }
        }
        _txt += _tweet.source.text.substring(_currentPos);
        this.$.find(".Ldt-Tweet-Avatar").attr("src",_tweet.source.user.profile_image_url);
        this.$.find(".Ldt-Tweet-ScreenName").html('@'+_tweet.source.user.screen_name);
        this.$.find(".Ldt-Tweet-ProfileLink").attr("href", "https://twitter.com/" + _tweet.source.user.screen_name);
        this.$.find(".Ldt-Tweet-FullName").html(_tweet.source.user.name);
        this.$.find(".Ldt-Tweet-Contents").html(_txt);
        this.$.find(".Ldt-Tweet-Time").html(this.l10n.original_time + new Date(_tweet.source.created_at).toLocaleTimeString() + " / " + this.l10n.video_time + _tweet.begin.toString());
        this.$.find(".Ldt-Tweet-Retweet").attr("href", "https://twitter.com/intent/retweet?tweet_id=" + _tweet.source.id_str);
        this.$.find(".Ldt-Tweet-Reply").attr("href", "https://twitter.com/intent/tweet?in_reply_to=" + _tweet.source.id_str);
        this.$.find(".Ldt-Tweet-Original").attr("href", "https://twitter.com/" + _tweet.source.user.screen_name + "/status/" + _tweet.source.id_str);
        this.player.trigger("Annotation.minimize");
        this.$.slideDown();
        this.cancelTimeout();
        if (!this.pinned) {
            this.hideTimeout();
        }
    } else {
        this.hide();
    }
}

IriSP.Widgets.Tweet.prototype.hide = function() {
    this.player.trigger("Annotation.maximize");
    this.$.slideUp();
    this.cancelTimeout();
}

IriSP.Widgets.Tweet.prototype.cancelTimeout = function() {
    if (typeof this.hide_timer !== "undefined") {
        window.clearTimeout(this.hide_timer);
        this.hide_timer = undefined;
    }  
}

IriSP.Widgets.Tweet.prototype.hideTimeout = function() {
    this.cancelTimeout();
    this.hide_timer = window.setTimeout(this.functionWrapper("hide"), this.hide_timeout);
}
