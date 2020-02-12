from __future__ import print_function# Python 2/3 compatibility
import boto3
import operator
from boto3.dynamodb.conditions import Key, Attr
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
    table = dynamodb.Table('RRPlayers')
    ''' We handle the case for filtering'''
    eventid = get_eventid(event)
    if eventid is not None:
        response = table.scan(FilterExpression=Attr('eventid').eq(eventid))
    else :
        response = table.scan(FilterExpression=Attr('id').gt(0))
    allitems = response['Items']
    '''allitems.sort(key=operator.itemgetter('firstname'))'''
    return allitems;


''' Returns an evenid in integer form '''
def get_eventid(event):
    eventid = None
    eventnum = None
    if event.get('params') is not None :
        eventid=event.get('params').get('querystring').get('eventid')
        logger.debug(eventid)
    if eventid is not None:
        eventnum = int(eventid)
    return eventnum

