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
                    this._Popcorn.currentTime( parseFloat( offsettime ) );
                    }
                  } else if ( pageoffset.substring(0, 3) === "id=") {
                    // annotation
                    var annotationId = pageoffset.substring( 2 );

                    // there's no better way than that because
                    // of possible race conditions
                    this._serializer.sync(IriSP.wrap(this, function() {
                          this.lookupAnnotation.call(this, annotationId); 
                          }));
                  }
              }
};

IriSP.MediaFragment.prototype.updateTime = function() {
  if (this.mutex === true) {
    return;
  }

  var history = window.history;
  if ( !history.pushState ) {
    return false;
  }
  
  splitArr = window.location.href.split( "#" )
  history.replaceState( {}, "", splitArr[0] + "#t=" + this._Popcorn.currentTime().toFixed( 2 ) );
};


IriSP.MediaFragment.prototype.updateAnnotation = function(annotationId) {
  var _this = this;
  this.mutex = true;

  var history = window.history;
  if ( !history.pushState ) {
    return false;
  }
  
  splitArr = window.location.href.split( "#" )
  history.replaceState( {}, "", splitArr[0] + "#id=" + annotationId);
 
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
    this._Popcorn.trigger("IriSP.Mediafragment.showAnnotation", annotationId);
  }
  
  window.setTimeout(function() { _this.mutex = false }, 50);
};
