/* wrapper that simulates popcorn.js because
   popcorn is a bit unstable at the time */

PopcornReplacement = {};
PopcornReplacement.media = { "paused": true};

PopcornReplacement.listen = function(msg, callback) {
  IriSP.jQuery(PopcornReplacement).bind(msg, function(event, rest) { callback(rest); });
};

PopcornReplacement.trigger = function(msg, params) {
  IriSP.jQuery(PopcornReplacement).trigger(msg, params);
};

PopcornReplacement.guid = function(prefix) {
  var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
   });

  return prefix + str;
};

PopcornReplacement.__initApi = function() {
  PopcornReplacement.trigger("timeupdate");
};

PopcornReplacement.jwplayer = function(container, options) {
  PopcornReplacement._container = container.slice(1); //eschew the '#'
  options.events = {
      onReady: PopcornReplacement.__initApi,
      onTime: PopcornReplacement.__timeHandler,
      onSeek: PopcornReplacement.__seekHandler }
    
  jwplayer(PopcornReplacement._container).setup(options);
  PopcornReplacement.media.duration = options.duration;
  return PopcornReplacement;
};

PopcornReplacement.currentTime = function(time) {
  if (typeof(time) === "undefined") {
      return jwplayer(PopcornReplacement._container).getPosition();            
  } else {
     var currentTime = +time;
     jwplayer( PopcornReplacement._container ).seek( currentTime );
     return jwplayer(PopcornReplacement._container).getPosition();            
  }
};

PopcornReplacement.play = function() {
      PopcornReplacement.media.paused = false;
//      PopcornReplacement.trigger("play");
//      PopcornReplacement.trigger("playing");
      jwplayer( PopcornReplacement._container ).play();
};
    
PopcornReplacement.pause = function() {
      if ( !PopcornReplacement.media.paused ) {
        PopcornReplacement.media.paused = true;
        PopcornReplacement.trigger( "pause" );
        jwplayer( PopcornReplacement._container ).pause();
      }
};

PopcornReplacement.muted = function(val) {
  if (typeof(val) !== "undefined") {

    if (jwplayer(PopcornReplacement._container).getMute() !== val) {
      if (val) {
        jwplayer(PopcornReplacement._container).setMute(true);
      } else {
        jwplayer( PopcornReplacement._container ).setMute(false);
      }

      PopcornReplacement.trigger( "volumechange" );
    }
    
    return jwplayer( PopcornReplacement._container ).getMute();
  } else {
    return jwplayer( PopcornReplacement._container ).getMute();
  }
};

PopcornReplacement.mute = PopcornReplacement.muted;

PopcornReplacement.__codes = [];
PopcornReplacement.code = function(options) {
  PopcornReplacement.__codes.push(options);
  return PopcornReplacement;
};

PopcornReplacement.__runCode = function() {
  var currentTime = jwplayer(PopcornReplacement._container).getPosition();
  var i = 0;
  for(i = 0; i < PopcornReplacement.__codes.length; i++) {
    var c = PopcornReplacement.__codes[i];
    if (currentTime == c.start) {
      c.onStart();
    }
    
    if (currentTime == c.end) {
      c.onEnd();
    }

  }
};

/* called everytime the player updates itself 
   (onTime event)
 */

PopcornReplacement.__timeHandler = function(event) {
  var pos = event.position;

  var i = 0;
  for(i = 0; i < PopcornReplacement.__codes.length; i++) {
     var c = PopcornReplacement.__codes[i];
     
     if (pos >= c.start && pos < c.end && 
         pos - 0.1 <= c.start) {
        c.onStart();
     }
 
     if (pos >= c.start && pos >= c.end && 
         pos - 0.1 <= c.end) {
        c.onEnd();
     }
   
  }
 
  PopcornReplacement.trigger("timeupdate");
};

PopcornReplacement.__seekHandler = function(event) { 
  var i = 0;
  for(i = 0; i < PopcornReplacement.__codes.length; i++) {
     var c = PopcornReplacement.__codes[i];
    
     if (event.position >= c.start && event.position < c.end) {
        c.onEnd();
     }
    
     if (typeof(event.offset) === "undefined")
       event.offset = 0;
     if (event.offset >= c.start && event.offset < c.end) {
       c.onStart();
     }
     
   }

  PopcornReplacement.trigger("timeupdate");
}


PopcornReplacement.roundTime = function() {
  var currentTime = PopcornReplacement.currentTime();
  return Math.round(currentTime);
};
