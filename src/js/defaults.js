IriSP.language = 'en';

IriSP.libFiles = {
    defaultDir : "js/libs/",
    inDefaultDir : {
        underscore : "underscore.js",
        Mustache : "mustache.js",
        jQuery : "jquery.min.js",
        jQueryUI : "jquery-ui.min.js",
        swfObject : "swfobject.js",
        cssjQueryUI : "jquery-ui.css",
        popcorn : "popcorn.js",
        jwplayer : "jwplayer.js",
        raphael : "raphael.js",
        "popcorn.mediafragment" : "popcorn.mediafragment.js",
        "popcorn.code" : "popcorn.code.js",
        "popcorn.jwplayer" : "popcorn.jwplayer.js",
        "popcorn.youtube" : "popcorn.youtube.js",
        "tracemanager" : "tracemanager.js"
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

IriSP.guiDefaults = {
    width : 640,            
    container : 'LdtPlayer',
    spacer_div_height : 0
}

IriSP.widgetsDefaults = {
    "AnnotationsWidget" : {
        "share_text" : "I'm watching "
    },
    "TweetsWidget" : {
        default_profile_picture : "https://si0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png",
        tweet_display_period : 10000 // how long do we show a tweet ?
    },
    "SegmentsWidget" : {
        cinecast_version : false
    },
    "createAnnotationWidget" : {
        tags : [
            {
                "id" : "digitalstudies",
                "meta" : {
                    "description" : "#digital-studies"
                }
            },
            {
                "id" : "amateur",
                "meta" : {
                    "description" : "#amateur"
                },
            }
        ],
        remote_tags : false,
        random_tags : false,
        show_from_field : false,
        disable_share : false,
        polemic_mode : true, /* enable polemics ? */
        polemics : [{
            "className" : "positive",
            "keyword" : "++"
        }, {
            "className" : "negative",
            "keyword" : "--"
        }, {
            "className" : "reference",
            "keyword" : "=="
        }, {
            "className" : "question",
            "keyword" : "??"
        }],
        cinecast_version : false, /* put to false to enable the platform version, true for the festival cinecast one. */

        /* where does the widget PUT the annotations - this is a mustache template. id refers to the id of the media ans is filled
         by the widget.
         */
        api_endpoint_template : "", // platform_url + "/ldtplatform/api/ldt/annotations/{{id}}.json",
        api_method : "PUT"
    },
    "StackGraphWidget" : {
        defaultcolor : "#585858",
        tags : [
            {
                "keywords" : [ "++" ],
                "description" : "positif",
                "color" : "#1D973D"
            },
            {
                "keywords" : [ "--" ],
                "description" : "negatif",
                "color" : "#CE0A15"
            },
            {
                "keywords" : [ "==" ],
                "description" : "reference",
                "color" : "#C5A62D"  
            },
            {
                "keywords" : [ "??" ],
                "description" : "question",
                "color" : "#036AAE"
            }
        ],
        streamgraph : false
    }
}