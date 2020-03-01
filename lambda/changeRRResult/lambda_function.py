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
    result=body.get('result')
    return change_result(result)
    
    
def change_result(result):
  client = boto3.resource('dynamodb')
  db = client.Table("RRResults")
  return db.update_item(Key= { "id":result.get('id') }, UpdateExpression= 'SET #stat = :label', ExpressionAttributeNames= {"#stat" : 'result'},  ExpressionAttributeValues= { ":label": result.get('result') } ) 
  
def get_bodyjson(event):
    body = None
    if event.get('body-json') is not None :
        body=event.get('body-json')
    return body
