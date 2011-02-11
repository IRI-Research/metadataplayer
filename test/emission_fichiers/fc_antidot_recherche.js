// integration du suggest (module antidot)
Drupal.behaviors.fc_antidot_recherche = function (){
     
    // recupère l'adresse du proxy
    var urlP = Drupal.settings.adresseProxy;
var as_pos = 0;	   
var as_pos2 = 0;
 /**
   * traitement de la sujestion sur le bloc de recherche 
   * pour économiser des appels à antidot
   * la requete est lancée si l'utilisateur saisi plus de 3 lettres
   * elle n'est pas lancée si  :
   * la dernière requete a retourné 0 ou un resultat et que le mot actuel est semblable au mot précedent+1car 
   */   
    var expression = new RegExp("^[\\s!&\"'(\\-\\_)=$^\*!:;,~~#{\\[\\|`\\\\^@\\]}¤£µ%§/.?<>\\+]*$", "g");
    
    //
    $('#search_top_page').keyup(function(e){    	
	if(e.keyCode>=48 || e.keyCode == 8){
	    var queryBox = $('#search_top_page').val();
	   	  // active le bouton de recherche en fonction de la pressence de mot clé
	    if(expression.test(queryBox)){
		$('#search_top_page-wrapper #edit-submit').attr('disabled', 'disabled');
	    }else{
		$('#search_top_page-wrapper #edit-submit').removeAttr('disabled');
	    } 

	    
    	var prec = "";
    	if(jQuery.trim(queryBox).length > 2){    
    		if($('#SuggestPopupBox').length == 0){
    			$('#search_top_page-wrapper').append('<div id="SuggestPopupBox"></div>');  
    			// pour le stockage de la requete precedente
    			$('#search_top_page-wrapper').append('<div id="SuggestPrecBox" style="display:none">'+queryBox+'</div>');
    		}else{
    			$('#SuggestPopupBox').css("display", 'block');
    			prec = $('#SuggestPrecBox').text();
    		}
    		//si la recerche précédente avait la même racine et moins de 2 reponses on ne lance pas la requete    		

    		if ($('#SuggestPopupBox ul li').length < 2 && prec !="" && queryBox.indexOf(prec) == 0){
    			
    			var suj = $('#SuggestPopupBox ul li').text();    			 	
    			// si la sugestion est vide ou si elle n'est pas conforme au mot on cache la zone
    			if ( prec == "" || suj=="" || suj.indexOf(queryBox) !=0 ){    				
    				$('#SuggestPopupBox').css("display", 'none');
    			} 
    		} else {
    			$('#SuggestPrecBox').text(queryBox);
	    		// récupère le resultat de la sujestion
			
	    		$.getJSON(urlP+"?afs:service=254&afs:feed=chaineC&afs:query="+queryBox,function(data){
	    			// s'il y a des sujestions on les traites puis affiche
	    			if(data[1].length > 0){
		    			$('#SuggestPopupBox').text(""); 		    			
		    			var liste ="";
		    			$.each(data[1], function(i, item) {	    			
		    				liste += "<li class='suj-reponse'>"+item+"</li>";
		    			});
		    			$('#SuggestPopupBox').append("<ul>"+liste+"</ul>");		    			
		    			// place dans la barre de recherche au clic sur une suj et reinitialise le bloc de recherche				   		
					
		    			 $('#SuggestPopupBox ul li').click(function(){	    			    			    	
		    			    	var reponse = $(this).text();    			    	
		    			    	$('#search_top_page').val(reponse);
		    			    	$('#SuggestPopupBox').text("");
			    	    		$('#SuggestPopupBox').css("display", 'none');
			    	    		$('#SuggestPrecBox').text("");
		    			    });
		    			 
	    			}else{
	    				// sinon on masque le champ
	    				$('#SuggestPopupBox').text("");
	    	    		$('#SuggestPopupBox').css("display", 'none');	    	    		
	    			}
	    		});    
    		}
    		$('#SuggestPrecBox').text(queryBox);	
   	}else{
    		$('#SuggestPopupBox').text("");
    		$('#SuggestPopupBox').css("display", 'none');	
    		$('#SuggestPrecBox').text("");

    	 }
   }
	});
/* fin traitement de la sujestion sur le bloc de recherche  */ 
$('#search_top_page').keypress(function(e){

  if($('#SuggestPopupBox').text()!=''){
   switch(e.keyCode){
	//down
    case 40:
	if(as_pos<$('#SuggestPopupBox ul li').length){
	   $('#SuggestPopupBox ul li:nth-child('+as_pos+')').removeClass('active');
	   as_pos++;
	   $('#SuggestPopupBox ul li:nth-child('+as_pos+')').addClass('active');
	   var donne = $('#SuggestPopupBox ul li:nth-child('+as_pos+')').text();
           $('#search_top_page').val(donne);
	}
    break;
	//up
    case 38:
      if(as_pos>0){
	$('#SuggestPopupBox ul li:nth-child('+as_pos+')').removeClass('active');
        as_pos--;
        $('#SuggestPopupBox ul li:nth-child('+as_pos+')').addClass('active');
        var donne = $('#SuggestPopupBox ul li:nth-child('+as_pos+')').text();
        $('#search_top_page').val(donne);
      }
    break;
   }

 }
});
//
$('body').click(function(){
                $('#SuggestPopupBox').text("");
                $('#SuggestPopupBox').css("display", 'none');
                $('#SuggestPrecBox').text("");
                $('#SuggestPopupPage').text("");
                $('#SuggestPopupPage').css("display", 'none');
                $('#SuggestPrecPage').text("");
		as_pos = 0;
		as_pos2 = 0;
});


$('#edit-keys').keypress(function(e){

  if($('#SuggestPopupPage').text()!=''){
   switch(e.keyCode){
    case 40:
	if(as_pos2<$('#SuggestPopupPage ul li').length){
	   $('#SuggestPopupPage ul li:nth-child('+as_pos2+')').removeClass('active');
	   as_pos2++;
 $('#SuggestPopupPage ul li:nth-child('+as_pos2+')').addClass('active');
var donne = $('#SuggestPopupPage ul li:nth-child('+as_pos2+')').text();
  $('#edit-keys').val(donne);
	}
    break;
    case 38:
      if(as_pos2>0){
	$('#SuggestPopupPage ul li:nth-child('+as_pos2+')').removeClass('active');
        as_pos2--;
 $('#SuggestPopupPage ul li:nth-child('+as_pos2+')').addClass('active');
var donne = $('#SuggestPopupPage ul li:nth-child('+as_pos2+')').text();
  $('#edit-keys').val(donne);
      }
    break;
   }
 }
});

    
/* traitement de la sujestion sur la page de recherche  */     
    $('#edit-keys').keyup(function(e){    	
	if(e.keyCode>=48 || e.keyCode == 8){
    	var queryPage = $('#edit-keys').val();
	var expression = new RegExp("^[\\s!&\"'(\\-\\_)=$^\*!:;,~~#{\\[\\|`\\\\^@\\]}¤£µ%§/.?<>\\+]*$", "g");
    
    	 // active le bouton de recherche en fonction de la pressence de mot clé
    	if(expression.test(queryPage)){
	    $('#submit_resultat_page').attr('disabled', 'disabled');		
	}else{
	    $('#submit_resultat_page').removeAttr('disabled');
	    
	}  
    	
    	var precPage = "";
    	if(jQuery.trim(queryPage).length > 2){   
    		if($('#SuggestPopupPage').length == 0){
    			$('#edit-keys-wrapper').append('<div id="SuggestPopupPage"></div>');  
    			// pour le stockage de la requete precedente
    			$('#edit-keys-wrapper').append('<div id="SuggestPrecPage" style="display:none">'+queryPage+'</div>');
    		}else{
    			$('#SuggestPopupPage').css("display", 'block');
    			precPage = $('#SuggestPrecPage').text();
    		}
    		//si la recerche précédente avait la même racine et moins de 2 reponses on ne lance pas la requete    		
    		if ($('#SuggestPopupPage ul li').length < 2 && precPage !="" && queryPage.indexOf(precPage) == 0){
    			
    			var sujPage = $('#SuggestPopupPage ul li').text();    			 	
    			// si la sugestion est vide ou si elle n'est pas conforme au mot on cache la zone
    			if ( precPage == "" || sujPage =="" || suj.indexOf(queryPage) !=0 ){    				
    				$('#SuggestPopupPage').css("display", 'none');
    			} 
    		} else {
    			$('#SuggestPrecPage').text(queryPage);
	    		// récupère le resultat de la sujestion
	    		$.getJSON(urlP+"?afs:service=254&afs:feed=chaineC&afs:query="+queryPage,function(data){
	    			// s'il y a des sujestions on les traites puis affiche
	    			if(data[1].length > 0){
		    			$('#SuggestPopupPage').text(""); 		    			
		    			var liste ="";
		    			$.each(data[1], function(i, item) {	    			
		    				liste += "<li class='suj-reponse'>"+item+"</li>";
		    			});
		    			$('#SuggestPopupPage').append("<ul>"+liste+"</ul>");		    			
		    			// place dans la barre de recherche au clic sur une suj et reinitialise le bloc de recherche				   		
		    			 $('#SuggestPopupPage ul li').click(function(){	    			    			    	
		    			    	var reponse = $(this).text();    			    	
		    			    	$('#edit-keys').val(reponse);
		    			    	$('#SuggestPopupPage').text("");
			    	    		$('#SuggestPopupPage').css("display", 'none');
			    	    		$('#SuggestPrecPage').text("");
		    			    });
		    			 
	    			}else{
	    				// sinon on masque le champ
	    				$('#SuggestPopupPage').text("");
	    	    		$('#SuggestPopupPage').css("display", 'none');	    	    		
	    			}
	    		});    
    		}
    		$('#SuggestPrecPage').text(queryPage);	
    	}else{
    		$('#SuggestPopupPage').text("");
    		$('#SuggestPopupPage').css("display", 'none');	
    		$('#SuggestPrecPage').text("");
    	 }
}
    });
	
/* fin traitement de la sujestion sur la page de recherche  */ 
      
        
    // surligner les résultats
    var key = $('#edit-keys').val();
    if (!key) {
      return;
    }
    var tableau = key.split(' ');
    var key2 = '';
    for (var i=0;i<tableau.length;i++){
      if(tableau[i].length>=3){
	key2 += tableau[i] + ' ';
      }
    }
    var options = {exact:"exact",style_name_suffix:false,style_name:"tagged",keys:key2};
    jQuery(document).SearchHighlight(options);

};



