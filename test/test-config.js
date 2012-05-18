function testConfig(_urlMetadata, _useLocalBuild) {
    document.getElementById('LdtPlayer').innerHTML = '';
    _useLocalBuild = (typeof _useLocalBuild !== "undefined" && _useLocalBuild)
    IriSP.libFiles.defaultDir = _useLocalBuild ? "libs/" : "../src/js/libs/";
    IriSP.widgetsDir = _useLocalBuild ? "metadataplayer" : "../src/widgets";
    var _metadata = {
        url: _urlMetadata,
        format: 'ldt'
    };
    var _config = {            
        gui: {
            width : 620,
            container : 'LdtPlayer',
            default_options: {
                metadata: _metadata
            },
            css : _useLocalBuild ? 'metadataplayer/LdtPlayer-core.css' : '../src/css/LdtPlayer-core.css',
            widgets: [
                { type: "Sparkline" },
                { type: "Slider" },
                { type: "Controller" },
                { type: "Polemic" },
                { type: "Segments" },
                { type: "Slice" },
                { type: "Arrow" },
                { type: "Annotation" },
                { type: "CreateAnnotation" },
                { type: "Tweet" },
                { type: "Tagcloud" },
                {
                    type: "AnnotationsList",
                    container: "AnnotationsListContainer"
                },
                { type: "Mediafragment"}
            ]
        },
        player:{
            type:'auto',
            live: true, 
            height: 350, 
            width: 620, 
            provider: "rtmp",
            autostart: true
        }
    };
    
    return new IriSP.Metadataplayer(_config, _metadata);
}