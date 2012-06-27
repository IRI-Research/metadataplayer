/* TODO: Add Slide synchronization */

IriSP.Widgets.Slideshare = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
    this.lastSlide = {
        presentation: "",
        slide: 0
    }
    this.embedObject = null;
    this.oembedCache = {}
}

IriSP.Widgets.Slideshare.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Slideshare.prototype.defaults = {
    annotation_type: "slide",
    sync: true,
    embed_width: 400,
    embed_height: 300
}

IriSP.Widgets.Slideshare.prototype.messages = {
    fr: {
        slides_ : "Diapositives&nbsp;:"
    },
    en: {
        slides_ : "Slides:"
    }
}

IriSP.Widgets.Slideshare.prototype.template =
    '<div class="Ldt-SlideShare"><h2>{{l10n.slides_}}</h2><hr /><div class="Ldt-SlideShare-Container"></div></div>';

IriSP.Widgets.Slideshare.prototype.draw = function() {
    var _hide = false;
    if (typeof this.annotation_type !== "undefined" && this.annotation_type) {
        var _annType = this.source.getAnnotationTypes().searchByTitle(this.annotation_type);
        _hide = !_annType.length;
    }
    if (_hide) {
        this.$.hide();
    } else {
        this.renderTemplate();
        this.$container = this.$.find(".Ldt-SlideShare-Container");
        this.bindPopcorn("timeupdate","onTimeupdate");
        this.onTimeupdate();
    }
}

IriSP.Widgets.Slideshare.prototype.onTimeupdate = function() {
    var _list = this.getWidgetAnnotationsAtTime();
    if (_list.length) {
        var _description = _list[0].description,
            _isurl = /^https?:\/\//.test(_description),
            _presentation = _description.replace(/#.*$/,''),
            _slidematch = _description.match(/(#|\?|&)id=(\d+)/),
            _slide = parseInt(_slidematch && _slidematch.length > 2 ? _slidematch[2] : 1),
            _this = this;
        if (_presentation !== this.lastSlide.presentation) {
            if (_isurl) {
                if (typeof this.oembedCache[_presentation] === "undefined") {
                    var _ajaxUrl = "http://www.slideshare.net/api/oembed/1?url="
                        + encodeURIComponent(_presentation)
                        + "&format=jsonp&callback=?";
                    IriSP.jQuery.getJSON(_ajaxUrl, function(_oembedData) {
                        var _presmatch = _oembedData.html.match(/doc=([a-z0-9\-_%]+)/i);
                        if (_presmatch && _presmatch.length > 1) {
                            _this.oembedCache[_presentation] =  _presmatch[1];
                            _this.insertSlideshare(_presmatch[1], _slide);
                        }
                    });
                } else {
                    this.insertSlideshare(this.oembedCache[_presentation], _slide);
                }
            } else {
                this.insertSlideshare(_presentation, _slide);
            }
        }
        if (_slide != this.lastSlide.slide && this.sync && this.embedObject && typeof this.embedObject.jumpTo === "function") {
            this.embedObject.jumpTo(parseInt(_slide));
        }
        this.lastSlide = {
            presentation: _presentation,
            slide: _slide
        }
    } else {
        if (this.lastSlide.presentation) {
            this.$container.hide();
            this.lastSlide = {
                presentation: "",
                slide: 0
            }
        }
    }
}

IriSP.Widgets.Slideshare.prototype.insertSlideshare = function(_presentation, _slide) {
    if (this.lastEmbedded === _presentation) {
        if (this.embedObject && typeof this.embedObject.jumpTo === "function") {
            this.embedObject.jumpTo(parseInt(_slide));
        }
    } else {
        this.lastEmbedded = _presentation;
        var _id = IriSP.Model.getUID(),
            _params = {
                allowScriptAccess: "always"
            }
            _atts = {
                id: _id
            },
            _flashvars = {
                doc : _presentation,
                startSlide : _slide
            };
        this.$container.html('<div id="' + _id + '"></div>');
        swfobject.embedSWF(
            "http://static.slidesharecdn.com/swf/ssplayer2.swf",
            _id,
            this.embed_width,
            this.embed_height,
            "8",
            null,
            _flashvars,
            _params,
            _atts
        );
        this.embedObject = document.getElementById(_id);
    }
    this.$container.show();
}
