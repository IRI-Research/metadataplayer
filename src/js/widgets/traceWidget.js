IriSP.TraceWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this.lastEvent = "";
  var _this = this,
    _listeners = [
        "IriSP.ArrowWidget.releaseArrow",
        "IriSP.SliceWidget.hide",
        "IriSP.AnnotationsWidget.show",
        "IriSP.AnnotationsWidget.hide",
        "IriSP.ArrowWidget.blockArrow",
        "IriSP.SliceWidget.position",
        "IriSP.SliceWidget.show",
        "IriSP.SliceWidget.hide",
        "IriSP.createAnnotationWidget.addedAnnotation",
//        "IriSP.PlayerWidget.AnnotateButton.clicked",
//        "IriSP.PlayerWidget.MouseOver",
//        "IriSP.PlayerWidget.MouseOut",
        "IriSP.search.open",
        "IriSP.search.closed",
        "IriSP.search",
        "IriSP.search.cleared",
//        "IriSP.PolemicTweet.click",
        "IriSP.search.matchFound",
        "IriSP.search.noMatchFound",
//        "IriSP.SegmentsWidget.click",
        "IriSP.SliceWidget.zoneChange",
//        "IriSP.SparklineWidget.clicked",
//        "IriSP.StackGraphWidget.mouseOver",
//        "IriSP.StackGraphWidget.clicked",
        "IriSP.search.triggeredSearch",
        "IriSP.Widget.MouseEvents",
        "play",
        "pause",
        "volumechange",
        "timeupdate",
        "seeked",
        "play",
        "pause"
    ];
    IriSP._(_listeners).each(function(_listener) {
      _this._Popcorn.listen(_listener, function() {
          _this.eventHandler(_listener, arguments);
      });
    });
  
}

IriSP.TraceWidget.prototype = new IriSP.Widget();

IriSP.TraceWidget.prototype.draw = function() {
}

IriSP.TraceWidget.prototype.eventHandler = function(_listener, _args) {
    var _traceName = 'Mdp_',
        _data = {};
        
    function packArgs() {
        for (var _i = 0; _i < _args.length; _i++) {
            _data[_i] = _args[_i];
        }
    }
    
    switch(_listener) {
        case 'IriSP.Widget.MouseEvents':
            var _type = _args[0].type,
                _name = _args[0].target_name,
                _class = _args[0].target_class,
                _id = _args[0].target_id,
                _widget = _args[0].widget.match(/[^_]+widget/i)[0];
            _traceName += _widget + '_' + _type;
            _data.x = _args[0].x;
            _data.y = _args[0].y;
            _data.target = _name + (_id.length ? '#' + _id : '') + (_class.length ? '.' + _class.replace(/\s/g,'.') : '');
            if (typeof _args[0].value == "string" && _args[0].value.length) {
                _data.value = _args[0].value;
            }
            if ((_name == "button" || /button/.test(_class)) && typeof _args[0].text == "string" && _args[0].text.length) {
                _data.text = _args[0].text;
            }
            if (typeof _args[0].title == "string" && _args[0].title.length) {
                _data.title = _args[0].title;
            }
            // Filtrer les événements mouseover quand on se déplace vers des éléments non pertinents
            if (!_id.length && !_class.length && ( _type == 'mouseover' || _type == 'mouseout' ) && this.lastEvent.search('Mdp_' + _widget) == 0) {
                return;
            }
        break;
        case 'play':
        case 'pause':
        case 'seeked':
        case 'timeupdate':
        case 'volumechange':
            _traceName += 'Popcorn' + _listener;
            packArgs();
        break;
        default:
            _traceName += _listener.replace('IriSP.','').replace('.','_');
            packArgs();
    }
    this.lastEvent = _traceName;
    console.log("trace('" + _traceName + "', " + JSON.stringify(_data) + ");");
}
