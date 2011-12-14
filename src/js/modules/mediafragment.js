/* mediafragment module */

IriSP.MediaFragment = function(Popcorn, config, Serializer) {
  IriSP.Module.call(this, Popcorn, config, Serializer);

  this._Popcorn.listen( "loadedmetadata", IriSP.wrap(this, IriSP.MediaFragment.advanceTime));
//  this._Popcorn.listen( "pause", IriSP.wrap(this, IriSP.MediaFragment.updateTime));
//  this._Popcorn.listen( "seeked", IriSP.wrap(this, IriSP.MediaFragment.updateTime));
  this._Popcorn.listen( "IriSP.PolemicTweet.click", IriSP.wrap(this, IriSP.MediaFragment.updateAnnotation));
  this._Popcorn.listen( "IriSP.SegmentsWidget.click", IriSP.wrap(this, IriSP.MediaFragment.updateAnnotation));
};

IriSP.MediaFragment.advanceTime = function() {
             var url = window.location.href;

              if ( url.split( "#" )[ 1 ] != null ) {
                  pageoffset = url.split( "#" )[1];

                  if ( pageoffset.substring(0, 2) === "t=") {
                    // timecode 
                    if ( pageoffset.substring( 2 ) != null ) {
                    var offsettime = pageoffset.substring( 2 );
                    this._Popcorn.currentTime( parseFloat( offsettime ) );
                    }
                  } else if ( pageoffset.substring(0, 2) === "a=") {
                    // annotation
                    var annotationId = pageoffset.substring( 2 );

                    // there's no better way than that because
                    // of possible race conditions
                    this._serializer.sync(IriSP.wrap(this, function() {
                          IriSP.MediaFragment.lookupAnnotation.call(this, annotationId); 
                          }));
                  }
              }
};

IriSP.MediaFragment.updateTime = function() {
  var history = window.history;
  if ( !history.pushState ) {
    return false;
  }
  
  splitArr = window.location.href.split( "#" )
  history.replaceState( {}, "", splitArr[0] + "#t=" + this._Popcorn.currentTime().toFixed( 2 ) );
};


IriSP.MediaFragment.updateAnnotation = function(annotationId) {
  var history = window.history;
  if ( !history.pushState ) {
    return false;
  }
  
  splitArr = window.location.href.split( "#" )
  history.replaceState( {}, "", splitArr[0] + "#a=" + annotationId);
 
};

// lookup and seek to the beginning of an annotation
IriSP.MediaFragment.lookupAnnotation = function(annotationId) {
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
  }
};
