from __future__ import print_function# Python 2/3 compatibility
import boto3
import json
import decimal
import operator
from boto3.dynamodb.conditions import Key, Attr
import logging

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def lambda_handler(event, context):
    logger.info(event);
    body = get_bodyjson(event)
    raceid=body.get('raceid')
    stat = body.get('status')
    return update_race_status(int(raceid),stat)
    
    
def update_race_status(raceid, stat):
  client = boto3.resource('dynamodb')
  db = client.Table("RRRaces")
  return db.update_item(Key= { "id":raceid }, UpdateExpression= 'SET #stat = :label', ExpressionAttributeNames= {"#stat" : "status"},  ExpressionAttributeValues= { ":label": stat } )
  
def get_bodyjson(event):
    body = None
    if event.get('body-json') is not None :
        body=event.get('body-json')
    return body
