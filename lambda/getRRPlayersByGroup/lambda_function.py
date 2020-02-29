import json
import operator
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    # TODO implement
    group = get_qp(event,'group')
    eventid = get_qp_asinteger(event,'eventid')
    if eventid is None:
        eventid = 0
    retarr =[]
    if group is not None:
        retarr.append({"agegroup":group, "players":players_by_group(group,eventid)})
        return {"Items":retarr}
    else:
        grps=players_groups(eventid)
        for grp in grps:
            retarr.append({"agegroup":grp , "players":players_by_group(grp,eventid)})
        return {"Items":retarr }
    
    
def players_by_group(groupname,eventid):
   dynamodb = boto3.resource('dynamodb')
   rrplayersTab = dynamodb.Table('RRPlayers')
   print ("eventid is" + str(eventid))
   fe = Key('agegroup').eq(groupname) & Key('eventid').eq(eventid)
   rrplayersResponse = rrplayersTab.scan( FilterExpression=fe )
   allitems=rrplayersResponse['Items']
   allitems.sort(key=operator.itemgetter('points'))
   return allitems
   
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
    
def players_groups(eventid):
   dynamodb = boto3.resource('dynamodb')
   rrplayersTab = dynamodb.Table('RRPlayers')
   pe = "agegroup"
   fe = Key('eventid').eq(eventid)
   rrplayersResponse = rrplayersTab.scan(FilterExpression=fe,  ProjectionExpression=pe )
   x=[]
   f=lambda y: y['agegroup']
   x=list(dict.fromkeys([ f(y)  for y in rrplayersResponse['Items'] ]))
   return x