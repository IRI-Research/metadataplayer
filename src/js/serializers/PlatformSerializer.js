if (typeof IriSP.serializers === "undefined") {
    IriSP.serializers = {}
}

IriSP.serializers.platform = {
    types :  {
        media : {
            serialized_name : "medias",
            model_name : "media",
            deserializer : function(_data, _container) {
                var _res = new IriSP.Model.Media(_data.id, _container);
                _res.url = _data.href;
                _res.title = _data.meta["dc:title"];
                _res.description = _data.meta["dc:description"];
                _res.setDuration(_data.meta["dc:duration"]);
                return _res;        
            },
            serializer : function(_data, _container) {
                return {
                    id : _container.unNamespace(_data.id),
                    href : _data.url,
                    meta : {
                        "dc:title" : _data.title,
                        "dc:description" : _data.description,
                        "dc:duration" : _data.duration.milliseconds
                    }
                }
            }
        },
        tag : {
            serialized_name : "tags",
            model_name : "tag",
            deserializer : function(_data, _container) {
                var _res = new IriSP.Model.Tag(_data.id, _container);
                _res.title = _data.meta["dc:title"];
                return _res;        
            },
            serializer : function(_data, _container) {
                return {
                    id : _container.unNamespace(_data.id),
                    meta : {
                        "dc:title" : _data.title
                    }
                }
            }
        },
        annotationTypes : {
            serialized_name : "annotation-types",
            deserializer : function(_data, _container) {
                var _res = new IriSP.Model.AnnotationType(_data.id, _container);
                _res.title = _data["dc:title"];
                _res.description = _data["dc:description"];
                return _res;        
            },
            serializer : function(_data, _container) {
                return {
                    id : _container.unNamespace(_data.id),
                    "dc:title" : _data.title,
                    "dc:description" : _data.description
                }
            }
        },
        annotation : {
            serialized_name : "annotations",
            deserializer : function(_data, _container) {
                var _res = new IriSP.Model.Annotation(_data.id, _container);
                _res.title = _data.content.title;
                _res.description = _data.content.description;
                _res.created = IriSP.Model.isoToDate(_data.meta["dc:created"]);
                var _c = parseInt(_data.color).toString(16);
                while (_c.length < 6) {
                    _c = '0' + _c;
                }
                _res.color = '#' + _c;
                _res.setMedia(_data.media, _container);
                _res.setAnnotationType(_data.meta["id-ref"]);
                _res.setTags(IriSP._(_data.tags).pluck("id-ref"));
                _res.setBegin(_data.begin);
                _res.setEnd(_data.end);
                return _res;
            },
            serializer : function(_data, _container) {
                return {
                    id : _container.unNamespace(_data.id),
                    content : {
                        title : _data.title,
                        description : _data.description
                    },
                    media : _container.unNamespace(_data.media.contents),
                    meta : {
                        "id-ref" : _container.unNamespace(_data.annotationType.contents),
                        "dc:created" : IriSP.Model.dateToIso(_data.created)
                    },
                    tags : _data.getTags().map(function(_el, _id) {
                       return {
                           "id-ref" : _container.unNamespace(_id)
                       } 
                    })
                }
            }
        }
    },
    serialize : function(_container) {
        var _res = {},
            _this = this;
        _container.each(function(_list, _typename) {
            _res[_this.types[_typename].serialized_name] = _list.map(function(_el) {
                return _this.types[_typename].serializer(_el, _container);
            });
        });
        return _res;
    },
    deSerialize : function(_data, _container) {
        IriSP._(this.types).each(function(_type, _typename) {
            if (typeof _data[_type.serialized_name] !== "undefined") {
                var _list = new IriSP.Model.List(_container.directory);
                IriSP._(_data[_type.serialized_name]).each(function(_el) {
                    _list.addElement(_type.deserializer(_el, _container));
                });
                _container.addList(_typename, _list);
            }
        });
        
        if (typeof _data.meta !== "undefined" && typeof _data.meta.main_media !== "undefined" && typeof _data.meta.main_media["id-ref"] !== "undefined") {
            _container.setCurrentMediaId(_data.meta.main_media["id-ref"]);
        }
        _container.setDefaultCurrentMedia();
    }
}