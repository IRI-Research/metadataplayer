/* model.js is where data is stored in a standard form, whatever the serializer */

IriSP.Model = {
    SOURCE_STATUS_EMPTY : 0,
    SOURCE_STATUS_WAITING : 1,
    SOURCE_STATUS_READY : 2,
    IDS_AUTO_INCREMENT : 0,
    IDS_PREFIX : 'autoid-'
}

/* */

IriSP.Model.List = function() {
    this.contents = {};
}

IriSP.Model.List.prototype.toString = function() {
    return 'List of Elements, length=' + this.length();
}

IriSP.Model.List.prototype.keys = function() {
    return IriSP._(this.contents).keys();
}

IriSP.Model.List.prototype.length = function() {
    return this.keys().length;
}

IriSP.Model.List.prototype.getElement = function(_id) {
    return this.contents[_id];
}

IriSP.Model.List.prototype.getFirst = function() {
    return this.contents(this.keys()[0]);
}

IriSP.Model.List.prototype.each = function(_callback) {
    var _this = this;
    IriSP._(this.contents).each(function(_element, _id) {
        _callback.call(_this, _element, _id);
    });
}

IriSP.Model.List.prototype.map = function(_callback) {
    var _this = this;
    return IriSP._(this.contents).map(function(_element, _id) {
        return _callback.call(_this, _element, _id);
    });
}

IriSP.Model.List.prototype.addElement = function(_element) {
    if ( typeof _element.id === "undefined" ) {
        IriSP.Model.AUTO_INCREMENT++;
        _element.id = IriSP.Model.IDS_PREFIX + IriSP.Model.IDS_AUTO_INCREMENT;
    }
    this.contents[_element.id] = _element;
    if ( this.hasParent ) {
        this.parent.addElement(_element);
    }
}

IriSP.Model.List.prototype.addElements = function(_list) {
    var _this = this;
    _list.each(function(_element) {
        _this.addElement(_element);
    });
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

IriSP.Model.BrokenReference = function(_elementType, _idRef) {
    this.id = _idRef;
    this.elementType = 'brokenReference';
    this.originalElementType = _elementType;
    this.isSolved = false;
}

IriSP.Model.BrokenReference.prototype.toString = function() {
    return 'Broken reference to ' + IriSP.Model.ELEMENT_TYPES[_elementType].element_str + ', id=' + this.id;
}

IriSP.Model.BrokenReference.prototype.tryToSolve = function(_container) {
    if (this.isSolved) {
        return this.solution;
    }
    var _obj = _container.getElement(this.originalElementType, this.id);
    if (typeof _obj !== "undefined") {
        this.isSolved = true;
        this.solution = _obj;
        return this.solution;
    } else {
        return undefined;
    }
}

/* */

IriSP.Model.Element = function(_id, _source) {
    this.elementType = 'element';
    if (typeof _id === "undefined") {
        IriSP.Model.IDS_AUTO_INCREMENT++;
        this.id = IriSP.Model.IDS_PREFIX + IriSP.Model.AUTO_INCREMENT;
    } else {
        this.id = _id;
    }
    this.source = _source;
    this.title = "";
    this.description = "";
}

IriSP.Model.Element.prototype.toString = function() {
    return this.elementType + ', id=' + this.id + ', title="' + this.title + '"';
}

IriSP.Model.Element.prototype.getReference = function(_container, _elementType, _idRef) {
    var _obj = _container.getElement(_elementType, _idRef);
    if (typeof _obj === "undefined") {
        _obj = new IriSP.Model.BrokenReference(_elementType, _idRef);
    }
    _obj.backReference(this);
    return _obj;
}

IriSP.Model.Element.prototype.backReference = function(_object) {
    if (typeof this.referencedBy === "undefined") {
        this.referencedBy = {}
    }
    if (typeof this.referencedBy[_object.elementType] === "undefined") {
        this.referencedBy[_object.elementType] = new IriSP.Model.List();
    }
    this.referencedBy[_object.elementType].addElement(_object);
}

IriSP.Model.Element.prototype.otmCrossReference = function(_container, _elementType, _idRef) {
    if (typeof this.referencing === "undefined") {
        this.referencing = {};
    }
    this.referencing[_elementType] = this.getReference(_container, _elementType, _idRef);
}

IriSP.Model.Element.prototype.mtmCrossReference = function(_container, _elementType, _idRefList) {
    if (typeof this.referencing === "undefined") {
        this.referencing = {};
    }
    this.referencing[_elementType] = new IriSP.Model.List;
    for (var _i = 0; _i < _idRefList.length; _i++) {
        this.referencing[_elementType].addElement(this.getReference(_container, _elementType, _idRefList[_i]));
    }
}
/* */

IriSP.Model.Media = function(_id, _source) {
    IriSP.Model.Element.call(this, _id, _source);
    this.elementType = 'media';
    this.duration = new IriSP.Model.Time();
    this.url = '';
}

IriSP.Model.Media.prototype = new IriSP.Model.Element(null);

IriSP.Model.Media.prototype.setDuration = function(_durationMs) {
    this.duration.milliseconds = _durationMs;
}

/* */

IriSP.Model.AnnotationType = function(_id, _source) {
    IriSP.Model.Element.call(this, _id, _source);
    this.elementType = 'annotationType';
}

IriSP.Model.AnnotationType.prototype = new IriSP.Model.Element(null);

/* Annotation
 * */

IriSP.Model.Annotation = function(_id, _source) {
    IriSP.Model.Element.call(this, _id, _source);
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

IriSP.Model.Annotation.prototype.setMedia = function(_idRef, _container) {
    this.otmCrossReference(_container, "media" , _idRef);
}

IriSP.Model.Annotation.prototype.getMedia = function() {
    return this.referencing.media;
}

IriSP.Model.Annotation.prototype.setAnnotationType = function(_idRef, _container) {
    this.otmCrossReference(_container, "annotationType" , _idRef);
}

IriSP.Model.Annotation.prototype.getAnnotationType = function() {
    return this.referencing.annotation_type;
}

/* A Container contains lists of elements. It corresponds to the root of Cinelab
 * */

IriSP.Model.Container = function(_parent) {
    this.hasParent = (typeof _parent !== "undefined");
    if (this.hasParent) {
        this.parent = _parent;
    }
    this.contents = {}
}

IriSP.Model.Container.prototype.each = function(_callback) {
    var _this = this;
    IriSP._(this.contents).each(function(_element, _id) {
        _callback.call(_this, _element, _id);
    });
}

IriSP.Model.Container.prototype.map = function(_callback) {
    var _this = this;
    return IriSP._(this.contents).map(function(_element, _id) {
        return _callback.call(_this, _element, _id);
    });
}

IriSP.Model.Container.prototype.addList = function(_listId, _contents) {
    if (this.hasParent) {
        this.parent.addList(_listId, _contents);
    }
    if (typeof this.contents[_listId] === "undefined") {
        this.contents[_listId] = _contents;
    } else {
        this.contents[_listId].addElements(_contents);
    }
}

IriSP.Model.Container.prototype.getList = function(_listId) {
    if (typeof this.contents[_listId] === "undefined") {
        if (this.hasParent) {
            return this.parent.getList(_listId);
        } else {
            return undefined;
        }
    } else {
        return this.contents[_listId];
    }
}

IriSP.Model.Container.prototype.getElement = function(_listId, _elId) {
    var _list = this.getList(_listId);
    return (typeof _list !== "undefined" ? _list.getElement(_elId) : undefined);
}

IriSP.Model.Container.prototype.getMedias = function(_contents) {
    return this.getList("media");
}

IriSP.Model.Container.prototype.getAnnotations = function(_contents) {
    return this.getList("annotation");
}

IriSP.Model.Container.prototype.setCurrentMediaById = function(_idRef) {
    if (typeof _idRef !== "undefined") {
        this.currentMedia = this.getElement("media", _idRef);
    }
}

IriSP.Model.Container.prototype.setDefaultCurrentMedia = function() {
    if (typeof this.currentMedia === "undefined") {
        this.currentMedia = this.getMedias().getFirst();
    }
}

/* */

IriSP.Model.Source = function(_directory, _url, _serializer) {
    this.status = IriSP.Model.SOURCE_STATUS_EMPTY;
    if (typeof _directory === "undefined") {
        throw "Error : Model.Source called with no parent directory";
    }
    if (typeof _url === "undefined") {
        throw "Error : Model.Source called with no URL";
    }
    if (typeof _serializer === "undefined") {
        throw "Error : Model.Source called with no serializer";
    }
    this.directory = _directory;
    this.serializer = _serializer;
    this.url = _url;
    this.callbackQueue = [];
    this.container = new IriSP.Model.Container(_directory.consolidated);
    this.get();
}

IriSP.Model.Source.prototype.get = function() {
    this.status = IriSP.Model.SOURCE_STATUS_WAITING;
    var _this = this;
    IriSP.jQuery.getJSON(this.url, function(_result) {
        _this.serializer.deSerialize(_result, _this.container);
        if (_this.callbackQueue.length) {
            IriSP._.each(_this.callbackQueue, function(_callback) {
                _callback.call(_this);
            });
        }
        _this.callbackQueue = [];
        _this.status = IriSP.Model.SOURCE_STATUS_READY;
    });
}

IriSP.Model.Source.prototype.addCallback = function(_callback) {
    if (this.status === IriSP.Model.SOURCE_STATUS_READY) {
        callback.call(this);
    } else {
        this.callbackQueue.push(_callback);
    }
}

IriSP.Model.Source.prototype.getAnnotations = function() {
    return this.container.getAnnotations();
}

IriSP.Model.Source.prototype.getMedias = function() {
    return this.container.getMedias();
}

IriSP.Model.Source.prototype.getCurrentMedia = function() {
    return this.container.currentMedia;
}

IriSP.Model.Source.prototype.getDuration = function() {
    return this.getCurrentMedia().duration;
}

/* */

IriSP.Model.Directory = function() {
    this.sources = {};
    this.imports = {};
    this.consolidated = new IriSP.Model.Container();
}

IriSP.Model.Directory.prototype.addSource = function(_source, _serializer) {
    this.sources[_source] = new IriSP.Model.Source(this, _source, _serializer);
}

IriSP.Model.Directory.prototype.source = function(_source, _serializer) {
    if (typeof this.sources[_source] === "undefined") {
        this.addSource(_source, _serializer);
    }
    return this.sources[_source];
}

/* */
