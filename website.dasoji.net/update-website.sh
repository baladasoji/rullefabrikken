aws s3 cp ../docs/public/ s3://results.dasoji.net/ --recursive
aws s3 cp ../docs/admin/ s3://raceadmin.dasoji.net/ --recursive
aws s3 website s3://results.dasoji.net/ --index-document index.html --error-document error.html
aws s3 website s3://raceadmin.dasoji.net/ --index-document index.html --error-document error.html
aws s3api put-bucket-policy --bucket results.dasoji.net --policy file://results-policy.json
aws s3api put-bucket-policy --bucket raceadmin.dasoji.net --policy file://raceadmin-policy.json
