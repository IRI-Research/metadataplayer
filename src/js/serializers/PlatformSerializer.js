if (typeof IriSP.serializers === "undefined") {
    IriSP.serializers = {}
}

IriSP.serializers.platform = {
    deSerialize : function(_data, _container) {
        
        var _types = [
            {
                serialized_name : "medias",
                model_name : "media",
                deserializer : function(_data) {
                    var _res = new IriSP.Model.Media(_data.id, _container);
                    _res.url = _data.href;
                    _res.title = _data.meta["dc:title"];
                    _res.description = _data.meta["dc:description"];
                    _res.setDuration(_data.meta["dc:duration"]);
                    return _res;        
                }
            },
            {
                serialized_name : "tags",
                model_name : "tag",
                deserializer : function(_data) {
                    var _res = new IriSP.Model.Tag(_data.id, _container);
                    _res.title = _data["dc:title"];
                    return _res;        
                }
            },
            {
                serialized_name : "annotation-types",
                model_name : "annotationType",
                deserializer : function(_data) {
                    var _res = new IriSP.Model.AnnotationType(_data.id, _container);
                    _res.title = _data["dc:title"];
                    _res.description = _data["dc:description"];
                    return _res;        
                }
            },
            {
                serialized_name : "annotations",
                model_name : "annotation",
                deserializer : function(_data) {
                    var _res = new IriSP.Model.Annotation(_data.id, _container);
                    _res.title = _data.content.title;
                    _res.description = _data.content.description;
                    _res.setMedia(_data.media, _container);
                    _res.setAnnotationType(_data.meta["id-ref"]);
                    _res.setTags(IriSP._(_data.tags).pluck("id-ref"));
                    _res.setBegin(_data.begin);
                    _res.setEnd(_data.end);
                    return _res;
                }
            }
        ];
        
        IriSP._(_types).each(function(_type) {
            if (typeof _data[_type.serialized_name] !== "undefined") {
                var _list = new IriSP.Model.List(_container.directory);
                IriSP._(_data[_type.serialized_name]).each(function(_el) {
                    _list.addElement(_type.deserializer(_el));
                });
                _container.addList(_type.model_name, _list);
            }
        });
        
        if (typeof _data.meta !== "undefined" && typeof _data.meta.main_media !== "undefined" && typeof _data.meta.main_media["id-ref"] !== "undefined") {
            _container.setCurrentMediaId(_data.meta.main_media["id-ref"]);
        }
        _container.setDefaultCurrentMedia();
    }
}