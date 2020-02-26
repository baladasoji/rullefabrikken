from operator import itemgetter
import boto3

def lambda_handler(event, context):
    # TODO implement
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
    table = dynamodb.Table('RRConfig')
    response=table.scan()
    items =response['Items']
    items.sort(key=itemgetter('id'), reverse=True)
    if (len(items) > 0):
        return items[0].get("config")
    else:
        return '{}'