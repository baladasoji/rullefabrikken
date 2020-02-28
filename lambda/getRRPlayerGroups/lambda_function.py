import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    # TODO implement
    return players_groups()

def players_by_group(groupname):
   dynamodb = boto3.resource('dynamodb')
   rrplayersTab = dynamodb.Table('RRPlayers')
   fe = Key('agegroup').eq(groupname)
   rrplayersResponse = rrplayersTab.scan( FilterExpression=fe )
   print (rrplayersResponse['Items'])

def players_groups():
   dynamodb = boto3.resource('dynamodb')
   rrplayersTab = dynamodb.Table('RRPlayers')
   pe = "agegroup"
   rrplayersResponse = rrplayersTab.scan( ProjectionExpression=pe )
   x=[]
   f=lambda y: y['agegroup']
   x=list(dict.fromkeys([ f(y)  for y in rrplayersResponse['Items'] ]))
   return {'Items' : x}
