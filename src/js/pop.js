/* wrapper that simulates popcorn.js because
   popcorn is a bit unstable at the time */

Popcorn = {};
Popcorn.media = { "paused": true};

Popcorn.listen = function(msg, callback) {
  IriSP.jQuery(Popcorn).bind(msg, function(event, rest) { callback(rest); });
};

Popcorn.trigger = function(msg, params) {
  IriSP.jQuery(Popcorn).trigger(msg, params);
};

Popcorn.guid = function(prefix) {
  var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
   });

  return prefix + str;
};

Popcorn.__initApi = function() {
  Popcorn.trigger("timeupdate");
};

Popcorn.jwplayer = function(container, options) {
  Popcorn._container = container.slice(1); //eschew the '#'
  options.events = {
      onReady: Popcorn.__initApi,
      onTime: Popcorn.__timeHandler,
      onSeek: Popcorn.__seekHandler }
    
  jwplayer(Popcorn._container).setup(options);
  Popcorn.media.duration = options.duration;
  return Popcorn;
};

Popcorn.currentTime = function(time) {
  if (typeof(time) === "undefined") {
      return jwplayer(Popcorn._container).getPosition();            
  } else {
     var currentTime = +time;
     jwplayer( Popcorn._container ).seek( currentTime );
     return jwplayer(Popcorn._container).getPosition();            
  }
};

Popcorn.play = function() {
      Popcorn.media.paused = false;
//      Popcorn.trigger("play");
//      Popcorn.trigger("playing");
      jwplayer( Popcorn._container ).play();
};
    
Popcorn.pause = function() {
      if ( !Popcorn.media.paused ) {
        Popcorn.media.paused = true;
        Popcorn.trigger( "pause" );
        jwplayer( Popcorn._container ).pause();
      }
};

Popcorn.muted = function(val) {
  if (typeof(val) !== "undefined") {

    if (jwplayer(Popcorn._container).getMute() !== val) {
      if (val) {
        jwplayer(Popcorn._container).setMute(true);
      } else {
        jwplayer( Popcorn._container ).setMute(false);
      }

      Popcorn.trigger( "volumechange" );
    }
    
    return jwplayer( Popcorn._container ).getMute();
  } else {
    return jwplayer( Popcorn._container ).getMute();
  }
};

Popcorn.mute = Popcorn.muted;

Popcorn.__codes = [];
Popcorn.code = function(options) {
  Popcorn.__codes.push(options);
  return Popcorn;
};

Popcorn.__runCode = function() {
  var currentTime = jwplayer(Popcorn._container).getPosition();
  var i = 0;
  for(i = 0; i < Popcorn.__codes.length; i++) {
    var c = Popcorn.__codes[i];
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

Popcorn.__timeHandler = function(event) {
  var pos = event.position;

  var i = 0;
  for(i = 0; i < Popcorn.__codes.length; i++) {
     var c = Popcorn.__codes[i];
     
     if (pos >= c.start && pos < c.end && 
         pos - 0.1 <= c.start) {
        c.onStart();
     }
 
     if (pos >= c.start && pos >= c.end && 
         pos - 0.1 <= c.end) {
        c.onEnd();
     }
   
  }
 
  Popcorn.trigger("timeupdate");
};

Popcorn.__seekHandler = function(event) { 
  var i = 0;
  for(i = 0; i < Popcorn.__codes.length; i++) {
     var c = Popcorn.__codes[i];
    
     if (event.position >= c.start && event.position < c.end) {
        c.onEnd();
     }
    
     if (typeof(event.offset) === "undefined")
       event.offset = 0;
     if (event.offset >= c.start && event.offset < c.end) {
       c.onStart();
     }
     
   }

  Popcorn.trigger("timeupdate");
}


Popcorn.roundTime = function() {
  var currentTime = Popcorn.currentTime();
  return Math.round(currentTime);
};
