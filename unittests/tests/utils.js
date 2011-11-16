function test_utils() {
  module("Utility function tests");
  
  test("test function to convert from seconds to a time", function() {
    var h = 13, m = 7, s = 41;
    var t = 13 * 3600 + 7* 60 + 41;
    deepEqual(IriSP.secondsToTime(t), [h, m, s], "the converted time is correct");
    
    t = -t;
    deepEqual(IriSP.secondsToTime(t), [h, m, s], "the function is immune to negative numbers.");
  });
}