/* wrapper that simulates popcorn.js because
   popcorn is a bit unstable at the time */

IriSP.PopcornReplacement = {  
};

/** base class for our popcorn-compatible players.
 */
IriSP.PopcornReplacement.player = function(container, options) {
  /* the jwplayer calls the callbacks in the global space so we need to 
     preserve them using IriSP.wrap */
  this.callbacks = {
      onReady:  IriSP.wrap(this, this.__initApi),
      onTime:   IriSP.wrap(this, this.__timeHandler),
      onPlay:   IriSP.wrap(this, this.__playHandler),
      onPause:  IriSP.wrap(this, this.__pauseHandler),
      onSeek:   IriSP.wrap(this, this.__seekHandler) 
  };
  
  this.media = { 
    "paused": true,
    "muted": false
  };
    
  this.container = container.slice(1); //eschew the '#'
  
  this.msgPump = {}; /* dictionnary used to receive and send messages */
  this.__codes = []; /* used to schedule the execution of a piece of code in 
                        a segment (similar to the popcorn.code plugin). */
                          
};

IriSP.PopcornReplacement.player.prototype.listen = function(msg, callback) {
  if (!this.msgPump.hasOwnProperty(msg))
    this.msgPump[msg] = [];

  this.msgPump[msg].push(callback);
};

IriSP.PopcornReplacement.player.prototype.trigger = function(msg, params) {
  if (!this.msgPump.hasOwnProperty(msg))
    return;

  var d = this.msgPump[msg];

  for(var i = 0; i < d.length; i++) {
    d[i].call(window, params);
  }

};

IriSP.PopcornReplacement.player.prototype.guid = function(prefix) {
  var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
   });

  return prefix + str;
};

/** init the api after that flash player has been setup - called by the callback
    defined by the embedded flash player 
*/
IriSP.PopcornReplacement.player.prototype.__initApi = function() {
  this.trigger("loadedmetadata"); // we've done more than loading metadata of course,
                                                      // but popcorn doesn't need to know more.
  this.media.muted = this.playerFns.getMute();
  /* some programmed segments are supposed to be run at the beginning */
  var i = 0;
  for(i = 0; i < this.__codes.length; i++) {
    var c = this.__codes[i];
    if (0 == c.start) {
      c.onStart();
    }
    
    if (0 == c.end) {
      c.onEnd();
    }
  }
};

/*
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
*/

IriSP.PopcornReplacement.player.prototype.currentTime = function(time) {
  if (typeof(time) === "undefined") {        
      return this.playerFns.getPosition();            
  } else {
     var currentTime = +time;
     this.playerFns.seek(currentTime);              
     return currentTime;
  }
};

IriSP.PopcornReplacement.player.prototype.play = function() {
  this.media.paused = false;
  this.trigger("play");
  //IriSP.PopcornReplacement.trigger("playing");
  this.playerFns.play();
};
    
IriSP.PopcornReplacement.player.prototype.pause = function() {
  if ( !this.media.paused ) {
    this.media.paused = true;
    this.trigger( "pause" );
    this.playerFns.pause();
  }
};

IriSP.PopcornReplacement.player.prototype.muted = function(val) {
  if (typeof(val) !== "undefined") {

    if (this.playerFns.getMute() !== val) {
      if (val) {
        this.playerFns.setMute(true);
        this.media.muted = true;
      } else {
        this.playerFns.setMute(false);
        this.media.muted = false;
      }

      this.trigger( "volumechange" );
    }
    
    return this.playerFns.getMute();
  } else {
    return this.playerFns.getMute();
  }
};

IriSP.PopcornReplacement.player.prototype.mute = IriSP.PopcornReplacement.player.prototype.muted;

IriSP.PopcornReplacement.player.prototype.code = function(options) {
  this.__codes.push(options);
  return this;
};

/* called everytime the player updates itself 
   (onTime event)
 */

IriSP.PopcornReplacement.player.prototype.__timeHandler = function(event) {
  var pos = event.position;

  var i = 0;
  for(i = 0; i < this.__codes.length; i++) {
     var c = this.__codes[i];

     if (pos >= c.start && pos < c.end && 
         pos - 1 <= c.start) {       
        c.onStart();
     }
 
     if (pos > c.start && pos > c.end && 
         pos - 1 <= c.end) {
         c.onEnd();
     }
   
  }
 
  this.trigger("timeupdate");
};

IriSP.PopcornReplacement.player.prototype.__seekHandler = function(event) {
  var i = 0;
  
  for(i = 0; i < this.__codes.length; i++) {
     var c = this.__codes[i];
    
     if (event.position >= c.start && event.position < c.end) {        
        c.onEnd();
     }         
   }
  
   for(i = 0; i < this.__codes.length; i++) {
     var c = this.__codes[i];

     if (typeof(event.offset) === "undefined")
       event.offset = 0;
           
     if (event.offset >= c.start && event.offset < c.end) { 
       c.onStart();
     }
     
   }
  
  this.trigger("seeked", event.offset);  
};

IriSP.PopcornReplacement.player.prototype.__playHandler = function(event) {
  this.media.paused = false;
  this.trigger("play");
};

IriSP.PopcornReplacement.player.prototype.__pauseHandler = function(event) {
  this.media.paused = true;
  this.trigger("pause");
};

IriSP.PopcornReplacement.player.prototype.roundTime = function() {
  var currentTime = this.currentTime();
  return Math.round(currentTime);
};