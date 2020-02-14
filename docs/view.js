var rr_api_url="https://cqvn88ysje.execute-api.eu-west-1.amazonaws.com/test"
//var players;
var eventid=0;
var raceid=0;
var eventcols = [ {sortable:true,field:'id', title:'ID'}, 
                  {sortable:true,field:'Club', title:'Organizing Club'}, 
                  {sortable:true,field:'Location', title:'City'}, 
                  {sortable:true,field:'Event Name', title:'Name'},
                  {sortable:true,field:'Date', title:'Date'} ]; 
	
var racecols =[
                  {sortable:true,field:'id', title:'ID'}, 
                  {sortable:true,field:'agegroup', title:'Age Group'}, 
                  {sortable:true,field:'eventid', title:'Event ID'}, 
                  {sortable:true,field:'laps', title:'Laps'}, 
                  {sortable:true,field:'name', title:'Name'}, 
                  {sortable:true,field:'racetype', title:'Race Type'}, 
                  {sortable:true,field:'sex', title:'Sex'}, 
                  {sortable:true,field:'starttime', title:'Start Time'}, 
                  {sortable:true,field:'status', title:'Status'} 
               ];
var playercols= [
                  {sortable:true,field:'id', title:'ID'}, 
                  {sortable:true,field:'bib', title:'Start Number'}, 
                  {sortable:true,field:'firstname', title:'Fornavn'}, 
                  {sortable:true,field:'lastname', title:'Efternavn'}, 
                  {sortable:true,field:'agegroup', title:'Age Group'}, 
                  {sortable:true,field:'age', title:'Age'}, 
                  {sortable:true,field:'dateofbirth', title:'Fødselsdato'}, 
                  {sortable:true,field:'eventid', title:'Event ID'}, 
                  {sortable:true,field:'sex', title:'Kon'} 
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
        $('#rrevents').bootstrapTable({ columns:eventcols, data:eventdata });
         $('#rrevents').on('click-row.bs.table', function (e, row, $element) {
            eventid=row.id;         
            getRaces();
          })
    }, 1500);
}

function getRaces()
{
    var apiXMLReq = new XMLHttpRequest();
    if (eventid == 0)
      apiXMLReq.open("GET", rr_api_url + '/races' , true );
    else
      apiXMLReq.open("GET", rr_api_url + '/races?eventid='+eventid , true );
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
        $('#rrraces').bootstrapTable('load',racedata);
         $('#rrraces').on('click-row.bs.table', function (e, row, $element) {
            raceid=row.id;         
            getPlayers();
         $('#rrraces').on('click-cell.bs.table', function (field, value, row, $element) {
            raceid=row.id;         
            getPlayers();
         document.getElementById("rrplayers").scrollIntoView();
          })
    }, 1500);
}

function getPlayers()
{
    $('#rrplayers').bootstrapTable('removeAll');
    var apiXMLReq = new XMLHttpRequest();
    if (raceid == 0)
       apiXMLReq.open("GET", rr_api_url + '/players' , true );
    else
       apiXMLReq.open("GET", rr_api_url + '/players?raceid='+raceid , true );

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
        $('#rrplayers').bootstrapTable('load',playerdata);
 //        alert(playerdata);
    }, 1500);
}
function loadTables()
{
   getEvents();
   getRaces();
   getPlayers();
}
