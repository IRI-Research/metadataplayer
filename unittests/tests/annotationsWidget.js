/* annotationsWidget.js */

function test_annotations_widget() {
  module("annotations widget testing", 
  {setup : function() {    
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
    
    this.dt = new IriSP.DataLoader();
    this.ser = new IriSP.MockSerializer(this.dt, "/url"); /* dummy serializer */
    
    
    IriSP.jQuery("#widget-div").append("<div id='Ldt-Ligne'></div>");
    this.config = {
						metadata:{
							format:'cinelab',
							src:'test.json',
							load:'json'},
						gui:{
							width:650,
							height:1,
							mode:'radio',
							container:'widget-div',
							debug:true,
							css:'../src/css/LdtPlayer.css'},
					};
    },
  teardown: function() {
    /* free the popcorn object because it has signal handlers attached to it */
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
  }
  });
  
  test("test widget initialization", function() {  
    var widget = new IriSP.AnnotationsWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();

    equal(IriSP.jQuery("#Ldt-Ligne").length, 1, "test if the div has been added correctly");
    equal(IriSP.jQuery("#Ldt-Ligne #Ldt-SaKeyword").length, 1, "test if sub-div has been added correctly");     
  });
  
  test("test annotation display function", function() {
    var widget = new IriSP.AnnotationsWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();
    var annotation = {content: {"title": "title", "description": "description", "keywords": "keywords"}};
    widget.displayAnnotation(annotation);
    equal(IriSP.jQuery("#Ldt-SaTitle").text(), "title", "title set correctly");
    equal(IriSP.jQuery("#Ldt-SaDescription").text(), "description", "description set correctly");
    equal(IriSP.jQuery("#Ldt-SaKeywordText").text(), "Mots clefs : ", "keywords field set correctly");
  });
}; 