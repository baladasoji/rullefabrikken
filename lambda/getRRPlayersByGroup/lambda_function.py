import json

import boto3
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    # TODO implement
    group = get_qp(event,'group')
    if group is not None:
        return players_by_group(group)
    else:
        return {"Items":[]}
    
    
def players_by_group(groupname):
   dynamodb = boto3.resource('dynamodb')
   rrplayersTab = dynamodb.Table('RRPlayers')
   fe = Key('agegroup').eq(groupname)
   rrplayersResponse = rrplayersTab.scan( FilterExpression=fe )
   return rrplayersResponse

def get_qp(event,qp):
    qpid = None
    if event.get('params') is not None :
        qpid=event.get('params').get('querystring').get(qp)
    return qpid