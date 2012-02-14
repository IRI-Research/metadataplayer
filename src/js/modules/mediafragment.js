/* mediafragment module */

IriSP.MediaFragment = function(Popcorn, config, Serializer) {
  IriSP.Module.call(this, Popcorn, config, Serializer);

  this.mutex = false; /* a mutex because we access the url from two different functions */

  this._Popcorn.listen( "loadedmetadata", IriSP.wrap(this,this.advanceTime));
  this._Popcorn.listen( "pause", IriSP.wrap(this,this.updateTime));
  this._Popcorn.listen( "seeked", IriSP.wrap(this,this.updateTime));
  this._Popcorn.listen( "IriSP.PolemicTweet.click", IriSP.wrap(this,this.updateAnnotation));
  this._Popcorn.listen( "IriSP.SegmentsWidget.click", IriSP.wrap(this,this.updateAnnotation));
  
  window.onhashchange = IriSP.wrap(this, this.advanceTime);
};

IriSP.MediaFragment.prototype = new IriSP.Module();

IriSP.MediaFragment.prototype.advanceTime = function() {
             var url = window.location.href;

              if ( url.split( "#" )[ 1 ] != null ) {
                  pageoffset = url.split( "#" )[1];

                  if ( pageoffset.substring(0, 2) === "t=") {
                    // timecode 
                    if ( pageoffset.substring( 2 ) != null ) {
                    var offsettime = pageoffset.substring( 2 );
                    this._Popcorn.currentTime( parseFloat(offsettime) );
                    
                    /* we have to trigger this signal manually because of a
                     bug in the jwplayer */
                    this._Popcorn.trigger("seeked", parseFloat(offsettime));
                    }
                  } else if ( pageoffset.substring(0, 3) === "id=") {
                    // annotation
                    var annotationId = pageoffset.substring( 3 );
                    // there's no better way than that because
                    // of possible race conditions
                    this._serializer.sync(IriSP.wrap(this, function() {
                          this.lookupAnnotation.call(this, annotationId); 
                          }));
                  }
              }
};

/** handler for the seeked signal. It may have or may have not an argument.
    @param time if not undefined, the time we're seeking to 
*/
IriSP.MediaFragment.prototype.updateTime = function(time) {
  if (this.mutex === true) {
    return;
  }

  var history = window.history;
  if ( !history.pushState ) {
    return false;
  }
    
  if (IriSP.null_or_undefined(time) || typeof(time) != "number") {
    var ntime = this._Popcorn.currentTime().toFixed(2)
  } else {
    var ntime = time.toFixed(2);
  }

  // used to relay the new hash to the embedder
  this._Popcorn.trigger("IriSP.Mediafragment.hashchange", "#t=" + ntime);
  
  splitArr = window.location.href.split( "#" )
  history.replaceState( {}, "", splitArr[0] + "#t=" + ntime );
};


IriSP.MediaFragment.prototype.updateAnnotation = function(annotationId) {
  var _this = this;
  this.mutex = true;

  var history = window.history;
  if ( !history.pushState ) {
    return false;
  }
 
  
  // used to relay the new hash to the embedder
  this._Popcorn.trigger("IriSP.Mediafragment.hashchange", "#id=" + annotationId);
  
  splitArr = window.location.href.split( "#" )
  history.replaceState( {}, "", splitArr[0] + "#id=" + annotationId);

  
  // reset the mutex afterwards to prevent the module from reacting to his own changes.
  window.setTimeout(function() { _this.mutex = false }, 50);
};

// lookup and seek to the beginning of an annotation
IriSP.MediaFragment.prototype.lookupAnnotation = function(annotationId) {
  var _this = this;
  this.mutex = true;

  var annotation = undefined;
  var annotations = this._serializer._data.annotations;

  var i;
  for (i = 0; i < annotations.length; i++) {
      if (annotations[i].id === annotationId) {
        annotation = annotations[i];
        break;
      }
  }

  if (typeof(annotation) !== "undefined") {
    this._Popcorn.currentTime(annotation.begin / 1000);

    /* we have to trigger this signal manually because of a
     bug in the jwplayer */
    this._Popcorn.trigger("seeked", annotation.begin / 1000);
    this._Popcorn.trigger("IriSP.Mediafragment.showAnnotation", annotationId);
  }
  
  window.setTimeout(function() { _this.mutex = false }, 50);
};
