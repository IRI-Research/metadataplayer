/* tweetsWidget.js */

function test_tweets_widget() {
  module("tweet widget testing", 
  {setup : function() {    
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
    
    this.dt = new IriSP.DataLoader();
    this.ser = new IriSP.MockTweetSerializer(this.dt, "/url"); /* dummy serializer */

    this.config = {
							width:650,
							height:1,
							mode:'radio',
							container:'widget-div',
							debug:true,
							css:'../src/css/LdtPlayer.css'};
    },
  teardown: function() {
    /* free the popcorn object because it has signal handlers attached to it */
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
  }
  });
  
  test("test widget initialization", function() {  
    var widget = new IriSP.TweetsWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();

    equal(widget.selector.find(".Ldt-tweetAvatar").length, 1, "test if the div has been added correctly");
    equal(widget.selector.find(".Ldt-tweetContents").length, 1, "test if sub-div has been added correctly");
  });
  
  test("test tweet display function", function() {    
    // tweak the display period so that our tests don't timeout
    IriSP.widgetsDefaults.TweetsWidget.tweet_display_period = 10;
    
    var widget = new IriSP.TweetsWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();
    var annotation = {content: {"title": "title", "description": "description", "keywords": "keywords", "img": {"src" : "http://yop.com"}}};
    widget.displayTweet(annotation);
    
    equal(widget.selector.find(".Ldt-tweetContents").text(), "title", "title set correctly");    
    equal(widget.selector.find(".Ldt-tweetAvatar").children().attr("src"), "http://yop.com", "user avatar set correctly");
    
    var annotation2 = {content: {"title": "title", "description": "description", "keywords": "keywords", "img" : {}}};
    widget.displayTweet(annotation2);
    equal(widget.selector.find(".Ldt-tweetAvatar").children().attr("src"), 
                               IriSP.widgetsDefaults.TweetsWidget.default_profile_picture, "default avatar set correctly");
    
    widget.selector.find(".Ldt-tweetWidgetMinimize").click();
    
    ok(!widget.selector.is(":visible"), "the widget is hidden after a click");    
  });
  
  test("test async clear", function() {
  /*
    expect(1);
    
    // tweak the display period so that our tests don't timeout
    IriSP.widgetsDefaults.TweetsWidget.tweet_display_period = 10;
    stop();
    
    var widget = new IriSP.TweetsWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();
    var annotation = {content: {"title": "title", "description": "description", "keywords": "keywords", "img": {"src" : "http://yop.com"}}};
    widget.displayTweet(annotation);
  

    window.setTimeout(function() { console.log("called!"); 
      ok(!widget.selector.is(":visible"), "the widget is hidden after the timeout has passed."); 
      start(); 
      }, 100);
  */
  });
}; 