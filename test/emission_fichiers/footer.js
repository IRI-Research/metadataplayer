function boutonHautDePage(){
	$("#top-page").click(function() {
		var hauteur = 0;
		$('html,body').animate({scrollTop: hauteur}, 1000);
	});
	return false;
}
//
Drupal.behaviors.franceculture_header_footer = function (){
    boutonHautDePage();
}
