from __future__ import print_function# Python 2/3 compatibility
import boto3
import json
import decimal
import operator
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
    table = dynamodb.Table('RRRaces')
    eventid = get_qp_asinteger(event,'eventid')
    raceid = get_qp_asinteger(event,'raceid')
    if raceid is not None:
        response = table.query(KeyConditionExpression=Key('id').eq(raceid))
    elif eventid is not None :
        response = table.scan(FilterExpression=Attr('eventid').eq(eventid))
    else :
        response = table.scan(FilterExpression=Attr('id').gt(0))
    allitems = response['Items']
    allitems.sort(key=operator.itemgetter('id'))
    return allitems;
    
def get_qp_asinteger(event,qp):
    qpid = None
    qpnum = None
    if event.get('params') is not None :
        qpid=event.get('params').get('querystring').get(qp)
    if qpid is not None:
        qpnum = int(qpid)
    return qpnum

def get_qp(event,qp):
    qpid = None
    if event.get('params') is not None :
        qpid=event.get('params').get('querystring').get(qp)
    return qpid
''' Returns an evenid in integer form '''