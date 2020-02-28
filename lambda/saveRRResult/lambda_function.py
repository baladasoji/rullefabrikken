from __future__ import print_function# Python 2/3 compatibility
import boto3
import json
import decimal
import operator
import time
from boto3.dynamodb.conditions import Key, Attr
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
    table = dynamodb.Table('RRResults')
    body = get_bodyjson(event)
    print (body.get('rrresult'))
    curtime = int(time.time())
    response = table.put_item(
       Item={
            'id':curtime,
            'eventid': body.get('race').get('eventid'),
            'raceid': body.get('race').get('id'),
            'racename': body.get('race').get('name'),
            'agegroup': body.get('race').get('agegroup'),
            'laps': body.get('race').get('laps'),
            'result':body.get('result')
            }
    )
    ''' For each item in the result iterate and update player points '''
    res=body.get('result')
    for i in res:
        logger.debug(i)
        playerid = i.get('playerid')
        points = i.get('points')
        if (playerid != None and points != None):
            update_player_points(playerid, points)
        else:
            logger.error ("Unable to update player points for ")
            logger.error (i)
    
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Saved result successfully!')
    }


def update_player_points(playerid, add_points):
  logger.debug ('Adding points: '+ str(add_points) +' to player id :'+ str(playerid))
  client = boto3.resource('dynamodb')
  db = client.Table("RRPlayers")
  p = db.get_item( Key={'id': int(playerid)})
  print(p)
  new_points = int(p.get('Item').get('points'))+int(add_points);
  db.update_item(Key= {'id':int(playerid) }, UpdateExpression= 'SET #points = :label', ExpressionAttributeNames= {"#points" : "points"},  ExpressionAttributeValues= { ":label": new_points } )
  return {}

def get_bodyjson(event):
    body = None
    if event.get('body-json') is not None :
        body=event.get('body-json')
    return body
