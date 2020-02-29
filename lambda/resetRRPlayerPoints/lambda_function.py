import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    # TODO implement
    eventid=get_qp_asinteger(event,'eventid')
    if eventid is None:
        eventid = 0
    reset_points(eventid)
    return {
        'statusCode': 200,
        'body': json.dumps("All player points reset to zero")
    }
    
    
def reset_points(eventid):
   dynamodb = boto3.resource('dynamodb')
   rrplayersTab = dynamodb.Table('RRPlayers')
   fe=Key('eventid').eq(eventid)
   rrplayersResponse = rrplayersTab.scan( FilterExpression=fe , ProjectionExpression='#k,#s', ExpressionAttributeNames={ '#k' : 'id', '#s' : 'sortkey' } )
   for item in rrplayersResponse['Items']:
    rrplayersTab.update_item(Key=item, UpdateExpression= 'SET #pnt = :point', ExpressionAttributeNames= {"#pnt" : "points"},  ExpressionAttributeValues= { ":point": 0 } )


def get_qp_asinteger(event,qp):
    qpid = None
    qpnum = None
    if event.get('params') is not None :
        qpid=event.get('params').get('querystring').get(qp)
    if qpid is not None:
        qpnum = int(qpid)
    return qpnum