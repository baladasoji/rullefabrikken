//var players;
var liverefreshinterval=sessionStorage.liverefreshinterval!=null ? sessionStorage.liverefreshinterval : 5000;
var timersecs=0;
var resultcols =[
                  {sortable:true,field:'id', title:'#'},
                  {sortable:true,field:'name', title:'Navn'},
                  {sortable:true,field:'laps', title:'Omg'},
                  {sortable:true,field:'agegroup', title:'Aldersgruppe'}
               ];
var ircols = [
                  {field:'position', title:'#'},
                  {field:'number', title:'Start Nr'},
                  {field:'name', title:'Navn'},
                  {field:'laps', title:'Omg'},
                  {field:'totaltime', title:'Brutto tid'},
                  {field:'displayablelaptimes', title:'Omg tider'},
              ];
/*********** Utility Functions in the Beginning *******************/

/* Utility method to get value of a URLParameter
* works both with JS style and standard styles */
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&|#]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [null, ''])[1].replace(/\+/g, '%20')) || null;
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
    livedata[i].displayablelaptimes=[];
    for (j=0 ; j<livedata[i].laptimes.length; j++ )
    {
      if (j==0)
        livedata[i].displayablelaptimes[j]= convertSecondsToTime(livedata[i].laptimes[j]) ;
      else {
        livedata[i].displayablelaptimes[j]= convertSecondsToTime(livedata[i].laptimes[j]-livedata[i].laptimes[j-1]) ;
      }
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
  return ` ${minutes}:${seconds}.${tenths}`;
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
}, liverefreshinterval);
