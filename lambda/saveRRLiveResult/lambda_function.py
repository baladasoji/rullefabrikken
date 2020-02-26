from __future__ import print_function# Python 2/3 compatibility
import boto3
import json
import decimal
import operator
import time
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
    table = dynamodb.Table('RRLiveResult')
    body = get_bodyjson(event)
    '''print (body.get('liveresult'))'''
    curtime = int(time.time())
    response = table.put_item(
       Item={
            'timestamp':curtime,
            'raceinfo': body.get('raceinfo'),
            'liveresult':body.get('liveresult'),
            'juststarted':body.get('juststarted')
            }
    )
    return {
        'statusCode': 200,
        'body': json.dumps('Success')
    }


def get_bodyjson(event):
    body = None
    if event.get('body-json') is not None :
        body=event.get('body-json')
    return body
