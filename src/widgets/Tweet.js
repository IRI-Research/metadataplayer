IriSP.Widgets.Tweet = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastAnnotation = false;
};

IriSP.Widgets.Tweet.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Tweet.prototype.defaults = {
    hide_timeout: 10000,
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
    annotation_type: "tweet",
    pin_at_start: false
};

IriSP.Widgets.Tweet.prototype.messages = {
    "fr": {
        retweet: "Retweeter",
        reply: "Répondre",
        keep_visible: "Empêcher la fermeture automatique",
        dont_keep_visible: "Permettre la fermeture automatique",
        close_widget: "Fermer l'affichage du tweet",
        original_time: "Heure d'envoi\u00a0: ",
        video_time: "Temps de la vidéo\u00a0: ",
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
};

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
    this.pinned = this.pin_at_start;
    var _this = this;
    this.$.find(".Ldt-Tweet-Pin").click(function() {
        _this.pinned = !_this.pinned;
        var _el = IriSP.jQuery(this);
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
    this.getWidgetAnnotations().forEach(function(_annotation) {
        _annotation.on("click", function() {
            _this.show(_annotation);
        });
    });
};

IriSP.Widgets.Tweet.prototype.show = function(_tweet) {
    if (typeof _tweet !== "undefined" && typeof _tweet.source !== "undefined") {
        var extend = [
            [
                /#(\w+)/gm,
                function(matches) {
                    return '<a href="http://twitter.com/search?q=%23' + matches[1] + '" target="_blank">';
                },
                '</a>'
            ]
        ];
        var _urls = IriSP._(_tweet.source.entities.urls).sortBy(function(_entity) {
            return _entity.indices[0];
        });
        
        var _currentPos = 0,
            _txt = '';
        IriSP._(_urls).each(function(_url) {
            if (_url.indices[0] >= _currentPos) {
                _txt += _tweet.source.text.substring(_currentPos, _url.indices[0]);
                _txt += (typeof _url.expanded_url !== "undefined" && _url.expanded_url !== null ? _url.expanded_url : _url.url);
                _currentPos = _url.indices[1];
            }
        });
        _txt += _tweet.source.text.substring(_currentPos);
        
        for (var _i = 0; _i < this.polemics.length; _i++) {
            var rx = IriSP.Model.regexpFromTextOrArray(this.polemics[_i].keywords);
            extend.push([
                rx,
                '<span style="background: ' + this.polemics[_i].color + '">',
                '</span>'
            ]);
        }
        var rx = (_tweet.found ? (_this.source.getAnnotations().regexp || false) : false),
            profile_url = _tweet.source.user ? _tweet.source.user.profile_image_url : _tweet.source.profile_image_url,
            screen_name = _tweet.source.user ? _tweet.source.user.screen_name :_tweet.source.from_user,
            user_name = _tweet.source.user ? _tweet.source.user.name :_tweet.source.from_user_name;
        this.$.find(".Ldt-Tweet-Avatar").attr("src", profile_url);
        this.$.find(".Ldt-Tweet-ScreenName").html('@' + screen_name);
        this.$.find(".Ldt-Tweet-ProfileLink").attr("href", "https://twitter.com/" + screen_name);
        this.$.find(".Ldt-Tweet-FullName").html(user_name);
        this.$.find(".Ldt-Tweet-Contents").html(IriSP.textFieldHtml(_txt, rx, extend));
        this.$.find(".Ldt-Tweet-Time").html(this.l10n.original_time + new Date(_tweet.source.created_at).toLocaleTimeString() + " / " + this.l10n.video_time + _tweet.begin.toString());
        this.$.find(".Ldt-Tweet-Retweet").attr("href", "https://twitter.com/intent/retweet?tweet_id=" + _tweet.source.id_str);
        this.$.find(".Ldt-Tweet-Reply").attr("href", "https://twitter.com/intent/tweet?in_reply_to=" + _tweet.source.id_str);
        this.$.find(".Ldt-Tweet-Original").attr("href", "https://twitter.com/" + screen_name + "/status/" + _tweet.source.id_str);
        this.player.trigger("Annotation.minimize");
        this.$.slideDown();
        this.cancelTimeout();
        if (!this.pinned) {
            this.hideTimeout();
        }
    } else {
        this.hide();
    }
};

IriSP.Widgets.Tweet.prototype.hide = function() {
    this.player.trigger("Annotation.maximize");
    this.$.slideUp();
    this.cancelTimeout();
};

IriSP.Widgets.Tweet.prototype.cancelTimeout = function() {
    if (typeof this.hide_timer !== "undefined") {
        window.clearTimeout(this.hide_timer);
        this.hide_timer = undefined;
    }  
};

IriSP.Widgets.Tweet.prototype.hideTimeout = function() {
    this.cancelTimeout();
    this.hide_timer = window.setTimeout(this.functionWrapper("hide"), this.hide_timeout);
};
