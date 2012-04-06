/* model.js is where data is stored in a standard form, whatever the serializer */

IriSP.Cinelab = {
    STATUS_WAITING : 1,
    STATUS_READY : 2
}

IriSP.Cinelab.Source = function(_directory, _url, _serializer) {
    this.status = IriSP.Cinelab.STATUS_EMPTY;
    if (typeof _directory === "undefined") {
        throw "Error : Cinelab.Source called with no parent directory";
    }
    if (typeof _url === "undefined") {
        throw "Error : Cinelab.Source called with no URL";
    }
    if (typeof _serializer === "undefined") {
        throw "Error : Cinelab.Source called with no serializer";
    }
    this.directory = _directory;
    this.serializer = _serializer;
    this.url = _url;
    this.callbackQueue = [];
    this.contents = null;
}

IriSP.Cinelab.Source.prototype.get = function() {
    IriSP.jQuery.getJSON(_url, function(_result) {
        this.contents = this.serializer.deSerialize(_result);
        if (this.callbackQueue.length) {
            var _this = this;
            IriSP._.each(this.callbackQueue, function(_callback) {
                _callback.call(_this, this.contents);
            });
        }
        this.callbackQueue = [];
    });
}

IriSP.Cinelab.Source.prototype.addCallback = function(_callback) {
    if (this.status === IriSP.Cinelab.STATUS_READY) {
        callback.call(this, this.contents);
    } else {
        this.callbackQueue.push(_callback);
    }
}

IriSP.Cinelab.Directory = function() {
    this.sources = {};
    this.consolidated = [];
    this.imports = {};
}

IriSP.Cinelab.Directory.prototype.addSource = function(_source, _serializer) {
    this.source[_source] = new IriSP.Cinelab.Source(this, _source, _serializer);
}

IriSP.Cinelab.Directory.prototype.getSource = function(_source) {
    return (typeof this.sources[_source] !== "undefined" ? this.sources[_source] : false);
}

IriSP.Cinelab.Directory.prototype.source = function(_source, _serializer) {
    if (typeof this.sources[_source] !== "undefined") {
        this.addSource(_source, _serializer);
    }
    return this.getSource(_source);
}
