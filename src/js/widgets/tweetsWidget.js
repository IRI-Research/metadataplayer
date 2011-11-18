/* a widget that displays tweet - used in conjunction with the polemicWidget */

IriSP.TweetsWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);

  this._displayingTweet = false;
  this._timeoutId = undefined;  
};


IriSP.TweetsWidget.prototype = new IriSP.Widget();


IriSP.TweetsWidget.prototype.drawTweet = function(annotation) {
    
    var title = annotation.content.title;
    var img = annotation.content.img.src;
    if (typeof(img) === "undefined" || img === "" || img === "None") {
      img = IriSP.widgetsDefaults.TweetsWidget.default_profile_picture;
    }
    
    var imageMarkup = Mustache.to_html("<img src='{{src}}' alt='avatar'></img>", 
                                       {src : img});

    this.selector.find(".Ldt-tweetContents").text(title);
    this.selector.find(".Ldt-tweetAvatar").html(imageMarkup);
    this.selector.show("blind", 250); 
};

IriSP.TweetsWidget.prototype.displayTweet = function(annotation) {
  if (this._displayingTweet === false) {
    this._displayingTweet = true;
  } else {
    window.clearTimeout(this._timeoutId);
  }

  this.drawTweet(annotation);

  var time = this._Popcorn.currentTime();  
  this._timeoutId = window.setTimeout(IriSP.wrap(this, this.clearPanel), 10000);
};


IriSP.TweetsWidget.prototype.clearPanel = function() {  
    this._displayingTweet = false;
    this._timeoutId = undefined;
    this.closePanel();
    
};

IriSP.TweetsWidget.prototype.closePanel = function() {
    if (this._timeoutId != undefined) {
      /* we're called from the "close window" link */
      /* cancel the timeout */
      window.clearTimeout(this._timeoutId);
    }
    
    this.selector.hide("blind", 400);
    
};

IriSP.TweetsWidget.prototype.draw = function() {
  var _this = this;
  
  var tweetMarkup = Mustache.to_html(IriSP.tweetWidget_template, {"share_template" : IriSP.share_template});
  this.selector.append(tweetMarkup);
  this.selector.hide();
  this.selector.find(".Ldt-tweetWidgetMinimize").click(IriSP.wrap(this, this.closePanel));
  
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
  
  this.displayTweet(annotation);
  return;
};