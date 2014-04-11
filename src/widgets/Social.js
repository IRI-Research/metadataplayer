// TODO: Open share links in a small window

IriSP.Widgets.Social = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    ZeroClipboard.setMoviePath( IriSP.getLib('zeroClipboardSwf') );
};

IriSP.Widgets.Social.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Social.prototype.defaults = {
    text: "",
    url: "",
    show_url: true,
    show_twitter: true,
    show_fb: true,
    show_gplus: true,
    show_mail: true
};

IriSP.Widgets.Social.prototype.template =
    '<span class="Ldt-Social">{{#show_url}}<div class="Ldt-Social-Url-Container"><a href="#" draggable="true" target="_blank" class="Ldt-Social-Square Ldt-Social-Url Ldt-TraceMe" title="{{l10n.share_link}}">'
    + '</a><div class="Ldt-Social-UrlPop"><input class="Ldt-Social-Input"/><div class="Ldt-Social-CopyBtn">{{l10n.copy}}</div></div></div>{{/show_url}}'
    + '{{#show_fb}}<a href="#" target="_blank" class="Ldt-Social-Fb Ldt-Social-Ext Ldt-TraceMe" title="{{l10n.share_on}} Facebook"></a>{{/show_fb}}'
    + '{{#show_twitter}}<a href="#" target="_blank" class="Ldt-Social-Twitter Ldt-Social-Ext Ldt-TraceMe" title="{{l10n.share_on}} Twitter"></a>{{/show_twitter}}'
    + '{{#show_gplus}}<a href="#" target="_blank" class="Ldt-Social-Gplus Ldt-Social-Ext Ldt-TraceMe" title="{{l10n.share_on}} Google+"></a>{{/show_gplus}}'
    + '{{#show_mail}}<a href="#" target="_blank" class="Ldt-Social-Mail Ldt-TraceMe" title="{{l10n.share_mail}}"></a>{{/show_mail}}</span>';

IriSP.Widgets.Social.prototype.messages = {
    "fr": {
        share_on: "Partager sur",
        share_mail: "Envoyer par courriel",
        share_link: "Partager le lien hypertexte",
        copy: "Copier"
    },
    "en" : {
        share_on: "Share on",
        share_mail: "Share by e-mail",
        share_link: "Share hypertext link",
        copy: "Copy"
    }
};

IriSP.Widgets.Social.prototype.draw = function() {
    this.renderTemplate();
    this.clipId = IriSP._.uniqueId("Ldt-Social-CopyBtn-");
    this.$.find(".Ldt-Social-CopyBtn").attr("id", this.clipId);
    var _this = this;
    this.$.find(".Ldt-Social-Url").click(function() {
        _this.toggleCopy();
        return false;
    }).on("dragstart", function(e) {
    	e.originalEvent.dataTransfer.setData("text/x-iri-title",_this.text);
    	e.originalEvent.dataTransfer.setData("text/x-iri-uri",_this.url);
    });
    this.$.find(".Ldt-Social-Input").focus(function() {
        this.select();
    });
    this.$.find(".Ldt-Social-Ext").click(function() {
        window.open(
            IriSP.jQuery(this).attr("href"),
            "_blank",
            "height=300,width=450,left=100,top=100,toolbar=0,menubar=0,status=0,location=0");
        return false;
    });
    this.updateUrls(this.url, this.text);
};

IriSP.Widgets.Social.prototype.toggleCopy = function() {
    var _pop = this.$.find(".Ldt-Social-UrlPop");
    _pop.toggle();
    if (_pop.is(":visible")) {
        if (typeof this.clip == "undefined") {
            this.clip = new ZeroClipboard.Client();
            this.clip.setHandCursor( true );
            this.clip.glue(this.clipId);
            var _this = this;
            this.clip.addEventListener( 'onMouseUp', function() {
                _pop.hide();
                _this.clip.hide();
            });
        }
        this.clip.show();
        this.clip.setText( this.url );
        this.$.find(".Ldt-Social-Input").val(this.url).focus();
    } else {
        this.clip.hide();
    }
};

IriSP.Widgets.Social.prototype.updateUrls = function(_url, _text) {
    this.url = _url;
    this.text = _text;
    this.$.find(".Ldt-Social-Fb").attr("href", "http://www.facebook.com/share.php?" + IriSP.jQuery.param({ u: _url, t: _text }));
    this.$.find(".Ldt-Social-Twitter").attr("href", "https://twitter.com/intent/tweet?" + IriSP.jQuery.param({ url: _url, text: _text }));
    this.$.find(".Ldt-Social-Gplus").attr("href", "https://plus.google.com/share?" + IriSP.jQuery.param({ url: _url, title: _text }));
    this.$.find(".Ldt-Social-Mail").attr("href", "mailto:?" + IriSP.jQuery.param({ subject: _text, body: _text + ": " + _url }));
};
