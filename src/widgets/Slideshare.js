/* TODO: Add Slide synchronization */

IriSP.Widgets.Slideshare = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Slideshare.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Slideshare.prototype.defaults = {
    annotation_type: "slide",
    sync: true,
};

IriSP.Widgets.Slideshare.prototype.messages = {
    fr: {
        slides_ : "Diapositives"
    },
    en: {
        slides_ : "Slides"
    }
};

IriSP.Widgets.Slideshare.prototype.template =
    '<div class="Ldt-SlideShare"><h2>{{l10n.slides_}}</h2><hr /><div class="Ldt-SlideShare-Container"></div></div>';

IriSP.Widgets.Slideshare.prototype.draw = function() {
    
    function insertSlideshare(_presentation, _slide) {
        if (_lastEmbedded === _presentation) {
            if (_embedObject && typeof _embedObject.jumpTo === "function") {
                _embedObject.jumpTo(parseInt(_slide));
            }
        } else {
            _lastEmbedded = _presentation;
            var _id = IriSP.Model.getUID(),
                _params = {
                    allowScriptAccess: "always"
                },
                _atts = {
                    id: _id
                },
                _flashvars = {
                    doc : _presentation,
                    startSlide : _slide
                };
            $container.html('<div id="' + _id + '"></div>');
            swfobject.embedSWF(
                "http://static.slidesharecdn.com/swf/ssplayer2.swf",
                _id,
                _this.embed_width,
                _this.embed_height,
                "8",
                null,
                _flashvars,
                _params,
                _atts
            );
            _embedObject = document.getElementById(_id);
        }
        $container.show();
    }
    
    var _annotations = this.getWidgetAnnotations();
    if (!_annotations.length) {
        this.$.hide();
    } else {
        this.renderTemplate();
        var _lastPres = "",
            _embedObject = null,
            _oembedCache = {},
            _lastEmbedded = "",
            _this = this,
            $container = this.$.find(".Ldt-SlideShare-Container");
            
        this.embed_width = this.embed_width || $container.innerWidth();
        this.embed_height = this.embed_height || Math.floor(this.embed_width * 3/4);
        
        _annotations.forEach(function(_a) {
            _a.on("leave", function() {
                $container.hide();
                _lastPres = "";
            });
            _a.on("enter", function() {
                var _description = _a.description,
                    _isurl = /^https?:\/\//.test(_description),
                    _presentation = _description.replace(/#.*$/,''),
                    _slidematch = _description.match(/(#|\?|&)id=(\d+)/),
                    _slide = parseInt(_slidematch && _slidematch.length > 2 ? _slidematch[2] : 1);
                if (_presentation !== _lastPres) {
                    if (_isurl) {
                        if (typeof _oembedCache[_presentation] === "undefined") {
                            var _ajaxUrl = "http://www.slideshare.net/api/oembed/1?url="
                                + encodeURIComponent(_presentation)
                                + "&format=jsonp&callback=?";
                            IriSP.jQuery.getJSON(_ajaxUrl, function(_oembedData) {
                                var _presmatch = _oembedData.html.match(/doc=([a-z0-9\-_%]+)/i);
                                if (_presmatch && _presmatch.length > 1) {
                                    _oembedCache[_presentation] =  _presmatch[1];
                                    insertSlideshare(_presmatch[1], _slide);
                                }
                            });
                        } else {
                            insertSlideshare(_oembedCache[_presentation], _slide);
                        }
                    } else {
                        insertSlideshare(_presentation, _slide);
                    }
                }
                if (_this.sync && _embedObject && typeof _embedObject.jumpTo === "function") {
                    _embedObject.jumpTo(parseInt(_slide));
                }
                _lastPres = _presentation;
                
            });
        });
    }
};
