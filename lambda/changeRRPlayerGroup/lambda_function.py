import boto3
import json
import decimal
import operator
from boto3.dynamodb.conditions import Key, Attr
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info(event);
    body = get_bodyjson(event)
    id=body.get('id')
    penalty=body.get('penalty')
    newgroup=body.get('newgroup')
    return change_player(id,penalty,newgroup)
    
    
def change_player(id,penalty,newgroup):
  client = boto3.resource('dynamodb')
  db = client.Table("RRPlayers")
  return db.update_item(Key= { "id":id }, UpdateExpression= "set penaltypoints = :p, agegroup =:a", ExpressionAttributeValues= { ":p": penalty, ":a" :newgroup } ) 
  
def get_bodyjson(event):
    body = None
    if event.get('body-json') is not None :
        body=event.get('body-json')
    return body
