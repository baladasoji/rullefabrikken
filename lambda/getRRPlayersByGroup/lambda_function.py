import json
import operator
import boto3
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
    # TODO implement
    group = get_qp(event,'group')
    retarr =[]
    if group is not None:
        retarr.append({"agegroup":group, "players":players_by_group(group)})
        return {"Items":retarr}
    else:
        grps=players_groups()
        for grp in grps:
            retarr.append({"agegroup":grp , "players":players_by_group(grp)})
        return {"Items":retarr }
    
    
def players_by_group(groupname):
   dynamodb = boto3.resource('dynamodb')
   rrplayersTab = dynamodb.Table('RRPlayers')
   fe = Key('agegroup').eq(groupname)
   rrplayersResponse = rrplayersTab.scan( FilterExpression=fe )
   allitems=rrplayersResponse['Items']
   allitems.sort(key=operator.itemgetter('points'))
   return allitems

def get_qp(event,qp):
    qpid = None
    if event.get('params') is not None :
        qpid=event.get('params').get('querystring').get(qp)
    return qpid
    
def players_groups():
   dynamodb = boto3.resource('dynamodb')
   rrplayersTab = dynamodb.Table('RRPlayers')
   pe = "agegroup"
   rrplayersResponse = rrplayersTab.scan( ProjectionExpression=pe )
   x=[]
   f=lambda y: y['agegroup']
   x=list(dict.fromkeys([ f(y)  for y in rrplayersResponse['Items'] ]))
   return x