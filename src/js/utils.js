/* utils.js - various utils that don't belong anywhere else */

/* trace function, for debugging */

IriSP.traceNum = 0;
IriSP.trace = function( msg, value ) {

	if( IriSP.config.gui.debug === true ) {
		IriSP.traceNum += 1;
		IriSP.jQuery( "<div>"+IriSP.traceNum+" - "+msg+" : "+value+"</div>" ).appendTo( "#Ldt-output" );
	}
};

