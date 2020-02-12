from __future__ import print_function# Python 2/3 compatibility
import boto3
import operator
from boto3.dynamodb.conditions import Key, Attr
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
    table = dynamodb.Table('RREvents')
    eventid = None
    if event.get('params') is not None :
        eventid=event.get('params').get('querystring').get('eventid')
        logger.debug(eventid)
    ''' We handle the case for filtering'''
    if eventid is not None:
        eventnum = int(eventid)
        logger.debug("event num is "+ str(eventnum))
        response = table.scan(FilterExpression=Attr('id').eq(eventnum))
    else :
        response = table.scan(FilterExpression=Attr('id').gt(0))
    allitems = response['Items']
    '''allitems.sort(key=operator.itemgetter('firstname'))'''
    return allitems;
