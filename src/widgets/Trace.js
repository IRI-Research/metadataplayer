IriSP.Widgets.Trace = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Trace.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Trace.prototype.defaults = {
    js_console : false,
    url: "http://traces.advene.org:5000/",
    requestmode: 'GET',
    syncmode: "sync",
    default_subject: "IRI",
    tracer: null,
    extend: false
};

IriSP.Widgets.Trace.prototype.draw = function() {
    if (typeof window.tracemanager === "undefined") {
        console.log("Tracemanager not found");
        return;
    }
    var _this = this,
        _medialisteners = {
            "play" : 0,
            "pause" : 0,
            "volumechange" : 0,
            "seeked" : 0,
            "play" : 0,
            "pause" : 0,
            "timeupdate" : 10000
        },
        _annlisteners = {
            search: 0,
            "search-cleared": 0
        };
    IriSP._(_medialisteners).each(function(_ms, _listener) {
        var _f = function(_arg) {
            _this.eventHandler(_listener, _arg);
        };
        if (_ms) {
            _f = IriSP._.throttle(_f, _ms);
        }
        _this.media.on(_listener, _f);
    });
    var _annotations = this.source.getAnnotations();
    IriSP._(_annlisteners).each(function(_ms, _listener) {
        var _f = function(_arg) {
            _this.eventHandler(_listener, _arg);
        };
        if (_ms) {
            _f = IriSP._.throttle(_f, _ms);
        }
        _annotations.on(_listener, _f);
    });

    if (!this.tracer) {

        this.tracer = window.tracemanager.init_trace("test", {
            url: this.url,
            requestmode: this.requestmode,
            syncmode: this.syncmode,
            default_subject: this.default_subject
        });

    }



    this.tracer.trace("TraceWidgetInit", {});

    // Configure annotation creation/update/delete/publish tracing
    _this.player.on("Annotation.create", function (a) {
        _this.tracer.trace("AnnotationCreated", { id: a.id, annotation_begin: a.begin.milliseconds, annotation_end: a.end.milliseconds, annotation_media: a.media.id, content_length: a.title.length, content_words: a.title.split(/\s+/).length });
    });
    _this.player.on("Annotation.delete", function (aid) {
        _this.tracer.trace("AnnotationDeleted", { id: aid });
    });
    _this.player.on("Annotation.update", function (a) {
        _this.tracer.trace("AnnotationUpdated", { id: a.id, annotation_begin: a.begin.milliseconds, annotation_end: a.end.milliseconds, annotation_media: a.media.id, content_length: a.title.length, content_words: a.title.split(/\s+/).length });
    });
    _this.player.on("Annotation.publish", function (a) {
        _this.tracer.trace("AnnotationPublished", { id: a.id, annotation_begin: a.begin.milliseconds, annotation_end: a.end.milliseconds, annotation_media: a.media.id, content_length: a.title.length, content_words: a.title.split(/\s+/).length });
    });

    _this.player.trigger("trace-ready");
    this.mouseLocation = '';
    IriSP.jQuery(".Ldt-Widget").on("mousedown mouseenter mouseleave", ".Ldt-TraceMe", function(_e) {
        var _target = IriSP.jQuery(this);

        var _widget = _target.attr("widget-type") || _target.parents(".Ldt-Widget").attr("widget-type"),
            _data = {
                "type": _e.type,
                "widget": _widget
            },
            _targetEl = _target[0],
            _class = _targetEl.className,
            _name = _targetEl.localName,
            _id = _targetEl.id,
            _value = _target.val(),
            _traceInfo = _target.attr("trace-info");
        _data.target = _name + (_id && _id.length ? '#' + IriSP.jqEscape(_id) : '') + (_class && _class.length ? ('.' + IriSP.jqEscape(_class).replace(/\s/g, '.')).replace(/\.Ldt-(Widget|TraceMe)/g, '') : '');
        if (typeof _traceInfo == "string" && _traceInfo) {
            _data.traceInfo = _traceInfo;
        }
        if (typeof _value == "string" && _value.length) {
            _data.value = _value;
        }
        _this.eventHandler('UIEvent', _data);
    });
};

IriSP.Widgets.Trace.prototype.eventHandler = function(_listener, _arg) {
    var _traceName = 'Mdp_';
    if (typeof _arg == "string" || typeof _arg == "number") {
        _arg = { "value" : _arg };
    }
    if (typeof _arg == "undefined") {
        _arg = {};
    }
    switch (_listener) {
    case 'UIEvent':
        _traceName += _arg.widget + '_' + _arg.type;
        delete _arg.widget;
        delete _arg.type;
        break;
    case 'play':
    case 'pause':
        _arg.milliseconds = this.media.getCurrentTime().milliseconds;
    case 'timeupdate':
    case 'seeked':
    case 'volumechange':
        _traceName += 'media_' + _listener;
        break;
    default:
        _traceName += _listener.replace('.', '_');
    }
    if (typeof this.extend === "object" && this.extend) {
        IriSP._(_arg).extend(this.extend);
    }
    this.tracer.trace(_traceName, _arg);
    if (this.js_console && typeof window.console !== "undefined" && typeof console.log !== "undefined") {
        console.log("tracer.trace('" + _traceName + "', " + JSON.stringify(_arg) + ");");
    }
};
