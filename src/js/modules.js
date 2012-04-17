/* modules are non-graphical entities, similar to widgets */

// TODO: Unify widgets and modules

IriSP.Module = function(Popcorn, config, Serializer) {

  if (config === undefined || config === null) {
    config = {}
  }
  
  this._Popcorn = Popcorn;
  this._config = config;  
  this._serializer = Serializer;
};
