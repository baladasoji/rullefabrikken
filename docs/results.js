var rr_api_url="https://cqvn88ysje.execute-api.eu-west-1.amazonaws.com/test"
var raceid=1;
var eventid=1;
//var players;
var timersecs=0;
var api_timeout=2500;
var resultcols =[
                  {sortable:true,field:'raceid', title:'ID'},
                  {sortable:true,field:'agegroup', title:'Age Group'},
                  {sortable:true,field:'eventid', title:'Event ID'},
                  {sortable:true,field:'laps', title:'Laps'},
                  {sortable:true,field:'racename', title:'Name'}
               ];
var ircols = [
                  {field:'position', title:'#'},
                  {field:'number', title:'Start Nr'},
                  {field:'laptimes', title:'Lap time'},
                  {field:'lapstatus', title:'Status '},
                  {field:'displayabletime', title:'Total time'},
                  {field:'name', title:'Name'},
                  {field: 'laps', title:'Laps'},
                  {field:'points', title:'Points'}
              ];
/*********** Utility Functions in the Beginning *******************/

/* Utility method to get value of a URLParameter
* works both with JS style and standard styles */
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&|#]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}


async function logSha1( str ) {
  const buffer = new TextEncoder( 'utf-8' ).encode( str );
  const digest = await crypto.subtle.digest('SHA-1', buffer);

  // Convert digest to hex string
  const result = Array.from(new Uint8Array(digest)).map( x => x.toString(16).padStart(2,'0') ).join('');

  console.log( result );
}

function initializeApp(){
  // Write initialization code here
  eventid = getURLParameter("eventid");
  raceid = getURLParameter("raceid");
}

function populateResults(allresults)
{
  $('#index').bootstrapTable({columns:resultcols, data:allresults});
  $('#index').bootstrapTable('load',allresults);
  allresults.forEach(r => { displayResultTable(r.raceid,r.result);});
}

function displayResultTable(id,result)
{
  logSha1('rr1501');
  tab = document.createElement("table");
  tab.id = "res"+id;
  document.getElementById("allresults").appendChild(tab);
  $('#'+'res'+id).bootstrapTable({columns:ircols, data:result});
  $('#'+'res'+id).bootstrapTable('load',result);
}

function apiGetResults()
{
  var apiXMLReq = new XMLHttpRequest();
     apiXMLReq.open("GET", rr_api_url + '/results' , true );
  apiXMLReq.send(null);
  apiXMLReq.onload = function () {
      if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
        allresults = JSON.parse(apiXMLReq.responseText);
         // alert('All players checkedout');
      } else {
          alert('Error in Save Results');
      }
  }
  setTimeout(function(){
       populateResults(allresults);
  }, api_timeout);


}
