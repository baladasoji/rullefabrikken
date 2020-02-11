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
            if ( k == 'id'):
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

def clean_Table(tname):
   dynamodb = boto3.resource('dynamodb')
   db = dynamodb.Table(tname)
   response = db.scan(FilterExpression=Attr('id').gt(0))
   items = response['Items']
   for item in items:
      db.delete_item(Key={'id':item.get('id')})

def load_Table(tname):
   json_data = convert_csv_to_json_list(tname+'.csv')
   print (json_data)
   batch_write(tname,json_data)

def clean_and_reload_RR():
   clean_Table('RREvents')
   clean_Table('RRRaces')
   clean_Table('RRPlayers')
   ''' Not sure if we should clean the results
   clean_Table('RRResults')
   '''
   load_Table('RREvents')
   load_Table('RRRaces')
   load_Table('RRPlayers')
    

if __name__ == '__main__':
   clean_and_reload_RR()
