/* test module for the player widget */

function test_player_widget() {
  module("player widget testing", 
  {setup : function() {    
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
    
    this.dt = new IriSP.DataLoader();
    this.ser = new IriSP.MockSerializer(this.dt, "/url"); /* dummy serializer */
    this.lay = new IriSP.LayoutManager('widget-div');
    
    this.config = {
							width:650,
							height:1,
							mode:'radio',
							container:'widget-div',
							debug:true,
							css:'../src/css/LdtPlayer.css'}					
    },
  teardown: function() {
    /* free the popcorn object because it has signal handlers attached to it */
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
  }

  });
  
  test("test player initialisation", function() {  
    var player = new IriSP.PlayerWidget(this.Popcorn, this.config, this.ser);    
    player.draw();
    
    equal(IriSP.jQuery("#widget-div").length, 1, "test if the div has been added correctly");     
  });
 
  test("test play button event handler", function() {
    var player = new IriSP.PlayerWidget(this.Popcorn, this.config, this.ser);

    var spy_callback = this.spy();
    var spy_callback2 = this.spy();
    this.Popcorn.listen("play", spy_callback);
    this.Popcorn.listen("pause", spy_callback2);
    sinon.spy(player, "playHandler");
    
    player.draw();        

    player.selector.find("#ldt-CtrlPlay").trigger("click");    
    player.selector.find("#ldt-CtrlPlay").trigger("click");
    ok(player.playHandler.calledTwice, "play handler called");
    ok(spy_callback2.calledOnce, "test if pause callback has been called");                                                                    
  });
  
  test("test mute button event handler", function() {
    var player = new IriSP.PlayerWidget(this.Popcorn, this.config, this.ser);

    var spy_callback = this.spy();
    var spy_handler = sinon.spy(player, "muteHandler");
    this.Popcorn.listen("volumechange", spy_callback);    
    
    player.draw();
       
    // IriSP.jQuery("#ldt-CtrlSound").trigger("click");    
    player.selector.find(".Ldt-Control2 button:first").next().trigger("click");    
    ok(this.Popcorn.muted(), "the player is muted");
    
    player.selector.find("#ldt-CtrlSound").trigger("click");
    ok(!this.Popcorn.muted(), "the player is un muted");         
    ok(spy_handler.called, "handling function has been called");                                                                                                                                        
  });

  test("test slider seeking", function() {    
    var player = new IriSP.PlayerWidget(this.Popcorn, this.config, this.ser);    
    player.draw();    
    
    var spy_callback = this.spy();
    player._Popcorn.listen("test.fixture", spy_callback);       
    player.selector.find("#slider-range-min").slider("value", 30);
    ok(spy_callback.called, "handling function has been called");
  });
  
  test("test search button event handler", function() {
  var player = new IriSP.PlayerWidget(this.Popcorn, this.config, this.ser);
  
  var searchTerm = "blah";
  
  var spy_callback = this.spy();
  var spy_open = this.spy();
  var spy_closed = this.spy();
  var spy_cleared = this.spy();
  var spy_handler = sinon.spy(player, "searchButtonHandler");
  
  player._Popcorn.listen("IriSP.search", spy_callback);    
  player._Popcorn.listen("IriSP.search.open", spy_open);    
  player._Popcorn.listen("IriSP.search.closed", spy_closed);    
  player._Popcorn.listen("IriSP.search.cleared", spy_cleared);    
  
  player.draw();
     
  player.selector.find("#ldt-CtrlSearch").trigger("click");
  player.selector.find("#LdtSearchInput").attr('value', searchTerm); 
  player.selector.find("#LdtSearchInput").trigger('keyup');
  
  ok(spy_handler.called, "search button handling function has been called");  
  ok(spy_open.called, "open signal has been sent");  
  ok(spy_callback.called, "search typeahead function has been called");
  ok(spy_callback.calledWith(searchTerm), "popcorn message sent with the right parameters");

  player.selector.find("#LdtSearchInput").attr('value', ""); 
  player.selector.find("#LdtSearchInput").trigger('keyup');
  ok(spy_cleared.called, "clear message has been sent");
  
  player.selector.find("#ldt-CtrlSearch").trigger("click");
  ok(spy_closed.called, "closed signal has been sent");  
  
  });
  
};