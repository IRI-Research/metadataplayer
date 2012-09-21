// TODO: Migrate Timeupdate functions to Extract

IriSP.Widgets.Annotation = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastAnnotation = false;
    this.minimized = this.start_minimized || false;
    this.bounds = [ 0, 0 ];
};

IriSP.Widgets.Annotation.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Annotation.prototype.messages = {
    fr: {
        watching: "Je regarde ",
        on_site: " sur ",
        tags_: "Mots-clés&nbsp;:",
        description_: "Description&nbsp;:",
        excerpt_from: "Extrait de&nbsp;:"
    },
    en: {
        watching: "I'm watching ",
        on_site: " on ",
        tags_: "Keywords:",
        description_: "Description:",
        excerpt_from: "Excerpt from:"
    }
}

IriSP.Widgets.Annotation.prototype.template =
    '<div class="Ldt-Annotation-Widget {{#show_top_border}}Ldt-Annotation-ShowTop{{/show_top_border}}">'
    + '<div class="Ldt-Annotation-Inner Ldt-Annotation-Empty{{#start_minimized}} Ldt-Annotation-Minimized{{/start_minimized}}">'
    + '<div class="Ldt-Annotation-HiddenWhenEmpty Ldt-Annotation-MaxMinButton"></div>'
    + '<div class="Ldt-Annotation-Social Ldt-Annotation-HiddenWhenMinimized Ldt-Annotation-HiddenWhenEmpty"></div>'
    + '<h3 class="Ldt-Annotation-HiddenWhenEmpty"><span class="Ldt-Annotation-Title"></span> <span class="Ldt-Annotation-Time">'
    + '( <span class="Ldt-Annotation-Begin"></span> - <span class="Ldt-Annotation-End"></span> )</span></h3>'
    + '<h3 class="Ldt-Annotation-MashupOrigin Ldt-Annotation-HiddenWhenEmpty">{{l10n.excerpt_from}} <span class="Ldt-Annotation-MashupMedia"></span> <span class="Ldt-Annotation-Time">'
    + '( <span class="Ldt-Annotation-MashupBegin"></span> - <span class="Ldt-Annotation-MashupEnd"></span> )</span></h3>'
    + '<div class="Ldt-Annotation-Cleared Ldt-Annotation-HiddenWhenMinimized Ldt-Annotation-HiddenWhenEmpty Ldt-Annotation-Description-Block"><div class="Ldt-Annotation-Label">{{l10n.description_}}</div>'
    + '<p class="Ldt-Annotation-Labelled Ldt-Annotation-Description"></p></div>'
    + '<div class="Ldt-Annotation-Tags-Block Ldt-Annotation-HiddenWhenMinimized Ldt-Annotation-HiddenWhenEmpty Ldt-Annotation-Cleared">'
    + '<div class="Ldt-Annotation-Label">{{l10n.tags_}}</div><ul class="Ldt-Annotation-Labelled Ldt-Annotation-Tags"></ul>'
    + '</div></div></div></div>';

IriSP.Widgets.Annotation.prototype.defaults = {
    annotation_type : "chap",
    start_minimized: true,
    show_top_border : false,
    site_name : "Lignes de Temps",
    search_on_tag_click: true
}

IriSP.Widgets.Annotation.prototype.draw = function() {
    this.renderTemplate();
    this.insertSubwidget(this.$.find(".Ldt-Annotation-Social"), { type: "Social" }, "socialWidget");
    this.onMediaEvent("timeupdate","onTimeupdate");
    this.onMdpEvent("Annotation.hide","hide");
    this.onMdpEvent("Annotation.show","show");
    this.onMdpEvent("Annotation.minimize","minimize");
    this.onMdpEvent("Annotation.maximize","maximize");
    this.onMdpEvent("Annotation.getBounds","sendBounds");
    this.$.find(".Ldt-Annotation-MaxMinButton").click(this.functionWrapper("toggleSize"));
    this.onTimeupdate();
}

IriSP.Widgets.Annotation.prototype.onTimeupdate = function(_time) {
    var _list = this.getWidgetAnnotationsAtTime();
    if (_list.length) {
        if (_list[0].id !== this.lastAnnotation) {
            this.drawAnnotation(_list[0]);
            this.bounds = [ _list[0].begin.valueOf(), _list[0].end.valueOf() ];
        }
        this.player.trigger("Arrow.updatePosition",{widget: this.type, time: ( _list[0].begin + _list[0].end ) / 2});
    }
    else {
        this.lastAnnotation = false;
        this.$.find(".Ldt-Annotation-Inner").addClass("Ldt-Annotation-Empty");
        this.player.trigger("Arrow.updatePosition",{widget: this.type, time: _time});
        this.bounds = [ _time, _time ];
    }
    this.sendBounds();
}

IriSP.Widgets.Annotation.prototype.sendBounds = function() {
    this.player.trigger("Annotation.boundsChanged",this.bounds);
}

IriSP.Widgets.Annotation.prototype.drawAnnotation = function(_annotation) {
    this.lastAnnotation = _annotation.id;
    var _url = (typeof _annotation.url !== "undefined" 
            ? _annotation.url
            : (document.location.href.replace(/#.*$/,'') + '#id='  + _annotation.id)),
        _text = this.l10n.watching + _annotation.title + (this.site_name ? this.l10n.on_site + this.site_name : ''),
        _tags = _annotation.getTags(),
        _tagblock = this.$.find(".Ldt-Annotation-Tags"),
        _this = this;
    _tagblock.empty();
    if (_tags.length) {
        this.$.find(".Ldt-Annotation-Tags-Block").removeClass("Ldt-Annotation-EmptyBlock");
        _tags.forEach(function(_tag) {
            var _trimmedTitle =  _tag.title.replace(/(^\s+|\s+$)/g,'');
            if (_trimmedTitle) {
                var _el = IriSP.jQuery('<li class="Ldt-Annotation-TagLabel"></li>').append(IriSP.jQuery('<span>').text(_trimmedTitle));
                _el.click(function() {
                    if (_this.search_on_tag_click) {
                        _this.player.trigger("search.triggeredSearch",_trimmedTitle);
                    }
                    _tag.trigger("click");
                });
                _tagblock.append(_el);
            }
        });
    } else {
        this.$.find(".Ldt-Annotation-Tags-Block").addClass("Ldt-Annotation-EmptyBlock");
    }
    this.$.find(".Ldt-Annotation-Title").html(_annotation.title);
    var _desc = _annotation.description.replace(/(^\s+|\s+$)/g,'');
    if (_desc) {
        this.$.find(".Ldt-Annotation-Description-Block").removeClass("Ldt-Annotation-EmptyBlock");
        this.$.find(".Ldt-Annotation-Description").html(_desc);
    } else {
        this.$.find(".Ldt-Annotation-Description-Block").addClass("Ldt-Annotation-EmptyBlock");
    }
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
    if (typeof this.socialWidget !== "undefined") {
        this.socialWidget.updateUrls(_url, _text);
    } else {
        setTimeout(function() {
            if (typeof _this.socialWidget !== "undefined") {
                _this.socialWidget.updateUrls(_url, _text);
            }
        },800);
    }
    this.$.find(".Ldt-Annotation-Inner").removeClass("Ldt-Annotation-Empty");
}

IriSP.Widgets.Annotation.prototype.hide = function() {
    this.$.slideUp();
}

IriSP.Widgets.Annotation.prototype.show = function() {
    this.$.slideDown();
}

IriSP.Widgets.Annotation.prototype.toggleSize = function() {
    if (this.minimized) {
        this.maximize();
    } else {
        this.minimize();
    }
}

IriSP.Widgets.Annotation.prototype.minimize = function() {
    this.minimized = true;
    this.$.find('.Ldt-Annotation-Inner').addClass("Ldt-Annotation-Minimized");
}

IriSP.Widgets.Annotation.prototype.maximize = function() {
    this.minimized = false;
    this.$.find('.Ldt-Annotation-Inner').removeClass("Ldt-Annotation-Minimized");
}