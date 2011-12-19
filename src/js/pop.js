/* wrapper that simulates popcorn.js because
   popcorn is a bit unstable at the time */

IriSP.PopcornReplacement = {
  msgPump : {} /* used by jquery to receive and send messages */
};

IriSP.PopcornReplacement.media = { 
  "paused": true,
  "muted": false
};

IriSP.PopcornReplacement.listen = function(msg, callback) {
//  IriSP.jQuery(IriSP.PopcornReplacement.msgPump).bind(msg, function(event, rest) { callback(rest); });
  if (!IriSP.PopcornReplacement.msgPump.hasOwnProperty(msg))
    IriSP.PopcornReplacement.msgPump[msg] = [];

  IriSP.PopcornReplacement.msgPump[msg].push(callback);
};

IriSP.PopcornReplacement.trigger = function(msg, params) {
//  IriSP.jQuery(IriSP.PopcornReplacement.msgPump).trigger(msg, params);
  
  if (!IriSP.PopcornReplacement.msgPump.hasOwnProperty(msg))
    return;

  var d = IriSP.PopcornReplacement.msgPump[msg];
  for(var entry in d) {
    d[entry].call(window, params);
  }

};

IriSP.PopcornReplacement.guid = function(prefix) {
  var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
   });

  return prefix + str;
};

IriSP.PopcornReplacement.__initApi = function() {
  IriSP.PopcornReplacement.trigger("loadedmetadata"); // we've done more than loading metadata of course,
                                                      // but popcorn doesn't need to know more.
  IriSP.PopcornReplacement.media.muted = jwplayer(IriSP.PopcornReplacement._container).getMute();
};

IriSP.PopcornReplacement.jwplayer = function(container, options) {
  IriSP.PopcornReplacement._container = container.slice(1); //eschew the '#'
  options.events = {
      onReady: IriSP.PopcornReplacement.__initApi,
      onTime: IriSP.PopcornReplacement.__timeHandler,
      onPlay: IriSP.PopcornReplacement.__playHandler,
      onPause: IriSP.PopcornReplacement.__pauseHandler,
      onSeek: IriSP.PopcornReplacement.__seekHandler 
      }
    
  jwplayer(IriSP.PopcornReplacement._container).setup(options);
  IriSP.PopcornReplacement.media.duration = options.duration;
  return IriSP.PopcornReplacement;
};

IriSP.PopcornReplacement.currentTime = function(time) {
  if (typeof(time) === "undefined") {
      return jwplayer(IriSP.PopcornReplacement._container).getPosition();            
  } else {
     var currentTime = +time;
     jwplayer( IriSP.PopcornReplacement._container ).seek( currentTime );
     IriSP.PopcornReplacement.trigger("seeked");
     return jwplayer(IriSP.PopcornReplacement._container).getPosition();            
  }
};

IriSP.PopcornReplacement.play = function() {
      IriSP.PopcornReplacement.media.paused = false;
      IriSP.PopcornReplacement.trigger("play");
//      IriSP.PopcornReplacement.trigger("playing");
      jwplayer( IriSP.PopcornReplacement._container ).play();
};
    
IriSP.PopcornReplacement.pause = function() {
      if ( !IriSP.PopcornReplacement.media.paused ) {
        IriSP.PopcornReplacement.media.paused = true;
        IriSP.PopcornReplacement.trigger( "pause" );
        jwplayer( IriSP.PopcornReplacement._container ).pause();
      }
};

IriSP.PopcornReplacement.muted = function(val) {
  if (typeof(val) !== "undefined") {

    if (jwplayer(IriSP.PopcornReplacement._container).getMute() !== val) {
      if (val) {
        jwplayer(IriSP.PopcornReplacement._container).setMute(true);
        IriSP.PopcornReplacement.media.muted = true;
      } else {
        jwplayer( IriSP.PopcornReplacement._container ).setMute(false);
        IriSP.PopcornReplacement.media.muted = false;
      }

      IriSP.PopcornReplacement.trigger( "volumechange" );
    }
    
    return jwplayer( IriSP.PopcornReplacement._container ).getMute();
  } else {
    return jwplayer( IriSP.PopcornReplacement._container ).getMute();
  }
};

IriSP.PopcornReplacement.mute = IriSP.PopcornReplacement.muted;

IriSP.PopcornReplacement.__codes = [];
IriSP.PopcornReplacement.code = function(options) {
  IriSP.PopcornReplacement.__codes.push(options);
  return IriSP.PopcornReplacement;
};

IriSP.PopcornReplacement.__runCode = function() {
  var currentTime = jwplayer(IriSP.PopcornReplacement._container).getPosition();
  var i = 0;
  for(i = 0; i < IriSP.PopcornReplacement.__codes.length; i++) {
    var c = IriSP.PopcornReplacement.__codes[i];
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

IriSP.PopcornReplacement.__timeHandler = function(event) {
  var pos = event.position;

  var i = 0;
  for(i = 0; i < IriSP.PopcornReplacement.__codes.length; i++) {
     var c = IriSP.PopcornReplacement.__codes[i];
     
     if (pos >= c.start && pos < c.end && 
         pos - 0.1 <= c.start) {       
        c.onStart();
     }
 
     if (pos > c.start && pos > c.end && 
         pos - 0.1 <= c.end) {
         console.log("eonedn");
        c.onEnd();
     }
   
  }
 
  IriSP.PopcornReplacement.trigger("timeupdate");
};

IriSP.PopcornReplacement.__seekHandler = function(event) {
  console.log(IriSP.PopcornReplacement.__codes.length);
  
  var i = 0;
  
  for(i = 0; i < IriSP.PopcornReplacement.__codes.length; i++) {
     var c = IriSP.PopcornReplacement.__codes[i];
    
     if (event.position >= c.start && event.position < c.end) {        
        c.onEnd();
     }         
   }

   for(i = 0; i < IriSP.PopcornReplacement.__codes.length; i++) {
     var c = IriSP.PopcornReplacement.__codes[i];

     if (typeof(event.offset) === "undefined")
       event.offset = 0;
           
     if (event.offset >= c.start && event.offset < c.end) { 
       c.onStart();
     }
     
   }

  IriSP.PopcornReplacement.trigger("timeupdate");
};


IriSP.PopcornReplacement.__playHandler = function(event) {
  IriSP.PopcornReplacement.media.paused = false;
  IriSP.PopcornReplacement.trigger("play");
};

IriSP.PopcornReplacement.__pauseHandler = function(event) {
  IriSP.PopcornReplacement.media.paused = true;
  IriSP.PopcornReplacement.trigger("pause");
};

IriSP.PopcornReplacement.roundTime = function() {
  var currentTime = IriSP.PopcornReplacement.currentTime();
  return Math.round(currentTime);
};
