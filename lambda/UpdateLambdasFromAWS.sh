#!/bin/bash
mkdir -p tmp
rrfunctions=`aws lambda list-functions | grep FunctionName | grep RR | awk -F':' '{print $2}' | sed 's/"//g' | sed 's/,//g'`
for i in $rrfunctions
do echo $i 
url=`aws lambda get-function --function-name $i | jq .Code.Location`
#echo $url
url=`echo $url|xargs`
curl -s $url -o tmp/$i.zip
mkdir -p $i
unzip -o tmp/$i.zip  -d $i 
done
rm -rf tmp
