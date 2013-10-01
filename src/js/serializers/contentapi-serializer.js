IriSP.serializers.content = {
    deSerialize : function(_data, _source) {
        var _medialist = new IriSP.Model.List(_source.directory);
        
        function deserializeObject(_m, i) {
            var _media = new IriSP.Model.Media(_m.iri_id, _source);
            _media.video = _m.media_url;
            _media.title = _m.title;
            _media.description = _m.description;
            _media.setDuration(_m.duration);
            _media.thumbnail = _m.image;
            _media.color = IriSP.vizcolors[i % IriSP.vizcolors.length];
            _media.keywords = _m.tags;
            _medialist.push(_media);
        }
        
        if (typeof _data.objects !== "undefined") {
            IriSP._(_data.objects).each(deserializeObject);
        } else {
            deserializeObject(_data, 0);
        }
        
        _source.addList("media", _medialist);
    }
};

/* END contentapi-serializer.js */
