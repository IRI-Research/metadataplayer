/* site.js - all our site-dependent config : player chrome, cdn locations, etc...*/

IriSP.libdir = "/metadataplayer/src/js/libs/";
IriSP.jwplayer_swf_path = "/metadataplayer/test/libs/player.swf";
IriSP.platform_url = "http://192.168.56.101/pf";

IriSP.lib = { 
		jQuery : "http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js",
		jQueryUI : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/jquery-ui.js",
		jQueryToolTip : "http://cdn.jquerytools.org/1.2.4/all/jquery.tools.min.js",
		swfObject : "http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js",
		cssjQueryUI : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/themes/base/jquery-ui.css",
    popcorn : IriSP.libdir + "popcorn.js",
    jwplayer : IriSP.libdir + "jwplayer.js",
    popcornReplacement: IriSP.libdir + "pop.js",
    raphael: IriSP.libdir + "raphael.js",
    jquery_sparkline: IriSP.libdir + "jquery.sparkline.js",
    "popcorn.mediafragment" : IriSP.libdir + "popcorn.mediafragment.js",
    "popcorn.code" : IriSP.libdir + "popcorn.code.js",
    "popcorn.jwplayer": IriSP.libdir + "popcorn.jwplayer.js",
    "popcorn.youtube": IriSP.libdir + "popcorn.youtube.js"    
};

//Configuration for the player and utility functions.
IriSP.config = {};

IriSP.config.shortener = {
  // function to call to shorten an url.
  //shortening_function : IriSP.platform_shorten_url
};

IriSP.widgetsDefaults = {
  "LayoutManager" : {spacer_div_height : "0px" },
  "PlayerWidget" : {},
  "AnnotationsWidget": {
    "share_text" : "I'm watching ",     
    "fb_link" : "http://www.facebook.com/share.php?u=",
    "tw_link" : "http://twitter.com/home?status=",
    "gplus_link" : ""
    },
  "TweetsWidget" : {
      default_profile_picture : "https://si0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png",
      tweet_display_period: 10000, // how long do we show a tweet ?
      
  },
  "SliderWidget" : {
      minimize_period: 850 // how long does the slider stays maximized after the user leaves the zone ?
  },
  "createAnnotationWidget" : {
      keywords: ["#faux-raccord", "#mot-clef"],
      cinecast_version: true /* put to false to enable the platform version, true for the festival cinecast one. */
  },
  "SparklineWidget" : {
      column_width: 10 // the width of a column in pixels.
  },
  "Main" : {
      autoplay: true
  },
  "AnnotationsListWidget" : {
      ajax_mode: true, /* use ajax to get information about the annotations.
                         if set to false, only search in the annotations for the
                         current project. */
      ajax_url: IriSP.platform_url + "ldtplatform/api/ldt/segments/", /* partial
                                                                         url of 
                                                                         where to
                                                                         get the 
                                                                         ajax */
      ajax_granularity: 10000 /* how much ms should we look before and after the
                                 current timecode */
  }, 
};

IriSP.paths = {
//  "imgs": "/tweetlive/res/metadataplayer/src/css/imgs"
  "imgs": "/metadataplayer/src/css/imgs"
};
IriSP.default_templates_vars = {
  "img_dir" : IriSP.paths.imgs 
};

