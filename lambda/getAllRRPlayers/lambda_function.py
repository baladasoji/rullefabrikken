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
    eventid = get_qp_asinteger(event,'eventid')
    raceid = get_qp_asinteger(event,'raceid')
    if raceid is not None:
        racetable = dynamodb.Table('RRRaces')
        response = racetable.query(KeyConditionExpression=Key('id').eq(raceid))
        if (len(response['Items']) == 1):
            eventid = response['Items'][0].get('eventid')
            agegroup = response['Items'][0].get('agegroup')
            logger.info ("Eventid from races is "+str(eventid))
            logger.info ("agegroup from races is "+agegroup)
            if (eventid is not None and agegroup is not None) :
                response = table.scan(FilterExpression= (Attr('eventid').eq(eventid) & Attr('agegroup').eq(agegroup)))
            else :
                ''' Try to find a case which is never satisfied to return empty response '''
                response = table.scan(FilterExpression=Attr('eventid').gt(1000))
        else :
            ''' Try to find a case which is never satisfied to return empty response '''
            response = table.scan(FilterExpression=Attr('eventid').gt(1000))
    elif eventid is not None :
        response = table.scan(FilterExpression=Attr('eventid').eq(eventid))
    else :
        response = table.scan(FilterExpression=Attr('id').gt(0))
    allitems = response['Items']
    allitems.sort(key=operator.itemgetter('bib'))
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
