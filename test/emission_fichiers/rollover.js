  $(document).ready(function(){  
    
	    $('.rollover').hover(function(){
        if($(this).attr("src").indexOf("-hover") == -1) {
			var newSrc = $(this).attr("src").replace(".png","-hover.png");
			$(this).attr("src",newSrc);}},
	function(){
            if($(this).attr("src").indexOf("-hover.png") != -1) {
					var oldSrc = $(this).attr("src").replace("-hover.png",".png");
					$(this).attr("src",oldSrc);}
                                        });
            
            $('input[type="text"]').addClass("idleField");  
            $('form:not([id="user-profile-form"]) input[type="text"]').focus(function() {
        $(this).removeClass("idleField").addClass("focusField");  
        if (this.value == this.defaultValue){  
            this.value = '';  
         }
        if(this.value != this.defaultValue){  
            this.select();  
        }  
    });  
    $('input[type="text"]').blur(function() {  
        $(this).removeClass("focusField").addClass("idleField");  
        if (this.value == ''){  
            this.value = (this.defaultValue ? this.defaultValue : '');  
        }  
    });   
});
