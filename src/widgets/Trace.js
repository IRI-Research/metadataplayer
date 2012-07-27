IriSP.Widgets.Trace = function(player, config) {
  IriSP.Widgets.Widget.call(this, player, config);
    
}

IriSP.Widgets.Trace.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Trace.prototype.defaults = {
    js_console : false,
    url: "http://traces.advene.org:5000/",
    requestmode: 'GET',
    syncmode: "sync",
    default_subject: "IRI",
    tracer: null,
    extend: false
}

IriSP.Widgets.Trace.prototype.draw = function() {
  this.lastEvent = "";
  if (typeof window.tracemanager === "undefined") {
      console.log("Tracemanager not found");
      return;
  }
  var _this = this,
    _listeners = {
        "IriSP.search.open" : 0,
        "IriSP.search.closed" : 0,
        "IriSP.search" : 0,
        "IriSP.search.cleared" : 0,
        "IriSP.search.matchFound" : 0,
        "IriSP.search.noMatchFound" : 0,
        "IriSP.search.triggeredSearch" : 0,
        "IriSP.TraceWidget.MouseEvents" : 0,
        "play" : 0,
        "pause" : 0,
        "volumechange" : 0,
        "seeked" : 0,
        "play" : 0,
        "pause" : 0,
        "timeupdate" : 2000
    };
    IriSP._(_listeners).each(function(_ms, _listener) {
        var _f = function(_arg) {
            _this.eventHandler(_listener, _arg);
        }
        if (_ms) {
            _f = IriSP._.throttle(_f, _ms);
        }
        _this.player.popcorn.listen(_listener, _f);
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
    
    this.mouseLocation = '';
    IriSP.jQuery(".Ldt-Widget").bind("click mouseover mouseout", function(_e) {
        var _target = IriSP.jQuery(_e.target);

        while (!_target.hasClass("Ldt-TraceMe") && !_target.hasClass("Ldt-Widget") && _target.length) {
            _target = _target.parent();
        }
        
        var _widget = IriSP.jQuery(this).attr("widget-type"),
            _data = {
                "type": _e.type,
                "x": _e.clientX,
                "y": _e.clientY,
                "widget": _widget
            },
            _targetEl = _target[0],
            _class = _targetEl.className,
            _name = _targetEl.localName,
            _id = _targetEl.id,
            _value = _targetEl.value,
            _traceInfo = _target.attr("trace-info"),
            _lastTarget = _name + (_id && _id.length ? '#' + IriSP.jqEscape(_id) : '') + (_class && _class.length ? ('.' + IriSP.jqEscape(_class).replace(/\s/g,'.')).replace(/\.Ldt-(Widget|TraceMe)/g,'') : '');
        _data.target = _lastTarget
        if (typeof _traceInfo == "string" && _traceInfo.length) {
            _data.traceInfo = _traceInfo;
            _lastTarget += ( ";" + _traceInfo );
        }
        if (typeof _value == "string" && _value.length) {
            _data.value = _value;
        }
        switch(_e.type) {
            case "mouseover":
                if (_this.lastTarget != _lastTarget) {
                    _this.player.popcorn.trigger('IriSP.TraceWidget.MouseEvents', _data);
                } else {
                    if (typeof _this.moTimeout != "undefined") {
                        clearTimeout(_this.moTimeout);
                        _this.moTimeout = undefined;
                    }
                }
            break;
            case "mouseout":
                if (typeof _this.moTimeout != "undefined") {
                    clearTimeout(_this.moTimeout);
                }
                _this.moTimeout = setTimeout(function() {
                   if (_lastTarget != _this.lastTarget) {
                       _this.player.popcorn.trigger('IriSP.TraceWidget.MouseEvents', _data);
                   }
                },100);
            break;
            default:
                _this.player.popcorn.trigger('IriSP.TraceWidget.MouseEvents', _data);
        }
        _this.lastTarget = _lastTarget;
    });
}

IriSP.Widgets.Trace.prototype.eventHandler = function(_listener, _arg) {
    var _traceName = 'Mdp_';
    if (typeof _arg == "string" || typeof _arg == "number") {
        _arg = { "value" : _arg }
    }
    if (typeof _arg == "undefined") {
        _arg = {}
    }
    switch(_listener) {
        case 'IriSP.TraceWidget.MouseEvents':
            _traceName += _arg.widget + '_' + _arg.type;
            delete _arg.widget;
            delete _arg.type;
        break;
        case 'timeupdate':
        case 'play':
        case 'pause':
            _arg.time = this.player.popcorn.currentTime() * 1000;
        case 'seeked':
        case 'volumechange':
            _traceName += 'Popcorn_' + _listener;
        break;
        default:
            _traceName += _listener.replace('IriSP.','').replace('.','_');
    }
    this.lastEvent = _traceName;
    if (typeof this.extend === "object" && this.extend) {
        IriSP._(_arg).extend(this.extend);
    }
    this.tracer.trace(_traceName, _arg);
    if (this.js_console && typeof window.console !== "undefined" && typeof console.log !== "undefined") {
        console.log("tracer.trace('" + _traceName + "', " + JSON.stringify(_arg) + ");");
    }
}
