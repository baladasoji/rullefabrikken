import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    # TODO implement
    reset_points()
    return {
        'statusCode': 200,
        'body': json.dumps("All player points reset to zero")
    }
    
    
def reset_points():
   dynamodb = boto3.resource('dynamodb')
   rrplayersTab = dynamodb.Table('RRPlayers')
   rrplayersResponse = rrplayersTab.scan( ProjectionExpression='#k,#s', ExpressionAttributeNames={ '#k' : 'id', '#s' : 'sortkey' })
   for item in rrplayersResponse['Items']:
    rrplayersTab.update_item(Key=item, UpdateExpression= 'SET #pnt = :point', ExpressionAttributeNames= {"#pnt" : "points"},  ExpressionAttributeValues= { ":point": 0 } )
