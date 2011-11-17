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

    equal(widget.selector.children(".Ldt-tweetAvatar").length, 1, "test if the div has been added correctly");
    equal(widget.selector.children(".Ldt-tweetContents").length, 1, "test if sub-div has been added correctly");
  });
  
  test("test tweet display function", function() {
    var widget = new IriSP.TweetsWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();
    var annotation = {content: {"title": "title", "description": "description", "keywords": "keywords"}};
    widget.displayTweet(annotation);
    
    equal(widget.selector.find(".Ldt-tweetContents").text(), "title", "title set correctly");
    // equal(widget.selector.find(".Ldt-SaDescription").text(), "description", "description set correctly");
    // equal(widget.selector.find(".Ldt-SaKeywordText").text(), "", "keywords field set correctly");
  });
}; 