import csv
import boto3
from boto3.dynamodb.conditions import Key, Attr

def convert_csv_to_json_list(file):
   items = []
   with open(file) as csvfile:
      reader = csv.DictReader(csvfile)
      for row in reader:
          '''print (row)'''
          data = {}
          for k in row.keys():
            if ( k == 'id' or k == 'eventid' or k=='bib' or k=='age' or k=='points'):
               data[k] = int(row[k])
            else:
               data[k] = row[k]
          items.append(data)
   return items

def batch_write(tname,items):
   dynamodb = boto3.resource('dynamodb')
   db = dynamodb.Table(tname)

   with db.batch_writer() as batch:
      for item in items:
         batch.put_item(Item=item)

def count_Table(tname):
   dynamodb = boto3.resource('dynamodb')
   db = dynamodb.Table(tname)
   response = db.scan(FilterExpression=Attr('id').gt(0))
   items = response['Items']
   print((items))

'''
Method to cleanup the tables
First paramenter is the name of the table
Second parameter is the eventid
If eventid is 0 then it cleans up the whole table
Else only the selected events are cleaned
'''
def clean_Table(tname,eventid):
   dynamodb = boto3.resource('dynamodb')
   db = dynamodb.Table(tname)
   if (eventid == 0):
      response = db.scan(FilterExpression=Attr('id').gt(0))
   else:
      response = db.scan(FilterExpression=Attr('id').gt(0) and Attr('eventid').eq(eventid))
   items = response['Items']
   for item in items:
      db.delete_item(Key={'id':item.get('id')})

def load_Table(tname):
   json_data = convert_csv_to_json_list(tname+'.csv')
   print (json_data)
   batch_write(tname,json_data)

def clean_and_reload_RR():
   clean_Table('RREvents',0)
   clean_Table('RRRaces',0)
   clean_Table('RRPlayers',0)
   ''' Not sure if we should clean the results
   clean_Table('RRResults',0)
   '''
   load_Table('RREvents')
   load_Table('RRRaces')
   load_Table('RRPlayers')
   
def my_test():
   dynamodb = boto3.resource('dynamodb')
   db = dynamodb.Table('RRRaces')
   response = db.query(KeyConditionExpression=Key('id').eq(1))
   print (len(response['Items']))
   print (response['Items'][0].get('eventid'))
   print (response['Items'][0].get('agegroup'))
   
def update_race_status(raceid, stat):
  client = boto3.resource('dynamodb')
  db = client.Table("RRRaces")
  db.update_item(Key= { "id":raceid }, UpdateExpression= 'SET #stat = :label', ExpressionAttributeNames= {"#stat" : "status"},  ExpressionAttributeValues= { ":label": stat } )
  
 
def cleanup_Event(eventid):
   clean_Table('RRRaces',eventid)
   clean_Table('RRPlayers',eventid)

def players_by_group(groupname):
   dynamodb = boto3.resource('dynamodb')
   rrplayersTab = dynamodb.Table('RRPlayers')
   fe = Key('agegroup').eq(groupname)
   rrplayersResponse = rrplayersTab.scan( FilterExpression=fe )
   print rrplayersResponse['Items']


def players_groups():
   dynamodb = boto3.resource('dynamodb')
   rrplayersTab = dynamodb.Table('RRPlayers')
   pe = "agegroup"
   rrplayersResponse = rrplayersTab.scan( ProjectionExpression=pe )
   x=[]
   f=lambda y: y['agegroup']
   x=list(dict.fromkeys([ f(y)  for y in rrplayersResponse['Items'] ]))
   return {'Items' : x}


def reset_points():
   dynamodb = boto3.resource('dynamodb')
   rrplayersTab = dynamodb.Table('RRPlayers')
   rrplayersResponse = rrplayersTab.scan( ProjectionExpression='#k,#s', ExpressionAttributeNames={ '#k' : 'id', '#s' : 'sortkey' })
   for item in rrplayersResponse['Items']:
    rrplayersTab.update_item(Key=item, UpdateExpression= 'SET #pnt = :point', ExpressionAttributeNames= {"#pnt" : "points"},  ExpressionAttributeValues= { ":point": 0 } )

def update_results(eventid):
   dynamodb = boto3.resource('dynamodb')
   rrresultsTab = dynamodb.Table('RRResults')
   rrresultsResponse = rrresultsTab.scan()
   results = rrresultsResponse['Items']
   rrplayersTab = dynamodb.Table('RRPlayers')
   rrplayersResponse = rrplayersTab.scan()
   players = rrplayersResponse['Items']
   pdict={}
   for i in players:
    pdict[i.get('id')]=0
   for r in results:
    res=r['result']
    for rr in res:
        pdict[rr.get('playerid')]+= rr.get('points')
   for i in players:
     rrplayersTab.update_item(Key={'id':i['id'] }, UpdateExpression= 'SET #pnt = :point', ExpressionAttributeNames= {"#pnt" : "points"},  ExpressionAttributeValues= { ":point": pdict.get(i['id']) } )

if __name__ == '__main__':
   print players_groups()
   '''
   players_by_group('maxi')
   reset_points()
   update_results(1)
   clean_and_reload_RR()
   update_race_status(2,'finished')
   count_Table('RRPlayers')
   cleanup_Event(1);
   my_test()
   '''
