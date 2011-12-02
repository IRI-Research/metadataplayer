/* wrapper that simulates popcorn.js because
   popcorn is a bit unstable at the time */

Popcorn = {};
Popcorn.listen = function(msg, callback) {
  IriSP.jQuery(Popcorn).bind(msg, callback);
};

Popcorn.trigger = function(msg, params) {
  IriSP.jQuery(msg, params);
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
  Popcorn._container = container;
  options.events = {
      onReady: Popcorn.__initApi
    };
    
  jwplayer(Popcorn._container).setup(options);

};

Popcorn.currentTime = function(time) {
  if (typeof(time) === "undefined") {
      return jwplayer(Popcorn._container).getPosition();            
  } else {
     var currentTime = +time;
     media.dispatchEvent( "seeked" );
     media.dispatchEvent( "timeupdate" );
     jwplayer( Popcorn._container ).seek( currentTime );
     return jwplayer(Popcorn._container).getPosition();            
  }
};

Popcorn.play = function() {
      Popcorn.paused = false;
      Popcorn.trigger("play");
      Popcorn.trigger("playing");
      jwplayer( Popcorn._container ).play();
};
    
Popcorn.pause = function() {
      if ( !media.paused ) {
        media.paused = true;
        Popcorn.trigger( "pause" );
        jwplayer( Popcorn._container ).pause();
      }
};

Popcorn.muted = function(val) {
  if (typeof(val) !== "undefined") {
    if ( jwplayer( Popcorn._container ).getMute() !== val ) {
      if ( val ) {
        jwplayer( Popcorn._container ).setMute(true);
      } else {
        jwplayer( Popcorn._container ).setMute(false);
      }

      media.dispatchEvent( "volumechange" );
    }
    
    return jwplayer( Popcorn._container ).getMute();
  } else {
    return jwplayer( Popcorn._container ).getMute();
  }
});


