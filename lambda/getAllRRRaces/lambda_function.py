from __future__ import print_function# Python 2/3 compatibility
import boto3
import json
import decimal
import operator
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
    table = dynamodb.Table('RRRaces')
    response = table.scan( Select = 'ALL_ATTRIBUTES', Limit = 50)
    allitems = response['Items']
    allitems.sort(key=operator.itemgetter('id'))
    return allitems;