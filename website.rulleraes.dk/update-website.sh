aws s3 sync ../docs/public/ s3://results.rulleraes.dk/ 
aws s3 sync ../docs/admin/ s3://raceadmin.rulleraes.dk/ 
aws s3 website s3://results.rulleraes.dk/ --index-document index.html --error-document error.html
aws s3 website s3://raceadmin.rulleraes.dk/ --index-document index.html --error-document error.html
aws s3api put-bucket-policy --bucket results.rulleraes.dk --policy file://results-policy.json
aws s3api put-bucket-policy --bucket raceadmin.rulleraes.dk --policy file://raceadmin-policy.json
