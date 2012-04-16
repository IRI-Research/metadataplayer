if (typeof IriSP.serializers === "undefined") {
    IriSP.serializers = {}
}

IriSP.serializers.cinecast = {
    types :  {
        media : {
            serialized_name : "medias",
            model_name : "media",
            deserializer : function(_data, _source) {
                var _res = new IriSP.Model.Media(_data.id, _source);
                _res.url = _data.href;
                _res.title = _data.meta.title;
                _res.description = _data.meta.synopsis;
                _res.setDuration(_data.meta.duration);
                return _res;        
            },
            serializer : function(_data, _source) {
                return {
                    id : _source.unNamespace(_data.id),
                    url : _data.url,
                    meta : {
                        title : _data.title,
                        synopsis : _data.description,
                        duration : _data.duration.milliseconds
                    }
                }
            }
        },
        tag : {
            serialized_name : "tags",
            model_name : "tag",
            deserializer : function(_data, _source) {
                var _res = new IriSP.Model.Tag(_data.id, _source);
                _res.title = _data.meta.description;
                return _res;        
            },
            serializer : function(_data, _source) {
                return {
                    id : _source.unNamespace(_data.id),
                    meta : {
                        description : _data.title
                    }
                }
            }
        },
        annotationType : {
            serialized_name : "annotation_types",
            deserializer : function(_data, _source) {
                var _res = new IriSP.Model.AnnotationType(_data.id, _source);
                _res.title = _source.getNamespaced(_data.id).name;
                _res.description = _data.meta.description;
                return _res;        
            },
            serializer : function(_data, _source) {
                return {
                    id : _source.unNamespace(_data.id),
                    meta : {
                        description : _data.description
                    }
                }
            }
        },
        annotation : {
            serialized_name : "annotations",
            deserializer : function(_data, _source) {
                var _res = new IriSP.Model.Annotation(_data.id, _source);
                _res.title = _data.meta.creator_name;
                _res.description = _data.content.data;
                _res.created = IriSP.Model.isoToDate(_data.meta.created);
                var _c = parseInt(_data.color).toString(16);
                while (_c.length < 6) {
                    _c = '0' + _c;
                }
                _res.color = '#' + _c;
                _res.setMedia(_data.media, _source);
                _res.setAnnotationType(_data.type);
                _res.setTags(IriSP._(_data.tags).map(function(_t) {
                    if (typeof _source.contents.tag === "undefined") {
                        _source.contents.tag = new IriSP.Model.List(_source.directory);
                    }
                    if (_source.contents.tag.hasId(_t)) {
                        return _t;
                    } else {
                        var _id = _t.toLowerCase()
                            .replace(/#/g,'')
                            .replace(/^(\d)/,'_$1')
                            .replace(/[áâäàã]/g,'a')
                            .replace(/ç/g,'c')
                            .replace(/[éèêë]/g,'e')
                            .replace(/[íìîï]/g,'i')
                            .replace(/ñ/g,'n')
                            .replace(/[óòôöõ]/g,'o')
                            .replace(/œ/g,'oe')
                            .replace(/[úùûü]/g,'u')
                            .replace(/ÿ/g,'y')
                            .replace(/[^A-Za-z0-9_]/g,''),
                            _tag = new IriSP.Model.Tag(_id, _source);
                        _tag.title = _t;
                        _source.contents.tag.addElement(_tag);
                        return _id;
                    }
                }));
                _res.setBegin(_data.begin);
                _res.setEnd(_data.end);
                _res.creator = _data.meta.creator;
                return _res;
            },
            serializer : function(_data, _source) {
                return {
                    id : _source.unNamespace(_data.id),
                    content : {
                        data : _data.description
                    },
                    begin : _data.begin.milliseconds,
                    end : _data.begin.milliseconds,
                    media : _source.unNamespace(_data.media.contents),
                    type : _source.unNamespace(_data.annotationType.contents),
                    meta : {
                        created : IriSP.Model.dateToIso(_data.created),
                        creator : _data.creator,
                        creator_name : _data.title
                    },
                    tags : _data.getTags().map(function(_el) {
                        return _source.unNamespace(_el.id)
                    })
                }
            }
        }
    },
    serialize : function(_source) {
        var _res = {
                format : "http://advene.org/ns/cinelab/"
            },
            _this = this,
            _nsls = _source.listNamespaces(true);
        _res.imports = [];
        for (var _i = 0; _i < _nsls.length; _i++) {
           if (typeof _source.directory.namespaces[_nsls[_i]] !== "undefined") {
               _res.imports.push({
                   id : _nsls[_i],
                   url : _source.directory.namespaces[_nsls[_i]]
               })
           } 
        }
        _source.each(function(_list, _typename) {
            if (typeof _this.types[_typename] !== "undefined") {
                _res[_this.types[_typename].serialized_name] = _list.map(function(_el) {
                    return _this.types[_typename].serializer(_el, _source);
                });
            }
        });
        return _res;
    },
    deSerialize : function(_data, _source) {
        if (typeof _data.imports !== "undefined") {
            IriSP._(_data.imports).each(function(_import) {
                _source.directory.namespaces[_import.id] = _import.url;
            })
        }
        IriSP._(this.types).each(function(_type, _typename) {
            var _listdata = _data[_type.serialized_name];
            if (typeof _listdata !== "undefined") {
                var _list = new IriSP.Model.List(_source.directory);
                if (_listdata.hasOwnProperty("length")) {
                    var _l = _listdata.length;
                    for (var _i = 0; _i < _l; _i++) {
                        _list.addElement(_type.deserializer(_listdata[_i], _source));
                    }
                } else {
                    _list.addElement(_type.deserializer(_listdata, _source));
                }
                _source.addList(_typename, _list);
            }
        });
        
        if (typeof _data.meta !== "undefined" && typeof _data.meta.main_media !== "undefined" && typeof _data.meta.main_media["id-ref"] !== "undefined") {
            _source.setCurrentMediaId(_data.meta.main_media["id-ref"]);
        }
        _source.setDefaultCurrentMedia();
    }
}