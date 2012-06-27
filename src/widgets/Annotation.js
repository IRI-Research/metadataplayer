// TODO: Open share links in a small window - Migrate Timeupdate functions to Extract

IriSP.Widgets.Annotation = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastAnnotation = false;
};

IriSP.Widgets.Annotation.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Annotation.prototype.messages = {
    "fr": {
        share_on: "Partager sur",
        watching: "Je regarde ",
        on_site: " sur ",
        tags: "Mots-clés&nbsp;:",
        excerpt_from: "Extrait de&nbsp;:"
    },
    "en": {
        share_on: "Share on",
        watching: "I'm watching ",
        on_site: " on ",
        tags: "Keywords:",
        excerpt_from: "Excerpt from:"
    }
}

IriSP.Widgets.Annotation.prototype.template =
    '<div class="Ldt-Annotation-Widget {{#show_top_border}}Ldt-Annotation-ShowTop{{/show_top_border}}">'
    + '<div class="Ldt-Annotation-Inner Ldt-Annotation-Empty"><div class="Ldt-Annotation-ShareIcons Ldt-Annotation-HiddenWhenMinimized Ldt-Annotation-HiddenWhenEmpty">'
    + '<a href="#" target="_blank" class="Ldt-Annotation-Share Ldt-Annotation-Fb Ldt-TraceMe" title="{{l10n.share_on}} Facebook"></a>'
    + '<a href="#" target="_blank" class="Ldt-Annotation-Share Ldt-Annotation-Twitter Ldt-TraceMe" title="{{l10n.share_on}} Twitter"></a>'
    + '<a href="#" target="_blank" class="Ldt-Annotation-Share Ldt-Annotation-Gplus Ldt-TraceMe" title="{{l10n.share_on}} Google+"></a>'
    + '</div><h3 class="Ldt-Annotation-HiddenWhenEmpty"><span class="Ldt-Annotation-Title"></span> <span class="Ldt-Annotation-Time">'
    + '( <span class="Ldt-Annotation-Begin"></span> - <span class="Ldt-Annotation-End"></span> )</span></h3>'
    + '<h3 class="Ldt-Annotation-MashupOrigin Ldt-Annotation-HiddenWhenEmpty">{{l10n.excerpt_from}} <span class="Ldt-Annotation-MashupMedia"></span> <span class="Ldt-Annotation-Time">'
    + '( <span class="Ldt-Annotation-MashupBegin"></span> - <span class="Ldt-Annotation-MashupEnd"></span> )</span></h3>'
    + '<p class="Ldt-Annotation-Description Ldt-Annotation-HiddenWhenMinimized Ldt-Annotation-HiddenWhenEmpty"></p>'
    + '<div class="Ldt-Annotation-Tags-Block Ldt-Annotation-HiddenWhenMinimized Ldt-Annotation-HiddenWhenEmpty Ldt-Annotation-NoTags"><div class="Ldt-Annotation-TagTitle">{{l10n.tags}}</div><ul class="Ldt-Annotation-Tags"></ul></div></div></div>';

IriSP.Widgets.Annotation.prototype.defaults = {
    annotation_type : "chap",
    show_top_border : false,
    site_name : "Lignes de Temps"
}

IriSP.Widgets.Annotation.prototype.draw = function() {
    this.renderTemplate();
    this.bindPopcorn("timeupdate","onTimeupdate");
    this.bindPopcorn("IriSP.Annotation.hide","hide");
    this.bindPopcorn("IriSP.Annotation.show","show");
    this.bindPopcorn("IriSP.Annotation.minimize","minimize");
    this.bindPopcorn("IriSP.Annotation.maximize","maximize");
    this.onTimeupdate();
}

IriSP.Widgets.Annotation.prototype.onTimeupdate = function() {
    var _time = Math.floor(this.player.popcorn.currentTime() * 1000),
        _list = this.getWidgetAnnotationsAtTime();
    if (_list.length) {
        if (_list[0].id !== this.lastAnnotation) {
            this.drawAnnotation(_list[0]);
            this.player.popcorn.trigger("IriSP.Annotation.boundsChanged",[ _list[0].begin.valueOf(), _list[0].end.valueOf() ]);
        }
        this.player.popcorn.trigger("IriSP.Arrow.updatePosition",{widget: this.type, time: ( _list[0].begin + _list[0].end ) / 2});
    }
    else {
        this.lastAnnotation = false;
        this.$.find(".Ldt-Annotation-Inner").addClass("Ldt-Annotation-Empty");
        this.player.popcorn.trigger("IriSP.Arrow.updatePosition",{widget: this.type, time: _time});
        this.player.popcorn.trigger("IriSP.Annotation.boundsChanged",[ _time, _time ]);
    }
}

IriSP.Widgets.Annotation.prototype.drawAnnotation = function(_annotation) {
    this.lastAnnotation = _annotation.id;
    var _url = (typeof _annotation.url !== "undefined" 
            ? _annotation.url
            : (document.location.href.replace(/#.*$/,'') + '#id='  + _annotation.id));
    var _text = this.l10n.watching + _annotation.title + (this.site_name ? this.l10n.on_site + this.site_name : '');
    var _tags = _annotation.getTagTexts();
    if (_tags.length) {
        var _html = IriSP._(_tags).map(function(_tag) {
            return '<li class="Ldt-Annotation-TagLabel"><span>' + _tag + '</span></li>';
        }).join("");
        this.$.find(".Ldt-Annotation-Tags").html(_html);
        this.$.find(".Ldt-Annotation-Tags-Block").removeClass("Ldt-Annotation-NoTags");
        
        /* Correct the empty tag bug */
        this.$.find('.Ldt-Annotation-TagLabel').each(function() {
            var _el = IriSP.jQuery(this);
            if (!_el.text().replace(/(^\s+|\s+$)/g,'')) {
                _el.detach();
            }
        });
    
        this.$.find('.Ldt-Annotation-TagLabel').click(function() {
            _this.player.popcorn.trigger("IriSP.search.triggeredSearch", IriSP.jQuery(this).text().replace(/(^\s+|\s+$)/g,''));
        });
    } else {
        this.$.find(".Ldt-Annotation-Tags-Block").addClass("Ldt-Annotation-NoTags");
    }
    this.$.find(".Ldt-Annotation-Title").html(_annotation.title);
    this.$.find(".Ldt-Annotation-Description").html(_annotation.description);
    this.$.find(".Ldt-Annotation-Begin").html(_annotation.begin.toString());
    this.$.find(".Ldt-Annotation-End").html(_annotation.end.toString());
    if (_annotation.elementType === "mashedAnnotation") {
        this.$.find('.Ldt-Annotation-Inner').addClass("Ldt-Annotation-isMashup");
        this.$.find(".Ldt-Annotation-MashupMedia").html(_annotation.getMedia().title);
        this.$.find(".Ldt-Annotation-MashupBegin").html(_annotation.annotation.begin.toString());
        this.$.find(".Ldt-Annotation-MashupEnd").html(_annotation.annotation.end.toString());
    } else {
        this.$.find('.Ldt-Annotation-Inner').removeClass("Ldt-Annotation-isMashup");
    }
    this.$.find(".Ldt-Annotation-Fb").attr("href", "http://www.facebook.com/share.php?" + IriSP.jQuery.param({ u: _url, t: _text }));
    this.$.find(".Ldt-Annotation-Twitter").attr("href", "https://twitter.com/intent/tweet?" + IriSP.jQuery.param({ url: _url, text: _text }));
    this.$.find(".Ldt-Annotation-Gplus").attr("href", "https://plusone.google.com/_/+1/confirm?" + IriSP.jQuery.param({ url: _url, title: _text }));
    this.$.find(".Ldt-Annotation-Inner").removeClass("Ldt-Annotation-Empty");
}

IriSP.Widgets.Annotation.prototype.hide = function() {
    this.$.slideUp();
}

IriSP.Widgets.Annotation.prototype.show = function() {
    this.$.slideDown();
}

IriSP.Widgets.Annotation.prototype.minimize = function() {
    this.$.find('.Ldt-Annotation-Inner').addClass("Ldt-Annotation-Minimized");
}

IriSP.Widgets.Annotation.prototype.maximize = function() {
    this.$.find('.Ldt-Annotation-Inner').removeClass("Ldt-Annotation-Minimized");
}