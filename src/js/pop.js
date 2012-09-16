//TODO: Remove Popcorn replacement, replace it by Media Events

/* wrapper that simulates popcorn.js because
   popcorn is a bit unstable at the time */

/* Popcorn.code replacement has been disabled. It didn't work properly and was not even used  */

IriSP.PopcornReplacement = {  
};

/** base class for our popcorn-compatible players.
 */
IriSP.PopcornReplacement.player = function(container, options) {
  
    this.media = { 
        "paused": true,
        "muted": false
    };
    
    this.container = container.replace(/^#/,''); //remove '#' at beginning
    this.msgPump = {}; /* dictionnary used to receive and send messages */
    this._options = options;

};

IriSP.PopcornReplacement.player.prototype.listen = function(msg, callback) {
    if (!this.msgPump.hasOwnProperty(msg)) {
        this.msgPump[msg] = [];
    }
    this.msgPump[msg].push(callback);
};

IriSP.PopcornReplacement.player.prototype.on = IriSP.PopcornReplacement.player.prototype.listen;

IriSP.PopcornReplacement.player.prototype.trigger = function(msg, params) {
    if (!this.msgPump.hasOwnProperty(msg)) {
        return;
    }
    var d = this.msgPump[msg];
    for(var i = 0; i < d.length; i++) {
        d[i].call(window, params);
    }
};

IriSP.PopcornReplacement.player.prototype.emit = IriSP.PopcornReplacement.player.prototype.trigger;
/*
IriSP.PopcornReplacement.player.prototype.guid = function(prefix) {
  var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
   });

  return prefix + str;
};

/** init the api after that flash player has been setup - called by the callback
    defined by the embedded flash player 

IriSP.PopcornReplacement.player.prototype.__initApi = function() {
  this.trigger("loadedmetadata"); // we've done more than loading metadata of course,
                                                      // but popcorn doesn't need to know more.
  this.media.muted = this.playerFns.getMute();
  /* some programmed segments are supposed to be run at the beginning 
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
  this.playerFns.play();
};
    
IriSP.PopcornReplacement.player.prototype.pause = function() {
    this.media.paused = true;
    this.trigger("pause");
    this.playerFns.pause();
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

IriSP.PopcornReplacement.player.prototype.volume = function(val) {
    if (typeof this.playerFns.getVolume == "undefined" || typeof this.playerFns.setVolume == "undefined") {
        return false;
    }
    var _vol = this.playerFns.getVolume();
    if (typeof(val) !== "undefined" && parseFloat(val) !== NaN) {
        val = Math.max(0, Math.min(1, val));
        if (parseFloat(val) != parseFloat(_vol)) {
            this.playerFns.setVolume(val);
            this.trigger("volumechange");
            _vol = this.playerFns.getVolume();
        }
    }
    return _vol;
};

IriSP.PopcornReplacement.player.prototype.mute = function() {
    this.muted(true);
}

IriSP.PopcornReplacement.player.prototype.unmute = function() {
    this.muted(false);
}


IriSP.PopcornReplacement.player.prototype.roundTime = function() {
  var currentTime = this.currentTime();
  return Math.round(currentTime);
};