/* a widget that displays tweet - used in conjunction with the polemicWidget */

IriSP.TweetsWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);

  this._displayingTweet = false;
  this._timeoutId = undefined;  
};


IriSP.TweetsWidget.prototype = new IriSP.Widget();


IriSP.TweetsWidget.prototype.drawTweet = function(annotation) {
    
    var title = IriSP.formatTweet(annotation.content.title);
    var img = annotation.content.img.src;
    if (typeof(img) === "undefined" || img === "" || img === "None") {
      img = IriSP.widgetsDefaults.TweetsWidget.default_profile_picture;
    }

    var imageMarkup = IriSP.templToHTML("<img src='{{src}}' alt='user image'></img>", 
                                       {src : img});
    
    if (typeof(annotation.meta["dc:source"].content) !== "undefined") {
      var tweetContents = JSON.parse(annotation.meta["dc:source"].content);
      var creator = tweetContents.user.screen_name;
      var real_name = tweetContents.user.name;

      imageMarkup = IriSP.templToHTML("<a href='http://twitter.com/{{creator}}'><img src='{{src}}' alt='user image'></img></a>", 
                                       {src : img, creator: creator});
            
      var formatted_date = new Date(tweetContents.created_at).toLocaleDateString();
      title = IriSP.templToHTML("<a class='Ldt-tweet_userHandle' href='http://twitter.com/{{creator}}'>@{{creator}}</a> - " + 
                                "<div class='Ldt-tweet_realName'>{{real_name}}</div>" +
                                "<div class='Ldt-tweet_tweetContents'>{{{ contents }}}</div>" +
                                "<div class='Ldt-tweet_date'>{{ date }}</div>", 
                                {creator: creator, real_name: real_name, contents : title, date : formatted_date});

      this.selector.find(".Ldt-TweetReply").attr("href", "http://twitter.com/home?status=@" + creator + ":%20");


      var rtText = Mustache.to_html("http://twitter.com/home?status=RT @{{creator}}: {{text}}",
                                    {creator: creator, text: IriSP.encodeURI(annotation.content.title)});
      this.selector.find(".Ldt-Retweet").attr("href", rtText);
    }

    this.selector.find(".Ldt-tweetContents").html(title);
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
  this._timeoutId = window.setTimeout(IriSP.wrap(this, this.clearPanel), IriSP.widgetsDefaults.TweetsWidget.tweet_display_period);
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
  
  var tweetMarkup = IriSP.templToHTML(IriSP.tweetWidget_template, {"share_template" : IriSP.share_template});
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
