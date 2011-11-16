function test_utils() {
  module("Utility function tests");
  
  test("test a function to preserve the scope of a method in a callback", function() {
    var obj = { a : 2};
    obj.b = function(e, f) { 
      equal(this.a, 2, "the scope is preserved");
      equal(e, 1, "arg 1 passed correctly");
      equal(f, 2, "arg 2 passed correctly");
    };
    
    (IriSP.wrap(obj, obj.b))(1, 2);
  
  });
  
  test("test function to convert a ratio to a percentage", function() {
    var time = 2;
    var total = 3;
    
    equal(IriSP.timeToPourcent(2, 3), 66, "the function returns the correct result");    
    
    var total = -total;    
    
    equal(IriSP.timeToPourcent(2, 3), 66, "the function is immune to negative numbers");            
  });
  
  test("test padding function", function() {
    equal(IriSP.padWithZeros(3), "03", "function works correctly");
  });
  
  test("test function to convert from seconds to a time", function() {
    var h = 13, m = 7, s = 41;
    var t = 13 * 3600 + 7* 60 + 41;
    deepEqual(IriSP.secondsToTime(t), {"hours" : h, "minutes" : m, "seconds" : s}, 
              "the converted time is correct");
    
    t = -t;
    deepEqual(IriSP.secondsToTime(t),  {"hours" : h, "minutes" : m, "seconds" : s}, "the function is immune to negative numbers.");
  });
}