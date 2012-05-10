package nl.inlet42.data.subtitles {
 
	public class SubTitleData {
		public var text : String;
		public var start : Number;
		public var duration : Number;
		public var end : Number;
		public var startStr : String;
		public var endStr : String;
 
		public function SubTitleData(inText : String = "",inStart : Number = 0,inDuration : Number = 0,inEnd : Number = 0,inStartStr : String = "",inEndStr : String = "") {
			text = inText;
			start = inStart;
			duration = inDuration;
			end = inEnd;
			startStr = inStartStr;
			endStr = inEndStr;
		}
 
		public function toString() : void {
			//trace("nl.inlet42.data.subtitles.SubTitleData " + );
			trace("SubTitleData " + start + ", " + duration + ", " + end + ", " + text);
		}
	}
}