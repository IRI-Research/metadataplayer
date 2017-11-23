/* Start of defaults.js */

IriSP.language = 'en';

IriSP.libFiles = {
    defaultDir : "js/libs/",
    inDefaultDir : {
        underscore : "underscore-min.js",
        Mustache : "mustache.js",
        jQuery : "jquery.min.js",
        jQueryUI : "jquery-ui.min.js",
        swfObject : "swfobject.js",
        cssjQueryUI : "jquery-ui.css",
        popcorn : "popcorn-complete.min.js",
        jwplayer : "jwplayer.js",
        raphael : "raphael-min.js",
        tracemanager : "tracemanager.js",
        jwPlayerSWF : "player.swf",
        json : "json2.js",
        zeroClipboardJs: "ZeroClipboard.js",
        zeroClipboardSwf: "ZeroClipboard.swf",
        backbone: "backbone.js",
        backboneRelational: "backbone-relational.js",
        paper: "paper.js",
        jqueryMousewheel: "jquery.mousewheel.min.js",
        splitter: "jquery.touchsplitter.js",
        cssSplitter: "jquery.touchsplitter.css",
        renkanPublish: "renkan.js",
        processing: "processing-1.3.6.min.js",
        recordMicSwf: "record_mic.swf",
        mousetrap: "mousetrap.min.js",
        mousetrapGlobal: "mousetrap-global-bind.js",
        markjs: "jquery.mark.min.js"
    },
    locations : {
        // use to define locations outside default_dir
    },
    cdn : {
        jQuery : "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js",
        jQueryUI : "http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.22/jquery-ui.min.js",
        swfObject : "http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js",
        cssjQueryUI : "http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.22/themes/ui-lightness/jquery-ui.css",
        underscore : "http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min.js",
        Mustache : "http://cdnjs.cloudflare.com/ajax/libs/mustache.js/0.5.0-dev/mustache.min.js",
        raphael : "http://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js",
        json : "http://cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js",
        popcorn: "http://cdn.popcornjs.org/code/dist/popcorn-complete.min.js"
    },
    useCdn : false
};

IriSP.widgetsDir = 'widgets';

IriSP.widgetsRequirements = {
    PopcornPlayer: {
        noCss: true,
        requires: [ "popcorn" ]
    },
    HtmlPlayer: {
        noCss: true
    },
    JwpPlayer: {
        noCss: true,
        requires: [ "jwplayer" ]
    },
    DailymotionPlayer: {
        noCss: true,
        requires: [ "swfObject" ]
    },
    AdaptivePlayer: {
        noCss: true
    },
    AutoPlayer: {
        noCss: true
    },
    AnnotationsList: {
        requires: [ "jwplayer" ]
    },
    Sparkline: {
        noCss: true,
        requires: [ "raphael" ]
    },
    Arrow: {
        noCss: true,
        requires: [ "raphael" ]
    },
    Mediafragment: {
        noCss: true
    },
    Trace : {
        noCss: true,
        requires: [ "tracemanager" ]
    },
    Slideshare: {
        requires: [ "swfObject" ]
    },
    Social: {
        requires: [ "zeroClipboardJs" ]
    },
    Renkan: {
        requires: [ "backbone", "backboneRelational", "paper", "jqueryMousewheel", "renkanPublish" ]
    },
    KnowledgeConcierge: {
        requires: [ "processing" ]
    },
    MultiSegments: {
        noCss: true
    },
    SlideVideoPlayer: {
        requires: [ "jQuery", "jQueryUI", "splitter" ]
    },
    Shortcuts: {
        requires: [ "mousetrap", "mousetrapGlobal" ]
    },
    EnrichedPlan: {
        requires: [ "markjs" ]
    }
};

IriSP.guiDefaults = {
    width : "100%",
    container : 'LdtPlayer',
    spacer_div_height : 0,
    widgets: []
};

/* End of defaults.js */
