/* source comes from a similar jquery script */
/* run it like this :  java -jar rhino.jar jslint-wrapper.js file.js */


if (arguments.length == 1) {
  jslint = "jslint.js"
  srcfile = arguments[0];
} else if (arguments.length != 2) {
  print("jslint-wrapper jslint.js myfile.js");
  quit();
} else {
  var jslint = arguments[0];
  var srcfile = arguments[1];
}

src = readFile(srcfile, "utf8");
load(jslint);
  
JSLINT(src, { browser: true, forin: true, maxerr: 5 });

//All of the following are known issues that we think are 'ok'
//(in contradiction with JSLint) more information here:
//http://docs.jquery.com/JQuery_Core_Style_Guidelines
var ok = {
	"Expected an identifier and instead saw 'undefined' (a reserved word).": true,
	"Use '===' to compare with 'null'.": true,
	"Use '!==' to compare with 'null'.": true,
	"Expected an assignment or function call and instead saw an expression.": true,
	"Expected a 'break' statement before 'case'.": true,
	"'e' is already defined.": true,
  "Expected exactly one space between 'function' and '('": true
};

var e = JSLINT.errors, found = 0, w;

for ( var i = 0; i < e.length; i++ ) {
	w = e[i];

	if ( !ok[ w.reason ] ) {
		found++;
		print( "\n" + w.evidence + "\n" );
		print( "    Problem at line " + w.line + " character " + w.character + ": " + w.reason );
	}
}

if ( found > 0 ) {
	print( "\n" + found + " Error(s) found.\n" );

} else {
	print( "JSLint check passed.\n" );
}
