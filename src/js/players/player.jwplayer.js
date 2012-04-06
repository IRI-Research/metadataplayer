/* To wrap a player the develop should create a new class derived from 
   the IriSP.PopcornReplacement.player and defining the correct functions */

/** jwplayer player wrapper */
IriSP.PopcornReplacement.jwplayer = function(container, options) {
  /* appel du parent pour initialiser les structures communes à tous les players */
  IriSP.PopcornReplacement.player.call(this, container, options);
  
  this.media.duration = options.duration; /* optional */
  
  /* Définition des fonctions de l'API -  */
  this.playerFns = {
    play: function() { return jwplayer(this.container).play(); },
    pause: function() { return jwplayer(this.container).pause(); },
    getPosition: function() { return jwplayer(this.container).getPosition(); },
    seek: function(pos) { return jwplayer(this.container).seek(pos); },
    getMute: function() { return jwplayer(this.container).getMute() },
    setMute: function(p) { return jwplayer(this.container).setMute(p); },
    getVolume: function() { return jwplayer(this.container).getVolume() / 100; },
    setVolume: function(p) { return jwplayer(this.container).setVolume(Math.floor(100*p)); }
  }

  options.events = this.callbacks;

  jwplayer(this.container).setup(options);
};

IriSP.PopcornReplacement.jwplayer.prototype = new IriSP.PopcornReplacement.player("", {});
