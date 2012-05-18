/* Used when Putting annotations on the platform */

if (typeof IriSP.serializers === "undefined") {
    IriSP.serializers = {}
}

IriSP.serializers.ldt_annotate = {
    types :  {
        annotation : {
            serialized_name : "annotations",
            serializer : function(_data, _source) {
                return {
                    begin: _data.begin.milliseconds,
                    end: _data.end.milliseconds,
                    content: {
                        data: _data.description
                    },
                    tags: _data.getTagTexts(),
                    media: _source.unNamespace(_data.getMedia().id),
                    title: _data.title,
                    type_title: _data.getAnnotationType().title,
                    type: _source.unNamespace(_data.getAnnotationType().id)
                }
            }
        }
    },
    serialize : function(_source) {
        var _res = {},
            _this = this;
        _source.forEach(function(_list, _typename) {
            if (typeof _this.types[_typename] !== "undefined") {
                _res[_this.types[_typename].serialized_name] = _list.map(function(_el) {
                    return _this.types[_typename].serializer(_el, _source);
                });
            }
        });
        _res.meta = {
            creator: _source.creator,
            created: _source.created
        }
        return JSON.stringify(_res);
    }
}