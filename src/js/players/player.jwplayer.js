/* To wrap a player the develop should create a new class derived from 
   the IriSP.PopcornReplacement.player and defining the correct functions */

/** jwplayer player wrapper */
IriSP.PopcornReplacement.jwplayer = function(container, options) {
    /* appel du parent pour initialiser les structures communes à tous les players */
    IriSP.PopcornReplacement.player.call(this, container, options);
  
    this.media.duration = options.duration; /* optional */
 
    var _player = jwplayer(this.container),
        _this = this;
  
  /* Définition des fonctions de l'API -  */
    this.playerFns = {
        play: function() { return _player.play(true); },
        pause: function() { return _player.pause(true); },
        getPosition: function() { return _player.getPosition(); },
        seek: function(pos) { return _player.seek(pos); },
        getMute: function() { return _player.getMute() },
        setMute: function(p) { return _player.setMute(p); },
        getVolume: function() { return _player.getVolume() / 100; },
        setVolume: function(p) { return _player.setVolume(Math.floor(100*p)); }
    }

    options.events = {
        onReady:  function() {
            _this.trigger("loadedmetadata");
        },
        onTime:   function() {
            _this.trigger("timeupdate");
        },
        onPlay:   function() {
            _this.trigger("play");
        },
        onPause:  function() {
            _this.trigger("pause");
        },
        onSeek:   function() {
            _this.trigger("seeked");
        }
    };

    _player.setup(options);
};

IriSP.PopcornReplacement.jwplayer.prototype = new IriSP.PopcornReplacement.player("", {});
