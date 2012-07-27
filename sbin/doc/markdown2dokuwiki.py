import re, sys

inputname = sys.argv[1]
outputname = re.sub("\.\w+$",".dokuwiki",inputname)

print "Converting %s to %s"%(inputname,outputname)

inputfile = open(inputname,'r')

markdowntext = inputfile.read()

# Replacing title levels: #italic# -> ======italic======

wikitext = re.sub("(?m)(^#+|#+$)", lambda matches: "=" * (7 - len(matches.group(1))), markdowntext)

# Replacing italics: *italic* -> //italic//

wikitext = re.sub("(?m)([^*])\*([^*]+)\*($|[^*])", lambda matches: matches.group(1) + "//" + matches.group(2) + "//" + matches.group(3), wikitext)

# Replacing lists: - -> *

wikitext = re.sub("(?m)^(\s*)(-)\s", lambda matches: " " * ( 2 + len(matches.group(1)) / 2) + "* ", wikitext)

# Replacing lists: 1. -> -

wikitext = re.sub("(?m)^(\s*)(\d+\.)\s", lambda matches: " " * ( 2 + len(matches.group(1)) / 2) + "- ", wikitext)

# Replacing escaped underscores \_ -> _

wikitext = re.sub("(?m)(\\\_)", "_", wikitext)

# Escaping URL templates {{ -> %%{%%{

wikitext = re.sub("(?m)({{)", "%%{%%{", wikitext)

outputfile = open(outputname,'w')

outputfile.write(wikitext)

outputfile.close()

inputfile.close()