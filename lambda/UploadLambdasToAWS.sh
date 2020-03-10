#!/bin/bash
if [ $# -lt 1 ]  
then
   echo "Insufficient parameters usage UploadLambdaToAWS.sh <lambdaname>"
else
   lambda=$1
   echo $lambda
   mkdir -p tmp
   cp $lambda/lambda_function.py tmp
   cd tmp
   zip t.zip lambda_function.py
   rm lambda_function.py
   cd ..
   aws lambda update-function-code --function-name $lambda --zip-file fileb://tmp/t.zip
   rm -rf tmp
fi
