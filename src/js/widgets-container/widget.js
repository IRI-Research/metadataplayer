/* widgetsDefinition of an ancestor for the Widget classes */

if (typeof IriSP.Widgets === "undefined") {
    IriSP.Widgets = {};
}

/**
 * @class IriSP.Widget is an "abstract" class. It's mostly used to define some properties common to every widget.
 *
 *  Note that widget constructors are never called directly by the user. Instead, the widgets are instantiated by functions
 *  defined in init.js
 *
 * @constructor
 * @param player - a reference to the player widget
 * @param config - configuration options for the widget
 */


IriSP.Widgets.Widget = function (player, config) {

    if (typeof player === "undefined") {
        /* Probably an abstract call of the class when
         * individual widgets set their prototype */
        return;
    }

    this.__subwidgets = [];

    /* Setting all the configuration options */
    var _type = config.type || "(unknown)",
        _config = IriSP._.defaults({}, config, (player && player.config ? player.config.default_options : {}), this.defaults),
        _this = this;

    IriSP._(_config).forEach(function (_value, _key) {
        _this[_key] = _value;
    });

    this.$ = IriSP.jQuery('#' + this.container);

    if (typeof this.width === "undefined") {
        this.width = this.$.width();
    } else {
        this.$.css("width", this.width);
    }

    if (typeof this.height !== "undefined") {
        this.$.css("height", this.height);
    }

    /* Setting this.player at the end in case it's been overriden
     * by a configuration option of the same name :-(
     */
    this.player = player || new IriSP.FakeClass(["on","trigger","off","loadWidget","loadMetadata"]);

    /* Adding classes and html attributes */
    this.$.addClass("Ldt-TraceMe Ldt-Widget").attr("widget-type", _type);

    this.l10n = (
        typeof this.messages[IriSP.language] !== "undefined"
        ? this.messages[IriSP.language]
        : (
            IriSP.language.length > 2 && typeof this.messages[IriSP.language.substr(0, 2)] !== "undefined"
            ? this.messages[IriSP.language.substr(0, 2)]
            : this.messages["en"]
        )
    );

    /* Loading Metadata if required */

    function onsourceloaded() {
        if (_this.localannotations) {
            _this.localsource = player.loadLocalAnnotations(_this.localannotations);
            _this.source.merge(_this.localsource);
        }
        if (_this.media_id) {
            _this.media = this.getElement(_this.media_id);
        } else {
            var _mediaopts = {
                is_mashup: _this.is_mashup || false
            };
            _this.media = _this.source.getCurrentMedia(_mediaopts);
        }
        if (_this.pre_draw_callback) {
            IriSP.jQuery.when(_this.pre_draw_callback()).done(_this.draw());
        } else {
            _this.draw();
        }
        _this.player.trigger("widget-loaded");
    }

    if (this.metadata) {
        /* Getting metadata */
        this.source = player.loadMetadata(this.metadata);
        /* Call draw when loaded */
        this.source.onLoad(onsourceloaded);
    } else {
        if (this.source) {
            onsourceloaded();
        }
    }


};

IriSP.Widgets.Widget.prototype.defaults = {};

IriSP.Widgets.Widget.prototype.template = '';

IriSP.Widgets.Widget.prototype.messages = {"en":{}};

IriSP.Widgets.Widget.prototype.toString = function () {
    return "Widget " + this.type;
};

IriSP.Widgets.Widget.prototype.templateToHtml = function (_template) {
    return Mustache.to_html(_template, this);
};

IriSP.Widgets.Widget.prototype.renderTemplate = function () {
    this.$.append(this.templateToHtml(this.template));
};

IriSP.Widgets.Widget.prototype.functionWrapper = function (_name) {
    var _this = this,
        _function = this[_name];
    if (typeof _function !== "undefined") {
        return function () {
            return _function.apply(_this, Array.prototype.slice.call(arguments, 0));
        };
    } else {
        console.log("Error, Unknown function IriSP.Widgets." + this.type + "." + _name);
    }
};

IriSP.Widgets.Widget.prototype.getFunctionOrName = function (_functionOrName) {
    switch (typeof _functionOrName) {
        case "function":
            return _functionOrName;
        case "string":
            return this.functionWrapper(_functionOrName);
        default:
            return undefined;
    }
};

IriSP.Widgets.Widget.prototype.onMdpEvent = function (_eventName, _functionOrName) {
    this.player.on(_eventName, this.getFunctionOrName(_functionOrName));
};

IriSP.Widgets.Widget.prototype.onMediaEvent = function (_eventName, _functionOrName) {
    this.media.on(_eventName, this.getFunctionOrName(_functionOrName));
};

IriSP.Widgets.Widget.prototype.getWidgetAnnotations = function () {
    var result = null;
    if (typeof this.annotation_type === "undefined") {
        result = this.media.getAnnotations();
    } else if (this.annotation_type.elementType === "annotationType") {
        result = this.annotation_type.getAnnotations();
    } else {
        result = this.media.getAnnotationsByTypeTitle(this.annotation_type);
    }
    if (typeof this.annotation_filter !== "undefined") {
        return this.annotation_filter(result);
    } else {
        return result;
    }
};

IriSP.Widgets.Widget.prototype.getWidgetAnnotationsAtTime = function () {
    var _time = this.media.getCurrentTime();
    return this.getWidgetAnnotations().filter(function (_annotation) {
        return _annotation.begin <= _time && _annotation.end > _time;
    });
};

IriSP.Widgets.Widget.prototype.isLoaded = function () {
    var isloaded = !IriSP._(this.__subwidgets).any(function (w) {
        return !(w && w.isLoaded());
    });
    return isloaded;
};

IriSP.Widgets.Widget.prototype.insertSubwidget = function (_selector, _widgetoptions, _propname) {
    var _id = _selector.attr("id"),
        _this = this,
        _type = _widgetoptions.type,
        $L = $LAB,
        key = this.__subwidgets.length;
    this.__subwidgets.push(null);
    if (typeof _id == "undefined") {
        _id = IriSP._.uniqueId(this.container + '_sub_widget_' + _widgetoptions.type);
        _selector.attr("id", _id);
    }
    _widgetoptions.container = _id;
    if (typeof IriSP.widgetsRequirements[_type] !== "undefined" && typeof IriSP.widgetsRequirements[_type].requires !== "undefined") {
        for (var _j = 0; _j < IriSP.widgetsRequirements[_type].requires.length; _j++) {
            $L.script(IriSP.getLib(IriSP.widgetsRequirements[_type].requires[_j]));
        }
    }
    $L.wait(function () {
        _this.player.loadWidget(_widgetoptions, function (_widget) {
            if (_propname) {
                _this[_propname] = _widget;
            }
            _this.__subwidgets[key] = _widget;
        });
    });
};

/*
 * Position the player to the next/previous annotations based on current player position
 *
 * Parameter: offset: -1 for previous annotation, +1 for next annotation
 */
IriSP.Widgets.Widget.prototype.navigate = function (offset) {
    // offset is normally either -1 (previous slide) or +1 (next slide)
    var _this = this;
    var currentTime = _this.media.getCurrentTime();
    var annotations = _this.getWidgetAnnotations().sortBy(function (_annotation) {
        return _annotation.begin;
    });
    for (var i = 0; i < annotations.length; i++) {
        if (annotations[i].begin <= currentTime && currentTime < annotations[i].end) {
            // Found a current annotation - clamp i+offset value to [0, length - 1]
            i = Math.min(annotations.length - 1, Math.max(0, i + offset));
            _this.media.setCurrentTime(annotations[i].begin);
            break;
        }
    };
};

/*
 * Propose an export of the widget's annotations
 *
 * Parameter: a list of annotations. If not specified, the widget's annotations will be exported.
 */
IriSP.Widgets.Widget.prototype.exportAnnotations = function (annotations) {
    var widget = this;
    if (annotations === undefined) {
        annotations = this.getWidgetAnnotations();
    }
    var $ = IriSP.jQuery;

    // FIXME: this should belong to a proper serialize/deserialize component?
    var content = Mustache.to_html("[video:{{url}}]\n", {url: widget.media.url}) + annotations.map(function (a) { return Mustache.to_html("[{{ a.begin }}]{{ a.title }} {{ a.description }}[{{ a.end }}]", { a: a }); }).join("\n");

    var el = $("<pre>")
            .addClass("exportContainer")
            .text(content)
            .dialog({
                title: "Annotation export",
                open: function (event, ui) {
                    // Select text
                    var range;
                    if (document.selection) {
                        range = document.body.createTextRange();
                        range.moveToElementText(this[0]);
                        range.select();
                    } else if (window.getSelection) {
                        range = document.createRange();
                        range.selectNode(this[0]);
                        window.getSelection().addRange(range);
                    }
                },
                autoOpen: true,
                width: '80%',
                minHeight: '400',
                height: 400,
                buttons: [ { text: "Close", click: function () { $(this).dialog("close"); } },
                           { text: "Download", click: function () {
                               a = document.createElement('a');
                               a.setAttribute('href', 'data:text/plain;base64,' + btoa(content));
                               a.setAttribute('download', 'Annotations - ' + widget.media.title.replace(/[^ \w]/g, '') + '.txt');
                               a.click();
                           } } ]
            });
};

/**
 * This method responsible of drawing a widget on screen.
 */
IriSP.Widgets.Widget.prototype.draw = function () {
    /* implemented by "sub-classes" */
};
