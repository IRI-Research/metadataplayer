#!/bin/sh
DIR=$(dirname $0)
sh ${DIR}/../res/ant/bin/ant -f ${DIR}/client.xml
