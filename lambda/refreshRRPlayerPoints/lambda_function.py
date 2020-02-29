import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    eventid = get_qp_asinteger(event,'eventid')
    if eventid is None:
        eventid = 0
    update_results(eventid)
    # TODO implement
    return {
        'statusCode': 200,
        'body': 'Refreshed Player points for event: '+str(eventid)
    }

def update_results(eventid):
   dynamodb = boto3.resource('dynamodb')
   rrresultsTab = dynamodb.Table('RRResults')
   fe=Key('eventid').eq(eventid)
   rrresultsResponse = rrresultsTab.scan(FilterExpression=fe)
   results = rrresultsResponse['Items']
   rrplayersTab = dynamodb.Table('RRPlayers')
   rrplayersResponse = rrplayersTab.scan(FilterExpression=fe)
   players = rrplayersResponse['Items']
   pdict={}
   for i in players:
    pdict[i.get('id')]=0
   for r in results:
    res=r['result']
    for rr in res:
        pdict[rr.get('playerid')]+= rr.get('points')
   for i in players:
     rrplayersTab.update_item(Key={'id':i['id'] }, UpdateExpression= 'SET #pnt = :point', ExpressionAttributeNames= {"#pnt" : "points"},  ExpressionAttributeValues= { ":point": pdict.get(i['id']) } )

def get_qp_asinteger(event,qp):
    qpid = None
    qpnum = None
    if event.get('params') is not None :
        qpid=event.get('params').get('querystring').get(qp)
    if qpid is not None:
        qpnum = int(qpid)
    return qpnum