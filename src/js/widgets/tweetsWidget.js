/* a widget that displays tweet - used in conjunction with the polemicWidget */

IriSP.TweetsWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  
};


IriSP.TweetsWidget.prototype = new IriSP.Widget();

IriSP.TweetsWidget.prototype.displayTweet = function(annotation) {

    var title = annotation.content.title;
    var description = annotation.content.description;
    var keywords =  "" // FIXME;
    var begin = +annotation.begin;
    var end = +annotation.end;
    var duration = +this._serializer.currentMedia().meta["dc:duration"];

    this.selector.find(".Ldt-tweetContents").text(title);   
};

IriSP.TweetsWidget.prototype.draw = function() {
  var _this = this;
  
  var tweetMarkup = Mustache.to_html(IriSP.tweetWidget_template, {"share_template" : IriSP.share_template});
	this.selector.append(tweetMarkup);
    
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
  
  var time = this._Popcorn.currentTime();
  this._Popcorn = this._Popcorn.code({ start : time + 0.1, end: time + 10, 
                                       onEnd: IriSP.wrap(this, this.clearTweet)});
  
  return;
};