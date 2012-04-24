// TODO: Open share links in a small window

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
        tags: "Mots-clés&nbsp;:"
    },
    "en": {
        share_on: "Share on",
        watching: "I'm watching ",
        on_site: " on ",
        tags: "Keywords:"
    }
}

IriSP.Widgets.Annotation.prototype.template =
    '<div class="Ldt-Annotation-Widget {{#show_top_border}}Ldt-Annotation-ShowTop{{/show_top_border}}">'
    + '<div class="Ldt-Annotation-Inner"></div></div>';

IriSP.Widgets.Annotation.prototype.defaults = {
    annotation_type : "chap",
    show_top_border : false,
    site_name : "Lignes de Temps"
}

IriSP.Widgets.Annotation.prototype.draw = function() {
    this.renderTemplate();
    this.bindPopcorn("timeupdate","onTimeupdate");
    this.onTimeupdate();
}

IriSP.Widgets.Annotation.prototype.onTimeupdate = function() {
    var _time = Math.floor(this.player.popcorn.currentTime() * 1000),
        _list = this.getWidgetAnnotations().filter(function(_annotation) {
            return _annotation.begin <= _time && _annotation.end > _time;
        });
    if (_list.length) {
        if (_list[0].id !== this.lastAnnotation) {
            this.drawAnnotation(_list[0]);
        }
    }
    else {
        this.$.find('.Ldt-Annotation-Inner').html('');
    }
}

IriSP.Widgets.Annotation.prototype.drawAnnotation = function(_annotation) {
    this.lastAnnotation = _annotation.id;
    console.log(_annotation);
    var _url = (typeof _annotation.url !== "undefined" 
            ? _annotation.url
            : (document.location.href.replace(/#.*$/,'') + '#id='  + _annotation.namespacedId.name)),
        _text = this.l10n.watching + _annotation.title + (this.site_name ? this.l10n.on_site + this.site_name : ''),
        _tmpl = '<div class="Ldt-Annotation-ShareIcons">'
            + '<a href="{{fb_url}}" target="_blank" class="Ldt-Annotation-Share Ldt-Annotation-Fb" title="{{l10n.share_on}} Facebook"></a>'
            + '<a href="{{twitter_url}}" target="_blank" class="Ldt-Annotation-Share Ldt-Annotation-Twitter" title="{{l10n.share_on}} Twitter"></a>'
            + '<a href="{{gplus_url}}" target="_blank" class="Ldt-Annotation-Share Ldt-Annotation-Gplus" title="{{l10n.share_on}} Google+"></a>'
            + '</div>'
            + '<h3><span class="Ldt-Annotation-Title">{{title}}</span> ( <span class="Ldt-Annotation-Time">{{begin}} - {{end}}</span> )</h3>'
            + '<p class="Ldt-Annotation-Description">{{description}}</p>'
            + '{{#tags.length}}<ul class="Ldt-Annotation-Tags"><li class="Ldt-Annotation-TagLabel">{{l10n.tags}}</li>{{#tags}}<li>{{.}}</li>{{/tags}}</ul>{{/tags.length}}',
        _attr = {
            title: _annotation.title,
            description: _annotation.description,
            begin: _annotation.begin.toString(),
            end: _annotation.end.toString(),
            tags: _annotation.getTagTexts(),
            l10n: this.l10n
        }
    _attr.fb_url = "http://www.facebook.com/share.php?" + IriSP.jQuery.param({ u: _url, t: _text });
    _attr.twitter_url = "https://twitter.com/intent/tweet?" + IriSP.jQuery.param({ url: _url, text: _text });
    _attr.gplus_url = "https://plusone.google.com/_/+1/confirm?" + IriSP.jQuery.param({ url: _url, title: _text });
    this.$.find('.Ldt-Annotation-Inner').html(Mustache.to_html(_tmpl, _attr));
}
