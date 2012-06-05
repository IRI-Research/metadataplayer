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
        jwPlayerSWF : "player.swf"
    },
    locations : {
        // use to define locations outside defautl_dir
    },
    cdn : {
        jQueryUI : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/jquery-ui.js",
        swfObject : "http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js",
        cssjQueryUI : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/themes/base/jquery-ui.css"
    },
    useCdn : false
}

IriSP.widgetsDir = 'widgets';

IriSP.widgetsRequirements = {
    Sparkline: {
        noCss: true,
        requires: "raphael"
    },
    Arrow: {
        noCss: true,
        requires: "raphael"
    },
    Mediafragment: {
        noCss: true
    },
    Trace : {
        noCss: true,
        requires: "tracemanager"
    }
}

IriSP.guiDefaults = {
    width : 640,            
    container : 'LdtPlayer',
    spacer_div_height : 0
}
