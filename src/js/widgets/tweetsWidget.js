/* a widget that displays tweet - used in conjunction with the polemicWidget */

IriSP.TweetsWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  
  /* this is a bit complex : we use a list to queue the tweets to display, for
     two reasons :
     - first, We want the pane to retract when there's no tweets to see - it's doable
       but it would lead for race conditions - imagine that the user clicks on a tweet
       and wants it displayed, it would display in an empty pane
     - second case, the pane displays a tweet and the user clicks before that the tweet
       has finished displaying - he wants his tweet to be displayed now, not after the
       previous tweet has finished.
       
     So, we queue every tweet in a message queue, which gets consumed at every call of
     displayTweet.
  */
  this._messageQueue = [];
  
  /* a variable for an edge case : when the user has clicked on a tweet and clicks on another
     one before that the first has been cleared. In this case, the second one will be displayed
     but cleared before its time.
  */
  this._tweetClearedBeforeEnd = false;
};


IriSP.TweetsWidget.prototype = new IriSP.Widget();


IriSP.TweetsWidget.prototype.displayTweet = function(annotation) {
    
    var title = annotation.content.title;
    var img = annotation.content.img.src;
    if (typeof(img) === "undefined" || img === "" || img === "None") {
      img = IriSP.widgetsDefaults.TweetsWidget.default_profile_picture;
    }
    
    var imageMarkup = Mustache.to_html("<img src='{{src}}' alt='avatar'></img>", 
                                       {src : img});

    this.selector.find(".Ldt-tweetContents").text(title);
    this.selector.find(".Ldt-tweetAvatar").html(imageMarkup);
    this.selector.show(50);
};

IriSP.TweetsWidget.prototype.pushQueue = function(annotation) {
  this._messageQueue.push(annotation);
  
  // we're pushing in the queue before another tweet has been
  // displayed
  if (this._messageQueue.length != 0)
    this._tweetClearedBeforeEnd = true;
    
  var annotation = this._messageQueue[0];
  
  this.displayTweet(annotation);

  var time = this._Popcorn.currentTime();
  this._Popcorn = this._Popcorn.code({ start : time + 0.1, end: time + 10, 
                                       onEnd: IriSP.wrap(this, this.clearQueue)});

};

/* this does essentially the same job than handleQueue, except that it's only
   called by handleQueue to cleanup after a tweet. */
IriSP.TweetsWidget.prototype.clearQueue = function() {  
  var annotation = this._messageQueue.shift();
  
  if( this._tweetClearedBeforeEnd === true) {  
    this._tweetClearedBeforeEnd;
    return;
  }
  
  if (this._messageQueue === []) {
    this.closePanel();
  }
};

IriSP.TweetsWidget.prototype.closePanel = function() {
  if (this._displayingTweet)
    return;
  else {
    this.selector.hide(50);
  }
};

IriSP.TweetsWidget.prototype.draw = function() {
  var _this = this;
  
  var tweetMarkup = Mustache.to_html(IriSP.tweetWidget_template, {"share_template" : IriSP.share_template});
	this.selector.append(tweetMarkup);
  this.selector.hide();
  
  this._Popcorn.listen("IriSP.PolemicTweet.click", IriSP.wrap(this, this.PolemicTweetClickHandler));
};

IriSP.TweetsWidget.prototype.PolemicTweetClickHandler = function(tweet_id) {  
  var index, annotation;
  for (index in this._serializer._data.annotations) {
    annotation = this._serializer._data.annotations[index];
    
    if (annotation.id === tweet_id)
      break;
  }
    
  if (annotation.id !== tweet_id)
      /* we haven't found it */
      return;
  
  this.pushQueue(annotation);
    
  return;
};