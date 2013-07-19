/* SPEL Serializer */

if (typeof IriSP.serializers === "undefined") {
    IriSP.serializers = {};
}

IriSP.serializers.spel = {
    types :  {
        media : {
            serialized_name : "medias",
            deserializer : function(_data, _source) {
                var _res = new IriSP.Model.Media(_data.id, _source);
                _res.video = _data.url;
                _res.title = _data.meta["dc:title"] || _data.meta.title || "";
                _res.description = _data.meta["dc:description"] || _data.meta.description || "";
                _res.setDuration(_data.meta["dc:duration"] || _data.meta.duration || "");
                return _res;
            }
        },
        annotationType : {
            serialized_name : "annotation_types",
            deserializer : function(_data, _source) {
                var _res = new IriSP.Model.AnnotationType(_data.id, _source);
                _res.title = _data["dc:title"] || _data.title || _data.id;
                _res.description = _data["dc:description"] || _data.description || ("Annotation type: " + _data.id);
                return _res;
            }
        },
        annotation : {
            serialized_name : "annotations",
            deserializer : function(_data, _source) {
                var _res = new IriSP.Model.Annotation(_data.id, _source);
                function shortenText(_text, _maxlength) {
                    return (_text.length > _maxlength ? (_text.substr(0,_maxlength) + '…') : _text);
                }
                switch (typeof _data.content.data) {
                    case "object":
                        _res.description = IriSP._(_data.content.data).map(function(v, k) {
                            return k + ": " + v;
                        }).join("\n");
                        _res.title = shortenText(_data.content.data.titre || _data.content.data.ref_text || "", 40);
                    break;
                    case "string":
                        _res.description = _data.content.data;
                        _res.title = shortenText(_data.content.data, 40);
                    break;
                }
                switch (_data.type) {
                    case "performance":
                        _res.color = '#ff8000';
                    break;
                    case "discussion":
                        _res.color = '#000080';
                    break;
                }
                _res.content = _data.content;
                _res.setMedia(_data.media);
                _res.setAnnotationType(_data.type);
                _res.setBegin(_data.begin);
                _res.setEnd(_data.end);
                return _res;
            }
        }
    },
    deSerialize : function(_data, _source) {
        if (typeof _data !== "object" || _data === null) {
            return;
        }
        IriSP._(this.types).forEach(function(_type, _typename) {
            var _listdata = _data[_type.serialized_name],
                _list = new IriSP.Model.List(_source.directory);
            if (typeof _listdata !== "undefined" && _listdata !== null) {
                if (_listdata.hasOwnProperty("length")) {
                    var _l = _listdata.length;
                    for (var _i = 0; _i < _l; _i++) {
                        var _element = _type.deserializer(_listdata[_i], _source);
                        if (typeof _element !== "undefined" && _element) {
                            _list.push(_element);
                        }
                    }
                } else {
                    var _element = _type.deserializer(_listdata, _source);
                    if (typeof _element !== "undefined" && _element) {
                        _list.push(_element);
                    }
                }
            }
            _source.addList(_typename, _list);
        });
        
        if (typeof _data.meta !== "undefined") {
            _source.projectId = _data.meta.id;
            _source.title = _data.meta["dc:title"] || _data.meta.title || "";
            _source.description = _data.meta["dc:description"] || _data.meta.description || "";
            _source.creator = _data.meta["dc:creator"] || _data.meta.creator || "";
            _source.contributor = _data.meta["dc:contributor"] || _data.meta.contributor || _source.creator;
            _source.created = IriSP.Model.isoToDate(_data.meta["dc:created"] || _data.meta.created);
        }
        
        if (typeof _data.meta !== "undefined" && typeof _data.meta.main_media !== "undefined" && typeof _data.meta.main_media["id-ref"] !== "undefined") {
            _source.currentMedia = _source.getElement(_data.meta.main_media["id-ref"]);
        }
    }
};

/* End of SPEL Serializer */