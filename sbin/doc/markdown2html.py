import re, sys, markdown, codecs

inputname = sys.argv[1]
outputname = re.sub("\.\w+$",".html",inputname)
shortname = re.sub("(^.+\/|\.\w+$)","",inputname)

print "Converting %s"%shortname

f = codecs.open(inputname, mode="r", encoding="utf8")
mdtext = f.read()
f.close()
html = markdown.markdown(mdtext)

f = codecs.open(outputname, "w", encoding="utf8")

header = """<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Metadataplayer docs: %s</title>
</head>
<body>
"""%shortname
footer = """
</body>
</html>"""

f.write(header)
f.write(html)
f.write(footer)

f.close()