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
                  {field:'name', title:'Name'},
                  {field:'totaltime', title:'Total time'},
                  {field: 'laps', title:'Laps'},
                  {field:'laptimes', title:'Lap time'},
              ];
/*********** Utility Functions in the Beginning *******************/

/* Utility method to get value of a URLParameter
* works both with JS style and standard styles */
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&|#]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}



function initializeApp(){
  // Write initialization code here
  eventid = getURLParameter("eventid");
  raceid = getURLParameter("raceid");
}

function populateResults(liveresult)
{
  arrWrap = [];
  arrWrap.push(liveresult.raceinfo);
  $('#index').bootstrapTable({columns:resultcols, data:arrWrap});
  $('#index').bootstrapTable('load',arrWrap);
  $('#index').bootstrapTable('refreshOptions',{"theadClasses": "thead-light"});
  livedata=liveresult.liveresult;
  livedata.sort(function(a,b) {
         if ( a.laps == b.laps)
            return a.totaltime - b.totaltime;
         else
            return b.laps - a.laps;
            //return a.totaltime - b.totaltime;
          });
  // Set the position after sorting
  for (i=0 ; i<livedata.length; i++ )
  {
    livedata[i].position=i+1;
    livedata[i].totaltime = convertSecondsToTime (livedata[i].totaltime);
    for (j=0 ; j<livedata[i].laptimes.length; j++ )
    {
      livedata[i].laptimes[j]= convertSecondsToTime(livedata[i].laptimes[j]) ;
    }
  }
  $('#liveres').bootstrapTable({columns:ircols, data:livedata});
  $('#liveres').bootstrapTable('load',livedata);
  $('#liveres').bootstrapTable('refreshOptions',{"theadClasses": "thead-light"});
}

function convertSecondsToTime(t=timersecs) {
  var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((t % (1000 * 60)) / 1000);
  var tenths = Math.floor ((t % 1000)/100) ;
  return `${minutes}:${seconds}.${tenths}`;
}

function apiGetLiveResults()
{
  var apiXMLReq = new XMLHttpRequest();
     apiXMLReq.open("GET", rr_api_url + '/live-results' , true );
  apiXMLReq.send(null);
  apiXMLReq.onload = function () {
      if (apiXMLReq.readyState == 4 && apiXMLReq.status == "200") {
        liveresult = JSON.parse(apiXMLReq.responseText);
        if (liveresult.raceinfo != null)
          populateResults(liveresult);
         // alert('All players checkedout');
      } else {
          console.log('Error in getting live results');
      }
  }
}

var x = setInterval(function() {
  // Get today's date and time
  apiGetLiveResults();
}, 7000);
