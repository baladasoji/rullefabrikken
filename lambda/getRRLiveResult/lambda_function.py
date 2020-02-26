from __future__ import print_function # Python 2/3 compatibility
from boto3.dynamodb.conditions import Key, Attr
from operator import itemgetter
import boto3
import bisect

def lambda_handler(event, context):
    # TODO implement
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
    table = dynamodb.Table('RRLiveResult')
    response=table.scan()
    items =response['Items']
    items.sort(key=itemgetter('timestamp'), reverse=True)
    if (len(items) > 0):
        return items[0]
    else:
        return '{}'
