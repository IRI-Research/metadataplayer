// TODO: Open share links in a small window

IriSP.Widgets.Social = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
}

IriSP.Widgets.Social.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Social.prototype.defaults = {
    text: "",
    url: "",
    show_twitter: true,
    show_fb: true,
    show_gplus: true,
    show_mail: true
}

IriSP.Widgets.Social.prototype.template =
    '<span class="Ldt-Social">{{#show_fb}}<a href="#" target="_blank" class="Ldt-Social-Fb Ldt-TraceMe" title="{{l10n.share_on}} Facebook"></a>{{/show_fb}}'
    + '{{#show_twitter}}<a href="#" target="_blank" class="Ldt-Social-Twitter Ldt-TraceMe" title="{{l10n.share_on}} Twitter"></a>{{/show_twitter}}'
    + '{{#show_gplus}}<a href="#" target="_blank" class="Ldt-Social-Gplus Ldt-TraceMe" title="{{l10n.share_on}} Google+"></a>{{/show_gplus}}'
    + '{{#show_mail}}<a href="#" target="_blank" class="Ldt-Social-Mail Ldt-TraceMe" title="{{l10n.share_mail}}"></a>{{/show_mail}}</span>';

IriSP.Widgets.Social.prototype.messages = {
    "fr": {
        share_on: "Partager sur",
        share_mail: "Envoyer par courriel"
    },
    "en" : {
        share_on: "Share on",
        share_mail: "Share by e-mail"
    }
}

IriSP.Widgets.Social.prototype.draw = function() {
    this.renderTemplate();
    this.updateUrls(this.url, this.text);
}

IriSP.Widgets.Social.prototype.updateUrls = function(_url, _text) {
    this.$.find(".Ldt-Social-Fb").attr("href", "http://www.facebook.com/share.php?" + IriSP.jQuery.param({ u: _url, t: _text }));
    this.$.find(".Ldt-Social-Twitter").attr("href", "https://twitter.com/intent/tweet?" + IriSP.jQuery.param({ url: _url, text: _text }));
    this.$.find(".Ldt-Social-Gplus").attr("href", "https://plusone.google.com/_/+1/confirm?" + IriSP.jQuery.param({ url: _url, title: _text }));
    this.$.find(".Ldt-Social-Mail").attr("href", "mailto:?" + IriSP.jQuery.param({ subject: _text, body: _text + ": " + _url }));
}
