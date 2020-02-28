import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    update_results(1)
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

def update_results(eventid):
   dynamodb = boto3.resource('dynamodb')
   rrresultsTab = dynamodb.Table('RRResults')
   rrresultsResponse = rrresultsTab.scan()
   results = rrresultsResponse['Items']
   rrplayersTab = dynamodb.Table('RRPlayers')
   rrplayersResponse = rrplayersTab.scan()
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

