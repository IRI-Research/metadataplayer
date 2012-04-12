/* model.js is where data is stored in a standard form, whatever the serializer */

IriSP.Model = {
    SOURCE_STATUS_EMPTY : 0,
    SOURCE_STATUS_WAITING : 1,
    SOURCE_STATUS_READY : 2,
    ID_AUTO_INCREMENT : 0
}

/* */

IriSP.Model.List = function(_directory) {
    this.contents = [];
    this.directory = _directory;
}

IriSP.Model.List.prototype.toString = function() {
    return 'List of Elements, length=' + this.length();
}

IriSP.Model.List.prototype.length = function() {
    return this.contents.length;
}

IriSP.Model.List.prototype.getElement = function(_id) {
    return this.directory.getElement(_id);
}

IriSP.Model.List.prototype.getElementAt = function(_pos) {
    if (_pos >= 0 && _pos < this.length()) {
        return this.getElement(this.contents[_pos]);
    }
}

IriSP.Model.List.prototype.each = function(_callback) {
    var _this = this;
    IriSP._(this.contents).each(function(_id) {
        _callback.call(_this, _this.getElement(_id), _id);
    });
}

IriSP.Model.List.prototype.map = function(_callback) {
    var _this = this;
    return IriSP._(this.contents).map(function(_id) {
        return _callback.call(_this, _this.getElement(_id), _id);
    });
}

IriSP.Model.List.prototype.filter = function(_callback) {
    var _this = this,
        _res = new IriSP.Model.List(this.directory);
    _res.contents = IriSP._(this.contents).filter(function(_id) {
        return _callback.call(_this, _this.getElement(_id), _id);
    });
    return _res;
}

IriSP.Model.List.prototype.searchByTitle = function(_text) {
    var _rgxp = new RegExp('(' + _text.replace(/(\W)/gm,'\\$1') + ')','gim');
    return this.filter(function(_element) {
        return _rgxp.test(_element.text);
    });
}

IriSP.Model.List.prototype.searchByDescription = function(_text) {
    var _rgxp = new RegExp('(' + _text.replace(/(\W)/gm,'\\$1') + ')','gim');
    return this.filter(function(_element) {
        return _rgxp.test(_element.description);
    });
}

IriSP.Model.List.prototype.searchByTextFields = function(_text) {
    var _rgxp = new RegExp('(' + _text.replace(/(\W)/gm,'\\$1') + ')','gim');
    return this.filter(function(_element) {
        return _rgxp.test(_element.description);
    });
}

IriSP.Model.List.prototype.addId = function(_id) {
    if (this.contents.indexOf(_id) === -1) {
        this.contents.push(_id);
    }
}

IriSP.Model.List.prototype.addElement = function(_el) {
    this.addId(_el.id);
}

IriSP.Model.List.prototype.addIdsFromArray = function(_array) {
    var _l = _array.length;
    for (var _i = 0; _i < _l; _i++) {
        this.addId(_array[_i]);
    }
}

IriSP.Model.List.prototype.addIdsFromList = function(_list) {
    this.addIdsFromArray(_list.contents);
}

/* */

IriSP.Model.Time = function(_milliseconds) {
    this.milliseconds = parseInt(typeof _milliseconds !== "undefined" ? _milliseconds : 0);
}

IriSP.Model.Time.prototype.setSeconds = function(_seconds) {
    this.milliseconds = 1000 * _seconds;
}

IriSP.Model.Time.prototype.getSeconds = function() {
    return Math.floor(this.milliseconds / 1000);
}

IriSP.Model.Time.prototype.getHMS = function() {
    var _totalSeconds = Math.abs(this.getSeconds());
    return {
        hours : Math.floor(_totalSeconds / 3600),
        minutes : (Math.floor(_totalSeconds / 60) % 60),
        seconds : _totalSeconds % 60
    } 
}

IriSP.Model.Time.prototype.toString = function() {
    function pad(_n) {
        var _res = _n.toString();
        while (_res.length < 2) {
            _res = '0' + _res;
        }
        return _res;
    }
    var _hms = this.getHMS(),
        _res = '';
    if (_hms.hours) {
        _res += pad(_hms.hours) + ':'
    }
    _res += pad(_hms.minutes) + ':' + pad(_hms.seconds);
    return _res;
}

/* */

IriSP.Model.Reference = function(_directory, _idRef) {
    this.directory = _directory;
    if (typeof _idRef === "object") {
        this.isList = true;
        this.contents = new IriSP.Model.List(this.directory);
        this.contents.addIdsFromArray(_idRef);
    } else {
        this.isList = false;
        this.contents = _idRef;
    }
}

IriSP.Model.Reference.prototype.getContents = function() {
    return (this.isList ? this.contents : this.directory.getElement(this.contents));
}

/* */

IriSP.Model.Element = function(_id, _source) {
    this.elementType = 'element';
    if (typeof _id !== "undefined" && typeof _source !== "undefined") {
        this.source = _source;
        this.id = _id;
        this.title = "";
        this.description = "";
        this.source.directory.addElement(this);
    }
}

IriSP.Model.Element.prototype.toString = function() {
    return this.elementType + (this.elementType !== 'element' ? ', id=' + this.id + ', title="' + this.title + '"' : '');
}

IriSP.Model.Element.prototype.setReference = function(_elementType, _idRef) {
    this[_elementType] = new IriSP.Model.Reference(this.source.directory, _idRef);
}

IriSP.Model.Element.prototype.getReference = function(_elementType) {
    if (typeof this[_elementType] !== "undefined") {
        return this[_elementType].getContents();
    }
}

/* */

IriSP.Model.Media = function(_id, _directory) {
    IriSP.Model.Element.call(this, _id, _directory);
    this.elementType = 'media';
    this.duration = new IriSP.Model.Time();
    this.url = '';
}

IriSP.Model.Media.prototype = new IriSP.Model.Element();

IriSP.Model.Media.prototype.setDuration = function(_durationMs) {
    this.duration.milliseconds = _durationMs;
}

/* */

IriSP.Model.Tag = function(_id, _directory) {
    IriSP.Model.Element.call(this, _id, _directory);
    this.elementType = 'tag';
}

IriSP.Model.Tag.prototype = new IriSP.Model.Element();

/* */

IriSP.Model.AnnotationType = function(_id, _directory) {
    IriSP.Model.Element.call(this, _id, _directory);
    this.elementType = 'annotationType';
}

IriSP.Model.AnnotationType.prototype = new IriSP.Model.Element();

/* Annotation
 * */

IriSP.Model.Annotation = function(_id, _directory) {
    IriSP.Model.Element.call(this, _id, _directory);
    this.elementType = 'annotation';
    this.begin = new IriSP.Model.Time();
    this.end = new IriSP.Model.Time();
}

IriSP.Model.Annotation.prototype = new IriSP.Model.Element(null);

IriSP.Model.Annotation.prototype.setBegin = function(_beginMs) {
    this.begin.milliseconds = _beginMs;
}

IriSP.Model.Annotation.prototype.setEnd = function(_beginMs) {
    this.end.milliseconds = _beginMs;
}

IriSP.Model.Annotation.prototype.setMedia = function(_idRef) {
    this.setReference("media", _idRef);
}

IriSP.Model.Annotation.prototype.getMedia = function() {
    return this.getReference("media");
}

IriSP.Model.Annotation.prototype.setAnnotationType = function(_idRef) {
    this.setReference("annotationType", _idRef);
}

IriSP.Model.Annotation.prototype.getAnnotationType = function() {
    return this.getReference("annotationType");
}

IriSP.Model.Annotation.prototype.setTags = function(_idRefs) {
    this.setReference("tag", _idRefs);
}

IriSP.Model.Annotation.prototype.getTags = function() {
    return this.getReference("tag");
}

/* */

IriSP.Model.Source = function(_properties) {
    this.status = IriSP.Model.SOURCE_STATUS_EMPTY;
    this.config = _properties;
    this.callbackQueue = [];
    this.contents = {};
    this.get();
}

IriSP.Model.Source.prototype.addList = function(_listId, _contents) {
    if (typeof this.contents[_listId] === "undefined") {
        this.contents[_listId] = new IriSP.Model.List(this.config.directory);
    }
    this.contents[_listId].addIdsFromList(_contents);
}

IriSP.Model.Source.prototype.getList = function(_listId) {
    if (typeof this.contents[_listId] === "undefined") {
        return this.config.directory.getGlobalList.filter(function(_e) {
            return (_e.elType === _listId);
        });
    } else {
        return this.contents[_listId];
    }
}

IriSP.Model.Source.prototype.getElement = function(_listId, _elId) {
    var _list = this.getList(_listId);
    return (typeof _list !== "undefined" ? _list.getElement(_elId) : undefined);
}

IriSP.Model.Source.prototype.setCurrentMediaId = function(_idRef) {
    if (typeof _idRef !== "undefined") {
        this.currentMedia = _idRef;
    }
}

IriSP.Model.Source.prototype.setDefaultCurrentMedia = function() {
    if (typeof this.currentMedia === "undefined") {
        this.currentMedia = this.getList("media")[0];
    }
}

IriSP.Model.Source.prototype.get = function() {
    this.status = IriSP.Model.SOURCE_STATUS_WAITING;
    this.status = IriSP.Model.SOURCE_STATUS_READY;
    var _this = this;
    if (_this.callbackQueue.length) {
        IriSP._.each(_this.callbackQueue, function(_callback) {
            _callback.call(_this);
        });
    }
    _this.callbackQueue = [];
}

IriSP.Model.Source.prototype.addCallback = function(_callback) {
    if (this.status === IriSP.Model.SOURCE_STATUS_READY) {
        callback.call(this);
    } else {
        this.callbackQueue.push(_callback);
    }
}

IriSP.Model.Source.prototype.getAnnotations = function() {
    return this.getList("annotation");
}

IriSP.Model.Source.prototype.getMedias = function() {
    return this.getList("media");
}

IriSP.Model.Source.prototype.getDuration = function() {
    return this.currentMedia.duration;
}

/* */

IriSP.Model.RemoteSource = function() {
    IriSP.Model.Element.call(this, _id, _directory);
    this.elementType = 'tag';
}

IriSP.Model.RemoteSource.prototype = new IriSP.Model.Source();

IriSP.Model.RemoteSource.prototype.get = function() {
    this.status = IriSP.Model.SOURCE_STATUS_WAITING;
    var _this = this;
    IriSP.jQuery.getJSON(this.url, function(_result) {
        _this.serializer.deSerialize(_result, _this);
        if (_this.callbackQueue.length) {
            IriSP._.each(_this.callbackQueue, function(_callback) {
                _callback.call(_this);
            });
        }
        _this.callbackQueue = [];
        _this.status = IriSP.Model.SOURCE_STATUS_READY;
    });
}

/* */

IriSP.Model.Directory = function() {
    this.remoteSources = {};
    this.localSource = [];
    this.elements = {};
    this.nameSpaces = {};
}

IriSP.Model.Directory.prototype.remoteSource = function(_properties) {
    if (typeof this.remoteSources[_properties.url] === "undefined") {
        this.remoteSources[_properties.url] = new IriSP.Model.RemoteSource(_properties);
    }
    return this.remoteSources[_properties.url];
}

IriSP.Model.Directory.prototype.getElement = function(_id) {
    return this.elements[_id];
}

IriSP.Model.Directory.prototype.addElement = function(_element) {
    this.elements[_element.id] = _element;
}

IriSP.Model.Directory.prototype.getGlobalList = function() {
    var _res = new IriSP.Model.List(this);
    _res.addIdsFromArray(IriSP._(this.elements).keys());
    return _res;
}

/* */
