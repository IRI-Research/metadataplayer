#!/bin/bash
for f in ../../doc/*.md
do
    python markdown2html.py $f
done