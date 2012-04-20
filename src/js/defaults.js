IriSP.language = 'en';

IriSP.libFiles = {
    defaultDir : "js/libs/",
    inDefaultDir : {
        jQuery : "jquery.min.js",
        jQueryUI : "jquery-ui.min.js",
        jQueryToolTip : "jquery.tools.min.js",
        swfObject : "swfobject.js",
        //cssjQueryUI : "jquery-ui.css",
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
        jQueryToolTip : "http://cdn.jquerytools.org/1.2.4/all/jquery.tools.min.js",
        swfObject : "http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js",
        cssjQueryUI : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/themes/base/jquery-ui.css"
    },
    useCdn : false
}

IriSP.widgetsDefaults = {
    "LayoutManager" : {
        spacer_div_height : 0
    },
    "PlayerWidget" : {
        
    },
    "AnnotationsWidget" : {
        "share_text" : "I'm watching "
    },
    "TweetsWidget" : {
        default_profile_picture : "https://si0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png",
        tweet_display_period : 10000 // how long do we show a tweet ?
    },
    "SliderWidget" : {
        minimize_period : 850 // how long does the slider stays maximized after the user leaves the zone ?
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
        return_delay : 10000,
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
    "SparklineWidget" : {
       lineColor : "#7492b4",
       fillColor : "#aeaeb8",
       lineWidth : 2,
       cinecast_version : false
    },
    "AnnotationsListWidget" : {
        ajax_mode : true, /* use ajax to get information about the annotations.
         if set to false, only search in the annotations for the
         current project. */
        /* the platform generates some funky urls. We replace them afterwards to point to the
         correct place - this setting will probably be overwritten by the platform
         implementers.
         Note that the player has to replace the variables between {{ and }} by its own values.
         */
        ajax_url : "", //platform_url + "/ldtplatform/api/ldt/segments/{{media}}/{{begin}}/{{end}}",
        ajax_granularity : 10000, /* how much ms should we look before and after the current timecode */
        default_thumbnail : "http://ldt.iri.centrepompidou.fr/static/site/ldt/css/imgs/video_sequence.png",
        project_url : "", //platform_url + "/ldtplatform/ldt/front/player/"
        /* the beginning of a link to the new front */
        cinecast_version : false,
        refresh_interval : 10000
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