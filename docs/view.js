var rr_api_url="https://cqvn88ysje.execute-api.eu-west-1.amazonaws.com/test"
//var players;
var eventid;
var raceid;
var eventcols = [ {field:'id', title:'ID'}, 
                  {field:'Club', title:'Organizing Club'}, 
                  {field:'Location', title:'City'}, 
                  {field:'Event Name', title:'Name'},
                  {field:'Date', title:'Date'} ]; 
	
var racecols =[
                  {field:'id', title:'ID'}, 
                  {field:'agegroup', title:'Age Group'}, 
                  {field:'eventid', title:'Event ID'}, 
                  {field:'laps', title:'Laps'}, 
                  {field:'name', title:'Name'}, 
                  {field:'racetype', title:'Race Type'}, 
                  {field:'sex', title:'Sex'}, 
                  {field:'starttime', title:'Start Time'}, 
                  {field:'status', title:'Status'} 
               ];
var playercols= [
                  {field:'id', title:'ID'}, 
                  {field:'bib', title:'Start Number'}, 
                  {field:'firstname', title:'Fornavn'}, 
                  {field:'lastname', title:'Efternavn'}, 
                  {field:'agegroup', title:'Age Group'}, 
                  {field:'age', title:'Age'}, 
                  {field:'dateofbirth', title:'Fødselsdato'}, 
                  {field:'eventid', title:'Event ID'}, 
                  {field:'sex', title:'Kon'} 
               ];

var eventdata;
var racedata;
var playerdata;

function getEvents()
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.open("GET", rr_api_url + '/events' , true );
 //   apiXMLReq.setRequestHeader("x-api-key","s8Acz0z7Ix2z8t20xyPZu5pQ4WAa2EQ13yFRpUBu");
    apiXMLReq.send(null);
    apiXMLReq.onload = function () {
        if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
          eventdata = JSON.parse(apiXMLReq.responseText);
           // alert('All players checkedout');
        } else {
            alert('Error in getEvents');
        }
    }
    setTimeout(function(){
        $('#rrevents').bootstrapTable({columns:eventcols, data:eventdata});
    }, 1500);
}

function getRaces()
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.open("GET", rr_api_url + '/races' , true );
 //   apiXMLReq.setRequestHeader("x-api-key","s8Acz0z7Ix2z8t20xyPZu5pQ4WAa2EQ13yFRpUBu");
    apiXMLReq.send(null);
    apiXMLReq.onload = function () {
        if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
          racedata = JSON.parse(apiXMLReq.responseText);
           // alert('All players checkedout');
        } else {
            alert('Error in getEvents');
        }
    }
    setTimeout(function(){
        $('#rrraces').bootstrapTable({columns:racecols, data:racedata});
    }, 1500);
}

function getPlayers()
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.open("GET", rr_api_url + '/players' , true );
 //   apiXMLReq.setRequestHeader("x-api-key","s8Acz0z7Ix2z8t20xyPZu5pQ4WAa2EQ13yFRpUBu");
    apiXMLReq.send(null);
    apiXMLReq.onload = function () {
        if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
          playerdata = JSON.parse(apiXMLReq.responseText);
           // alert('All players checkedout');
        } else {
            alert('Error in getEvents');
        }
    }
    setTimeout(function(){
        $('#rrplayers').bootstrapTable({columns:playercols, data:playerdata});
    }, 1500);
}
function loadTables()
{
   getEvents();
   getRaces();
   getPlayers();
}
