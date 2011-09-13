/* data.js - this file deals with how the players gets and sends data */

IriSP.getMetadata = function() {
	
	IriSP.jQuery.ajax({
		  dataType: IriSP.config.metadata.load,
		  url:IriSP.config.metadata.src,
		  success : function( json ){
		  
				IriSP.trace( "ajax", "success" );
				
				// START PARSING ----------------------- 
				if( json === "" ){
					alert( "Json load error" );
				} else {							  							  
					// # CREATE MEDIA  							//
					// # JUSTE ONE PLAYER FOR THE MOMENT		//
					//__IriSP.jQuery("<div></div>").appendTo("#output");
					var MyMedia = new  __IriSP.Media(
														json.medias[0].id,
														json.medias[0].href,
														json.medias[0]['meta']['dc:duration'],
														json.medias[0]['dc:title'],
														json.medias[0]['dc:description']);
					
					IriSP.trace( "__IriSP.MyApiPlayer",
														IriSP.config.gui.width+"   "
														+ IriSP.config.gui.height + " "
														+ json.medias[0].href + " "
														+ json.medias[0]['meta']['dc:duration'] + " "
														+ json.medias[0]['meta']['item']['value']);
					
					// Create APIplayer
					IriSP.MyApiPlayer = new __IriSP.APIplayer (
														IriSP.config.gui.width,
														IriSP.config.gui.height,
														json.medias[0].href,
														json.medias[0]['meta']['dc:duration'],
														json.medias[0]['meta']['item']['value']);
				
					// # CREATE THE FIRST LINE  				//
					IriSP.trace( "__IriSP.init.main","__IriSP.Ligne" );
					IriSP.MyLdt = new __IriSP.Ligne(
														json['annotation-types'][0].id,
														json['annotation-types'][0]['dc:title'],
														json['annotation-types'][0]['dc:description'],
														json.medias[0]['meta']['dc:duration']);			
					
					// CREATE THE TAG CLOUD 					//
					IriSP.trace( "__IriSP.init.main","__IriSP.Tags" );
					IriSP.MyTags =  new __IriSP.Tags( json.tags );
				
					// CREATE THE ANNOTATIONS  				    //
					// JUSTE FOR THE FIRST TYPE   			 	//
					/* FIXME: make it support more than one ligne de temps */
					IriSP.jQuery.each( json.annotations, function(i,item) {
						if (item.meta['id-ref'] == IriSP.MyLdt.id) {
							//__IriSP.trace("__IriSP.init.main","__IriSP.MyLdt.addAnnotation");
							IriSP.MyLdt.addAnnotation(
										item.id,
										item.begin,
										item.end,
										item.media,
										item.content.title,
										item.content.description,
										item.content.color,
										item.tags);
						}
							//MyTags.addAnnotation(item);
					} );	
					IriSP.jQuery.each( json.lists, function(i,item) {
						IriSP.trace("lists","");
					} );	
					IriSP.jQuery.each( json.views, function(i,item) {
						IriSP.trace("views","");
					} );	
				}
				// END PARSING ----------------------- //  
			
							
		}, error : function(data){
			  alert("ERROR : "+data);
		}
	  });	

}