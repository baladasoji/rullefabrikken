//var players;
var raceid=0;
var eventcols = [ {sortable:false,field:'id', title:'ID'},
                  {sortable:false,field:'Club', title:'Klub'},
                  {sortable:false,field:'Location', title:'By'},
                  {sortable:false,field:'Event Name', title:'Navn'},
                  {sortable:false,field:'Date', title:'Dato'} ];

var racecols =[
                  {sortable:false,field:'id', title:'#'},
                  {sortable:false,field:'agegroup', title:'Group'},
                  {sortable:false,field:'laps', title:'Omg'},
                  {sortable:false,field:'name', title:'Navn'},
                  {sortable:false,field:'racetype', title:'Type'},
                  {sortable:false,field:'starttime', title:'Kl'},
                  {sortable:false,field:'status', title:'Status'}
               ];
var playercols= [
                  {sortable:true,field:'bib', title:'Start #'},
                  {sortable:false,field:'firstname', title:'Fornavn'},
                  {sortable:false,field:'lastname', title:'Efternavn'},
                  {sortable:false,field:'club', title:'Klub'},
                  {sortable:true,field:'agegroup', title:'Gruppe'},
                  {sortable:true,field:'age', title:'Alder'},
                  {sortable:false,field:'sex', title:'Kon'}
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
          $('#rrraces').bootstrapTable({columns:racecols, data:racedata , rowStyle: function rowStyle(row, index) {
                                                                          if(row.status == "finished"){
                                                                            return {classes : "text-light bg-secondary" };
                                                                           }
                                                                          else if (row.status == "in progress") {
                                                                            return {classes : "text-light bg-primary" };
                                                                          }
                                                                          return {};}
                                                                        });
          $('#rrraces').bootstrapTable('load',racedata);
          $('#rrraces').on('click-row.bs.table', function (e, row, $element) {
              raceid=row.id;
              getPlayers(true);
          });
           // alert('All players checkedout');
        } else {
            alert('Error in getRaces');
        }
    }
}

function getPlayers(scroll=false)
{
    $('#rrplayers').bootstrapTable('removeAll');
    var apiXMLReq = new XMLHttpRequest();
    if (raceid == 0)
       apiXMLReq.open("GET", rr_api_url + '/players?eventid='+eventid , true );
    else
       apiXMLReq.open("GET", rr_api_url + '/players?raceid='+raceid , true );

 //   apiXMLReq.setRequestHeader("x-api-key","s8Acz0z7Ix2z8t20xyPZu5pQ4WAa2EQ13yFRpUBu");
    apiXMLReq.send(null);
    apiXMLReq.onload = function () {
        if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
          playerdata = JSON.parse(apiXMLReq.responseText);
          $('#rrplayers').bootstrapTable({columns:playercols, data:playerdata});
          $('#rrplayers').bootstrapTable('load',playerdata);
          if (scroll)
            document.getElementById("eop").scrollIntoView({behavior: "smooth"});
           // alert('All players checkedout');
        } else {
            alert('Error in getEvents');
        }
    }
}
function loadTables()
{
   //getEvents();
   getRaces();
   getPlayers();
}
