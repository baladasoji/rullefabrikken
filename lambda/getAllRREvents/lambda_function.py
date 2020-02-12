from __future__ import print_function# Python 2/3 compatibility
import boto3
import operator
from boto3.dynamodb.conditions import Key, Attr
import logging
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
    table = dynamodb.Table('RREvents')
    eventid = get_qp_asinteger(event,'eventid')
    if eventid is not None:
        response = table.scan(FilterExpression=Attr('id').eq(eventnum))
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
