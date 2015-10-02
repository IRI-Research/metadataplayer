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
        tags_: "Mots-clés\u00a0:",
        description_: "Description\u00a0:",
        creator_: "Créé par\u00a0:",
        excerpt_from: "Extrait de\u00a0:",
        untitled: "Segment sans titre"
    },
    en: {
        watching: "I'm watching ",
        on_site: " on ",
        tags_: "Keywords:",
        description_: "Description:",
        creator_: "Created by\u00a0:",
        excerpt_from: "Excerpt from:",
        untitled: "Untitled segment"
    }
};

IriSP.Widgets.Annotation.prototype.template =
    '{{#show_arrow}}<div class="Ldt-Annotation-Arrow"></div>{{/show_arrow}}'
    + '<div class="Ldt-Annotation-Widget {{^show_arrow}}Ldt-Annotation-ShowTop{{/show_arrow}}">'
    + '<div class="Ldt-Annotation-Inner Ldt-Annotation-Empty{{#start_minimized}} Ldt-Annotation-Minimized{{/start_minimized}}">'
    + '<div class="Ldt-Annotation-HiddenWhenEmpty Ldt-Annotation-MaxMinButton"></div>'
    + '{{#show_social}}<div class="Ldt-Annotation-Social Ldt-Annotation-HiddenWhenMinimized Ldt-Annotation-HiddenWhenEmpty"></div>{{/show_social}}'
    + '<h3 class="Ldt-Annotation-HiddenWhenEmpty">{{#show_annotation_type}}<span class="Ldt-Annotation-Type"></span> » {{/show_annotation_type}}<a class="Ldt-Annotation-Title" href="#"></a> <span class="Ldt-Annotation-Time Ldt-Annotation-HiddenWhenMinimized">'
    + '(<span class="Ldt-Annotation-Begin"></span> - <span class="Ldt-Annotation-End"></span>)</span></h3>'
    + '<h3 class="Ldt-Annotation-MashupOrigin Ldt-Annotation-HiddenWhenEmpty">{{l10n.excerpt_from}} <span class="Ldt-Annotation-MashupMedia"></span> <span class="Ldt-Annotation-Time Ldt-Annotation-HiddenWhenMinimized">'
    + '(<span class="Ldt-Annotation-MashupBegin"></span> - <span class="Ldt-Annotation-MashupEnd"></span>)</span></h3>'
    + '<div class="Ldt-Annotation-Cleared Ldt-Annotation-HiddenWhenMinimized Ldt-Annotation-HiddenWhenEmpty Ldt-Annotation-Creator-Block"><div class="Ldt-Annotation-Label">{{l10n.creator_}}</div>'
    + '{{#show_creator}}<p class="Ldt-Annotation-Labelled Ldt-Annotation-Creator"></p></div>{{/show_creator}}'
    + '{{#show_description}}<div class="Ldt-Annotation-Cleared Ldt-Annotation-HiddenWhenMinimized Ldt-Annotation-HiddenWhenEmpty Ldt-Annotation-Description-Block"><div class="Ldt-Annotation-Label">{{l10n.description_}}</div>'
    + '<p class="Ldt-Annotation-Labelled Ldt-Annotation-Description"></p></div>{{/show_description}}'
    + '<div class="Ldt-Annotation-Tags-Block Ldt-Annotation-HiddenWhenMinimized Ldt-Annotation-HiddenWhenEmpty Ldt-Annotation-Cleared">'
    + '<div class="Ldt-Annotation-Label">{{l10n.tags_}}</div><ul class="Ldt-Annotation-Labelled Ldt-Annotation-Tags"></ul>'
    + '</div></div></div></div>';

IriSP.Widgets.Annotation.prototype.defaults = {
    annotation_type : "chap",
    start_minimized: false,
    show_arrow : true,
    show_creator: true,
    show_description: true,
    arrow_position: .5,
    site_name : "Lignes de Temps",
    search_on_tag_click: true,
    show_social: true,
    show_annotation_type: false
};

IriSP.Widgets.Annotation.prototype.draw = function() {
    
    var _this = this,
        currentAnnotation;
    
    function timeupdate(_time) {
        var _list = _this.getWidgetAnnotationsAtTime();
        if (!_list.length) {
            _this.$.find(".Ldt-Annotation-Inner").addClass("Ldt-Annotation-Empty");
            if (_this.arrow) {
                _this.arrow.moveToTime(_time);
            }
            _this.bounds = [ _time, _time ];
            _this.sendBounds();
        }
    }
    
    function highlightTitleAndDescription() {
        if (!currentAnnotation) {
            return;
        }
        var title = currentAnnotation.title,
            description = currentAnnotation.description.replace(/(^\s+|\s+$)/g,''),
            rx = (currentAnnotation.found ? (_this.source.getAnnotations().regexp || false) : false);
        _this.$.find(".Ldt-Annotation-Title").html(IriSP.textFieldHtml(title,rx)  || "(" + _this.l10n.untitled + ")");
        if (description) {
            _this.$.find(".Ldt-Annotation-Description-Block").removeClass("Ldt-Annotation-EmptyBlock");
            _this.$.find(".Ldt-Annotation-Description").html(IriSP.textFieldHtml(description,rx));
        } else {
            _this.$.find(".Ldt-Annotation-Description-Block").addClass("Ldt-Annotation-EmptyBlock");
        }
    }
    
    function drawAnnotation(_annotation) {
        currentAnnotation = _annotation;
        var _url = (typeof _annotation.url !== "undefined" 
                ? _annotation.url
                : (document.location.href.replace(/#.*$/,'') + '#id='  + _annotation.id)),
            _text = _this.l10n.watching + _annotation.title + (_this.site_name ? _this.l10n.on_site + _this.site_name : ''),
            _tags = _annotation.getTags(),
            _tagblock = _this.$.find(".Ldt-Annotation-Tags");
        _tagblock.empty();
        if (_tags.length) {
            _this.$.find(".Ldt-Annotation-Tags-Block").removeClass("Ldt-Annotation-EmptyBlock");
            _tags.forEach(function(_tag) {
                var _trimmedTitle =  _tag.title.replace(/(^\s+|\s+$)/g,'');
                if (_trimmedTitle) {
                    var _el = IriSP.jQuery('<li class="Ldt-Annotation-TagLabel"></li>').append(IriSP.jQuery('<span>').text(_trimmedTitle));
                    _el.click(function() {
                        if (_this.search_on_tag_click) {
                            _this.source.getAnnotations().search(_trimmedTitle);
                        }
                        _tag.trigger("click");
                    });
                    _tagblock.append(_el);
                }
            });
        } else {
            _this.$.find(".Ldt-Annotation-Tags-Block").addClass("Ldt-Annotation-EmptyBlock");
        }
        highlightTitleAndDescription();
        if (_this.show_creator) {
             _this.$.find(".Ldt-Annotation-Creator").text(_annotation.creator);
        }
        if (_this.show_annotation_type) {
            _this.$.find(".Ldt-Annotation-Type").text(_annotation.getAnnotationType().title);
            _this.$.find(".Ldt-Annotation-Type").attr("title", _annotation.getAnnotationType().description);
        }
        _this.$.find(".Ldt-Annotation-Begin").text(_annotation.begin.toString());
        _this.$.find(".Ldt-Annotation-End").text(_annotation.end.toString());
        if (_annotation.elementType === "mashedAnnotation") {
            _this.$.find('.Ldt-Annotation-Inner').addClass("Ldt-Annotation-isMashup");
            _this.$.find(".Ldt-Annotation-MashupMedia").text(_annotation.getMedia().title);
            _this.$.find(".Ldt-Annotation-MashupBegin").text(_annotation.annotation.begin.toString());
            _this.$.find(".Ldt-Annotation-MashupEnd").text(_annotation.annotation.end.toString());
        } else {
            _this.$.find('.Ldt-Annotation-Inner').removeClass("Ldt-Annotation-isMashup");
        }
        if (typeof _this.socialWidget !== "undefined") {
            _this.socialWidget.updateUrls(_url, _text);
        } else {
            setTimeout(function() {
                if (typeof _this.socialWidget !== "undefined") {
                    _this.socialWidget.updateUrls(_url, _text);
                }
            },800);
        }
        _this.$.find(".Ldt-Annotation-Inner").removeClass("Ldt-Annotation-Empty");
        _this.bounds = [ _annotation.begin, _annotation.end ];
        if (_this.arrow) {
            _this.arrow.moveToTime((1 - _this.arrow_position) * _annotation.begin + _this.arrow_position * _annotation.end);
        }
        _this.sendBounds();
    }
    
    this.renderTemplate();
    
    this.$.find(".Ldt-Annotation-Title").click(function() {
        if (currentAnnotation) {
            _this.media.setCurrentTime(currentAnnotation.begin);
        }
        return false;
    });
    
    if (this.show_social) {
        this.insertSubwidget(this.$.find(".Ldt-Annotation-Social"), { type: "Social" }, "socialWidget");
    }
    
    if (this.show_arrow) {
        this.insertSubwidget(this.$.find(".Ldt-Annotation-Arrow"), { type: "Arrow", width: this.width }, "arrow");
    }
    this.onMediaEvent("timeupdate",timeupdate);
    this.onMdpEvent("Annotation.hide","hide");
    this.onMdpEvent("Annotation.show","show");
    this.onMdpEvent("Annotation.minimize","minimize");
    this.onMdpEvent("Annotation.maximize","maximize");
    this.onMdpEvent("Annotation.getBounds","sendBounds");
    this.$.find(".Ldt-Annotation-MaxMinButton").click(this.functionWrapper("toggleSize"));
    this.$.on("resize", function () { _this.width = _this.$.parent().width();
                                      _this.$.css({ width: _this.width });
                                    });
    this.getWidgetAnnotations().forEach(function(_a) {
        _a.on("enter", function() {
            drawAnnotation(_a);
        });
    });
    this.source.getAnnotations().on("found", highlightTitleAndDescription);
    this.source.getAnnotations().on("not-found", highlightTitleAndDescription);
    this.source.getAnnotations().on("search-cleared", highlightTitleAndDescription);
    IriSP.attachDndData(this.$.find("h3"), function() {
    	return {
	    	title: currentAnnotation.title,
	    	description: currentAnnotation.description,
	    	image: currentAnnotation.thumbnail,
	    	uri: (typeof currentAnnotation.url !== "undefined" 
	            ? currentAnnotation.url
	            : (document.location.href.replace(/#.*$/,'') + '#id='  + currentAnnotation.id)),
            text: '[' + currentAnnotation.begin.toString() + '] ' + currentAnnotation.title
	    };
    });
};

IriSP.Widgets.Annotation.prototype.sendBounds = function() {
    this.player.trigger("Annotation.boundsChanged",this.bounds);
};

IriSP.Widgets.Annotation.prototype.drawAnnotation = function(_annotation) {
    this.lastAnnotation = _annotation.id;

};

IriSP.Widgets.Annotation.prototype.hide = function() {
    this.$.slideUp();
};

IriSP.Widgets.Annotation.prototype.show = function() {
    this.$.slideDown();
};

IriSP.Widgets.Annotation.prototype.toggleSize = function() {
    if (this.minimized) {
        this.maximize();
    } else {
        this.minimize();
    }
};

IriSP.Widgets.Annotation.prototype.minimize = function() {
    this.minimized = true;
    this.$.find('.Ldt-Annotation-Inner').addClass("Ldt-Annotation-Minimized");
};

IriSP.Widgets.Annotation.prototype.maximize = function() {
    this.minimized = false;
    this.$.find('.Ldt-Annotation-Inner').removeClass("Ldt-Annotation-Minimized");
};
