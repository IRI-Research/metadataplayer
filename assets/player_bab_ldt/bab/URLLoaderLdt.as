package tools
{
	import flash.net.URLLoader;
	import flash.net.URLRequest;

	public class URLLoaderLdt extends URLLoader
	{
		private var _url:String;
		private var _preVideo:String;
		private var _prePict:String;
		private var _preExtra:String;
		
		public function URLLoaderLdt(request:URLRequest=null, preVideo:String=null, prePict:String=null, preExtra:String=null)
		{
			if(request!=null){
				_url = request.url;
				_preVideo = preVideo;
				_prePict = prePict;
				_preExtra = preExtra;
			}
			super(request);
		}
		public function get url():String{ return _url; }
		public function get preVideo():String{ return _preVideo; }
		public function get prePict():String{ return _prePict; }
		public function get preExtra():String{ return _preExtra; }
		
	}
}